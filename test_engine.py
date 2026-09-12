from positron.runtime.engine import PositronEngine

def test_safe_run():
    r=PositronEngine().run("Explain the architecture")
    assert r["status"]=="completed"
    assert any(e["event_type"]=="verification" for e in r["events"])

def test_approval_path():
    e=PositronEngine()
    # Directly exercise policy object; production UI should create approval through authenticated flow.
    from positron.core.models import ActionRequest
    d=e.guardian.evaluate(ActionRequest(task_id="t",tool_id="deploy",purpose="deploy",risk="high"))
    assert d["decision"]=="approval_required"
