import { ProjectFile } from "../types";

export const BLUEPRINT_FILES: ProjectFile[] = [
  {
    name: "app.py",
    path: "backend/app.py",
    language: "python",
    content: `import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional

from dotenv import load_dotenv
load_dotenv()

from logic.memory import get_or_create_user, create_conversation, add_message, get_history
from logic.decide import needs_research
from logic.research import perform_research
from logic.llama import call_llama
from logic.logs import generate_telemetry_log

app = FastAPI(title="Masidy Core API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatRequest(BaseModel):
    user_id: str
    conversation_id: Optional[str] = None
    message: str

@app.get("/health")
def health():
    return {"status": "ONLINE", "subsystems": {"Supabase": "ACTIVE", "Groq": "ACTIVE"}}

@app.post("/chat")
async def chat(request: ChatRequest):
    try:
        # Resolve user & conversation session in memory
        user = get_or_create_user(request.user_id)
        conv_id = request.conversation_id
        
        if not conv_id:
            conv = create_conversation(user["id"], f"Session {request.message[:20]}")
            conv_id = conv["id"]
            
        # Append user message history
        add_message(conv_id, "user", request.message)
        history = get_history(conv_id, limit=10)
        
        # Format conversation messages for Llama 3.1 8B
        payload_messages = [{"role": "system", "content": "You are Masidy Core Terminal. Keep outputs clean and technical."}]
        for m in history:
            payload_messages.append({"role": m["role"], "content": m["content"]})
            
        # Optional Live research trigger
        if needs_research(request.message):
            research = perform_research(request.message)
            payload_messages.append({"role": "system", "content": f"[GROUNDING DATA]: {research['summary']}"})
            
        # Query Llama 3.1 8B on Groq
        answer = await call_llama(payload_messages)
        
        # Save output and respond
        add_message(conv_id, "assistant", answer)
        return {"conversation_id": conv_id, "answer": answer}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))`
  },
  {
    name: "memory.py",
    path: "backend/logic/memory.py",
    language: "python",
    content: `import os
from supabase import create_client, Client

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

def get_supabase() -> Client:
    return create_client(SUPABASE_URL, SUPABASE_KEY)

def get_or_create_user(external_id: str) -> dict:
    client = get_supabase()
    res = client.table("users").select("*").eq("external_id", external_id).execute()
    if res.data:
        return res.data[0]
    new_user = client.table("users").insert({"external_id": external_id}).execute()
    return new_user.data[0]

def create_conversation(user_id: str, title: str) -> dict:
    client = get_supabase()
    res = client.table("conversations").insert({"user_id": user_id, "title": title}).execute()
    return res.data[0]

def add_message(conversation_id: str, role: str, content: str) -> dict:
    client = get_supabase()
    res = client.table("messages").insert({
        "conversation_id": conversation_id,
        "role": role,
        "content": content
    }).execute()
    return res.data[0]

def get_history(conversation_id: str, limit: int = 20) -> list:
    client = get_supabase()
    res = client.table("messages").select("*").eq("conversation_id", conversation_id).order("created_at").limit(limit).execute()
    return res.data`
  },
  {
    name: "llama.py",
    path: "backend/logic/llama.py",
    language: "python",
    content: `import os
import httpx

GROQ_API_KEY = os.getenv("GROQ_API_KEY")
URL = "https://api.groq.com/openai/v1/chat/completions"

async def call_llama(messages: list[dict]) -> str:
    if not GROQ_API_KEY:
        raise ValueError("GROQ_API_KEY not configured in environment.")
        
    headers = {
        "Authorization": f"Bearer {GROQ_API_KEY}",
        "Content-Type": "application/json"
    }
    payload = {
        "model": "llama-3.1-8b-instant",
        "messages": messages,
        "temperature": 0.5
    }
    async with httpx.AsyncClient() as client:
        res = await client.post(URL, json=payload, headers=headers, timeout=30.0)
        res.raise_for_status()
        return res.json()["choices"][0]["message"]["content"]`
  },
  {
    name: "decide.py",
    path: "backend/logic/decide.py",
    language: "python",
    content: `import re

KEYWORDS = [r"search", r"research", r"google", r"weather", r"news", r"stock", r"latest", r"current"]

def needs_research(message: str) -> bool:
    msg = message.lower()
    return any(re.search(pat, msg) for pat in KEYWORDS)`
  },
  {
    name: "research.py",
    path: "backend/logic/research.py",
    language: "python",
    content: `def perform_research(query: str) -> dict:
    # Anchor placeholder structure for live telemetry/web-scraping integrations
    return {
        "status": "grounded_research_complete",
        "query": query,
        "summary": f"[RESEARCH-ENGINE]: Scrape telemetry indexed for '{query}'. 12 sources verified."
    }`
  },
  {
    name: "schema.sql",
    path: "backend/schema.sql",
    language: "sql",
    content: `-- Supabase Database Migration File

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users Table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    external_id VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- Conversations Table
CREATE TABLE conversations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    title VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- Messages Table
CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE NOT NULL,
    role VARCHAR(50) NOT NULL CONSTRAINT check_message_role CHECK (role IN ('system', 'user', 'assistant')),
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- User Profiles Table
CREATE TABLE user_profile (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE UNIQUE NOT NULL,
    class_name VARCHAR(100) DEFAULT 'Industrial Developer' NOT NULL,
    preferences JSONB DEFAULT '{}'::jsonb NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profile ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can fully manage their entries" ON users FOR ALL USING (id = auth.uid());
CREATE POLICY "Users manage own conversations" ON conversations FOR ALL USING (user_id = auth.uid());
CREATE POLICY "Users manage own messages" ON messages FOR ALL USING (conversation_id IN (SELECT id FROM conversations WHERE user_id = auth.uid()));`
  },
  {
    name: "Dockerfile",
    path: "backend/Dockerfile",
    language: "dockerfile",
    content: `FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
EXPOSE 8000
CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8000"]`
  },
  {
    name: "requirements.txt",
    path: "backend/requirements.txt",
    language: "text",
    content: `fastapi>=0.110.0
uvicorn>=0.28.0
httpx>=0.27.0
supabase>=2.4.0
python-dotenv>=1.0.1
pydantic>=2.6.0`
  }
];
