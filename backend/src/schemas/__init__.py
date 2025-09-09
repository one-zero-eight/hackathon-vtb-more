from src.schemas.application import ApplicationResponse, ApplicationWithVacancyResponse, Status
from src.schemas.auth import LoginRequest, RegisterRequest, TokenPayload, TokenResponse
from src.schemas.interview import (
    InterviewHistoryRequest,
    InterviewMessageResponse,
)
from src.schemas.post_interview import PostInterviewAIStructure, PostInterviewResponse, PostInterviewResultResponse
from src.schemas.pre_interview import PreInterviewAIStructure, PreInterviewResponse
from src.schemas.skills import (
    SkillResponse,
    SkillResultAIStructure,
    SkillResultResponse,
    SkillTypeCreateRequest,
    SkillTypeResponse,
    SkillTypeUpdateRequest,
)
from src.schemas.user import UserCreate, UserResponse
from src.schemas.vacancy import (
    VacancyCreateRequest,
    VacancyEditRequest,
    VacancyFromFile,
    VacancyResponse,
    VacancyWithSkillsCreateRequest,
    VacancyWithSkillsResponse,
)

__all__ = [
    'ApplicationResponse',
    'ApplicationWithVacancyResponse',
    'Status',
    'LoginRequest',
    'RegisterRequest',
    'TokenPayload',
    'TokenResponse',
    'UserCreate',
    'UserResponse',
    'SkillResponse',
    'SkillResultAIStructure',
    'SkillResultResponse',
    'SkillTypeCreateRequest',
    'SkillTypeResponse',
    'SkillTypeUpdateRequest',
    'VacancyCreateRequest',
    'VacancyEditRequest',
    'VacancyFromFile',
    'VacancyResponse',
    'VacancyWithSkillsCreateRequest',
    'VacancyWithSkillsResponse',
    'InterviewHistoryRequest',
    'InterviewMessageResponse',
    'PostInterviewAIStructure',
    'PostInterviewResponse',
    'PostInterviewResultResponse',
    'PreInterviewAIStructure',
    'PreInterviewResponse',
]
