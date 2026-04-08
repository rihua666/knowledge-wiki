# AgentScope Java 说明文档

## 目录

- [项目概述](#项目概述)
- [快速开始](#快速开始)
- [核心功能](#核心功能)
- [技术架构](#技术架构)
- [模型配置](#模型配置)
- [Java SDK 调用](#java-sdk-调用)
- [MCP 集成](#mcp-集成)
- [A2A 协议](#a2a-协议)
- [多Agent开发](#多agent开发)
- [项目文件结构](#项目文件结构)
- [构建命令](#构建命令)
- [故障排查](#故障排查)
- [安全使用建议](#安全使用建议)
- [相关文档](#相关文档)

---

## 项目概述

AgentScope Java 是一个面向 Agent 编程的框架，用于构建 LLM 应用。它提供了创建智能 Agent 所需的一切：ReAct 推理、工具调用、记忆管理、多Agent协作等。

- **项目地址**: https://github.com/agentscope-ai/agentscope-java
- **当前版本**: v1.0.10 (2026-03-11)
- **许可证**: Apache License 2.0
- **Stars**: 2.2k
- **主要语言**: Java 95.9%

### 特性亮点

- **🎯 智能 Agent，完全控制**: ReAct 范式，自主规划和执行；运行时干预机制（安全中断、优雅取消、人机交互）
- **🛠️ 内置工具**: PlanNotebook、Structured Output、Long-term Memory、RAG
- **🔌 无缝集成**: MCP 协议、A2A 协议支持
- **🚀 生产级**: 高性能响应式架构、GraalVM 原生镜像、安全沙箱、可观测性

---

## 快速开始

### 1. 环境要求

- JDK 17+

### 2. 安装

通过 Maven 引入：

```xml
<dependency>
    <groupId>io.agentscope</groupId>
    <artifactId>agentscope</artifactId>
    <version>1.0.10</version>
</dependency>
```

或 Gradle：

```groovy
implementation 'io.agentscope:agentscope:1.0.10'
```

### 3. 快速示例

```java
ReActAgent agent = ReActAgent.builder()
    .name("Assistant")
    .sysPrompt("You are a helpful AI assistant.")
    .model(DashScopeChatModel.builder()
        .apiKey(System.getenv("DASHSCOPE_API_KEY"))
        .modelName("qwen-max")
        .build())
    .build();

Msg response = agent.call(Msg.builder()
        .textContent("Hello!")
        .build()).block();
System.out.println(response.getTextContent());
```

---

## 核心功能

### 1. ReAct Agent

- **ReAct 范式**: 推理-行动循环，自主决策
- **动态工具选择**: 根据任务需要动态选择工具
- **可配置**: 支持自定义提示词、模型、记忆

### 2. 运行时干预

- **安全中断**: 暂停执行，保留完整上下文和工具状态
- **优雅取消**: 终止长时间运行的任务，不破坏 Agent 状态
- **人机交互**: 通过 Hook 系统注入修正或指导

### 3. 内置工具

#### PlanNotebook
- 结构化任务管理系统
- 将复杂目标分解为有序、可跟踪的步骤
- 支持创建、修改、暂停、恢复多个并发计划

#### Structured Output
- 自校正输出解析器
- 自动检测错误并引导模型生成有效输出
- 直接映射到 Java POJO

#### Long-term Memory
- 持久化记忆存储
- 跨会话语义搜索
- 多租户隔离

#### RAG
- 企业知识库集成
- 自托管 embedding
- 阿里云百炼支持

### 4. MCP 协议支持

- 集成 MCP 兼容服务器
- 扩展 Agent 能力
- 连接文件系统、数据库、浏览器等

### 5. A2A 协议支持

- 分布式多Agent协作
- 服务注册到 Nacos
- Agent 发现和调用

### 6. 生产级特性

- **高性能**: 基于 Project Reactor 的响应式架构
- **GraalVM 原生镜像**: 200ms 冷启动
- **安全沙箱**: 隔离执行环境
- **可观测性**: OpenTelemetry 集成，AgentScope Studio 可视化

---

## 技术架构

- **编程语言**: Java 95.9%
- **依赖管理**: Maven
- **核心框架**: 
  - Project Reactor (响应式编程)
  - Spring Framework
- **构建工具**: Maven, GraalVM
- **部署方式**: 
  - 本地运行
  - Docker/K8s (通过 agentscope-runtime-java)
  - Serverless
- **可观测性**: OpenTelemetry

---

## 模型配置

### 支持的模型

```java
// 阿里云通义千问
DashScopeChatModel model = DashScopeChatModel.builder()
    .apiKey(System.getenv("DASHSCOPE_API_KEY"))
    .modelName("qwen-max")
    .build();

// OpenAI
OpenAIChatModel model = OpenAIChatModel.builder()
    .apiKey(System.getenv("OPENAI_API_KEY"))
    .modelName("gpt-4")
    .build();

// Anthropic
AnthropicChatModel model = AnthropicChatModel.builder()
    .apiKey(System.getenv("ANTHROPIC_API_KEY"))
    .modelName("claude-3-5-sonnet-20241022")
    .build();
```

### 环境变量

```bash
# 必需
DASHSCOPE_API_KEY=your-key

# 可选
OPENAI_API_KEY=your-key
ANTHROPIC_API_KEY=your-key
```

---

## Java SDK 调用

### 创建 Agent

```java
// 基本配置
ReActAgent agent = ReActAgent.builder()
    .name("Assistant")
    .sysPrompt("You are a helpful AI assistant.")
    .model(DashScopeChatModel.builder()
        .apiKey(System.getenv("DASHSCOPE_API_KEY"))
        .modelName("qwen-max")
        .build())
    .build();

// 带工具的 Agent
ReActAgent agent = ReActAgent.builder()
    .name("Assistant")
    .sysPrompt("You are a helpful AI assistant.")
    .model(model)
    .toolkits(List.of(toolkit))
    .memory(memory)
    .build();
```

### 调用 Agent

```java
// 同步调用
Msg response = agent.call(Msg.builder()
    .textContent("Hello!")
    .build()).block();

// 流式调用
agent.streamCall(Msg.builder()
    .textContent("Tell me a story")
    .build())
    .doOnNext(chunk -> System.out.print(chunk.getTextContent()))
    .block();

// 异步调用
Mono<Msg> response = agent.callAsync(Msg.builder()
    .textContent("Hello!")
    .build());
```

### 记忆管理

```java
// 短期记忆
InMemoryMemory memory = InMemoryMemory.builder()
    .build();

// 长期记忆
SqliteLongTermMemory memory = SqliteLongTermMemory.builder()
    .dbPath("memory.db")
    .build();
```

### 工具使用

```java
// Python 代码执行
 toolkit.add(Toolkit.builder()
     .functions(List.of(ExecutePythonCode.getInstance()))
     .build());

// Shell 命令执行
toolkit.add(Toolkit.builder()
    .functions(List.of(ExecuteShellCommand.getInstance()))
    .build());

// MCP 工具
McpToolkit mcpToolkit = McpToolkit.builder()
    .clients(List.of(mcpClient))
    .build();
```

---

## MCP 集成

### 配置 MCP 客户端

```java
HttpStreamClient mcpClient = HttpStreamClient.builder()
    .name("gaode_mcp")
    .url("https://mcp.amap.com/mcp?key=" + apiKey)
    .build();
```

### 使用 MCP 工具

```java
// 获取 MCP 工具作为本地函数
Function<McpRemoteFuncRequest, Mono<String>> func = 
    mcpClient.getToolFunc("maps_geo");

// 直接调用
Mono<String> result = func.apply(McpRemoteFuncRequest.builder()
    .arguments(Map.of("address", "Tiananmen Square", "city", "Beijing"))
    .build());
```

---

## A2A 协议

### 服务注册

```java
// 注册 Agent 到 Nacos
A2AServiceRegistry registry = A2AServiceRegistry.builder()
    .nacosServer("localhost:8848")
    .build();

registry.register(agent, "assistant-service");
```

### 服务发现

```java
// 发现可用 Agent
A2ADiscoveryService discovery = A2ADiscoveryService.builder()
    .nacosServer("localhost:8848")
    .build();

List<AgentInfo> agents = discovery.discover("assistant-service");

// 调用发现的服务
AgentClient client = AgentClient.builder()
    .serviceUrl(agents.get(0).getUrl())
    .build();

Msg response = client.call(Msg.builder()
    .textContent("Hello")
    .build()).block();
```

---

## 多Agent开发

### 对话编排

```java
// 创建消息中心
MsgHub hub = MsgHub.builder()
    .participants(List.of(agent1, agent2, agent3))
    .announcement(Msg.builder()
        .name("Host")
        .textContent("Introduce yourselves.")
        .role(Role.ASSISTANT)
        .build())
    .build();

// 顺序执行
hub.execute(sequential(agent1, agent2, agent3));

// 并发执行
hub.execute(concurrent(agent1, agent2, agent3));

// 广播消息
hub.broadcast(Msg.builder()
    .name("Host")
    .textContent("Goodbye!")
    .role(Role.ASSISTANT)
    .build());
```

---

## 项目文件结构

```
agentscope-java/
├── agentscope-core/              # 核心模块
│   └── src/main/java/
│       └── io/agentscope/
│           ├── agent/           # Agent 实现
│           │   └── react/       # ReAct Agent
│           ├── model/           # 模型适配器
│           ├── memory/          # 记忆模块
│           ├── tool/            # 工具系统
│           ├── pipeline/        # 工作流
│           ├── message/         # 消息系统
│           └── runtime/         # 运行时
├── agentscope-examples/          # 示例代码
│   └── src/main/java/
│       └── io/agentscope/example/
├── agentscope-extensions/        # 扩展模块
│   ├── mcp/                     # MCP 支持
│   ├── a2a/                     # A2A 支持
│   └── ...
├── agentscope-distribution/     # 打包发布
├── docs/                        # 文档
└── pom.xml                      # Maven 配置
```

---

## 构建命令

```bash
# 克隆项目
git clone https://github.com/agentscope-ai/agentscope-java.git

# 构建
mvn clean install

# 运行示例
mvn exec:java -Dexec.mainClass="io.agentscope.example.ReactAgentExample"

# 构建 GraalVM 原生镜像
mvn package -Pnative
```

---

## 故障排查

### 常见问题

**1. 模型连接失败**
- 检查 API Key 配置
- 验证网络连通性
- 确认模型配额

**2. Maven 依赖问题**
- 检查 Maven 配置
- 更新到最新版本

**3. 运行时错误**
- 查看日志
- 检查 JDK 版本 (需要 JDK 17+)

---

## 安全使用建议

- 使用安全的网络配置
- 妥善管理 API Key
- 对不受信任的工具代码使用沙箱
- 生产环境使用 GraalVM 原生镜像

---

## 相关文档

- [官方文档](https://java.agentscope.io/)
- [中文文档](https://java.agentscope.io/zh/)
- [API 文档](https://java.agentscope.io/apidocs/)
- [Discord 社区](https://discord.gg/eYMpfnkG8h)

---

*文档生成时间: 2026-03-27*