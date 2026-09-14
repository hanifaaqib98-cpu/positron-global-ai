package com.example.positron.data

import com.example.positron.model.EcosystemEntry

object CatalogData {
    val GLOBAL_2026_CATALOG = listOf(
        EcosystemEntry("openclaw", "OpenClaw", "Personal/Always-On", listOf("background_tasks", "persistent_memory", "multi_agent", "human_in_loop"), "Autonomous persistent agent framework for always-on personal assistance and local daemon execution.", "https://openclaw.ai/"),
        EcosystemEntry("muse", "Meta Muse", "Personal/Always-On", listOf("creative_workflows", "persistent_memory", "human_in_loop"), "Multi-modal interactive generative agent designed for continuous user co-creation and reflective context.", "https://ai.meta.com/muse/"),
        EcosystemEntry("hermes-agent", "Hermes Agent", "Personal/Always-On", listOf("persistent_memory", "background_tasks"), "Open personal companion agent designed for high-context continuous operation."),
        EcosystemEntry("qwenpaw", "QwenPaw / CoPaw", "Personal/Always-On", listOf("computer_use", "browser", "persistent_memory", "human_in_loop"), "Desktop co-pilot operating system automation and human-aligned personal productivity.", "https://alibabacloud.com/help/en/model-studio/qwenpaw"),
        EcosystemEntry("openhuman", "OpenHuman", "Personal/Always-On", listOf("persistent_memory", "human_in_loop", "vision_language_action"), "Embodied lifelong memory and behavioral tracking agent."),
        EcosystemEntry("nanobot", "Nanobot", "Personal/Always-On", listOf("background_tasks", "sandbox"), "Micro-runtime single-file agent daemon with low memory footprint."),
        EcosystemEntry("zeroclaw", "ZeroClaw", "Personal/Always-On", listOf("sandbox", "human_in_loop"), "Zero-trust privilege-isolated personal background worker."),
        EcosystemEntry("leon", "Leon AI", "Personal/Always-On", listOf("background_tasks", "persistent_memory"), "Open-source personal assistant living on your private server."),
        EcosystemEntry("open-assistant", "Open Assistant Core", "Personal/Always-On", listOf("multi_agent", "human_in_loop"), "Community conversational agent with distributed task alignment."),
        EcosystemEntry("palmier", "Palmier Companion", "Personal/Always-On", listOf("persistent_memory", "human_in_loop"), "Privacy-focused self-hosted life logger and proactive companion."),

        // Protocols
        EcosystemEntry("mcp", "Model Context Protocol (MCP 2026)", "Protocols", listOf("mcp", "sandbox", "browser"), "Open standard protocol enabling safe, sandboxed tool context exposure between AI hosts and servers.", "https://blog.modelcontextprotocol.io/posts/2026-07-28/"),
        EcosystemEntry("a2a", "Agent-to-Agent Protocol (A2A 1.0)", "Protocols", listOf("a2a", "multi_agent", "sandbox"), "Inter-agent communication protocol with decentralized trust, capability negotiation, and task delegation.", "https://a2a-protocol.org/"),
        EcosystemEntry("ag-ui", "AG-UI Protocol", "Protocols", listOf("human_in_loop", "browser"), "Agent-to-GUI bi-directional interaction and structured view streaming protocol."),
        EcosystemEntry("a2ui", "A2UI Protocol", "Protocols", listOf("human_in_loop", "computer_use"), "Dynamic generative user interface contract emitted directly by autonomous planners."),
        EcosystemEntry("acp", "Agent Control Protocol (ACP)", "Protocols", listOf("sandbox", "human_in_loop", "a2a"), "Governance, kill-switch, and privilege-revocation protocol for federated agent fleets."),

        // Agent Orchestration
        EcosystemEntry("openai-agents-sdk", "OpenAI Agents SDK", "Agent Orchestration", listOf("multi_agent", "sandbox", "human_in_loop"), "Production agent orchestration framework with handoffs, guardrails, and tracing.", "https://openai.com/"),
        EcosystemEntry("microsoft-agent-framework", "Microsoft Agent Framework", "Agent Orchestration", listOf("multi_agent", "enterprise_governance", "human_in_loop", "background_tasks"), "Enterprise multi-agent lifecycle management unified across Semantic Kernel and AutoGen.", "https://devblogs.microsoft.com/agent-framework/"),
        EcosystemEntry("google-adk", "Google Agent Development Kit (ADK)", "Agent Orchestration", listOf("multi_agent", "sandbox", "mcp", "human_in_loop"), "Google high-throughput framework for multi-modal reasoning and Gemini integration.", "https://developers.googleblog.com/"),
        EcosystemEntry("langgraph", "LangGraph", "Agent Orchestration", listOf("multi_agent", "persistent_memory", "human_in_loop"), "Stateful cyclic multi-agent computation graphs with durable checkpoints."),
        EcosystemEntry("crewai", "CrewAI Enterprise", "Agent Orchestration", listOf("multi_agent", "background_tasks"), "Role-based agent teams with hierarchical task delegation and execution."),
        EcosystemEntry("pydantic-ai", "Pydantic AI", "Agent Orchestration", listOf("sandbox", "human_in_loop"), "Type-safe, schema-validated agent framework with structured output guarantees."),
        EcosystemEntry("mastra", "Mastra", "Agent Orchestration", listOf("multi_agent", "persistent_memory", "background_tasks"), "TypeScript-first agent framework with built-in evaluation, workflow loops, and sync engines."),
        EcosystemEntry("llamaindex", "LlamaIndex Workflows", "Agent Orchestration", listOf("persistent_memory", "multi_agent"), "Event-driven multi-agent orchestration focused on advanced retrieval and data reasoning."),
        EcosystemEntry("smolagents", "Smolagents (Hugging Face)", "Agent Orchestration", listOf("sandbox", "multi_agent"), "Code-first lightweight agent library emphasizing explicit Python code execution."),
        EcosystemEntry("agentscope", "AgentScope", "Agent Orchestration", listOf("multi_agent", "background_tasks"), "Actor-model-based multi-agent platform for distributed simulation and cooperation."),
        EcosystemEntry("dify", "Dify AI", "Agent Orchestration", listOf("human_in_loop", "multi_agent", "persistent_memory"), "Visual agentic workflow builder, prompt IDE, and LLM-Ops application platform."),
        EcosystemEntry("autogen", "AutoGen 0.4", "Agent Orchestration", listOf("multi_agent", "sandbox"), "Asynchronous event-driven multi-agent conversations with actor model semantics."),
        EcosystemEntry("strands", "Strands Orchestrator", "Agent Orchestration", listOf("multi_agent", "background_tasks"), "Concurrent fibers of thought execution for complex branching task graphs."),

        // Coding Agents
        EcosystemEntry("claude-code", "Claude Code", "Coding Agents", listOf("computer_use", "sandbox", "human_in_loop"), "Terminal-based autonomous agent executing codebase analysis, editing, and test loops."),
        EcosystemEntry("gemini-cli", "Gemini CLI Agent", "Coding Agents", listOf("computer_use", "sandbox", "mcp"), "Ultra-long context coding assistant leveraging Gemini 1M+ token workspace comprehension."),
        EcosystemEntry("openhands", "OpenHands (All-Hands AI)", "Coding Agents", listOf("computer_use", "sandbox", "browser", "multi_agent"), "Open platform for software development agents operating in Docker sandboxes."),
        EcosystemEntry("cline", "Cline Autonomous Dev", "Coding Agents", listOf("computer_use", "mcp", "human_in_loop"), "In-editor autonomous software engineer supporting deep terminal and MCP integrations."),
        EcosystemEntry("opencode", "OpenCode Runtime", "Coding Agents", listOf("sandbox", "background_tasks"), "Serverless isolated execution sandbox for multi-step automated software engineering."),
        EcosystemEntry("aider", "Aider Git-Pair", "Coding Agents", listOf("sandbox", "human_in_loop"), "Git-aware terminal pair programmer with automatic diff generation and commits."),
        EcosystemEntry("qwen-code", "Qwen Code Studio", "Coding Agents", listOf("sandbox", "multi_agent"), "Open-weight code agent engine optimized for multi-file repository refactoring."),
        EcosystemEntry("swe-agent", "SWE-agent", "Coding Agents", listOf("sandbox", "background_tasks"), "Benchmark-tested autonomous software engineer interface resolving GitHub issues."),
        EcosystemEntry("codex-agent", "Codex 2026 Engine", "Coding Agents", listOf("sandbox", "long_horizon_research"), "Autonomous program synthesis and semantic test verification pipeline."),

        // Computer / Browser / Mobile
        EcosystemEntry("gemini-computer-use", "Gemini Computer Use", "Computer/Browser/Mobile", listOf("computer_use", "vision_language_action", "browser"), "Native multi-modal visual desktop and browser interaction system."),
        EcosystemEntry("anthropic-computer-use", "Anthropic Computer Use", "Computer/Browser/Mobile", listOf("computer_use", "vision_language_action", "sandbox"), "Direct OS cursor, keystroke, and screen capture action synthesis."),
        EcosystemEntry("browser-use", "Browser Use", "Computer/Browser/Mobile", listOf("browser", "vision_language_action"), "Open-source web automation library connecting LLMs directly to browser DOM and visual canvas."),
        EcosystemEntry("playwright-mcp", "Playwright MCP", "Computer/Browser/Mobile", listOf("browser", "mcp", "sandbox"), "Standard MCP server providing high-fidelity headless browser execution to any agent."),
        EcosystemEntry("cua", "Cua Mobile Agent", "Computer/Browser/Mobile", listOf("computer_use", "vision_language_action"), "End-to-end vision-action agent targeting Android and touch-based interfaces."),
        EcosystemEntry("appagent", "AppAgent Multimodal", "Computer/Browser/Mobile", listOf("computer_use", "vision_language_action"), "Autonomous exploration and operation of mobile smartphone applications via visual prompts."),
        EcosystemEntry("ufo", "UFO Windows Agent", "Computer/Browser/Mobile", listOf("computer_use", "human_in_loop"), "Dual-agent UI focused desktop operator for native Windows applications."),

        // Memory / Knowledge
        EcosystemEntry("mem0", "Mem0 Adaptive Memory", "Memory/Knowledge", listOf("persistent_memory", "human_in_loop"), "Continuous user profiling and adaptive episodic memory layer across multiple apps."),
        EcosystemEntry("letta", "Letta (MemGPT Core)", "Memory/Knowledge", listOf("persistent_memory", "background_tasks"), "Self-editing stateful memory architecture with tiered context hierarchy and archival storage."),
        EcosystemEntry("zep", "Zep Temporal Memory", "Memory/Knowledge", listOf("persistent_memory", "background_tasks"), "Long-term conversational graph memory engine with temporal awareness."),
        EcosystemEntry("graphiti", "Graphiti Dynamic Graph", "Memory/Knowledge", listOf("persistent_memory", "long_horizon_research"), "Episodic and semantic knowledge graph real-time construction for reasoning systems."),
        EcosystemEntry("r2r", "R2R Engine", "Memory/Knowledge", listOf("persistent_memory", "sandbox"), "Production RAG and knowledge retrieval system with hybrid search and auto-indexing."),

        // Research / Science
        EcosystemEntry("deep-research", "Deep Research Engine", "Research/Science", listOf("long_horizon_research", "browser", "multi_agent"), "Multi-hour autonomous recursive web search, synthesis, source cross-checking, and report authoring."),
        EcosystemEntry("gpt-researcher", "GPT Researcher", "Research/Science", listOf("long_horizon_research", "browser"), "Parallelized web scraping and objective fact verification for exhaustive research."),
        EcosystemEntry("storm", "STORM (Stanford)", "Research/Science", listOf("long_horizon_research", "multi_agent"), "Synthesizing Topic Outlines through References and Multi-perspective conversation."),
        EcosystemEntry("autolabs", "AutoLabs Scientific System", "Research/Science", listOf("long_horizon_research", "sandbox", "mcp"), "Automated hypothesis generation, laboratory protocol synthesis, and experiment verification.", "https://www.nature.com/"),
        EcosystemEntry("biomed-agent", "BioMed Synthesis Agent", "Research/Science", listOf("long_horizon_research", "persistent_memory"), "Clinical trial correlation and biomedical paper epistemic cross-referencing."),

        // Creative Workflows
        EcosystemEntry("firefly-agent", "Adobe Firefly Creative Agent", "Creative Workflows", listOf("creative_workflows", "human_in_loop", "vision_language_action"), "Agentic generative media orchestrator handling layered design, typography, and video pipelines."),
        EcosystemEntry("runway-agent", "Runway Agent", "Creative Workflows", listOf("creative_workflows", "vision_language_action"), "Autonomous cinematic generative video and interactive world simulation operator."),
        EcosystemEntry("midjourney-agent", "Midjourney Prompt & Composition Director", "Creative Workflows", listOf("creative_workflows"), "Generative aesthetic curator and visual style consistent generation agent."),
        EcosystemEntry("suno-director", "Suno Music Studio Agent", "Creative Workflows", listOf("creative_workflows"), "Procedural musical composition and acoustic multi-track generation assistant."),

        // Physical AI
        EcosystemEntry("isaac-gr00t", "NVIDIA Isaac GR00T", "Physical AI", listOf("vision_language_action", "sandbox"), "Foundation model for humanoid robots translating multimodal instructions to joint actuations."),
        EcosystemEntry("cosmos-physical", "NVIDIA Cosmos Physical Engine", "Physical AI", listOf("vision_language_action", "sandbox"), "World foundation model platform simulating physical dynamics for embodied autonomy."),
        EcosystemEntry("rt-2", "Robotic Transformer RT-2/3", "Physical AI", listOf("vision_language_action"), "Vision-Language-Action (VLA) model enabling direct physical object manipulation."),

        // Automation & Observability
        EcosystemEntry("n8n", "n8n AI Workflow Automation", "Automation & Observability", listOf("background_tasks", "mcp", "human_in_loop"), "Node-based workflow automation integrating agent nodes with thousands of SaaS APIs."),
        EcosystemEntry("prefect", "Prefect Control Plane", "Automation & Observability", listOf("background_tasks", "sandbox"), "Resilient workflow orchestration with automatic retries and checkpoint failure recovery."),
        EcosystemEntry("agentops", "AgentOps Observability", "Automation & Observability", listOf("human_in_loop", "background_tasks"), "Deep monitoring, replay, and cost governance for autonomous agent swarms."),
        EcosystemEntry("langfuse", "Langfuse Tracing", "Automation & Observability", listOf("human_in_loop"), "Open source LLM engineering platform with traces, evaluations, and prompt management."),

        // Multi-Agent & Lifelong
        EcosystemEntry("metagpt", "MetaGPT Software Company", "Multi-Agent & Lifelong", listOf("multi_agent", "sandbox", "creative_workflows"), "Simulated multi-agent software company assigning roles to produce full projects."),
        EcosystemEntry("chatdev", "ChatDev Virtual Org", "Multi-Agent & Lifelong", listOf("multi_agent", "sandbox"), "Communicative agent framework simulating an agile software development company."),
        EcosystemEntry("camel", "CAMEL AI", "Multi-Agent & Lifelong", listOf("multi_agent", "long_horizon_research"), "Communicative agents for mind exploration on large language model society study."),
        EcosystemEntry("voyager", "Voyager Lifelong Learner", "Multi-Agent & Lifelong", listOf("persistent_memory", "vision_language_action", "sandbox"), "Lifelong learning agent with automated skill curriculum and iterative code library generation."),

        // Extended 2026 Sweep entries
        EcosystemEntry("sweep-qwen-agent", "Qwen-Agent Foundation", "Agent Orchestration", listOf("multi_agent", "browser", "sandbox"), "High performance agent framework optimized for open-weight Qwen inference."),
        EcosystemEntry("sweep-marvin", "Marvin AI Framework", "Agent Orchestration", listOf("human_in_loop", "sandbox"), "Batteries-included library for building natural language interfaces and structured entities."),
        EcosystemEntry("sweep-haystack", "Haystack Pipelines", "Agent Orchestration", listOf("persistent_memory", "multi_agent"), "End-to-end framework for custom agent pipelines, search, and document summarization."),
        EcosystemEntry("sweep-superagent", "Superagent Open Platform", "Agent Orchestration", listOf("background_tasks", "mcp"), "Cloud-native runtime for hosting and managing asynchronous agent workers."),
        EcosystemEntry("sweep-instructor", "Instructor Schema Engine", "Agent Orchestration", listOf("sandbox"), "Pydantic-based structured extraction and strict JSON schema enforcement library."),
        EcosystemEntry("sweep-semantic-kernel", "Semantic Kernel 2026", "Agent Orchestration", listOf("multi_agent", "mcp", "human_in_loop"), "Microsoft enterprise SDK integrating LLMs with native languages and enterprise memory stores."),
        EcosystemEntry("sweep-phidata", "Phidata Assistants", "Agent Orchestration", listOf("multi_agent", "persistent_memory", "sandbox"), "Toolkit for building multi-modal autonomous assistants with persistent memory and tools."),
        EcosystemEntry("sweep-browserless", "Browserless Grid", "Computer/Browser/Mobile", listOf("browser", "sandbox"), "Scalable cloud Chromium infrastructure tailored for autonomous web scraping agents."),
        EcosystemEntry("sweep-cursor", "Cursor Composer Agent", "Coding Agents", listOf("sandbox", "human_in_loop"), "Multi-file code editing workspace agent predicting diffs across software architecture."),
        EcosystemEntry("sweep-windsurf", "Windsurf Cascade Agent", "Coding Agents", listOf("sandbox", "human_in_loop"), "Collaborative IDE agent maintaining deep situational context and step-by-step verification."),
        EcosystemEntry("sweep-copilot-workspace", "GitHub Copilot Workspace", "Coding Agents", listOf("sandbox", "human_in_loop"), "Task-centric software development environment from issue specification to pull request."),
        EcosystemEntry("sweep-devin", "Devin Cognitive Agent", "Coding Agents", listOf("computer_use", "sandbox", "browser", "long_horizon_research"), "Full-stack autonomous software engineer equipped with shell, editor, browser, and planner."),
        EcosystemEntry("sweep-elevenlabs-conversational", "ElevenLabs Conversational AI", "Personal/Always-On", listOf("human_in_loop", "vision_language_action"), "Ultra-low latency expressive voice agent framework with dynamic interrupts and tool calls."),

        // AGI & Frontier AI
        EcosystemEntry("open-agi-2028", "OpenAGI Protocol", "AGI & Frontier AI", listOf("agi_reasoning", "recursive_self_improvement", "multi_agent"), "Open protocol standard for federated artificial general intelligence safety boundaries and superalignment.", "https://openagi.org/"),
        EcosystemEntry("q-star-superalignment", "Q* Superalignment Core", "AGI & Frontier AI", listOf("agi_reasoning", "sandbox", "human_in_loop"), "MCTS-guided reasoning search tree optimizer for zero-drift value alignment.", "https://superalignment.ai/"),
        EcosystemEntry("asi-safety-sandbox", "ASI Containment Sandbox", "AGI & Frontier AI", listOf("sandbox", "agi_reasoning"), "Air-gapped hardware containment and non-deceptive verification runtime for artificial superintelligence models."),
        EcosystemEntry("rsi-refactoring-engine", "Recursive Self-Improvement (RSI)", "AGI & Frontier AI", listOf("recursive_self_improvement", "background_tasks"), "Automated neural compiler and self-modifying code optimizer operating under constitutional invariant bounds."),
        EcosystemEntry("quantum-epistemic-mesh", "Quantum Epistemic Reasoning Mesh", "AGI & Frontier AI", listOf("agi_reasoning", "long_horizon_research"), "High-dimensional probability graph for real-time hypothesis consensus across 10,000+ autonomous sub-agents.")
    )

    fun getAllCapabilities(): List<String> {
        return GLOBAL_2026_CATALOG.flatMap { it.capabilities }.distinct().sorted()
    }

    fun getAllCategories(): List<String> {
        return GLOBAL_2026_CATALOG.map { it.category }.distinct().sorted()
    }
}
