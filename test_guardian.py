from positron.core.models import ActionRequest
from positron.security.guardian import Guardian

def test_low_risk_allowed():
    a=ActionRequest(task_id="t",tool_id="noop",purpose="x")
    assert Guardian().evaluate(a)["decision"]=="allowed"

def test_high_risk_requires_approval():
    a=ActionRequest(task_id="t",tool_id="delete",purpose="x",risk="irreversible")
    assert Guardian().evaluate(a)["decision"]=="approval_required"
