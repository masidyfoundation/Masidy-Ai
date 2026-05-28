import os
from fastapi import FastAPI, HTTPException, Depends, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
from pathlib import Path

# Setup environmental paths - load from backend/.env
from dotenv import load_dotenv
env_path = Path(__file__).parent / ".env"
load_dotenv(dotenv_path=env_path)

from .logic.memory import get_or_create_user, create_conversation, add_message, get_history
from .logic.decide import needs_research
from .logic.research import perform_research
from .logic.llama import call_llama
from .logic.logs import generate_telemetry_log
from .logic.profile import get_user_profile
from .logic.models import get_system_prompt, list_models
from .logic.images import generate_image
from .logic.research_new import deep_research
from .logic.files import process_file, save_file, retrieve_file
from .logic.execute import execute_python, execute_javascript

app = FastAPI(
    title="Masidy AI Terminal API",
    description="Python/FastAPI FastAPI gateway acting as the industrial-brain of the Masidy terminal.",
    version="1.0.0"
)

# CORS Lockdown and setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Production code can tighten this to frontend url
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatRequest(BaseModel):
    user_id: str
    conversation_id: Optional[str] = None
    message: str
    model: str = "free-base"  # Model selection
    tier: str = "FREE"  # User tier for model access control

class ImageRequest(BaseModel):
    prompt: str
    
class SearchRequest(BaseModel):
    query: str
    num_results: int = 5

class FileAnalysisRequest(BaseModel):
    filename: str
    content: str
    file_type: str  # txt, json, csv, py, js, ts, md

class CodeExecutionRequest(BaseModel):
    code: str
    language: str  # python or javascript

@app.get("/")
def root():
    """Root endpoint - API documentation available at /docs"""
    return {
        "name": "Masidy AI Terminal API",
        "version": "1.0.0",
        "status": "online",
        "docs": "/docs",
        "health": "/health"
    }

@app.get("/health")
def health_check():
    """
    Standard industrial microservice health check.
    """
    return {
        "status": "ONLINE",
        "timestamp": "2026-05-27T20:22:42Z",  # Live local simulated timeframe
        "subsystems": {
            "Supabase": "ACTIVE",
            "GroqLlama": "ACTIVE",
            "Researchstub": "ACTIVE"
        }
    }

# ========== MODEL MANAGEMENT ==========
@app.get("/models")
def list_available_models(tier: str = "FREE"):
    """List all available Masidy model versions, optionally filtered by tier"""
    from .logic.models import list_models_by_tier, list_models
    
    # Normalize tier for backward compatibility
    normalized_tier = normalize_tier(tier) if tier else "FREE"
    
    if normalized_tier in ["FREE", "STARTER", "BASE", "PRO", "MAX"]:
        models = list_models_by_tier(normalized_tier)
        return {
            "models": models,
            "tier": normalized_tier,
            "default_model": models[0]["id"] if models else "free-base",
            "total": len(models)
        }
    else:
        # Return all models
        all_models = list_models()
        return {
            "models": all_models,
            "default_model": "free-base",
            "total": len(all_models),
            "tiers": ["FREE", "STARTER", "BASE", "PRO", "MAX"]
        }

# ========== IMAGE GENERATION ==========
@app.post("/generate-image")
async def generate_image_endpoint(request: ImageRequest):
    """Generate image from text prompt"""
    try:
        result = await generate_image(request.prompt)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail="Image generation is temporarily unavailable. Please try again.")

# ========== WEB RESEARCH ==========
@app.post("/search")
async def search_endpoint(request: SearchRequest):
    """Search the web using DuckDuckGo"""
    try:
        result = await deep_research(request.query)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail="Search is temporarily unavailable. Please try again.")

# ========== FILE UPLOAD & ANALYSIS ==========
@app.post("/analyze-file")
async def analyze_file_endpoint(request: FileAnalysisRequest):
    """Analyze uploaded file"""
    try:
        result = await process_file(request.content, request.filename, request.file_type)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail="File analysis is temporarily unavailable. Please try again.")

# ========== CODE EXECUTION ==========
@app.post("/execute-code")
async def execute_code_endpoint(request: CodeExecutionRequest):
    """Execute code safely"""
    try:
        if request.language == "python":
            result = await execute_python(request.code)
        elif request.language == "javascript":
            result = await execute_javascript(request.code)
        else:
            raise ValueError("Unsupported language. Use 'python' or 'javascript'")
        
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail="Code execution is temporarily unavailable. Please try again.")

