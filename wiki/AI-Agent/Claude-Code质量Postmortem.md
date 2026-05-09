---
type: detail
title: Claude Code 质量 Postmortem
category: AI-Agent
tags: claude-code, anthropic, quality, postmortem, agent-engineering, harness
created: 2026-05-07
updated: 2026-05-07
sources:
  - 2026-04-23-博客-Anthropic-Claude Code质量报告更新.md
confidence: high
---

# Claude Code 质量 Postmortem

> Anthropic 官方复盘 Claude Code 近一个月的质量退化问题：三个独立变更叠加导致用户感知"变笨"，分别涉及推理力度降级、缓存 Bug 和系统提示词变更。全部于 4 月 20 日修复。
> 来源: [Anthropic Engineering](https://www.anthropic.com/engineering/april-23-postmortem) | 2026-04-23

## 核心要点

### Bug #1：推理力度默认降级（3月4日 → 4月7日修复）

- Opus 4.6 发布时默认 reasoning effort = **high**，但部分用户遇到思考时间过长导致 UI 假死
- Anthropic 将默认改为 **medium**——内部 eval 显示"略降智能 + 显著降延迟"
- 用户反馈 Claude Code 变笨。尽管加入了 effort selector、ultrathink 等补救，多数用户仍保持 medium 默认
- **4月7日回滚**：所有模型恢复 high 默认，Opus 4.7 默认 xhigh [原文]

> 关键教训：推理力度是 Claude Code 的核心 tradeoff 旋钮，默认值选择比想象中影响更大 [推断]

### Bug #2：缓存优化清除思考历史（3月26日 → 4月10日修复）

- 设计意图：session 空闲 >1h 后清除旧 thinking blocks，减少 cache miss 时的 token 开销
- **Bug**：`clear_thinking_20251015` + `keep:1` 的实现导致每轮都清除，而非只清一次
- 结果：Claude 越来越"失忆"——忘记自己为什么做了某个编辑，出现重复和奇怪的 tool 调用
- 副作用：持续 cache miss → 用户报告 usage limit 消耗异常快
- 两个无关实验恰好掩盖了 Bug 在 CLI 测试中的表现，延迟了发现 [原文]

> 这是上下文工程失败的典型案例：清除上下文的"优化"比不清除更糟 [推断]

### Bug #3：系统提示词冗长限制（4月16日 → 4月20日修复）

- Opus 4.7 偏冗长（更智能但更多 token），团队在发布前调优系统提示词
- 添加了严格的长度限制："tool calls 间 ≤25 词，最终回复 ≤100 词"
- 内部 eval 未检出回归，但更广泛的 ablation 测试显示 **Opus 4.6 和 4.7 均降 3%**
- **4月20日回滚** [原文]

> 系统提示词的单行变更可以对编码质量产生超预期影响 [推断]

### 改进措施

| 措施 | 说明 |
|------|------|
| 更多员工使用公开构建 | 避免内部版本与用户版本差异掩盖问题 |
| 改进 Code Review 工具 | Opus 4.7 已能回溯发现此 Bug，而 4.6 不能 |
| 系统提示词变更管控 | 每次变更运行 per-model eval suite + ablation |
| 更长的 soak period | 涉及智能 tradeoff 的变更增加浸泡期 |
| @ClaudeDevs 沟通渠道 | 专门解释产品决策背后的技术推理 |

## 关键洞察

- **三个独立 Bug 在不同时间影响不同流量切片**，聚合后表现为"广泛且不一致的退化"，极难定位 [原文]
- API 层未受影响——所有问题都在产品层（Harness 配置和系统提示词）[原文]
- **Opus 4.7 能发现 4.6 发现不了的 Bug**：用 4.7 回溯 code review 找到了缓存 Bug 的根因 [原文]
- 质量退化的第一信号不是 eval 数据，而是**用户反馈中的具体可复现案例** [推断]

## 相关

- [[🏠AI-Agent]] — Agent 架构总览
- [[Harness-Design]] — Harness 设计的三代理架构
- [[Agent-Harness十二组件]] — 生产级 Harness 组件与决策
- [[Claude-Code的梦境]] — Claude Code 的后台记忆巩固机制
