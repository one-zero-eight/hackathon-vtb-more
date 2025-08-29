from src.db.repositories.application import application_repository
from src.db.repositories.skill import skill_repository, skill_type_repository
from src.db.repositories.user import user_repository
from src.db.repositories.vacancy import vacancy_repository

__all__ = [
    'application_repository',
    'skill_repository',
    'skill_type_repository',
    'user_repository',
    'vacancy_repository'
]
