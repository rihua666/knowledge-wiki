---
type: detail
title: Agent Harness 十二组件与架构决策
category: AI-Agent
tags: agent-harness, orchestration, context-management, verification, architecture
created: 2026-04-23
updated: 2026-04-23
sources:
  - Agent Harness：让AI从聊天机器人变成真正的智能体.md
confidence: high
---

# Agent Harness 十二组件与架构决策

> 生产级 Agent Harness 由 12 个独立组件构成，涵盖编排、记忆、上下文、验证到安全的全链路。Harness 不是提示词的包装器，它是让自主智能体行为成为可能的完整系统。
> 来源: 深度分析文章 | 2026-04

## 核心定义

- **Agent vs Harness**：Agent 是涌现出的行为（有目标、会用工具、能纠错的实体）；Harness 是产生这种行为的"机械装置"[原文]
- **经典类比**（Beren Millidge 2023）：原始 LLM = 无内存无硬盘的 CPU，上下文窗口 = RAM，外部数据库 = 硬盘，工具集成 = 设备驱动，**Harness = 操作系统**。他写道："我们重新发明了冯·诺依曼架构" [原文]
- **LangChain 公式**：Vivek Trivedy — "如果你不是模型，你就是 harness" [原文]
- **三层工程同心圆**：提示词工程 ⊂ 上下文工程 ⊂ **Harness 工程**（包含前两者 + 整个应用基础设施）[原文]

## 十二组件精要

| # | 组件 | 核心要点 |
|---|------|---------|
| 1 | 编排循环 | TAO/ReAct 循环，Anthropic 称之为"哑循环"，所有智能在模型里 |
| 2 | 工具 | Claude Code 六类工具，OpenAI SDK 支持函数/托管/MCP 工具 |
| 3 | 记忆 | 三层层次结构：轻量索引(~150字符) → 按需详细文件 → 搜索访问原始记录 |
| 4 | 上下文管理 | "Lost in the Middle"导致30%+性能下降；策略：压缩、观察遮蔽、即时检索、子智能体委托 |
| 5 | 提示词构建 | 分层组装：系统提示词 + 工具定义 + 记忆 + 对话历史 + 当前消息 |
| 6 | 输出解析 | 现代依赖原生 tool_calls，不再需要自由文本解析 |
| 7 | 状态管理 | LangGraph 用类型化字典 + reducer；Claude Code 用 git 提交作为检查点 |
| 8 | 错误处理 | 10步×99% = 端到端90.4%；四种错误类型：瞬态/LLM可恢复/用户可修复/意外 |
| 9 | 防护栏 | OpenAI 三级（输入/输出/工具）；Anthropic 权限与推理架构分离，~40个离散工具能力 |
| 10 | 验证循环 | Boris Cherny：给模型验证方法 → 质量提高2-3倍；规则/视觉/LLM评判三种验证 |
| 11 | 子智能体编排 | Claude Code: Fork/Teammate/Worktree 三种模型；OpenAI: agent-as-tool + handoff |
| 12 | Harness 厚度 | 模型越强 → harness 越薄；Anthropic 定期从 Claude Code 删除规划步骤因为新模型内化了该能力 [原文] |

## 关键数据

- LangChain 仅改 Harness（模型不变），TerminalBench 2.0 排名从 30+ 升至第 5 [原文]
- LLM 自优化基础设施通过率达 76.4%，超过人工设计 [原文]
- Vercel 删除 80% 工具反而效果更好；Claude Code 延迟加载实现 95% 上下文减少 [原文]
- ACON 研究：优先推理轨迹而非原始工具输出，token 减少 26-54% 准确性保持 95%+ [原文]

## 脚手架隐喻

建筑脚手架是临时基础设施，使工人能建造无法触及的结构。**关键洞察**：建筑完成后脚手架被拆除。Manus 六个月重建五次，每次重写都删除了复杂性。**未来验证测试**：如果性能随更强模型扩展而不增加 Harness 复杂性，设计就是合理的 [原文]。

## 七大架构决策

1. **单 vs 多智能体**：Anthropic 和 OpenAI 都说"首先最大化单个 agent"[原文]
2. **ReAct vs 计划-执行**：LLMCompiler 报告计划-执行比顺序 ReAct 快 3.6 倍 [原文]
3. **上下文窗口策略**：五种生产方法（时间清除/总结/遮蔽/笔记/子代理委托）
4. **验证循环设计**：计算验证(确定性) vs 推理验证(语义)
5. **权限架构**：宽松(快但有风险) vs 限制性(安全但慢)
6. **工具范围**：更多工具 = 更差性能，暴露当前步骤最小工具集 [原文]
7. **Harness 厚度**：Anthropic 押注薄 harness + 模型改进

## 相关

- [[🏠AI-Agent]] — Agent 分类总览
- [[Agent-Harness驯化范式]] — Harness 驯化范式的商业与社会层面
- [[Harness-Design]] — Anthropic 三代理架构设计
- [[ScalingManagedAgents]] — Anthropic 生产级 Managed Agents 架构
- [[有效上下文工程]] — 上下文管理深入指南
- [[多智能体协作模式]] — 五种多智能体协作模式
- [[Agent-Harness参考项目]] — 50+ 开源 Harness 项目全景，按领域分类
