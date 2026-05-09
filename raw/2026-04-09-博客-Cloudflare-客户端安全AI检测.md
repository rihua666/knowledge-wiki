# Cloudflare Client-Side Security: smarter detection, now open to everyone
> 来源: https://blog.cloudflare.com/client-side-security-open-to-everyone/
> 抓取日期: 2026-04-09
> 标签: #cloudflare #security #AI-detection #GNN #LLM

---

We are opening our advanced Client-Side Security tools to all users, featuring a new cascading AI detection system. By combining graph neural networks and LLMs, we've reduced false positives by up to 200x while catching sophisticated zero-day exploits.

## How it works

Client-Side Security assesses 3.5 billion scripts per day, protecting 2,200 scripts per enterprise zone on average. Uses browser reporting (e.g., Content Security Policy), zero latency impact.

Advanced features:
- **Smarter malicious script detection:** GNN + LLM cascading classifier
- **Code change monitoring:** Continuous detection for compliance (PCI DSS v4)
- **Proactive blocking rules:** Positive content security rules

## Cascading AI Detection Architecture

1. **Every script first evaluated by GNN** — operates on AST, learns structural representations that generalize across obfuscation. Tuned for high recall.
2. If GNN flags as potentially malicious → **forwarded to open-source LLM on Workers AI** (`gpt-oss-120b`) for second opinion.
3. LLM semantically evaluates script intent. If benign → overrides GNN verdict.

**Results:**
- Overall FP rate: reduced ~3x (from ~0.3% to ~0.1%)
- Unique scripts FP rate: reduced ~200x (from ~1.39% to 0.007%)
- Millions fewer false alarms daily

## Zero-day catch: core.js router exploit

Detected a novel, highly obfuscated malicious script targeting Xiaomi OpenWrt-based routers. The payload:
- Queried router WAN configuration
- Overwrote DNS settings to hijack traffic through Chinese public DNS servers
- Attempted to lock out owner by changing admin password
- Injected via compromised browser extensions
- Not yet detected by VirusTotal

GNN revealed underlying malicious structure despite obfuscation; Workers AI LLM confidently confirmed intent.
