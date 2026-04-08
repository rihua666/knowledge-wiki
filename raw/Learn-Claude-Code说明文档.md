# Learn Claude Code 说明文档

## 目录

- [项目概述](#项目概述)
- [快速开始](#快速开始)
- [核心概念](#核心概念)
- [课程体系 (s01-s12)](#课程体系-s01-s12)
- [技术架构](#技术架构)
- [Python SDK 调用](#python-sdk-调用)
- [Web 平台](#web-平台)
- [项目文件结构](#项目文件结构)
- [相关产品](#相关产品)
- [故障排查](#故障排查)
- [相关文档](#相关文档)

---

## 项目概述

Learn Claude Code 是一个面向 Agent Harness 工程的学习项目，专注于构建围绕 AI Agent 模型的工作环境。该项目不是教你用 Claude Code，而是教你理解并实现 Claude Code 背后的 harness 机制。

- **项目地址**: https://github.com/shareAI-lab/learn-claude-code
- **当前版本**: 主分支 (活跃维护)
- **许可证**: MIT License
- **Stars**: 40.3k
- **Forks**: 6.3k

### 核心理念

> **"模型就是 Agent。代码是 Harness。造好 Harness，Agent 会完成剩下的。"**

- **Agent 是模型**：不是框架，不是提示词链，是经过训练能够感知环境、推理目标、采取行动的神经网络
- **Harness 是环境**：为 Agent 提供工具、知识、上下文管理、权限控制的工作环境
- **Agent 不是工具的堆叠**：那些用 if-else、节点图、硬编码路由把 LLM API 调用串在一起的不是 Agent，是过度工程化的 shell 脚本

### 愿景

用真正的 Agent 铺满宇宙。每一个需要感知、推理和执行的领域，都可以是 Agent 的运作场：
- 庄园管理 Agent = 模型 + 物业传感器 + 维护工具 + 租户通信
- 农业 Agent = 模型 + 土壤/气象数据 + 灌溉控制 + 作物知识
- 酒店运营 Agent = 模型 + 预订系统 + 客户渠道 + 设施 API
- 医学研究 Agent = 模型 + 文献检索 + 实验仪器 + 协议文档

---

## 快速开始

### 1. 环境要求

- Python 3.10+
- pip
- Node.js 18+ (用于 Web 平台)

### 2. 安装步骤

```bash
# 克隆项目
git clone https://github.com/shareAI-lab/learn-claude-code.git
cd learn-claude-code

# 安装依赖
pip install -r requirements.txt

# 复制环境配置文件
cp .env.example .env

# 编辑 .env 填入你的 API Key
# ANTHROPIC_API_KEY=your-key
```

### 3. 运行课程

```bash
# 从第一个课程开始
python agents/s01_agent_loop.py

# 完整递进终点
python agents/s12_worktree_task_isolation.py

# 全部机制合一
python agents/s_full.py
```

### 4. 启动 Web 平台（可选）

```bash
cd web
npm install
npm run dev
# 访问 http://localhost:3000
```

---

## 核心概念

### 最小 Agent 循环

```python
def agent_loop(messages):
    while True:
        response = client.messages.create(
            model=MODEL, system=SYSTEM,
            messages=messages, tools=TOOLS,
        )
        messages.append({"role": "assistant",
                         "content": response.content})

        if response.stop_reason != "tool_use":
            return

        results = []
        for block in response.content:
            if block.type == "tool_use":
                output = TOOL_HANDLERS[block.name](**block.input)
                results.append({
                    "type": "tool_result",
                    "tool_use_id": block.id,
                    "content": output,
                })
        messages.append({"role": "user", "content": results})
```

### Harness 组成

```
Harness = Tools + Knowledge + Observation + Action Interfaces + Permissions

    Tools:          文件读写、Shell、网络、数据库、浏览器
    Knowledge:      产品文档、领域资料、API 规范、风格指南
    Observation:    git diff、错误日志、浏览器状态、传感器数据
    Action:         CLI 命令、API 调用、UI 交互
    Permissions:    沙箱隔离、审批流程、信任边界
```

### Harness 工程师的职责

1. **实现工具** - 给 Agent 一双手（文件读写、Shell 执行、API 调用等）
2. **策划知识** - 给 Agent 领域专长（按需加载，不要前置塞入）
3. **管理上下文** - 给 Agent 干净的记忆（子 Agent 隔离、上下文压缩）
4. **控制权限** - 给 Agent 边界（沙箱化、审批流程、信任边界）
5. **收集任务过程数据** - 为训练下一代 Agent 提供原材料

---

## 课程体系 (s01-s12)

### 第一阶段：循环

| 课程 | 主题 | 格言 | 工具数 |
|------|------|------|--------|
| s01 | Agent 循环 | *One loop & Bash is all you need* | [1] |
| s02 | Tool Use | *加一个工具, 只加一个 handler* | [4] |

### 第二阶段：规划与知识

| 课程 | 主题 | 格言 | 工具数 |
|------|------|------|--------|
| s03 | TodoWrite | *没有计划的 agent 走哪算哪* | [5] |
| s04 | 子智能体 | *大任务拆小, 每个小任务干净的上下文* | [5] |
| s05 | Skills | *用到什么知识, 临时加载什么知识* | [5] |
| s06 | Context Compact | *上下文总会满, 要有办法腾地方* | [5] |

### 第三阶段：持久化

| 课程 | 主题 | 格言 | 工具数 |
|------|------|------|--------|
| s07 | 任务系统 | *大目标要拆成小任务, 排好序, 记在磁盘上* | [8] |
| s08 | 后台任务 | *慢操作丢后台, agent 继续想下一步* | [6] |

### 第四阶段：团队

| 课程 | 主题 | 格言 | 工具数 |
|------|------|------|--------|
| s09 | 智能体团队 | *任务太大一个人干不完, 要能分给队友* | [9] |
| s10 | 团队协议 | *队友之间要有统一的沟通规矩* | [12] |
| s11 | 自治智能体 | *队友自己看看板, 有活就认领* | [14] |
| s12 | Worktree 隔离 | *各干各的目录, 互不干扰* | [16] |

### 课程详细介绍

#### s01 - Agent 循环
最小循环：`while True + stop_reason` 判断。Agent 自己决定何时调用工具、何时停止。

#### s02 - Tool Use
工具注册机制：循环不变，新工具注册进 dispatch map 即可。

#### s03 - TodoWrite
任务规划：Agent 先列步骤再动手，完成率翻倍。

#### s04 - 子智能体
上下文隔离：子 Agent 用独立 messages[]，不污染主对话。

#### s05 - Skills
按需加载知识：SKILL.md 通过 tool_result 注入，不塞 system prompt。

#### s06 - Context Compact
上下文压缩：三层压缩策略，换来无限会话。

#### s07 - 任务系统
持久化任务：文件持久化 CRUD + 依赖图，为多 Agent 协作打基础。

#### s08 - 后台任务
异步执行：守护线程 + 通知队列，Agent 继续想下一步。

#### s09 - 智能体团队
多 Agent 协作：队友 + JSONL 邮箱，任务分配给队友。

#### s10 - 团队协议
通信规范：Request-Response 模式驱动所有协商。

#### s11 - 自治智能体
自组织：空闲轮询 + 自动认领，不需要领导逐个分配。

#### s12 - Worktree 隔离
并行执行：任务管目标，worktree 管目录，按 ID 绑定。

---

## 技术架构

- **编程语言**: Python (核心实现), TypeScript (Web 平台)
- **依赖管理**: pip, npm
- **Agent 模型**: Anthropic Claude (可适配其他模型)
- **多语言文档**: English, 中文, 日本語

---

## Python SDK 调用

### 基础 Agent 循环

```python
from anthropic import Anthropic

client = Anthropic(api_key=os.environ["ANTHROPIC_API_KEY"])

TOOLS = [...]  # 工具定义
SYSTEM = "You are a helpful assistant."

def agent_loop(messages):
    while True:
        response = client.messages.create(
            model="claude-sonnet-4-20250514",
            system=SYSTEM,
            messages=messages,
            tools=TOOLS,
        )
        
        if response.stop_reason != "tool_use":
            return response.content[0].text
        
        # 执行工具
        results = []
        for block in response.content:
            if block.type == "tool_use":
                output = execute_tool(block.name, block.input)
                results.append({
                    "type": "tool_result",
                    "tool_use_id": block.id,
                    "content": output,
                })
        
        messages.append({"role": "user", "content": results})
```

### 工具定义示例

```python
BASH_TOOL = {
    "name": "bash",
    "description": "Execute shell commands",
    "input_schema": {
        "type": "object",
        "properties": {
            "command": {"type": "string", "description": "Shell command to execute"}
        },
        "required": ["command"]
    }
}

READ_TOOL = {
    "name": "read",
    "description": "Read file contents",
    "input_schema": {
        "type": "object",
        "properties": {
            "file_path": {"type": "string", "description": "Path to file"}
        },
        "required": ["file_path"]
    }
}
```

### 子 Agent 隔离实现

```python
def create_subagent(system_prompt, tools):
    """创建独立上下文的子 Agent"""
    return {
        "messages": [],
        "system": system_prompt,
        "tools": tools,
        "name": f"subagent_{uuid.uuid4().hex[:8]}"
    }
```

---

## Web 平台

交互式可视化学习平台，包含：
- 分步动画演示
- 源码查看器
- 每个课程的详细文档

启动方式：
```bash
cd web
npm install
npm run dev
# 访问 http://localhost:3000
```

---

## 项目文件结构

```
learn-claude-code/
|
|-- agents/                    # Python 参考实现
|   |-- s01_agent_loop.py      # 第一个课程
|   |-- s02_tool_use.py        # 第二个课程
|   |-- ...
|   |-- s12_worktree_task_isolation.py  # 完整递进终点
|   |-- s_full.py              # 全部机制合一
|
|-- docs/                      # 文档
|   |-- zh/                    # 中文文档
|   |   |-- s01-the-agent-loop.md
|   |   |-- s02-tool-use.md
|   |   |-- ...
|   |-- en/                    # 英文文档
|   |-- ja/                    # 日文文档
|
|-- web/                       # 交互式学习平台 (Next.js)
|   |-- src/
|   |-- package.json
|   |-- ...
|
|-- skills/                    # s05 的 Skill 文件
|   |-- *.md
|
|-- requirements.txt           # Python 依赖
|-- .env.example               # 环境变量示例
|-- pyproject.toml             # 项目配置
```

---

## 相关产品

### Kode Agent CLI

开源 Coding Agent CLI：

```bash
npm i -g @shareai-lab/kode
```

特性：
- 支持 Skill & LSP
- 适配 Windows
- 可接 GLM / MiniMax / DeepSeek 等开放模型
- 装完即用

GitHub: **[shareAI-lab/Kode-cli](https://github.com/shareAI-lab/Kode-cli)**

### Kode Agent SDK

把 Agent 能力嵌入你的应用：

- 独立库，无 per-user 进程开销
- 可嵌入后端、浏览器插件、嵌入式设备等

GitHub: **[shareAI-lab/Kode-agent-sdk](https://github.com/shareAI-lab/Kode-agent-sdk)**

### 姊妹教程: claw0

从"被动临时会话"到"主动常驻助手"的教学仓库：

```
claw agent = agent core + heartbeat + cron + IM chat + memory + soul
```

- **心跳 (Heartbeat)** - 每 30 秒让 Agent 检查有没有事可做
- **定时任务 (Cron)** - Agent 可以给自己安排未来要做的事
- **IM 多通道** - 支持 WhatsApp/Telegram/Slack/Discord 等 13+ 平台
- **Soul 人格系统** - Agent 的个性化人格

GitHub: **[shareAI-lab/claw0](https://github.com/shareAI-lab/claw0)**

---

## 故障排查

### 常见问题

**1. API Key 错误**
- 检查 `.env` 文件中的 `ANTHROPIC_API_KEY` 是否正确
- 确认 API Key 有余额

**2. 依赖安装失败**
- 检查 Python 版本 (需要 3.10+)
- 尝试：`pip install --upgrade pip`

**3. Web 平台启动失败**
- 检查 Node.js 版本 (需要 18+)
- 在 web 目录下运行 `npm install`

---

## 相关文档

- [英文文档](/docs/en)
- [中文文档](/docs/zh)
- [日文文档](/docs/ja)
- [官方 GitHub](https://github.com/shareAI-lab/learn-claude-code)

---

*文档生成时间: 2026-03-27*