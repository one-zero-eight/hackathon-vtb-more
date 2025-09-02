from src.db.repositories.application import ApplicationRepository
from src.db.repositories.interview import PreInterviewResultRepository
from src.db.repositories.skill import SkillRepository, SkillTypeRepository
from src.db.repositories.user import UserRepository
from src.db.repositories.vacancy import VacancyRepository

__all__ = [
    'ApplicationRepository',
    'SkillRepository',
    'SkillTypeRepository',
    'UserRepository',
    'VacancyRepository',
    'PreInterviewResultRepository'
]

