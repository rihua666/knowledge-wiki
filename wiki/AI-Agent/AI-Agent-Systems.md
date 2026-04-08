---
title: AI Agent Systems: Architectures, Applications, and Evaluation
category: AI-Agent
sources: 【26-01】【论文】AI Agent Systems: Architectures, Applications, and Evaluation · Arizona State University.pdf
tags: agent-architecture, survey, reasoning, planning, tool-use, multi-agent, evaluation
created: 2026-04-08
updated: 2026-04-08
---

# AI Agent Systems: Architectures, Applications, and Evaluation

> ASU 的综合性综述，系统化梳理了 AI Agent 的架构组件、编排模式、部署设置和评估方法。

## 核心内容

### Agent Transformer 定义

一个统一的 Agent 抽象：A = (π_θ, M, T, V, E)
- **π_θ** — Transformer 策略模型
- **M** — 记忆子系统（检索、摘要、状态）
- **T** — 工具集（API、代码执行、搜索、数据库）
- **V** — 验证器/批评者
- **E** — 环境

执行循环：观察环境 → 检索记忆 → 提议动作 → 验证 → 执行工具 → 更新环境和记忆

### 架构组件分类

1. **审议与推理 (Deliberation & Reasoning)**
   - Chain-of-thought 分解
   - 自我反思与验证
   - 约束感知决策

2. **规划与控制 (Planning & Control)**
   - 反应式策略 → 层次化多步规划器

3. **工具调用与环境交互 (Tool Calling & Environment Interaction)**
   - 检索、代码执行、API、多模态感知

### 编排模式

- **单 Agent vs 多 Agent**
- **集中式 vs 去中心化协调**
- 部署设置：离线分析 vs 在线交互、安全关键 vs 开放任务

### 关键设计权衡

| 权衡 | 说明 |
|------|------|
| 延迟 vs 准确性 | 更多推理时间提升质量但增加延迟 |
| 自主性 vs 可控性 | 更多自主权 vs 更多人类控制 |
| 能力 vs 可靠性 | 更强模型 vs 更稳定行为 |

### 评估挑战

- 非确定性（采样、工具失败）
- 长时信用分配
- 工具和环境变异性
- 隐藏成本（重试、上下文增长）
- 可复现性困难

### 未来挑战

- 工具动作的验证和护栏
- 可扩展的记忆和上下文管理
- Agent 决策的可解释性
- 真实工作负载下的可复现评估

## 关键要点

- 能力提升越来越多来自**系统设计**而非仅靠更大模型
- 实践前沿从"回答"转向"操作"：维护状态、从失败中恢复、用证据链证明行动
- 结构化动作空间（typed tool schemas）比自由文本更能减少幻觉
- Agent 的安全性必须在**整个执行图**上端到端保障，不仅仅是最终响应

## 与其他主题的关系

- [[有效上下文工程]] — 上下文管理是 Agent 的核心挑战
- [[A-Mem]] — 记忆子系统 M 的具体实现
- [[设计模式]] — 编排模式的具体实践
- [[Harness-Design]] — Harness 设计影响 Agent 架构选择
- [[基础设施噪声]] — 评估可复现性的具体案例

## 来源

- [AI Agent Systems: Architectures, Applications, and Evaluation](../raw/【26-01】【论文】AI%20Agent%20Systems:%20Architectures,%20Applications,%20and%20Evaluation%20·%20Arizona%20State%20University.pdf) — Arizona State University, 2026-01
