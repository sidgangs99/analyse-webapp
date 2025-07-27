from crewai import Agent, Crew, Process, Task
from crewai.project import CrewBase, agent, crew, task
from crewai.agents.agent_builder.base_agent import BaseAgent
from crewai_tools import ScrapeWebsiteTool
from typing import List
from tools.crawl_tool import CrawlTool

@CrewBase
class SeoAnalyst():
    """SEO Analyst Crew"""

    agents: List[BaseAgent]
    tasks: List[Task]

    @agent
    def crawler(self) -> Agent:
        return Agent(
            config=self.agents_config['crawler'],  # type: ignore[index]
            tools=[CrawlTool(), ScrapeWebsiteTool()],
            verbose=True,
            allow_delegation=True
        )

    @agent
    def seo_analyst(self) -> Agent:
        return Agent(
            config=self.agents_config['seo_analyst'],  # type: ignore[index]
            verbose=True,
            allow_delegation=True
        )

    @agent
    def content_recommender(self) -> Agent:
        return Agent(
            config=self.agents_config['content_recommender'],  # type: ignore[index]
            verbose=True,
        )

    @task
    def crawl_task(self) -> Task:
        return Task(
            config=self.tasks_config['crawl_task'],  # type: ignore[index]
        )

    @task
    def seo_audit_task(self) -> Task:
        return Task(
            config=self.tasks_config['seo_audit_task'],  # type: ignore[index]
        )

    @task
    def content_strategy_task(self) -> Task:
        return Task(
            config=self.tasks_config['content_strategy_task'],  # type: ignore[index]
            output_file='seo_recommendations.md'
        )

    @crew
    def crew(self) -> Crew:
        """Creates the SEO Analyst crew"""
        return Crew(
            agents=self.agents,
            tasks=self.tasks,
            process=Process.sequential,
            verbose=True,
        )
