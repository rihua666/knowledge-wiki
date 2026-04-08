---
title: Learn Claude Code
category: 项目实践
sources: Learn-Claude-Code说明文档.md
tags: agent-harness, claude-code, education, agent-loop, context-management
created: 2026-04-08
updated: 2026-04-08
---

# Learn Claude Code

> 教你理解并实现 Claude Code 背后的 harness 机制。40.3k Stars。

## 核心内容

### 核心理念

> **"模型就是 Agent。代码是 Harness。造好 Harness，Agent 会完成剩下的。"**

- **Agent 是模型**：不是框架、不是提示词链，是能感知环境、推理目标、采取行动的神经网络
- **Harness 是环境**：为 Agent 提供工具、知识、上下文管理、权限控制的工作环境
- **过度工程化的 shell 脚本不是 Agent**：用 if-else、节点图、硬编码路由串联 LLM API 不是 Agent

### 课程体系（s01-s12 递进）

12 个课程，从基础到高级：
- Agent Loop（基本执行循环）
- Tool Calling（工具调用）
- Context Management（上下文管理）
- ...到最终的 Worktree Task Isolation（工作树任务隔离）

### 愿景
"用真正的 Agent 铺满宇宙" —— 农业、酒店、医疗研究等领域的 Agent 化

## 关键要点

- MIT License，40.3k Stars
- 专注于 Harness 工程教育，而非 API 使用教学
- 强调 Agent ≠ 工具堆叠，Harness 设计才是关键

## 与其他主题的关系

- [[DeerFlow]] — 实践层面的 super agent harness
- [[Harness-Design]] — Anthropic 的 Harness 设计经验
- [[有效上下文工程]] — 上下文管理是 Harness 核心
- [[动态上下文发现]] — Cursor 的上下文工程实践

## 来源

- [Learn Claude Code](../raw/Learn-Claude-Code说明文档.md) — https://github.com/shareAI-lab/learn-claude-code
