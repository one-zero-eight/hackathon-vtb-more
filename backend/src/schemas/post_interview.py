from pydantic import Field, computed_field

from src.schemas.interview import InterviewMessageResponse
from src.schemas.pydantic_base import BaseSchema
from src.schemas.skills import SkillResultAIStructure, SkillResultResponse


class PostInterviewResultResponse(BaseSchema):
    id: int
    is_recommended: bool
    skill_scores: list[SkillResultResponse]
    summary: str
    interview_transcript: list[InterviewMessageResponse]
    interview_summary: str
    candidate_response: str

    @computed_field(return_type=float)
    @property
    def score(self) -> float:
        if not self.skill_scores:
            return 0.0
        return sum(s.score * s.weight for s in self.skill_scores)


class PostInterviewAIStructure(BaseSchema):
    is_recommended: bool = Field(description="Whether the candidate is recommended for the next stage or hire based on the overall evaluation.")
    skill_scores: list[SkillResultAIStructure] = Field(description="List of per-skill evaluation results, each containing the skill ID and its normalized score")
    interview_summary: str = Field(description="Concise and neutral summary of the interview transcript (e.g., 3–5 sentences) capturing key strengths, gaps, and notable moments.")
    candidate_response: str = Field(description="Polite, actionable message addressed to the candidate; excludes internal notes and sensitive decision rationale.")
    summary: str = Field(description="Comprehensive internal summary aggregating the rationale for is_recommended, interpretation of skill scores, supporting evidence, and any risks or concerns.")
