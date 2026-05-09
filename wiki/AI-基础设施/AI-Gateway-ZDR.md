---
type: detail
title: AI Gateway 零数据保留
category: AI-基础设施
tags: vercel, AI-gateway, ZDR, privacy, compliance, multi-provider
created: 2026-04-09
updated: 2026-04-09
sources:
  - 2026-04-08-博客-Vercel-AI-Gateway-ZDR.md
---

# AI Gateway 零数据保留

> Vercel AI Gateway 新增团队级 ZDR，自动路由到已签零数据保留协议的 provider，合规从应用代码变成基础设施。
> 来源: [Vercel Blog](https://vercel.com/blog/zdr-on-ai-gateway.md) | 2026-04-08

## 问题

多模型场景下数据政策碎片化：
- 不同 provider 有不同的数据保留条款
- 需要逐个阅读 ToS、追踪合规状态
- 开发者需在每个请求上配置 opt-out

## 解决方案

AI Gateway 作为合规基础设施层：

| 功能 | 说明 |
|------|------|
| **团队级 ZDR** | Pro/Enterprise，所有请求仅路由到 ZDR 兼容 provider |
| **请求级 ZDR** | 特定敏感工作流的细粒度控制 |
| **禁止提示训练** | 阻止 provider 使用提示数据训练模型 |

## 实现示例

```typescript
providerOptions: {
  gateway: {
    zeroDataRetention: true,        // ZDR
    disallowPromptTraining: true,   // 禁止训练
  } satisfies GatewayProviderOptions,
}
```

## 关键设计

- 团队级和请求级叠加生效（任一启用即强制）
- 每个响应包含路由元数据（审计追踪）
- 支持 OpenAI、Anthropic、Google 等 ZDR provider

## 核心观点

> "合规从应用代码变成基础设施" — 不需要在每个路由写自定义逻辑，gateway 统一执行策略。
