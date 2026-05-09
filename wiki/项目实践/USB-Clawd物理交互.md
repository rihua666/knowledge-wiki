---
type: detail
title: USB-Clawd 物理交互
category: 项目实践
tags: claude-code, hardware, hooks, physical-computing
created: 2026-04-13
updated: 2026-04-13
sources:
  - 2026-04-08-公众号-会跳舞的Claude-Code.md
---

# USB-Clawd：Claude Code 的物理交互外设

> 英国工程师 Ben James 把 Claude Code 的 hooks 接到物理硬件上——一个会弹跳的铝合金小家伙。
> 来源: AGI Hunt | 2026-04-08

## 项目概览

USB-Clawd 是 Claude Code 的物理通知设备，每当 Agent 需要确认或等待输入时，桌面上的 Claude 吉祥物就会弹跳提醒。

### 硬件演进

| 版本 | 材料 | 工艺 |
|------|------|------|
| 原型 | PLA 塑料 | 3D 打印 |
| 最终版 | 铝合金 | CNC 加工 + 阳极氧化 |

内部：微控制器 + 电磁线圈驱动弹跳，不锈钢细杆 + 烧结铜套防侧晃。

### 软件接入

利用 Claude Code 的 **hooks** 功能：
- 监听 `PostToolUse` 事件 → 检测到需要确认 → 给微控制器发 USB 信号
- Ben James 是第一批把 hook 接到物理硬件的开发者

## 意义

Boris Cherny（Claude Code 创造者）亲自回复："如果你能再做一个，我每天都会用。"

Ben James 的其他项目：迷你传真机（eBay 小票打印机 + 二手 iPhone + 树莓派），接收短信实时打印——后来被人发了整部《蜜蜂总动员》剧本。

> 核心洞察：在一个所有信息都在走向抽象的时代，物理世界的清晰感反而格外踏实。

## 相关

- [[🏠项目实践]] — 项目实践分类总览
- [[Claude-Code的梦境]] — Claude Code 另一个有趣功能
