from openai import AsyncOpenAI

from src.config import open_ai_text_settings

async_client = AsyncOpenAI(api_key=open_ai_text_settings.api_key.get_secret_value())
