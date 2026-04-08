# 📋 LLM 个人知识库项目计划

> 基于 Andrej Karpathy 的 LLM Wiki 方法论
> 最后更新：2026-04-08 | 版本：2.0

---

## 🎯 项目目标

使用 LLM 构建和维护持久化的个人知识库 Wiki。知识随时间复利增长，而非每次查询都从零开始。

**核心原则**：
- Obsidian 是 IDE，LLM 是程序员，Wiki 是代码库
- 你负责素材收集、探索方向、提出好问题
- LLM 负责摘要、交叉引用、归档、维护

---

## 🏗️ 三层架构

```
~/.openclaw/workspace/
├── raw/                    # Layer 1: 原始素材（不可变）
│   ├── README.md
│   └── [源文件...]
├── wiki/                   # Layer 2: Wiki（LLM 维护）
│   ├── index.md            # 索引：每页一行摘要
│   ├── log.md              # 日志：追加式操作记录
│   ├── [分类目录]/
│   └── [文章 .md...]
├── SCHEMA.md               # Layer 3: Schema（Wiki 配置）
├── PROJECT_PLAN.md         # 本文件
└── [其他工作区文件]
```

### Layer 1: Raw Sources（素材层）
- **性质**：不可变，LLM 只读不写
- **用途**：论文、博客、代码、图片、笔记等原始素材
- **当前状态**：✅ 19+ 文件已收集（PDF + Markdown）

### Layer 2: Wiki（知识层）
- **性质**：LLM 全权拥有和维护
- **用途**：摘要、概念页、实体页、对比分析、综合页
- **当前状态**：⚠️ 目录结构已建立，内容为空

### Layer 3: Schema（配置层）
- **性质**：人类 + LLM 共同演进
- **用途**：定义 Wiki 结构、约定、工作流
- **当前状态**：❌ **尚未创建（优先级最高）**

---

## 📊 当前进度

### ✅ 已完成
- [x] 项目初始化和目录结构设计
- [x] raw/ 数据收集（19+ 文件，PDF + MD）
- [x] wiki/ 分类目录建立（6 个分类）
- [x] PDF 处理工具安装（poppler/pdftotext）
- [x] raw/README.md 编写
- [x] **SCHEMA.md**（Wiki 配置文件）
- [x] **index.md**（每页一行摘要格式）
- [x] **log.md**（操作日志）
- [x] **OBSIDIAN_GUIDE.md**（Obsidian 配置指南）
- [x] **.gitignore**（版本管理配置）

### 📋 待完成
- [ ] Git 仓库初始化（等待用户批准）
- [ ] 知识编译：raw → wiki（19+ 文件待处理）
- [ ] 问答功能测试
- [ ] Lint 健康检查流程
- [ ] Obsidian 插件安装（可选）
- [ ] qmd 搜索引擎（大规模时可选）

---

## 🚀 行动计划

### 第一步：Schema 和基础设施 ✅ 已完成

- [x] 创建 `SCHEMA.md`
- [x] 重写 `index.md`
- [x] 创建 `log.md`
- [x] 创建 `.gitignore`
- [x] 创建 `OBSIDIAN_GUIDE.md`
- [ ] Git 初始化

### 第二步：知识编译 🟡（当前）

按优先级处理 raw/ 中的文件：

**第一轮：核心主题**（建立知识骨架）
1. 【25-09】Effective context engineering for AI agents (Anthropic)
2. 【25-01】A-Mem: Agentic Memory for LLM Agents
3. 【25-12】Memory in the Age of AI Agents: A Survey
4. 【25-03】Large Language Model Agent: A Survey

**第二轮：补充主题**
5. 【25-09】Writing effective tools for agents (Anthropic)
6. 【25-09】Welcome to the Era of Experience (David Silver)
7. 【26-01】动态上下文发现 (Cursor)
8. 【26-3】Harness design for long-running app dev (Anthropic)

**第三轮：项目文档**
9. AgentScope-Java/Python 说明文档
10. deer-flow 说明文档
11. Learn-Claude-Code 说明文档

**第四轮：剩余论文和博客**
12-19. 其他 PDF 文件

每个文件的编译流程：
1. 使用 pdftotext 提取文本
2. LLM 阅读并提取关键信息
3. 与用户讨论关键要点（可选）
4. 生成摘要页到 wiki/
5. 更新相关概念页和实体页
6. 更新 index.md
7. 记录到 log.md

### 第四步：测试和优化（下周）

- 基于 Wiki 进行问答测试
- 调整 Schema 中的约定
- 评估 index.md 的检索效果
- 尝试 Lint 健康检查

---

## 🔧 三个核心操作

