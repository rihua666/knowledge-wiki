#s01-独立的Agent loop

⏺ 这是一个基于 Claude API 的 Agent 循环，核心逻辑是：不断调用模型 → 模型决定是否使用工具（执行 bash 命令）→ 将结果返回模型 → 直到模型给出最终回复。

  下面是加完注释的完整代码：

  def agent_loop(query):
      """
      Agent 主循环：接收用户查询，反复调用 Claude API，
      直到模型不再请求调用工具为止。

      流程：用户输入 → 调用模型 → 模型想用工具？→ 执行工具 → 结果返回模型 → 重复
      """

      # 初始化消息列表，第一条是用户的消息
      messages = [{"role": "user", "content": query}]

      while True:
          # 调用 Claude API，传入：
          # - model: 模型名称
          # - system: 系统提示词
          # - messages: 对话历史
          # - tools: 可用工具定义（让模型知道能调用哪些工具）
          # - max_tokens: 单次回复最大 token 数
          response = client.messages.create(
              model=MODEL,
              system=SYSTEM,
              messages=messages,
              tools=TOOLS,
              max_tokens=8000,
          )

          # 将模型的回复追加到对话历史中
          # response.content 是一个列表，可能包含 text 和 tool_use 两种 block
          messages.append({"role": "assistant", "content": response.content})

          # 如果模型不是因为要调用工具而停止的（即 stop_reason 是 "end_turn"），
          # 说明模型已经给出最终回复，循环结束
          if response.stop_reason != "tool_use":
              return

          # 模型请求调用工具，开始收集所有工具调用的结果
          results = []
          for block in response.content:
              if block.type == "tool_use":
                  # 执行 bash 命令，获取输出
                  output = run_bash(block.input["command"])
                  # 将结果封装为 tool_result 格式，tool_use_id 用于匹配请求和响应
                  results.append({
                      "type": "tool_result",
                      "tool_use_id": block.id,
                      "content": output,
                  })

          # 将所有工具执行结果追加到对话历史，角色为 "user"
          # 这样下一轮循环时，模型就能看到工具的执行结果并继续处理
          messages.append({"role": "user", "content": results})

  关键概念解释：

  ┌──────────────────┬───────────────────────────────────────────────────────────────────────────────────────────┐
  │       概念       │                                           说明                                            │
  ├──────────────────┼───────────────────────────────────────────────────────────────────────────────────────────┤
  │ stop_reason      │ 模型停止生成的原因。"tool_use" 表示模型想调用工具；"end_turn" 表示回复完毕                │
  ├──────────────────┼───────────────────────────────────────────────────────────────────────────────────────────┤
  │ response.content │ 是一个列表，一次回复可能包含多个 block（文本 + 工具调用混合）                             │
  ├──────────────────┼───────────────────────────────────────────────────────────────────────────────────────────┤
  │ tool_use_id      │ 每个工具调用有唯一 ID，tool_result 必须用相同 ID 匹配，这样模型才知道哪个结果对应哪个调用 │
  ├──────────────────┼───────────────────────────────────────────────────────────────────────────────────────────┤
  │ role: "user"     │ 工具结果以 user 角色发送，因为从模型视角看，这是"外部世界"给它的新信息                    │
  └──────────────────┴───────────────────────────────────────────────────────────────────────────────────────────┘

  循环流程图：

  用户 query
    ↓
  调用 Claude API
    ↓
  stop_reason == "tool_use"?
    ├── 是 → 执行 bash 命令 → 结果追加到 messages → 回到"调用 Claude API"
    └── 否 → return（最终回复）

  本质上这就是 Claude Code 这类工具的简化核心——一个自主循环的 Agent，能反复调用工具直到完成任务。

##s02-工具
⏺ 这段代码在上一节的 agent loop 基础上，加了一个工具调度层：路径沙箱 + 多工具处理函数 + dispatch map。

⏺ 核心设计：把「工具定义」和「工具执行」解耦——
- 每个工具有一个处理函数（handler）
- 一个分发字典（TOOL_HANDLERS）把工具名映射到对应函数
- 循环体本身不关心具体工具，只做查表+调用

⏺ 核心思想是 "加工具 = 加 handler + 加 schema，循环永远不变"。

  下面是完整加注释的代码：

  # ============================================================
  # 工具处理函数
  # ============================================================

  def safe_path(p: str) -> Path:
      """
      路径沙箱：将用户传入的相对路径解析为绝对路径，
      并确保它不会逃逸出工作区目录。

      防止类似 "../../etc/passwd" 的路径遍历攻击。
      """
      # 1. 将相对路径拼接到工作目录下，再 resolve() 得到绝对路径
      #    例如 WORKDIR="/sandbox", p="../etc/passwd"
      #    → resolve 后变成 "/etc/passwd"
      path = (WORKDIR / p).resolve()

      # 2. 检查解析后的路径是否仍在工作目录内
      #    如果不在，说明路径试图逃逸，直接拒绝
      if not path.is_relative_to(WORKDIR):
          raise ValueError(f"Path escapes workspace: {p}")

      return path


  def run_read(path: str, limit: int = None) -> str:
      """
      读取文件内容，支持限制行数，输出截断到 50000 字符。
      """
      # 先经过沙箱检查，再读取文件全文
      text = safe_path(path).read_text()

      # 按行切分，方便做行数限制
      lines = text.splitlines()

      # 如果指定了 limit 且文件行数超过 limit，只取前 limit 行
      if limit and limit < len(lines):
          lines = lines[:limit]

      # 将行重新拼接，并截断到 50000 字符（防止输出过大撑爆上下文）
      return "\n".join(lines)[:50000]


  # run_write 和 run_edit 的实现省略，结构类似：
  # - 先 safe_path() 做沙箱检查
  # - 再执行写/编辑操作
  # （用户贴的代码中未给出这两个函数的完整实现）


  # ============================================================
  # 工具调度表（Dispatch Map）
  # ============================================================

  # 将工具名字符串映射到对应的处理函数
  # 每个 handler 接收 **kw（即工具调用的 input 参数），返回字符串结果
  TOOL_HANDLERS = {
      "bash":       lambda **kw: run_bash(kw["command"]),
      "read_file":  lambda **kw: run_read(kw["path"], kw.get("limit")),
      "write_file": lambda **kw: run_write(kw["path"], kw["content"]),
      "edit_file":  lambda **kw: run_edit(kw["path"], kw["old_text"],
                                          kw["new_text"]),
  }


  # ============================================================
  # Agent 循环体（与 s01 结构完全一致，只改了工具调用部分）
  # ============================================================

  # 遍历模型回复中的每一个 block
  for block in response.content:
      if block.type == "tool_use":
          # 按工具名查找对应的处理函数
          handler = TOOL_HANDLERS.get(block.name)

          # 找到了就调用，把 input 参数解包传给 handler
          # 找不到就返回错误提示
          output = handler(**block.input) if handler \
              else f"Unknown tool: {block.name}"

          # 封装为 tool_result，id 必须与请求匹配
          results.append({
              "type": "tool_result",
              "tool_use_id": block.id,
              "content": output,
          })

  与上一节的核心区别：

  ┌──────────────┬───────────────────────────────┬─────────────────────────────┐
  │     对比     │         s01（上一节）         │         s02（本节）         │
  ├──────────────┼───────────────────────────────┼─────────────────────────────┤
  │ 工具数量     │ 只有 bash                     │ bash + read + write + edit  │
  ├──────────────┼───────────────────────────────┼─────────────────────────────┤
  │ 工具调用方式 │ 硬编码 block.input["command"] │ 通过 TOOL_HANDLERS 按名查找 │
  ├──────────────┼───────────────────────────────┼─────────────────────────────┤
  │ 安全性       │ 无路径检查                    │ safe_path 防路径逃逸        │
  ├──────────────┼───────────────────────────────┼─────────────────────────────┤
  │ 扩展方式     │ 改循环代码                    │ 只需加 handler + schema     │
  └──────────────┴───────────────────────────────┴─────────────────────────────┘

  架构要点：

  模型请求调用工具 (block.name, block.input)
          ↓
  TOOL_HANDLERS[block.name]  ← 按名查找处理函数
          ↓
  handler(**block.input)      ← 解包参数，执行函数
          ↓
  tool_result 返回给模型

  safe_path 防御原理：

  WORKDIR = "/sandbox/workspace"

  请求: "main.py"         → resolve → "/sandbox/workspace/main.py"       ✅ 在工作区内
  请求: "../../etc/passwd" → resolve → "/etc/passwd"                     ❌ 逃逸了，拒绝

  一句话总结：加工具不需要改循环，只需要：① 写 handler 函数 ② 在 TOOL_HANDLERS 注册 ③ 在 TOOLS schema 里声明。 循环体永远不变。


##s03-todo规划
⏺ 以下是加完注释的代码及与 s02 的对比：

  # ============================================================
  # TodoManager：带状态的 TODO 规划层
  # ============================================================

  class TodoManager:
      """
      管理任务列表，核心约束：同一时间只能有一个任务处于 in_progress 状态。
      这强制模型"一次只做一件事"，避免并行导致的混乱。
      """

      def update(self, items: list) -> str:
          """
          接收模型提交的完整任务列表，校验后替换内部状态。

          模型每次调用 todo 工具时，必须提交【整个】任务列表（不只是增量），
          相当于对计划做一次 full replace。
          """
          validated = []      # 校验后的任务列表
          in_progress_count = 0  # 统计有多少个任务正在执行中

          for item in items:
              status = item.get("status", "pending")  # 默认状态为 pending

              # 统计 in_progress 的数量
              if status == "in_progress":
                  in_progress_count += 1

              # 只保留必要字段，丢弃多余内容（防注入、减小上下文）
              validated.append({
                  "id": item["id"],
                  "text": item["text"],
                  "status": status,
              })

          # 核心约束：不允许超过 1 个 in_progress
          # 如果模型试图同时推进多个任务，直接报错，强制它顺序聚焦
          if in_progress_count > 1:
              raise ValueError("Only one task can be in_progress")

          # 校验通过，替换内部状态
          self.items = validated

          # 返回渲染后的任务列表，作为工具结果展示给模型
          return self.render()


  # ============================================================
  # 注册到工具调度表
  # ============================================================

  TOOL_HANDLERS = {
      # ...s02 的基础工具保留...
      "bash":       lambda **kw: run_bash(kw["command"]),
      "read_file":  lambda **kw: run_read(kw["path"], kw.get("limit")),
      "write_file": lambda **kw: run_write(kw["path"], kw["content"]),
      "edit_file":  lambda **kw: run_edit(kw["path"], kw["old_text"],
                                          kw["new_text"]),

      # 新增：todo 工具，模型通过它来规划和更新任务状态
      "todo": lambda **kw: TODO.update(kw["items"]),
  }


  # ============================================================
  # Nag Reminder：问责提醒机制
  # ============================================================

  # 在循环中，每轮检查模型是否调用了 todo 工具
  # 如果连续 3 轮以上没调用，就在下一条消息里注入提醒

  if rounds_since_todo >= 3 and messages:
      last = messages[-1]

      # 确认最后一条是 user 角色的工具结果消息
      # （工具结果以 user 角色发送，模型下一轮会看到）
      if last["role"] == "user" and isinstance(last.get("content"), list):
          # 在内容列表的最前面插入一段提醒文本
          # insert(0, ...) 确保提醒出现在工具结果之前，模型第一眼就能看到
          last["content"].insert(0, {
              "type": "text",
              "text": "<reminder>Update your todos.</reminder>",
          })

  ---
  与 s02 的核心差别：

  ┌──────────┬──────────────────────────┬────────────────────────────────────────────────────┐
  │   对比   │           s02            │                        s03                         │
  ├──────────┼──────────────────────────┼────────────────────────────────────────────────────┤
  │ 任务管理 │ 无，模型自己记住在做什么 │ TodoManager 强制显式规划                           │
  ├──────────┼──────────────────────────┼────────────────────────────────────────────────────┤
  │ 执行模式 │ 模型自由发挥，可能跑偏   │ "先规划再执行"，每步有状态追踪                     │
  ├──────────┼──────────────────────────┼────────────────────────────────────────────────────┤
  │ 并发约束 │ 无                       │ 同一时间只能 1 个 in_progress，强制串行聚焦        │
  ├──────────┼──────────────────────────┼────────────────────────────────────────────────────┤
  │ 问责机制 │ 无                       │ nag reminder：3 轮不更新计划就催促                 │
  ├──────────┼──────────────────────────┼────────────────────────────────────────────────────┤
  │ 工具注册 │ 4 个工具                 │ 5 个工具（加了 todo）                              │
  ├──────────┼──────────────────────────┼────────────────────────────────────────────────────┤
  │ 循环体   │ 不变                     │ 基本不变，只加了 rounds_since_todo 计数和 nag 注入 │
  └──────────┴──────────────────────────┴────────────────────────────────────────────────────┘

  两个关键设计意图：

  1. "只允许一个 in_progress" — 强制模型把复杂任务拆成串行步骤，做完一个再开始下一个，避免"同时开五个任务都做一半"。
  2. nag reminder — 解决"模型忘了更新计划"的问题。连续 3 轮没用 todo 工具，系统就把 <reminder>Update your todos.</reminder>
  塞进下一条消息里，制造持续的问责压力。本质上就是：你不主动汇报，系统就追着你问。

  执行流程对比：

  s02:  用户提问 → 模型直接开始干活 → 用工具 → 用工具 → ... → 回复
                （无计划，容易跑偏或遗漏步骤）

  s03:  用户提问 → 模型先调用 todo 制定计划 → 逐个执行 → 每完成一步更新 todo → 回复
                （有计划、有追踪、有催促）


