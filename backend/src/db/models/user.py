from __future__ import annotations

from typing import TYPE_CHECKING

from sqlalchemy.orm import Mapped, mapped_column, relationship

from src.db.models import Base

if TYPE_CHECKING:
    from src.db.models import Application, Vacancy


class User(Base):
    __tablename__ = 'user'

    id: Mapped[int] = mapped_column(primary_key=True)

    name: Mapped[str]
    email: Mapped[str]
    hashed_password: Mapped[str]

    is_admin: Mapped[bool]

    applications: Mapped[list[Application]] = relationship(
        'Application',
        back_populates='user',
        lazy='selectin',
    )
    vacancies: Mapped[list[Vacancy]] = relationship(
        'Vacancy',
        back_populates='user',
        lazy='selectin',
    )
