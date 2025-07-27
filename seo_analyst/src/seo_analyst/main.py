#!/usr/bin/env python
import sys
import warnings

from datetime import datetime
from seo_analyst.crew import SeoAnalyst

warnings.filterwarnings("ignore", category=SyntaxWarning, module="pysbd")

def run():
    """
    Run the SEO crew.
    """
    inputs = {
        'topic': 'SEO',
        'current_year': str(datetime.now().year),
        'domain': 'https://medium.com'
    }

    try:
        SeoAnalyst().crew().kickoff(inputs=inputs)
    except Exception as e:
        raise Exception(f"An error occurred while running the crew: {e}")

def train():
    """
    Train the crew for a given number of iterations.
    """
    inputs = {
        "topic": "SEO",
        'current_year': str(datetime.now().year),
        'domain': 'https://reachbun.com'
    }

    try:
        SeoAnalyst().crew().train(n_iterations=int(sys.argv[1]), filename=sys.argv[2], inputs=inputs)
    except Exception as e:
        raise Exception(f"An error occurred while training the crew: {e}")

def replay():
    """
    Replay the crew execution from a specific task.
    """
    try:
        SeoAnalyst().crew().replay(task_id=sys.argv[1])
    except Exception as e:
        raise Exception(f"An error occurred while replaying the crew: {e}")

def test():
    """
    Test the crew execution and return the results.
    """
    inputs = {
        "topic": "SEO",
        "current_year": str(datetime.now().year),
        "domain": "https://reachbun.com"
    }

    try:
        SeoAnalyst().crew().test(n_iterations=int(sys.argv[1]), eval_llm=sys.argv[2], inputs=inputs)
    except Exception as e:
        raise Exception(f"An error occurred while testing the crew: {e}")
