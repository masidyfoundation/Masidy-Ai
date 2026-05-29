"""Real image generation using Pollinations AI — FLUX model, no API key needed"""
import httpx
import urllib.parse
import random

# Style prompt enhancers — appended to user prompt for better results
STYLE_ENHANCERS = {
    "Photorealistic": "photorealistic, ultra detailed, 8k, professional photography, sharp focus, cinematic lighting",
    "Digital Art": "digital art, concept art, highly detailed, vibrant colors, artstation trending, smooth",
    "Cinematic": "cinematic shot, movie still, dramatic lighting, anamorphic lens, film grain, epic composition",
    "Anime": "anime style, studio ghibli inspired, detailed illustration, vibrant, clean lines",
    "Oil Painting": "oil painting, classical art style, rich textures, masterpiece, museum quality",
    "Minimalist": "minimalist design, clean, simple, modern, white background, elegant",
    "Fantasy": "fantasy art, magical, ethereal, epic, detailed environment, mystical atmosphere",
    "Cyberpunk": "cyberpunk, neon lights, futuristic city, rain, dark atmosphere, blade runner style",
    "Watercolor": "watercolor painting, soft colors, artistic, flowing, delicate brushstrokes",
    "3D Render": "3d render, octane render, blender, physically based rendering, studio lighting, 4k",
}

NEGATIVE_PROMPT = "blurry, low quality, distorted, ugly, bad anatomy, watermark, text, logo, nsfw"

async def generate_image(prompt: str, style: str = "Photorealistic", aspect_ratio: str = "1:1", seed: int = None) -> dict:
    """
    Generate real image using Pollinations AI with FLUX model.
    Free, no API key, state-of-the-art quality.
    """
    try:
        # Build enhanced prompt
        enhancer = STYLE_ENHANCERS.get(style, STYLE_ENHANCERS["Photorealistic"])
        full_prompt = f"{prompt}, {enhancer}"
        
        # Map aspect ratio to dimensions
        dimensions = {
            "1:1": (1024, 1024),
            "16:9": (1344, 768),
            "9:16": (768, 1344),
            "4:3": (1152, 896),
            "3:2": (1216, 832),
        }
        width, height = dimensions.get(aspect_ratio, (1024, 1024))
        
        # Random seed for variety if not specified
        if seed is None:
            seed = random.randint(1, 999999)
        
        # Build Pollinations URL with FLUX model
        encoded_prompt = urllib.parse.quote(full_prompt)
        image_url = (
            f"https://image.pollinations.ai/prompt/{encoded_prompt}"
            f"?width={width}&height={height}&seed={seed}&model=flux&nologo=true&enhance=true"
        )
        
        # Verify the image generates successfully (HEAD request)
        async with httpx.AsyncClient(timeout=60.0) as client:
            response = await client.get(image_url, follow_redirects=True)
            if response.status_code == 200:
                return {
                    "success": True,
                    "url": image_url,
                    "prompt": prompt,
                    "enhanced_prompt": full_prompt,
                    "style": style,
                    "width": width,
                    "height": height,
                    "seed": seed,
                    "model": "FLUX"
                }
    except Exception as e:
        print(f"[Image Generation Error]: {e}")
    
    return {
        "success": False,
        "error": "Image generation is temporarily unavailable. Please try again.",
        "prompt": prompt
    }


async def list_image_generations(conversation_id: str) -> list:
    return []
