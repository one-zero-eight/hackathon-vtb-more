import re
from typing import Literal

from bs4 import BeautifulSoup
from httpx import AsyncClient
from pydantic import Field

from src.schemas.pydantic_base import BaseSchema

async_client = AsyncClient()


class Stat(BaseSchema):
    name: str
    value: str | int
    icon: str | None = None
    "svg tag to display on frontend"


class GithubStats(BaseSchema):
    github_stats_url: str
    fullname: str
    rank: Literal["A+", "A", "B+", "B", "C+", "C", "D+", "D", "E+", "E", "F"]
    rank_progress: int = Field(ge=0, le=100)
    stats: list[Stat]


async def parse_github_stats(github_username: str) -> GithubStats:
    url = f"https://github-readme-stats.vercel.app/api?username={github_username}&include_all_commits=false&count_private=true&show_icons=true"

    response = await async_client.get(url)
    soup = BeautifulSoup(response.text, "html.parser")
    svg_data = soup.find("svg")
    title = svg_data.find("title").text
    fullname, _, _ = title.partition(" GitHub Stats")
    fullname = fullname.removesuffix("'s")
    _, _, rank = title.rpartition("Rank: ")
    desc = svg_data.find("desc").text

    # find style
    # .rank-circle {
    #   stroke: #2f80ed;
    #   stroke-dasharray: 300;
    #   fill: none;
    #   stroke-width: 6;
    #   stroke-linecap: round;
    #   opacity: 0.8;
    #   transform-origin: -10px 8px;
    #   transform: rotate(-90deg);
    #   animation: rankAnimation 1s forwards ease-in-out;
    # }
    style = svg_data.find("style").text
    rankAnimation = re.search(r"@keyframes rankAnimation ", style)

    if rankAnimation:
        stroke_dasharray = 0
        starting_pos = rankAnimation.span()
        to = re.search(r"to {", style[starting_pos[1] :])
        if to:
            to_pos = to.span()
            to_pos = to_pos[0] + starting_pos[1]
            # stroke-dashoffset: 120.12313
            stroke_dasharray_str = re.search(
                r"stroke-dashoffset: (\d+\.\d+);", style[to_pos:]
            )
            if stroke_dasharray_str:
                stroke_dasharray = float(stroke_dasharray_str.group(1))

        rank_progress = round(((250 - stroke_dasharray) / 250) * 100)
    else:
        rank_progress = 0

    # Total Stars Earned: 130, Total Commits in 2025 : 935, Total PRs: 79, Total Issues: 292, Contributed to (last year): 72
    stats = []
    for line in desc.split(", "):
        key, _, value = line.partition(": ")
        stats.append(Stat(name=key, value=int(value) if value.isdigit() else value))

    icons = []

    # find all svgs with class "icon"
    icons_elements = svg_data.find_all("svg", class_="icon")
    for icon_element in icons_elements:
        # as html string
        icons.append(icon_element.prettify())

    if len(icons) == len(stats):
        for icon, stat in zip(icons, stats):
            stat.icon = icon

    return GithubStats(
        github_stats_url=url,
        fullname=fullname,
        rank=rank,
        rank_progress=rank_progress,
        stats=stats,
    )
