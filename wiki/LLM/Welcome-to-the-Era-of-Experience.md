---
title: Welcome to the Era of Experience
category: LLM
sources: 【25-09】【论文】Welcome to the Era of Experience · David Silver, Richard S. Sutton.pdf
tags: experience, reinforcement-learning, superhuman, streams, grounding, planning
created: 2026-04-08
updated: 2026-04-08
---

# Welcome to the Era of Experience

> David Silver 和 Richard Sutton 提出：AI 正从"人类数据时代"进入"经验时代"，Agent 将通过自身体验获得超人类能力。

## 核心内容

### 人类数据时代的局限

- LLM 通过模仿人类达到了广泛的通用性，但在数学、编程、科学等关键领域接近人类数据的天花板。这预示着 [[Welcome to the Era of Experience]] 所描述的范式转移即将到来。

- LLM 通过模仿人类达到了广泛的通用性，但在数学、编程、科学等关键领域接近人类数据的天花板
- 高质量数据源已接近耗尽
- 人类数据无法捕获超越当前理解的新洞察（新定理、新技术、科学突破）

### 经验时代的特征

数据必须随 Agent 变强而持续改进——静态合成数据会被迅速超越。通过 Agent 与环境交互产生的经验数据，将成为主导性改进媒介。

### 四个关键维度

1. **Streams（持续流）** — Agent 存在于持续的体验流中，而非短交互片段；信息跨整个流传递，行为随时间适应
2. **Grounding（环境 grounding）** — 动作和观察深深根植于环境，而非仅通过人类对话交互
3. **Experiential Rewards（体验驱动奖励）** — 奖励根植于环境体验，而非人类预判
4. **Planning（体验推理）** — 基于经验进行规划，而非仅用人类术语推理

### 例证：AlphaProof

- 初始暴露于约 10 万条人类形式化证明
- RL 算法随后生成了 1 亿条更多证明
- 成为首个获得国际数学奥赛奖牌的程序

## 关键要点

- 人类数据驱动的进步速度明显放缓，需要新方法
- DeepSeek 的经验："RL 的力量和美感——不是教模型如何解题，而是提供正确激励"
- 当前技术已有足够基础实现这些突破
- 未来的 Agent 将拥有跨越长时间尺度的体验流

## 与其他主题的关系

- [[A-Mem: 代理记忆系统]] — 持续流中的记忆管理
- [[有效上下文工程 (Effective Context Engineering)]] — 上下文管理在长时交互中的重要性
- [[AI Agent Systems: Architectures, Applications, and Evaluation]] — Agent 架构支持经验学习

## 来源

- [Welcome to the Era of Experience](../raw/【25-09】【论文】Welcome%20to%20the%20Era%20of%20Experience%20·%20David%20Silver,%20Richard%20S.%20Sutton.pdf) — David Silver, Richard S. Sutton, 2025