##s04-子Agent

⏺ 以下是加完注释的完整代码及与 s03 的对比：

  # ============================================================
  # 工具定义：父智能体 vs 子智能体
  # ============================================================

  # 子智能体的工具集：只有基础工具（bash, read, write, edit, todo）
  # 关键：不包含 task 工具，防止子智能体再生成子智能体（禁止递归）
  CHILD_TOOLS = [
      # bash, read_file, write_file, edit_file, todo ...
  ]

  # 父智能体的工具集 = 子智能体的全部工具 + task 工具
  # 只有父智能体有权限派生子任务
  PARENT_TOOLS = CHILD_TOOLS + [
      {
          "name": "task",
          "description": "Spawn a subagent with fresh context.",
          "input_schema": {
              "type": "object",
              "properties": {
                  "prompt": {"type": "string"},
              },
              "required": ["prompt"],
          },
      },
  ]


  # ============================================================
  # 子智能体执行函数
  # ============================================================

  def run_subagent(prompt: str) -> str:
      """
      启动一个拥有【全新上下文】的子智能体。

      核心思想：
      - 子智能体看不到父智能体的对话历史，只收到 prompt
      - 子智能体有自己的独立循环，可以调用基础工具
      - 循环结束后，整个 sub_messages 直接丢弃
      - 只返回最终的文本摘要给父智能体
      """

      # 全新的消息列表，只有一条用户消息
      # 父智能体的历史、其他子任务的结果，全部不可见
      sub_messages = [{"role": "user", "content": prompt}]

      # 最多循环 30 次，安全阀防止无限循环
      # （例如模型反复读文件不停止）
      for _ in range(30):
          # 调用 API，使用子智能体专属的 system prompt 和工具集
          response = client.messages.create(
              model=MODEL,
              system=SUBAGENT_SYSTEM,    # 子智能体的系统提示词（与父不同）
              messages=sub_messages,      # 独立的对话历史
              tools=CHILD_TOOLS,          # 只有基础工具，没有 task
              max_tokens=8000,
          )

          # 追加模型回复到子智能体自己的历史中
          sub_messages.append({
              "role": "assistant",
              "content": response.content,
          })

          # 如果模型不再请求工具，说明子任务完成，退出循环
          if response.stop_reason != "tool_use":
              break

          # 收集工具调用结果（逻辑与 s02/s03 完全一致）
          results = []
          for block in response.content:
              if block.type == "tool_use":
                  handler = TOOL_HANDLERS.get(block.name)
                  output = handler(**block.input)
                  results.append({
                      "type": "tool_result",
                      "tool_use_id": block.id,
                      "content": str(output)[:50000],  # 单条结果截断
                  })

          # 工具结果追加到子智能体自己的历史
          sub_messages.append({"role": "user", "content": results})

      # 循环结束，提取模型最后一次回复中的文本内容作为摘要
      # 如果模型最后一条回复里没有文本（全是工具调用），返回兜底信息
      return "".join(
          b.text for b in response.content if hasattr(b, "text")
      ) or "(no summary)"


  # ============================================================
  # 注册到父智能体的工具调度表
  # ============================================================

  TOOL_HANDLERS = {
      # 基础工具（父智能体自己也能用）
      "bash":       lambda **kw: run_bash(kw["command"]),
      "read_file":  lambda **kw: run_read(kw["path"], kw.get("limit")),
      "write_file": lambda **kw: run_write(kw["path"], kw["content"]),
      "edit_file":  lambda **kw: run_edit(kw["path"], kw["old_text"],
                                          kw["new_text"]),
      "todo":       lambda **kw: TODO.update(kw["items"]),

      # 新增：task 工具，父智能体调用时启动子智能体
      "task":       lambda **kw: run_subagent(kw["prompt"]),
  }

  ---
  与 s03 的核心差别：

  ┌────────────┬────────────────────────────────────────────────┬─────────────────────────────────────────────┐
  │    对比    │                      s03                       │                     s04                     │
  ├────────────┼────────────────────────────────────────────────┼─────────────────────────────────────────────┤
  │ 架构       │ 单层，一个循环搞定所有事                       │ 两层：父智能体 + 子智能体                   │
  ├────────────┼────────────────────────────────────────────────┼─────────────────────────────────────────────┤
  │ 上下文     │ 所有工具输出永久留在 messages 里               │ 子智能体的上下文用完即丢，父只收摘要        │
  ├────────────┼────────────────────────────────────────────────┼─────────────────────────────────────────────┤
  │ 任务拆分   │ 靠 todo 跟踪，但都在同一个上下文里执行         │ 独立子任务派给独立上下文执行                │
  ├────────────┼────────────────────────────────────────────────┼─────────────────────────────────────────────┤
  │ 工具权限   │ 所有工具对所有循环可见                         │ 父有 task，子没有（防递归）                 │
  ├────────────┼────────────────────────────────────────────────┼─────────────────────────────────────────────┤
  │ 上下文膨胀 │ "读 5 个文件查测试框架" → 5 份文件内容留在历史 │ 同样的工作在子智能体完成，父只收到 "pytest" │
  └────────────┴────────────────────────────────────────────────┴─────────────────────────────────────────────┘

  解决的痛点：

  s03 的问题：

  父智能体 messages:
    [用户问题]
    [读文件1 → 3000行内容]      ← 永久驻留
    [读文件2 → 2000行内容]      ← 永久驻留
    [跑命令  → 大量输出]        ← 永久驻留
    [读文件3 → 5000行内容]      ← 永久驻留
    ...
    → 上下文爆炸，后面的推理质量下降

  s04 的解法：

  父智能体 messages:
    [用户问题]
    [task 调用: "查一下项目用什么测试框架"]
    [tool_result: "pytest"]     ← 只有 6 个字符！

  子智能体 sub_messages:        ← 用完直接丢弃
    [读文件1] [读文件2] [跑命令] [读文件3] ...

  三层递进总结：

  s02：加工具    → Agent 能做事了
  s03：加规划    → Agent 知道先做什么后做什么，不跑偏
  s04：加子智能体 → Agent 把脏活甩给子智能体，保持自己的上下文干净

##s05-skill
⏺ 以下是加完注释的完整代码及与 s04 的对比：

  # ============================================================
  # 技能目录结构
  # ============================================================

  # 每个技能是一个文件夹，内含 SKILL.md 文件
  # SKILL.md 使用 YAML frontmatter 存储元数据，正文是技能的完整指令
  #
  # skills/
  #   pdf/
  #     SKILL.md       # name: pdf / description: Process PDF files / ...完整指令
  #   code-review/
  #     SKILL.md       # name: code-review / description: Review code / ...完整指令
  #
  # 元数据（name, description）→ 第一层，始终存在于系统提示（便宜）
  # 正文（body）               → 第二层，按需加载（贵）


  # ============================================================
  # SkillLoader：技能加载器
  # ============================================================

  class SkillLoader:
      """
      递归扫描技能目录，解析所有 SKILL.md 文件。
      将技能分为两层：元数据（常驻）和正文（按需）。
      """

      def __init__(self, skills_dir: Path):
          self.skills = {}

          # 递归查找所有 SKILL.md 文件，按路径排序保证确定性
          for f in sorted(skills_dir.rglob("SKILL.md")):
              text = f.read_text()

              # 解析 YAML frontmatter 和正文
              # frontmatter 是文件开头 --- 包裹的 YAML 块
              # body 是 --- 之后的所有内容
              meta, body = self._parse_frontmatter(text)

              # 优先用 frontmatter 中的 name，没有则用目录名
              name = meta.get("name", f.parent.name)

              # 存入字典：name → {meta: 元数据, body: 完整正文}
              self.skills[name] = {"meta": meta, "body": body}

      def get_descriptions(self) -> str:
          """
          第一层：生成技能清单的简短描述。
          写入系统提示，让模型知道有哪些技能可用。
          每个技能只占约 100 tokens（只有 name + description）。
          """
          lines = []
          for name, skill in self.skills.items():
              desc = skill["meta"].get("description", "")
              lines.append(f"  - {name}: {desc}")
          return "\n".join(lines)

      def get_content(self, name: str) -> str:
          """
          第二层：按需返回某个技能的完整正文。
          用 <skill> 标签包裹，方便模型识别边界。
          完整内容可能 2000+ tokens，只在模型主动请求时才加载。
          """
          skill = self.skills.get(name)
          if not skill:
              return f"Error: Unknown skill '{name}'."
          return f"<skill name=\"{name}\">\n{skill['body']}\n</skill>"


  # ============================================================
  # 系统提示：第一层（常驻，低成本）
  # ============================================================

  # 将技能清单写入系统提示
  # 模型始终能看到"有哪些技能"，但看不到具体内容
  # 10 个技能 × ~100 tokens = ~1000 tokens（而非全加载的 ~20000 tokens）
  SYSTEM = f"""You are a coding agent at {WORKDIR}.
  Skills available:
  {SKILL_LOADER.get_descriptions()}"""


  # ============================================================
  # 工具调度表：第二层（按需，高成本）
  # ============================================================

  TOOL_HANDLERS = {
      # ...s04 的基础工具保留...
      "bash":       lambda **kw: run_bash(kw["command"]),
      "read_file":  lambda **kw: run_read(kw["path"], kw.get("limit")),
      "write_file": lambda **kw: run_write(kw["path"], kw["content"]),
      "edit_file":  lambda **kw: run_edit(kw["path"], kw["old_text"],
                                          kw["new_text"]),
      "todo":       lambda **kw: TODO.update(kw["items"]),
      "task":       lambda **kw: run_subagent(kw["prompt"]),

      # 新增：load_skill 工具，模型按需加载技能的完整内容
      # 调用后完整指令作为 tool_result 返回，只在那一轮对话中生效
      "load_skill": lambda **kw: SKILL_LOADER.get_content(kw["name"]),
  }

  ---
  与 s04 的核心差别：

  ┌──────────────┬────────────────────────────────────┬──────────────────────────────────────────┐
  │     对比     │                s04                 │                   s05                    │
  ├──────────────┼────────────────────────────────────┼──────────────────────────────────────────┤
  │ 系统提示     │ 固定内容，所有指令全塞进去         │ 分两层：摘要常驻 + 正文按需              │
  ├──────────────┼────────────────────────────────────┼──────────────────────────────────────────┤
  │ Token 开销   │ 10 个技能全加载 = ~20000 tokens/轮 │ 未使用时 ~1000 tokens，加载 1 个 = ~3000 │
  ├──────────────┼────────────────────────────────────┼──────────────────────────────────────────┤
  │ 知识注入方式 │ 无（只有工具）                     │ 技能系统，模型自己决定何时加载           │
  ├──────────────┼────────────────────────────────────┼──────────────────────────────────────────┤
  │ 工具数量     │ 6 个                               │ 7 个（加了 load_skill）                  │
  ├──────────────┼────────────────────────────────────┼──────────────────────────────────────────┤
  │ 扩展方式     │ 改代码                             │ 往 skills/ 目录加文件夹即可              │
  └──────────────┴────────────────────────────────────┴──────────────────────────────────────────┘

  两层加载的 Token 经济学：

  方案 A（全塞系统提示）：
    系统提示: 20000 tokens（10 个技能 × 2000）
    → 每轮 API 调用都带着这 20000 tokens
    → 30 轮对话 = 600000 tokens 浪费在无关技能上

  方案 B（按需加载）：
    系统提示: 1000 tokens（10 个技能 × 100 的摘要）
    load_skill("git"): 2000 tokens（只在这一轮的 tool_result 中出现）
    → 30 轮对话，只用了 1 次技能 = 额外 2000 tokens
    → 节省 298000 tokens

  执行流程：

  模型看到系统提示：
    Skills available:
      - git: Git workflow helpers        ← 知道有这个技能
      - test: Testing best practices     ← 知道有这个技能
      - pdf: Process PDF files           ← 知道有这个技能

  用户："帮我提交代码"

  模型思考：这涉及 git 工作流，先加载 git 技能
    → 调用 load_skill("git")

  tool_result 返回：
    <skill name="git">
      Step 1: Check current branch...     ← 完整指令加载完毕
      Step 2: Stage changes...
      Step 3: Write conventional commit...
    </skill>

  模型按照技能指令执行后续操作

  ---
  五层递进总结：

  s02：加工具        → Agent 能做事
  s03：加规划 (todo)  → Agent 有条理
  s04：加子智能体     → Agent 不爆上下文
  s05：加技能系统     → Agent 按需获取领域知识，省 token

