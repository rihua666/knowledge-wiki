# Claude Code 推出 /ultrareview 超级审查功能，20 美金一次，10 分钟干完

> 来源: AGI Hunt (GPT Hunt)
> 抓取日期: 2026-04-23
> 标签: #公众号 #AGI-Hunt
> 原文链接: https://mp.weixin.qq.com/s/jvlBvAj272l4xNQWRwsACQ

---

今天介绍 Claude Code 上线的一个新功能：/ultrareview。

一句话概括：它会在云端同时派出多个 AI 审查员，帮你在合并代码之前把 Bug 揪出来。

这个功能在上周 Claude Opus 4.7 发布时就提到了。根据 Claude Code 的更新日志，/ultrareview 在 4 月 17 日的 v2.1.113 版本中首次加入，4 月 20 日的 v2.1.116 又做了一轮优化。

## 01 不止一个审查员

/ultrareview 和普通的 /review 最大的区别在于，它不是一个 Agent 在看你的代码。**它是一群。**

当你在 CLI 里敲下 /ultrareview，Claude Code 会把你的代码仓库打包上传到云端沙箱，然后启动一整支 reviewer Agent 编队，**并行地**审查你的改动。每个 Agent 独立工作，找到可疑的地方之后，还会交给另一个 Agent **独立验证**。只有经过验证确认的 Bug，才会最终反馈给你。

好处：**信噪比高**（报出来的基本都是真问题）、**覆盖面广**（多个 Agent 并行探索）、**不占本地资源**

## 02 3+1 架构

**3 个 Explorer Agent + 1 个 Critic Agent。**

3 个 Explorer 各自拿到一份代码改动，独立分析，可能一个盯安全漏洞，一个看逻辑错误，一个查性能隐患。

1 个 Critic Agent 负责「质检」，拿到三个 Explorer 的全部产出，逐条检查。**只有经过 Critic 验证的 Bug，才会出现在最终报告里。**

## 03 为什么在云端

ultrareview 需要同时启动 4 个 Agent，每个都要独立的模型调用和 context window。在本地跑只能串行处理，而在云端沙箱里可以**真正并行**。Critic Agent 还需要在沙箱环境里实际执行代码来复现问题。

## 04 实际操作

```
/ultrareview          # 审查当前分支和默认分支的 diff
/ultrareview 1234     # 审查 GitHub PR #1234
```

启动前会弹出确认框，显示审查范围、剩余免费次数和预估费用。审查一般需要 **5 到 10 分钟**。

演示结果：ultrareview 总共发现了 4 个已验证问题，**8 个被判定为误报直接过滤掉了**。

## 05 /review vs /ultrareview

| | /review | /ultrareview |
|---|---|---|
| 运行位置 | 本地 | 云端沙箱 |
| 审查深度 | 单次扫描 | 多 Agent + 交叉验证 |
| 耗时 | 几秒到几分钟 | 5 到 10 分钟 |
| 费用 | 算在日常用量里 | 免费额度用完后 $5-$20/次 |
| 适合场景 | 写代码时随手查 | 合并前的最后一道关 |

Pro 和 Max 用户各有 **3 次免费体验**，有效期到 2026 年 5 月 5 日。免费次数用完之后每次约 $5-$20。

## 06 云端策划

和 /ultrareview 一起上线的还有 /ultraplan——动手前的「云端策划」。在云端启动 Claude Code on the web 会话做方案规划，满意后可选择在云端执行或发回本地。

Anthropic 在搭建一套「本地 CLI + 云端算力」的组合拳：**日常操作在本地，重活累活扔云端。**

---

> 原文来源：微信公众号「AGI Hunt」
> ultrareview 文档：https://code.claude.com/docs/en/ultrareview
> ultraplan 文档：https://code.claude.com/docs/en/ultraplan
