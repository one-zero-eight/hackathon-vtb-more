from __future__ import annotations

from sqlalchemy import ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

from db.models.vacancy import Vacancy
from src.db.models import Base


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
        'Vacancy',
        back_populates='skills',
        lazy='selectin',
    )
