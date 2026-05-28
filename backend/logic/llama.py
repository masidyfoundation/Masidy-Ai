import os
import httpx

GROQ_URL = "https://api.groq.com/openai/v1/chat/completions"

async def call_llama(messages: list[dict]) -> str:
    """
    Asynchronously queries Llama 3.1 8b on Groq.
    Expects custom system/user/assistant message formatting tags.
    Falls back to demo response if key is not configured.
    """
    # Get API key dynamically from environment
    groq_api_key = os.getenv("GROQ_API_KEY")
    
    # Check if we have a valid API key
    if not groq_api_key or "placeholder" in groq_api_key.lower():
        # Return a demo response in offline/development mode
        user_message = next((m["content"] for m in reversed(messages) if m.get("role") == "user"), "")
        return (
            f"[MASIDY DEMO MODE - Groq API not configured]\n\n"
            f"Your message: {user_message}\n\n"
            f"In production, this would be processed by Llama 3.1 8B on Groq.\n"
            f"To enable real responses:\n"
            f"1. Get a Groq API key at https://console.groq.com/\n"
            f"2. Add your key to backend/.env as GROQ_API_KEY=gsk_...\n"
            f"3. Restart the backend server"
        )

    headers = {
        "Authorization": f"Bearer {groq_api_key}",
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
