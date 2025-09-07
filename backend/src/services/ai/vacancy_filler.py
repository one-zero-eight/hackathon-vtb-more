import base64
from pathlib import Path

from openai.types.responses import EasyInputMessageParam, ResponseInputFileParam, ResponseInputTextParam

from src.config import open_ai_text_settings
from src.schemas import VacancyFromFile
from src.services.ai.openai_client import async_client


async def fill_vacancy_from_file(filepath: Path) -> VacancyFromFile:
    system_msg = EasyInputMessageParam(
        role="system",
        content=(
            "Act as an HR analyst that extracts a job vacancy into a typed schema. "
            "Only use the attached file as evidence. "
            "Return a structured object that exactly matches the provided schema."
        ),
    )

    instructions = (
        "Task: Extract vacancy fields: name, description, salary, city, weekly_hours_occupancy, required_experience (in years). "
        "Rules:\n"
        "- Use only the attached file; if a field is absent or ambiguous, set it to null.\n"
        "- salary: numeric amount only (no currency symbol), prefer the primary figure; for ranges, prefer the lower bound; for hourly rates, multiply by weekly_hours_occupancy if present, else return null.\n"
        "- weekly_hours_occupancy: integer hours per week if stated; otherwise null.\n"
        "- required_experience: integer years; if '3+ years' → 3; if level only (e.g., 'mid-level') and no explicit years, return null.\n"
        "Return values must conform to the target schema types."
    )

    with open(filepath, "rb") as f:
        data = f.read()

    base64_string = base64.b64encode(data).decode("utf-8")

    text_input = ResponseInputTextParam(type="input_text", text=instructions)
    file_input = ResponseInputFileParam(
        type="input_file",
        filename="vacancy.pdf",
        file_data=f"data:application/pdf;base64,{base64_string}",
    )

    user_msg = EasyInputMessageParam(role="user", content=[file_input, text_input])

    response = await async_client.responses.parse(
        model=open_ai_text_settings.model,
        input=[system_msg, user_msg],
        text_format=VacancyFromFile,
    )

    return response.output_parsed
