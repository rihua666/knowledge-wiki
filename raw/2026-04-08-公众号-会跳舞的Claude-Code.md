# 太可爱了！会跳舞的 Claude Code 来了
> 来源: https://mp.weixin.qq.com/s/5kbErJ6W2bz3U6i5FZl5cg
> 抓取日期: 2026-04-13
> 标签: #claude-code #硬件 #usb-clawd #物理交互

---

英国工程师 Ben James 给 Claude Code 做了一个物理外设 USB-Clawd：一个会跳舞的 USB 设备，每当 Claude Code 需要确认或等待输入时，桌上那个小家伙就会弹跳起来提醒你。

Clawd 外观：
- 原型是 Claude 官方吉祥物，从 PLA 塑料迭代到最终版铝合金（CNC 加工，阳极氧化处理）
- 内部：微控制器 + 电磁线圈驱动弹跳，不锈钢细杆 + 烧结铜套防止侧向晃动

接入 Claude Code：
- 利用 Claude Code 的 hooks 功能，监听输入等待事件，触发时给微控制器发信号
- Claude Code hooks 可在特定事件（任务开始、需要确认、任务完成）时执行自定义脚本
- Ben James 是第一批把 hook 接到物理硬件上的人

Boris Cherny（Claude Code 创造者）亲自回复："如果你能再做一个，我每天都会用它的。"

Ben James 还做了一台迷你传真机，用 eBay 淘来的小票打印机 + 二手 iPhone + 树莓派，专门接收短信实时打印。后来被人发了整部《蜜蜂总动员》剧本。

OpenClaw 早期叫 ClawdBot 曾收到 Anthropic 律师函，多次改名后成为 OpenClaw。

核心洞察：在一个所有信息都在走向抽象的时代，物理世界的清晰感反而格外踏实。

相关链接：
- https://x.com/BenJames_____/status/2041157626155741272
- https://benbyfax.substack.com/p/clawd-minifax
