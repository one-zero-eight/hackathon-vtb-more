from typing import Literal

from pydantic import ConfigDict

from src.schemas.pydantic_base import BaseSchema


class InterviewMessage(BaseSchema):
    role: Literal['user', 'assistant']
    message: str


class InterviewMessageResponse(BaseSchema):
    id: int
    role: Literal['user', 'assistant']
    message: str

    model_config = ConfigDict(from_attributes=True)


class InterviewHistoryRequest(BaseSchema):
    application_id: int
    messages: list[InterviewMessage]
