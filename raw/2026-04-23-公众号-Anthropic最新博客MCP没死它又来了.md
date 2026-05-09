# Anthropic 最新博客：MCP 没死，它又来了

> 来源: AGI Hunt (GPT Hunt)
> 抓取日期: 2026-04-23
> 标签: #公众号 #AGI-Hunt
> 原文链接: https://mp.weixin.qq.com/s/Sz2hzXiNCyf1YNzPbeUo5Q

---

Anthropic 最新发了篇博客，标题叫《Building agents that reach production systems with MCP》，翻译过来是：《构建能触达生产系统的 Agent：MCP 实践指南》。

在我去年 11 月的文章《MCP 或将成弃子》和上个月的文章《一切软件，都将为 Agent 重写》、《钉钉飞书集体抛弃 MCP，CLI 才是 Agent 的终局》中，我一直在阐述一个观点：

CLI + Skills 才是 Agent 连接外部系统的正道，因为 MCP 又贵又慢还占上下文。

但今天，MCP 的亲爹 Anthropic 自己出来再一次为 MCP 说话了。

它倒不是说「你们错了」，它说的是：「你们提的那些问题，我们有答案了。」

## 01 之前聊过什么

ScaleKit 做了一组严格的 benchmark，拿 GitHub 官方 MCP 服务器和 gh CLI 做对照，跑了 75 轮实验。

结果是 CLI 在 token 消耗上便宜 **10 到 32 倍**，按月算，每月 1 万次操作，CLI 大约 3.2 美元，MCP 大约 55.2 美元。**17 倍的成本差距。**

Perplexity 的 CTO Denis Yarats 也表态称：Perplexity 内部正在远离 MCP，原因是 **72% 的上下文窗口被 MCP 占掉了**。

龙虾之父 Peter 也在播客里痛批 MCP：「MCP 默认污染你的上下文，加上大部分 MCP 做得不好，总体来说不是一个很有用的范式。」

## 02 Anthropic 的回应

博客开篇先摆了一个框架：Agent 连接外部系统有三条路——直连 API、CLI、MCP，**各有各的适用场景**。

- **直连 API** 适合简单的、一对一场景
- **CLI** 在本地和沙箱环境确实更合适，Agent 天生就说命令行语言
- **MCP** 的定位是为**云端生产环境**服务：一个远程服务器，通吃所有客户端

博客给出的数据：**MCP SDK 的月下载量从年初的 1 亿涨到了 3 亿。**

## 03 Token 解法

第一个叫 **Tool Search**：按需加载工具定义，不再一股脑塞进上下文。

测试数据：**工具定义的 token 消耗减少了 85% 以上**，工具选择的准确率没有下降。

之前 ScaleKit 测出来 GitHub MCP 查仓库语言要 44,026 tokens，CLI 只要 1,365 tokens，差 32 倍。如果 Tool Search 能砍掉 85%，那 MCP 总消耗大概能降到 10,000 tokens 左右。跟 CLI 的差距从 32 倍缩到大约 7 倍。

第二个解法叫**程序化工具调用**：工具返回的结果不再直接丢回模型，而是在代码执行沙箱里处理。在复杂多步工作流上**减少了约 37% 的 token 消耗**。

## 04 Cloudflare 的实践

Cloudflare 的 MCP 服务器覆盖大约 **2,500 个 API 端点**，但只暴露 **2 个工具**：search 和 execute。Agent 先用 search 找到需要的 API，然后写一段简短的脚本通过 execute 在服务端沙箱里跑。整个工具定义只占 **大约 1K tokens**。

Anthropic 真正想说：**MCP 和 CLI 不是对立的，好的 MCP 服务器应该像 CLI 一样设计。**

## 05 Skills 转正

Anthropic 的说法：MCP 管「能力」，Skills 管「编排」。

Claude 的数据插件：**10 个 Skills + 8 个 MCP servers** 打包在一起。Canva、Notion、Sentry 等第三方也开始在发布 MCP 服务器的同时附带 Skills。

## 06 MCP 的地盘

社区三个批评 → Anthropic 三个回应：
- token 贵 → Tool Search（减 85%）+ 程序化调用（减 37%）
- schema 臃肿 → 按意图分组
- 不可组合 → 代码编排

图景：
- **本地开发环境** → CLI + Skills，轻量、快速、上下文干净
- **云端生产环境** → MCP + Skills，标准化、跨平台、认证完备
- **简单场景** → 直连 API

> MCP 并没有死。它当然并非万能方案，但它正在成为云端 Agent 的标准化接入层。

---

> 原文来源：微信公众号「AGI Hunt」
> Anthropic 博客原文：https://claude.com/blog/building-agents-that-reach-production-systems-with-mcp
