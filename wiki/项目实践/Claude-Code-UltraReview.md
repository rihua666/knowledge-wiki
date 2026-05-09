---
type: detail
title: Claude Code UltraReview
category: 项目实践
tags: claude-code, code-review, multi-agent, cloud-sandbox, anthropic
created: 2026-04-24
updated: 2026-04-24
sources:
  - 2026-04-23-公众号-Claude-Code推出ultrareview超级审查功能.md
confidence: medium
---

# Claude Code UltraReview

> Claude Code 推出 /ultrareview 云端多 Agent 代码审查功能，3 Explorer + 1 Critic 架构并行审查，仅输出经交叉验证的 Bug 报告，5-10 分钟完成合并前终极检查。
> 来源: AGI Hunt / Claude Code 官方文档 | 2026-04-23

## 核心要点

### 架构：3+1 多 Agent 编队

- **3 个 Explorer Agent**：各自独立分析代码 diff，可能分别盯安全漏洞、逻辑错误、性能隐患 [原文]
- **1 个 Critic Agent**：拿到全部 Explorer 产出逐条验证，**只有 Critic 确认的 Bug 才出现在最终报告** [原文]
- 演示结果：发现 4 个已验证问题，**8 个误报被自动过滤** [原文]

### 为什么在云端

- 需同时启动 4 个 Agent，各自需要独立 context window → 本地只能串行，云端可**真正并行** [原文]
- Critic Agent 需在沙箱中实际执行代码复现问题 [原文]
- 不占本地资源

### 使用方式

```
/ultrareview          # 审查当前分支 vs 默认分支 diff
/ultrareview 1234     # 审查 GitHub PR #1234
```

启动前弹出确认框，显示审查范围、剩余免费次数和预估费用 [原文]。

### /review vs /ultrareview 对比

| | /review | /ultrareview |
|---|---|---|
| 运行位置 | 本地 | 云端沙箱 |
| 审查深度 | 单次扫描 | 多 Agent + 交叉验证 |
| 耗时 | 几秒到几分钟 | 5-10 分钟 |
| 费用 | 算日常用量 | 免费额度后 $5-$20/次 |
| 适合场景 | 写代码时随手查 | 合并前最后一道关 |

Pro/Max 用户各 **3 次免费体验**，有效期至 2026-05-05 [原文]。

### /ultraplan（同步上线）

- 云端版方案规划：启动 Claude Code on the web 会话做方案 [原文]
- 满意后可选云端执行或发回本地 [原文]
- 定位：**日常操作在本地，重活累活扔云端** [原文]

## 关键洞察

- 这是 Anthropic「本地 CLI + 云端算力」组合拳的体现 [推断]
- 多 Agent + Critic 架构与 [[Harness-Design]] 的三代理架构（Planner→Generator→Evaluator）异曲同工 [推断]
- 信噪比（precision）是 ultrareview 的核心卖点，而非召回率 — 只报确定的问题 [推断]

## 相关

- [[🏠项目实践]] — 项目实践总览
- [[Harness-Design]] — 三代理架构设计
- [[Codex团队自用实践]] — Codex 团队的工程实践
- [[Claude-Code的梦境]] — Claude Code 另一功能（Auto Dream）
- [[ScalingManagedAgents]] — Anthropic 云端 Agent 架构
