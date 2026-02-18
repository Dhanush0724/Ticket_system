import os
import requests


OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions"


def classify_ticket(description):
    api_key = os.environ.get("OPENROUTER_API_KEY")

    if not api_key:
        return None

    prompt = f"""
You are a support ticket classifier.

Given the following support ticket description, classify it into:

Category (one of): billing, technical, account, general
Priority (one of): low, medium, high, critical

Return ONLY valid JSON in this format:
{{
  "category": "...",
  "priority": "..."
}}

Ticket description:
\"\"\"{description}\"\"\"
"""

    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json"
    }

    body = {
        "model": "openai/gpt-3.5-turbo",
        "messages": [
            {"role": "user", "content": prompt}
        ],
        "temperature": 0
    }

    try:
        response = requests.post(OPENROUTER_URL, headers=headers, json=body)
        response.raise_for_status()

        data = response.json()
        content = data["choices"][0]["message"]["content"]

        import json
        parsed = json.loads(content)

        return {
            "suggested_category": parsed.get("category"),
            "suggested_priority": parsed.get("priority")
        }

    except Exception:
        # Graceful failure
        return None
