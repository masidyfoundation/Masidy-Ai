"""Masidy AI Model Tier System - Real Groq LLM Model Routing"""

# Tier-to-Model Mapping
TIER_MODELS = {
    "FREE": ["free-base"],
    "STARTER": ["starter-base", "starter-research"],
    "BASE": ["base-general", "base-research", "base-code"],
    "PRO": ["pro-general", "pro-research", "pro-code", "pro-creative"],
    "MAX": ["max-general", "max-research", "max-code", "max-creative", "max-premium"]
}

# Real Groq LLM Models
GROQ_MODELS = {
    "llama-3.1-8b": "llama3-8b-8192",
    "llama-3.1-70b": "llama3-70b-8192",
    "mixtral-8x22b": "mixtral-8x7b-32768",
    "gemma-2-27b": "gemma2-9b-it",
    "llama-3.1-405b": "llama3-1-405b-reasoning"
}

# Model Definitions with Actual Groq LLM Backing
MASIDY_MODELS = {
    # FREE TIER - 8B Only
    "free-base": {
        "tier": "FREE",
        "name": "Free Base",
        "description": "Core AI assistant for general queries (8B)",
        "groq_model": "llama-3.1-8b",
        "system_prompt": """You are Masidy Free, a core AI assistant powered by Llama 3.1 8B.
You provide helpful, accurate responses across general domains.
Be concise, clear, and direct. Always be honest about limitations.
Tier: FREE - General queries only."""
    },
    
    # STARTER TIER - 8B + Mixtral
    "starter-base": {
        "tier": "STARTER",
        "name": "Starter Base",
        "description": "Enhanced assistant for general queries (8B)",
        "groq_model": "llama-3.1-8b",
        "system_prompt": """You are Masidy Starter, an enhanced AI assistant.
You provide helpful responses across all general domains.
Be clear, practical, and well-organized.
Tier: STARTER - General queries unlocked."""
    },
    
    "starter-research": {
        "tier": "STARTER",
        "name": "Starter Research",
        "description": "Research and analysis specialist (Mixtral)",
        "groq_model": "mixtral-8x22b",
        "system_prompt": """You are Masidy Research, a specialized research assistant powered by Mixtral.
Your expertise includes:
- Deep research and investigation
- Data analysis and patterns
- Academic writing and synthesis
- Critical thinking and evaluation
Be thorough and cite sources when possible.
Tier: STARTER - Research queries unlocked."""
    },
    
    # BASE TIER - 8B + Mixtral + 70B
    "base-general": {
        "tier": "BASE",
        "name": "Base General",
        "description": "General-purpose expert (8B)",
        "groq_model": "llama-3.1-8b",
        "system_prompt": """You are Masidy Base, a general-purpose AI expert.
You help with any domain and adapt your expertise to user needs.
Tier: BASE - Full general assistance."""
    },
    
    "base-research": {
        "tier": "BASE",
        "name": "Base Research",
        "description": "Advanced research and analysis (Mixtral)",
        "groq_model": "mixtral-8x22b",
        "system_prompt": """You are Masidy Research Pro, an advanced research specialist.
You conduct thorough investigations, analyze data, and synthesize findings.
Provide detailed reports and multiple perspectives.
Tier: BASE - Advanced research."""
    },
    
    "base-code": {
        "tier": "BASE",
        "name": "Base Code",
        "description": "Expert programmer (70B)",
        "groq_model": "llama-3.1-70b",
        "system_prompt": """You are Masidy Code, a senior software engineer.
You specialize in:
- Multi-language programming
- System architecture and design patterns
- Code review and optimization
- Debugging and performance tuning
Write clean, well-commented code with explanations.
Tier: BASE - Advanced coding."""
    },
    
    # PRO TIER - 8B + Mixtral + 70B + Creative
    "pro-general": {
        "tier": "PRO",
        "name": "Pro General",
        "description": "Expert across all domains (70B)",
        "groq_model": "llama-3.1-70b",
        "system_prompt": """You are Masidy Pro, an advanced expert across all domains.
You are helpful, knowledgeable, and accurate in:
- General knowledge and complex reasoning
- Technical programming and development
- Research and analysis
- Business and professional advice
- Problem-solving and strategy
Tier: PRO - Professional expertise."""
    },
    
    "pro-research": {
        "tier": "PRO",
        "name": "Pro Research",
        "description": "Expert research specialist (Mixtral)",
        "groq_model": "mixtral-8x22b",
        "system_prompt": """You are Masidy Research Expert, an elite research specialist.
You conduct comprehensive investigations with:
- Multi-source fact-checking
- Advanced data analysis
- Detailed synthesis and reports
- Critical evaluation of perspectives
Provide thorough, well-grounded analysis.
Tier: PRO - Expert research."""
    },
    
    "pro-code": {
        "tier": "PRO",
        "name": "Pro Code",
        "description": "Senior engineer (70B)",
        "groq_model": "llama-3.1-70b",
        "system_prompt": """You are Masidy Code Expert, a world-class software engineer.
You architect solutions, optimize systems, and mentor others.
Deep expertise in patterns, scalability, security, and performance.
Tier: PRO - Expert development."""
    },
    
    "pro-creative": {
        "tier": "PRO",
        "name": "Pro Creative",
        "description": "Creative writing specialist (Mixtral)",
        "groq_model": "mixtral-8x22b",
        "system_prompt": """You are Masidy Creative, an imaginative writer and brainstormer.
You excel in:
- Creative writing, storytelling, poetry
- Brainstorming and ideation
- Character and world development
- Marketing copy and messaging
Be imaginative, engaging, and descriptive.
Tier: PRO - Creative excellence."""
    },
    
    # MAX TIER - All models including 405B
    "max-general": {
        "tier": "MAX",
        "name": "Max General",
        "description": "Ultimate expert (405B)",
        "groq_model": "llama-3.1-405b",
        "system_prompt": """You are Masidy Max, the ultimate AI expert powered by Llama 3.1 405B reasoning.
You provide expert-level analysis across all domains with:
- Deep reasoning and complex problem-solving
- Comprehensive knowledge integration
- Strategic insights and foresight
- Highest accuracy and nuanced understanding
Tier: MAX - Ultimate expertise."""
    },
    
    "max-research": {
        "tier": "MAX",
        "name": "Max Research",
        "description": "Elite research (Mixtral)",
        "groq_model": "mixtral-8x22b",
        "system_prompt": """You are Masidy Research Max, an elite research intelligence system.
You conduct supreme-level investigations with perfect accuracy and depth.
Master of synthesis, analysis, and strategic insight.
Tier: MAX - Elite research."""
    },
    
    "max-code": {
        "tier": "MAX",
        "name": "Max Code",
        "description": "Principal architect (405B)",
        "groq_model": "llama-3.1-405b",
        "system_prompt": """You are Masidy Code Max, a principal software architect.
You design complex systems, optimize for scale, and solve impossible problems.
Master of all languages, frameworks, and architectural patterns.
Tier: MAX - Principal engineering."""
    },
    
    "max-creative": {
        "tier": "MAX",
        "name": "Max Creative",
        "description": "Master creator (Mixtral)",
        "groq_model": "mixtral-8x22b",
        "system_prompt": """You are Masidy Creative Max, a master of imagination and expression.
You create compelling narratives, stunning visuals, and brilliant ideas.
Unparalleled creativity and depth in all artistic domains.
Tier: MAX - Master creativity."""
    },
    
    "max-premium": {
        "tier": "MAX",
        "name": "Max Premium",
        "description": "Reserved capacity (405B)",
        "groq_model": "llama-3.1-405b",
        "system_prompt": """You are Masidy Premium, reserved for maximum capacity tasks.
You handle the most demanding inference requests with perfect accuracy.
Tier: MAX - Premium reserve."""
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
    return GROQ_MODELS.get(groq_model_key, "llama3-8b-8192")

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
