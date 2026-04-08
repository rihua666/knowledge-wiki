---
title: Memory in the Age of AI Agents: A Survey
category: 记忆系统
sources: 【25-12】【论文】Memory in the Age of AI Agents: A Survey · National University of Singapore.pdf
tags: memory, survey, token-memory, planar-memory, hierarchical-memory, retrieval
created: 2026-04-08
updated: 2026-04-08
---

# Memory in the Age of AI Agents: A Survey

> 新加坡国立大学关于 AI Agent 记忆系统的全面综述，提出多维记忆分类框架。

## 核心内容

### 记忆分类框架

#### Token-level Memory
1. **Flat Memory (1D)** — 简单的线性记忆（对话历史、提示词）
2. **Planar Memory (2D)** — 带有结构化关系的平面记忆（键值对、表格）
3. **Hierarchical Memory (3D)** — 多层级的树状记忆（文件系统、知识图谱）

#### 更高维记忆
- 结合多种维度的复合记忆结构
- 与外部存储系统集成的记忆架构

### 记忆操作

- **写入** — 编码和存储新信息
- **读取** — 检索和召回相关信息
- **更新** — 修改和精炼已有记忆
- **遗忘** — 移除过时或无关信息

### 记忆增强策略

- **RAG (检索增强生成)** — 外部知识库检索
- **长期记忆** — 跨 session 的持久化记忆
- **工作记忆** — 当前任务相关的临时记忆
- **情景记忆** — 特定事件和经历的记录

### 挑战

- 记忆的容量与效率权衡
- 记忆的一致性和更新策略
- 跨 session 的记忆持续性
- 记忆检索的准确性和相关性

## 关键要点

- 463KB 的大型综述，是记忆系统领域最全面的参考之一
- 记忆从 1D（简单列表）到 3D（层级结构）的维度演进
- 记忆系统是 Agent 从"无状态"到"有经验"的关键

## 与其他主题的关系

- [[A-Mem]] — A-Mem 是本文综述中的一种具体记忆实现方案
- [[有效上下文工程]] — Anthropic 的结构化笔记是记忆的实践
- [[Manus-经验]] — Manus 的文件系统记忆是记忆的另一种实践
- [[Era-of-Experience]] — 经验时代的记忆是核心基础设施

## 来源

- [Memory in the Age of AI Agents: A Survey](../raw/【25-12】【论文】Memory%20in%20the%20Age%20of%20AI%20Agents:%20A%20Survey%20·%20National%20University%20of%20Singapore.pdf) — National University of Singapore, 2025-12
