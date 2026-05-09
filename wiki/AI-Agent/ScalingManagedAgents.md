---
type: detail
title: Scaling Managed Agents
category: AI-Agent
tags: agent, harness, architecture, managed-agents, anthropic, decoupling
created: 2026-04-09
updated: 2026-04-09
sources:
  - 2026-04-09-博客-Anthropic-ScalingManagedAgents.md
---

# Scaling Managed Agents: Decoupling the brain from the hands

> Anthropic Claude Platform 的 Managed Agents 服务架构设计。核心思想：像操作系统虚拟化硬件一样，将 Agent 组件虚拟化为稳定接口。
> 来源: [Anthropic Engineering Blog](https://www.anthropic.com/engineering/managed-agents) | 2026-04-09

## 核心抽象

Managed Agents 将 Agent 拆解为三个可独立替换的组件：

| 组件 | 职责 | 类比 |
|------|------|------|
| **Session** | 追加式事件日志 | 文件系统 |
| **Harness** | 调用 Claude + 路由工具调用 | 进程 |
| **Sandbox** | 代码执行 + 文件编辑环境 | 容器 |

接口面向未来设计，实现可以自由替换——就像 `read()` 系统调用不关心底层是磁盘还是 SSD。

## 从 Pet 到 Cattle

### 问题：耦合架构

最初所有组件放在单一容器中：
- 容器崩溃 → 会话丢失（Pet）
- 唯一调试窗口是 WebSocket 事件流
- 无法连接客户 VPC 资源

### 解决：解耦 brain 和 hands

- Harness 通过 `execute(name, input) → string` 调用容器
- 容器变为 Cattle——死亡后可自动重建：`provision({resources})`
- Harness 崩溃恢复：`wake(sessionId)` → `getSession(id)` → 从最后事件恢复

## 安全边界

**关键原则：凭证永远不在 Sandbox 可达范围内**

- Git：仓库 token 在 sandbox 初始化时注入，agent 不接触
- 自定义工具：OAuth token 存在安全 vault，通过 MCP proxy 访问
- Harness 从不感知任何凭证

## Session ≠ Context Window

Session 提供持久化上下文存储，通过 `getEvents()` 接口访问：
- 位置切片：从任意位置读取事件流
- 可回溯：查看特定动作前的上下文
- 变换在 Harness 层完成（compaction、trimming、cache 优化）

**不可逆决策的上下文管理放在 Harness，Session 只保证持久化和可查询。**

## 性能提升

| 指标 | 优化幅度 |
|------|---------|
| p50 TTFT | ↓ ~60% |
| p95 TTFT | ↓ >90% |

原因：解耦后容器按需启动，不使用 sandbox 的会话无需等待容器初始化。

## 可扩展性

- **多 Brain**：无状态 harness 可水平扩展，按需连接 hands
- **多 Hands**：Brain 可同时操作多个执行环境（早期模型不行，新模型可以）

## 与其他文章的关系

- 补充 [[Harness-Design]] — 从实践层面验证了 harness 设计原则
- 扩展 [[设计模式]] — 提供了 Level 3 多智能体系统的生产架构
- 相关 [[OpenAI-2025]] — 与 OpenAI Agent SDK 生态对比
