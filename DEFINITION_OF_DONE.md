# Definition of Done

A component is complete only when:
- implementation exists
- schema/contracts are typed
- normal path tested
- failure path tested
- permissions enforced outside the LLM
- audit event exists where consequential
- verification is separate from execution
- recovery/checkpoint behavior is tested where needed
- secrets are externalized
- documentation states limitations
- tests demonstrate actual behavior

The whole Positron project is not production-complete until durable storage, authenticated authorization, real tool adapters, observability, security hardening and end-to-end verification are implemented in the target deployment environment.
