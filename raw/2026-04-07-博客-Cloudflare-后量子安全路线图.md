# Cloudflare targets 2029 for full post-quantum security
> 来源: https://blog.cloudflare.com/post-quantum-roadmap/
> 抓取日期: 2026-04-09
> 标签: #cloudflare #post-quantum #cryptography #security

---

Cloudflare is accelerating its post-quantum roadmap, now targeting **2029** for full PQ security including PQ authentication.

## Why now

Three independent breakthroughs:

1. **Google announced** a drastically improved quantum algorithm to break elliptic curve cryptography (zero-knowledge proof provided, algorithm not disclosed)
2. **Oratomic published** resource estimates: breaking P-256 requires only ~10,000 qubits on neutral atom computer (3-4 physical qubits per logical qubit vs ~1000 for superconducting)
3. **Google pursuing neutral atoms** alongside superconducting quantum computers

Google accelerated their timeline to 2029. IBM Quantum Safe CTO can't rule out "moonshot attacks" as early as 2029.

## Three fronts of progress

- **Hardware**: neutral atoms, superconducting, ion-trap, photonics, topological qubits
- **Error correction**: neutral atom connectivity enables order-of-magnitude better codes (3-4:1 ratio vs 1000:1)
- **Software**: Google's algorithm improvements + architecture-specific optimizations

## Authentication > Encryption priority

Historical focus was PQ encryption (mitigating harvest-now/decrypt-later). With imminent Q-Day:
- Broken authentication is catastrophic (any overlooked key = attacker access)
- Automatic software updates become RCE vectors
- Priority: long-lived keys (root certs, API auth, code-signing certs)

## Current state

- 65%+ of human traffic to Cloudflare is PQ encrypted (since 2022)
- Authentication upgrade is the remaining challenge
