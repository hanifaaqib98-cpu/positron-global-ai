# POSITRON — COMPLETE MASTER PACKAGE v1.0

This package consolidates the Positron architecture, governance, runtime contracts, safety boundaries, future-planning design, and a runnable reference core.

It is a reference implementation/scaffold for an implementation AI. It is NOT a claim that a production autonomous system has already been deployed.

## Runtime
OBSERVE → CONTEXT → REASON → PLAN → RSCL → VALUE/RISK → GUARDIAN → AUTHORIZE → ACT → VERIFY → COMMIT → REFLECT → LEARN

Verification failure:
VERIFY → ANALYZE → REPLAN → GUARDIAN → ACT → VERIFY
bounded by a retry budget.

## Authority
The model cannot grant itself permissions. High-impact/irreversible actions require explicit authorization. Financial, physical-security and self-modification domains remain isolated and policy-gated.

## Build order
See docs/MASTER_SPEC.md and docs/IMPLEMENTATION_RUNBOOK.md.
