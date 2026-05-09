---
type: detail
title: Project Glasswing
category: 安全
tags: anthropic, claude, mythos, cybersecurity, vulnerability, zero-day, AI-safety
created: 2026-04-09
updated: 2026-04-13
sources:
  - 2026-04-07-博客-Anthropic-ProjectGlasswing.md
  - 2026-04-08-公众号-Anthropic-Mythos发布.md
---

# Project Glasswing：Claude Mythos 发现数千零日漏洞

> Anthropic 发布 Claude Mythos Preview（代号 Capybara 水豚），定位比 Opus 更高一级的全新前沿模型，AI 发现和利用软件漏洞的能力已超越除最顶级专家外的所有人类。模型未对公众开放，专供网络安全防御。
> 来源: [Anthropic](https://www.anthropic.com/glasswing) | 宝玉AI | 2026-04-07/08

## 基准测试对比

| 测试 | Mythos Preview | Opus 4.6 | 提升幅度 |
|------|---------------|----------|---------|
| SWE-bench Verified | **93.9%** | 80.8% | +13.1 |
| SWE-bench Pro | **77.8%** | 53.4% | +24.4 |
| SWE-bench Multimodal | **59.0%** | 27.1% | 翻倍 |
| GPQA Diamond | **94.6%** | 91.3% | +3.3 |
| Humanity's Last Exam | **56.8%** | 40.0% | +16.8 |
| CyberGym（漏洞发现） | **83.1%** | 66.6% | +16.5 |

## 核心发现

Claude Mythos Preview 已发现**数千个高严重性零日漏洞**，涵盖所有主流操作系统和浏览器。大部分漏洞**完全自主**发现和利用，无需人工引导。

### 三个示例漏洞

| 漏洞 | 存在时间 | 描述 |
|------|---------|------|
| **OpenBSD** | 27 年 | TCP 协议 SACK 机制整数溢出，仅需连接即可远程崩溃 |
| **FFmpeg** | 16 年 | 自动化测试命中 500 万次未检出 |
| **Linux Kernel** | — | 自主串联多个漏洞，实现普通用户 → root 提权 |

关键：Mythos 不需要源码就能分析二进制文件找漏洞——这是实际攻防场景中的重大能力跃升。

### Firefox JS 引擎对比

- Opus 4.6：数百次尝试中成功 **2 次**
- Mythos Preview：成功 **181 次**

## 行动计划

- **$100M** 用量额度给 12 家合作伙伴 + 40+ 额外基础设施组织
- **$4M** 捐赠给开源安全组织
- 参与方：AWS、Apple、Broadcom、Cisco、CrowdStrike、Google、JPMorganChase、Linux Foundation、Microsoft、NVIDIA、Palo Alto Networks

## 定价与发布时间表

- Glasswing 合作定价：**$25/$125**（输入/输出每百万 token），比 Opus 4.6 贵 5 倍
- 2026 年中期：扩大早期访问范围
- 2026 年 Q4：通过 API 公开发布（可能与 Anthropic IPO 时间重叠）
- Google Cloud Vertex AI 已提供 Private Preview 访问

## 背景

- Anthropic 2026 年预计年化收入超 **$300 亿**（去年 $90 亿，增长 2 倍+）
- 与 Google 和 Broadcom 合作获 **3.5 吉瓦**算力
- 上个月 **3000 份内部文件**被意外泄露，包括 Mythos 草稿博客
- Logan Graham（前沿红队负责人）：其他公司 6-18 个月会有类似能力

## 核心观点

> 同样使 AI 模型在恶意攻击者手中危险的能力，也使其在寻找和修复软件缺陷方面具有无可估量的价值。Project Glasswing 的目标是让防御者获得持久优势。

**矛盾感**：一边构建越来越强的 AI 系统赚数百亿美元，一边高调警告这些系统有多危险。但网络安全能力跃升经多家合作方独立评测确认是真实的。普通用户什么时候能用上，取决于竞争对手什么时候让 Anthropic 觉得不发不行。

## 相关

- [[🏠安全]] — 安全分类总览
- [[BPF符号执行]] — 另一个 AI 驱动的安全研究方向
