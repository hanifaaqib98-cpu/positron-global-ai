from __future__ import annotations
from typing import Any, Literal
from pydantic import BaseModel, Field

ChannelKind = Literal["telegram","whatsapp","discord","slack","web","voice","internal"]

class ChannelSpec(BaseModel):
    channel_id: str
    kind: ChannelKind
    enabled: bool = False
    inbound_auth_required: bool = True
    outbound_requires_approval: bool = True

class SkillSpec(BaseModel):
    skill_id: str
    description: str
    tool_ids: list[str] = Field(default_factory=list)
    permission_scope: str = "none"
    risk: Literal["low","medium","high","irreversible"] = "low"
    enabled: bool = False

class AgentTask(BaseModel):
    task_id: str
    source_channel: str = "internal"
    objective: str
    background: bool = False
    schedule_ref: str | None = None
    approval_required: bool = False
    status: Literal["queued","running","paused","completed","failed"] = "queued"

class ScheduledTask(BaseModel):
    schedule_id: str
    objective: str
    cadence: str
    enabled: bool = True
    requires_approval: bool = True

class GatewayEnvelope(BaseModel):
    channel: str
    sender_ref: str
    authenticated: bool = False
    content: str
    metadata: dict[str, Any] = Field(default_factory=dict)
