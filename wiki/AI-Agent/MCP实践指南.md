---
type: detail
title: MCP 实践指南
category: AI-Agent
tags: mcp, protocol, agent-infra, tool-use, cli, skills, anthropic
created: 2026-04-24
updated: 2026-04-24
sources:
  - 2026-04-23-公众号-Anthropic最新博客MCP没死它又来了.md
confidence: medium
---

# MCP 实践指南

> Anthropic 博客《Building agents that reach production systems with MCP》回应社区三大批评（token 贵、schema 臃肿、不可组合），给出 Tool Search + 程序化调用等解法，重新定位 MCP 为云端 Agent 标准化接入层。
> 来源: AGI Hunt / Anthropic 官方博客 | 2026-04-23

## 核心要点

### MCP vs CLI 的成本之争

- ScaleKit benchmark：GitHub MCP 服务器 vs `gh` CLI，75 轮实验，**CLI 在 token 消耗上便宜 10-32 倍**（月 1 万次操作，CLI ~$3.2 vs MCP ~$55.2）[原文]
- Perplexity CTO 表示内部远离 MCP，**72% 上下文窗口被 MCP 占用** [原文]
- MCP SDK 月下载量从年初 1 亿涨到 3 亿 [原文]

### Anthropic 三条解法

1. **Tool Search**：按需加载工具定义，不再全量注入上下文 → **工具定义 token 减 85%+**，准确率不降 [原文]
2. **程序化工具调用**：工具返回值在代码沙箱处理，不回传模型 → **复杂多步流程 token 减约 37%** [原文]
3. **按意图分组 schema**：解决 schema 臃肿问题 [原文]

### Cloudflare 实践：2 个工具覆盖 2500 个 API

- 只暴露 `search` 和 `execute` 两个工具，Agent 先搜索再写脚本执行
- 整个工具定义仅占 **~1K tokens** [原文]
- Anthropic 核心论点：**好的 MCP 服务器应该像 CLI 一样设计** [原文]

### 三层定位

| 环境 | 推荐方案 | 特点 |
|------|---------|------|
| 本地开发 | CLI + Skills | 轻量、快速、上下文干净 |
| 云端生产 | MCP + Skills | 标准化、跨平台、认证完备 |
| 简单场景 | 直连 API | 最低复杂度 |

### Skills 正式定位

- MCP 管「能力」，Skills 管「编排」[原文]
- Claude 数据插件：**10 个 Skills + 8 个 MCP servers** 打包 [原文]
- Canva、Notion、Sentry 等第三方开始在发布 MCP 服务器同时附带 Skills [原文]

## 关键洞察

- MCP 和 CLI 并非对立关系，**分层使用才是正解** [推断]
- 85% token 削减后，MCP vs CLI 的成本差距从 32x 缩至约 7x，但仍不便宜 [推断]
- MCP 正在成为云端 Agent 的标准化接入层，但本地场景 CLI 仍占优 [推测]

## 相关

- [[🏠AI-Agent]] — Agent 架构总览
- [[Agent-CLI设计原则]] — CLI 十条设计原则
- [[Writing-Tools]] — 工具设计方法论
- [[OpenAI-2025]] — MCP 协议在 OpenAI 生态中的定位