#s07 任务系统
⏺ 以下是加完注释的完整代码及与 s05 的对比：

  # ============================================================
  # 磁盘上的任务图结构
  # ============================================================

  # 每个任务是一个独立的 JSON 文件，持久化到 .tasks/ 目录
  #
  # .tasks/
  #   task_1.json  {"id":1, "subject":"Setup project", "status":"completed",
  #                 "blockedBy":[], "blocks":[2,3], "owner":"agent-1"}
  #   task_2.json  {"id":2, "subject":"Add auth", "status":"pending",
  #                 "blockedBy":[1], "blocks":[4], "owner":""}
  #   task_3.json  {"id":3, "subject":"Add logging", "status":"pending",
  #                 "blockedBy":[1], "blocks":[4], "owner":""}
  #   task_4.json  {"id":4, "subject":"Integration test", "status":"pending",
  #                 "blockedBy":[2,3], "blocks":[], "owner":""}
  #
  # DAG（有向无环图）：
  #
  #                  +----------+
  #             +--> | task 2   | --+
  #             |    | pending  |   |
  # +----------+     +----------+    +--> +----------+
  # | task 1   |                          | task 4   |
  # | completed| --> +----------+    +--> | blocked  |
  # +----------+     | task 3   | --+     +----------+
  #                  | pending  |
  #                  +----------+
  #
  # 三个核心问题：
  #   什么可以做？  → status=="pending" 且 blockedBy 为空
  #   什么被卡住？  → blockedBy 非空
  #   什么做完了？  → status=="completed"，完成时自动解锁后继


  # ============================================================
  # TaskManager：任务图管理器
  # ============================================================

  class TaskManager:
      """
      每个任务一个 JSON 文件，支持 CRUD 和依赖关系管理。
      持久化到磁盘，不惧上下文压缩或进程重启。
      """

      def __init__(self, tasks_dir: Path):
          self.dir = tasks_dir
          # 目录不存在则创建
          self.dir.mkdir(exist_ok=True)
          # ID 自增：找到当前最大 ID，下一个从 max+1 开始
          self._next_id = self._max_id() + 1

      def create(self, subject, description=""):
          """
          创建新任务，初始状态为 pending，无依赖，无负责人。
          """
          task = {
              "id": self._next_id,
              "subject": subject,         # 任务标题
              "description": description,  # 任务详情
              "status": "pending",         # pending → in_progress → completed
              "blockedBy": [],             # 前置依赖：哪些任务必须先完成
              "blocks": [],                # 后置依赖：完成后解锁哪些任务
              "owner": "",                 # 当前负责人（多 agent 时用）
          }
          self._save(task)
          self._next_id += 1
          return json.dumps(task, indent=2)

      def _clear_dependency(self, completed_id):
          """
          依赖解除：当一个任务完成时，将其 ID 从所有其他任务的
          blockedBy 列表中移除，自动解锁后续任务。

          例如 task_1 完成后：
            task_2.blockedBy: [1] → []  ← 解锁，可以开始了
            task_3.blockedBy: [1] → []  ← 解锁，可以开始了
          """
          for f in self.dir.glob("task_*.json"):
              task = json.loads(f.read_text())
              if completed_id in task.get("blockedBy", []):
                  task["blockedBy"].remove(completed_id)
                  self._save(task)

      def update(self, task_id, status=None,
                 add_blocked_by=None, add_blocks=None):
          """
          更新任务状态和依赖关系。

          关键逻辑：当 status 设为 "completed" 时，
          自动调用 _clear_dependency 解锁依赖此任务的其他任务。
          """
          task = self._load(task_id)

          if status:
              task["status"] = status
              # 完成任务时，自动解除其他任务对此任务的依赖
              if status == "completed":
                  self._clear_dependency(task_id)

          # 添加新的依赖边（可选）
          if add_blocked_by:
              task["blockedBy"].append(add_blocked_by)
          if add_blocks:
              task["blocks"].append(add_blocks)

          self._save(task)

      # --- 以下是未在片段中展示但暗含的方法 ---

      def list_all(self):
          """列出所有任务，按 ID 排序。"""
          tasks = []
          for f in sorted(self.dir.glob("task_*.json")):
              tasks.append(json.loads(f.read_text()))
          return json.dumps(tasks, indent=2)

      def get(self, task_id):
          """获取单个任务的详细信息。"""
          return json.dumps(self._load(task_id), indent=2)

      def _save(self, task):
          """将任务写入 JSON 文件。"""
          path = self.dir / f"task_{task['id']}.json"
          path.write_text(json.dumps(task, indent=2))

      def _load(self, task_id):
          """从 JSON 文件读取任务。"""
          path = self.dir / f"task_{task_id}.json"
          return json.loads(path.read_text())

      def _max_id(self):
          """扫描目录获取当前最大任务 ID。"""
          ids = []
          for f in self.dir.glob("task_*.json"):
              # 从文件名 task_42.json 中提取数字 42
              num = int(f.stem.split("_")[1])
              ids.append(num)
          return max(ids) if ids else 0


  # ============================================================
  # 工具调度表：4 个任务工具
  # ============================================================

  TOOL_HANDLERS = {
      # ...s05 的基础工具保留...
      "bash":       lambda **kw: run_bash(kw["command"]),
      "read_file":  lambda **kw: run_read(kw["path"], kw.get("limit")),
      "write_file": lambda **kw: run_write(kw["path"], kw["content"]),
      "edit_file":  lambda **kw: run_edit(kw["path"], kw["old_text"],
                                          kw["new_text"]),
      "todo":       lambda **kw: TODO.update(kw["items"]),
      "task":       lambda **kw: run_subagent(kw["prompt"]),
      "load_skill": lambda **kw: SKILL_LOADER.get_content(kw["name"]),

      # 新增：4 个任务图工具
      "task_create": lambda **kw: TASKS.create(
                        kw["subject"], kw.get("description", "")),
      "task_update": lambda **kw: TASKS.update(
                        kw["task_id"], kw.get("status"),
                        kw.get("add_blocked_by"), kw.get("add_blocks")),
      "task_list":   lambda **kw: TASKS.list_all(),
      "task_get":    lambda **kw: TASKS.get(kw["task_id"]),
  }

  ---
  与 s05 的核心差别：

  ┌──────────┬──────────────────────────┬────────────────────────────────────────────┐
  │   对比   │         s03 Todo         │              s07 TaskManager               │
  ├──────────┼──────────────────────────┼────────────────────────────────────────────┤
  │ 存储位置 │ 内存（上下文压缩就没了） │ 磁盘 .tasks/ 目录（持久化）                │
  ├──────────┼──────────────────────────┼────────────────────────────────────────────┤
  │ 结构     │ 扁平列表，无依赖关系     │ DAG 有向无环图，有 blockedBy / blocks      │
  ├──────────┼──────────────────────────┼────────────────────────────────────────────┤
  │ 并行支持 │ 只允许 1 个 in_progress  │ 天然支持：blockedBy 为空的任务可同时执行   │
  ├──────────┼──────────────────────────┼────────────────────────────────────────────┤
  │ 依赖解除 │ 无（手动标记完成）       │ 自动：completed 时移除其他任务的 blockedBy │
  ├──────────┼──────────────────────────┼────────────────────────────────────────────┤
  │ 生命周期 │ 单次会话                 │ 跨会话、跨进程、跨 agent                   │
  ├──────────┼──────────────────────────┼────────────────────────────────────────────┤
  │ 回答能力 │ "做了几个，还剩几个"     │ "什么能做、什么被卡、什么做完了"           │
  ├──────────┼──────────────────────────┼────────────────────────────────────────────┤
  │ 查询粒度 │ 1 个工具（todo update）  │ 4 个工具（create / update / list / get）   │
  └──────────┴──────────────────────────┴────────────────────────────────────────────┘

  依赖解除的执行流程：

  初始状态：
    task_1: blockedBy: []       → 可做
    task_2: blockedBy: [1]      → 被卡
    task_3: blockedBy: [1]      → 被卡
    task_4: blockedBy: [2, 3]   → 被卡

  task_update(1, status="completed") 执行后：
    → _clear_dependency(1)
    → 扫描所有 task_*.json，从 blockedBy 中移除 1
    → task_2: blockedBy: []     → 解锁！可做
    → task_3: blockedBy: []     → 解锁！可做
    → task_4: blockedBy: [2, 3] → 仍然被卡

  task_update(2, status="completed") + task_update(3, status="completed") 后：
    → _clear_dependency(2) + _clear_dependency(3)
    → task_4: blockedBy: []     → 解锁！可做

  为什么是 DAG 而不是简单的列表：

  真实项目的任务关系：

    "配置数据库" ──┬──> "写用户模型" ──┬──> "集成测试"
                   │                    │
                   └──> "写订单模型" ──┘

  扁平列表无法表达：
    - "集成测试" 必须等两个模型都写完
    - "用户模型" 和 "订单模型" 可以并行写

  DAG 天然支持：
    - 串行：blockedBy 链式等待
    - 并行：无依赖关系的任务同时 unlocked
    - 汇合：多个 blockedBy 都清空才解锁

  ---
  六层递进总结：

  s02：加工具         → Agent 能做事
  s03：加规划 (todo)   → Agent 有条理（内存扁平列表）
  s04：加子智能体      → Agent 不爆上下文
  s05：加技能系统      → Agent 按需获取领域知识
  s07：加任务图 (DAG)  → Agent 有结构化的依赖管理，持久化到磁盘


