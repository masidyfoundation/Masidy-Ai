import os
import httpx

GROQ_API_KEY = os.getenv("GROQ_API_KEY")
GROQ_URL = "https://api.groq.com/openai/v1/chat/completions"

async def call_llama(messages: list[dict]) -> str:
    """
    Asynchronously queries Llama 3.1 8b on Groq.
    Expects custom system/user/assistant message formatting tags.
    """
    if not GROQ_API_KEY:
        raise ValueError("GROQ_API_KEY must be provided in system environment variables.")

    headers = {
        "Authorization": f"Bearer {GROQ_API_KEY}",
        "Content-Type": "application/json"
    }
    
    payload = {
        "model": "llama-3.1-8b-instant",
        "messages": messages,
        "temperature": 0.5,
        "max_tokens": 1024
    }

    async with httpx.AsyncClient() as client:
        try:
            response = await client.post(GROQ_URL, json=payload, headers=headers, timeout=30.0)
            response.raise_for_status()
            res_json = response.json()
            return res_json["choices"][0]["message"]["content"]
        except Exception as e:
            print(f"[Error calling Llama on Groq]: {e}")
            raise RuntimeError(f"Failed to query Groq Llama API: {str(e)}")
