---
type: hub
title: AI-Agent
category: AI-Agent
tags: agent, architecture, harness, multi-agent, tool-use, design-patterns
created: 2026-04-08
updated: 2026-05-07
---

# AI-Agent

> AI Agent = LLM + 推理 + 规划 + 记忆 + 工具 + 行动。能力提升越来越多来自系统设计而非仅靠更大模型。

## 核心架构

### Agent Transformer（统一抽象）

A = (π_θ, M, T, V, E)
- **π_θ** — Transformer 策略模型（LLM/VLM）
- **M** — 记忆子系统
- **T** — 工具集
- **V** — 验证器/批评者
- **E** — 环境

执行循环：观察环境 → 检索记忆 → 提议动作 → 验证 → 执行工具 → 更新

→ 详见 [[AI-Agent-Systems]]

### 关键设计权衡

| 权衡 | 说明 |
|------|------|
| 延迟 vs 准确性 | 更多推理时间提升质量但增加延迟 |
| 自主性 vs 可控性 | 更多自主权 vs 更多人类控制 |
| 能力 vs 可靠性 | 更强模型 vs 更稳定行为 |

## Harness 设计

Harness 是 Agent 的"工作环境"——提供工具、知识、上下文管理、权限控制。

### 三代理架构

受 GAN 启发：**Planner → Generator → Evaluator**
- 解决上下文焦虑（Context Reset > Compaction）
- 解决自我评价偏差（生成者与评估者分离）
- 关键：评估标准将主观判断转化为可评分术语

→ 详见 [[Harness-Design]]

### 工具设计

工具是**确定性系统与非确定性 Agent 之间的契约**——需要重新设计软件思路：
- 选择正确的工具（和不实现的工具一样重要）
- 命名空间隔离
- 返回有意义的上下文
- Token 效率优化
- 用 Agent 自动优化工具

→ 详见 [[Writing-Tools]]

## Agent 分级与设计模式

- **Level 0**：核心推理引擎
- **Level 1**：连接型问题解决者（单 Agent + 工具）
- **Level 2**：战略型问题解决者（多步推理、规划）
- **Level 3**：协作型多智能体系统

核心模式：Prompt Chaining、Routing、上下文工程

→ 详见 [[设计模式]]

## 工具与标准生态

- **MCP (Model Context Protocol)** — 统一工具协议
- **A2A (Agent-to-Agent)** — Agent 间通信协议
- **AGENTS.md** — Agent 配置标准
- **Agent SDK** — OpenAI 的 Agent 开发工具链
- **Apps SDK** — 基于 MCP 的 UI 开发框架

→ 详见 [[OpenAI-2025]]

## Agent 范式（五种控制模式）

> 来源: [[你所不知道的Agent]]

| 范式 | 控制权 | 适合场景 |
|------|--------|--------|
| Prompt Chaining | 代码固定 | 线性流程 |
| Routing | 代码分类 | 多类型分流 |
| Parallelization | 代码编排 | 并发子任务 |
| Orchestrator-Workers | LLM 动态 | 编码/研究 |
| Evaluator-Optimizer | LLM 迭代 | 质量优化 |

**Workflow vs Agent**：路径由代码预定 = Workflow，由 LLM 动态决定 = Agent。关键不是哪个更好，而是任务适合哪种。

## Managed Agents（新）

Anthropic Claude Platform 的生产级 Agent 服务架构：
- **解耦设计**：Session / Harness / Sandbox 三组件独立替换
- **从 Pet 到 Cattle**：无状态 harness + 按需 sandbox
- **安全边界**：凭证永远不在 sandbox 可达范围
- **性能**：p50 TTFT ↓60%, p95 TTFT ↓90%

→ 详见 [[ScalingManagedAgents]]

## 细节文章

- [[你所不知道的Agent]] — Agent 范式、Harness、上下文工程、工具设计全景
- [[ScalingManagedAgents]] — Anthropic Managed Agents 架构
- [[AI-Agent-Systems]] — ASU 架构综述
- [[Harness-Design]] — Anthropic Harness 设计
- [[Writing-Tools]] — Anthropic 工具设计
- [[设计模式]] — Gullí & Song 设计模式体系
- [[LLM-Agent-Survey]] — 北大方法论综述
- [[OpenAI-2025]] — OpenAI 生态全景
- [[多智能体协作模式]] — 五种主流多智能体协作模式 ⭐新
- [[Agent-CLI设计原则]] — 面向 Agent 的 CLI 十条设计原则 ⭐新
- [[Skill-Memory工程实践]] — fireworks-skill-memory 开源 Harness 记忆工程 ⭐新
- [[AI落地与软件工厂]] — AI 落地核心命题与 L8 软件工厂 ⭐新
- [[Agent-Harness驯化范式]] — Agent Harness 驯化范式与硅谷新共识 ⭐新
- [[Agent-Harness十二组件]] — 生产级 Harness 的 12 组件与 7 大架构决策 ⭐新
- [[规范驱动开发]] — Spec-Driven Development：规范作为第一性产物的元方法论 ⭐新
- [[MCP实践指南]] — Anthropic MCP 三大优化解法与三层定位 ⭐新
- [[Claude-Code质量Postmortem]] — Anthropic 官方复盘 Claude Code 三重质量退化 ⭐新
- [[Agent-Harness参考项目]] — 从 Harness 本质出发的 50+ 开源项目全景（按领域分类） ⭐新

## 交叉引用

- [[🏠上下文工程]] — 上下文管理是 Harness 的核心
- [[🏠记忆系统]] — 记忆子系统 M 的实现
- [[🏠评估方法]] — Agent 评估的挑战和方法
- 项目实践 — Agent 框架和 Harness 的具体实现
