from openai import AsyncOpenAI

from src.config import settings

async_client = AsyncOpenAI(api_key=settings.open_ai_text_settings.api_key.get_secret_value())
