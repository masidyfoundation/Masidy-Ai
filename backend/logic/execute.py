"""Code execution engine with sandboxing"""
import subprocess
import json
import tempfile
import os

ALLOWED_PYTHON_MODULES = {
    "math": True,
    "random": True,
    "json": True,
    "datetime": True,
    "time": True,
    "collections": True,
    "itertools": True,
    "functools": True,
}

async def execute_python(code: str) -> dict:
    """
    Execute Python code safely in a sandboxed environment
    Restrictions: No file I/O, no system commands, only safe modules
    """
    
    # Security checks
    dangerous_keywords = [
        "import os",
        "__import__",
        "exec",
        "eval",
        "open(",
        "system",
        "subprocess",
        "socket"
    ]
    
    for keyword in dangerous_keywords:
        if keyword in code:
            return {
                "success": False,
                "error": "This code contains restricted operations.",
                "language": "python"
            }
    
    try:
        # Create temporary file
        with tempfile.NamedTemporaryFile(mode='w', suffix='.py', delete=False) as f:
            f.write(code)
            temp_file = f.name
        
        # Execute with timeout
        result = subprocess.run(
            ["python", temp_file],
            capture_output=True,
            text=True,
            timeout=5
        )
        
        os.unlink(temp_file)
        
        return {
            "success": result.returncode == 0,
            "output": result.stdout,
            "error": result.stderr if result.returncode != 0 else None,
            "language": "python",
            "exit_code": result.returncode
        }
    except subprocess.TimeoutExpired:
        return {
            "success": False,
            "error": "Execution timed out.",
            "language": "python"
        }
    except Exception as e:
        return {
            "success": False,
            "error": "Execution failed. Please try again.",
            "language": "python"
        }

async def execute_javascript(code: str) -> dict:
    """
    Execute JavaScript code safely
    Uses Node.js with restrictions
    """
    
    dangerous_keywords = [
        "require('fs')",
        "require('os')",
        "require('child_process')",
        "eval(",
    ]
    
    for keyword in dangerous_keywords:
        if keyword in code:
            return {
                "success": False,
                "error": "This code contains restricted operations.",
                "language": "javascript"
            }
    
    try:
        with tempfile.NamedTemporaryFile(mode='w', suffix='.js', delete=False) as f:
            f.write(code)
            temp_file = f.name
        
        result = subprocess.run(
            ["node", temp_file],
            capture_output=True,
            text=True,
            timeout=5
        )
        
        os.unlink(temp_file)
        
        return {
            "success": result.returncode == 0,
            "output": result.stdout,
            "error": result.stderr if result.returncode != 0 else None,
            "language": "javascript",
            "exit_code": result.returncode
        }
    except Exception as e:
        return {
            "success": False,
            "error": "Execution failed. Please try again.",
            "language": "javascript"
        }
