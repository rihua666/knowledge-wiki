---
title: Agent CLI 设计原则
category: AI-Agent
sources: 2026-03-29 公众号 给Agent设计CLI的十个原则
tags: cli, agent, design-principles, tool-design, feishu, dingtalk
created: 2026-04-13
updated: 2026-04-13
---

# Agent CLI 设计原则

> Agent 正在成为软件的主要用户。传统的 CLI 设计规范是给人类设计的，而 Agent 有完全不同的认知特点和失败模式。

## Agent 的天然弱点

1. 大小写敏感的短参数（`-v` vs `-V` 含义完全不同）
2. 交互式提示（Agent 无法回答 "Are you sure?"）
3. 幻觉参数（自信地使用不存在的参数）
4. 非结构化输出（需要 JSON 而非人类可读的 table）

## 十条设计原则

### 原则一：名词在前（Noun-Verb）

命令结构用 noun-verb，不用 verb-noun。Agent 发现命令的过程是树搜索，noun-verb 提供层级引导。Docker 的设计是典范：`container`、`image`、`volume`、`network` 是名词，`ls`、`rm`、`create`、`inspect` 是动词。

### 原则二：长参数优先

所有参数都应有长格式（`--verbose`），短格式（`-v`）作为可选。长参数语义自描述、消除歧义，LLM 训练数据中长参数的语义绑定更强。钉钉 CLI 的 `--yes` 参数描述是"跳过确认提示（AI Agent 模式）"。

### 原则三：输出是契约

stdout 和 stderr 严格分离。JSON 数据走 stdout，状态信息走 stderr。结构化输出一旦发布就是 API，改变字段类型或名称就是破坏性变更。

### 原则四：感知环境

检测 TTY 还是 pipe，自动调整行为。非 TTY 时不应弹确认框、显示 spinner。GitHub CLI 在非 TTY 时自动用 tab 分隔、去颜色、不截断。

### 原则五：干跑优先（--dry-run）

每个会产生副作用的命令都应支持 `--dry-run`。提供零成本的试错机制。Lightning Labs 使用专门的退出码（exit code 10）区分干跑成功和真正执行成功。

### 原则六：退出码控制

退出码对 Agent 来说是控制流本身。只用 0 和 1 不够：

| 退出码 | 含义 |
|--------|------|
| 0 | 成功 |
| 1 | 一般错误 |
| 2 | 参数错误 |
| 3 | 资源不存在 |
| 4 | 权限不足 |
| 5 | 冲突/已存在 |

退出码必须跨版本稳定。

### 原则七：防住幻觉

输入验证要严格，使用枚举约束参数值域，提供 schema 自省（`mytool schema --all`）。飞书 CLI 已实现 schema 命令。CLI 相对 MCP 的核心优势：按需查询而非一次注入所有 schema。

### 原则八：幂等设计

声明式优于命令式。`kubectl apply` 是教科书案例。飞书 CLI 的 `+messages-send` 支持 `--idempotency-key` 参数。

### 原则九：错误即指南

好的错误信息包含四个要素：错误类型（机器可读）、描述（发生了什么）、修复建议（怎么解决）、是否可重试。

### 原则十：帮助即大脑（--help）

Anthropic 发现"描述是影响工具使用准确率的最关键因素"。`--help` 应以示例开头、标注必需/可选、参数描述包含值域、保持 50 行以内。

## 实践评分

### 飞书 CLI

- ✅ noun-verb 结构清晰，schema 命令完善，五种输出格式
- ⚠️ 非 TTY 未自动切 JSON，退出码缺乏文档化

### 钉钉 CLI

- ✅ `--yes` 语义自描述，批量熔断防 Agent 失控
- ⚠️ 缺少 schema 自省，帮助文本缺少示例

## 与其他主题的关系

- [[Writing-Tools]] — Anthropic 工具设计原则
- [[Harness-Design]] — Harness 是工具的运行环境
- [[你所不知道的Agent]] — Agent 范式全景

## 来源

- [给 Agent 设计 CLI 的十个原则](https://mp.weixin.qq.com/s/H-hggbJAMBTuambCzNE4OQ) — 公众号翻译
- [agent-cli-guide](https://github.com/Johnixr/agent-cli-guide) — 开源项目
