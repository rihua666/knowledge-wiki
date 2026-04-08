---
title: DeerFlow
category: 项目实践
sources: deer-flow说明文档.md
tags: agent-harness, super-agent, sub-agent, skill, bytedance, sandbox
created: 2026-04-08
updated: 2026-04-08
---

# DeerFlow

> 字节跳动开源的 super agent harness，组织 sub-agents、memory 和 sandbox，配合可扩展 skills。发布后登 GitHub Trending #1。

## 核心内容

### 定位
不是简单的 Agent 框架，而是一个 **super agent harness** —— 将 sub-agents、memory 和 sandbox 组织在一起的元架构。

### 核心概念

1. **Skills（技能）** — 结构化能力模块，通常是 Markdown 文件，定义工作流和最佳实践
   - 内置：研究、报告生成、演示文稿、网页/图像/视频生成
   - **按需渐进加载**，不会一次性塞满上下文

2. **Sub-Agents（子代理）** — 专业化的子代理处理特定任务，主代理协调

3. **Memory（记忆）** — 跨 session 的持久化记忆

4. **Sandbox（沙箱）** — 安全执行环境（支持 Docker 容器化）

### 技术栈
- Python 3.12+ / Node.js 22+ / pnpm
- 前端：localhost:2026
- API：localhost:2024
- Gateway：localhost:8001

## 关键要点

- v2.0 彻底重写，与 v1 不共用代码
- MIT License，字节跳动开发
- Skills 的按需加载思想与动态上下文发现理念一致

## 与其他主题的关系

- [[AgentScope Python]] / [[AgentScope Java]] — Agent 框架（vs DeerFlow 是 harness）
- [[Learn Claude Code]] — Harness 工程学习
- [[有效上下文工程 (Effective Context Engineering)]] — Skills 按需加载是动态上下文的实践
- [[Harness design for long-running app dev]] — Harness 设计方法论

## 来源

- [DeerFlow](../raw/deer-flow说明文档.md) — https://github.com/bytedance/deer-flow