#s07 上下文压缩
⏺ 以下是加完注释的完整代码及与 s05 的对比：

  # ============================================================
  # 三层压缩策略：让有限上下文承载无限会话
  # ============================================================
  #
  # 问题：读 30 个文件、跑 20 条命令，轻松突破 100k token
  # 方案：三层压缩，激进程度递增
  #
  # Layer 1: micro_compact — 每轮静默执行，替换旧工具结果为占位符
  # Layer 2: auto_compact  — token 超阈值时，LLM 摘要整段对话
  # Layer 3: manual compact — 模型主动调用 compact 工具触发摘要
  #
  # 完整历史通过 transcript 文件保存在磁盘，信息没有真正丢失，
  # 只是移出了活跃上下文窗口


  KEEP_RECENT = 3       # 保留最近 3 轮工具结果，更早的替换为占位符
  THRESHOLD = 50000     # token 超过此阈值触发 auto_compact


  # ============================================================
  # 第一层：micro_compact（每轮静默执行）
  # ============================================================

  def micro_compact(messages: list) -> list:
      """
      每次调用 LLM 前，将超过 KEEP_RECENT 轮的旧 tool_result
      替换为简短占位符。保留最近几轮的完整结果。

      效果：一个 3000 token 的文件内容 → "[Previous: used read_file]"
      这是最温和的压缩，几乎不丢信息，但能回收大量 token。
      """
      # 扫描所有消息，收集 tool_result 的位置信息
      tool_results = []
      for i, msg in enumerate(messages):
          if msg["role"] == "user" and isinstance(msg.get("content"), list):
              for j, part in enumerate(msg["content"]):
                  if isinstance(part, dict) and part.get("type") == "tool_result":
                      tool_results.append((i, j, part))

      # 如果工具结果不超过 KEEP_RECENT 个，不需要压缩
      if len(tool_results) <= KEEP_RECENT:
          return messages

      # 只保留最近 KEEP_RECENT 个工具结果的完整内容
      # 更早的全部替换为占位符（且内容超过 100 字符的才替换，短结果保留原样）
      for _, _, part in tool_results[:-KEEP_RECENT]:
          if len(part.get("content", "")) > 100:
              part["content"] = f"[Previous: used {tool_name}]"
              # 实际实现中 tool_name 从 part 关联的 tool_use block 中提取

      return messages


  # ============================================================
  # 第二层：auto_compact（token 超阈值时触发）
  # ============================================================

  def auto_compact(messages: list) -> list:
      """
      当 token 估算超过 THRESHOLD 时触发。

      做两件事：
      1. 将完整对话保存到 .transcripts/ 目录（磁盘存档，可恢复）
      2. 调用 LLM 对整个对话做摘要，然后用摘要替换所有消息

      效果：30 轮对话（可能 100k+ token）→ 一段摘要（~2000 token）
      完整历史没有丢失，只是从活跃上下文移到了磁盘文件。
      """
      # --- 第一步：保存完整 transcript 到磁盘 ---
      transcript_path = TRANSCRIPT_DIR / f"transcript_{int(time.time())}.jsonl"
      with open(transcript_path, "w") as f:
          for msg in messages:
              f.write(json.dumps(msg, default=str) + "\n")
      # 原始对话现在安全地躺在磁盘上，可以放心丢弃内存中的版本

      # --- 第二步：LLM 生成摘要 ---
      response = client.messages.create(
          model=MODEL,
          messages=[{
              "role": "user",
              "content":
                  "Summarize this conversation for continuity..."
                  # 将整个对话历史序列化后截断到 80000 字符
                  # 摘要模型能看到几乎完整的上下文来生成高质量总结
                  + json.dumps(messages, default=str)[:80000]
          }],
          max_tokens=2000,
      )

      # --- 第三步：用摘要替换全部消息 ---
      # 所有旧消息被丢弃，只保留一段压缩后的摘要
      return [
          {"role": "user",
           "content": f"[Compressed]\n\n{response.content[0].text}"},
          {"role": "assistant",
           "content": "Understood. Continuing."},
      ]


  # ============================================================
  # 第三层：manual compact（模型主动调用）
  # ============================================================
  #
  # 在 TOOL_HANDLERS 中注册 compact 工具：
  #   "compact": lambda **kw: auto_compact(messages)
  #
  # 模型判断当前上下文太拥挤时，主动调用 compact 触发同样的摘要流程。
  # 本质上和 Layer 2 是同一个函数，只是触发方式不同：
  #   Layer 2 = 系统自动触发（token 计数超阈值）
  #   Layer 3 = 模型主动触发（调用 compact 工具）


  # ============================================================
  # Agent 循环整合三层压缩
  # ============================================================

  def agent_loop(messages: list):
      while True:
          # Layer 1：每轮静默压缩，替换旧的 tool_result 为占位符
          micro_compact(messages)

          # Layer 2：token 超阈值时，自动对整个对话做摘要
          if estimate_tokens(messages) > THRESHOLD:
              messages[:] = auto_compact(messages)

          # 调用 LLM
          response = client.messages.create(
              model=MODEL, system=SYSTEM, messages=messages,
              tools=TOOLS, max_tokens=8000,
          )

          # ... 工具执行逻辑（与之前一致） ...
          messages.append({"role": "assistant", "content": response.content})

          if response.stop_reason != "tool_use":
              return

          results = []
          manual_compact = False
          for block in response.content:
              if block.type == "tool_use":
                  # 检测模型是否主动调用了 compact 工具
                  if block.name == "compact":
                      manual_compact = True
                      results.append({...})
                  else:
                      handler = TOOL_HANDLERS.get(block.name)
                      output = handler(**block.input)
                      results.append({...})

          messages.append({"role": "user", "content": results})

          # Layer 3：模型主动触发的压缩
          if manual_compact:
              messages[:] = auto_compact(messages)

  ---
  与 s05（技能系统）的对比：

  ┌──────────┬──────────────────────────┬─────────────────────────────────┐
  │   对比   │       s05 技能系统       │         s06 上下文压缩          │
  ├──────────┼──────────────────────────┼─────────────────────────────────┤
  │ 目标     │ 省 token（按需加载知识） │ 省 token（回收历史空间）        │
  ├──────────┼──────────────────────────┼─────────────────────────────────┤
  │ 作用时机 │ 模型决定加载什么技能     │ 系统自动 / 模型主动             │
  ├──────────┼──────────────────────────┼─────────────────────────────────┤
  │ 信息丢失 │ 不加载 = 没见过          │ 摘要 = 有损压缩，但磁盘保留原文 │
  ├──────────┼──────────────────────────┼─────────────────────────────────┤
  │ 工具数量 │ +1（load_skill）         │ +1（compact）                   │
  └──────────┴──────────────────────────┴─────────────────────────────────┘

  三层压缩对比：

  ┌────────────────────────┬────────────────┬──────────┬─────────────────────────────────────────────┐
  │          层级          │    触发方式    │ 激进程度 │                  信息损失                   │
  ├────────────────────────┼────────────────┼──────────┼─────────────────────────────────────────────┤
  │ Layer 1: micro_compact │ 每轮自动       │ 最温和   │ 只替换旧 tool_result 为占位符，对话文本不变 │
  ├────────────────────────┼────────────────┼──────────┼─────────────────────────────────────────────┤
  │ Layer 2: auto_compact  │ token 超 50000 │ 激进     │ 整段对话压缩为 ~2000 token 摘要             │
  ├────────────────────────┼────────────────┼──────────┼─────────────────────────────────────────────┤
  │ Layer 3: compact 工具  │ 模型主动调用   │ 激进     │ 同 Layer 2，但由模型判断何时触发            │
  └────────────────────────┴────────────────┴──────────┴─────────────────────────────────────────────┘

  执行流程：

  每轮循环：
    ┌─ micro_compact(messages)
    │   → 旧 tool_result: 3000 行文件内容 → "[Previous: used read_file]"
    │
    ├─ estimate_tokens > 50000?
    │   ├── 是 → auto_compact: 保存 transcript → LLM 摘要 → 替换全部消息
    │   └── 否 → 继续
    │
    ├─ 调用 LLM → 执行工具
    │
    └─ 模型调了 compact?
        └── 是 → auto_compact 执行同样的摘要流程

  磁盘上：
    .transcripts/
      transcript_1712000000.jsonl   ← 完整对话历史，随时可恢复
      transcript_1712000100.jsonl
      ...

  关键设计：transcript 是安全网。 压缩是"有损"的——摘要可能丢细节。但原始对话始终保存在磁盘上，需要时可以回溯。信息没有真正丢失，只是从活跃上下文移到了磁盘。

  ---
  六层递进总结：

  s01：Agent 循环        → 模型能调用工具
  s02：工具调度 + 沙箱   → 安全地读写文件、跑命令
  s03：TodoManager       → 有条理（内存扁平列表）
  s04：子智能体          → 上下文不爆炸（独立任务隔离）
  s05：技能系统          → 按需加载领域知识（省 token）
  s07：加任务图 (DAG)  → Agent 有结构化的依赖管理，持久化到磁盘
  s06：上下文压缩        → 三层压缩策略，有限窗口承载无限会话



