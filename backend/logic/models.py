"""Masidy AI Model Tier System - Real Groq LLM Model Routing"""

# Tier-to-Model Mapping
TIER_MODELS = {
    "FREE": ["free-base"],
    "STARTER": ["starter-base", "starter-research"],
    "BASE": ["base-general", "base-research", "base-code"],
    "PRO": ["pro-general", "pro-research", "pro-code", "pro-creative"],
    "MAX": ["max-general", "max-research", "max-code", "max-creative", "max-premium"]
}

# Real Groq LLM Models - current API model IDs as of 2026
GROQ_MODELS = {
    "llama-3.1-8b":   "llama-3.1-8b-instant",
    "llama-3.1-70b":  "llama-3.1-70b-versatile",
    "mixtral-8x22b":  "mixtral-8x7b-32768",
    "gemma-2-27b":    "gemma2-9b-it",
    "llama-3.1-405b": "llama-3.1-405b-reasoning"
}

# Shared base system prompt — minimal, just answer normally
BASE_PROMPT = "You are a helpful AI assistant."

# Model Definitions with Actual Groq LLM Backing
MASIDY_MODELS = {
    "free-base": {
        "tier": "FREE",
        "name": "Free Base",
        "description": "Core AI assistant for general queries (8B)",
        "groq_model": "llama-3.1-8b",
        "system_prompt": BASE_PROMPT
    },
    "starter-base": {
        "tier": "STARTER",
        "name": "Starter Base",
        "description": "Enhanced assistant for general queries (8B)",
        "groq_model": "llama-3.1-8b",
        "system_prompt": BASE_PROMPT
    },
    "starter-research": {
        "tier": "STARTER",
        "name": "Starter Research",
        "description": "Research and analysis specialist (Mixtral)",
        "groq_model": "mixtral-8x22b",
        "system_prompt": BASE_PROMPT + "\nYou excel at research, analysis, and synthesizing information from multiple angles."
    },
    "base-general": {
        "tier": "BASE",
        "name": "Base General",
        "description": "General-purpose expert (70B)",
        "groq_model": "llama-3.1-70b",
        "system_prompt": BASE_PROMPT
    },
    "base-research": {
        "tier": "BASE",
        "name": "Base Research",
        "description": "Advanced research and analysis (Mixtral)",
        "groq_model": "mixtral-8x22b",
        "system_prompt": BASE_PROMPT + "\nYou excel at deep research, data analysis, and producing detailed reports."
    },
    "base-code": {
        "tier": "BASE",
        "name": "Base Code",
        "description": "Expert programmer (70B)",
        "groq_model": "llama-3.1-70b",
        "system_prompt": BASE_PROMPT + "\nYou are an expert software engineer. Write clean, well-commented code. Explain your reasoning when helpful."
    },
    "pro-general": {
        "tier": "PRO",
        "name": "Pro General",
        "description": "Expert across all domains (70B)",
        "groq_model": "llama-3.1-70b",
        "system_prompt": BASE_PROMPT
    },
    "pro-research": {
        "tier": "PRO",
        "name": "Pro Research",
        "description": "Expert research specialist (Mixtral)",
        "groq_model": "mixtral-8x22b",
        "system_prompt": BASE_PROMPT + "\nYou are an expert researcher. Provide thorough, well-sourced analysis."
    },
    "pro-code": {
        "tier": "PRO",
        "name": "Pro Code",
        "description": "Senior engineer (70B)",
        "groq_model": "llama-3.1-70b",
        "system_prompt": BASE_PROMPT + "\nYou are a senior software engineer. Write production-quality code with clear explanations."
    },
    "pro-creative": {
        "tier": "PRO",
        "name": "Pro Creative",
        "description": "Creative writing specialist (Mixtral)",
        "groq_model": "mixtral-8x22b",
        "system_prompt": BASE_PROMPT + "\nYou excel at creative writing, storytelling, brainstorming, and imaginative tasks."
    },
    "max-general": {
        "tier": "MAX",
        "name": "Max General",
        "description": "Ultimate expert (405B)",
        "groq_model": "llama-3.1-405b",
        "system_prompt": BASE_PROMPT
    },
    "max-research": {
        "tier": "MAX",
        "name": "Max Research",
        "description": "Elite research (Mixtral)",
        "groq_model": "mixtral-8x22b",
        "system_prompt": BASE_PROMPT + "\nYou are an elite research intelligence. Provide supreme-level analysis and synthesis."
    },
    "max-code": {
        "tier": "MAX",
        "name": "Max Code",
        "description": "Principal architect (405B)",
        "groq_model": "llama-3.1-405b",
        "system_prompt": BASE_PROMPT + "\nYou are a principal software architect. Design elegant systems and solve complex engineering problems."
    },
    "max-creative": {
        "tier": "MAX",
        "name": "Max Creative",
        "description": "Master creator (Mixtral)",
        "groq_model": "mixtral-8x22b",
        "system_prompt": BASE_PROMPT + "\nYou are a master of creative expression. Produce compelling, original, high-quality creative work."
    },
    "max-premium": {
        "tier": "MAX",
        "name": "Max Premium",
        "description": "Reserved capacity (405B)",
        "groq_model": "llama-3.1-405b",
        "system_prompt": BASE_PROMPT
    }
}

