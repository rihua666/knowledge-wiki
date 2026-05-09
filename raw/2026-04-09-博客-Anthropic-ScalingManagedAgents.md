# Scaling Managed Agents: Decoupling the brain from the hands
> 来源: https://www.anthropic.com/engineering/managed-agents
> 抓取日期: 2026-04-09
> 标签: #anthropic #agent #harness #architecture

---

A running topic on the Engineering Blog is how to build effective agents and design harnesses for long-running work. A common thread is that harnesses encode assumptions about what Claude can't do on its own—assumptions that go stale as models improve.

Managed Agents: a hosted service in the Claude Platform that runs long-horizon agents on your behalf through a small set of interfaces meant to outlast any particular implementation.

## Core Design

Following the OS pattern of virtualizing hardware, Managed Agents virtualize agent components:
- **Session**: append-only log of everything that happened
- **Harness**: the loop that calls Claude and routes tool calls to infrastructure
- **Sandbox**: execution environment for code and file edits

Each can be swapped without disturbing the others.

## Don't adopt a pet

Initially placed all components in a single container (coupled design). Problems:
- Container failure = session loss
- Hard to debug (only window was WebSocket event stream)
- Coupling to container network made VPC integration difficult

**Solution: decouple brain from hands**
- Harness calls container via execute(name, input) → string
- Container becomes cattle—if it dies, harness catches error, Claude retries with new container
- Harness becomes cattle too—crash recovery via wake(sessionId) + getSession(id)

## Security boundary

In coupled design, untrusted code ran alongside credentials. Fix:
- Auth bundled with resource (e.g., Git repo access tokens during sandbox init)
- OAuth tokens stored in secure vault, accessed via MCP proxy
- Harness never aware of credentials

## Session ≠ Context window

Session provides durable context storage outside Claude's context window via getEvents():
- Positional slices of event stream
- Supports rewinding, rereading context
- Context transformations (compaction, trimming) happen in harness, not session

## Performance

Decoupling brain from hands:
- p50 TTFT dropped ~60%
- p95 TTFT dropped over 90%
- Containers provisioned only when needed via tool call
- Scaling = many stateless harnesses + connect to hands on demand

## Many brains, many hands

- Brains can work against resources in customer VPCs without network peering
- Each brain can connect to multiple execution environments
- Earlier models couldn't reason about many environments; newer models can
