# 个人知识库 Wiki

> 由 LLM 编译和维护的系统性知识库，基于 Karpathy 的 LLM Wiki 方法论。
> 最后更新：2026-05-08

---

## 📊 统计

- **素材总数**：43+
- **Wiki 文章**：50（8 汇总 + 42 细节）
- **主题分类**：8 个

---

## 🔬 核心主题

- [[🏠上下文工程]] — 上下文策展的四大方向：静态优化、动态发现、工程实践、架构扩展
- [[🏠AI-Agent]] — 架构、Harness 设计、工具、设计模式、生态标准、Managed Agents、多智能体协作
- [[🏠记忆系统]] — 从无状态到有经验：分类框架与实践方案
- [[🏠评估方法]] — 基础设施噪声、评估维度与基准
- [[🏠安全]] — AI 驱动攻防、后量子密码学、零日漏洞、儿童安全
- [[🏠AI-基础设施]] — 多模型路由、合规、部署、OpenAI 企业战略
- [[🏠LLM]] — 理论基础、前沿方向、方法论反思
- [[🏠项目实践]] — 开源项目、工具实践与工程经验

---

## 📚 细节文章

### 上下文工程
- [[有效上下文工程]] — Anthropic 全指南 (2 个源)
- [[动态上下文发现]] — Cursor 五项实践 (1 个源)
- [[Manus-经验]] — KV 缓存/掩蔽/文件系统/注意力操控 (1 个源)
- [[Wide-Research]] — 并行子代理架构 (1 个源)

### AI-Agent
- [[你所不知道的Agent]] — Agent 范式、Harness、上下文工程全景 ⭐新
- [[ScalingManagedAgents]] — Anthropic Managed Agents 架构 ⭐新
- [[AI-Agent-Systems]] — ASU 架构综述
- [[Harness-Design]] — Anthropic 三代理架构
- [[Writing-Tools]] — Anthropic 工具设计 5 原则
- [[设计模式]] — Level 0-3 分级和设计模式体系
- [[LLM-Agent-Survey]] — 方法论全面综述
- [[OpenAI-2025]] — Responses API、Agent SDK、开放权重
- [[多智能体协作模式]] — 五种主流模式选择指南 ⭐新
- [[Agent-CLI设计原则]] — 给 Agent 设计 CLI 的十个原则 ⭐新
- [[Skill-Memory工程实践]] — fireworks-skill-memory 开源项目 ⭐新
- [[AI落地与软件工厂]] — Agent 落地核心命题、L8 软件工厂 ⭐新
- [[Agent-Harness驯化范式]] — 从通用代理到驯化范式，硅谷新共识 ⭐新
- [[Agent-Harness十二组件]] — 生产级 Harness 的 12 组件与 7 大架构决策 ⭐新
- [[规范驱动开发]] — Spec-Driven Development 元方法论 ⭐新
- [[MCP实践指南]] — Anthropic MCP 三大优化解法与三层定位 ⭐新
- [[Claude-Code质量Postmortem]] — Anthropic 官方复盘 Claude Code 三重质量退化 ⭐新

### 记忆系统
- [[A-Mem]] — Zettelkasten 动态自进化记忆
- [[Memory-Survey]] — 三维记忆分类框架

### 评估方法
- [[基础设施噪声]] — 6% 基础设施噪声
- [[Evaluation-Survey]] — 评估方法全面梳理
- [[SWE-CI]] — 基于 CI 循环的长期可维护性评估 ⭐新

### 安全
- [[Project-Glasswing]] — Claude Mythos 发现数千零日漏洞（含完整基准与定价）⭐更新
- [[Client-Side-Security-AI检测]] — GNN + LLM 级联分类器
- [[后量子密码学]] — Q-Day 时间线大幅提前
- [[BPF符号执行]] — 自动化恶意包生成
- [[儿童安全蓝图]] — OpenAI 儿童 AI 安全政策框架 ⭐新
- [[OpenAI安全研究员计划]] — 外部安全研究资助计划 ⭐新

### AI-基础设施
- [[AI-Gateway-ZDR]] — Vercel 零数据保留
- [[OpenAI企业AI下一阶段]] — Frontier + 超级应用，企业收入 >40% ⭐新
- [[OpenAI产业政策]] — 13 页政策白皮书，超级智能治理框架 ⭐新
- [[Codex灵活定价]] — 按量付费，200万+周活开发者 ⭐新
- [[OpenAI收购TBPN]] — 收购科技媒体，构建话语场 ⭐新

### LLM / 理论
- [[Era-of-Experience]] — Silver & Sutton：人类数据时代 → 经验时代
- [[Karpathy知识库与材料科学]] — 个人知识库 + 材料科学 AI ⭐新
- [[早期采用者陷阱]] — 品味 > 工具，深扎 > 广铺 ⭐新

### 项目实践
- [[AgentScope-Python]] — 生产级 Python Agent 框架，20.7k Stars
- [[AgentScope-Java]] — 面向 Agent 编程的 Java 框架，2.2k Stars
- [[DeerFlow]] — 字节跳动 super agent harness
- [[Learn-Claude-Code]] — Agent Harness 工程教育，40.3k Stars
- [[Codex团队自用实践]] — OpenAI Codex 团队自用实践 ⭐新
- [[USB-Clawd物理交互]] — Claude Code 物理弹跳通知外设 ⭐新
- [[Claude-Code的梦境]] — Auto Dream 后台记忆巩固机制 ⭐新
- [[卡兹克创作Skill]] — 个人风格蒸馏为可复用 Skill 的完整方法论 ⭐新
- [[Claude-Code-UltraReview]] — 多 Agent 云端代码审查 3+1 架构 ⭐新
- [[多模态视频转博客]] — 全模态理解替代 ASR+LLM，四步 Agent 工作流 ⭐新

---

## 📖 使用方式

- **浏览主题**：从核心主题（汇总页）开始，按需深入细节文章
- **查询**：直接提问，我会基于 Wiki 回答
- **检查**：告诉我"检查知识库"
