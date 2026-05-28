import os
import httpx

GROQ_URL = "https://api.groq.com/openai/v1/chat/completions"

async def call_llama(messages: list[dict], groq_model: str = "llama-3.1-8b-instant") -> str:
    """
    Asynchronously queries Groq LLM with tier-based model routing.
    Supports multiple Groq models based on user tier.
    
    Available models:
    - llama3-8b-8192: Free tier base model
    - mixtral-8x7b-32768: Starter/Base research tier
    - llama3-70b-8192: Base/Pro code model
    - gemma2-9b-it: Pro creative tier
    - llama3-1-405b-reasoning: MAX tier premium (when available)
    
    Falls back to demo response if key is not configured.
    """
    # Get API key dynamically from environment
    groq_api_key = os.getenv("GROQ_API_KEY")
    
    # Map Masidy model names to actual Groq API model names
    groq_model_mapping = {
        "llama-3.1-8b": "llama-3.1-8b-instant",
        "llama-3.1-70b": "llama-3.1-70b-versatile",
        "mixtral-8x22b": "mixtral-8x7b-32768",
        "gemma-2-27b": "gemma2-9b-it",
        "llama-3.1-405b": "llama-3.1-405b-reasoning"
    }
    
    # Resolve model name
    resolved_model = groq_model_mapping.get(groq_model, groq_model or "llama-3.1-8b-instant")
    
    # Check if we have a valid API key
    if not groq_api_key or "placeholder" in groq_api_key.lower():
        # Return a demo response in offline/development mode
        user_message = next((m["content"] for m in reversed(messages) if m.get("role") == "user"), "")
        return (
            f"[MASIDY DEMO MODE - Groq API not configured]\n\n"
            f"Your message: {user_message}\n\n"
            f"In production, this would be processed by {resolved_model} on Groq.\n"
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
        "model": resolved_model,
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
            print(f"[Error calling AI model]: {e}")
            raise RuntimeError("The AI model is temporarily unavailable. Please try again.")
