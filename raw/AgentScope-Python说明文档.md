# AgentScope Python 说明文档

## 目录

- [项目概述](#项目概述)
- [快速开始](#快速开始)
- [核心功能](#核心功能)
- [技术架构](#技术架构)
- [模型配置](#模型配置)
- [Python SDK 调用](#python-sdk-调用)
- [REST API 调用](#rest-api-调用)
- [多Agent工作流](#多agent工作流)
- [配置文件详解](#配置文件详解)
- [项目文件结构](#项目文件结构)
- [常用命令](#常用命令)
- [故障排查](#故障排查)
- [安全使用建议](#安全使用建议)
- [相关文档](#相关文档)

---

## 项目概述

AgentScope 是一个生产级、易于使用的 Agent 框架，具有可观察性、可控性和多Agent支持。它利用模型的推理和工具使用能力，而不是用严格的提示和固执的编排来约束它们。

- **项目地址**: https://github.com/agentscope-ai/agentscope
- **当前版本**: v1.0.18 (2026-03-26)
- **许可证**: Apache License 2.0
- **Stars**: 20.7k

### 特性亮点

- **简单**: 5分钟快速构建 Agent，内置 ReAct Agent、工具、Skills、人机交互、记忆、规划、实时语音、评估和模型微调
- **可扩展**: 大量生态系统集成，支持 MCP 和 A2A 协议，消息中心支持灵活的多Agent编排
- **生产就绪**: 支持本地部署、无服务器云端部署、K8s 集群部署，内置 OTel 支持

---

## 快速开始

### 1. 环境要求

- Python 3.10+
- pip 或 uv

### 2. 安装步骤

```bash
# 从 PyPI 安装
pip install agentscope

# 或使用 uv
uv pip install agentscope

# 从源码安装
git clone -b main https://github.com/agentscope-ai/agentscope.git
cd agentscope
pip install -e .
# 或 uv pip install -e .
```

### 3. 快速示例

```python
from agentscope.agent import ReActAgent, UserAgent
from agentscope.model import DashScopeChatModel
from agentscope.formatter import DashScopeChatFormatter
from agentscope.memory import InMemoryMemory
from agentscope.tool import Toolkit, execute_python_code, execute_shell_command
import os, asyncio

async def main():
    toolkit = Toolkit()
    toolkit.register_tool_function(execute_python_code)
    toolkit.register_tool_function(execute_shell_command)

    agent = ReActAgent(
        name="Friday",
        sys_prompt="You're a helpful assistant named Friday.",
        model=DashScopeChatModel(
            model_name="qwen-max",
            api_key=os.environ["DASHSCOPE_API_KEY"],
            stream=True,
        ),
        memory=InMemoryMemory(),
        formatter=DashScopeChatFormatter(),
        toolkit=toolkit,
    )

    user = UserAgent(name="user")

    msg = None
    while True:
        msg = await agent(msg)
        msg = await user(msg)
        if msg.get_text_content() == "exit":
            break

asyncio.run(main())
```

---

## 核心功能

### 1. ReAct Agent

- 内置 ReAct (Reasoning-Acting) 范式
- 自主规划和执行复杂任务
- 动态决定使用哪些工具

### 2. 实时语音 Agent

- 语音理解和响应
- 支持实时语音交互
- 多Agent实时语音游戏示例

### 3. 人机交互

- 实时中断支持
- 保留完整上下文和工具状态
- 无缝恢复执行

### 4. MCP 协议支持

- 集成 MCP 兼容服务器
- 将 MCP 工具作为本地可调用函数使用
- 支持细粒度 MCP 控制

### 5. A2A 协议支持

- Agent-to-Agent 协议
- 分布式多Agent协作
- 服务注册和发现

### 6. Agentic RL (强化学习)

- 与 Trinity-RFT 库集成
- 支持模型微调
- 多种训练场景示例

### 7. 多Agent工作流

- MsgHub 消息中心
- 支持顺序、并发、实时对话
- 灵活的消息路由

### 8. 记忆系统

- 短期记忆 (InMemoryMemory)
- 长期记忆 (带语义搜索)
- SQLite 会话存储
- 记忆压缩

### 9. RAG (检索增强生成)

- 企业知识库集成
- 自托管 embedding
- 阿里云百炼支持

---

## 技术架构

- **编程语言**: Python 100%
- **依赖管理**: pip, uv
- **核心框架**: 
  - LangChain (集成)
  - Project Reactor (响应式编程)
- **部署方式**: 
  - 本地部署
  - 无服务器云端
  - Kubernetes 集群
- **可观测性**: OpenTelemetry (OTel)

---

## 模型配置

### 支持的模型

AgentScope 支持多种模型，通过统一的模型接口适配：

```python
from agentscope.model import DashScopeChatModel

model = DashScopeChatModel(
    model_name="qwen-max",
    api_key=os.environ["DASHSCOPE_API_KEY"],
    stream=True,
)
```

支持的模型类型：
- **阿里云通义千问**: `DashScopeChatModel`
- **OpenAI**: `OpenAIChatModel`
- **Anthropic**: `AnthropicChatModel`
- **Gemini**: `GoogleChatModel`
- **本地模型**: 支持 Ollama 等

### 环境变量

```bash
# 必需
DASHSCOPE_API_KEY=your-key

# 可选
OPENAI_API_KEY=your-key
ANTHROPIC_API_KEY=your-key
```

---

## Python SDK 调用

### 初始化 Agent

```python
from agentscope.agent import ReActAgent
from agentscope.model import DashScopeChatModel
from agentscope.memory import InMemoryMemory
from agentscope.tool import Toolkit

# 创建工具包
toolkit = Toolkit()
toolkit.register_tool_function(execute_python_code)
toolkit.register_tool_function(execute_shell_command)

# 创建 Agent
agent = ReActAgent(
    name="Assistant",
    sys_prompt="You are a helpful AI assistant.",
    model=DashScopeChatModel(
        model_name="qwen-max",
        api_key=os.environ["DASHSCOPE_API_KEY"],
    ),
    memory=InMemoryMemory(),
    toolkit=toolkit,
)
```

### 调用 Agent

```python
# 同步调用
response = agent.call(Msg.builder()
    .textContent("Hello!")
    .build()).block()

# 异步调用
response = await agent.apredict("Hello!")

# 流式输出
for chunk in agent.stream_call("Tell me a story"):
    print(chunk)
```

### 多Agent示例

```python
from agentscope.pipeline import MsgHub, sequential_pipeline
from agentscope.message import Msg
import asyncio

async def multi_agent_conversation():
    agent1 = ...
    agent2 = ...
    agent3 = ...

    async with MsgHub(
        participants=[agent1, agent2, agent3],
        announcement=Msg("Host", "Introduce yourselves.", "assistant")
    ) as hub:
        await sequential_pipeline([agent1, agent2, agent3])
        hub.add(agent4)
        await hub.broadcast(Msg("Host", "Goodbye!", "assistant"))
```

---

## REST API 调用

AgentScope 提供 HTTP API（通过 AgentScope Server）：

```bash
# 启动服务
agentscope server

# 调用 Agent
curl -X POST http://localhost:5000/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Hello",
    "agent_name": "Assistant"
  }'
```

---

## 多Agent工作流

### 顺序执行

```python
from agentscope.pipeline import sequential_pipeline

await sequential_pipeline([agent1, agent2, agent3])
```

### 并发执行

```python
from agentscope.pipeline import concurrent_pipeline

await concurrent_pipeline([agent1, agent2, agent3])
```

### 实时对话

```python
from agentscope.pipeline import MsgHub

async with MsgHub(participants=[agent1, agent2]) as hub:
    await hub.stream()
```

---

## 配置文件详解

### 模型配置

```python
from agentscope.model import ModelWrapper

model = ModelWrapper(
    config={
        "model_name": "qwen-max",
        "api_key": os.environ["DASHSCOPE_API_KEY"],
    }
)
```

### 工具配置

```python
from agentscope.tool import Toolkit

toolkit = Toolkit()
toolkit.register_tool(tool_function)
toolkit.register_from_mcp(mcp_client)
```

---

## 项目文件结构

```
agentscope/
├── src/agentscope/           # 核心源码
│   ├── agent/                 # Agent 实现
│   │   ├── react_agent.py    # ReAct Agent
│   │   └── ...
│   ├── model/                 # 模型适配器
│   ├── memory/               # 记忆模块
│   ├── tool/                 # 工具系统
│   ├── pipeline/             # 工作流管道
│   ├── message/              # 消息系统
│   ├── server/               # HTTP 服务
│   └── ...
├── examples/                  # 示例代码
│   ├── agent/                # Agent 示例
│   ├── functionality/        # 功能示例
│   ├── game/                 # 游戏示例
│   ├── workflow/             # 工作流示例
│   ├── evaluation/           # 评估示例
│   └── tuner/                # 调优示例
├── docs/                     # 文档
├── tests/                    # 测试
└── pyproject.toml            # 项目配置
```

---

## 常用命令

```bash
# 安装
pip install agentscope
pip install -e .

# 运行示例
python examples/agent/react_agent/main.py

# 启动服务
agentscope server

# 开发模式
python -m agentscope dev
```

---

## 故障排查

### 常见问题

**1. 模型连接失败**
- 检查 API Key 是否正确
- 验证网络连接
- 检查配额

**2. 工具执行失败**
- 检查工具权限
- 验证参数格式

**3. 内存问题**
- 使用记忆压缩
- 配置 SQLite 持久化

---

## 安全使用建议

- 在生产环境中使用安全的网络配置
- 注意 API Key 的安全管理
- 对于不受信任的代码使用沙箱

---

## 相关文档

- [官方文档](https://doc.agentscope.io/)
- [Tutorial](https://doc.agentscope.io/tutorial/)
- [API Docs](https://doc.agentscope.io/api/agentscope.html)
- [FAQ](https://doc.agentscope.io/tutorial/faq.html)

---

*文档生成时间: 2026-03-27*