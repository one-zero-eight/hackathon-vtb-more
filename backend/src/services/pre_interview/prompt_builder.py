from src.db.models import Vacancy


def build_vacancy_prompt(vacancy: Vacancy) -> str:
    skills = getattr(vacancy, "skills", []) or []
    skill_names: list[str] = [getattr(s, "name", str(s)) for s in skills]

    return (
        f"Vacancy:\n"
        f"- Name: {vacancy.name}\n"
        f"- Description: {vacancy.description}\n"
        f"- City: {vacancy.city}\n"
        f"- Weekly hours: {vacancy.weekly_hours_occupancy}\n"
        f"- Required experience (years): {vacancy.required_experience}\n"
        f"- Salary: {vacancy.salary}\n"
        f"- Required skills: {', '.join(skill_names) if skill_names else 'N/A'}\n"
    )
