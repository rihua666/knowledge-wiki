---
title: Skill-Memory 工程实践
category: AI-Agent
sources: 2026-03-28 公众号 Harness工程实践 fireworks-skill-memory
tags: claude-code, harness, skill-memory, open-source, memory
created: 2026-04-13
updated: 2026-04-13
---

# Skill-Memory 工程实践

> AI 没有记忆。每个 session，都是第一天上班的实习生。这是架构问题，不是提示词问题。

## 问题背景

用 Claude Code 两个月后发现一个让人抓狂的问题：它每次都在犯同样的错误。

- 告诉它"Feishu API 用 index=0"，下次又用 index=1
- 告诉它"git push 要走代理"，下次又直连超时

CLAUDE.md 能解决一部分，但你得自己写、自己维护、一个文件塞所有东西。真正需要的是：按 skill 分类、自动积累、自动注入的记忆系统。

## 解决方案：fireworks-skill-memory

开源项目：[fireworks-skill-memory](https://github.com/yizhiyanhua-ai/fireworks-skill-memory)（MIT 协议）

### 核心思路

1. 用 skill 时，把这个 skill 的"历史教训"自动注入给 Claude
2. session 结束后，自动把新教训提炼出来存下来
3. 下次用，自动更好

### 架构设计

挂在 Claude Code 的 Harness 层上。Harness 是 Claude Code 里介于模型和真实世界之间的编排层，负责工具调用、Hook 生命周期、Skill 加载。

只用了两个 Hook 点：

| Hook | 触发时机 | 动作 |
|------|----------|------|
| PostToolUse | 检测到 Skill 被读取 | 注入对应 KNOWLEDGE.md |
| Stop（async） | session 结束后 | haiku 提炼新教训 → 更新文件 |

对你的工作流零影响，完全在后台。

### 隐私与安全

- 所有知识文件存在本地 `~/.claude/skills/` 下
- 没有任何内容上传到云端
- 提炼用的是 claude-haiku（你自己的 API key）

## 安装方式

在 Claude Code 里说"帮我从 https://github.com/yizhiyanhua-ai/fireworks-skill-memory 安装 fireworks-skill-memory"。

## 核心洞察

项目本质：把 AI 的使用经验，从人脑外包给机器本身。AI 会替自己积累经验，越用越聪明。

## 与其他主题的关系

- [[Harness-Design]] — Harness 是 Skill-Memory 的运行基础
- [[🏠记忆系统]] — 记忆子系统 M 的具体实现
- [[ScalingManagedAgents]] — Managed Agents 架构中的 Harness 设计
- [[Agent-Harness驯化范式]] — Harness 驯化范式的系统论述

## 来源

- [一次Harness工程实践，我把它开源出来了！](https://mp.weixin.qq.com/s/QVCJfKm6YOtROUxJqzei6A) — fireworks-skill-memory 作者
