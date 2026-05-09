---
type: summary
title: Agent Harness 项目地图
category: AI-Agent
tags: agent-harness, projects, ecosystem, orchestration, guardrails, memory, evaluation
created: 2026-05-08
updated: 2026-05-08
confidence: mixed
---

# Agent Harness 项目地图

> 从 Harness 本质出发梳理的开源项目全景。"如果你不是模型，你就是 harness。"——Vivek Trivedy（LangChain）
> 
> 以下项目不一定自称"harness"，但本质上都在解决同一个问题：**约束、编排、验证、持久化 AI agent 的行为**。

## 分类总览

| 类别 | 数量 | 代表项目 |
|------|------|----------|
| 通用编排框架 | 8 | LangChain, CrewAI, OpenAgents, AG2 |
| Coding Agent Harness | 7 | Claude Code, DeerFlow, Goose, OpenCode |
| 多智能体编排 | 6 | MetaGPT, Ruflo, Open-Multi-Agent |
| Agent 记忆与状态 | 6 | Mem0, MemOS, Claude-Mem, SuperMemory |
| 浏览器/Computer Use | 4 | Browser-Use, CUA, Nanobrowser |
| 评估与基准 | 5 | AgentBench, CUA Bench, SWE-bench |
| 领域特定 Harness | 8 | MiroThinker, BettaFish, Vibe-Trading |
| Agent 基础设施 | 5 | Daytona, E2B, Firecrawl, MCP |

---

## 一、通用编排框架

这些项目提供构建 agent harness 的基础构件——编排循环、工具注册、状态管理、错误处理等。

