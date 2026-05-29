"""Real web research using Tavily API (free tier) with DuckDuckGo fallback"""
import os
import httpx
import json
import datetime

TAVILY_API_KEY = os.getenv("TAVILY_API_KEY", "")


async def search_tavily(query: str, depth: str = "basic") -> list:
    """Search using Tavily API — returns real web results with content."""
    if not TAVILY_API_KEY:
        return []
    try:
        async with httpx.AsyncClient(timeout=30.0) as client:
            resp = await client.post(
                "https://api.tavily.com/search",
                json={
                    "api_key": TAVILY_API_KEY,
                    "query": query,
                    "search_depth": depth,  # "basic" or "advanced"
                    "include_answer": True,
                    "include_raw_content": False,
                    "max_results": 8,
                },
            )
            if resp.status_code == 200:
                data = resp.json()
                results = []
                for r in data.get("results", []):
                    results.append({
                        "title": r.get("title", ""),
                        "url": r.get("url", ""),
                        "content": r.get("content", ""),
                        "score": r.get("score", 0),
                    })
                return results
    except Exception as e:
        print(f"[Tavily Error]: {e}")
    return []


async def search_duckduckgo(query: str) -> list:
    """DuckDuckGo Instant Answer API — free, no key needed."""
    try:
        async with httpx.AsyncClient(timeout=15.0) as client:
            resp = await client.get(
                "https://api.duckduckgo.com/",
                params={
                    "q": query,
                    "format": "json",
                    "no_redirect": 1,
                    "no_html": 1,
                    "skip_disambig": 1,
                },
            )
            if resp.status_code == 200:
                data = resp.json()
                results = []

                # Main abstract
                if data.get("AbstractText"):
                    results.append({
                        "title": data.get("Heading", query),
                        "url": data.get("AbstractURL", ""),
                        "content": data.get("AbstractText", ""),
                        "source": data.get("AbstractSource", ""),
                    })

                # Related topics
                for topic in data.get("RelatedTopics", [])[:5]:
                    if isinstance(topic, dict) and topic.get("Text"):
                        results.append({
                            "title": topic.get("Text", "")[:80],
                            "url": topic.get("FirstURL", ""),
                            "content": topic.get("Text", ""),
                            "source": "DuckDuckGo",
                        })

                return results
    except Exception as e:
        print(f"[DuckDuckGo Error]: {e}")
    return []


async def deep_research(query: str, depth: str = "Thorough") -> dict:
    """
    Perform real web research using Tavily (if key available) or DuckDuckGo.
    Returns structured results with sources for the AI to synthesize.
    """
    tavily_depth = "advanced" if depth == "Exhaustive" else "basic"

    # Try Tavily first (better results)
    results = await search_tavily(query, tavily_depth)

    # Fall back to DuckDuckGo if no Tavily key or no results
    if not results:
        results = await search_duckduckgo(query)

    return {
        "query": query,
        "depth": depth,
        "results": results,
        "result_count": len(results),
        "has_results": len(results) > 0,
        "timestamp": datetime.datetime.utcnow().isoformat(),
        "provider": "Tavily" if TAVILY_API_KEY and results else "DuckDuckGo",
    }
