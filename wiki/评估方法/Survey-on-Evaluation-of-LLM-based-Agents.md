---
title: Survey on Evaluation of LLM-based Agents
category: 评估方法
sources: 【25-03】【论文】Survey on Evaluation of LLM-based Agents · The Hebrew University of Jerusalem.pdf
tags: evaluation, benchmark, survey, agent-eval, methodology
created: 2026-04-08
updated: 2026-04-08
---

# Survey on Evaluation of LLM-based Agents

> 希伯来大学的 Agent 评估方法综述，系统梳理 LLM Agent 评估的维度、方法和基准。

## 核心内容

### 评估维度

- **任务完成度** — Agent 是否成功完成目标任务
- **效率** — 完成任务所需的步骤、时间和资源
- **鲁棒性** — 在异常情况和边缘案例下的表现
- **可靠性** — 输出的一致性和可复现性

### 评估方法分类

1. **静态评估** — 固定数据集上的准确率
2. **动态评估** — 与环境交互中的表现
3. **人类评估** — 人类裁判的主观评分
4. **自动评估** — LLM-as-judge 等自动化方法

### 主流基准

- WebArena — 网页操作
- ToolBench — 工具调用
- SWE-bench — 软件工程
- GAIA — 通用 AI 助手
- ALFWorld — 家居环境交互
- ScienceWorld — 科学实验

### 评估挑战

- 非确定性导致结果波动
- 长时任务的信用分配困难
- 工具和环境变异性
- 自动评估与人类判断的对齐

## 关键要点

- Agent 评估比传统 NLP 评估复杂得多——涉及交互、环境、工具等多维因素
- 没有单一指标能全面衡量 Agent 能力
- 基准测试的环境配置影响分数（与 Anthropic 的基础设施噪声发现一致）

## 与其他主题的关系

- [[量化代理编码评估中的基础设施噪声]] — 基础设施配置对评估的影响
- [[AI Agent Systems: Architectures, Applications, and Evaluation]] — ASU 综述中的评估章节
- [[Writing effective tools for agents]] — 工具评估的方法论

## 来源

- [Survey on Evaluation of LLM-based Agents](../raw/【25-03】【论文】Survey%20on%20Evaluation%20of%20LLM-based%20Agents%20·%20The%20Hebrew%20University%20of%20Jerusalem.pdf) — The Hebrew University of Jerusalem, 2025-03
