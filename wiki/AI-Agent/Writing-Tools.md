---
title: Writing effective tools for agents
category: AI-Agent
sources: 【25-09】【博客】Writing effective tools for agents — with agents · Anthropic.pdf
tags: tools, agent, mcp, evaluation, tool-design, optimization
created: 2026-04-08
updated: 2026-04-08
---

# Writing effective tools for agents

> 工具是与非确定性 Agent 之间的契约，需要重新设计软件思路。Anthropic 分享如何用 Agent 优化自己的工具。

## 核心内容

### 工具的本质

传统软件是确定性系统间的契约（f(x) 永远返回相同结果）。工具是**确定性系统与非确定性 Agent 之间的契约**——Agent 可能调用工具、回答一般知识、甚至先追问，偶尔会幻觉。

### 工具开发流程

1. **原型构建** — 快速实现，用 MCP Server 或 DXT 包装后在 Claude Code/Desktop 中测试
2. **评估** — 生成真实场景的评估任务，用 API 调用程序化运行，收集准确率、运行时、token 消耗等指标
3. **协作优化** — 与 Agent（如 Claude Code）协作，自动分析评估结果并迭代改进工具

### 关键原则

1. **选择正确的工具** — 决定实现和不实现什么同样重要，避免功能重叠
2. **命名空间隔离** — 为工具定义清晰的功能边界
3. **返回有意义的上下文** — 工具响应应包含 Agent 理解和后续行动所需的信息
4. **Token 效率** — 优化工具响应以减少 token 消耗
5. **提示工程工具描述** — 工具描述本身就是提示，需要精心设计

### 评估最佳实践

- 避免过于简单的"沙箱"任务，用真实复杂场景
- 好的评估任务可能需要多次工具调用（甚至几十次）
- 不要过度指定工具调用路径——可能有多种有效策略
- 让 Agent 输出推理和反馈块（触发 CoT），而不仅是结构化响应

## 关键要点

- 对 Agent 友好的工具对人类也出人意料地直观
- 工具评估应使用 held-out test set，而非在训练集上表现好
- Claude 优化后的工具准确率显著超过人工编写的版本（以 Asana MCP 工具为例）

## 与其他主题的关系

- [[有效上下文工程]] — 工具设计是上下文工程的关键组件
- [[Harness-Design]] — 工具是 Harness 的重要组成部分
- [[AI-Agent-Systems]] — 工具调用是 Agent 架构的核心
- [[DeerFlow]] — Skills 按需加载与工具设计理念一致

## 来源

- [Writing effective tools for agents — with agents](../raw/【25-09】【博客】Writing%20effective%20tools%20for%20agents%20—%20with%20agents%20·%20Anthropic.pdf) — Anthropic, 2025-09
