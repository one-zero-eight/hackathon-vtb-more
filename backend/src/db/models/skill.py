from __future__ import annotations

from typing import TYPE_CHECKING

from sqlalchemy import ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

from src.db.models import Base

if TYPE_CHECKING:
    from src.db.models.application import Application
    from src.db.models.vacancy import Vacancy


class SkillType(Base):
    __tablename__ = 'skill_type'

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str]

    skills: Mapped[list[Skill]] = relationship(
        'Skill',
        back_populates='skill_type',
        lazy='selectin',
    )


class Skill(Base):
    __tablename__ = 'skill'

    id: Mapped[int] = mapped_column(primary_key=True)

    weight: Mapped[float]
    details: Mapped[str]

    skill_type_id: Mapped[int] = mapped_column(ForeignKey('skill_type.id', ondelete='CASCADE'))
    vacancy_id: Mapped[int] = mapped_column(ForeignKey('vacancy.id', ondelete='CASCADE'))

    skill_type: Mapped[SkillType] = relationship(
        'SkillType',
        back_populates='skills',
        lazy='selectin',
    )
    vacancy: Mapped[Vacancy] = relationship(
        "Vacancy",
        back_populates="skills",
        lazy="selectin",
    )
    skill_results: Mapped[list[SkillResult]] = relationship(
        'SkillResult',
        back_populates='skill',
        lazy='selectin',
    )


class SkillResult(Base):
    __tablename__ = 'skill_result'

    id: Mapped[int] = mapped_column(primary_key=True)

    score: Mapped[float]

    skill_id: Mapped[int] = mapped_column(ForeignKey('skill.id', ondelete='CASCADE'))
    application_id: Mapped[int] = mapped_column(ForeignKey('application.id', ondelete='CASCADE'))

    skill: Mapped[Skill] = relationship(
        'Skill',
        back_populates='skill_results',
        lazy='selectin',
    )
    application: Mapped[Application] = relationship(
        'Application',
        back_populates='skill_results',
        lazy='selectin',
    )
