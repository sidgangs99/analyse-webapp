from crewai.tools import BaseTool
from typing import Type
from pydantic import BaseModel, Field
import requests
import os
from dotenv import load_dotenv

# Load SERPER_API_KEY from .env
load_dotenv()

class GoogleIndexedURLsInput(BaseModel):
    domain: str = Field(
        description="The URLs related to a domain, search all indexed URLs (e.g., reachbun.com)",
        json_schema_extra={"required": True}
    )

class GoogleIndexedURLsTool(BaseTool):
    name: str = "GoogleIndexedURLs"
    description: str = (
        "Fetches URLs indexed by Google for a given domain"
    )
    args_schema: Type[BaseModel] = GoogleIndexedURLsInput

    def _run(self, domain: str) -> str:
        api_key = "0b9861e43dfff0517e3336b4638556c22da81912"
        if not api_key:
            return "❌ SERPER_API_KEY not set in environment."

        endpoint = "https://google.serper.dev/search"
        headers = {
            "X-API-KEY": api_key,
            "Content-Type": "application/json"
        }
        payload = {
            "q": f"site:{domain}"
        }

        try:
            res = requests.post(endpoint, headers=headers, json=payload)
            res.raise_for_status()
            data = res.json()
            links = [item["link"] for item in data.get("organic", [])]
            print(f'Extracted links from the SERPER: {links}')
            return "\n".join(links) if links else "No indexed URLs found."
        except Exception as e:
            return f"❌ Error fetching indexed URLs: {str(e)}"