def get_available_models_for_tier(tier: str) -> list:
    """Get list of models available for a specific tier"""
    if tier not in TIER_MODELS:
        tier = "FREE"
    available_model_ids = TIER_MODELS[tier]
    return [
        {
            "id": model_id,
            "name": MASIDY_MODELS[model_id]["name"],
            "description": MASIDY_MODELS[model_id]["description"],
            "groq_model": MASIDY_MODELS[model_id]["groq_model"]
        }
        for model_id in available_model_ids
    ]

def get_model(model_id: str, tier: str = "FREE") -> dict:
    """Get model configuration by ID with tier validation"""
    # Check if model exists
    if model_id not in MASIDY_MODELS:
        # Fallback to first available model for tier
        available = get_available_models_for_tier(tier)
        if available:
            model_id = available[0]["id"]
        else:
            model_id = "free-base"
    
    model = MASIDY_MODELS[model_id]
    
    # Verify model is available for tier
    model_tier = model.get("tier", "FREE")
    if model_tier not in TIER_MODELS:
        model_tier = "FREE"
    
    # Check if user's tier has access
    available_for_tier = TIER_MODELS.get(tier, TIER_MODELS["FREE"])
    if model_id not in available_for_tier:
        # Tier doesn't have access - return first available for tier
        available = get_available_models_for_tier(tier)
        if available:
            model_id = available[0]["id"]
        else:
            model_id = "free-base"
        model = MASIDY_MODELS[model_id]
    
    return model

def get_system_prompt(model_id: str, tier: str = "FREE") -> str:
    """Get system prompt for a specific model with tier validation"""
    model = get_model(model_id, tier)
    return model["system_prompt"]

def get_groq_model(model_id: str, tier: str = "FREE") -> str:
    """Get actual Groq LLM model name for a Masidy model"""
    model = get_model(model_id, tier)
    groq_model_key = model.get("groq_model", "llama-3.1-8b")
    return GROQ_MODELS.get(groq_model_key, "llama-3.1-8b-instant")

def list_models() -> list:
    """List all Masidy model definitions"""
    return [
        {
            "id": model_id,
            "name": config["name"],
            "description": config["description"],
            "tier": config.get("tier", "FREE"),
            "groq_model": config.get("groq_model", "llama-3.1-8b")
        }
        for model_id, config in MASIDY_MODELS.items()
    ]

def list_models_by_tier(tier: str) -> list:
    """List ALL models, marking which ones are locked for the given tier"""
    tier_order = ["FREE", "STARTER", "BASE", "PRO", "MAX"]
    user_tier_index = tier_order.index(tier) if tier in tier_order else 0
    
    result = []
    for model_id, config in MASIDY_MODELS.items():
        model_tier = config.get("tier", "FREE")
        model_tier_index = tier_order.index(model_tier) if model_tier in tier_order else 0
        is_locked = model_tier_index > user_tier_index
        result.append({
            "id": model_id,
            "name": config["name"],
            "description": config["description"],
            "tier": model_tier,
            "locked": is_locked,
            "groq_model": config.get("groq_model", "llama-3.1-8b")
        })
    return result
