---
type: detail
title: Agent Harness 参考项目全景
category: AI-Agent
tags: agent-harness, projects, reference, open-source, multi-agent, coding-agent, memory, evaluation
created: 2026-05-08
updated: 2026-05-08
confidence: mixed
---

# Agent Harness 参考项目全景

> 从 Harness 本质出发（约束、编排、验证、持久化 Agent 行为的系统），按领域分类梳理开源参考项目。不限于名字含"harness"的项目，而是从架构本质上筛选：凡是实现了编排循环、工具集成、记忆管理、上下文控制、验证循环、安全护栏、子智能体协调等 Harness 组件的，都纳入。

## 如何使用本页

- 想了解 Harness 是什么 → 参见 [[Agent-Harness十二组件]]、[[Agent-Harness驯化范式]]
- 想了解 Harness 怎么搭建 → 关注「通用框架层」和「编码开发层」中的大型项目
- 想找特定领域的参考 → 按分类检索，每个项目标注了实现的 Harness 组件

---

## 一、通用框架层（Agent OS / Infrastructure）

这些项目是"Harness 的 Harness"——提供编排循环、状态管理、工具注册、子智能体调度等基础设施。

| 项目 | Stars | 语言 | 一句话定位 | Harness 组件覆盖 |
|------|-------|------|-----------|----------------|
| [LangChain / LangGraph](https://github.com/langchain-ai/langgraph) | 136k+ | Python/TS | Agent 工程平台，图状态机编排 | 编排✅ 工具✅ 记忆✅ 状态✅ 子智能体✅ 护栏✅ |
| [Pydantic AI](https://github.com/pydantic/pydantic-ai) | 16.9k | Python | 类型安全的 Agent 框架 | 编排✅ 工具✅ 输出解析✅ 验证✅ |
| [Microsoft Agent Framework](https://github.com/microsoft/agent-framework) | 10.2k | Python/.NET | 微软官方 Agent 编排部署框架 | 编排✅ 工具✅ 状态✅ 子智能体✅ 护栏✅ |
| [Google ADK](https://github.com/google/adk-python) | 8k+ | Python | 谷歌 Agent 开发工具包 | 编排✅ 工具✅ 评估✅ 部署✅ |
| [AG2 (ex-AutoGen)](https://github.com/ag2ai/ag2) | 4.5k | Python | 微软研究院的 AgentOS | 编排✅ 工具✅ 子智能体✅ MCP✅ |
| [CrewAI](https://github.com/crewAIInc/crewAI) | 30k+ | Python | 角色扮演式多 Agent 协作框架 | 编排✅ 工具✅ 记忆✅ 子智能体✅ |
| [OpenFang](https://github.com/RightNow-AI/openfang) | 17.3k | Rust | 开源 Agent 操作系统 | 编排✅ 工具✅ MCP✅ |
| [Spring AI Alibaba](https://github.com/alibaba/spring-ai-alibaba) | — | Java | 面向 Java 开发者的 Agentic 框架 | 编排✅ 工具✅ 部署✅ |

**搭建 Harness 的首选参考**：LangGraph（图状态机）、CrewAI（角色协作）、Google ADK（评估集成）。

---

## 二、编码开发层（Coding Agent Harness）

这些项目约束 AI 在编码场景中的行为——代码生成、审查、测试、修复循环。

| 项目 | Stars | 语言 | 一句话定位 | Harness 组件覆盖 |
|------|-------|------|-----------|----------------|
| [Claude Code](https://docs.anthropic.com/en/docs/claude-code) | — | TS | Anthropic 官方编码 Agent，Harness 设计的标杆 | 编排✅ 工具✅ 记忆✅ 上下文✅ 护栏✅ 验证✅ 子智能体✅ |
| [Gemini CLI](https://github.com/google-gemini/gemini-cli) | 大量 | Go | 谷歌终端 AI Agent | 编排✅ 工具✅ |
| [Goose](https://github.com/block/goose) | 10k+ | Go | 开源可扩展编码 Agent，任何 LLM 均可接入 | 编排✅ 工具✅ 状态✅ |
| [Everything-Claude-Code](https://github.com/affaan-m/everything-claude-code) | 175k | JS | Claude Code 性能优化系统（Skills/Instincts/Memory/Security） | 技能✅ 记忆✅ 安全✅ |
| [Learn-Claude-Code](https://github.com/anthropics/learn-claude-code) | 40.3k | — | Anthropic 官方 Agent Harness 工程教育 | 全组件教学 |
| [Oh-My-OpenAgent](https://github.com/code-yeongyu/oh-my-openagent) | — | — | "最好的 Agent Harness"，多 Agent 编排插件 | 编排✅ 工具✅ 子智能体✅ |
| [Claude-Mem](https://github.com/thedotmack/claude-mem) | — | TS | 自动捕获 Claude 编码会话，压缩后注入后续会话 | 记忆✅ 上下文✅ |
| [Agent-Orchestrator](https://github.com/ComposioHQ/agent-orchestrator) | — | TS | 并行编码 Agent 编排器，自动处理 CI 修复和合并冲突 | 编排✅ 子智能体✅ 验证✅ |
| [Daytona](https://github.com/daytonaio/daytona) | 15k+ | Go | AI 生成代码的安全执行沙箱基础设施 | 安全✅ 沙箱✅ 状态✅ |

**关键洞察**：Claude Code 是当前最完整的编码 Harness 参考。Everything-Claude-Code 展示了如何在已有 Harness 上叠加技能/记忆层。

---

## 三、多智能体编排层（Multi-Agent Orchestration）

这些项目解决"多个 Agent 如何协调完成复杂任务"——编排策略、任务分解、消息传递。

| 项目 | Stars | 语言 | 一句话定位 | Harness 组件覆盖 |
|------|-------|------|-----------|----------------|
| [DeerFlow (ByteDance)](https://github.com/bytedance/deer-flow) | 66k | Python/TS | 长周期 SuperAgent Harness，研究+编码+创作全流程 | 编排✅ 记忆✅ 工具✅ 子智能体✅ 沙箱✅ 消息网关✅ |
| [MetaGPT](https://github.com/FoundationAgents/MetaGPT) | 67.8k | Python | 多 Agent 协作框架，模拟 AI 软件公司 | 编排✅ 工具✅ 记忆✅ 子智能体✅ |
| [Ruflo](https://github.com/ruvnet/ruflo) | 46.3k | TS | Claude 多 Agent 编排平台，支持集群智能 | 编排✅ 子智能体✅ RAG✅ |
| [Open-Multi-Agent](https://github.com/JackChen-me/open-multi-agent) | 6.1k | TS | 目标→任务 DAG 自动分解，3个运行时依赖 | 编排✅ MCP✅ 追踪✅ |
| [Hive](https://github.com/aden-hive/hive) | 10.3k | Python | 面向生产的多 Agent Harness | 编排✅ 工具✅ 自动化✅ |
| [Eigent](https://github.com/eigent-ai/eigent) | 13.9k | TS | 桌面端多 Agent 协作，Claude Cowork 替代 | 编排✅ 子智能体✅ 工作流✅ |
| [Edict (三省六部制)](https://github.com/cft0808/edict) | — | — | 9 个专业 Agent + 实时仪表盘 + 审计追踪 | 编排✅ 子智能体✅ 状态✅ 审计✅ |
| [PraisonAI](https://github.com/MervinPraison/PraisonAI) | — | Python | 24/7 AI 员工，5行代码部署，内置记忆+RAG | 编排✅ 记忆✅ RAG✅ |
| [IntentKit](https://github.com/crestalnetwork/intentkit) | 6.5k | Python | 自托管云 Agent 集群，协作团队管理 | 编排✅ 子智能体✅ |
| [MCP-Agent-Orchestrator](https://github.com/ComposioHQ/agent-orchestrator) | — | — | 计划→生成→审查→修复的自动流水线 | 编排✅ 子智能体✅ 验证✅ |

**架构模式对比**：DeerFlow = 长周期流水线；MetaGPT = 角色分工模拟；Open-Multi-Agent = DAG 自动分解。

---

## 四、研究/深度搜索层（Research & Deep Search）

这些项目约束 AI 在信息检索、研究分析中的行为——多轮搜索、信息综合、报告生成。

| 项目 | Stars | 领域 | 一句话定位 | Harness 组件覆盖 |
|------|-------|------|-----------|----------------|
| [MiroThinker](https://github.com/MiroMindAI/MiroThinker) | 8.2k | 深度研究 | 复杂研究和预测任务的深度研究 Agent | 编排✅ 工具✅ 评估✅ |
| [MiroFlow](https://github.com/MiroMindAI/MiroFlow) | 3k | 研究工作流 | 5+ 基准测试 Top-1 的研究 Agent 工作流 | 编排✅ 验证✅ |
| [BettaFish (微舆)](https://github.com/666ghj/BettaFish) | 40.8k | 舆情分析 | 多 Agent 舆情分析助手，从0实现不依赖框架 | 编排✅ 工具✅ 子智能体✅ |
| [RAGFlow](https://github.com/infiniflow/ragflow) | 大量 | RAG+Agent | 融合 RAG 与 Agent 能力的上下文引擎 | 上下文✅ 检索✅ 工具✅ |
| [Wiseflow](https://github.com/TeamWiseFlow/wiseflow) | — | 商业情报 | 24/7 在线信息采集 Agent 团队 | 编排✅ 工具✅ 持久化✅ |

---

## 五、浏览器/计算机操控层（Browser & Computer Use）

这些项目约束 AI 在与数字界面交互中的行为——网页操作、桌面控制、视觉反馈循环。

| 项目 | Stars | 定位 | Harness 组件覆盖 |
|------|-------|------|----------------|
| [Browser-Use](https://github.com/browser-use/browser-use) | 大量 | 网页可访问化 AI Agent 自动化 | 编排✅ 工具✅ 验证✅ |
| [CUA](https://github.com/trycua/cua) | 15.7k | Computer-Use Agent 开源基础设施，沙箱+SDK+基准 | 编排✅ 沙箱✅ 评估✅ |
| [Nanobrowser](https://github.com/nanobrowser/nanobrowser) | — | Chrome 扩展，多 Agent 网页自动化 | 编排✅ 工具✅ |
| [Firecrawl](https://github.com/firecrawl/firecrawl) | 大量 | 网页搜索/抓取/交互 API | 工具✅ 检索✅ |

---

## 六、记忆持久化层（Agent Memory）

这些项目解决 Agent 的"记忆"问题——跨会话持久化、经验积累、知识管理。参见 [[记忆系统/🏠记忆系统]]。

| 项目 | Stars | 定位 | Harness 组件覆盖 |
|------|-------|------|----------------|
| [Mem0](https://github.com/mem0ai/mem0) | 大量 | 通用 AI Agent 记忆层 | 记忆✅ 检索✅ |
| [MemOS](https://github.com/MemTensor/MemOS) | — | 自进化记忆操作系统，节省 35.24% token | 记忆✅ 技能复用✅ |
| [SuperMemory](https://github.com/supermemoryai/supermemory) | — | 极速可扩展的记忆引擎和 API | 记忆✅ |
| [Honcho](https://github.com/plastic-labs/honcho) | — | 有状态 Agent 的记忆库 | 记忆✅ 状态✅ |
| [MCP-Memory-Service](https://github.com/doobidoo/mcp-memory-service) | — | 持久化记忆服务，知识图谱+自主整合 | 记忆✅ 知识图谱✅ |
| [MemSearch](https://github.com/zilliztech/memsearch) | — | 基于 Markdown+Milvus 的统一记忆层 | 记忆✅ 向量检索✅ |
| [EverOS](https://github.com/EverMind-AI/EverOS) | — | 构建评估集成 Agent 长期记忆 | 记忆✅ 评估✅ |

---

## 七、评估与基准层（Evaluation & Benchmark）

这些项目约束"如何验证 Agent 是否真的做好了"——基准测试、安全评估、性能排行。

| 项目 | Stars | 定位 | Harness 组件覆盖 |
|------|-------|------|----------------|
| [AgentBench](https://github.com/THUDM/AgentBench) | 3.4k | 综合评估 LLM 作为 Agent 的能力（ICLR'24） | 评估✅ 基准✅ |
| [AgentScope](https://github.com/agentscope-ai/agentscope) | 20.7k | 可视化构建运行 Agent，内置评估 | 编排✅ 工具✅ 评估✅ |
| [AgentDojo](https://github.com/ethz-spylab/agentdojo) | — | Agent 安全评估框架 | 安全✅ 评估✅ |
| [Agents-Towards-Production](https://github.com/NirDiamant/agents-towards-production) | 19.1k | 从原型到企业部署的 Agent 教程 | 评估✅ 部署✅ |

---

## 八、安全护栏层（Guardrails & Safety）

这些项目专注于约束 Agent 行为的边界——权限控制、输出过滤、安全审计。

| 项目 | 定位 | Harness 组件覆盖 |
|------|------|----------------|
| Claude Code 的 40+ 离散工具能力权限系统 | Anthropic 的权限与推理分离架构 | 护栏✅ 权限✅ |
| OpenAI 三级护栏（输入/输出/工具） | OpenAI 的 Guardrails 架构 | 护栏✅ |
| Daytona 沙箱 | AI 生成代码的隔离执行环境 | 安全✅ 沙箱✅ |
| [Arrow-JS](https://github.com/standardagents/arrow-js) | WASM 沙箱安全代码执行的 UI 框架 | 安全✅ 沙箱✅ |

---

## 九、行业垂直应用（Domain-Specific Harness）

这些项目展示了 Harness 理念在不同行业的具体实践。

### 金融交易
| 项目 | 定位 |
|------|------|
| [Vibe-Trading](https://github.com/HKUDS/Vibe-Trading) | 个人交易 Agent |
| [MiroFish](https://github.com/666ghj/MiroFish) | 群体智能预测引擎（金融预测） |

### 企业办公
| 项目 | 定位 |
|------|------|
| [CowAgent (chatgpt-on-wechat)](https://github.com/zhayujie/chatgpt-on-wechat) | 多平台 AI 助理（微信/飞书/钉钉/企微） |
| [Astron-Agent (讯飞)](https://github.com/iflytek/astron-agent) | 企业级 Agentic 工作流平台 |
| [Star-Office-UI](https://github.com/ringhyacinth/Star-Office-UI) | Agent 工作状态的可视化办公空间 |

### 技能/插件市场
| 项目 | 定位 |
|------|------|
| [Vibe-Skills](https://github.com/foryourhealth111-pixel/Vibe-Skills) | 一体化 AI 技能包，消除碎片化工具 |
| [Awesome-Claude-Skills](https://github.com/ComposioHQ/awesome-claude-code-skills) | Claude Skills 资源精选 |
| [Agency-Agents-Zh](https://github.com/jnMetaCode/agency-agents-zh) | 211 个即插即用 AI 专家角色，覆盖 18 个部门 |

### 自进化/元学习
| 项目 | 定位 |
|------|------|
| [Evolver](https://github.com/EvoMap/evolver) | GEP 驱动的 Agent 自进化引擎 |
| [Upsonic](https://github.com/Upsonic/Upsonic) | Python 自主 Agent 构建平台 |

### 训练/RL
| 项目 | 定位 |
|------|------|
| [rLLM](https://github.com/rllm-org/rllm) | 面向 LLM 的强化学习民主化 |
| [veRL-Agent](https://github.com/langfengQ/verl-agent) | veRL 扩展，RL 训练 LLM/VLM Agent |

---

## 十、Agent Harness 的三层视角

基于以上项目，可以归纳出 Harness 的三层架构：

### 第一层：通用 Harness 框架（造轮子的工具）
LangGraph、CrewAI、Google ADK、Microsoft Agent Framework

### 第二层：领域 Harness（约束特定场景的行为）
- 编码：Claude Code、DeerFlow、Goose
- 研究：MiroThinker、BettaFish
- 浏览器：Browser-Use、CUA
- 办公：CowAgent、Astron-Agent

### 第三层：Harness 组件（可插拔的能力模块）
- 记忆：Mem0、MemOS
- 评估：AgentBench、AgentScope
- 安全：Daytona、AgentDojo
- 编排：Open-Multi-Agent、Agent-Orchestrator

---

## 相关

- [[Agent-Harness十二组件]] — Harness 十二组件详解
- [[Agent-Harness驯化范式]] — Harness 驯化范式的商业与社会层面
- [[Harness-Design]] — Anthropic 三代理架构设计
- [[DeerFlow]] — 字节跳动 DeerFlow 详细分析
- [[Learn-Claude-Code]] — Anthropic 官方 Harness 教育项目
- [[ScalingManagedAgents]] — Anthropic 生产级 Managed Agents
- [[多智能体协作模式]] — 五种多智能体协作模式
- [[设计模式]] — 更广泛的 Agent 架构模式
