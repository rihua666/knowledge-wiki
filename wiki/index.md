# 个人知识库 Wiki

> 由 LLM 编译和维护的系统性知识库，基于 Karpathy 的 LLM Wiki 方法论。
> 最后更新：2026-04-08

---

## 📊 统计

- **素材总数**：19+
- **Wiki 文章**：10
- **主题分类**：6 个

---

## AI-Agent

- [[AI Agent Systems: Architectures, Applications, and Evaluation]] — ASU 综述：Agent Transformer 统一抽象，梳理架构组件/编排模式/评估挑战 (1 个源)
- [[Harness design for long-running app dev (长期应用开发的线束设计)]] — Anthropic：GAN 启发的 Generator-Evaluator 三代理架构，解决上下文焦虑和自评偏差 (1 个源)

## LLM

_暂无文章_

## 记忆系统

- [[A-Mem: 代理记忆系统]] — 基于 Zettelkasten 的动态自进化记忆系统，支持笔记构建/链接生成/记忆进化三大机制 (1 个源)

## 评估方法

- [[量化代理编码评估中的基础设施噪声]] — Anthropic：基础设施配置可导致 6% 分数波动，超过模型间真实差距 (1 个源)

## 上下文工程

- [[有效上下文工程 (Effective Context Engineering)]] — Anthropic 官方：上下文工程全指南，含 compaction/笔记/子代理三大长时任务技术 (2 个源)
- [[动态上下文发现 (Dynamic Context Discovery)]] — Cursor：预先更少上下文，Agent 按需自主提取，五项具体实践 (1 个源)

## 项目实践

- [[AgentScope Python]] — 生产级 Python Agent 框架，20.7k Stars，支持 MCP/A2A 协议 (1 个源)
- [[AgentScope Java]] — 面向 Agent 编程的 Java 框架，GraalVM 原生镜像支持，2.2k Stars (1 个源)
- [[DeerFlow]] — 字节跳动 super agent harness，Skills 按需加载 + Sub-agents + Sandbox (1 个源)
- [[Learn Claude Code]] — Agent Harness 工程教育，12 课递进体系，40.3k Stars (1 个源)

---

## 📖 使用方式

- **编译**：将素材放入 `raw/`，然后告诉我"编译知识库"
- **查询**：直接提问，我会基于 Wiki 回答
- **检查**：告诉我"检查知识库"，我会运行健康检查
