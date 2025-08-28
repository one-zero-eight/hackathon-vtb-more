from __future__ import annotations

import datetime
from typing import TYPE_CHECKING

from sqlalchemy import ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

from db.models.skill import Skill
from src.db.models import Base

if TYPE_CHECKING:
    from db.models.user import User
    from src.db.models.application import Application


class Vacancy(Base):
    __tablename__ = 'vacancy'

    id: Mapped[int] = mapped_column(primary_key=True)

    name: Mapped[str]
    description: Mapped[str]
    salary: Mapped[float | None]

    required_experience: Mapped[int]  # required experience in years

    open_time: Mapped[datetime.datetime] = mapped_column(default=datetime.datetime.now)
    close_time: Mapped[datetime.datetime] = mapped_column(nullable=True)

    is_active: Mapped[bool] = mapped_column(default=True)

    user_id: Mapped[int] = mapped_column(ForeignKey('user.id', ondelete='CASCADE'))

    applications: Mapped[list[Application]] = relationship(
        'Application',
        back_populates='vacancy',
        lazy='selectin',
    )
    skills: Mapped[list[Skill]] = relationship(
        'Skill',
        back_populates='vacancy',
        lazy='selectin',
    )
    user: Mapped[User] = relationship(
        'User',
        back_populates='vacancies',
        lazy='selectin',
    )