### 1. Ingest（摄入）
```
用户新增素材 → 放入 raw/ → 告诉 LLM "编译知识库"
→ LLM 读取 → 讨论 → 写摘要 → 更新索引 → 更新相关页 → 记录日志
```
一个素材可能更新 10-15 个 Wiki 页面。

### 2. Query（查询）
```
用户提问 → LLM 读取 index.md 定位相关页 → 深入阅读 → 综合回答
→ 好答案归档回 Wiki 作为新页面
```
**关键**：探索和查询的结果也应该归档，让知识持续复利。

### 3. Lint（健康检查）
```
定期运行 → 检查矛盾、过时内容、孤立页面、缺失引用、数据缺口
→ 建议新文章方向 → 建议需要补充的源
```

---

## 📏 成功指标

### 规模目标
- [ ] raw/ 素材：20+ 文件 ✅
- [ ] wiki/ 文章：30+ 篇
- [ ] 总字数：10 万+
- [ ] 交叉引用覆盖率：>80%

### 质量目标
- [ ] 每篇摘要准确反映原文核心
- [ ] 分类合理，无孤立页面
- [ ] index.md 能有效支撑问答检索
- [ ] log.md 完整记录所有操作

### Karpathy 参考基准
- ~100 个源
- ~几百页 Wiki
- ~40 万字
- index.md 足够支撑检索，无需 RAG

---

## 🛠️ 技术栈

| 组件 | 工具 | 状态 |
|------|------|------|
| Wiki 前端 | Obsidian | ✅ |
| 网页剪藏 | Obsidian Web Clipper | 待确认 |
| PDF 处理 | poppler (pdftotext) | ✅ |
| 幻灯片 | Marp (Obsidian 插件) | 可选 |
| 数据视图 | Dataview (Obsidian 插件) | 可选 |
| 本地搜索 | qmd / index.md | index.md 优先 |
| 可视化 | matplotlib | 可选 |
| 版本管理 | git | 可选 |

---

## 📂 当前 raw/ 文件清单

| # | 文件 | 类型 | 分类 | 状态 |
|---|------|------|------|------|
| 1 | OpenAI for Developers 2025 | 博客 | AI-Agent | 待编译 |
| 2 | A-Mem: Agentic Memory | 论文 | 记忆系统 | 待编译 |
| 3 | LLM Agent: A Survey | 论文 | AI-Agent | 待编译 |
| 4 | Survey on Evaluation of LLM-based Agents | 论文 | 评估方法 | 待编译 |
| 5 | AI代理的上下文工程：Manus经验 | 博客 | 上下文工程 | 待编译 |
| 6 | 面向 AI 代理的有效上下文工程 | 博客 | 上下文工程 | 待编译 |
| 7 | Effective context engineering (英文版) | 博客 | 上下文工程 | 待编译 |
| 8 | Welcome to the Era of Experience | 论文 | LLM | 待编译 |
| 9 | Writing effective tools for agents | 博客 | AI-Agent | 待编译 |
| 10 | Wide Research：超越上下文窗口 | 博客 | 上下文工程 | 待编译 |
| 11 | 智能体设计模式 | 博客 | AI-Agent | 待编译 |
| 12 | Memory in the Age of AI Agents | 论文 | 记忆系统 | 待编译 |
| 13 | 动态上下文发现 | 博客 | 上下文工程 | 待编译 |
| 14 | AI Agent Systems (50MB) | 论文 | AI-Agent | 待编译 |
| 15 | 量化代理编码评估中的基础设施噪声 | 博客 | 评估方法 | 待编译 |
| 16 | 长期应用开发的 Harness 设计 | 博客 | AI-Agent | 待编译 |
| 17 | AgentScope-Java 说明文档 | 文档 | 项目实践 | 待编译 |
| 18 | AgentScope-Python 说明文档 | 文档 | 项目实践 | 待编译 |
| 19 | deer-flow 说明文档 | 文档 | 项目实践 | 待编译 |
| 20 | Learn-Claude-Code 说明文档 | 文档 | 项目实践 | 待编译 |

---

## ⚠️ 风险和挑战

| 风险 | 影响 | 应对 |
|------|------|------|
| PDF 解析质量 | 中 | pdftotext + 人工校验关键摘要 |
| Schema 设计不当 | 高 | 小步迭代，编译几篇后复盘 |
| 分类体系不合理 | 中 | 允许 LLM 建议调整，不固定 |
| Token 成本 | 低 | 编译一次性投入，后续查询量小 |
| 中文 PDF 处理 | 中 | poppler 支持中文，需测试 |

---

## 📚 参考

- Karpathy 原始 Gist: https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f
- 博客解析文章: https://aiia.ro/blog/karpathy-llm-wiki-knowledge-base/
- Obsidian: https://obsidian.md/
- qmd 搜索引擎: https://github.com/tobi/qmd
