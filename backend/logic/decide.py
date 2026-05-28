import re

RESEARCH_KEYWORDS = [
    r"\bsearch\b", r"\bresearch\b", r"\bgoogle\b", r"\bweb\b", r"\bcurrent\b",
    r"\brecent\b", r"\bweather\b", r"\bnews\b", r"\bprice\b", r"\bstock\b",
    r"\bwho is\b", r"\bwhat is the latest\b", r"\bupcoming\b", r"\bhow many\b"
]

def needs_research(message: str) -> bool:
    """
    Decides if the incoming prompt demands research actions.
    Performs a deterministic regex check for keywords related to live queries.
    """
    msg_lower = message.lower()
    for pattern in RESEARCH_KEYWORDS:
        if re.search(pattern, msg_lower):
            return True
    return False
