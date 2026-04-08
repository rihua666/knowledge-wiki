---
title: OpenAI for Developers in 2025
category: AI-Agent
sources: 【25-01】【博客】OpenAI for Developers in 2025 · OpenAI.pdf
tags: openai, agents, mcp, responses-api, apps-sdk, evals
created: 2026-04-08
updated: 2026-04-08
---

# OpenAI for Developers in 2025

> OpenAI 2025 年开发者生态全景：Responses API、Agent SDK、Apps SDK、开放权重模型和评估工具。

## 核心内容

### 核心发布

- **Responses API** — 统一 API，provider 无关，支持非 OpenAI 模型
- **Agent SDK** — 高层 Agent 开发工具（Agent Builder、ChatKit、Connector Registry、评估循环）
- **Apps SDK** — 基于 MCP 的开源框架，允许开发者在 MCP Server 旁构建 UI

### 标准化工作

- **AGENTS.md (spec)** — OpenAI 推动的 Agent 配置标准
- **AAIF (Agentic AI Foundation)** — 与 MCP、Skills 等生态标准共建

### 开放权重模型

- **gpt-oss** 120b & 20b — 推理模型，用于自托管
- **gpt-oss-safeguard** 120b & 20b — 安全策略模型

### 评估与微调

- **Evals API** — 评估驱动开发
- **RFT (Reinforcement Fine-Tuning)** — 可编程评分器
- **SFT / Distillation** — 验证后将能力压缩到更小模型

## 关键要点

- 生态向共享约定收敛 → 更少的一次性集成
- Agent 工具更便携，不与单一运行时耦合
- 评估驱动开发循环：eval → improve → re-eval

## 与其他主题的关系

- [[Writing-Tools]] — Anthropic 的工具设计 vs OpenAI 的工具生态
- [[AgentScope-Python]] — 支持多种模型的 Agent 框架
- [[DeerFlow]] — 另一个 Agent Harness 实现
- [[Learn-Claude-Code]] — Anthropic 的 Harness 教育项目

## 来源

- [OpenAI for Developers in 2025](../raw/【25-01】【博客】OpenAI%20for%20Developers%20in%202025%20·%20OpenAI.pdf) — OpenAI, 2025-01
