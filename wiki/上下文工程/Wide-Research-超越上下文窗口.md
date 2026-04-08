---
title: Wide Research：超越上下文窗口
category: 上下文工程
sources: 【25-10】【博客】Wide Research：超越上下文窗口 · Manus.pdf
tags: context-window, parallel, sub-agent, hallucination, wide-research, manus
created: 2026-04-08
updated: 2026-04-08
---

# Wide Research：超越上下文窗口

> Manus 提出并行子代理架构，彻底解决多主题研究任务中的上下文窗口瓶颈和幻觉阈值问题。

## 核心内容

### 问题：幻觉阈值

在多主题研究任务中，上下文窗口瓶颈导致幻觉。这与 [[有效上下文工程 (Effective Context Engineering)]] 中描述的 Context Rot 问题本质一致，也与 [[AI代理的上下文工程-Manus经验]] 中关于文件系统作为外部记忆的思路互补。
- **项目 1-5**：真实研究，检索信息、交叉引用、详细分析
- **项目 6-8**：质量微妙下降，描述更通用，依赖模式而非新鲜研究
- **项目 9+**：进入编造模式——基于统计模式生成权威但错误的内容

### 为什么更大的上下文窗口不行

1. **上下文衰减** — "迷失在中间"现象，非二元问题
2. **成本不成比例增长** — 400K token 的成本远非 200K 的两倍
3. **认知负荷** — 单模型在数十个任务间切换的瓶颈
4. **上下文长度压力** — 模型在超过阈值时加速总结，诉诸不完整表达

### 解决方案：并行处理架构

**Wide Research** — 部署 n 个并行子代理处理 n 个项目。类似的子代理架构也见于 [[Harness design for long-running app dev (长期应用开发的线束设计)]]（Planner-Generator-Evaluator）和 [[AI Agent Systems: Architectures, Applications, and Evaluation]]（Agent Transformer 编排模式）。

1. **智能分解** — 主控制器将请求分解为独立的可并行化子任务
2. **子代理委托** — 每个子代理是完整的 Manus 实例（独立 VM、完整工具、空上下文）
3. **并行执行** — 所有子代理同时工作
4. **集中协调** — 子代理不互通信，仅通过主控制器流动
5. **综合整合** — 主控制器将结果综合为连贯报告

### 优势

- **无退化曲线**：第 50 个项目与第 1 个项目质量一致
- **真正水平扩展**：线性扩展而非指数增长
- **显著加速**：50 个项目与 5 个项目时间大致相同
- **降低幻觉率**：每个子代理在认知舒适区内运行

## 关键要点

- 问题本质是"单处理器、顺序范式"的架构限制
- 子代理间不共享上下文 = 错误不传播 = 降低系统性风险
- 瓶颈从顺序处理时间转移到综合时间

## 与其他主题的关系

- [[有效上下文工程 (Effective Context Engineering)]] — Anthropic 的子代理方案解决类似问题
- [[Harness design for long-running app dev]] — 子代理协调模式
- [[动态上下文发现 (Dynamic Context Discovery)]] — Cursor 的动态加载是另一种上下文优化方案
- [[AI Agent Systems: Architectures, Applications, and Evaluation]] — 单 Agent vs 多 Agent 编排模式

## 来源

- [Wide Research：超越上下文窗口](../raw/【25-10】【博客】Wide%20Research：超越上下文窗口%20·%20Manus.pdf) — Manus (Meta), 2025-10
