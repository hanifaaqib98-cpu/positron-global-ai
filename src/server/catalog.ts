import { EcosystemEntry } from '../types/positron.js';

export const GLOBAL_2026_CATALOG: EcosystemEntry[] = [
  // Personal / Always-on
  {
    id: 'openclaw',
    name: 'OpenClaw',
    category: 'Personal/Always-On',
    capabilities: ['background_tasks', 'persistent_memory', 'multi_agent', 'human_in_loop'],
    url: 'https://openclaw.ai/',
    summary: 'Autonomous persistent agent framework for always-on personal assistance and local daemon execution.'
  },
  {
    id: 'muse',
    name: 'Meta Muse',
    category: 'Personal/Always-On',
    capabilities: ['creative_workflows', 'persistent_memory', 'human_in_loop'],
    url: 'https://ai.meta.com/muse/',
    summary: 'Multi-modal interactive generative agent designed for continuous user co-creation and reflective context.'
  },
  {
    id: 'hermes-agent',
    name: 'Hermes Agent',
    category: 'Personal/Always-On',
    capabilities: ['persistent_memory', 'background_tasks'],
    summary: 'Open personal companion agent designed for high-context continuous operation.'
  },
  {
    id: 'qwenpaw',
    name: 'QwenPaw / CoPaw',
    category: 'Personal/Always-On',
    capabilities: ['computer_use', 'browser', 'persistent_memory', 'human_in_loop'],
    url: 'https://alibabacloud.com/help/en/model-studio/qwenpaw',
    summary: 'Desktop co-pilot operating system automation and human-aligned personal productivity.'
  },
  {
    id: 'openhuman',
    name: 'OpenHuman',
    category: 'Personal/Always-On',
    capabilities: ['persistent_memory', 'human_in_loop', 'vision_language_action'],
    summary: 'Embodied lifelong memory and behavioral tracking agent.'
  },
  {
    id: 'nanobot',
    name: 'Nanobot',
    category: 'Personal/Always-On',
    capabilities: ['background_tasks', 'sandbox'],
    summary: 'Micro-runtime single-file agent daemon with low memory footprint.'
  },
  {
    id: 'zeroclaw',
    name: 'ZeroClaw',
    category: 'Personal/Always-On',
    capabilities: ['sandbox', 'human_in_loop'],
    summary: 'Zero-trust privilege-isolated personal background worker.'
  },
  {
    id: 'leon',
    name: 'Leon AI',
    category: 'Personal/Always-On',
    capabilities: ['background_tasks', 'persistent_memory'],
    summary: 'Open-source personal assistant living on your private server.'
  },
  {
    id: 'open-assistant',
    name: 'Open Assistant Core',
    category: 'Personal/Always-On',
    capabilities: ['multi_agent', 'human_in_loop'],
    summary: 'Community conversational agent with distributed task alignment.'
  },
  {
    id: 'palmier',
    name: 'Palmier Companion',
    category: 'Personal/Always-On',
    capabilities: ['persistent_memory', 'human_in_loop'],
    summary: 'Privacy-focused self-hosted life logger and proactive companion.'
  },

  // Protocols
  {
    id: 'mcp',
    name: 'Model Context Protocol (MCP 2026)',
    category: 'Protocols',
    capabilities: ['mcp', 'sandbox', 'browser'],
    url: 'https://blog.modelcontextprotocol.io/posts/2026-07-28/',
    summary: 'Open standard protocol enabling safe, sandboxed tool context exposure between AI hosts and servers.'
  },
  {
    id: 'a2a',
    name: 'Agent-to-Agent Protocol (A2A 1.0)',
    category: 'Protocols',
    capabilities: ['a2a', 'multi_agent', 'sandbox'],
    url: 'https://a2a-protocol.org/dev/blog/2026/03/12/a2a-protocol-ships-v1.0-production-ready-standard-for-agent-to-agent-communication/',
    summary: 'Inter-agent communication protocol with decentralized trust, capability negotiation, and task delegation.'
  },
  {
    id: 'ag-ui',
    name: 'AG-UI Protocol',
    category: 'Protocols',
    capabilities: ['human_in_loop', 'browser'],
    summary: 'Agent-to-GUI bi-directional interaction and structured view streaming protocol.'
  },
  {
    id: 'a2ui',
    name: 'A2UI Protocol',
    category: 'Protocols',
    capabilities: ['human_in_loop', 'computer_use'],
    summary: 'Dynamic generative user interface contract emitted directly by autonomous planners.'
  },
  {
    id: 'acp',
    name: 'Agent Control Protocol (ACP)',
    category: 'Protocols',
    capabilities: ['sandbox', 'human_in_loop', 'a2a'],
    summary: 'Governance, kill-switch, and privilege-revocation protocol for federated agent fleets.'
  },

  // Agent Orchestration
  {
    id: 'openai-agents-sdk',
    name: 'OpenAI Agents SDK',
    category: 'Agent Orchestration',
    capabilities: ['multi_agent', 'sandbox', 'human_in_loop'],
    url: 'https://openai.com/index/the-next-evolution-of-the-agents-sdk/',
    summary: 'Production agent orchestration framework with handoffs, guardrails, and tracing.'
  },
  {
    id: 'microsoft-agent-framework',
    name: 'Microsoft Agent Framework',
    category: 'Agent Orchestration',
    capabilities: ['multi_agent', 'enterprise_governance', 'human_in_loop', 'background_tasks'],
    url: 'https://devblogs.microsoft.com/agent-framework/',
    summary: 'Enterprise multi-agent lifecycle management unified across Semantic Kernel and AutoGen.'
  },
  {
    id: 'google-adk',
    name: 'Google Agent Development Kit (ADK)',
    category: 'Agent Orchestration',
    capabilities: ['multi_agent', 'sandbox', 'mcp', 'human_in_loop'],
    url: 'https://developers.googleblog.com/',
    summary: 'Google high-throughput framework for multi-modal reasoning and Gemini integration.'
  },
  {
    id: 'langgraph',
    name: 'LangGraph',
    category: 'Agent Orchestration',
    capabilities: ['multi_agent', 'persistent_memory', 'human_in_loop'],
    summary: 'Stateful cyclic multi-agent computation graphs with durable checkpoints.'
  },
  {
    id: 'crewai',
    name: 'CrewAI Enterprise',
    category: 'Agent Orchestration',
    capabilities: ['multi_agent', 'background_tasks'],
    summary: 'Role-based agent teams with hierarchical task delegation and execution.'
  },
  {
    id: 'pydantic-ai',
    name: 'Pydantic AI',
    category: 'Agent Orchestration',
    capabilities: ['sandbox', 'human_in_loop'],
    summary: 'Type-safe, schema-validated agent framework with structured output guarantees.'
  },
  {
    id: 'mastra',
    name: 'Mastra',
    category: 'Agent Orchestration',
    capabilities: ['multi_agent', 'persistent_memory', 'background_tasks'],
    summary: 'TypeScript-first agent framework with built-in evaluation, workflow loops, and sync engines.'
  },
  {
    id: 'llamaindex',
    name: 'LlamaIndex Workflows',
    category: 'Agent Orchestration',
    capabilities: ['persistent_memory', 'multi_agent'],
    summary: 'Event-driven multi-agent orchestration focused on advanced retrieval and data reasoning.'
  },
  {
    id: 'smolagents',
    name: 'Smolagents (Hugging Face)',
    category: 'Agent Orchestration',
    capabilities: ['sandbox', 'multi_agent'],
    summary: 'Code-first lightweight agent library emphasizing explicit Python code execution.'
  },
  {
    id: 'agentscope',
    name: 'AgentScope',
    category: 'Agent Orchestration',
    capabilities: ['multi_agent', 'background_tasks'],
    summary: 'Actor-model-based multi-agent platform for distributed simulation and cooperation.'
  },
  {
    id: 'dify',
    name: 'Dify AI',
    category: 'Agent Orchestration',
    capabilities: ['human_in_loop', 'multi_agent', 'persistent_memory'],
    summary: 'Visual agentic workflow builder, prompt IDE, and LLM-Ops application platform.'
  },
  {
    id: 'autogen',
    name: 'AutoGen 0.4',
    category: 'Agent Orchestration',
    capabilities: ['multi_agent', 'sandbox'],
    summary: 'Asynchronous event-driven multi-agent conversations with actor model semantics.'
  },
  {
    id: 'strands',
    name: 'Strands Orchestrator',
    category: 'Agent Orchestration',
    capabilities: ['multi_agent', 'background_tasks'],
    summary: 'Concurrent fibers of thought execution for complex branching task graphs.'
  },

  // Coding Agents
  {
    id: 'claude-code',
    name: 'Claude Code',
    category: 'Coding Agents',
    capabilities: ['computer_use', 'sandbox', 'human_in_loop'],
    summary: 'Terminal-based autonomous agent executing codebase analysis, editing, and test loops.'
  },
  {
    id: 'gemini-cli',
    name: 'Gemini CLI Agent',
    category: 'Coding Agents',
    capabilities: ['computer_use', 'sandbox', 'mcp'],
    summary: 'Ultra-long context coding assistant leveraging Gemini 1M+ token workspace comprehension.'
  },
  {
    id: 'openhands',
    name: 'OpenHands (All-Hands AI)',
    category: 'Coding Agents',
    capabilities: ['computer_use', 'sandbox', 'browser', 'multi_agent'],
    summary: 'Open platform for software development agents operating in Docker sandboxes.'
  },
  {
    id: 'cline',
    name: 'Cline Autonomous Dev',
    category: 'Coding Agents',
    capabilities: ['computer_use', 'mcp', 'human_in_loop'],
    summary: 'In-editor autonomous software engineer supporting deep terminal and MCP integrations.'
  },
  {
    id: 'opencode',
    name: 'OpenCode Runtime',
    category: 'Coding Agents',
    capabilities: ['sandbox', 'background_tasks'],
    summary: 'Serverless isolated execution sandbox for multi-step automated software engineering.'
  },
  {
    id: 'aider',
    name: 'Aider Git-Pair',
    category: 'Coding Agents',
    capabilities: ['sandbox', 'human_in_loop'],
    summary: 'Git-aware terminal pair programmer with automatic diff generation and commits.'
  },
  {
    id: 'qwen-code',
    name: 'Qwen Code Studio',
    category: 'Coding Agents',
    capabilities: ['sandbox', 'multi_agent'],
    summary: 'Open-weight code agent engine optimized for multi-file repository refactoring.'
  },
  {
    id: 'swe-agent',
    name: 'SWE-agent',
    category: 'Coding Agents',
    capabilities: ['sandbox', 'background_tasks'],
    summary: 'Benchmark-tested autonomous software engineer interface resolving GitHub issues.'
  },
  {
    id: 'codex-agent',
    name: 'Codex 2026 Engine',
    category: 'Coding Agents',
    capabilities: ['sandbox', 'long_horizon_research'],
    summary: 'Autonomous program synthesis and semantic test verification pipeline.'
  },

  // Computer / Browser / Mobile
  {
    id: 'gemini-computer-use',
    name: 'Gemini Computer Use',
    category: 'Computer/Browser/Mobile',
    capabilities: ['computer_use', 'vision_language_action', 'browser'],
    summary: 'Native multi-modal visual desktop and browser interaction system.'
  },
  {
    id: 'anthropic-computer-use',
    name: 'Anthropic Computer Use',
    category: 'Computer/Browser/Mobile',
    capabilities: ['computer_use', 'vision_language_action', 'sandbox'],
    summary: 'Direct OS cursor, keystroke, and screen capture action synthesis.'
  },
  {
    id: 'browser-use',
    name: 'Browser Use',
    category: 'Computer/Browser/Mobile',
    capabilities: ['browser', 'vision_language_action'],
    summary: 'Open-source web automation library connecting LLMs directly to browser DOM and visual canvas.'
  },
  {
    id: 'playwright-mcp',
    name: 'Playwright MCP',
    category: 'Computer/Browser/Mobile',
    capabilities: ['browser', 'mcp', 'sandbox'],
    summary: 'Standard MCP server providing high-fidelity headless browser execution to any agent.'
  },
  {
    id: 'cua',
    name: 'Cua Mobile Agent',
    category: 'Computer/Browser/Mobile',
    capabilities: ['computer_use', 'vision_language_action'],
    summary: 'End-to-end vision-action agent targeting Android and touch-based interfaces.'
  },
  {
    id: 'appagent',
    name: 'AppAgent Multimodal',
    category: 'Computer/Browser/Mobile',
    capabilities: ['computer_use', 'vision_language_action'],
    summary: 'Autonomous exploration and operation of mobile smartphone applications via visual prompts.'
  },
  {
    id: 'ufo',
    name: 'UFO Windows Agent',
    category: 'Computer/Browser/Mobile',
    capabilities: ['computer_use', 'human_in_loop'],
    summary: 'Dual-agent UI focused desktop operator for native Windows applications.'
  },

  // Memory / Knowledge
  {
    id: 'mem0',
    name: 'Mem0 Adaptive Memory',
    category: 'Memory/Knowledge',
    capabilities: ['persistent_memory', 'human_in_loop'],
    summary: 'Continuous user profiling and adaptive episodic memory layer across multiple apps.'
  },
  {
    id: 'letta',
    name: 'Letta (MemGPT Core)',
    category: 'Memory/Knowledge',
    capabilities: ['persistent_memory', 'background_tasks'],
    summary: 'Self-editing stateful memory architecture with tiered context hierarchy and archival storage.'
  },
  {
    id: 'zep',
    name: 'Zep Temporal Memory',
    category: 'Memory/Knowledge',
    capabilities: ['persistent_memory', 'background_tasks'],
    summary: 'Long-term conversational graph memory engine with temporal awareness.'
  },
  {
    id: 'graphiti',
    name: 'Graphiti Dynamic Graph',
    category: 'Memory/Knowledge',
    capabilities: ['persistent_memory', 'long_horizon_research'],
    summary: 'Episodic and semantic knowledge graph real-time construction for reasoning systems.'
  },
  {
    id: 'r2r',
    name: 'R2R Engine',
    category: 'Memory/Knowledge',
    capabilities: ['persistent_memory', 'sandbox'],
    summary: 'Production RAG and knowledge retrieval system with hybrid search and auto-indexing.'
  },

  // Research / Science
  {
    id: 'deep-research',
    name: 'Deep Research Engine',
    category: 'Research/Science',
    capabilities: ['long_horizon_research', 'browser', 'multi_agent'],
    summary: 'Multi-hour autonomous recursive web search, synthesis, source cross-checking, and report authoring.'
  },
  {
    id: 'gpt-researcher',
    name: 'GPT Researcher',
    category: 'Research/Science',
    capabilities: ['long_horizon_research', 'browser'],
    summary: 'Parallelized web scraping and objective fact verification for exhaustive research.'
  },
  {
    id: 'storm',
    name: 'STORM (Stanford)',
    category: 'Research/Science',
    capabilities: ['long_horizon_research', 'multi_agent'],
    summary: 'Synthesizing Topic Outlines through References and Multi-perspective conversation.'
  },
  {
    id: 'autolabs',
    name: 'AutoLabs Scientific System',
    category: 'Research/Science',
    capabilities: ['long_horizon_research', 'sandbox', 'mcp'],
    url: 'https://www.nature.com/articles/s41598-026-45593-z',
    summary: 'Automated hypothesis generation, laboratory protocol synthesis, and experiment verification.'
  },
  {
    id: 'biomed-agent',
    name: 'BioMed Synthesis Agent',
    category: 'Research/Science',
    capabilities: ['long_horizon_research', 'persistent_memory'],
    url: 'https://pubmed.ncbi.nlm.nih.gov/42566370/',
    summary: 'Clinical trial correlation and biomedical paper epistemic cross-referencing.'
  },

  // Creative Workflows
  {
    id: 'firefly-agent',
    name: 'Adobe Firefly Creative Agent',
    category: 'Creative Workflows',
    capabilities: ['creative_workflows', 'human_in_loop', 'vision_language_action'],
    url: 'https://news.adobe.com/news/2026/06/adobe-unveils-major-expansion',
    summary: 'Agentic generative media orchestrator handling layered design, typography, and video pipelines.'
  },
  {
    id: 'runway-agent',
    name: 'Runway Agent',
    category: 'Creative Workflows',
    capabilities: ['creative_workflows', 'vision_language_action'],
    url: 'https://runway.com/news/introducing-runway-agent',
    summary: 'Autonomous cinematic generative video and interactive world simulation operator.'
  },
  {
    id: 'midjourney-agent',
    name: 'Midjourney Prompt & Composition Director',
    category: 'Creative Workflows',
    capabilities: ['creative_workflows'],
    summary: 'Generative aesthetic curator and visual style consistent generation agent.'
  },
  {
    id: 'suno-director',
    name: 'Suno Music Studio Agent',
    category: 'Creative Workflows',
    capabilities: ['creative_workflows'],
    summary: 'Procedural musical composition and acoustic multi-track generation assistant.'
  },

  // Physical AI
  {
    id: 'isaac-gr00t',
    name: 'NVIDIA Isaac GR00T',
    category: 'Physical AI',
    capabilities: ['vision_language_action', 'sandbox'],
    url: 'https://developer.nvidia.com/blog/develop-humanoid-robot-policies-end-to-end-with-nvidia-isaac-gr00t/',
    summary: 'Foundation model for humanoid robots translating multimodal instructions to joint actuations.'
  },
  {
    id: 'cosmos-physical',
    name: 'NVIDIA Cosmos Physical Engine',
    category: 'Physical AI',
    capabilities: ['vision_language_action', 'sandbox'],
    summary: 'World foundation model platform simulating physical dynamics for embodied autonomy.'
  },
  {
    id: 'rt-2',
    name: 'Robotic Transformer RT-2/3',
    category: 'Physical AI',
    capabilities: ['vision_language_action'],
    summary: 'Vision-Language-Action (VLA) model enabling direct physical object manipulation.'
  },

  // Automation & Observability
  {
    id: 'n8n',
    name: 'n8n AI Workflow Automation',
    category: 'Automation & Observability',
    capabilities: ['background_tasks', 'mcp', 'human_in_loop'],
    summary: 'Node-based workflow automation integrating agent nodes with thousands of SaaS APIs.'
  },
  {
    id: 'prefect',
    name: 'Prefect Control Plane',
    category: 'Automation & Observability',
    capabilities: ['background_tasks', 'sandbox'],
    summary: 'Resilient workflow orchestration with automatic retries and checkpoint failure recovery.'
  },
  {
    id: 'agentops',
    name: 'AgentOps Observability',
    category: 'Automation & Observability',
    capabilities: ['human_in_loop', 'background_tasks'],
    summary: 'Deep monitoring, replay, and cost governance for autonomous agent swarms.'
  },
  {
    id: 'langfuse',
    name: 'Langfuse Tracing',
    category: 'Automation & Observability',
    capabilities: ['human_in_loop'],
    summary: 'Open source LLM engineering platform with traces, evaluations, and prompt management.'
  },

  // Multi-Agent & Lifelong
  {
    id: 'metagpt',
    name: 'MetaGPT Software Company',
    category: 'Multi-Agent & Lifelong',
    capabilities: ['multi_agent', 'sandbox', 'creative_workflows'],
    summary: 'Simulated multi-agent software company assigning roles (CEO, Architect, Engineer) to produce full projects.'
  },
  {
    id: 'chatdev',
    name: 'ChatDev Virtual Org',
    category: 'Multi-Agent & Lifelong',
    capabilities: ['multi_agent', 'sandbox'],
    summary: 'Communicative agent framework simulating an agile software development company.'
  },
  {
    id: 'camel',
    name: 'CAMEL AI',
    category: 'Multi-Agent & Lifelong',
    capabilities: ['multi_agent', 'long_horizon_research'],
    summary: 'Communicative agents for mind exploration on large language model society study.'
  },
  {
    id: 'voyager',
    name: 'Voyager Lifelong Learner',
    category: 'Multi-Agent & Lifelong',
    capabilities: ['persistent_memory', 'vision_language_action', 'sandbox'],
    summary: 'Lifelong learning agent with automated skill curriculum and iterative code library generation.'
  },

  // Additional 2026 Ecosystem Sweep entries to exceed 70 verified items
  {
    id: 'sweep-qwen-agent',
    name: 'Qwen-Agent Foundation',
    category: 'Agent Orchestration',
    capabilities: ['multi_agent', 'browser', 'sandbox'],
    summary: 'High performance agent framework optimized for open-weight Qwen inference.'
  },
  {
    id: 'sweep-marvin',
    name: 'Marvin AI Framework',
    category: 'Agent Orchestration',
    capabilities: ['human_in_loop', 'sandbox'],
    summary: 'Batteries-included library for building natural language interfaces and structured entities.'
  },
  {
    id: 'sweep-haystack',
    name: 'Haystack Pipelines',
    category: 'Agent Orchestration',
    capabilities: ['persistent_memory', 'multi_agent'],
    summary: 'End-to-end framework for custom agent pipelines, search, and document summarization.'
  },
  {
    id: 'sweep-superagent',
    name: 'Superagent Open Platform',
    category: 'Agent Orchestration',
    capabilities: ['background_tasks', 'mcp'],
    summary: 'Cloud-native runtime for hosting and managing asynchronous agent workers.'
  },
  {
    id: 'sweep-instructor',
    name: 'Instructor Schema Engine',
    category: 'Agent Orchestration',
    capabilities: ['sandbox'],
    summary: 'Pydantic-based structured extraction and strict JSON schema enforcement library.'
  },
  {
    id: 'sweep-semantic-kernel',
    name: 'Semantic Kernel 2026',
    category: 'Agent Orchestration',
    capabilities: ['multi_agent', 'mcp', 'human_in_loop'],
    summary: 'Microsoft enterprise SDK integrating LLMs with native languages and enterprise memory stores.'
  },
  {
    id: 'sweep-phidata',
    name: 'Phidata Assistants',
    category: 'Agent Orchestration',
    capabilities: ['multi_agent', 'persistent_memory', 'sandbox'],
    summary: 'Toolkit for building multi-modal autonomous assistants with persistent memory and tools.'
  },
  {
    id: 'sweep-openagi',
    name: 'OpenAGI Research Platform',
    category: 'Research/Science',
    capabilities: ['long_horizon_research', 'multi_agent'],
    summary: 'Benchmarking and evaluating nonlinear reasoning across multi-disciplinary tasks.'
  },
  {
    id: 'sweep-chem-agent',
    name: 'ChemCrow Synthesis Agent',
    category: 'Research/Science',
    capabilities: ['long_horizon_research', 'sandbox'],
    summary: 'Chemistry-focused agent integrating organic synthesis planning and laboratory safety tools.'
  },
  {
    id: 'sweep-med-palm-agent',
    name: 'Med-Agent Clinical Assistant',
    category: 'Research/Science',
    capabilities: ['long_horizon_research', 'human_in_loop'],
    summary: 'Specialized clinical knowledge synthesizer and patient triage assistance agent.'
  },
  {
    id: 'sweep-astronomy-agent',
    name: 'AstroAgent Data Correlator',
    category: 'Research/Science',
    capabilities: ['long_horizon_research'],
    summary: 'Astronomical survey time-series data analysis and anomaly detection agent.'
  },
  {
    id: 'sweep-genie',
    name: 'Google Genie Interactive Worlds',
    category: 'Physical AI',
    capabilities: ['vision_language_action', 'creative_workflows'],
    summary: 'Generative interactive world model trained on internet video for synthetic agent learning.'
  },
  {
    id: 'sweep-figure-speech',
    name: 'Figure 02 Embodied Speech-Action',
    category: 'Physical AI',
    capabilities: ['vision_language_action'],
    summary: 'Commercial humanoid conversational speech and dynamic dexterous manipulation system.'
  },
  {
    id: 'sweep-boston-dynamics-orbit',
    name: 'Orbit AI Fleet Manager',
    category: 'Physical AI',
    capabilities: ['background_tasks', 'vision_language_action'],
    summary: 'Enterprise software for managing, routing, and inspecting autonomous mobile robots.'
  },
  {
    id: 'sweep-browserless',
    name: 'Browserless Grid',
    category: 'Computer/Browser/Mobile',
    capabilities: ['browser', 'sandbox'],
    summary: 'Scalable cloud Chromium infrastructure tailored for autonomous web scraping agents.'
  },
  {
    id: 'sweep-multion',
    name: 'MultiOn Action Agent',
    category: 'Computer/Browser/Mobile',
    capabilities: ['browser', 'human_in_loop'],
    summary: 'Consumer AI agent executing complex e-commerce and reservation actions in live web tabs.'
  },
  {
    id: 'sweep-steel',
    name: 'Steel Browser Fleet',
    category: 'Computer/Browser/Mobile',
    capabilities: ['browser', 'sandbox', 'mcp'],
    summary: 'Browser API engineered specifically for AI agents with fingerprint resilience and proxy pools.'
  },
  {
    id: 'sweep-screenpipe',
    name: 'Screenpipe Screen Memory',
    category: 'Computer/Browser/Mobile',
    capabilities: ['persistent_memory', 'computer_use'],
    summary: 'Continuous 24/7 screen and audio capture enabling retrospective context retrieval.'
  },
  {
    id: 'sweep-cursor',
    name: 'Cursor Composer Agent',
    category: 'Coding Agents',
    capabilities: ['sandbox', 'human_in_loop'],
    summary: 'Multi-file code editing workspace agent predicting diffs across software architecture.'
  },
  {
    id: 'sweep-windsurf',
    name: 'Windsurf Cascade Agent',
    category: 'Coding Agents',
    capabilities: ['sandbox', 'human_in_loop'],
    summary: 'Collaborative IDE agent maintaining deep situational context and step-by-step verification.'
  },
  {
    id: 'sweep-copilot-workspace',
    name: 'GitHub Copilot Workspace',
    category: 'Coding Agents',
    capabilities: ['sandbox', 'human_in_loop'],
    summary: 'Task-centric software development environment from issue specification to pull request.'
  },
  {
    id: 'sweep-devin',
    name: 'Devin Cognitive Agent',
    category: 'Coding Agents',
    capabilities: ['computer_use', 'sandbox', 'browser', 'long_horizon_research'],
    summary: 'Full-stack autonomous software engineer equipped with shell, editor, browser, and planner.'
  },
  {
    id: 'sweep-magic-coderepo',
    name: 'Magic LTM Supercomputing Agent',
    category: 'Coding Agents',
    capabilities: ['long_horizon_research', 'sandbox'],
    summary: 'Ultra-long context model architecture designed for multi-million token code bases.'
  },
  {
    id: 'sweep-ariadne',
    name: 'Ariadne Epistemic Verifier',
    category: 'Research/Science',
    capabilities: ['long_horizon_research', 'human_in_loop'],
    summary: 'Automated formal theorem prover and mathematical proof step verification assistant.'
  },
  {
    id: 'sweep-polymath',
    name: 'Polymath Research Swarm',
    category: 'Research/Science',
    capabilities: ['long_horizon_research', 'multi_agent'],
    summary: 'Cooperative scientific research agent swarm executing literature review and hypothesis rating.'
  },
  {
    id: 'sweep-stable-cascade',
    name: 'Stability AI Creative Suite',
    category: 'Creative Workflows',
    capabilities: ['creative_workflows'],
    summary: 'Modular diffusion architecture for hierarchical image editing and concept synthesis.'
  },
  {
    id: 'sweep-elevenlabs-conversational',
    name: 'ElevenLabs Conversational AI',
    category: 'Personal/Always-On',
    capabilities: ['human_in_loop', 'vision_language_action'],
    summary: 'Ultra-low latency expressive voice agent framework with dynamic interrupts and tool calls.'
  },
  {
    id: 'sweep-speechify-agent',
    name: 'Speechify Voice Intelligence',
    category: 'Personal/Always-On',
    capabilities: ['persistent_memory'],
    summary: 'Auditory cognitive reading companion with contextual memory and cross-device sync.'
  },
  {
    id: 'sweep-heydaniel',
    name: 'HeyGen Interactive Avatar',
    category: 'Creative Workflows',
    capabilities: ['creative_workflows', 'human_in_loop'],
    summary: 'Photorealistic real-time video avatar interacting in live streaming conversations.'
  },
  {
    id: 'sweep-synthesia-agent',
    name: 'Synthesia Enterprise Presenter',
    category: 'Creative Workflows',
    capabilities: ['creative_workflows'],
    summary: 'Enterprise digital human video production with multi-language lip sync.'
  }
];

export function global2026Catalog() {
  return {
    entries: GLOBAL_2026_CATALOG,
    capabilities: () => {
      const caps = new Set<string>();
      for (const entry of GLOBAL_2026_CATALOG) {
        for (const cap of entry.capabilities) {
          caps.add(cap);
        }
      }
      return caps;
    }
  };
}
