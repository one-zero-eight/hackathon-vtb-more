from src.schemas.application import ApplicationResponse, Status
from src.schemas.auth import LoginRequest, RegisterRequest, TokenPayload, TokenResponse
from src.schemas.interview import PreInterviewAIStructure, PreInterviewResponse
from src.schemas.skills import SkillsResponse, SkillTypeCreateRequest, SkillTypeResponse, SkillTypeUpdateRequest
from src.schemas.user import UserCreate, UserResponse
from src.schemas.vacancy import VacancyCreateRequest, VacancyEditRequest, VacancyResponse

__all__ = [
    'ApplicationResponse',
    'Status',
    'LoginRequest',
    'RegisterRequest',
    'TokenPayload',
    'TokenResponse',
    'UserCreate',
    'UserResponse',
    'SkillsResponse',
    'SkillTypeCreateRequest',
    'SkillTypeResponse',
    'SkillTypeUpdateRequest',
    'VacancyCreateRequest',
    'VacancyEditRequest',
    'VacancyResponse',
    'PreInterviewAIStructure',
    'PreInterviewResponse',
]
