from pydantic import Field

from src.schemas.interview import InterviewMessageResponse
from src.schemas.pydantic_base import BaseSchema
from src.schemas.skills import SkillResultAIStructure, SkillResultResponse


class PostInterviewResultResponse(BaseSchema):
    id: int
    is_recommended: bool
    score: float
    skill_scores: list[SkillResultResponse]
    summary: str
    interview_transcript: list[InterviewMessageResponse]
    interview_summary: str
    candidate_response: str
    emotional_analysis: str
    candidate_roadmap: str


class PostInterviewResponse(BaseSchema):
    id: int
    is_recommended: bool
    score: float
    summary: str
    interview_summary: str
    candidate_response: str
    emotional_analysis: str
    candidate_roadmap: str


class PostInterviewAIStructure(BaseSchema):
    score: float = Field(..., gt=0, lt=1, description="Float between 0.0–1.0; prefer two-decimal precision, representing how suitable candidate is.")
    is_recommended: bool = Field(description="Whether the candidate is recommended for the next stage or hire based on the overall evaluation.")
    skill_scores: list[SkillResultAIStructure] = Field(description="List of per-skill evaluation results, each containing the skill ID and its normalized score")
    interview_summary: str = Field(description="Concise and neutral summary of the interview transcript (e.g., 3–5 sentences) capturing key strengths, gaps, and notable moments.")
    candidate_response: str = Field(description="Polite, actionable message addressed to the candidate; excludes internal notes and sensitive decision rationale.")
    summary: str = Field(description="Comprehensive internal summary aggregating the rationale for is_recommended, interpretation of skill scores, supporting evidence, and any risks or concerns.")
    emotional_analysis: str = Field(description="Emotional analysis of the candidate based on interview transcript.")
    candidate_roadmap: str = Field(description="Actionable, candidate-facing development plan outlining prioritized skill gaps, concrete next steps, recommended resources, and suggested timelines derived from the interview.")
