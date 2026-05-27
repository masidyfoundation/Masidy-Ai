import os
from supabase import create_client, Client

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

_client = None

def get_supabase() -> Client:
    global _client
    if _client is None:
        if not SUPABASE_URL or not SUPABASE_KEY:
            raise ValueError("SUPABASE_URL and SUPABASE_KEY must be set in environment variables.")
        _client = create_client(SUPABASE_URL, SUPABASE_KEY)
    return _client

def get_or_create_user(external_id: str) -> dict:
    """
    Looks up user by external_id. If missing, creates and stores a new user record.
    """
    client = get_supabase()
    try:
        # Check if user exists
        response = client.table("users").select("*").eq("external_id", external_id).execute()
        if response.data:
            return response.data[0]
        
        # Insert user if not found
        insert_res = client.table("users").insert({"external_id": external_id}).execute()
        return insert_res.data[0] if insert_res.data else {}
    except Exception as e:
        print(f"[Error in get_or_create_user]: {e}")
        # Return fallback mock/local structure in case of configuration errors
        return {"id": external_id, "external_id": external_id}

def create_conversation(user_id: str, title: str) -> dict:
    """
    Creates a new conversation session associated with the user.
    """
    client = get_supabase()
    try:
         response = client.table("conversations").insert({
             "user_id": user_id,
             "title": title
         }).execute()
         return response.data[0] if response.data else {}
    except Exception as e:
         print(f"[Error in create_conversation]: {e}")
         return {"id": "conv-fallback-id", "user_id": user_id, "title": title}

def add_message(conversation_id: str, role: str, content: str) -> dict:
    """
    Appends a new conversation line to the historical message logs.
    """
    client = get_supabase()
    try:
         response = client.table("messages").insert({
             "conversation_id": conversation_id,
             "role": role,
             "content": content
         }).execute()
         return response.data[0] if response.data else {}
    except Exception as e:
         print(f"[Error in add_message]: {e}")
         return {"id": "msg-fallback-id", "conversation_id": conversation_id, "role": role, "content": content}

def get_history(conversation_id: str, limit: int = 20) -> list:
    """
    Fetches historical lines for a specific conversation sorted chronologically.
    """
    client = get_supabase()
    try:
         response = client.table("messages")\
             .select("*")\
             .eq("conversation_id", conversation_id)\
             .order("created_at")\
             .limit(limit)\
             .execute()
         return response.data if response.data else []
    except Exception as e:
         print(f"[Error in get_history]: {e}")
         return []
