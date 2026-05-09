# From bytecode to bytes: automated magic packet generation
> 来源: https://blog.cloudflare.com/from-bpf-to-packet/
> 抓取日期: 2026-04-09
> 标签: #cloudflare #security #BPF #Z3 #malware #symbolic-execution

---

By applying symbolic execution and the Z3 theorem prover to BPF bytecode, we've automated the generation of malware trigger packets, cutting analysis time from hours to seconds.

## Problem

Linux malware often hides in BPF (Berkeley Packet Filter) socket programs—small executable logic embedded in the kernel to customize network traffic processing. BPFDoor, used by China-based threat actors since 2021, uses BPF to monitor incoming traffic without requiring open ports.

Reverse-engineering BPF filters by hand is slow; 100+ instruction programs are exponentially complex.

## Solution: Symbolic execution + Z3

Treat BPF code as a series of constraints rather than instructions. Using Z3 theorem prover to work backward from malicious filter to automatically generate the triggering packet.

### Approach
1. **Shortest path calculation**: BFS through BPF instructions to find shortest path to ACCEPT
2. **Symbolic execution**: Create symbolic variables for packet bytes, registers, memory
3. **Constraint solving**: Z3 solves the constraint system to produce valid packet bytes
4. **Packet crafting**: Use scapy to construct the actual network packet

### BPFPacketCrafter implementation
- Symbolic packet bytes as BitVec variables
- BPF virtual machine state tracking (registers A/X, memory M[0-15])
- Instruction execution mapped to Z3 constraints
- Solution translated to actual packet bytes at correct offsets

## Example: BPFDoor

BPFDoor checks for IPv6/IPv4 + UDP protocol + destination port 53 (DNS). The tool automatically finds the shortest path through BPF instructions and generates the matching packet.