#s08 后台任务
⏺ 以下是加完注释的完整代码及与 s07 的对比：

  # ============================================================
  # 后台执行架构
  # ============================================================
  #
  # 问题：npm install、pytest、docker build 可能要几分钟
  #       阻塞式循环下模型只能干等，用户说"装依赖顺便建配置"
  #       智能体却只能串行一个一个来
  #
  # 解决方案：
  #   Main thread                Background thread
  #   +-----------------+        +-----------------+
  #   | agent loop      |        | subprocess runs |
  #   | ...             |        | ...             |
  #   | [LLM call] <---+-------  | enqueue(result) |
  #   |  ^drain queue   |        +-----------------+
  #   +-----------------+
  #
  # Timeline:
  # Agent --[spawn A]--[spawn B]--[other work]----
  #              |          |
  #              v          v
  #           [A runs]   [B runs]      (并行)
  #              |          |
  #              +-- results injected before next LLM call --+
  #
  # 关键约束：循环保持单线程，只有子进程 I/O 被并行化

  import threading
  import uuid
  import subprocess


  # ============================================================
  # BackgroundManager：后台任务管理器
  # ============================================================

  class BackgroundManager:
      """
      用线程安全的通知队列追踪后台任务。
      主线程每次调 LLM 前排空队列，将已完成任务的结果注入对话。
      """

      def __init__(self):
          self.tasks = {}                  # task_id → {status, command, ...}
          self._notification_queue = []    # 已完成任务的待通知列表
          self._lock = threading.Lock()    # 保护队列的线程锁

      # ----------------------------------------------------------
      # run()：启动后台任务
      # ----------------------------------------------------------

      def run(self, command: str) -> str:
          """
          启动守护线程执行命令，立即返回 task_id。
          模型拿到 task_id 后可以继续做其他事，不用等命令跑完。
          """
          task_id = str(uuid.uuid4())[:8]
          self.tasks[task_id] = {
              "status": "running",
              "command": command,
          }

          # daemon=True：主线程退出时自动终止后台任务
          thread = threading.Thread(
              target=self._execute,
              args=(task_id, command),
              daemon=True,
          )
          thread.start()

          # 立即返回，不阻塞
          return f"Background task {task_id} started"

      # ----------------------------------------------------------
      # _execute()：线程内执行子进程
      # ----------------------------------------------------------

      def _execute(self, task_id, command):
          """
          在后台线程中运行子进程。
          完成后将结果（截断）放入通知队列。
          """
          try:
              r = subprocess.run(
                  command, shell=True,
                  cwd=WORKDIR,            # 在工作目录下执行
                  capture_output=True,
                  text=True,
                  timeout=300,            # 最多跑 5 分钟
              )
              # 合并 stdout 和 stderr，截断防止撑爆上下文
              output = (r.stdout + r.stderr).strip()[:50000]
          except subprocess.TimeoutExpired:
              output = "Error: Timeout (300s)"

          # 线程安全地将结果放入通知队列
          with self._lock:
              self._notification_queue.append({
                  "task_id": task_id,
                  "result": output[:500],  # 通知只取前 500 字符（摘要）
              })

          # 更新任务状态（供 task_list 等查询用）
          self.tasks[task_id]["status"] = "completed"
          self.tasks[task_id]["output"] = output

      # ----------------------------------------------------------
      # drain_notifications()：排空通知队列
      # ----------------------------------------------------------

      def drain_notifications(self) -> list:
          """
          取出并清空所有待通知。
          主循环在每次调 LLM 前调用此方法。
          """
          with self._lock:
              pending = list(self._notification_queue)
              self._notification_queue.clear()
          return pending


  # ============================================================
  # Agent 循环整合后台执行
  # ============================================================

  def agent_loop(messages: list):
      while True:

          # ---- 在调用 LLM 前，排空后台任务通知 ----
          notifs = BG.drain_notifications()
          if notifs:
              # 将所有完成的后台任务结果格式化为一条消息注入对话
              notif_text = "\n".join(
                  f"[bg:{n['task_id']}] {n['result']}" for n in notifs
              )
              # 注入 user + assistant 消息对，模拟"系统告知 → 模型确认"
              messages.append({
                  "role": "user",
                  "content": (
                      f"<background-results>\n{notif_text}\n"
                      f"</background-results>"
                  ),
              })
              messages.append({
                  "role": "assistant",
                  "content": "Noted background results.",
              })

          # ---- 调用 LLM ----
          response = client.messages.create(
              model=MODEL, system=SYSTEM, messages=messages,
              tools=TOOLS, max_tokens=8000,
          )

          # ... 工具执行逻辑（与之前一致） ...

          # 当模型调用 background_run 工具时：
          # handler = lambda **kw: BG.run(kw["command"])
          # → 立即返回 task_id，模型继续下一步
          # → 子进程在后台跑，完成后通知队列收到结果
          # → 下一轮循环开头 drain_notifications 注入结果


  # ============================================================
  # 工具调度表：新增后台执行工具
  # ============================================================

  TOOL_HANDLERS = {
      # ...s01-s07 的基础工具保留...
      "bash":       lambda **kw: run_bash(kw["command"]),
      "read_file":  lambda **kw: run_read(kw["path"], kw.get("limit")),
      "write_file": lambda **kw: run_write(kw["path"], kw["content"]),
      "edit_file":  lambda **kw: run_edit(kw["path"], kw["old_text"],
                                          kw["new_text"]),
      "todo":       lambda **kw: TODO.update(kw["items"]),
      "task":       lambda **kw: run_subagent(kw["prompt"]),
      "load_skill": lambda **kw: SKILL_LOADER.get_content(kw["name"]),
      "task_create": lambda **kw: TASKS.create(kw["subject"]),
      "task_update": lambda **kw: TASKS.update(kw["task_id"], kw.get("status")),
      "task_list":   lambda **kw: TASKS.list_all(),
      "task_get":    lambda **kw: TASKS.get(kw["task_id"]),

      # s08 新增：后台执行工具
      # 模型调用后立即返回 task_id，可以继续做其他事
      "background_run": lambda **kw: BG.run(kw["command"]),
  }

  ---
  与 s07（任务图）的对比：

  ┌──────────┬────────────────────────────────────┬─────────────────────────────┐
  │   对比   │             s07 任务图             │        s08 后台执行         │
  ├──────────┼────────────────────────────────────┼─────────────────────────────┤
  │ 解决什么 │ 任务之间的依赖关系                 │ 慢操作阻塞主循环            │
  ├──────────┼────────────────────────────────────┼─────────────────────────────┤
  │ 并行在哪 │ 概念上并行（DAG 标记哪些能同时做） │ 真正的线程级并行            │
  ├──────────┼────────────────────────────────────┼─────────────────────────────┤
  │ 状态管理 │ 磁盘 JSON 文件                     │ 内存 + 通知队列             │
  ├──────────┼────────────────────────────────────┼─────────────────────────────┤
  │ 触发方式 │ 模型创建/更新任务                  │ 模型调 background_run       │
  ├──────────┼────────────────────────────────────┼─────────────────────────────┤
  │ 结果交付 │ 模型主动查询 task_get              │ 系统自动注入下一轮 LLM 调用 │
  └──────────┴────────────────────────────────────┴─────────────────────────────┘

  执行时序对比：

  s07（串行阻塞）：

    模型：npm install
          ↓ 等待 120 秒...
          ↓
    模型：好，装完了。现在创建配置文件。
          ↓ 等待 1 秒...
          ↓
    模型：完成。
    总耗时：~121 秒

  s08（后台执行）：

    模型：npm install（丢后台）→ 立即返回 task_id
    模型：趁等安装，先创建配置文件          ← 不用等！
          ↓
    模型：配置文件创建完毕。
          ↓
    [通知] bg:a1b2c3 安装完成
    模型：收到，安装和配置都好了。
    总耗时：~3 秒（模型端）

  为什么用通知队列而不是回调：

  回调方案的问题：
    后台线程直接修改 messages 列表 → 线程安全问题
    后台线程直接调 LLM API → 并发请求管理复杂

  通知队列方案：
    后台线程只写队列（唯一写入点，有锁保护）
    主循环在读队列后统一注入 messages → 单线程，无竞争
    LLM 调用始终在主线程 → 简单可靠

  设计约束：循环保持单线程。 只有子进程 I/O 被并行化。这意味着：
  - 消息列表的读写始终在主线程 → 无竞态
  - LLM API 调用始终在主线程 → 无并发冲突
  - 并行只发生在 OS 层面（subprocess）→ 性能提升但无复杂度增加

  ---
  八层递进总结：

  s01：Agent 循环        → 模型能调用工具
  s02：工具调度 + 沙箱   → 安全地读写文件、跑命令
  s03：TodoManager       → 有条理（内存扁平列表）
  s04：子智能体          → 上下文不爆炸（独立任务隔离）
  s05：技能系统          → 按需加载领域知识（省 token）
  s06：上下文压缩        → 三层压缩，有限窗口承载无限会话
  s07：持久化任务图      → DAG 依赖管理，磁盘级持久化
  s08：后台执行          → 慢操作不阻塞，通知队列自动注入结果



