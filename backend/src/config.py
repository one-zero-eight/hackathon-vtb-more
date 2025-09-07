import os
from pathlib import Path

from src.config_schema import ApiSettings, OpenAIRealtimeSettings, OpenAITextSettings, Settings

settings_path = os.getenv("SETTINGS_PATH", "settings.yaml")
settings: Settings = Settings.from_yaml(Path(settings_path))
api_settings: ApiSettings | None = settings.api_settings
open_ai_text_settings: OpenAITextSettings | None = settings.open_ai_text_settings
open_ai_realtime_settings: OpenAIRealtimeSettings | None = settings.open_ai_realtime_settings
