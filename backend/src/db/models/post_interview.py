from __future__ import annotations

from typing import TYPE_CHECKING

from sqlalchemy import ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

from src.db.models import Base

if TYPE_CHECKING:
    from src.db.models.application import Application


class PostInterviewResult(Base):
    __tablename__ = "post_interview_result"

    id: Mapped[int] = mapped_column(primary_key=True)

    is_recommended: Mapped[bool]
    score: Mapped[float]
    interview_summary: Mapped[str]
    candidate_response: Mapped[str]
    summary: Mapped[str]

    application_id: Mapped[int] = mapped_column(ForeignKey("application.id", ondelete="CASCADE"))

    application: Mapped[Application] = relationship(
        "Application",
        back_populates="pre_interview_result",
        lazy="selectin",
    )