#s09 Agent team
⏺ 以下是加完注释的完整代码及与 s08 的对比：

  # ============================================================
  # 多 Agent 团队协作：持久化队友 + JSONL 邮箱
  # ============================================================
  #
  # 问题：
  #   s04 子智能体是一次性的（干活→返回摘要→消亡），无身份、无记忆
  #   s08 后台任务能跑 shell，但不能做 LLM 引导的决策
  #   真正的团队需要：持久身份 + 跨轮记忆 + 通信通道
  #
  # 解决方案：
  #   .team/
  #     config.json           ← 团队名册 + 状态
  #     inbox/
  #       alice.jsonl         ← append-only, drain-on-read
  #       bob.jsonl
  #       lead.jsonl
  #
  # 通信模型：
  #   alice --send("alice","bob","...")--> bob.jsonl << {json_line}
  #   bob   --read_inbox("bob")---------> bob.jsonl 读取 + 清空
  #
  # 生命周期：
  #   spawn -> WORKING -> IDLE -> WORKING -> ... -> SHUTDOWN


  import threading
  import uuid
  import time


  # ============================================================
  # MessageBus：JSONL 邮箱系统
  # ============================================================

  class MessageBus:
      """
      append-only 的 JSONL 收件箱。

      设计要点：
      - send()：追加一行到目标收件箱文件（追加写入，不阻塞读）
      - read_inbox()：读取全部消息并清空文件（drain-on-read）
      - 文件即队列，天然持久化，进程重启不丢消息
      """

      def send(self, sender, to, content,
               msg_type="message", extra=None):
          """
          向某个队友的收件箱追加一条消息。

          参数：
            sender:  发送者名字
            to:      接收者名字（对应 {to}.jsonl 文件）
            content: 消息内容
            msg_type: 消息类型（默认 "message"）
            extra:   额外字段（如 priority, task_id 等）
          """
          msg = {
              "type": msg_type,
              "from": sender,
              "content": content,
              "timestamp": time.time(),
          }
          if extra:
              msg.update(extra)

          # 追加写入目标收件箱文件（一行一条 JSON）
          with open(self.dir / f"{to}.jsonl", "a") as f:
              f.write(json.dumps(msg) + "\n")

      def read_inbox(self, name):
          """
          读取某个队友的全部收件消息，读后清空（drain）。

          drain-on-read 的好处：
          - 下次读取不会重复收到旧消息
          - 文件始终很小，不会无限增长
          - 天然 ACK 机制：读到即确认
          """
          path = self.dir / f"{name}.jsonl"
          if not path.exists():
              return "[]"

          # 读取所有行，过滤空行，解析 JSON
          msgs = [
              json.loads(line)
              for line in path.read_text().strip().splitlines()
              if line
          ]

          # 清空文件（drain）
          path.write_text("")

          return json.dumps(msgs, indent=2)


  # ============================================================
  # TeammateManager：团队管理器
  # ============================================================

  class TeammateManager:
      """
      通过 config.json 维护团队名册。
      每个队友是一个独立线程中运行的 agent loop。
      """

      def __init__(self, team_dir: Path):
          self.dir = team_dir
          self.dir.mkdir(exist_ok=True)
          self.config_path = self.dir / "config.json"
          self.config = self._load_config()
          self.threads = {}  # name → Thread 对象

      # ----------------------------------------------------------
      # spawn()：创建队友
      # ----------------------------------------------------------

      def spawn(self, name: str, role: str, prompt: str) -> str:
          """
          创建一个持久化队友，在线程中启动其专属 agent loop。

          参数：
            name:  队友名字（唯一标识，也用于邮箱地址）
            role:  角色描述（如 "tester", "reviewer"）
            prompt: 初始指令（等同于系统提示的补充）

          队友创建后立即开始工作，有自己的独立上下文。
          """
          # 注册到团队名册
          member = {"name": name, "role": role, "status": "working"}
          self.config["members"].append(member)
          self._save_config()

          # 启动守护线程运行队友的 agent loop
          thread = threading.Thread(
              target=self._teammate_loop,
              args=(name, role, prompt),
              daemon=True,
          )
          thread.start()
          self.threads[name] = thread

          return f"Spawned teammate '{name}' (role: {role})"

      # ----------------------------------------------------------
      # _teammate_loop()：队友的独立 agent 循环
      # ----------------------------------------------------------

      def _teammate_loop(self, name, role, prompt):
          """
          队友的专属循环，运行在独立线程中。

          与主循环的区别：
          - 每次 LLM 调用前检查收件箱
          - 邮箱消息作为新输入注入上下文
          - 有轮次上限（50 轮），防止无限运行
          - 循环结束后状态变为 idle
          """
          # 全新的独立上下文，只有初始指令
          messages = [{"role": "user", "content": prompt}]

          for _ in range(50):  # 安全阀：最多 50 轮
              # ---- 检查收件箱 ----
              inbox = BUS.read_inbox(name)
              if inbox != "[]":
                  # 将收到的消息注入上下文
                  # 模拟"系统转交邮件 → 队友确认收到"
                  messages.append({
                      "role": "user",
                      "content": f"<inbox>{inbox}</inbox>",
                  })
                  messages.append({
                      "role": "assistant",
                      "content": "Noted inbox messages.",
                  })

              # ---- 调用 LLM ----
              response = client.messages.create(
                  model=MODEL, system=SYSTEM,
                  messages=messages,
                  tools=CHILD_TOOLS,     # 队友不能 spawn 新队友
                  max_tokens=8000,
              )
              messages.append({
                  "role": "assistant",
                  "content": response.content,
              })

              if response.stop_reason != "tool_use":
                  break

              # ---- 执行工具 ----
              results = []
              for block in response.content:
                  if block.type == "tool_use":
                      handler = TOOL_HANDLERS.get(block.name)
                      output = handler(**block.input)
                      results.append({
                          "type": "tool_result",
                          "tool_use_id": block.id,
                          "content": str(output)[:50000],
                      })
              messages.append({"role": "user", "content": results})

          # 循环结束，更新状态为 idle（等待新消息唤醒）
          self._find_member(name)["status"] = "idle"
          self._save_config()

      # ----------------------------------------------------------
      # 辅助方法
      # ----------------------------------------------------------

      def _load_config(self):
          """加载团队名册。"""
          if self.config_path.exists():
              return json.loads(self.config_path.read_text())
          return {"members": []}

      def _save_config(self):
          """保存团队名册到磁盘。"""
          self.config_path.write_text(
              json.dumps(self.config, indent=2))

      def _find_member(self, name):
          """按名字查找团队成员。"""
          return next(
              (m for m in self.config["members"] if m["name"] == name),
              None,
          )


  # ============================================================
  # 工具调度表：新增团队协作工具
  # ============================================================

  TOOL_HANDLERS = {
      # ...s01-s08 的基础工具保留...

      # s09 新增：团队协作工具
      "teammate_spawn": lambda **kw: TEAM.spawn(
          kw["name"], kw["role"], kw["prompt"]),
      "teammate_send":  lambda **kw: BUS.send(
          kw["from"], kw["to"], kw["content"]),
      "teammate_list":  lambda **kw: json.dumps(TEAM.config, indent=2),
  }

  ---
  与 s08（后台执行）的对比：

  ┌──────────────┬──────────────────────────┬─────────────────────────────────────────┐
  │     对比     │       s08 后台执行       │              s09 团队协作               │
  ├──────────────┼──────────────────────────┼─────────────────────────────────────────┤
  │ 并行的是什么 │ 子进程（shell 命令）     │ LLM 引导的智能体                        │
  ├──────────────┼──────────────────────────┼─────────────────────────────────────────┤
  │ 能做决策吗   │ 不能，只跑固定命令       │ 能，每次工具调用后 LLM 决定下一步       │
  ├──────────────┼──────────────────────────┼─────────────────────────────────────────┤
  │ 有身份吗     │ 没有（task_id 随机生成） │ 有（名字 + 角色 + 持久状态）            │
  ├──────────────┼──────────────────────────┼─────────────────────────────────────────┤
  │ 能跨轮存活吗 │ 不能（完成即消亡）       │ 能（idle → 新消息唤醒 → working）       │
  ├──────────────┼──────────────────────────┼─────────────────────────────────────────┤
  │ 通信方式     │ 通知队列（系统注入）     │ JSONL 邮箱（主动发送/接收）             │
  ├──────────────┼──────────────────────────┼─────────────────────────────────────────┤
  │ 存储         │ 内存队列                 │ 磁盘文件（config.json + inbox/*.jsonl） │
  └──────────────┴──────────────────────────┴─────────────────────────────────────────┘

  通信机制对比：

  s08 通知队列：
    后台线程 → _notification_queue → 主循环 drain
    单向，系统驱动，模型被动接收

  s09 JSONL 邮箱：
    alice → send("alice","bob","做一下测试") → bob.jsonl
    bob   → read_inbox("bob") → 读到消息 → 决定怎么做测试
    双向，agent 驱动，任意队友之间可互发

  drain-on-read 的设计意图：

  alice.jsonl 内容：

    第1次 read_inbox("alice"):
      读到: ["写一下 auth 模块"]
      清空文件 → []

    bob 向 alice 发消息:
      alice.jsonl: ["帮我 review 一下代码"]

    第2次 read_inbox("alice"):
      读到: ["帮我 review 一下代码"]    ← 只有新消息
      清空文件 → []

  好处：
    - 不会重复处理旧消息
    - 文件始终很小
    - 天然 ACK：读到 = 确认收到

  团队协作的完整流程：

  lead（主智能体）:
    1. teammate_spawn("alice", "developer", "你是后端开发...")
    2. teammate_spawn("bob",   "tester",    "你是测试工程师...")
    3. teammate_send("lead", "alice", "实现用户登录 API")

  alice（开发者）:
    4. read_inbox → 收到 "实现用户登录 API"
    5. 调用 write_file, edit_file... 开始编码
    6. teammate_send("alice", "bob", "登录 API 写好了，请测试")

  bob（测试员）:
    7. read_inbox → 收到 "登录 API 写好了，请测试"
    8. 调用 bash 运行 pytest
    9. teammate_send("bob", "alice", "发现一个 bug: ...")

  alice:
    10. read_inbox → 收到 bug 报告
    11. 修复 bug
    12. teammate_send("alice", "lead", "登录功能已完成")

  lead:
    13. read_inbox → 收到完成报告
    → 状态变为 idle，等待 lead 分配下一个任务

  ---
  九层递进总结：

  s01：Agent 循环        → 模型能调用工具
  s02：工具调度 + 沙箱   → 安全地读写文件、跑命令
  s03：TodoManager       → 有条理（内存扁平列表）
  s04：子智能体          → 上下文不爆炸（一次性，无身份）
  s05：技能系统          → 按需加载领域知识
  s06：上下文压缩        → 三层压缩，无限会话
  s07：持久化任务图      → DAG 依赖管理
  s08：后台执行          → 慢操作不阻塞
  s09：团队协作          → 持久化队友 + JSONL 邮箱，多 agent 协同工作


#s10 Agent 通信（团队协议）
⏺ 以下是加完注释的完整代码及与 s09 的对比：

  # ============================================================
  # 协议层：队友之间的结构化握手
  # ============================================================
  #
  # 问题：
  #   s09 中队友能通信，但缺少协调规矩：
  #   - 关机：直接杀线程 → 写了一半的文件 + 过期 config.json
  #   - 计划审批：高风险变更直接开干 → 没有审核环节
  #
  # 解决方案：
  #   一方发带唯一 ID 的请求 → 另一方引用同一 ID 响应
  #   同一个 FSM，两种用途
  #
  # 关机协议：                    计划审批协议：
  #   Lead             Teammate    Teammate           Lead
  #     |                 |           |                 |
  #     |--shutdown_req-->|           |--plan_req------>|
  #     | {req_id:"abc"}  |           | {req_id:"xyz"}  |
  #     |                 |           |                 |
  #     |<--shutdown_resp-|           |<--plan_resp-----|
  #     | {req_id:"abc",  |           | {req_id:"xyz",  |
  #     |  approve:true}  |           |  approve:true}  |
  #
  # 共享状态机：
  #   [pending] --approve--> [approved]
  #   [pending] --reject---> [rejected]


  # ============================================================
  # 请求追踪器
  # ============================================================

  # 追踪所有关机请求的状态
  shutdown_requests = {}

  # 追踪所有计划审批请求的状态
  plan_requests = {}


  # ============================================================
  # 关机协议
  # ============================================================

  def handle_shutdown_request(teammate: str) -> str:
      """
      领导发起关机请求。

      流程：
      1. 生成唯一 req_id
      2. 记录到 tracker（状态 pending）
      3. 通过邮箱发送关机请求给队友
      4. 返回 req_id，领导可后续查询状态
      """
      req_id = str(uuid.uuid4())[:8]

      # 注册到追踪器
      shutdown_requests[req_id] = {
          "target": teammate,
          "status": "pending",
      }

      # 通过 s09 的 MessageBus 发送关机请求
      # msg_type="shutdown_request" 让队友识别这是协议消息
      # extra 中携带 request_id，响应时必须引用同一个 ID
      BUS.send(
          "lead", teammate,
          "Please shut down gracefully.",
          "shutdown_request",
          {"request_id": req_id},
      )

      return f"Shutdown request {req_id} sent (status: pending)"


  # ----------------------------------------------------------
  # 队友端：收到关机请求后的处理
  # ----------------------------------------------------------

  # 队友在 agent loop 中检测到 shutdown_request 类型的邮箱消息：
  if tool_name == "shutdown_response":
      req_id = args["request_id"]
      approve = args["approve"]

      # 更新追踪器状态
      shutdown_requests[req_id]["status"] = \
          "approved" if approve else "rejected"

      # 通过邮箱发回响应（引用同一个 req_id）
      BUS.send(
          sender, "lead",
          args.get("reason", ""),  # 可选的拒绝理由
          "shutdown_response",
          {"request_id": req_id, "approve": approve},
      )

      if approve:
          # 队友执行收尾工作：保存文件、更新 config.json 状态
          # 然后退出 _teammate_loop
          pass


  # ============================================================
  # 计划审批协议
  # ============================================================

  def handle_plan_review(request_id, approve, feedback=""):
      """
      领导审批队友提交的计划。

      与关机协议结构完全相同：
      - 队友生成 req_id，提交计划
      - 领导引用同一 req_id，批准或拒绝
      """
      req = plan_requests[request_id]

      # 更新追踪器状态
      req["status"] = "approved" if approve else "rejected"

      # 通过邮箱发回审批结果
      BUS.send(
          "lead", req["from"],
          feedback,  # 审批意见（修改建议或拒绝理由）
          "plan_approval_response",
          {"request_id": request_id, "approve": approve},
      )


  # ============================================================
  # 队友端：提交计划请求审批
  # ============================================================
  #
  # 队友在做高风险变更前，主动向领导请求审批：
  #
  #   def submit_plan(self, plan_text):
  #       req_id = str(uuid.uuid4())[:8]
  #       plan_requests[req_id] = {
  #           "from": self.name,
  #           "plan": plan_text,
  #           "status": "pending",
  #       }
  #       BUS.send(self.name, "lead", plan_text,
  #                "plan_request", {"request_id": req_id})
  #       return req_id
  #
  # 领导在 agent loop 中收到 plan_request，决定批准或拒绝：
  #   handle_plan_review(req_id, approve=True, feedback="可以，注意边界情况")


  # ============================================================
  # 共享 FSM（有限状态机）
  # ============================================================
  #
  # 两种协议用同一个状态机：
  #
  #   [pending] ──approve──> [approved]
  #   [pending] ──reject───> [rejected]
  #
  # 这个模式可以套用到任何请求-响应协议：
  #   - 关机请求：领导发 → 队友批/拒
  #   - 计划审批：队友发 → 领导批/拒
  #   - 未来扩展：代码审查、合并请求、资源分配...

  ---
  与 s09（团队协作）的对比：

  ┌──────────┬────────────────────────────┬────────────────────────────┐
  │   对比   │        s09 团队协作        │         s10 协议层         │
  ├──────────┼────────────────────────────┼────────────────────────────┤
  │ 通信方式 │ 自由文本，无结构           │ 结构化请求-响应，带 req_id │
  ├──────────┼────────────────────────────┼────────────────────────────┤
  │ 关机方式 │ 直接杀线程（数据可能损坏） │ 握手：请求→批准→收尾→退出  │
  ├──────────┼────────────────────────────┼────────────────────────────┤
  │ 风险控制 │ 队友直接开干               │ 高风险变更先审批           │
  ├──────────┼────────────────────────────┼────────────────────────────┤
  │ 消息追踪 │ 没有（发了就发了）         │ req_id 追踪每笔请求的状态  │
  ├──────────┼────────────────────────────┼────────────────────────────┤
  │ 可扩展性 │ 加新功能要改代码           │ 同一个 FSM 套用新协议      │
  └──────────┴────────────────────────────┴────────────────────────────┘

  为什么 req_id 是关键：

  没有 req_id（s09）：

    lead → alice: "关机"
    lead → alice: "提交测试报告"
    alice: "收到" ← 哪个的"收到"？无法区分

  有 req_id（s10）：

    lead → alice: shutdown_request {req_id: "a1b2"}
    lead → alice: "提交测试报告"
    alice → lead: shutdown_response {req_id: "a1b2", approve: true}
    ← 精确匹配到关机请求，不会混淆

  关机协议的完整流程：

  lead:
    1. handle_shutdown_request("alice")
       → shutdown_requests["a1b2"] = {target: "alice", status: "pending"}
       → alice.jsonl << {type: "shutdown_request", request_id: "a1b2"}

  alice:
    2. read_inbox → 收到 shutdown_request
    3. 保存当前工作（文件写完、状态更新）
    4. 调用 shutdown_response 工具
       → shutdown_requests["a1b2"].status = "approved"
       → lead.jsonl << {type: "shutdown_response", req_id: "a1b2", approve: true}
    5. 退出 _teammate_loop

  lead:
    6. read_inbox → 收到 shutdown_response
    7. 检查 shutdown_requests["a1b2"].status == "approved" ✓
    8. 确认 alice 已安全退出

  对比直接杀线程（s09）：
    lead: thread.kill()
    alice: 正在写文件 → 写了一半 → 文件损坏
    config.json: status 还停留在 "working" → 名册过时

  计划审批的完整流程：

  alice:
    1. 准备重构认证模块，但这是高风险变更
    2. submit_plan("重构认证：拆成 JWT + OAuth 两个模块")
       → plan_requests["x9y8"] = {from: "alice", status: "pending"}
       → lead.jsonl << {type: "plan_request", req_id: "x9y8"}

  lead:
    3. read_inbox → 收到 plan_request
    4. 评估风险 → 批准
    5. handle_plan_review("x9y8", approve=True, feedback="可以，注意向后兼容")
       → plan_requests["x9y8"].status = "approved"
       → alice.jsonl << {type: "plan_approval_response", req_id: "x9y8", approve: true}

  alice:
    6. read_inbox → 收到审批通过
    7. 开始重构

  如果领导拒绝：
    handle_plan_review("x9y8", approve=False, feedback="先写测试再重构")
    → alice 收到拒绝 → 调整计划后重新提交

  ---
  十层递进总结：

  s01：Agent 循环        → 模型能调用工具
  s02：工具调度 + 沙箱   → 安全地读写文件、跑命令
  s03：TodoManager       → 有条理（内存扁平列表）
  s04：子智能体          → 上下文隔离（一次性，无身份）
  s05：技能系统          → 按需加载领域知识
  s06：上下文压缩        → 三层压缩，无限会话
  s07：持久化任务图      → DAG 依赖管理
  s08：后台执行          → 慢操作不阻塞
  s09：团队协作          → 持久队友 + JSONL 邮箱
  s10：协议层            → 结构化请求-响应，req_id 追踪，安全关机 + 计划审批


#s11 自主 Agent
⏺ 以下是加完注释的完整代码及与 s10 的对比：

  # ============================================================
  # 自治层：队友自己看板，有活就认领
  # ============================================================
  #
  # 问题：
  #   s09-s10 中队友只被动接受指派
  #   领导得给每个队友写 prompt，10 个任务得手动分配
  #   扩展不了
  #
  # 解决方案：
  #   队友空闲时自己扫描任务看板 → 认领没人做的任务 → 做完再找下一个
  #   不需要领导逐个分配，自组织
  #
  # 队友生命周期（升级版）：
  #
  #   +-------+
  #   | spawn |
  #   +---+---+
  #       |
  #       v
  #   +-------+   tool_use     +-------+
  #   | WORK  | <------------- |  LLM  |
  #   +---+---+                +-------+
  #       |
  #       | stop_reason != tool_use（或调用了 idle 工具）
  #       v
  #   +--------+
  #   |  IDLE  |  poll every 5s for up to 60s
  #   +---+----+
  #       |
  #       +---> check inbox --> message? ---------> WORK
  #       |
  #       +---> scan .tasks/ --> unclaimed? ------> claim -> WORK
  #       |
  #       +---> 60s timeout ---------------------> SHUTDOWN
  #
  # 身份重注入（解决 s06 压缩后遗忘身份的问题）：
  #   if len(messages) <= 3:  ← 说明发生了压缩
  #     messages.insert(0, identity_block)


  POLL_INTERVAL = 5    # 空闲时每 5 秒轮询一次
  IDLE_TIMEOUT = 60    # 空闲最多等 60 秒，超时则关机


  # ============================================================
  # 队友循环：WORK + IDLE 双阶段
  # ============================================================

  def _loop(self, name, role, prompt):
      """
      队友的主循环，分两个阶段：

      WORK 阶段：标准 agent loop，调用工具完成任务
      IDLE 阶段：轮询收件箱和任务看板，有活就继续干

      与 s09 的区别：s09 的队友干完活就 idle 等死，
      s11 的队友 idle 时主动找活干。
      """
      while True:

          # ==================================================
          # WORK PHASE：干活
          # ==================================================
          messages = [{"role": "user", "content": prompt}]

          # 身份重注入：上下文过短说明发生了压缩（s06）
          # 压缩后 messages 被替换为摘要，长度通常 ≤ 3
          if len(messages) <= 3:
              messages.insert(0, {
                  "role": "user",
                  "content": (
                      f"<identity>You are '{name}', role: {role}, "
                      f"team: {team_name}. Continue your work.</identity>"
                  ),
              })
              messages.insert(1, {
                  "role": "assistant",
                  "content": f"I am {name}. Continuing.",
              })

          for _ in range(50):  # 安全阀
              response = client.messages.create(
                  model=MODEL, system=SYSTEM,
                  messages=messages,
                  tools=CHILD_TOOLS,
                  max_tokens=8000,
              )
              messages.append({
                  "role": "assistant",
                  "content": response.content,
              })

              if response.stop_reason != "tool_use":
                  break

              # 执行工具...
              # 如果模型主动调用了 idle 工具，也退出 WORK 阶段
              if idle_requested:
                  break

          # ==================================================
          # IDLE PHASE：等活 / 找活
          # ==================================================
          self._set_status(name, "idle")

          # 轮询收件箱和任务看板，有活就恢复 WORK
          resume = self._idle_poll(name, messages)

          if not resume:
              # 超时没人派活，也没有可认领的任务 → 关机
              self._set_status(name, "shutdown")
              return

          # 有活干了，回到 WORK 阶段
          self._set_status(name, "working")


  # ============================================================
  # IDLE 轮询：收件箱 + 任务看板
  # ============================================================

  def _idle_poll(self, name, messages):
      """
      空闲阶段的核心逻辑：每 5 秒检查一次，有三个退出条件。

      优先级：
      1. 收件箱有消息 → 立即恢复工作（被指派的任务优先）
      2. 看板有未认领任务 → 认领并恢复工作（自主找活）
      3. 60 秒超时 → 关机（节省资源）

      返回 True = 恢复 WORK，False = 超时关机。
      """
      # 60s / 5s = 12 次轮询
      for _ in range(IDLE_TIMEOUT // POLL_INTERVAL):
          time.sleep(POLL_INTERVAL)

          # ---- 检查 1：收件箱 ----
          inbox = BUS.read_inbox(name)
          if inbox:
              # 有人给我发消息了，注入上下文，恢复工作
              messages.append({
                  "role": "user",
                  "content": f"<inbox>{inbox}</inbox>",
              })
              return True

          # ---- 检查 2：任务看板 ----
          unclaimed = scan_unclaimed_tasks()
          if unclaimed:
              # 找到没人认领的任务，自己认领第一个
              claim_task(unclaimed[0]["id"], name)
              # 将认领的任务注入上下文，恢复工作
              messages.append({
                  "role": "user",
                  "content": (
                      f"<auto-claimed>Task #{unclaimed[0]['id']}: "
                      f"{unclaimed[0]['subject']}</auto-claimed>"
                  ),
              })
              return True

          # ---- 什么都没有，继续等 ----

      # 超时，返回 False → 触发关机
      return False


  # ============================================================
  # 任务看板扫描：找没人认领的任务
  # ============================================================

  def scan_unclaimed_tasks() -> list:
      """
      扫描 .tasks/ 目录，找到满足以下三个条件的任务：
      1. status == "pending"        → 还没开始
      2. owner == ""                → 没人认领
      3. blockedBy 为空             → 前置依赖已完成，可以做

      这直接复用了 s07 的 TaskManager 的磁盘结构。
      """
      unclaimed = []
      for f in sorted(TASKS_DIR.glob("task_*.json")):
          task = json.loads(f.read_text())
          if (task.get("status") == "pending"
                  and not task.get("owner")      # 无人认领
                  and not task.get("blockedBy")): # 无前置阻塞
              unclaimed.append(task)
      return unclaimed


  # ============================================================
  # 身份重注入：压缩后的记忆恢复
  # ============================================================
  #
  # s06 的 auto_compact 会把所有消息替换为一段摘要。
  # 压缩后 messages 长度很短（通常 ≤ 3），此时队友可能忘了：
  #   - 自己是谁
  #   - 在哪个团队
  #   - 该干什么
  #
  # 解决：检测到压缩（len(messages) <= 3）时，
  # 在上下文开头插入身份块，让 LLM "想起来" 自己是谁。
  #
  # if len(messages) <= 3:
  #     messages.insert(0, {
  #         "role": "user",
  #         "content": (
  #             f"<identity>You are '{name}', role: {role}, "
  #             f"team: {team_name}. Continue your work.</identity>"
  #         ),
  #     })
  #     messages.insert(1, {
  #         "role": "assistant",
  #         "content": f"I am {name}. Continuing.",
  #     })

  ---
  与 s10（协议层）的对比：

  ┌──────────────┬──────────────────────────┬──────────────────────────┐
  │     对比     │        s10 协议层        │        s11 自治层        │
  ├──────────────┼──────────────────────────┼──────────────────────────┤
  │ 队友行为     │ 被动：等领导指派         │ 主动：自己找活干         │
  ├──────────────┼──────────────────────────┼──────────────────────────┤
  │ 任务分配     │ 领导手动 send            │ 队友自己 scan + claim    │
  ├──────────────┼──────────────────────────┼──────────────────────────┤
  │ 空闲时做什么 │ 等死                     │ 轮询看板和收件箱         │
  ├──────────────┼──────────────────────────┼──────────────────────────┤
  │ 扩展性       │ N 个任务需要 N 次 send   │ N 个任务，队友自己瓜分   │
  ├──────────────┼──────────────────────────┼──────────────────────────┤
  │ 关机方式     │ 领导发起握手（s10 协议） │ 超时自动关机（60s 无活） │
  ├──────────────┼──────────────────────────┼──────────────────────────┤
  │ 压缩恢复     │ 没有                     │ 身份重注入               │
  └──────────────┴──────────────────────────┴──────────────────────────┘

  任务分配对比：

  s10（手动分配）：
    lead: send("lead", "alice", "做任务 1")
    lead: send("lead", "bob",   "做任务 2")
    lead: send("lead", "carol", "做任务 3")
    → 领导必须知道谁在、谁闲、谁擅长什么
    → 10 个任务 × 3 个队友 = 领导要写 10 次 send

  s11（自组织）：
    alice: idle → scan → 认领任务 1 → WORK
    bob:   idle → scan → 认领任务 2 → WORK
    carol: idle → scan → 认领任务 3 → WORK
    → 领导只需要创建任务（task_create）
    → 队友自己瓜分，先到先得

  身份重注入解决的问题：

  s06 压缩前：
    messages = [
      {user: "你是 alice，后端开发者..."},
      {assistant: "好的，开始实现登录 API..."},
      {user: [tool_result: 文件内容]},
      {assistant: [tool_use: write_file]},
      ...30 轮对话...
    ]
    → alice 知道自己是谁

  s06 压缩后：
    messages = [
      {user: "[Compressed]\n\n对话摘要：实现了登录 API..."},
      {assistant: "Understood. Continuing."},
    ]
    → len = 2 ≤ 3 → 触发身份重注入
    → messages 变成：
    [
      {user: "<identity>You are 'alice', role: developer..."},
      {assistant: "I am alice. Continuing."},
      {user: "[Compressed]\n\n对话摘要..."},
      {assistant: "Understood. Continuing."},
    ]
    → alice 想起来了

  IDLE 阶段的三条出路：

  IDLE（每 5 秒轮询一次，最多 12 次 = 60 秒）
    │
    ├── 收件箱有消息？── 是 ──> 注入 inbox → WORK（被指派优先）
    │
    ├── 看板有未认领任务？── 是 ──> claim → 注入任务 → WORK（自主找活）
    │
    └── 60 秒超时 ──> SHUTDOWN（节省资源）

  优先级：被指派 > 自主认领 > 关机

  s07 任务图与 s11 的闭环：

  s07 创建了 DAG 任务图：
    task_1: {status: "pending", owner: "", blockedBy: []}
    task_2: {status: "pending", owner: "", blockedBy: [1]}
    task_3: {status: "pending", owner: "", blockedBy: [1]}

  s11 队友自动消费这些任务：
    alice: scan → 认领 task_1 → WORK → completed
           → _clear_dependency(1) → task_2, task_3 的 blockedBy 清空
    alice: idle → scan → 认领 task_2
    bob:   idle → scan → 认领 task_3
    alice: 完成 task_2 → idle → scan → task_4 被 blockedBy [2,3]
    bob:   完成 task_3 → _clear_dependency(3)
    alice: idle → scan → task_4 的 blockedBy 清空 → 认领 → WORK

  无需领导干预，DAG 自动驱动任务流转。

  ---
  十一层递进总结：

  s01：Agent 循环        → 模型能调用工具
  s02：工具调度 + 沙箱   → 安全地读写文件、跑命令
  s03：TodoManager       → 有条理（内存扁平列表）
  s04：子智能体          → 上下文隔离（一次性，无身份）
  s05：技能系统          → 按需加载领域知识
  s06：上下文压缩        → 三层压缩，无限会话
  s07：持久化任务图      → DAG 依赖管理
  s08：后台执行          → 慢操作不阻塞
  s09：团队协作          → 持久队友 + JSONL 邮箱
  s10：协议层            → 结构化请求-响应握手
  s11：自治层            → 队友自己看板认领，无需领导分配


#s12 worktree 和任务隔离
⏺ 以下是加完注释的完整代码及与 s11 的对比：

  # ============================================================
  # 目录隔离：git worktree + 任务绑定
  # ============================================================
  #
  # 问题：
  #   s11 中所有队友共享一个目录
  #   两个智能体同时改 config.py → 未提交改动互相污染
  #   任务板管"做什么"，但不管"在哪做"
  #
  # 解决方案：
  #   给每个任务一个独立的 git worktree 目录
  #   用任务 ID 把控制面和执行面关联起来
  #
  # Control plane (.tasks/)             Execution plane (.worktrees/)
  # +------------------+                +------------------------+
  # | task_1.json      |                | auth-refactor/         |
  # |   status: in_prog|<------>        | branch: wt/auth-refactor|
  # |   worktree: "auth"|           |   | task_id: 1             |
  # +------------------+                +------------------------+
  # | task_2.json      |                | ui-login/              |
  # |   status: pending |<------>       | branch: wt/ui-login    |
  # |   worktree: "ui"  |           |   | task_id: 2             |
  # +------------------+                +------------------------+
  #                                     |
  #                           index.json (worktree 注册表)
  #                           events.jsonl (生命周期日志)
  #
  # 状态机：
  #   Task:     pending → in_progress → completed
  #   Worktree: absent  → active      → removed | kept


  # ============================================================
  # 第一步：创建任务（s07 的 TaskManager）
  # ============================================================

  # 先把目标持久化到 .tasks/ 目录
  TASKS.create("Implement auth refactor")
  # → .tasks/task_1.json
  #   {
  #     "id": 1,
  #     "subject": "Implement auth refactor",
  #     "status": "pending",
  #     "worktree": "",         ← 还没有关联 worktree
  #     "blockedBy": [],
  #     "blocks": [],
  #     "owner": ""
  #   }


  # ============================================================
  # 第二步：创建 worktree 并绑定任务
  # ============================================================

  class WorktreeManager:
      """
      管理独立的 git worktree 目录。
      每个目录有自己的分支，互不干扰。
      """

      def create(self, name: str, task_id: int = None) -> str:
          """
          创建 worktree 并可选绑定到任务。

          实际执行：
            git worktree add -b wt/auth-refactor .worktrees/auth-refactor HEAD

          效果：
            - 创建独立目录 .worktrees/auth-refactor/
            - 创建独立分支 wt/auth-refactor
            - 目录内容和主工作区完全相同，但改动互不影响
          """
          wt_path = self.worktrees_dir / name
          branch = f"wt/{name}"

          # 创建 git worktree（隔离目录 + 独立分支）
          self._run_git([
              "worktree", "add",
              "-b", branch,        # 自动创建新分支
              str(wt_path),        # 目录位置
              "HEAD",              # 基于当前 HEAD
          ])

          # 注册到 index.json
          self.index[name] = {
              "path": str(wt_path),
              "branch": branch,
              "task_id": task_id,
              "status": "active",
          }
          self._save_index()

          # 如果指定了 task_id，双向绑定
          if task_id is not None:
              self.bind_worktree(task_id, name)

          # 记录事件
          self.events.emit("worktree.create.after", {
              "worktree": {"name": name, "branch": branch},
              "task_id": task_id,
          })

          return f"Worktree '{name}' created (branch: {branch})"

      # ----------------------------------------------------------
      # 绑定：同时写入控制面和执行面
      # ----------------------------------------------------------

      def bind_worktree(self, task_id, worktree):
          """
          双向绑定任务和 worktree。

          控制面：task_1.json 的 worktree 字段写入 worktree 名称
          执行面：index.json 中 worktree 条目写入 task_id

          副作用：如果任务还是 pending，自动推进到 in_progress
          """
          task = self._load(task_id)

          # 控制面：任务记录 worktree 名称
          task["worktree"] = worktree

          # 自动推进状态：pending → in_progress
          if task["status"] == "pending":
              task["status"] = "in_progress"

          self._save(task)

      # ----------------------------------------------------------
      # 在 worktree 中执行命令
      # ----------------------------------------------------------

      def run_in_worktree(self, name, command):
          """
          在隔离目录中执行命令。
          cwd 指向 worktree 路径，不是主工作区。
          改动只影响这个 worktree 的分支。
          """
          wt = self.index[name]
          wt_path = wt["path"]

          # cwd 是关键：命令在隔离目录中执行
          result = subprocess.run(
              command, shell=True,
              cwd=wt_path,          # ← 指向 worktree 目录
              capture_output=True,
              text=True,
              timeout=300,
          )
          return (result.stdout + result.stderr).strip()

      # ----------------------------------------------------------
      # 收尾：保留或删除
      # ----------------------------------------------------------

      def remove(self, name, force=False, complete_task=False):
          """
          删除 worktree，可选同时完成绑定的任务。

          一个调用搞定：拆除目录 + 完成任务 + 发出事件。

          参数：
            name: worktree 名称
            force: 强制删除（即使有未提交改动）
            complete_task: 是否同时将绑定任务标记为 completed
          """
          wt = self.index[name]

          # 执行 git worktree remove
          self._run_git([
              "worktree", "remove", wt["path"],
              *(["--force"] if force else []),
          ])

          # 如果绑定了任务，更新任务状态
          if complete_task and wt.get("task_id") is not None:
              # 标记任务完成（触发 s07 的依赖解除）
              self.tasks.update(wt["task_id"], status="completed")
              # 清除任务中的 worktree 字段
              self.tasks.unbind_worktree(wt["task_id"])
              # 发出事件
              self.events.emit("task.completed", {
                  "task": {"id": wt["task_id"], "status": "completed"},
                  "worktree": {"name": name, "status": "removed"},
              })

          # 更新 index.json
          del self.index[name]
          self._save_index()

      def keep(self, name):
          """
          保留 worktree 目录，供后续使用。
          例如：代码审查时需要查看 worktree 中的改动。
          """
          self.index[name]["status"] = "kept"
          self._save_index()
          self.events.emit("worktree.keep", {
              "worktree": {"name": name, "status": "kept"},
          })

      # ----------------------------------------------------------
      # 辅助方法
      # ----------------------------------------------------------

      def _run_git(self, args):
          """执行 git 命令。"""
          subprocess.run(
              ["git"] + args,
              capture_output=True, text=True,
          )

      def _save_index(self):
          """保存 worktree 注册表到 index.json。"""
          (self.worktrees_dir / "index.json").write_text(
              json.dumps(self.index, indent=2))


  # ============================================================
  # 事件流：.worktrees/events.jsonl
  # ============================================================
  #
  # 每个生命周期步骤写入一行事件：
  #
  # {
  #   "event": "worktree.remove.after",
  #   "task": {"id": 1, "status": "completed"},
  #   "worktree": {"name": "auth-refactor", "status": "removed"},
  #   "ts": 1730000000
  # }
  #
  # 事件类型：
  #   worktree.create.before / after / failed
  #   worktree.remove.before / after / failed
  #   worktree.keep
  #   task.completed
  #
  # 用途：
  #   - 审计追踪（谁在什么时候做了什么）
  #   - 崩溃恢复（从 events.jsonl 重建现场）
  #   - 调试（回溯问题的根因）


  # ============================================================
  # 崩溃恢复
  # ============================================================
  #
  # 进程崩溃后，从磁盘状态重建现场：
  #
  #   .tasks/task_*.json          → 知道有哪些任务、状态、依赖
  #   .worktrees/index.json       → 知道有哪些 worktree、绑定关系
  #   .worktrees/events.jsonl     → 知道发生了什么
  #
  # 恢复流程：
  #   1. 读 index.json → 找到所有 active worktree
  #   2. 读 task_*.json → 找到 in_progress 的任务
  #   3. 比对两侧 → 找出不一致（任务 in_progress 但 worktree 消失了）
  #   4. 根据事件日志判断最终状态
  #   5. 修复不一致，恢复执行
  #
  # 关键原则：会话记忆是易失的，磁盘状态是持久的。

  ---
  与 s11（自治层）的对比：

  ┌──────────┬──────────────────────────────────┬──────────────────────────────────────────┐
  │   对比   │            s11 自治层            │               s12 目录隔离               │
  ├──────────┼──────────────────────────────────┼──────────────────────────────────────────┤
  │ 解决什么 │ 队友怎么找活干                   │ 队友在哪里干活                           │
  ├──────────┼──────────────────────────────────┼──────────────────────────────────────────┤
  │ 并行安全 │ 不安全（共享目录，改动互相污染） │ 安全（每个任务独立目录）                 │
  ├──────────┼──────────────────────────────────┼──────────────────────────────────────────┤
  │ 文件冲突 │ A 改 config.py，B 也改 → 冲突    │ 各自 worktree，互不干扰                  │
  ├──────────┼──────────────────────────────────┼──────────────────────────────────────────┤
  │ 回滚能力 │ 差（未提交改动混在一起）         │ 好（每个 worktree 独立分支，可独立回滚） │
  ├──────────┼──────────────────────────────────┼──────────────────────────────────────────┤
  │ 任务关联 │ 无（不知道在哪执行）             │ 双向绑定（task_id ↔ worktree name）      │
  └──────────┴──────────────────────────────────┴──────────────────────────────────────────┘

  共享目录的问题（s11）vs 隔离目录（s12）：

  s11（共享目录）：
    工作区: /project/
    alice: 修改 config.py（第 10-20 行）
    bob:   也修改 config.py（第 15-25 行）
    → 冲突！alice 的改动被 bob 覆盖
    → 无法干净回滚（谁的改动是谁的？）

  s12（worktree 隔离）：
    alice: .worktrees/auth-refactor/  branch: wt/auth-refactor
           修改 config.py → 只影响这个分支
    bob:   .worktrees/ui-login/       branch: wt/ui-login
           修改 config.py → 只影响这个分支
    → 互不干扰
    → 各自回滚：git checkout wt/auth-refactor → git revert
    → 合并时才处理冲突（git merge，有标准工具）

  控制面与执行面的双向绑定：

  创建 + 绑定的完整流程：

    1. TASKS.create("Implement auth refactor")
       → .tasks/task_1.json {status: "pending", worktree: ""}

    2. WORKTREES.create("auth-refactor", task_id=1)
       → git worktree add -b wt/auth-refactor .worktrees/auth-refactor HEAD
       → index.json {auth-refactor: {branch: "wt/auth-refactor", task_id: 1}}
       → task_1.json {status: "in_progress", worktree: "auth-refactor"}
                      ↑ 自动推进

    3. alice: run_in_worktree("auth-refactor", "python -m pytest")
       → 在 .worktrees/auth-refactor/ 中跑测试
       → 主工作区不受影响

    4. 收尾（二选一）：
       a. WORKTREES.remove("auth-refactor", complete_task=True)
          → 删除目录 + task_1.status = "completed" + 依赖解除
       b. WORKTREES.keep("auth-refactor")
          → 保留目录，等代码审查后再处理

  事件流的作用：

  events.jsonl:

    {"event":"worktree.create.after", "worktree":{"name":"auth-refactor"}, "ts":1}
    {"event":"worktree.create.after", "worktree":{"name":"ui-login"},      "ts":2}
    {"event":"worktree.remove.after", "task":{"id":1,"status":"completed"},"ts":3}
    {"event":"worktree.remove.after", "task":{"id":2,"status":"completed"},"ts":4}

  崩溃恢复：
    - 进程在 ts=3 后崩溃
    - 重启后读 events.jsonl → task_1 已完成，task_2 还在 in_progress
    - 读 index.json → auth-refactor 已删除，ui-login 还在
    - 修复：task_2 的 worktree 还在，继续执行

  ---
  十二层完整递进总结：

  s01：Agent 循环        → 模型能调用工具
  s02：工具调度 + 沙箱   → 安全地读写文件、跑命令
  s03：TodoManager       → 有条理（内存扁平列表）
  s04：子智能体          → 上下文隔离（一次性，无身份）
  s05：技能系统          → 按需加载领域知识
  s06：上下文压缩        → 三层压缩，无限会话
  s07：持久化任务图      → DAG 依赖管理（协调骨架）
  s08：后台执行          → 慢操作不阻塞（线程级并行）
  s09：团队协作          → 持久队友 + JSONL 邮箱
  s10：协议层            → 结构化请求-响应握手
  s11：自治层            → 队友自己看板认领
  s12：目录隔离          → git worktree，每个任务独立目录，互不干扰

  四层架构总览：

  模型层（s01）：    基础循环 + 工具调用
   Harness 层（s02-s06）：工具安全、规划、上下文管理
     协作层（s07-s10）：任务图、后台执行、团队、协议
       执行层（s11-s12）：自治认领、目录隔离

  s12 是最终闭环：任务管目标（.tasks/），worktree 管目录（.worktrees/），按 ID 绑定。 从 s01 的单线程循环到 s12 的多 agent
  并行隔离执行，整个架构的每一层都在解决上一层留下的瓶颈。















