from __future__ import annotations
from .models import ChannelSpec, GatewayEnvelope

class AgentGateway:
    """Central ingress/egress boundary for an always-available Positron agent."""
    def __init__(self):
        self.channels: dict[str, ChannelSpec] = {}
        self.outbox: list[dict] = []

    def register_channel(self, spec: ChannelSpec):
        self.channels[spec.channel_id] = spec

    def receive(self, envelope: GatewayEnvelope) -> dict:
        spec = self.channels.get(envelope.channel)
        if not spec or not spec.enabled:
            return {"accepted": False, "reason": "channel_disabled_or_unregistered"}
        if spec.inbound_auth_required and not envelope.authenticated:
            return {"accepted": False, "reason": "authentication_required"}
        return {"accepted": True, "channel": envelope.channel, "sender_ref": envelope.sender_ref,
                "content": envelope.content}

    def queue_outbound(self, channel: str, content: str, approved: bool = False):
        spec = self.channels.get(channel)
        if not spec or not spec.enabled:
            return {"queued": False, "reason": "channel_disabled_or_unregistered"}
        if spec.outbound_requires_approval and not approved:
            return {"queued": False, "reason": "approval_required"}
        item = {"channel": channel, "content": content}
        self.outbox.append(item)
        return {"queued": True, "item": item}
