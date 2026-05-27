import time
import json

def generate_telemetry_log(step: str, detail: str, level: str = "INFO") -> str:
    """
    Produces highly structured JSON industrial terminal logs.
    """
    log_record = {
        "timestamp": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
        "level": level,
        "subsystem": "MASIDY_CORE_LOGS",
        "step": step,
        "details": detail
    }
    return json.dumps(log_record)
