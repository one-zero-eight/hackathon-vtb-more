from enum import StrEnum


class Status(StrEnum):
    APPROVED = "approved"
    REJECTED = "rejected"
    APPROVED_FOR_INTERVIEW = "approved_for_interview"
    REJECTED_FOR_INTERVIEW = "rejected_for_interview"
    IN_INTERVIEW = "in_interview"
