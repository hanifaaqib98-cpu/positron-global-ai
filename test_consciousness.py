from positron.consciousness import ConsciousnessCore

def test_self_model_boundary():
    c=ConsciousnessCore(); c.perceive(["goal"]); c.attend(["goal"],"goal")
    assert c.introspect()["subjective_consciousness_status"] == "not established"

def test_outcome_and_reflection():
    c=ConsciousnessCore(); assert c.compare_outcome(["done"],["done"])["match"]
    assert c.reflect("verify",.9)["confidence"] == .9
