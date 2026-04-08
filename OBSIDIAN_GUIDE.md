# Obsidian 配置指南

> 如果你想用 Obsidian 作为知识库前端，按以下步骤配置。

## 快速开始

1. **打开 Vault**：Obsidian → 打开文件夹 → 选择 `~/.openclaw/workspace`
2. **设置根目录**：设置 → 文件与链接 → 将 wiki/ 设为笔记根目录（可选，也可以直接用整个 workspace）

## 推荐插件

### 必装
- **Graph View**（内置）— 查看知识图谱，发现关联和孤立页面
- **Dataview** — 基于 frontmatter 的动态查询，如列出所有未更新超过 30 天的页面

### 推荐
- **Marp** — Markdown 转 PPT，从 Wiki 直接生成演示文稿
- **Obsidian Web Clipper**（浏览器扩展）— 网页一键转 Markdown 存入 raw/

### 可选
- **qmd 集成** — 当 Wiki 增长到 100+ 页面时，考虑用 qmd 做本地搜索
- **Calendar** — 按日期浏览 log.md
- **Homepage** — 将 wiki/index.md 设为启动页

## 图片处理

设置 → 文件与链接：
- **附件文件夹路径**：设为 `raw/assets/`
- **默认附件位置**：指定文件夹

设置 → 快捷键：
- 搜索"下载" → 找到"下载当前文件的附件" → 绑定快捷键（如 Ctrl+Shift+D）

这样用 Web Clipper 保存网页后，按快捷键即可将图片下载到本地。

## Wiki 浏览建议

- **主页**：`wiki/index.md` — 全局索引
- **日志**：`wiki/log.md` — 操作历史
- **图谱**：Graph View — 查看知识关联
- **分类**：进入 wiki/ 下的各分类目录浏览
