# RSS Fetcher 使用指南

## 快速开始

```bash
# 拉取最近 30 天的新文章（默认）
node scripts/rss-fetch.mjs

# 只预览，不下载
node scripts/rss-fetch.mjs --dry-run

# 拉取最近 7 天，每个源最多 50 篇
node scripts/rss-fetch.mjs --days=7 --max=50

# 重新拉取所有（忽略已读记录）
node scripts/rss-fetch.mjs --all --days=30
```

## 参数

| 参数 | 默认值 | 说明 |
|------|--------|------|
| `--days=N` | 30 | 只拉最近 N 天的文章，0=全部 |
| `--max=N` | 20 | 每个源最多拉 N 篇 |
| `--all` | - | 忽略已读记录 |
| `--dry-run` | - | 只预览不保存 |

## 配置

编辑 `feeds.yaml` 添加/删除订阅源。

## 定时任务

已配置 OpenClaw cron，每天早上 9:00 自动拉取新文章并通知。

## 状态文件

`.rss-state.json` 记录已读文章的 URL，每个源保留最近 200 条。删除此文件可重置。

## 注意事项

- Anthropic/Simon Willison/Lilian Weng 等 RSS 源可能需要代理访问
- 如遇 404，检查 `feeds.yaml` 中的 URL 是否正确
- 拉取的文件保存为 HTML，带元数据注释（source link、date、tags）
