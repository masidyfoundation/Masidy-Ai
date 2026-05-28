"""Image generation using Pollinations AI (free API)"""
import httpx

async def generate_image(prompt: str) -> dict:
    """
    Generate image from text prompt using Pollinations AI
    Returns: {"url": "image_url", "prompt": "used_prompt"}
    """
    try:
        # Pollinations AI - free image generation
        image_url = f"https://image.pollinations.ai/prompt/{prompt.replace(' ', '%20')}"
        
        # Verify the image exists
        async with httpx.AsyncClient() as client:
            response = await client.head(image_url, timeout=5)
            if response.status_code == 200:
                return {
                    "success": True,
                    "url": image_url,
                    "prompt": prompt,
                    "provider": "Pollinations AI"
                }
    except Exception as e:
        print(f"[Image Generation Error]: {e}")
    
    return {
        "success": False,
        "error": "Failed to generate image",
        "prompt": prompt
    }

async def list_image_generations(conversation_id: str) -> list:
    """Placeholder for listing generated images in conversation"""
    return []
