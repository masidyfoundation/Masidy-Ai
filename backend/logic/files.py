"""File upload and analysis"""
import os
import json
from pathlib import Path
import uuid

UPLOAD_DIR = "uploads"

def ensure_upload_dir():
    """Create upload directory if it doesn't exist"""
    os.makedirs(UPLOAD_DIR, exist_ok=True)

async def process_file(file_content: str, filename: str, file_type: str) -> dict:
    """
    Process uploaded file
    Supports: txt, json, csv, py, js, ts, md
    """
    ensure_upload_dir()
    
    file_id = str(uuid.uuid4())[:8]
    
    try:
        if file_type == "json":
            # Parse and validate JSON
            data = json.loads(file_content)
            analysis = {
                "type": "json",
                "keys": list(data.keys()) if isinstance(data, dict) else f"Array with {len(data)} items",
                "size": len(file_content),
                "valid": True
            }
        elif file_type == "csv":
            # Parse CSV
            lines = file_content.split("\n")
            headers = lines[0].split(",") if lines else []
            analysis = {
                "type": "csv",
                "headers": headers,
                "rows": len(lines) - 1,
                "size": len(file_content)
            }
        elif file_type in ["py", "js", "ts"]:
            # Code analysis
            line_count = len(file_content.split("\n"))
            analysis = {
                "type": "code",
                "language": file_type,
                "lines": line_count,
                "size": len(file_content)
            }
        else:
            # Text file
            analysis = {
                "type": "text",
                "lines": len(file_content.split("\n")),
                "words": len(file_content.split()),
                "size": len(file_content)
            }
        
        return {
            "success": True,
            "file_id": file_id,
            "filename": filename,
            "analysis": analysis,
            "preview": file_content[:500]  # First 500 chars
        }
    except Exception as e:
        return {
            "success": False,
            "filename": filename,
            "error": str(e)
        }

async def save_file(file_content: str, filename: str) -> str:
    """Save file and return ID"""
    ensure_upload_dir()
    file_id = str(uuid.uuid4())[:8]
    filepath = os.path.join(UPLOAD_DIR, f"{file_id}_{filename}")
    
    with open(filepath, "w") as f:
        f.write(file_content)
    
    return file_id

async def retrieve_file(file_id: str) -> str:
    """Retrieve saved file content"""
    ensure_upload_dir()
    
    for filename in os.listdir(UPLOAD_DIR):
        if filename.startswith(file_id):
            with open(os.path.join(UPLOAD_DIR, filename), "r") as f:
                return f.read()
    
    return None
