---
type: detail
title: Client-Side Security AI 检测
category: 安全
tags: cloudflare, security, GNN, LLM, cascading-classifier, zero-day, client-side
created: 2026-04-09
updated: 2026-04-09
sources:
  - 2026-04-09-博客-Cloudflare-客户端安全AI检测.md
---

# Client-Side Security：GNN + LLM 级联检测

> Cloudflare 将 Client-Side Security 开放给所有用户，GNN + LLM 级联分类器将误报率降低 200 倍。
> 来源: [Cloudflare Blog](https://blog.cloudflare.com/client-side-security-open-to-everyone/) | 2026-03-30

## 规模

- 每天评估 **35 亿**个脚本
- 每个企业 zone 平均 **2,200** 个独立脚本
- 30 天内约 1/3 脚本会更新

## 级联分类器架构

```
所有脚本 → GNN（高召回率）
         ├─ 良性 → 结束（仅 GNN 延迟）
         └─ 可疑 → LLM 语义评估（Workers AI, gpt-oss-120b）
                    ├─ 良性 → 覆盖 GNN 判定
                    └─ 恶意 → 告警 + 记录到 R2
```

## 效果

| 指标 | 优化前 | 优化后 | 幅度 |
|------|--------|--------|------|
| 总流量误报率 | ~0.3% | ~0.1% | ↓ 3x |
| 唯一脚本误报率 | ~1.39% | 0.007% | ↓ 200x |

## 实战捕获

**core.js 路由器漏洞**：
- 针对 Xiaomi OpenWrt 路由器
- 注入方式：被污染的浏览器扩展
- 行为：查询 WAN 配置 → 覆盖 DNS → 修改管理员密码
- 状态：GNN + LLM 双重确认，VirusTotal 尚未检出

## 技术要点

- GNN 操作 AST（抽象语法树），对混淆/压缩鲁棒
- LLM 在 Workers AI 上运行（开源模型），提供语义理解
- 所有 GNN 标记的脚本存入 R2 用于审计
- 降低 GNN 阈值 → 捕获更多零日，不增加误报
