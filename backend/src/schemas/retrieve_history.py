from src.schemas.pydantic_base import BaseSchema


class Content(BaseSchema):
    type: str
    transcript: str
    audio: str


class Item(BaseSchema):
    id: str
    object: str | None
    type: str
    status: str
    role: str
    content: list[Content]


# https://platform.openai.com/docs/api-reference/realtime_client_events/conversation/item/retrieve
class ConversationItemRetrieveRequest(BaseSchema):
    event_id: str | None = None
    type: str
    item_id: str


# https://platform.openai.com/docs/api-reference/realtime_server_events/conversation/item/retrieved
class ConversationItemRetrieveResponse(BaseSchema):
    event_id: str
    type: str
    previous_item_id: str
    item: Item
