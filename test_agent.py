from positron.agent import AgentGateway, ChannelSpec, GatewayEnvelope, Scheduler, ScheduledTask

def test_gateway_auth_boundary():
    g=AgentGateway(); g.register_channel(ChannelSpec(channel_id="telegram",kind="telegram",enabled=True))
    assert g.receive(GatewayEnvelope(channel="telegram",sender_ref="x",content="hi"))["accepted"] is False
    assert g.receive(GatewayEnvelope(channel="telegram",sender_ref="x",content="hi",authenticated=True))["accepted"] is True

def test_outbound_approval_boundary():
    g=AgentGateway(); g.register_channel(ChannelSpec(channel_id="web",kind="web",enabled=True))
    assert g.queue_outbound("web","send") ["queued"] is False
    assert g.queue_outbound("web","send",approved=True)["queued"] is True

def test_scheduler_does_not_bypass_runtime():
    s=Scheduler(); s.register(ScheduledTask(schedule_id="daily",objective="report",cadence="daily"))
    assert s.due("daily").requires_approval is True
