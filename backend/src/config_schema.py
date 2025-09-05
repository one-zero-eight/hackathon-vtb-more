from pathlib import Path

import yaml
from pydantic import BaseModel, ConfigDict, Field, SecretStr


class ApiSettings(BaseModel):
    app_root_path: str = Field("/api")
    'Prefix for the API path (e.g. "/api/v0")'
    cors_allow_origin_regex: str = ".*"
    "Allowed origins for CORS: from which domains requests to the API are allowed."
    db_url: SecretStr = Field(
        ...,
        examples=[
            "postgresql+asyncpg://postgres:postgres@localhost:5432/postgres",
            "postgresql+asyncpg://postgres:postgres@db:5432/postgres",
        ],
    )
    "PostgreSQL database connection URL"
    files_dir: Path = Path("data/files")
    "Path to the directory where files will be stored"
    secret_key: SecretStr = Field(..., example="xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx")
    encryption_algorithm: str = "HS256"
    "The encryption algorithm for encryption/decryption in auth"
    token_expiration_in_minutes: int = 60
    "Token expiration time in minutes"
    unoserver_server: str
    "The unoserver URL"
    unoserver_port: int
    "The unoserver port"


class OpenAITextSettings(BaseModel):
    api_key: SecretStr = Field(...)
    "OpenAI API key"
    model: str = Field(...)
    "OpenAI text model"


class OpenAIRealtimeSettings(BaseModel):
    api_key: SecretStr = Field(...)
    "OpenAI API key"
    model: str = Field(...)
    "OpenAI realtime model"
    voice: str = Field("verse")
    "OpenAI realtime voice"
    transcription_model: str = Field(...)
    "OpenAI transcription model"
    base_sessions_url: str = Field("https://api.openai.com/v1/realtime/sessions")
    "OpenAI realtime sessions endpoint"


class Settings(BaseModel):
    model_config = ConfigDict(json_schema_extra={"title": "Settings"}, extra="ignore")
    api_settings: ApiSettings | None = None
    open_ai_text_settings: OpenAITextSettings | None = None

    @classmethod
    def from_yaml(cls, path: Path) -> "Settings":
        with open(path, encoding="utf-8") as f:
            yaml_config = yaml.safe_load(f)

        return cls.model_validate(yaml_config)

    @classmethod
    def save_schema(cls, path: Path) -> None:
        with open(path, "w", encoding="utf-8") as f:
            schema = {"$schema": "https://json-schema.org/draft-07/schema", **cls.model_json_schema()}
            yaml.dump(schema, f, sort_keys=False)
