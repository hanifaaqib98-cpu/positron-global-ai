from positron.ai_ecosystem import global_2026_catalog

def test_global_catalog_loaded():
    r = global_2026_catalog()
    assert len(r.entries) >= 70
    assert "mcp" in r.entries
    assert "a2a" in r.entries
    assert "muse" in r.entries
    assert "openclaw" in r.entries

def test_distinct_capability_coverage():
    caps = global_2026_catalog().capabilities()
    required = {
        "persistent_memory", "multi_agent", "browser", "computer_use",
        "sandbox", "mcp", "a2a", "human_in_loop", "background_tasks",
        "long_horizon_research", "vision_language_action", "creative_workflows",
    }
    assert required <= caps
