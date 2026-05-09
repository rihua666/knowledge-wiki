# Knowledge Wiki

基于 AI Agent 的个人知识库系统。通过 LLM 自动编译、整理和维护知识库，覆盖 AI Agent、LLM、上下文工程等前沿领域。

## 🏗️ 架构

```
knowledge-wiki/
├── SCHEMA.md           # Wiki 编译规则与页面类型定义
├── AGENTS.md           # Agent 行为规范
├── SOUL.md             # Agent 人格定义
├── PROJECT_PLAN.md     # 系统设计文档
├── KB-README.md        # 知识库使用指南
├── feeds.yaml          # RSS 订阅源配置
├── scripts/            # RSS 抓取脚本
│   └── rss-fetch.mjs   # 基于 RSSHub 的内容抓取
├── skills/             # 自定义 Agent Skills
│   └── openclaw-wiki-compile/  # 知识库编译 Skill
├── raw/                # 原始素材（公众号文章、博客、论文 PDF）
│   ├── *.md            # 微信公众号 & 博客文章
│   └── *.pdf           # 学术论文 & 技术报告
└── wiki/                # 编译后的结构化知识库（64 页）
    ├── index.md         # 全局索引
    ├── hot.md           # 热门缓存（快速恢复上下文）
    ├── log.md           # 操作日志
    ├── AI-Agent/        # AI 代理系统
    ├── AI-基础设施/      # AI 基础设施与产业
    ├── LLM/             # 大语言模型
    ├── 上下文工程/       # 上下文管理实践
    ├── 安全/            # AI 安全
    ├── 记忆系统/        # 代理记忆机制
    ├── 评估方法/        # LLM 评估
    └── 项目实践/        # 开源项目与工具
```

## 🚀 工作流

1. **素材收集** — RSS 自动抓取 AI/工程博客、微信公众号文章
2. **知识编译** — LLM 读取原始素材，按 Schema 规则编译为结构化 Wiki 页面
3. **置信度标注** — 每个页面标注内容来源可信度（原文/推断/推测/待验证）
4. **索引维护** — 自动更新全局索引和分类索引

对 Agent 说 **"编译知识库"** 即可触发全量编译。

## 📂 目录说明

- `wiki/` — LLM 编译后的结构化知识库，按主题分类
- `raw/` — 原始素材存档：微信公众号文章、技术博客、学术论文 PDF

## 📄 许可

本项目知识库内容仅供个人学习参考。Wiki 和 raw 中引用的第三方文章、论文版权归原作者所有。
