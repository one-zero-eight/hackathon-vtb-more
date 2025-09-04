from typing import Any

from openai import OpenAI
from openai.types.responses import EasyInputMessageParam, FileSearchToolParam

from src.config import open_ai_text_settings


class OpenAIClient:
    def __init__(self) -> None:
        self.client = OpenAI(
            api_key=open_ai_text_settings.api_key.get_secret_value(),
        )

    @staticmethod
    def make_file_search_tool(vector_store_id: str) -> FileSearchToolParam:
        return FileSearchToolParam(
            type="file_search",
            vector_store_ids=[vector_store_id],
        )

    def structured_parse(
        self,
        *,
        model: str,
        messages: list[EasyInputMessageParam],
        text_format: Any,
        tools: list[Any] | None = None,
    ):
        return self.client.responses.parse(
            model=model,
            input=messages,
            text_format=text_format,
            tools=tools or [],
        )
