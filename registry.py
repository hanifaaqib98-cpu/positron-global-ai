from .models import SkillSpec

class SkillRegistry:
    def __init__(self):
        self.skills: dict[str, SkillSpec] = {}
    def register(self, skill: SkillSpec):
        self.skills[skill.skill_id] = skill
    def get_enabled(self, skill_id: str):
        skill = self.skills.get(skill_id)
        if not skill or not skill.enabled:
            return None
        return skill
