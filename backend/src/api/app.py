from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi_derive_responses import AutoDeriveResponsesAPIRoute
from fastapi_swagger import patch_fastapi

import src.api.logging_  # noqa: F401
from src.api.lifespan import lifespan
from src.config import api_settings

app = FastAPI(
    docs_url=None, swagger_ui_oauth2_redirect_url=None, root_path=api_settings.app_root_path, lifespan=lifespan
)
app.router.route_class = AutoDeriveResponsesAPIRoute

patch_fastapi(app)

app.add_middleware(
    CORSMiddleware,
    allow_origin_regex=api_settings.cors_allow_origin_regex,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

from src.api.application.routes import router as application_router  # noqa: E402
from src.api.auth.routes import router as auth_router  # noqa: E402
from src.api.interview.routes import router as interview_router  # noqa: E402
from src.api.pre_interview.routes import router as pre_interview_router  # noqa: E402
from src.api.skill.routes import skills_router, skills_type_router  # noqa: E402
from src.api.user.routes import router as user_router  # noqa: E402
from src.api.vacancy.routes import router as vacancy_router  # noqa: E402

app.include_router(application_router)
app.include_router(auth_router)
app.include_router(interview_router)
app.include_router(skills_router)
app.include_router(skills_type_router)
app.include_router(vacancy_router)
app.include_router(user_router)
app.include_router(pre_interview_router)
