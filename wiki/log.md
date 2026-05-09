# 知识库操作日志

## [2026-04-03] setup | 项目初始化
- 创建 raw/wiki 目录结构
- 建立 6 个分类目录
- 收集 19+ 素材文件到 raw/
- 编写 raw/README.md

## [2026-04-08] setup | Schema 和计划
- 创建 SCHEMA.md（Wiki 配置文件）
- 创建 PROJECT_PLAN.md（项目计划）
- 安装 poppler PDF 处理工具
- 初始化 Git 仓库

## [2026-04-08] ingest | Effective context engineering for AI agents
- 生成了: [[有效上下文工程]]
- 更新了: wiki/index.md
- 分类: 上下文工程
- 来源: 2 个文件（英文原文 + 中文翻译）

## [2026-04-08] ingest | A-Mem: Agentic Memory for LLM Agents
- 生成了: [[A-Mem]]
- 更新了: wiki/index.md
- 分类: 记忆系统
- 来源: 1 个文件（89KB 论文）

## [2026-04-08] ingest | 动态上下文发现 (Cursor)
- 生成了: [[动态上下文发现]]
- 更新了: wiki/index.md
- 分类: 上下文工程
- 来源: 1 个文件

## [2026-04-08] ingest | 量化代理编码评估中的基础设施噪声 (Anthropic)
- 生成了: [[基础设施噪声]]
- 更新了: wiki/index.md
- 分类: 评估方法
- 来源: 1 个文件

## [2026-04-08] ingest | Harness design for long-running app dev (Anthropic)
- 生成了: [[Harness-Design]]
- 更新了: wiki/index.md
- 分类: AI-Agent
- 来源: 1 个文件

## [2026-04-08] ingest | AI Agent Systems: Architectures, Applications, and Evaluation (ASU)
- 生成了: [[AI-Agent-Systems]]
- 更新了: wiki/index.md
- 分类: AI-Agent
- 来源: 1 个文件（125KB 综述）

## [2026-04-08] ingest | 项目实践文档（4 篇）
- 生成了: [[AgentScope-Python]], [[AgentScope-Java]], [[DeerFlow]], [[Learn-Claude-Code]]
- 更新了: wiki/index.md
- 分类: 项目实践
- 来源: 4 个 Markdown 文档

## [2026-04-08] ingest | 第二批（3 篇）
- 生成了: [[Writing-Tools]], [[Era-of-Experience]], [[Wide-Research]]
- 更新了: wiki/index.md
- 分类: AI-Agent, LLM, 上下文工程

## [2026-04-08] ingest | 第三批（3 篇）
- 生成了: [[设计模式]], [[Manus-经验]], [[OpenAI-2025]]
- 更新了: wiki/index.md
- 分类: AI-Agent, 上下文工程

## [2026-04-08] ingest | 第四批（3 篇论文，全部素材编译完成）
- 生成了: [[LLM-Agent-Survey]], [[Evaluation-Survey]], [[Memory-Survey]]
- 更新了: wiki/index.md
- 分类: AI-Agent, 评估方法, 记忆系统
- ✅ 全部 19 篇素材编译完成

## [2026-05-07] ingest | SWE-CI 长期可维护性评估基准 + 宝玉视频转博客
- 生成了: [[SWE-CI]]
- 更新了: wiki/index.md, [[🏠评估方法]]
- 分类: 评估方法
- 来源: arXiv:2603.03823 (中山大学 + 阿里巴巴)
- 新增 raw 素材: 2026-05-06-博客-宝玉AI-视频变图文博客-Agent-豆包Seed2.0-lite.md

## [2026-04-22] update | 置信度标注系统 + Hot Cache

### 变更内容

**SCHEMA.md 新增：**
- 置信度标注系统（§ 🎯 置信度标注系统）
  - Frontmatter `confidence` 字段：high / medium / low / mixed
  - 行内标注：`[原文]` / `[推断]` / `[推测]` / `[待验证]`
  - Hub 页面特殊规则
- Lint 检查新增：置信度审计

**SKILL.md (llm-wiki) 新增：**
- Confidence Annotation 段落（frontmatter + 行内标注规则）
- Resuming 逻辑升级：hot cache 快速路径
- Lint ⑨ 新增置信度审计

**新文件：**
- `wiki/hot.md` — 会话快照缓存（~500 词），每次操作后更新

**技能更新：**
- `openclaw-wiki-compile`：增加 confidence 字段模板 + hot cache 更新步骤

### 审计结果
- 现有 51 个 wiki 页面均缺 confidence 字段（待下次批量回填）
- 0 个行内标注（新文章编译时自动生成）