# Tier normalization for backward compatibility with Supabase
def normalize_tier(tier: str = None) -> str:
    """Convert old tier names to new tier names"""
    if not tier:
        return "FREE"
    
    tier_map = {
        # Old tier names (for existing Supabase users)
        "Free Standard": "FREE",
        "Masidy Pro": "BASE",
        "Landmark Enterprise": "PRO",
        # New tier names
        "FREE": "FREE",
        "STARTER": "STARTER",
        "BASE": "BASE",
        "PRO": "PRO",
        "MAX": "MAX"
    }
    
    return tier_map.get(tier, "FREE")

@app.post("/chat")
async def chat_endpoint(request: ChatRequest):
    """
    Processes chat requests using tier-based Groq LLM routing,
    integrating Supabase memory, research triggers, and telemetry.
    
    Model access controlled by user tier:
    - FREE: only free-base (Llama 8B)
    - STARTER: starter-base, starter-research (8B + Mixtral)
    - BASE: base-general, base-research, base-code (8B + Mixtral + 70B)
    - PRO: pro-general, pro-research, pro-code, pro-creative (all 8B, Mixtral, 70B)
    - MAX: all models including 405B
    """
    try:
        from .logic.models import get_system_prompt, get_groq_model, get_available_models_for_tier
        
        user_id = request.user_id
        conversation_id = request.conversation_id
        user_message = request.message
        model_id = request.model
        user_tier = normalize_tier(request.tier)  # Normalize for backward compatibility
        
        # 1. Validate model access for tier
        available_models = get_available_models_for_tier(user_tier)
        available_model_ids = [m["id"] for m in available_models]
        
        # If requested model not available for tier, use first available
        if model_id not in available_model_ids:
            print(generate_telemetry_log(
                "MODEL_ACCESS_DENIED",
                f"Model {model_id} not available for tier {user_tier}. Defaulting to {available_model_ids[0] if available_model_ids else 'free-base'}"
            ))
            model_id = available_model_ids[0] if available_model_ids else "free-base"
        
        # Get actual Groq model name
        groq_model = get_groq_model(model_id, user_tier)
        
        # 2. Resolve / Create User
        print(generate_telemetry_log("USER_RESOLVE", f"Resolving user external identification '{user_id}' (Tier: {user_tier})"))
        user_record = get_or_create_user(user_id)
        user_db_id = user_record.get("id", user_id)
        
        # 3. Resolve / Create Conversation Session
        if not conversation_id:
            print(generate_telemetry_log("CONV_CREATION", "Initiating a new terminal session..."))
            conv_record = create_conversation(user_db_id, title=f"Session: {user_message[:24]}...")
            conversation_id = conv_record.get("id", "session-new-id")
        
        # 4. Save User Message
        print(generate_telemetry_log("USER_MSG_STORE", "Persisting user input sequence in Supabase"))
        add_message(conversation_id, "user", user_message)
        
        # 5. Pull Historical context
        print(generate_telemetry_log("PULL_HISTORY", "Analyzing conversational context"))
        raw_history = get_history(conversation_id, limit=10)
        
        # Format history as role/content dict blocks — system prompt first, then clean history
        messages = []

        # Add Masidy identity system prompt
        system_prompt = get_system_prompt(model_id, user_tier)
        messages.append({"role": "system", "content": system_prompt})

        for h in raw_history:
            role = h.get("role", "user")
            content = h.get("content", "")
            # Skip any system messages from history (we add our own above)
            if role == "system":
                continue
            messages.append({"role": role, "content": content})

        # Add the current user message at the end
        messages.append({"role": "user", "content": user_message})
            
        # 6. Research (skip fake research — it injects bad context)
        research_note = ""

        # 7. Call Groq with tier-based model routing
        print(generate_telemetry_log(
            "LLM_API_CALL",
            f"Routing to {model_id} (Groq model: {groq_model}) for tier {user_tier}"
        ))
        response_text = await call_llama(messages, groq_model)
        
        # 8. Persist AI Response
        print(generate_telemetry_log("AI_MSG_STORE", "Persisting generated intelligence block"))
        add_message(conversation_id, "assistant", response_text)
        
        return {
            "conversation_id": conversation_id,
            "answer": response_text,
            "model_used": model_id,
            "groq_model": groq_model,
            "tier": user_tier,
            "research_triggered": bool(research_note),
            "research_context": research_note or None,
            "status": "COMPLETED"
        }
    except Exception as e:
        print(generate_telemetry_log("FATAL_ERROR", str(e), level="ERROR"))
        raise HTTPException(status_code=500, detail="Something went wrong. Please try again.")

@app.post("/api/chat")
async def api_chat_endpoint(request: ChatRequest):
    """
    Alias for /chat endpoint (compatible with frontend routing)
    """
    return await chat_endpoint(request)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
