---
title: AgentScope Python
category: 项目实践
sources: AgentScope-Python说明文档.md
tags: agent-framework, python, multi-agent, mcp, a2a, production
created: 2026-04-08
updated: 2026-04-08
---

# AgentScope Python

> 生产级、易用的 Python Agent 框架，支持可观察性、可控性和多 Agent 协作。20.7k Stars。

## 核心内容

### 定位
利用模型的推理和工具使用能力，而非用严格提示和编排来约束模型。

### 特性
- **快速构建**：5 分钟上手，内置 ReAct Agent、工具、Skills、人机交互、记忆、规划
- **可扩展**：支持 MCP 和 A2A 协议，消息中心支持灵活多 Agent 编排
- **生产就绪**：本地/无服务器/K8s 部署，内置 OTel 可观测性

### 核心组件
- ReAct Agent（推理 + 行动）
- Toolkit（工具注册和调用）
- Memory（记忆管理）
- Formatter（模型输出格式化）
- Skills（能力模块）
- 人机交互支持

### 部署方式
- 本地部署
- 无服务器云端部署
- K8s 集群部署

## 关键要点

- v1.0.18，Apache 2.0 许可证
- 支持 DashScope 等多种模型后端
- 支持 REST API 和 Python SDK 两种调用方式

## 与其他主题的关系

- [[AgentScope Java]] — Java 版本的 AgentScope 框架
- [[DeerFlow]] — 字节跳动的 super agent harness
- [[Learn Claude Code]] — Agent Harness 工程学习项目

## 来源

- [AgentScope Python](../raw/AgentScope-Python说明文档.md) — https://github.com/agentscope-ai/agentscope
