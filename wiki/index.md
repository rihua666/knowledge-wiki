# 个人知识库 Wiki

> 由 LLM 编译和维护的系统性知识库，基于 Karpathy 的 LLM Wiki 方法论。
> 最后更新：2026-04-08

---

## 📊 统计

- **素材总数**：19+
- **Wiki 文章**：19
- **主题分类**：6 个

---

## AI-Agent

- [[AI Agent Systems: Architectures, Applications, and Evaluation]] — ASU 综述：Agent Transformer 统一抽象，梳理架构组件/编排模式/评估挑战 (1 个源)
- [[Harness design for long-running app dev (长期应用开发的线束设计)]] — Anthropic：GAN 启发的 Generator-Evaluator 三代理架构，解决上下文焦虑和自评偏差 (1 个源)
- [[Writing effective tools for agents]] — Anthropic：工具是与非确定性 Agent 的契约，用 Agent 优化自己的工具 (1 个源)
- [[智能体设计模式]] — Gullí & Song：Agent 从 Level 0 到 Level 3 的分级和设计模式体系 (1 个源)
- [[LLM Agent: A Survey (北大综述)]] — 北京大学：LLM Agent 方法论、应用场景和核心挑战全面综述 (1 个源)
- [[OpenAI for Developers in 2025]] — OpenAI：Responses API、Agent SDK、Apps SDK、开放权重模型 (1 个源)

## LLM

- [[Welcome to the Era of Experience]] — David Silver & Sutton：从人类数据时代到经验时代，Agent 通过体验获得超人类能力 (1 个源)

## 记忆系统

- [[A-Mem: 代理记忆系统]] — 基于 Zettelkasten 的动态自进化记忆系统，支持笔记构建/链接生成/记忆进化 (1 个源)
- [[Memory in the Age of AI Agents: A Survey]] — 新国大综述：Token/Planar/Hierarchical 三维记忆分类框架 (1 个源)

## 评估方法

- [[量化代理编码评估中的基础设施噪声]] — Anthropic：基础设施配置可导致 6% 分数波动 (1 个源)
- [[Survey on Evaluation of LLM-based Agents]] — 希伯来大学：Agent 评估维度、方法和基准全面梳理 (1 个源)

## 上下文工程

- [[有效上下文工程 (Effective Context Engineering)]] — Anthropic 官方：compaction/笔记/子代理三大长时任务技术 (2 个源)
- [[动态上下文发现 (Dynamic Context Discovery)]] — Cursor：预先更少上下文，Agent 按需自主提取 (1 个源)
- [[AI代理的上下文工程-Manus经验]] — Manus：KV 缓存、logits 掩蔽、文件系统记忆、注意力操控四大实战技巧 (1 个源)
- [[Wide Research：超越上下文窗口]] — Manus：并行子代理架构解决幻觉阈值问题 (1 个源)

## 项目实践

- [[AgentScope Python]] — 生产级 Python Agent 框架，20.7k Stars (1 个源)
- [[AgentScope Java]] — 面向 Agent 编程的 Java 框架，2.2k Stars (1 个源)
- [[DeerFlow]] — 字节跳动 super agent harness，Skills + Sub-agents + Sandbox (1 个源)
- [[Learn Claude Code]] — Agent Harness 工程教育，40.3k Stars (1 个源)

---

## 📖 使用方式

- **编译**：将素材放入 `raw/`，然后告诉我"编译知识库"
- **查询**：直接提问，我会基于 Wiki 回答
- **检查**：告诉我"检查知识库"，我会运行健康检查
