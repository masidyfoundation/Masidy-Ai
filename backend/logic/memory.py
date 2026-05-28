import os
import json
import uuid
from pathlib import Path
from typing import Optional
from datetime import datetime
from supabase import create_client, Client

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

_client = None
_local_db_file = Path(__file__).parent.parent / "local_db.json"

def get_supabase() -> Optional[Client]:
    """Get or create Supabase client."""
    global _client
    if _client is None:
        if SUPABASE_URL and SUPABASE_KEY:
            try:
                _client = create_client(SUPABASE_URL, SUPABASE_KEY)
                print("[INFO] Connected to Supabase successfully")
            except Exception as e:
                print(f"[Warning] Could not connect to Supabase: {e}. Using local fallback.")
                _client = False
    return _client if _client is not False else None

def _load_local_db() -> dict:
    """Load or initialize local JSON database (fallback only)."""
    if _local_db_file.exists():
        try:
            with open(_local_db_file, 'r') as f:
                return json.load(f)
        except:
            pass
    return {"users": [], "conversations": [], "messages": []}

def _save_local_db(db: dict):
    """Save database to JSON file (fallback only)."""
    with open(_local_db_file, 'w') as f:
        json.dump(db, f, indent=2)

def get_or_create_user(external_id: str) -> dict:
    """Looks up user by external_id. Creates if missing. Uses Supabase with local fallback."""
    client = get_supabase()
    
    if client:
        try:
            response = client.table("users").select("*").eq("external_id", external_id).execute()
            if response.data:
                return response.data[0]
            
            new_user = client.table("users").insert({"external_id": external_id}).execute()
            return new_user.data[0] if new_user.data else {"id": str(uuid.uuid4()), "external_id": external_id}
        except Exception as e:
            print(f"[Warning] Supabase error: {e}. Using local fallback.")
    
    db = _load_local_db()
    for user in db["users"]:
        if user["external_id"] == external_id:
            return user
    
    new_user = {"id": f"u-{uuid.uuid4().hex[:8]}", "external_id": external_id, "created_at": datetime.utcnow().isoformat() + "Z", "tier": "Free Standard"}
    db["users"].append(new_user)
    _save_local_db(db)
    return new_user

def create_conversation(user_id: str, title: str) -> dict:
    """Creates a new conversation session. Uses Supabase with local fallback."""
    client = get_supabase()
    
    if client:
        try:
            new_conv = client.table("conversations").insert({"user_id": user_id, "title": title}).execute()
            return new_conv.data[0] if new_conv.data else {"id": str(uuid.uuid4()), "user_id": user_id, "title": title}
        except Exception as e:
            print(f"[Warning] Supabase error: {e}. Using local fallback.")
    
    db = _load_local_db()
    new_conv = {"id": f"conv-{uuid.uuid4().hex[:8]}", "user_id": user_id, "title": title, "created_at": datetime.utcnow().isoformat() + "Z"}
    db["conversations"].append(new_conv)
    _save_local_db(db)
    return new_conv

def add_message(conversation_id: str, role: str, content: str) -> dict:
    """Appends a message to conversation. Uses Supabase with local fallback."""
    client = get_supabase()
    
    if client:
        try:
            new_msg = client.table("messages").insert({"conversation_id": conversation_id, "role": role, "content": content}).execute()
            return new_msg.data[0] if new_msg.data else {"id": str(uuid.uuid4()), "conversation_id": conversation_id, "role": role, "content": content}
        except Exception as e:
            print(f"[Warning] Supabase error: {e}. Using local fallback.")
    
    db = _load_local_db()
    new_msg = {"id": f"msg-{uuid.uuid4().hex[:8]}", "conversation_id": conversation_id, "role": role, "content": content, "created_at": datetime.utcnow().isoformat() + "Z"}
    db["messages"].append(new_msg)
    _save_local_db(db)
    return new_msg

def get_history(conversation_id: str, limit: int = 20) -> list:
    """Fetches message history. Uses Supabase with local fallback."""
    client = get_supabase()
    
    if client:
        try:
            response = client.table("messages").select("*").eq("conversation_id", conversation_id).order("created_at").limit(limit).execute()
            return response.data if response.data else []
        except Exception as e:
            print(f"[Warning] Supabase error: {e}. Using local fallback.")
    
    db = _load_local_db()
    messages = [m for m in db["messages"] if m["conversation_id"] == conversation_id]
    messages.sort(key=lambda x: x.get("created_at", ""))
    return messages[-limit:] if messages else []

def get_or_create_user(external_id: str) -> dict:
    """
    Looks up user by external_id. If missing, creates and stores a new user record.
    Uses local JSON database as fallback.
    """
    db = _load_local_db()
    
    # Check if user exists
    for user in db["users"]:
        if user["external_id"] == external_id:
            return user
    
    # Create new user
    new_user = {
        "id": f"u-{uuid.uuid4().hex[:8]}",
        "external_id": external_id,
        "created_at": datetime.utcnow().isoformat() + "Z",
        "tier": "Free Standard"
    }
    db["users"].append(new_user)
    _save_local_db(db)
    return new_user

def create_conversation(user_id: str, title: str) -> dict:
    """
    Creates a new conversation session associated with the user.
    Uses local JSON database as fallback.
    """
    db = _load_local_db()
    new_conv = {
        "id": f"conv-{uuid.uuid4().hex[:8]}",
        "user_id": user_id,
        "title": title,
        "created_at": datetime.utcnow().isoformat() + "Z"
    }
    db["conversations"].append(new_conv)
    _save_local_db(db)
    return new_conv

def add_message(conversation_id: str, role: str, content: str) -> dict:
    """
    Uses local JSON database as fallback.
    """
    db = _load_local_db()
    new_msg = {
        "id": f"msg-{uuid.uuid4().hex[:8]}",
        "conversation_id": conversation_id,
        "role": role,
        "content": content,
        "created_at": datetime.utcnow().isoformat() + "Z"
    }
    db["messages"].append(new_msg)
    _save_local_db(db)
    return new_msg

def get_history(conversation_id: str, limit: int = 20) -> list:
    """Fetches message history. Uses Supabase with local fallback."""
    client = get_supabase()
    
    if client:
        try:
            response = client.table("messages").select("*").eq("conversation_id", conversation_id).order("created_at").limit(limit).execute()
            return response.data if response.data else []
        except Exception as e:
            print(f"[Warning] Supabase error: {e}. Using local fallback.")
    
    db = _load_local_db()
    messages = [m for m in db["messages"] if m["conversation_id"] == conversation_id]
    messages.sort(key=lambda x: x.get("created_at", ""))
    return messages[-limit:] if messages else []
