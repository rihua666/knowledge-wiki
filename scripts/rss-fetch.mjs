#!/usr/bin/env node
/**
 * RSS Fetcher — 拉取 RSS 源的新文章，保存到 raw/
 * 用法: node scripts/rss-fetch.mjs [--dry-run] [--all]
 *   --dry-run  只显示新文章，不下载
 *   --all      重新下载所有（忽略已读记录）
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'
import { execSync } from 'child_process'

const __dirname = dirname(fileURLToPath(import.meta.url))
const WORKSPACE = join(__dirname, '..')
const RAW_DIR = join(WORKSPACE, 'raw')
const STATE_FILE = join(WORKSPACE, '.rss-state.json')
const FEEDS_FILE = join(WORKSPACE, 'feeds.yaml')

// ── YAML 极简解析（不依赖第三方库）──
function parseYAML(text) {
  const lines = text.split('\n')
  const feeds = []
  let current = null
  for (const line of lines) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    if (trimmed.startsWith('- url:')) {
      if (current) feeds.push(current)
      current = { url: trimmed.replace('- url:', '').trim(), name: '', tags: [] }
    } else if (current && trimmed.startsWith('name:')) {
      current.name = trimmed.replace('name:', '').trim()
    } else if (current && trimmed.startsWith('tags:')) {
      const tags = trimmed.replace('tags:', '').trim()
      current.tags = tags.split(',').map(t => t.trim()).filter(Boolean)
    }
  }
  if (current) feeds.push(current)
  return feeds
}

// ── 状态管理 ──
function loadState() {
  if (existsSync(STATE_FILE)) {
    return JSON.parse(readFileSync(STATE_FILE, 'utf8'))
  }
  return {}
}

function saveState(state) {
  writeFileSync(STATE_FILE, JSON.stringify(state, null, 2) + '\n')
}

// ── RSS XML 解析 ──
function parseRSS(xml) {
  const items = []
  // 匹配 <item> 或 <entry> 块
  const itemRegex = /<(?:item|entry)\b[^>]*>([\s\S]*?)<\/(?:item|entry)>/gi
  let match

  while ((match = itemRegex.exec(xml)) !== null) {
    const block = match[1]

    function getField(tag) {
      // 优先匹配内容（CDATA 或文本）
      const m = block.match(new RegExp(`<${tag}[^>]*><!\\[CDATA\\[([\\s\\S]*?)\\]\\]></${tag}>`, 'i'))
      if (m) return m[1].trim()
      const m2 = block.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`, 'i'))
      if (m2) return m2[1].replace(/<[^>]*>/g, '').trim()
      return ''
    }

    function getAttr(tag, attr) {
      const m = block.match(new RegExp(`<${tag}[^>]*${attr}=["']([^"']*)["']`, 'i'))
      return m ? m[1] : ''
    }

    const link = getField('link') || getAttr('link', 'href') || getField('id')
    const title = getField('title')
    const pubDate = getField('pubDate') || getField('published') || getField('updated') || getField('dc:date')
    const author = getField('author') || getField('dc:creator') || getField('name')
    const description = getField('description') || getField('summary') || getField('content:encoded') || ''

    if (title && link) {
      items.push({ title, link, pubDate, author, description })
    }
  }

  return items
}

// ── 标题安全化（用于文件名）──
function safeName(title, maxLength = 80) {
  return title
    .replace(/[<>:"/\\|?*\x00-\x1f]/g, '-')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, maxLength)
}

// ── 格式化日期 ──
function fmtDate(dateStr) {
  if (!dateStr) return ''
  try {
    const d = new Date(dateStr)
    if (isNaN(d)) return dateStr
    const y = d.getFullYear().toString().slice(2)
    const m = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')
    return `${y}-${m}-${day}`
  } catch {
    return dateStr
  }
}

// ── 主逻辑 ──
async function main() {
  const args = process.argv.slice(2)
  const dryRun = args.includes('--dry-run')
  const fetchAll = args.includes('--all')
  const daysArg = args.find(a => a.startsWith('--days='))
  const maxDays = daysArg ? parseInt(daysArg.split('=')[1]) : 30
  const maxItemsArg = args.find(a => a.startsWith('--max='))
  const maxItems = maxItemsArg ? parseInt(maxItemsArg.split('=')[1]) : 20
  const proxyArg = args.find(a => a.startsWith('--proxy='))
  
  // 读取代理配置：命令行 > feeds.yaml > 环境变量
  let proxy = proxyArg ? proxyArg.split('=')[1] : ''
  if (!proxy && existsSync(FEEDS_FILE)) {
    const yamlContent = readFileSync(FEEDS_FILE, 'utf8')
    const proxyMatch = yamlContent.match(/^proxy:\s*(.+)$/m)
    if (proxyMatch) proxy = proxyMatch[1].trim()
  }
  if (!proxy) proxy = process.env.HTTPS_PROXY || process.env.HTTP_PROXY || process.env.ALL_PROXY || ''
  
  if (proxy) {
 console.log(`🌐 使用代理: ${proxy}\n`)
    // 通过环境变量设置代理（node fetch 会自动使用）
    process.env.HTTP_PROXY = proxy
    process.env.HTTPS_PROXY = proxy
  }

  // 读取 feeds 配置
  if (!existsSync(FEEDS_FILE)) {
    console.error(`❌ 配置文件不存在: ${FEEDS_FILE}`)
    console.error('请创建 feeds.yaml，格式如下:')
    console.error(`
# RSS 订阅源配置
# 运行: node scripts/rss-fetch.mjs [--dry-run] [--days=30] [--max=20]
#
# 代理配置（留空则不使用代理）
proxy: http://127.0.0.1:7890
#
# --days=N    只拉最近 N 天的文章（默认 30）
# --max=N     每个源最多拉 N 篇（默认 20）
# --all       忽略已读记录，重新拉取
# --dry-run   只显示不保存

- url: https://openai.com/blog/rss.xml
  name: OpenAI Blog
  tags: AI, LLM
`)
    process.exit(1)
  }

  const feeds = parseYAML(readFileSync(FEEDS_FILE, 'utf8'))
  const state = loadState()
  let totalNew = 0
  let totalErrors = 0

  console.log(`📡 拉取 ${feeds.length} 个 RSS 源...\n`)

  for (const feed of feeds) {
    const feedId = feed.url
    console.log(`━━━ ${feed.name || feed.url} ━━━`)

    try {
          // 用 curl 拉取（原生支持代理）
      let curlCmd = `curl -s -L --max-time 20`
      if (proxy) curlCmd += ` -x '${proxy}'`
      curlCmd += ` -H 'User-Agent: Mozilla/5.0 (compatible; RSS Fetcher/1.0)'`
      curlCmd += ` -H 'Accept: application/rss+xml, application/atom+xml, text/xml'`
      curlCmd += ` '${feed.url}'`
      
      let xml
      try {
        xml = execSync(curlCmd, { maxBuffer: 10 * 1024 * 1024 }).toString()
      } catch (err) {
        console.error(`  ❌ curl failed: ${err.message.split('\n')[0]}`)
        totalErrors++
        continue
      }
      
      if (!xml || xml.length < 100) {
        console.error(`  ❌ Empty response (${xml?.length || 0} bytes)`)
        totalErrors++
        continue
      }
      let items = parseRSS(xml)
      
      // 按日期过滤（只保留最近 maxDays 天的）
      if (maxDays > 0 && !fetchAll) {
        const cutoff = Date.now() - maxDays * 86400000
        items = items.filter(item => {
          if (!item.pubDate) return true // 无日期的保留
          const d = new Date(item.pubDate)
          return isNaN(d) || d.getTime() > cutoff
        })
      }
      // 限制每个源的最大数量
      items = items.slice(0, maxItems)
      
      const seen = fetchAll ? [] : (state[feedId] || [])
      const seenIds = new Set(seen)

      let newCount = 0
      const newSeen = [...seen] // 保持已有记录

      for (const item of items) {
        // 用 link 作为去重 ID
        if (seenIds.has(item.link)) continue

        const date = fmtDate(item.pubDate)
        const fileName = date
          ? `【${date}】【${feed.name || 'blog'}】${safeName(item.title)}.html`
          : `【${feed.name || 'blog'}】${safeName(item.title)}.html`

        if (dryRun) {
          console.log(`  📄 ${fileName}`)
          console.log(`     → ${item.link}`)
        } else {
          // 保存 HTML 原文
          const filePath = join(RAW_DIR, fileName)
          const html = `<!-- RSS Fetch: ${feed.url} -->\n<!-- Title: ${item.title} -->\n<!-- Link: ${item.link} -->\n<!-- Date: ${item.pubDate} -->\n<!-- Author: ${item.author} -->\n<!-- Tags: ${(feed.tags || []).join(', ')} -->\n\n<html>\n<body>\n<h1>${item.title}</h1>\n<p>Source: <a href="${item.link}">${item.link}</a></p>\n${item.description}\n</body>\n</html>`

          writeFileSync(filePath, html)
          console.log(`  ✅ ${fileName}`)
        }

        newSeen.push(item.link)
        seenIds.add(item.link)
        newCount++
      }

      // 只保留最近 200 条记录
      state[feedId] = newSeen.slice(-200)

      if (newCount === 0) {
        console.log('  (无新内容)')
      } else {
        console.log(`  🆕 ${newCount} 篇新文章`)
      }

      totalNew += newCount
    } catch (err) {
      console.error(`  ❌ ${err.message}`)
      totalErrors++
    }
  }

  if (!dryRun) {
    saveState(state)
  }

  console.log(`\n${'─'.repeat(40)}`)
  console.log(`✅ 新文章: ${totalNew}  |  错误: ${totalErrors}  |  ${dryRun ? '(dry-run)' : '已保存到 raw/'}  |  最近 ${maxDays} 天`)

  if (totalNew > 0 && !dryRun) {
    console.log(`\n💡 运行 "编译知识库" 处理新素材`)
  }
}

main().catch(err => {
  console.error('Fatal:', err)
  process.exit(1)
})
