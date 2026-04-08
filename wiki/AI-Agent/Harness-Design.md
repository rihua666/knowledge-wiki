---
title: Harness design for long-running app dev (长期应用开发的线束设计)
category: AI-Agent
sources: 【26-3】【博客】长期应用开发的线束设计Harness design for long-running application development _ Anthropic.pdf
tags: harness, multi-agent, frontend-design, context-reset, self-evaluation, long-running
created: 2026-04-08
updated: 2026-04-08
---

# Harness design for long-running app dev (长期应用开发的线束设计)

> 从 GAN 借鉴思路，设计 Generator-Evaluator 多代理架构，实现数小时自主编码的全栈应用生成。

## 核心内容

### 两大问题

1. **前端设计**：Agent 倾向于安全、通用的布局，缺乏创意
2. **长期自主编码**：Agent 随时间推移失去连贯性，产出的质量下降

### 两个常见失败模式

1. **上下文焦虑**：模型接近上下文限制时过早结束工作
   - Compaction（压缩）不够：仍保留旧上下文，焦虑可能持续。详见 [[有效上下文工程]] 中的 Compaction 分析
   - **Context Reset（重置）**更好：清空上下文，用结构化工件传递状态

2. **自我评价偏差**：Agent 评价自己作品时过于宽容
   - 即使有可验证结果的任务也存在判断力差的问题
   - 解决：**将生成者与评估者分离**。评估方法论见 [[Evaluation-Survey]]

### 三代理架构

受 GAN 启发，设计 Planner-Generator-Evaluator 架构：

- **Planner**：将产品规格分解为任务列表（类似 [[设计模式]] 中的 Prompt Chaining）
- **Generator**：实现任务，构建应用
- **Evaluator**：根据评分标准评估输出，提供反馈（工具评估方法见 [[Writing-Tools]]）

### 前端设计的四项评分标准

1. **Design Quality（设计质量）**：色彩、排版、布局是否构成连贯整体
2. **Originality（原创性）**：是否有自定义决策，而非模板/库默认
3. **Craft（工艺）**：技术执行能力（排版层级、间距、色彩和谐）
4. **Functionality（功能性）**：独立于美观的可用性

**重点**：设计质量和原创性权重更高，因为 Agent 默认在工艺和功能性上表现好，但在创意上偏保守。

### 长期编码的关键技术

- **任务分解**：将大任务拆分为可管理的块
- **结构化工件传递**：在 session 间用文档传递上下文
- **Context Reset**：清空上下文 + 结构化交接，避免上下文焦虑
- **外部评估器**：独立调校为怀疑者，比让生成器自评有效得多

## 关键要点

- Compaction 保持连续性但可能无法解决上下文焦虑，Context Reset 提供干净起点
- 生成者和评估者分离是强大的杠杆——独立调校怀疑者比让生成器自评容易得多
- 评估标准将主观判断转化为可评分的术语
- 该架构可跨领域应用：前端设计 + 全栈自主编码

## 与其他主题的关系

- [[有效上下文工程]] — Context Reset vs Compaction 的对比
- [[基础设施噪声]] — Harness 是评估基础设施的一部分
- [[Writing-Tools]] — 工具设计也是 Harness 的关键组件
- [[设计模式]] — 更广泛的 Agent 架构模式

## 来源

- [Harness design for long-running application development](../raw/【26-3】【博客】长期应用开发的线束设计Harness%20design%20for%20long-running%20application%20development%20_%20Anthropic.pdf) — Anthropic, 2026-03
