---
title: AgentScope Java
category: 项目实践
sources: AgentScope-Java说明文档.md
tags: agent-framework, java, react, mcp, a2a, graalvm
created: 2026-04-08
updated: 2026-04-08
---

# AgentScope Java

> 面向 Agent 编程的 Java 框架，高性能响应式架构，支持 GraalVM 原生镜像。2.2k Stars。

## 核心内容

### 定位
为 Java 生态提供创建智能 Agent 所需的一切：ReAct 推理、工具调用、记忆管理、多 Agent 协作。

### 特性
- **智能控制**：ReAct 范式 + 运行时干预（安全中断、优雅取消、人机交互）
- **内置工具**：PlanNotebook、Structured Output、Long-term Memory、RAG
- **协议支持**：MCP 协议、A2A 协议
- **生产级**：响应式架构、GraalVM 原生镜像、安全沙箱、可观测性

### 技术栈
- JDK 17+
- Maven / Gradle
- DashScope 模型后端

## 关键要点

- v1.0.10，Java 95.9%，Apache 2.0 许可证
- 与 Python 版共享设计理念，但针对 Java 生态优化
- 支持 GraalVM 原生镜像编译，适合云原生部署

## 与其他主题的关系

- [[AgentScope-Python]] — Python 版本，功能更丰富
- [[DeerFlow]] — 字节跳动的 super agent harness
- [[设计模式]] — Agent 架构设计模式

## 来源

- [AgentScope Java](../raw/AgentScope-Java说明文档.md) — https://github.com/agentscope-ai/agentscope-java
