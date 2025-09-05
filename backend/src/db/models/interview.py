from __future__ import annotations

from typing import TYPE_CHECKING

from sqlalchemy import ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

from src.db.models import Base

if TYPE_CHECKING:
    from src.db.models.application import Application


class PreInterviewResult(Base):
    __tablename__ = "pre_interview_result"

    id: Mapped[int] = mapped_column(primary_key=True)

    is_recommended: Mapped[bool]
    score: Mapped[float]
    reason: Mapped[str | None] = mapped_column(nullable=True)

    application_id: Mapped[int] = mapped_column(ForeignKey("application.id", ondelete="CASCADE"))

    application: Mapped[Application] = relationship(
        "Application",
        back_populates="pre_interview_result",
        lazy="selectin",
    )
