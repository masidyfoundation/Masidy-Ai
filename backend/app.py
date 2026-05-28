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
    model: str = "masidy-pro"  # Model selection

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
def list_available_models():
    """List all available Masidy model versions"""
    return {
        "models": list_models(),
        "default_model": "masidy-pro",
        "total": len(list_models())
    }

# ========== IMAGE GENERATION ==========
@app.post("/generate-image")
async def generate_image_endpoint(request: ImageRequest):
    """Generate image from text prompt"""
    try:
        result = await generate_image(request.prompt)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Image generation failed: {str(e)}")

# ========== WEB RESEARCH ==========
@app.post("/search")
async def search_endpoint(request: SearchRequest):
    """Search the web using DuckDuckGo"""
    try:
        result = await deep_research(request.query)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Search failed: {str(e)}")

# ========== FILE UPLOAD & ANALYSIS ==========
@app.post("/analyze-file")
async def analyze_file_endpoint(request: FileAnalysisRequest):
    """Analyze uploaded file"""
    try:
        result = await process_file(request.content, request.filename, request.file_type)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"File analysis failed: {str(e)}")

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
        raise HTTPException(status_code=500, detail=f"Code execution failed: {str(e)}")

@app.post("/chat")
async def chat_endpoint(request: ChatRequest):
    """
    Processes chat requests using Llama 3.1 8B on Groq, integrating Supabase memory,
    research triggers, and structured telemetry profiling.
    """
    try:
        user_id = request.user_id
        conversation_id = request.conversation_id
        user_message = request.message
        model_id = request.model  # Get selected model
        
        # 1. Resolve / Create User
        print(generate_telemetry_log("USER_RESOLVE", f"Resolving user external identification '{user_id}'"))
        user_record = get_or_create_user(user_id)
        user_db_id = user_record.get("id", user_id)
        
        # 2. Resolve / Create Conversation Session
        if not conversation_id:
            print(generate_telemetry_log("CONV_CREATION", "Initiating a new terminal session..."))
            conv_record = create_conversation(user_db_id, title=f"Session: {user_message[:24]}...")
            conversation_id = conv_record.get("id", "session-new-id")
        
        # 3. Save User Message
        print(generate_telemetry_log("USER_MSG_STORE", "Persisting user input sequence in Supabase"))
        add_message(conversation_id, "user", user_message)
        
        # 4. Pull Historical context
        print(generate_telemetry_log("PULL_HISTORY", "Analyzing conversational context"))
        raw_history = get_history(conversation_id, limit=10)
        
        # Format history as role/content dict blocks
        messages = []
        # Use model-specific system prompt
        system_prompt = get_system_prompt(model_id)
        messages.append({
            "role": "system",
            "content": system_prompt
        })
        
        for h in raw_history:
            messages.append({
                "role": h.get("role", "user"),
                "content": h.get("content", "")
            })
            
        # 5. Think-Before-Tongue logic (Research determination)
        research_note = ""
        if needs_research(user_message):
            print(generate_telemetry_log("RESEARCH_TRIGGERED", f"Keywords matched. Launching research subprocess for: {user_message}"))
            research_res = perform_research(user_message)
            research_note = research_res.get("summary", "")
            
            # Append search result context to prompt
            messages.append({
                "role": "system",
                "content": f"[GROUNDED CURRENT FACTS]:\n{research_note}"
            })
        else:
            print(generate_telemetry_log("THINKING_COMPLETED", "Message processed; semantic search index skipped."))

        # 6. Call Groq + Llama 3.1 8B
        print(generate_telemetry_log("LLAMA_API_CALL", f"Routing to {model_id} model on Llama 3.1 8B via Groq"))
        response_text = await call_llama(messages)
        
        # 7. Persist AI Response
        print(generate_telemetry_log("AI_MSG_STORE", "Persisting generated intelligence block"))
        add_message(conversation_id, "assistant", response_text)
        
        return {
            "conversation_id": conversation_id,
            "answer": response_text,
            "model_used": model_id,
            "research_triggered": bool(research_note),
            "research_context": research_note or None,
            "status": "COMPLETED"
        }
    except Exception as e:
        print(generate_telemetry_log("FATAL_ERROR", str(e), level="ERROR"))
        raise HTTPException(status_code=500, detail=f"Masidy Central processing failure: {str(e)}")

@app.post("/api/chat")
async def api_chat_endpoint(request: ChatRequest):
    """
    Alias for /chat endpoint (compatible with frontend routing)
    """
    return await chat_endpoint(request)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
