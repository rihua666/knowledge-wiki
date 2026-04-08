# DeerFlow 说明文档

## 目录

- [项目概述](#项目概述)
- [快速开始](#快速开始)
- [核心功能](#核心功能)
- [技术架构](#技术架构)
- [模型配置](#模型配置)
- [本地服务](#本地服务)
- [Python Client 调用](#python-client-调用)
- [REST API 调用](#rest-api-调用)
- [Skill 编写指南](#skill-编写指南)
- [配置文件详解](#配置文件详解)
- [项目文件结构](#项目文件结构)
- [常用命令](#常用命令)
- [故障排查](#故障排查)
- [安全使用建议](#安全使用建议)
- [相关文档](#相关文档)

---

## 项目概述

DeerFlow（Deep Exploration and Efficient Research Flow）是一个开源的 **super agent harness**，由字节跳动开发。它把 sub-agents、memory 和 sandbox 组织在一起，再配合可扩展的 skills，让 agent 可以完成几乎任何事情。

- **项目地址**: https://github.com/bytedance/deer-flow
- **当前版本**: 2.0（彻底重写，与 v1 不共用代码）
- **发布日期**: 2026年2月28日发布后登上 GitHub Trending 第1名
- **许可证**: MIT License

---

## 快速开始

### 1. 环境要求

- Python 3.12+
- Node.js 22+
- pnpm
- uv (Python 包管理)
- nginx
- Docker (可选，用于容器化 sandbox)

### 2. 安装步骤

```bash
# 克隆项目
git clone https://github.com/bytedance/deer-flow.git
cd deer-flow

# 生成本地配置文件
make config

# 安装依赖
make install

# 启动服务（开发模式）
make dev
```

### 3. 访问地址

- 前端界面: http://localhost:2026
- API 文档: http://localhost:2024/docs
- Gateway API: http://localhost:8001

---

## 核心功能

### 1. Skills 与 Tools

- Skills 是结构化能力模块，通常是 Markdown 文件，定义了工作流和最佳实践
- 内置 skills 覆盖：研究、报告生成、演示文稿制作、网页生成、图像和视频生成
- 支持自定义 skills 和替换内置 skills
- Skills 采用按需渐进加载，不会一次性把所有内容都塞进上下文

### 2. Sub-Agents

- lead agent 可以动态拉起 sub-agents
- 每个 sub-agent 有独立上下文、工具和终止条件
- 支持并行运行，适合处理复杂多步骤任务
- 适合从几分钟到几小时的任务

### 3. Sandbox 与文件系统

- 支持三种执行模式：本地执行、Docker 执行、Docker + Kubernetes 执行
- 任务运行在隔离的 Docker 容器中
- 完整的文件系统：
  ```
  /mnt/user-data/
  ├── uploads/      # 用户上传文件
  ├── workspace/   # agents 工作目录
  └── outputs/     # 最终交付物
  ```

### 4. 长期记忆

- 跨 session 积累持久 memory
- 记录个人偏好、知识背景、工作习惯
- 保存在本地，控制权始终在用户手里

### 5. IM 渠道

支持从即时通讯应用接收任务：

| 渠道 | 传输方式 | 上手难度 |
|------|----------|----------|
| Telegram | Bot API (long-polling) | 简单 |
| Slack | Socket Mode | 中等 |
| Feishu / Lark | WebSocket | 中等 |

---

## 技术架构

- **后端**: Python (FastAPI + LangGraph + LangChain)
- **前端**: Next.js + React
- **依赖管理**: uv (Python), pnpm (Node.js)
- **代理**: nginx
- **运行时**: LangGraph (in-memory for dev, SQLite checkpointer)

---

## 模型配置

DeerFlow 对模型没有强绑定，推荐具备以下能力的模型：
- 长上下文窗口（100k+ tokens）
- 推理能力
- 多模态输入
- 稳定的 tool use 能力

### 配置示例 (config.yaml)

```yaml
models:
  - name: minimax-m2.5
    display_name: MiniMax M2.5
    use: langchain_openai:ChatOpenAI
    model: MiniMax-M2.5
    api_key: $MINIMAX_API_KEY
    base_url: https://api.minimax.io/v1
    max_tokens: 4096
    temperature: 1.0
    supports_vision: true
```

支持的模型配置示例：
- **MiniMax**: `langchain_openai:ChatOpenAI` + `base_url: https://api.minimax.io/v1`
- **OpenAI**: `langchain_openai:ChatOpenAI`
- **Anthropic**: `langchain_anthropic:ChatAnthropic`
- **DeepSeek**: `deerflow.models.patched_deepseek:PatchedChatDeepSeek`
- **Volcengine Doubao**: `deerflow.models.patched_deepseek:PatchedChatDeepSeek`
- **Google Gemini**: `langchain_google_genai:ChatGoogleGenerativeAI`

### 环境变量 (.env)

```
MINIMAX_API_KEY=your-key
OPENAI_API_KEY=your-key
ANTHROPIC_API_KEY=your-key
TAVILY_API_KEY=your-key
JINA_API_KEY=your-key
```

---

## 本地服务

| 服务 | 地址 | 说明 |
|------|------|------|
| Frontend | http://localhost:2026 | Next.js 前端界面 |
| Gateway | http://localhost:8001 | FastAPI 网关 |
| LangGraph | http://localhost:2024 | LangGraph API |
| API Docs | http://localhost:2024/docs | OpenAPI 文档 |

---

## Python Client 调用

DeerFlow 提供内嵌 Python Client，可直接导入使用：

```python
from deerflow.client import DeerFlowClient

client = DeerFlowClient()

# 聊天
response = client.chat("分析这篇论文", thread_id="my-thread")

# 流式响应
for event in client.stream("hello"):
    if event.type == "messages-tuple" and event.data.get("type") == "ai":
        print(event.data["content"])

# 配置管理
models = client.list_models()        # {"models": [...]}
skills = client.list_skills()        # {"skills": [...]}
client.update_skill("web-search", enabled=True)

# 文件上传
client.upload_files("thread-1", ["./report.pdf"])
```

---

## REST API 调用

### 基础调用

```bash
# 聊天
curl -X POST http://localhost:8001/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "帮我搜索最新的AI新闻", "thread_id": "new"}'

# 流式响应
curl -N http://localhost:8001/chat/stream \
  -H "Content-Type: application/json" \
  -d '{"message": "hello", "thread_id": "test"}'

# 获取模型列表
curl http://localhost:8001/models

# 获取 Skills 列表
curl http://localhost:8001/skills
```

### LangGraph API 直接调用

```bash
# 触发 agent
curl -X POST http://localhost:2024/assistants/whatsapp/run \
  -H "Content-Type: application/json" \
  -d '{
    "input": {"messages": [{"role": "user", "content": "hello"}]},
    "config": {"recursion_limit": 100}
  }'
```

---

## Skill 编写指南

### 基本结构

```markdown
---
version: 1.0
author: Your Name
description: 这是一个示例 skill
---

# Skill 名称

## 概述
描述这个 skill 做什么。

## 使用场景
- 场景1
- 场景2

## 输入格式
描述期望的输入格式。

## 输出格式
描述输出的格式。

## 最佳实践
1. 第一点
2. 第二点

## 示例
\`\`\`yaml
example:
  key: value
\`\`\`
```

### 存放位置

- 内置 skills: `/mnt/skills/public/`
- 自定义 skills: `/mnt/skills/custom/`

### 示例 Skill 文件

```
/mnt/skills/public/
├── research/SKILL.md
├── report-generation/SKILL.md
├── slide-creation/SKILL.md
├── web-page/SKILL.md
└── image-generation/SKILL.md
```

---

## 配置文件详解

### config.yaml 完整结构

```yaml
# 版本号（用于检测过时配置）
config_version: 3

# 日志级别
log_level: info

# Token 使用追踪
token_usage:
  enabled: false

# 模型配置
models:
  - name: your-model
    display_name: 显示名称
    use: langchain_openai:ChatOpenAI
    model: actual-model-name
    api_key: $API_KEY
    base_url: https://api.example.com/v1
    max_tokens: 4096
    temperature: 0.7
    supports_vision: true
    supports_thinking: true

# Sandbox 配置
sandbox:
  use: deerflow.sandbox.local:LocalSandboxProvider  # 本地执行
  # use: deerflow.community.aio_sandbox:AioSandboxProvider  # Docker 容器

# Tools 配置
tools:
  - name: web_search
    enabled: true
  - name: file_edit
    enabled: true

# Skills 配置
skills:
  path: ./skills
  container_path: /mnt/skills

# IM 渠道配置
channels:
  langgraph_url: http://localhost:2024
  gateway_url: http://localhost:8001
  telegram:
    enabled: false
    bot_token: $TELEGRAM_BOT_TOKEN
```

### 环境变量 (.env)

```bash
# 必需
MINIMAX_API_KEY=your-minimax-key

# 可选
OPENAI_API_KEY=your-openai-key
ANTHROPIC_API_KEY=your-anthropic-key
TAVILY_API_KEY=your-tavily-key
JINA_API_KEY=your-jina-key
DEEPSEEK_API_KEY=your-deepseek-key

# IM 渠道
TELEGRAM_BOT_TOKEN=your-telegram-token
SLACK_BOT_TOKEN=your-slack-bot-token
SLACK_APP_TOKEN=your-slack-app-token
FEISHU_APP_ID=your-feishu-app-id
FEISHU_APP_SECRET=your-feishu-secret
```

---

## 项目文件结构

```
deer-flow/
├── backend/                  # 后端代码
│   ├── packages/harness/    # 核心 harness 代码
│   │   └── deerflow/
│   │       ├── agents/      # Agent 实现 (lead_agent, sub_agents)
│   │       ├── config/      # 配置模块 (app_config, model_config 等)
│   │       ├── models/      # 模型适配器 (patched_minimax, patched_deepseek)
│   │       ├── sandbox/     # 沙箱实现 (local, docker)
│   │       ├── tools/       # 内置工具
│   │       ├── memory/      # 长期记忆
│   │       └── client.py    # Python Client
│   ├── tests/               # 测试代码
│   ├── langgraph.json       # LangGraph 配置
│   └── pyproject.toml       # Python 依赖
├── frontend/                # 前端代码 (Next.js)
├── skills/                  # Skills 目录
│   └── public/              # 内置 skills
├── docker/                  # Docker 配置
│   └── nginx/               # Nginx 配置
├── scripts/                 # 脚本文件
│   ├── serve.sh             # 启动服务脚本
│   ├── configure.py         # 配置生成
│   └── check.py             # 环境检查
├── config.yaml              # 主配置文件
├── .env                     # 环境变量
└── Makefile                 # 构建命令
```

---

## 常用命令

```bash
# 配置
make config                  # 生成本地配置文件
make config-upgrade          # 合并新配置项

# 环境检查
make check                   # 检查依赖工具

# 安装依赖
make install                 # 安装前后端依赖
make setup-sandbox           # 预拉取 sandbox 镜像

# 启动服务
make dev                     # 开发模式启动（热更新）
make start                   # 生产模式启动
make dev-daemon              # 后台启动

# 停止服务
make stop                    # 停止所有服务

# Docker 模式
make docker-init             # 初始化 Docker
make docker-start            # Docker 开发模式
make docker-stop             # 停止 Docker

# 生产 Docker
make up                      # 启动生产服务
make down                    # 停止生产服务

# 清理
make clean                   # 清理临时文件
```

---

## 故障排查

### 常见问题

**1. 服务启动失败**

```bash
# 检查日志
cat logs/langgraph.log
cat logs/gateway.log

# 检查端口占用
lsof -i :2024 -i :2026 -i :8001

# 重新启动
make stop && make dev
```

**2. 模型连接失败**

- 检查 `.env` 中的 API Key 是否正确
- 检查 `config.yaml` 中的模型配置
- 验证 API Key 有余额

**3. Sandbox 启动失败**

- Docker 未启动: `open -a Docker`
- 端口被占用: `lsof -i :8080`
- 使用本地模式: `sandbox.use: deerflow.sandbox.local:LocalSandboxProvider`

**4. 前端加载失败**

```bash
# 检查前端状态
lsof -i :2026

# 重装依赖
cd frontend && pnpm install
```

---

## 安全使用建议

⚠️ **注意**：建议将 DeerFlow 部署在本地可信的网络环境下。

安全措施：
1. **访问控制**: 设置 IP 白名单（iptables、硬件防火墙）
2. **身份验证**: 反向代理（nginx）开启高强度验证
3. **网络隔离**: 专用 VLAN，与其他设备隔离
4. **持续关注**: 留意项目安全更新

---

## 相关文档

- [README_zh.md](README_zh.md) - 中文详细说明
- [CONTRIBUTING.md](CONTRIBUTING.md) - 贡献指南
- [backend/docs/CONFIGURATION.md](backend/docs/CONFIGURATION.md) - 配置指南
- [backend/CLAUDE.md](backend/CLAUDE.md) - 架构概览

---

*文档生成时间: 2026-03-27*