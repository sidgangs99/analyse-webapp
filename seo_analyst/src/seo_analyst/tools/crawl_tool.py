from crewai.tools import BaseTool
from typing import Type
from pydantic import BaseModel, Field
import requests
from bs4 import BeautifulSoup
from urllib.parse import urljoin, urlparse
import os, json, re


class CrawlToolInput(BaseModel):
    """Input schema for CrawlTool."""
    url: str = Field(
        description="The full URL of the webpage to crawl",
        json_schema_extra={"required": True}
    )
class CrawlTool(BaseTool):
    name: str = "SEOWebCrawler"
    description: str = (
        "Crawls a given webpage URL and extracts SEO data like title, meta tags, headings, links, images, and writes the results to a file"
    )
    args_schema: Type[BaseModel] = CrawlToolInput

    def _run(self, url: str) -> str:
        try:
            headers = {'User-Agent': 'Mozilla/5.0'}
            response = requests.get(url, headers=headers, timeout=10)
            response.raise_for_status()

            soup = BeautifulSoup(response.text, 'html.parser')

            canonical = soup.find("link", {"rel": "canonical"})
            canonical_url = canonical["href"] if canonical else None

            meta_title = soup.title.string.strip() if soup.title else None
            meta_desc = (soup.find("meta", attrs={"name": "description"}) or {}).get("content", None)
            meta_robots = (soup.find("meta", attrs={"name": "robots"}) or {}).get("content", None)

            headings = {
                tag: [h.get_text(strip=True) for h in soup.find_all(tag)]
                for tag in ['h1', 'h2', 'h3', 'h4']
            }

            links = soup.find_all('a', href=True)
            internal_links, external_links = [], []
            domain = urlparse(url).netloc

            for link in links:
                href = urljoin(url, link['href'])
                if domain in urlparse(href).netloc:
                    internal_links.append(href)
                else:
                    external_links.append(href)

            images = [
                {
                    "src": img.get("src"),
                    "alt": img.get("alt"),
                    "title": img.get("title"),
                    "loading": img.get("loading")
                }
                for img in soup.find_all("img")
            ]

            structured_data = []
            for script in soup.find_all("script", type="application/ld+json"):
                if script.string:
                    structured_data.append(script.string.strip())

            result = {
                "url": url,
                "canonical": canonical_url,
                "meta": {
                    "title": meta_title,
                    "description": meta_desc,
                    "robots": meta_robots,
                },
                "headings": headings,
                "links": {
                    "internal": list(set(internal_links)),
                    "external": list(set(external_links))
                },
                "images": images,
                "structured_data": structured_data,
            }

            # === Write to file ===
            folder = "output/crawled_pages"
            os.makedirs(folder, exist_ok=True)

            # Safe filename
            path = urlparse(url).path or "index"
            safe_filename = re.sub(r'[^a-zA-Z0-9_\-]', '_', path.strip('/')) or "index"
            filename = os.path.join(folder, f"{safe_filename}.json")

            with open(filename, "w", encoding="utf-8") as f:
                json.dump(result, f, indent=2, ensure_ascii=False)

            return f"✅ Crawled and saved SEO data for: {url}"

        except Exception as e:
            return f"❌ Failed to crawl {url}: {str(e)}"
