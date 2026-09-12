# Implementation Runbook

1. Inspect the target repository and map current modules.
2. Choose existing stack where sound; avoid unnecessary rewrites.
3. Implement typed contracts first.
4. Implement event journal + durable checkpoint adapter.
5. Implement identity/authorization and Guardian as non-LLM policy code.
6. Implement tool registry and approval lifecycle.
7. Implement graph with bounded verification-failure replan loop.
8. Add provider-agnostic LLM interface.
9. Add retrieval/evidence/provenance.
10. Add memory and self-information temporal store.
11. Add RSCL + contradiction engine.
12. Add observability and security hardening.
13. Add long-term planning.
14. Add Humanity Vault and Future Generations Council.
15. Add isolated finance/trading only after governance tests pass.
16. Run: build → run → test → break → fix → verify → tag.
17. Produce a changelog listing actual verified behavior and remaining limitations.

Production storage should use Postgres/Supabase (or an equivalent durable store) for:
- tasks
- events
- checkpoints
- evidence
- memory
- self-information
- approvals
- tool definitions
- plans
- audit records

Do not treat the current in-memory reference stores as production durability.
