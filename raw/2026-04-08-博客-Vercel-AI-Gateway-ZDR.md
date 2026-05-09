# Zero Data Retention on AI Gateway
> 来源: https://vercel.com/blog/zdr-on-ai-gateway.md
> 抓取日期: 2026-04-09
> 标签: #vercel #AI-gateway #ZDR #privacy #compliance

---

Building with multiple AI models means wrestling with fragmented data policies. AI Gateway handles the negotiation and enforcement automatically.

## New capabilities

- **Team-wide ZDR**: Pro/Enterprise, all requests route through ZDR-compliant providers only (OpenAI, Anthropic, Google, etc.)
- **Request-level controls**: Per-request ZDR for specific sensitive workflows via provider options
- **Disallow Prompt Training**: Prevents providers from using prompt data for model training

## Implementation

```typescript
import type { GatewayProviderOptions } from '@ai-sdk/gateway';
import { streamText } from 'ai';

const result = streamText({
  model: 'anthropic/claude-sonnet-4.6',
  prompt: 'Analyze this sensitive business data.',
  providerOptions: {
    gateway: {
      zeroDataRetention: true,
    } satisfies GatewayProviderOptions,
  },
});
```

Each response includes routing metadata showing which providers were considered and filtered. Supports AI SDK, Chat Completions API, Responses API, Anthropic Messages API, and OpenResponses API.

Key insight: compliance as infrastructure, not application code.
