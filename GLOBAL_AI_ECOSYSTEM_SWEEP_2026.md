# Positron Global AI Ecosystem Sweep — 2026

## Purpose

This layer catalogs distinct capabilities found across current AI agents, models, agent frameworks, protocols, memory systems, coding agents, browser/computer-use systems, scientific agents, creative agents, workflow systems, and physical-AI systems. Positron integrates the **capability patterns**, not third-party proprietary code or permissions.

## Coverage added

- Personal/always-on agents: OpenClaw, Hermes Agent, QwenPaw/CoPaw, OpenHuman, nanobot, ZeroClaw, Leon, Open Assistant, Palmier, Meta Muse.
- Agent orchestration: OpenAI Agents SDK/API, Microsoft Agent Framework, Google ADK, LangGraph, CrewAI, Pydantic AI, Mastra, LlamaIndex, smolagents, AgentScope, Dify, AutoGen, Strands.
- Coding agents: Codex, Claude Code, Gemini CLI, OpenHands, Cline, OpenCode, Aider, Qwen Code, SWE-agent.
- Computer/browser/mobile: Gemini Computer Use, Anthropic Computer Use, Browser Use, Playwright MCP, Cua, AppAgent, UFO.
- Memory/knowledge: Mem0, Letta, Zep, Graphiti, R2R.
- Protocols: MCP, A2A, AG-UI, A2UI, ACP.
- Research/science: Deep Research class systems, GPT Researcher, STORM, scientific-agent architectures, AutoLabs.
- Creative: Adobe Firefly Creative Agent, Runway Agent.
- Physical AI: NVIDIA Isaac GR00T and Cosmos/physical-AI ecosystem.
- Automation/observability: n8n, Prefect, AgentOps, Langfuse.
- Multi-agent/lifelong learning: MetaGPT, ChatDev, CAMEL, Voyager.

## Positron integration

The registry is exposed through `positron.ai_ecosystem`. The runtime loads the catalog at engine initialization and records its summary in each task context. Future adapters can bind individual capabilities to Positron tools/skills while retaining Guardian authorization, verification, journal, checkpoints, and approval controls.

## Cross-check principles

1. Do not claim every AI product in existence is represented; the AI ecosystem is continuously changing and the registry is a dated sweep.
2. Distinct capability is the unit of integration; duplicate implementations are catalogued as sources/adapters rather than copied wholesale.
3. External systems do not gain authority over Positron merely because they are catalogued.
4. Tool access remains behind Positron's existing permission and Guardian boundaries.
5. New capabilities can be added as new dated catalog entries and separately tested adapters.

## Web cross-check sources

- OpenAI Agents SDK and sandbox: https://openai.com/index/the-next-evolution-of-the-agents-sdk/
- Microsoft Agent Framework: https://devblogs.microsoft.com/agent-framework/
- Google ADK: https://developers.googleblog.com/
- Meta Muse: https://ai.meta.com/muse/
- QwenPaw: https://www.alibabacloud.com/help/en/model-studio/qwenpaw
- OpenClaw: https://openclaw.ai/
- MCP 2026-07-28: https://blog.modelcontextprotocol.io/posts/2026-07-28/
- A2A 1.0: https://a2a-protocol.org/dev/blog/2026/03/12/a2a-protocol-ships-v1.0-production-ready-standard-for-agent-to-agent-communication/
- Scientific agents survey: https://pubmed.ncbi.nlm.nih.gov/42566370/
- AutoLabs: https://www.nature.com/articles/s41598-026-45593-z
- Adobe Firefly agent: https://news.adobe.com/news/2026/06/adobe-unveils-major-expansion
- Runway Agent: https://runway.com/news/introducing-runway-agent
- NVIDIA Isaac GR00T: https://developer.nvidia.com/blog/develop-humanoid-robot-policies-end-to-end-with-nvidia-isaac-gr00t/
