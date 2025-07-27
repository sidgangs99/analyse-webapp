import requests
from lxml import html
from crewai.tools import BaseTool
from typing import Type, Set
from pydantic import BaseModel, Field
from urllib.parse import urljoin, urlparse

class GetAllUrlsInput(BaseModel):
    """Input schema for GetAllUrlsTool."""
    domain: str = Field(..., description="Domain to crawl, e.g., 'https://example.com'")

class GetAllUrlsTool(BaseTool):
    name: str = "Get All URLs of Domain"
    description: str = (
        "Crawls the given domain and returns all unique URLs found on the site. "
        "Input should be the root URL (e.g., 'https://example.com'). "
        "Returns a list of URLs as a string, one per line."
    )
    args_schema: Type[BaseModel] = GetAllUrlsInput

    def _run(self, domain: str) -> str:
        visited: Set[str] = set()
        to_visit = [domain]
        domain_host = urlparse(domain).netloc

        while to_visit:
            url = to_visit.pop()
            if url in visited:
                continue
            visited.add(url)
            try:
                resp = requests.get(url, timeout=5)
                if resp.status_code != 200:
                    continue
                tree = html.fromstring(resp.content)
                tree.make_links_absolute(url)  # Convert all relative links to absolute
                for elem in tree.xpath('//a[@href]'):
                    href = elem.get('href')
                    if not href:
                        continue
                    parsed_href = urlparse(href)
                    if parsed_href.scheme.startswith('http') and parsed_href.netloc == domain_host:
                        if href not in visited and href not in to_visit:
                            to_visit.append(href)
            except Exception:
                continue

        return '\n'.join(sorted(visited))
