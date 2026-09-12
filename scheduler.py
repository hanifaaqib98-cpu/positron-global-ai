from .models import ScheduledTask

class Scheduler:
    """Scheduling contract only; execution still passes through the normal Guardian/runtime path."""
    def __init__(self):
        self.tasks: dict[str, ScheduledTask] = {}
    def register(self, task: ScheduledTask):
        self.tasks[task.schedule_id] = task
    def due(self, schedule_id: str):
        task = self.tasks.get(schedule_id)
        return task if task and task.enabled else None
