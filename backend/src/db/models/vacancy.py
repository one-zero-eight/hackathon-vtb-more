from __future__ import annotations

import datetime
from decimal import Decimal
from typing import TYPE_CHECKING

from sqlalchemy import DECIMAL, DateTime, ForeignKey, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from src.db.models import Base

if TYPE_CHECKING:
    from src.db.models.application import Application
    from src.db.models.skill import Skill
    from src.db.models.user import User


class Vacancy(Base):
    __tablename__ = 'vacancy'

    id: Mapped[int] = mapped_column(primary_key=True)

    name: Mapped[str]
    description: Mapped[str] = mapped_column(Text)
    salary: Mapped[Decimal | None] = mapped_column(
        DECIMAL(10, 2),
        nullable=True,
    )
    city: Mapped[str]
    weekly_hours_occupancy: Mapped[int]
    required_experience: Mapped[int]  # required experience in years

    open_time: Mapped[datetime.datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.datetime.now(tz=datetime.UTC),
    )
    close_time: Mapped[datetime.datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=True,
    )

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
