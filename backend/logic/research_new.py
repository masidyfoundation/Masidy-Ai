"""Web research using DuckDuckGo API (no auth needed)"""
import httpx
import json

async def search_web(query: str, num_results: int = 5) -> dict:
    """
    Search the web and return results
    Uses DuckDuckGo which requires no API key
    """
    try:
        # DuckDuckGo instant answer API
        url = "https://api.duckduckgo.com/"
        params = {
            "q": query,
            "format": "json",
            "no_redirect": 1,
            "no_html": 1,
            "skip_disambig": 1
        }
        
        async with httpx.AsyncClient() as client:
            response = await client.get(url, params=params, timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                
                results = {
                    "query": query,
                    "success": True,
                    "summary": data.get("AbstractText", ""),
                    "source": data.get("AbstractSource", ""),
                    "url": data.get("AbstractURL", ""),
                    "related": data.get("RelatedTopics", [])[:3]
                }
                
                return results
    except Exception as e:
        print(f"[Research Error]: {e}")
    
    return {
        "query": query,
        "success": False,
        "error": "Failed to retrieve research data"
    }

async def deep_research(query: str) -> dict:
    """Perform deeper research by analyzing the query"""
    web_results = await search_web(query)
    
    return {
        "query": query,
        "research_type": "web_search",
        "results": web_results,
        "timestamp": __import__("datetime").datetime.utcnow().isoformat()
    }
