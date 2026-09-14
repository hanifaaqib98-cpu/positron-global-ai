import { PositronEngine, Guardian, AgentGateway, Scheduler, reconcile, ConsciousnessCore } from '../src/server/engine.js';
import { global2026Catalog } from '../src/server/catalog.js';
import { ActionRequest, ChannelSpec, GatewayEnvelope, ScheduledTask, Evidence } from '../src/types/positron.js';

function assert(condition: boolean, msg: string) {
  if (!condition) {
    throw new Error(`Assertion failed: ${msg}`);
  }
}

export function runAllPositronTests() {
  console.log('Running Positron verification suite...');

  // 1. test_safe_run
  const engine = new PositronEngine();
  const r = engine.run('Explain the architecture');
  assert(r.status === 'completed', `Expected completed, got ${r.status}`);
  assert(r.events.some((e: any) => e.event_type === 'verification'), 'Expected verification event');
  console.log('✔ test_safe_run passed');

  // 2. test_approval_path
  const d = engine.guardian.evaluate({
    task_id: 't',
    tool_id: 'deploy',
    purpose: 'deploy',
    risk: 'high'
  });
  assert(d.decision === 'approval_required', `Expected approval_required, got ${d.decision}`);
  console.log('✔ test_approval_path passed');

  // 3. test_gateway_auth_boundary
  const g = new AgentGateway();
  g.registerChannel({ channel_id: 'telegram', kind: 'telegram', enabled: true, inbound_auth_required: true, outbound_requires_approval: true });
  assert(g.receive({ channel: 'telegram', sender_ref: 'x', content: 'hi', authenticated: false }).accepted === false, 'Expected unauth rejected');
  assert(g.receive({ channel: 'telegram', sender_ref: 'x', content: 'hi', authenticated: true }).accepted === true, 'Expected auth accepted');
  console.log('✔ test_gateway_auth_boundary passed');

  // 4. test_outbound_approval_boundary
  const g2 = new AgentGateway();
  g2.registerChannel({ channel_id: 'web', kind: 'web', enabled: true, inbound_auth_required: false, outbound_requires_approval: true });
  assert(g2.queueOutbound('web', 'send', false).queued === false, 'Expected unapproved queued === false');
  assert(g2.queueOutbound('web', 'send', true).queued === true, 'Expected approved queued === true');
  console.log('✔ test_outbound_approval_boundary passed');

  // 5. test_scheduler_does_not_bypass_runtime
  const s = new Scheduler();
  s.register({ schedule_id: 'daily', objective: 'report', cadence: 'daily', enabled: true, requires_approval: true });
  const dueTask = s.due('daily');
  assert(dueTask !== null && dueTask.requires_approval === true, 'Expected scheduler task requires_approval to be true');
  console.log('✔ test_scheduler_does_not_bypass_runtime passed');

  // 6. test_low_risk_allowed
  const gGuard = new Guardian();
  const aLow: ActionRequest = { task_id: 't', tool_id: 'noop', purpose: 'x', risk: 'low' };
  assert(gGuard.evaluate(aLow).decision === 'allowed', 'Expected low risk to be allowed');
  console.log('✔ test_low_risk_allowed passed');

  // 7. test_high_risk_requires_approval
  const aHigh: ActionRequest = { task_id: 't', tool_id: 'delete', purpose: 'x', risk: 'irreversible' };
  assert(gGuard.evaluate(aHigh).decision === 'approval_required', 'Expected high risk to require approval');
  console.log('✔ test_high_risk_requires_approval passed');

  // 8. test_contradiction_lowers_confidence
  const rReconcile = reconcile([
    { claim: 'A', source: 's1', status: 'verified', confidence: 0.95 },
    { claim: 'B', source: 's2', status: 'supported', confidence: 0.8 }
  ]);
  assert(rReconcile.contradiction === true, 'Expected contradiction === true');
  assert(rReconcile.confidence < 0.5, `Expected confidence < 0.5, got ${rReconcile.confidence}`);
  console.log('✔ test_contradiction_lowers_confidence passed');

  // 9. test_self_model_boundary
  const c = new ConsciousnessCore();
  c.perceive(['goal']);
  c.attend(['goal'], 'goal');
  assert(c.introspect().subjective_consciousness_status === 'not established', 'Expected subjective consciousness not established');
  console.log('✔ test_self_model_boundary passed');

  // 10. test_outcome_and_reflection
  assert(c.compareOutcome(['done'], ['done']).match === true, 'Expected match === true');
  assert(c.reflect('verify', 0.9).confidence === 0.9, 'Expected confidence === 0.9');
  console.log('✔ test_outcome_and_reflection passed');

  // 11. test_global_catalog_loaded
  const cat = global2026Catalog();
  assert(cat.entries.length >= 70, `Expected >= 70 entries, got ${cat.entries.length}`);
  assert(cat.entries.some((e) => e.id === 'mcp'), 'Expected mcp in entries');
  assert(cat.entries.some((e) => e.id === 'a2a'), 'Expected a2a in entries');
  assert(cat.entries.some((e) => e.id === 'muse'), 'Expected muse in entries');
  assert(cat.entries.some((e) => e.id === 'openclaw'), 'Expected openclaw in entries');
  console.log('✔ test_global_catalog_loaded passed');

  // 12. test_distinct_capability_coverage
  const caps = cat.capabilities();
  const required = [
    'persistent_memory',
    'multi_agent',
    'browser',
    'computer_use',
    'sandbox',
    'mcp',
    'a2a',
    'human_in_loop',
    'background_tasks',
    'long_horizon_research',
    'vision_language_action',
    'creative_workflows'
  ];
  for (const req of required) {
    assert(caps.has(req), `Missing capability: ${req}`);
  }
  console.log('✔ test_distinct_capability_coverage passed');

  console.log('All 12 Positron specification tests PASSED successfully!');
  return true;
}

if (process.argv[1] && process.argv[1].endsWith('positron.test.ts')) {
  runAllPositronTests();
}
