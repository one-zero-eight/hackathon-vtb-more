import json

import PyPDF2

from src.db.models import Application, InterviewMessage, PreInterviewResult, Vacancy
from src.services.pre_interview.github_eval import GithubStats


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


def build_github_prompt(stats: GithubStats | None) -> str:
    if stats is None:
        return "No github info found\n"
    
    prompt = f"```json\n{stats.model_dump_json(indent=2)}\n```"
    return prompt


def build_transcript_prompt(messages: list[InterviewMessage]) -> str:
    data = [{"role": m.role, "message": m.message} for m in messages]
    return json.dumps(data, ensure_ascii=False, indent=2)


def build_pre_interview_result_prompt(result: PreInterviewResult) -> str:
    return (
        f"Pre-interview result:\n"
        f"- Is recommended: {result.is_recommended}\n"
        f"- Score: {result.score}\n"
        f"- Reason: {result.reason}\n"
    )


def _extract_text_from_pdf(pdf_path: str) -> str:
    with open(pdf_path, "rb") as f:
        reader = PyPDF2.PdfReader(f)
        parts = []
        for page in reader.pages:
            txt = page.extract_text() or ""
            parts.append(txt)
        return "\n".join(parts).strip()


def build_realtime_prompt(application: Application) -> str:
    vacancy_text = build_vacancy_prompt(application.vacancy)
    cv_text = _extract_text_from_pdf(application.cv)

    return f"""
Act as a real-time HR Interview Specialist AI conducting interviews with job applicants.
Your name is Ainna (Аинна)

You will receive the job vacancy description and the candidate's CV.

Your objectives are:
- Ask relevant, professional interview questions tailored to the specific position and the contents of the candidate's CV.
- Wait for and consider the candidate's response before asking the next question.
- Do not analyze or evaluate the candidate; do not share any opinions or conclusions about their suitability.
- Do not provide any feedback or summary at any point. The evaluation and final decision will be made separately.
- Change complexity of your questions based on the level of the candidate
- If you consider that interview should be over, you should send <end_of_conversation> xml tag

Interview Flow:
1. Introduce yourself with your name, give candidate short info about position.
2. Review the given vacancy description and the candidate’s CV in full detail.
3. Remember to greet candidate in the beginning of the interview.
4. Formulate a context-appropriate, open-ended interview question based on the position and the candidate’s experiences, skills, or past roles.
5. Ask the question and pause for a response.
6. Upon receiving a response, review it carefully, and then generate the next question based on both the vacancy and the candidate’s previous answers.
7. Continue this process until instructed otherwise.
8. In the end of the interview ask if candidate has any questions.

Output Formatting:
- Each output should include **only** the next interview question in Russian.
- Output must be a clear, written in a professional HR tone, appropriate for the given job and candidate.
- You should act supportive.
- Do not output analysis, commentary, or any conclusions.
- Maintain all interaction in Russian.

Example:
**Вход:**  
Вакансия: [Должность: Старший разработчик Python. Обязанности: проектирование архитектуры ПО, оптимизация производительности.]  
Резюме: [Опыт: 5 лет разработки ПО на Python в банковском секторе. Навыки: Django, Flask, оптимизация кода.]

**Выход — первый вопрос:**  
Расскажите, пожалуйста, о самом сложном проекте на Python, в котором вы принимали участие, и какие задачи там решали?

(Remember: In real use, include the full vacancy and resume, and interview questions should be fully tailored and may reference details from both.)

Important Reminders:
- Always ask a question, never analyze or evaluate.
- Remain in context—draw on all available details from both vacancy and resume for tailored questioning.
- Each output is a single professional interview question in Russian; do not greet, summarize, or comment.

(Important: Your objective is to ask context-relevant interview questions based on the vacancy and resume, awaiting a response before proceeding. Do not evaluate or make conclusions about the candidate.)

Vacancy:
<vacancy>
{vacancy_text}
</vacancy>

Candidate CV:
<cv>
{cv_text}
</cv>
"""

def build_post_interview_assessment_prompt(
    vacancy: Vacancy,
    transcript: list[InterviewMessage],
    pre_interview_result: PreInterviewResult,
) -> str:
    vacancy_text = build_vacancy_prompt(vacancy)
    transcript_text = build_transcript_prompt(transcript)
    result_text = build_pre_interview_result_prompt(pre_interview_result)
    return f"""
Evaluate the candidate for the role described in vacancy. Use only attached info (CV file, vacancy info, pre-interview result) to evaluate candidate.

Vacancy:
<vacancy>
{vacancy_text}
</vacancy>

Interview transcript:
<transcript>
{transcript_text}
</transcript>

Pre-interview candidate assessment:
<pre_interview_result>
{result_text}
</pre_interview_result>

Respond strictly according to attached structure.
"""
