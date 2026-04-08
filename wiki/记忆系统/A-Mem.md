---
title: A-Mem: 代理记忆系统
category: 记忆系统
sources: 【25-02】【论文】A-Mem: Agentic Memory for LLM Agents · Rutgers University.pdf
tags: memory, agent, zettelkasten, memory-evolution, link-generation
created: 2026-04-08
updated: 2026-04-08
---

# A-Mem: 代理记忆系统 (Agentic Memory for LLM Agents)

> 灵感来自 Zettelkasten 方法，提出了一种无需预定义记忆操作的动态自进化记忆系统，让 LLM Agent 拥有真正的长期交互能力。

## 核心内容

### 问题

现有 LLM Agent 记忆系统（MemGPT、Mem0、MemoryBank 等）依赖预定义的结构和固定工作流，缺乏灵活性和适应性，难以处理复杂开放任务。更多背景见 [[Memory-Survey]] 中的记忆分类框架。

### 核心创新：三大机制

### 核心创新：三大机制

#### 1. Note Construction（笔记构建）
- 每条记忆不是简单的存储，而是构建**结构化笔记**，包含：
  - `content` — 原始交互内容
  - `timestamp` — 时间戳
  - `keywords` — LLM 生成的关键词
  - `tags` — LLM 生成的分类标签
  - `context` — LLM 生成的上下文描述（核心！）
  - `embedding` — 文本编码器的向量表示
  - `links` — 关联记忆集合
- 遵循 Zettelkasten 的**原子性原则**：每条笔记捕获一个自包含的知识单元。这种结构化笔记的理念与 [[Manus-经验]] 中文件系统作为外部记忆的实践形成互补。

#### 2. Link Generation（链接生成）
- 新记忆加入时，通过 embedding 相似度检索 top-k 相关历史记忆
- 用 LLM 分析是否存在语义关联，决定是否建立链接
- 类比 Zettelkasten：相关记忆通过"盒子 (box)"互联，一个记忆可同时属于多个盒子

#### 3. Memory Evolution（记忆进化）
- **最独特的创新**：新记忆不仅建立链接，还能**触发已有记忆的更新**
- LLM 根据新记忆的上下文信息，更新相关历史记忆的 context、keywords、tags
- 模拟人类学习过程：知识结构随新经验持续精炼，发现高阶模式
- **这与 RAG 的本质区别**：Agentic RAG 只在检索阶段自主，A-Mem 在存储和进化层面自主

### 记忆检索
- 查询文本 → embedding → 余弦相似度 → 检索 top-k 记忆
- 关联记忆（同一 box 中的）也会自动被访问

### 实验结果

- 在 LoCoMo 长对话数据集（9K tokens/35 sessions）上测试
- 在 DialSim 多人对话数据集（35 万 tokens/1300 sessions）上测试
- 对比 4 个基线（LoCoMo、ReadAgent、MemoryBank、MemGPT）
- 在 **6 个基础模型**（Llama 3.2、Qwen2.5、GPT-4o/4o-mini 等）上均取得最优或接近最优表现

## 关键要点

- 传统记忆系统的问题是**预定义结构限制了适应性**，而非存储能力
- Zettelkasten 的核心理念：原子笔记 + 灵活链接 + 知识网络
- **记忆进化**是 A-Mem 最关键的创新——知识组织会随时间变得更丰富
- 与 Agentic RAG 的区别：A-Mem 在存储层面也具有自主性，而不仅是检索
- 无需预设记忆操作，Agent 可以自主决定如何组织记忆

## 与其他主题的关系

- [[有效上下文工程]] — Anthropic 的结构化笔记技术是实践层面，A-Mem 是学术研究
- [[Memory-Survey]] — 记忆系统综述，A-Mem 是其中一种方案
- [[设计模式]] — 更广泛的 Agent 架构模式

## 来源

- [A-Mem: Agentic Memory for LLM Agents](../raw/【25-02】【论文】A-Mem:%20Agentic%20Memory%20for%20LLM%20Agents%20·%20Rutgers%20University.pdf) — Rutgers University, 2025-02
- [代码 (评测)](https://github.com/WujiangXu/AgenticMemory)
- [代码 (生产版)](https://github.com/WujiangXu/A-mem-sys)
