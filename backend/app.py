import os
from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional

# Setup environmental paths
from dotenv import load_dotenv
load_dotenv()

from logic.memory import get_or_create_user, create_conversation, add_message, get_history
from logic.decide import needs_research
from logic.research import perform_research
from logic.llama import call_llama
from logic.logs import generate_telemetry_log
from logic.profile import get_user_profile

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
        # Inject standard industrial terminal system guidance
        messages.append({
            "role": "system",
            "content": (
                "You are Masidy Core (Industrial Terminal Brain). You communicate in a sharp, clear, titanium-style "
                "intellect structure. Style your answers naturally without emoji bloat or robotic greetings. "
                "Keep response elements technical yet human-aligned. You use monospace elements where relevant."
            )
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
        print(generate_telemetry_log("LLAMA_API_CALL", "Routing final analytical stack to Llama 3.1 8B on Groq"))
        response_text = await call_llama(messages)
        
        # 7. Persist AI Response
        print(generate_telemetry_log("AI_MSG_STORE", "Persisting generated intelligence block"))
        add_message(conversation_id, "assistant", response_text)
        
        return {
            "conversation_id": conversation_id,
            "answer": response_text,
            "research_triggered": bool(research_note),
            "research_context": research_note or None,
            "status": "COMPLETED"
        }
    except Exception as e:
        print(generate_telemetry_log("FATAL_ERROR", str(e), level="ERROR"))
        raise HTTPException(status_code=500, detail=f"Masidy Central processing failure: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
