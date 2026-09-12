from positron.core.models import Evidence
from positron.core.epistemic import reconcile

def test_contradiction_lowers_confidence():
    r=reconcile([
        Evidence(claim="A",source="s1",status="verified",confidence=.95),
        Evidence(claim="B",source="s2",status="supported",confidence=.8)
    ])
    assert r["contradiction"] is True
    assert r["confidence"] < .5
