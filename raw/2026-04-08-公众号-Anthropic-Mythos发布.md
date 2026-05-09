# Anthropic 最强模型 Mythos 发布了，但你暂时用不上
> 来源: https://mp.weixin.qq.com/s/u3POjZOj1m1rtgV4M5OPKg
> 抓取日期: 2026-04-13
> 标签: #anthropic #mythos #网络安全 #零日漏洞 #project-glasswing

---

4月7日 Anthropic 公布 Claude Mythos Preview（代号 Capybara 水豚），比 Opus 更高一级的全新前沿模型。但没有开放给公众，交给 12 家公司联盟用于网络安全防御（Project Glasswing）。

合作方：Amazon、Apple、Google、Microsoft、Cisco、CrowdStrike、Broadcom、NVIDIA、JPMorganChase、Palo Alto Networks、Linux Foundation。Anthropic 提供最多 1 亿美元使用额度 + 400 万美元捐赠。

基准测试对比 Mythos vs Opus 4.6：
- SWE-bench Verified: 93.9% vs 80.8%
- SWE-bench Pro: 77.8% vs 53.4%
- SWE-bench Multimodal: 59.0% vs 27.1%（翻倍）
- GPQA Diamond: 94.6% vs 91.3%
- Humanity's Last Exam: 56.8% vs 40.0%
- CyberGym: 83.1% vs 66.6%

网络安全能力：
- 前沿红队负责人 Logan Graham 称为"reckoning（清算时刻）"
- 发现数千个零日漏洞，很多已存在 10-20 年
- 典型案例：OpenBSD 27年老漏洞、FFmpeg 16年老漏洞（自动化工具扫过 500 万次未发现）、Linux 内核提权
- 能自主编写漏洞利用攻击代码
- 不需要源码就能分析二进制文件找漏洞
- Opus 4.6 在 Firefox JS 引擎漏洞利用测试中成功 2 次，Mythos 成功 181 次

公开发布时间表：2026年中期扩大早期访问，2026年Q4通过API公开发布。Glasswing 合作定价 25/125 美元（输入/输出每百万 token），比 Opus 4.6 贵 5 倍。

背景：Anthropic 2026 年预计年化收入超 300 亿美元（去年 90 亿）。与 Google 和 Broadcom 合作获 3.5 吉瓦算力。上个月 3000 份内部文件被意外泄露，包括 Mythos 草稿博客。

评论：网络安全能力跃升是真实的。普通用户什么时候能用上，取决于竞争对手什么时候让 Anthropic 觉得不发不行。Logan Graham 说其他公司 6-18 个月会有类似能力。

System Card: https://www-cdn.anthropic.com/53566bf5440a10affd749724787c8913a2ae0841.pdf
