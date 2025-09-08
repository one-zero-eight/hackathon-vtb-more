from __future__ import annotations

from typing import Optional, TYPE_CHECKING

from sqlalchemy import ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

from src.db.models import Base

if TYPE_CHECKING:
    from src.db.models.interview import PreInterviewResult
    from src.db.models.user import User
    from src.db.models.vacancy import Vacancy


class Application(Base):
    __tablename__ = 'application'

    id: Mapped[int] = mapped_column(primary_key=True)

    cv: Mapped[str]
    'Path to the CV'
    status: Mapped[str]

    profile_url: Mapped[Optional[str]]
    user_id: Mapped[int] = mapped_column(ForeignKey('user.id', ondelete='CASCADE'))
    vacancy_id: Mapped[int] = mapped_column(ForeignKey('vacancy.id', ondelete='CASCADE'))

    user: Mapped[User] = relationship(
        'User',
        back_populates='applications',
        lazy='selectin',
    )
    vacancy: Mapped[Vacancy] = relationship(
        "Vacancy",
        back_populates="applications",
        lazy="selectin",
    )
    pre_interview_result: Mapped[PreInterviewResult] = relationship(
        "PreInterviewResult",
        back_populates="application",
        lazy="selectin",
    )
