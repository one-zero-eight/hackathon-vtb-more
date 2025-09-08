import asyncio
from datetime import datetime, timedelta

import httpx


class GitHubDeveloperAssessment:
    def __init__(self, github_token: str):
        self.github_token = github_token
        self.base_url = "https://api.github.com"
        self.headers = {
            "Accept": "application/vnd.github+json",
            "Authorization": f"Bearer {github_token}",
            "X-GitHub-Api-Version": "2022-11-28"
        }

    async def get_user_profile(self, username: str) -> dict:
        """Get basic user profile information"""
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{self.base_url}/users/{username}",
                headers=self.headers
            )
            return response.json() if response.status_code == 200 else {}

    async def get_user_repositories(self, username: str, per_page: int = 30) -> list[dict]:
        """Get user's public repositories"""
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{self.base_url}/users/{username}/repos",
                headers=self.headers,
                params={"per_page": per_page, "sort": "updated"}
            )
            return response.json() if response.status_code == 200 else []

    async def get_repo_stats(self, owner: str, repo: str) -> dict:
        """Get repository statistics including contributors and commits"""
        stats = {}
        async with httpx.AsyncClient() as client:
            # Get contributor statistics
            response = await client.get(
                f"{self.base_url}/repos/{owner}/{repo}/stats/contributors",
                headers=self.headers
            )
            if response.status_code == 200:
                stats["contributors"] = response.json()

            # Get commit activity
            response = await client.get(
                f"{self.base_url}/repos/{owner}/{repo}/stats/commit_activity",
                headers=self.headers
            )
            if response.status_code == 200:
                stats["commit_activity"] = response.json()

            # Get repository info
            response = await client.get(
                f"{self.base_url}/repos/{owner}/{repo}",
                headers=self.headers
            )
            if response.status_code == 200:
                stats["repo_info"] = response.json()

        return stats

    async def get_user_events(self, username: str, per_page: int = 30) -> list[dict]:
        """Get user's recent public events"""
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{self.base_url}/users/{username}/events/public",
                headers=self.headers,
                params={"per_page": per_page}
            )
            return response.json() if response.status_code == 200 else []

    def calculate_activity_score(self, events: list[dict], days: int = 30) -> dict:
        """Calculate activity score based on recent events"""
        cutoff_date = datetime.now() - timedelta(days=days)

        event_weights = {
            "PushEvent": 3,
            "PullRequestEvent": 5, 
            "IssuesEvent": 2,
            "PullRequestReviewEvent": 4,
            "CreateEvent": 2,
            "ForkEvent": 1,
            "WatchEvent": 1
        }

        score = 0
        event_counts = {}

        for event in events:
            event_date = datetime.strptime(event["created_at"], "%Y-%m-%dT%H:%M:%SZ")
            if event_date >= cutoff_date:
                event_type = event["type"]
                weight = event_weights.get(event_type, 1)
                score += weight
                event_counts[event_type] = event_counts.get(event_type, 0) + 1

        return {
            "total_score": score,
            "event_counts": event_counts,
            "days_analyzed": days
        }

    def calculate_repo_quality_score(self, repo_stats: dict) -> dict:
        """Calculate repository quality score"""
        repo_info = repo_stats.get("repo_info", {})
        contributors = repo_stats.get("contributors", [])

        # Basic metrics
        stars = repo_info.get("stargazers_count", 0)
        forks = repo_info.get("forks_count", 0)
        size = repo_info.get("size", 0)
        has_issues = repo_info.get("has_issues", False)
        has_wiki = repo_info.get("has_wiki", False)
        has_description = bool(repo_info.get("description"))
        has_license = bool(repo_info.get("license"))

        # Contributor metrics
        num_contributors = len(contributors)
        total_commits = sum(contributor.get("total", 0) for contributor in contributors)

        # Calculate quality score (0-100)
        score = 0

        # Stars scoring (0-20 points)
        if stars > 100:
            score += 20
        elif stars > 50:
            score += 15
        elif stars > 10:
            score += 10
        elif stars > 0:
            score += 5

        # Forks scoring (0-15 points)
        if forks > 50:
            score += 15
        elif forks > 20:
            score += 10
        elif forks > 5:
            score += 7
        elif forks > 0:
            score += 3

        # Repository health (0-35 points)
        if has_description:
            score += 5
        if has_license:
            score += 10
        if has_issues:
            score += 5
        if has_wiki:
            score += 5
        if num_contributors > 1:
            score += 10

        # Commit activity (0-30 points)
        if total_commits > 500:
            score += 30
        elif total_commits > 200:
            score += 20
        elif total_commits > 50:
            score += 15
        elif total_commits > 10:
            score += 10
        elif total_commits > 0:
            score += 5

        return {
            "quality_score": min(score, 100),
            "metrics": {
                "stars": stars,
                "forks": forks,
                "contributors": num_contributors,
                "total_commits": total_commits,
                "has_description": has_description,
                "has_license": has_license,
                "has_issues": has_issues,
                "has_wiki": has_wiki
            }
        }

    async def assess_developer(self, username: str) -> dict:
        """Complete developer assessment"""
        # Get user profile
        profile = await self.get_user_profile(username)
        if not profile:
            return {"error": "User not found"}

        # Get repositories
        repositories = await self.get_user_repositories(username)

        # Get recent activity
        events = await self.get_user_events(username)
        activity_score = self.calculate_activity_score(events)

        # Analyze top repositories
        repo_scores = []
        top_repos = sorted(repositories, 
                          key=lambda r: r.get("stargazers_count", 0) + r.get("forks_count", 0), 
                          reverse=True)[:5]

        for repo in top_repos:
            repo_stats = await self.get_repo_stats(repo["owner"]["login"], repo["name"])
            repo_quality = self.calculate_repo_quality_score(repo_stats)
            repo_scores.append({
                "name": repo["name"],
                "url": repo["html_url"],
                "quality_score": repo_quality
            })

        # Calculate overall developer score
        avg_repo_score = sum(repo["quality_score"]["quality_score"] for repo in repo_scores) / len(repo_scores) if repo_scores else 0
        activity_weight = min(activity_score["total_score"] / 10, 50)  # Cap at 50 points

        overall_score = (avg_repo_score * 0.7) + (activity_weight * 0.3)

        return {
            "username": username,
            "profile": {
                "name": profile.get("name"),
                "bio": profile.get("bio"),
                "location": profile.get("location"),
                "public_repos": profile.get("public_repos"),
                "followers": profile.get("followers"),
                "following": profile.get("following"),
                "created_at": profile.get("created_at")
            },
            "activity_score": activity_score,
            "repository_analysis": repo_scores,
            "overall_score": round(overall_score, 2),
            "assessment_timestamp": datetime.now().isoformat()
        }

# Example usage function
async def assess_candidate(github_token: str, username: str):
    """Main function to assess a GitHub candidate"""
    assessor = GitHubDeveloperAssessment(github_token)
    result = await assessor.assess_developer(username)
    return result

# Example of how to use the assessment
# Replace 'your_github_token' with actual token
result = asyncio.run(assess_candidate('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', 'ArtemSBulgakov'))
print(result)
