from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from positron.runtime.engine import PositronEngine

app = FastAPI(title="Positron Complete Master Reference", version="1.0.0")
engine = PositronEngine()

class RunRequest(BaseModel):
    user_input: str
    session_id: str = "default"

class ApprovalRequest(BaseModel):
    task_id: str
    approved: bool

@app.get("/health")
def health():
    return {"status": "ok", "system": "positron", "version": "1.0.0"}

@app.post("/run")
def run(req: RunRequest):
    return engine.run(req.user_input, req.session_id)

@app.post("/approval")
def approval(req: ApprovalRequest):
    result = engine.resolve_approval(req.task_id, req.approved)
    if result is None:
        raise HTTPException(status_code=404, detail="approval not found")
    return result
