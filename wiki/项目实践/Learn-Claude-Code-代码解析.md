---
type: detail
title: Learn Claude Code 代码解析
category: 项目实践
tags: claude-code, agent-loop, tools, sub-agents, skills, architecture
created: 2026-04-09
updated: 2026-04-09
sources:
  - Learn-Claude-Code 代码解释文档.md
---

# Learn Claude Code：核心代码架构解析

> Learn Claude Code (40.3k Stars) 的源码逐模块解读，揭示 Claude Code 作为 Agent Harness 的实现细节。
> 来源: raw/Learn-Claude-Code 代码解释文档.md

## 架构概览

Learn Claude Code 是基于 Claude API 的 Agent Harness 教程项目，通过 5 个递进模块展示如何从零构建一个类 Claude Code 的编码 Agent。

## 模块详解

### S01: 独立的 Agent Loop

最简 Agent 循环的核心逻辑：

```
用户 query → 调用 Claude API → stop_reason?
  ├── "tool_use" → 执行工具 → 结果追加到 messages → 循环
  └── "end_turn" → return 最终回复
```

**关键设计**：
- `response.content` 是列表，可能同时包含 text + tool_use block
- 工具结果以 `role: "user"` 发送（外部世界的新信息）
- `tool_use_id` 匹配请求和响应
- `messages` 累积完整对话历史

### S02: 工具系统

在 Agent Loop 基础上添加工具调度层：

**路径沙箱**：
- `safe_path(p)`: 解析为绝对路径 + 检查是否逃逸工作目录
- 防止 `../../etc/passwd` 类路径遍历攻击

**Dispatch Map 模式**：
- 每个工具有 handler 函数 + JSON Schema 定义
- `TOOL_HANDLERS` 字典将工具名映射到 handler
- 核心思想："加工具 = 加 handler + 加 schema，循环永远不变"

**工具类型**：
- `run_read`: 文件读取（支持行数限制，输出截断 50000 字符）
- `run_write`: 文件写入
- `run_edit`: 文件编辑
- `run_bash`: 命令执行

### S03: TODO 规划

引入任务规划能力——Agent 在编码前先生成 TODO 计划，再逐步执行。实现计划-执行的分离，提升复杂任务的可靠性。

### S04: 子 Agent

多 Agent 协作机制：主 Agent 可以派生子 Agent 处理子任务，实现任务分解和并行处理。

### S05: Skill

可扩展的技能系统：通过 Skill 文件定义新的能力模块，Agent 可以根据任务需求加载对应 Skill。

## 与知识库的关系

- 实现 [[Harness-Design]] 中的三代理架构思路
- 体现 [[设计模式]] 中 Level 2-3 的 Agent 能力
- 路径沙箱是 [[Client-Side-Security-AI检测]] 安全原则的实践
- 工具设计符合 [[Writing-Tools]] 的 5 原则

## 相关

- 项目说明文档: [[Learn-Claude-Code]]
- 源码: raw/Learn-Claude-Code 代码解释文档.md（完整注释）