### LangChain / LangGraph
- **GitHub**: [langchain-ai/langchain](https://github.com/langchain-ai/langchain) — 136k⭐
- **本质**: Agent 工程平台，提供"如果你不是模型你就是 harness"的所有组件
- **Harness 组件**: 编排循环、工具、记忆、上下文管理、状态管理、错误处理、防护栏、子智能体编排
- **备注**: LangGraph 是其图执行引擎，专为有状态多 agent 工作流设计

### CrewAI
- **GitHub**: [crewAIInc/crewAI](https://github.com/crewAIInc/crewAI)
- **本质**: 角色扮演式多 agent 编排框架，让 agent 像团队一样协作
- **Harness 组件**: 编排循环、工具、记忆、子智能体编排、验证循环
- **备注**: 强调"角色定义+任务委派"模式，适合业务流程自动化

### Pydantic AI
- **GitHub**: [pydantic/pydantic-ai](https://github.com/pydantic/pydantic-ai) — 16.9k⭐
- **本质**: 以类型安全为核心的 agent 框架
- **Harness 组件**: 工具、输出解析、状态管理、防护栏（类型验证即防护栏）
- **备注**: 利用 Python 类型系统在编译时约束 agent 行为

### Google ADK (Agent Development Kit)
- **GitHub**: [google/adk-python](https://github.com/google/adk-python)
- **本质**: Google 官方的代码优先 agent 构建工具包
- **Harness 组件**: 编排循环、工具、评估、部署

### Microsoft Agent Framework
- **GitHub**: [microsoft/agent-framework](https://github.com/microsoft/agent-framework) — 10.2k⭐
- **本质**: 微软的企业级 agent 框架，支持 Python 和 .NET
- **Harness 组件**: 编排循环、工具、子智能体编排、部署

### AG2 (原 AutoGen)
- **GitHub**: [ag2ai/ag2](https://github.com/ag2ai/ag2) — 4.5k⭐
- **本质**: 开源 AgentOS，多 agent 对话框架
- **Harness 组件**: 编排循环、工具、子智能体编排、上下文管理
- **备注**: 微软 AutoGen 的社区延续版本

### OpenAgents (OpenFang)
- **GitHub**: [RightNow-AI/openfang](https://github.com/RightNow-AI/openfang) — 17.3k⭐
- **本质**: 开源 Agent 操作系统
- **Harness 组件**: 编排循环、工具、记忆、上下文管理、MCP 集成
- **备注**: Rust 构建，强调操作系统级抽象

### Upsonic
- **GitHub**: [Upsonic/Upsonic](https://github.com/Upsonic/Upsonic) — 7.8k⭐
- **本质**: 面向可靠性的自主 agent 构建框架
- **Harness 组件**: 编排循环、工具、防护栏、MCP 集成

---

## 二、Coding Agent Harness

这些项目专门为软件开发场景设计 harness——代码生成、审查、测试、部署的完整约束系统。

### Claude Code
- **开发者**: Anthropic
- **本质**: 终端内的自主编码 agent，harness 厚度持续变薄（随模型增强而删除复杂逻辑）
- **Harness 组件**: 编排循环、工具（6类）、上下文管理、状态管理（git 检查点）、错误处理、防护栏（~40个离散能力）、验证循环、子智能体（Fork/Teammate/Worktree）
- **备注**: Anthropic 的"harness 厚度"哲学——模型越强，harness 越薄

### DeerFlow
- **GitHub**: [bytedance/deer-flow](https://github.com/bytedance/deer-flow) — 66k⭐
- **本质**: 长周期 SuperAgent harness，处理分钟到小时级别的任务
- **Harness 组件**: 编排循环、沙箱、记忆、工具、Skill、子智能体、消息网关
- **备注**: 自称"SuperAgent harness"，是目前最大的开源 harness 项目之一

### Goose
- **GitHub**: [aaif-goose/goose](https://github.com/aaif-goose/goose)
- **本质**: 可扩展的开源编码 agent，超越代码补全
- **Harness 组件**: 编排循环、工具、状态管理、验证循环

### Gemini CLI
- **GitHub**: [google-gemini/gemini-cli](https://github.com/google-gemini/gemini-cli)
- **本质**: Google 的终端 AI agent
- **Harness 组件**: 编排循环、工具、上下文管理

### Everything-Claude-Code
- **GitHub**: [affaan-m/everything-claude-code](https://github.com/affaan-m/everything-claude-code) — 175k⭐
- **本质**: Agent harness 性能优化系统——Skills、instincts、记忆、安全
- **Harness 组件**: 记忆、防护栏、工具（Skills）、提示词构建
- **备注**: 跨工具（Claude Code/Codex/Opencode/Cursor）的 harness 增强

### OpenCode
- **GitHub**: [opencode-ai/opencode](https://github.com/opencode-ai/opencode)
- **本质**: 终端内的 AI 编码 agent
- **Harness 组件**: 编排循环、工具、上下文管理

### Claude Code Agents
- **GitHub**: [undeadlist/claude-code-agents](https://github.com/undeadlist/claude-code-agents)
- **本质**: Claude Code 子 agent 提示模板——并行审查、自动修复循环
- **Harness 组件**: 子智能体编排、验证循环
- **备注**: 展示了 harness 中"验证循环"的轻量实现

---

## 三、多智能体编排

这些项目专注于多 agent 之间的协调、任务分发和冲突解决。

### MetaGPT
- **GitHub**: [FoundationAgents/MetaGPT](https://github.com/FoundationAgents/MetaGPT) — 67.8k⭐
- **本质**: 多 agent 软件公司——用自然语言编程
- **Harness 组件**: 编排循环、工具、子智能体编排、状态管理、验证循环
- **备注**: 将软件开发流程（PM→架构→工程→QA）编码为 agent 协作

### Ruflo
- **GitHub**: [ruvnet/ruflo](https://github.com/ruvnet/ruflo) — 46.3k⭐
- **本质**: Claude 原生的 agent 编排平台，支持蜂群智能
- **Harness 组件**: 编排循环、工具、子智能体编排、记忆（RAG）、验证循环
- **备注**: 自学习蜂群智能 + 企业级架构

### Open-Multi-Agent
- **GitHub**: [JackChen-me/open-multi-agent](https://github.com/JackChen-me/open-multi-agent) — 6.1k⭐
- **本质**: 从目标到任务 DAG 的自动化多 agent 编排
- **Harness 组件**: 编排循环、工具（MCP）、子智能体编排、状态管理
- **备注**: 仅 3 个运行时依赖，极简设计

### Hive
- **GitHub**: [aden-hive/hive](https://github.com/aden-hive/hive) — 10.3k⭐
- **本质**: 面向生产 AI 的多 agent harness
- **Harness 组件**: 编排循环、工具、记忆、错误处理、防护栏

### IntentKit
- **GitHub**: [crestalnetwork/intentkit](https://github.com/crestalnetwork/intentkit) — 6.5k⭐
- **本质**: 自托管的云 agent 集群，管理协作 AI agent 团队
- **Harness 组件**: 编排循环、工具、子智能体编排、状态管理
- **备注**: Web3/区块链领域的 agent harness

### Agent-Orchestrator (Composio)
- **GitHub**: [ComposioHQ/agent-orchestrator](https://github.com/ComposioHQ/agent-orchestrator)
- **本质**: 并行编码 agent 的编排器——自动处理 CI 修复、合并冲突、代码审查
- **Harness 组件**: 编排循环、子智能体编排、验证循环、错误处理
- **备注**: 展示了 coding harness 中"自动纠错闭环"的设计

---

## 四、Agent 记忆与状态持久化

这些项目解决 agent 的"关窗即失"问题——给 agent 加上持久记忆和跨会话状态。

### Mem0
- **GitHub**: [mem0ai/mem0](https://github.com/mem0ai/mem0)
- **本质**: AI Agent 的通用记忆层
- **Harness 组件**: 记忆、上下文管理、状态管理
- **备注**: 市场份额最大的 agent 记忆方案

### MemOS
- **GitHub**: [MemTensor/MemOS](https://github.com/MemTensor/MemOS)
- **本质**: 自演化记忆操作系统，token 节省 35.24%
- **Harness 组件**: 记忆、上下文管理、状态管理
- **备注**: 混合检索 + 跨任务 skill 复用

### Claude-Mem
- **GitHub**: [thedotmack/claude-mem](https://github.com/thedotmack/claude-mem)
- **本质**: Claude Code 插件——自动捕获编码会话、压缩并注入未来会话
- **Harness 组件**: 记忆、上下文管理、提示词构建
- **备注**: 展示了 harness 记忆层的轻量实现

### SuperMemory
- **GitHub**: [supermemoryai/supermemory](https://github.com/supermemoryai/supermemory)
- **本质**: 极速可扩展的记忆引擎和 API
- **Harness 组件**: 记忆、上下文管理

### Honcho
- **GitHub**: [plastic-labs/honcho](https://github.com/plastic-labs/honcho)
- **本质**: 构建有状态 agent 的记忆库
- **Harness 组件**: 记忆、状态管理

### EverOS
- **GitHub**: [EverMind-AI/EverOS](https://github.com/EverMind-AI/EverOS)
- **本质**: 为自演化 agent 构建长期记忆
- **Harness 组件**: 记忆、验证循环、上下文管理

---

## 五、浏览器 / Computer Use Agent

这些项目给 agent 加上"眼睛和手"——视觉感知 + 操作执行。

### Browser-Use
- **GitHub**: [browser-use/browser-use](https://github.com/browser-use/browser-use)
- **本质**: 让网站对 AI agent 可访问，在线自动化
- **Harness 组件**: 工具、编排循环、验证循环
- **备注**: 最流行的浏览器自动化 agent

### CUA (Computer Use Agents)
- **GitHub**: [trycua/cua](https://github.com/trycua/cua) — 15.7k⭐
- **本质**: Computer Use Agent 的开源基础设施——沙箱、SDK 和基准
- **Harness 组件**: 工具、沙箱、评估、验证循环
- **备注**: 横跨 macOS/Windows 的全栈 computer use 方案

### Nanobrowser
- **GitHub**: [nanobrowser/nanobrowser](https://github.com/nanobrowser/nanobrowser)
- **本质**: Chrome 扩展，多 agent 工作流驱动 Web 自动化
- **Harness 组件**: 工具、子智能体编排、编排循环
- **备注**: OpenAI Operator 的开源替代

---

## 六、评估与基准

这些项目本身是 harness 的"验证循环"组件——评估 agent 能力的系统。

### AgentBench
- **GitHub**: [THUDM/AgentBench](https://github.com/THUDM/AgentBench) — 3.4k⭐
- **本质**: 全面评估 LLM 作为 Agent 的基准（ICLR'24）
- **Harness 组件**: 验证循环、评估

### SWE-bench
- **GitHub**: [princeton-nlp/SWE-bench](https://github.com/princeton-nlp/SWE-bench)
- **本质**: 评估 agent 解决真实 GitHub issue 能力的基准
- **Harness 组件**: 验证循环、评估
- **备注**: coding agent 的"高考"

### Agents-Towards-Production
- **GitHub**: [NirDiamant/agents-towards-production](https://github.com/NirDiamant/agents-towards-production) — 19.1k⭐
- **本质**: 从原型到企业部署的 agent 工程教程
- **Harness 组件**: 全部 12 组件的实践指南
- **备注**: 教程型项目，涵盖 harness 所有方面

### GenAI Agents
- **GitHub**: [NirDiamant/GenAI_Agents](https://github.com/NirDiamant/GenAI_Agents)
- **本质**: 50+ agent 技术教程和实现
- **Harness 组件**: 编排循环、工具、记忆、子智能体编排

---

## 七、领域特定 Harness

这些项目展示了 harness 在不同行业的应用——本质相同，外壳不同。

### MiroThinker / MiroFlow（深度研究）
- **GitHub**: [MiroMindAI/MiroThinker](https://github.com/MiroMindAI/MiroThinker) — 8.2k⭐ / [MiroFlow](https://github.com/MiroMindAI/MiroFlow) — 3k⭐
- **本质**: 深度研究和预测 agent，BrowseComp 74.0 分
- **Harness 组件**: 编排循环、工具、验证循环、评估

### BettaFish（舆情分析）
- **GitHub**: [666ghj/BettaFish](https://github.com/666ghj/BettaFish) — 40.8k⭐
- **本质**: 多 Agent 舆情分析助手，不依赖任何框架从 0 实现
- **Harness 组件**: 编排循环、工具、记忆、子智能体编排
- **备注**: 展示了不用框架自建 harness 的路径

### CowAgent / chatgpt-on-wechat（对话 agent）
- **GitHub**: [zhayujie/CowAgent](https://github.com/zhayujie/CowAgent)
- **本质**: 超级 AI 助理——主动思考、任务规划、操作系统访问、长期记忆
- **Harness 组件**: 编排循环、工具、记忆、状态管理、Skill 系统
- **备注**: 支持微信/飞书/钉钉/企微/QQ 等多平台接入

### AgentScope（通用 agent 平台）
- **GitHub**: [agentscope-ai/agentscope](https://github.com/agentscope-ai/agentscope)
- **本质**: 构建可看见、可理解、可信任的 agent
- **Harness 组件**: 编排循环、工具、记忆、验证循环、子智能体编排

### PraisonAI（自动化工作力）
- **GitHub**: [MervinPraison/PraisonAI](https://github.com/MervinPraison/PraisonAI)
- **本质**: 24/7 AI 工作团队——自主研究、规划、编码、执行
- **Harness 组件**: 编排循环、工具、记忆（RAG）、子智能体编排
- **备注**: 5 行代码部署，100+ LLM 支持

### Vibe-Trading（金融交易）
- **GitHub**: [HKUDS/Vibe-Trading](https://github.com/HKUDS/Vibe-Trading)
- **本质**: 个人交易 agent
- **Harness 组件**: 编排循环、工具、验证循环、防护栏

### Evolver（自演化引擎）
- **GitHub**: [EvoMap/evolver](https://github.com/EvoMap/evolver) — 7.3k⭐
- **本质**: GEP 驱动的 agent 自演化引擎——基因、胶囊、事件的可审计演化
- **Harness 组件**: 状态管理、验证循环、上下文管理

### Astron-Agent（企业级）
- **GitHub**: [iflytek/astron-agent](https://github.com/iflytek/astron-agent)
- **本质**: 科大讯飞的企业级 agentic workflow 平台
- **Harness 组件**: 编排循环、工具、状态管理、验证循环、子智能体编排
- **备注**: 商业友好的企业级方案

---

## 八、Agent 基础设施

这些项目不直接是 agent，但为 agent harness 提供关键基础设施层。

### Daytona（沙箱）
- **GitHub**: [daytonaio/daytona](https://github.com/daytonaio/daytona)
- **本质**: 安全弹性基础设施，运行 AI 生成的代码
- **Harness 组件**: 沙箱（验证循环的一部分）

### Firecrawl（数据采集）
- **GitHub**: [firecrawl/firecrawl](https://github.com/firecrawl/firecrawl)
- **本质**: 搜索、抓取和与 Web 交互的 API
- **Harness 组件**: 工具（Web 访问能力）

### MCP (Model Context Protocol)
- **本质**: Agent 工具调用的标准化协议
- **Harness 组件**: 工具集成层
- **备注**: 被大量 harness 项目采纳为工具接入标准

### AgentSkill / Vibe-Skills
- **GitHub**: [foryourhealth111-pixel/Vibe-Skills](https://github.com/foryourhealth111-pixel/Vibe-Skills) — 2k⭐
- **本质**: 一体化 AI skill 包——将专家能力集成到任何 agent
- **Harness 组件**: 工具、上下文管理、提示词构建

---

## 从项目看 Harness 的共性

无论名称和领域如何不同，以上项目都在构建以下核心能力：

1. **编排循环**: Agent 的"心跳"——观察→思考→行动的循环
2. **工具**: Agent 的"手"——与外部世界交互的接口
3. **记忆**: Agent 的"长期记忆"——跨会话持久化状态
4. **上下文管理**: Agent 的"工作台"——在有限窗口内管理信息
5. **验证循环**: Agent 的"镜子"——独立评估产出质量
6. **防护栏**: Agent 的"围栏"——防止越界行为
7. **子智能体编排**: Agent 的"团队协作"——任务分发与协调

## 与其他主题的关系

- [[Agent-Harness十二组件]] — Harness 的 12 个组件详解
- [[Agent-Harness驯化范式]] — Harness 的商业与社会层面
- [[Harness-Design]] — Anthropic 三代理架构设计
- [[设计模式]] — 更广泛的 Agent 架构模式
- [[🏠项目实践]] — 项目实践索引

## 来源

- GitHub Topics: agent-framework, ai-agents, multi-agent, agent-memory
- GitHub Search: agent evaluation benchmark, agent sandbox code execution
- 各项目 README 和描述
- 数据采集时间: 2026-05-08
