import os
import json
import redis.asyncio as redis
from typing import Optional, Any

REDIS_URL = os.getenv("REDIS_URL", "redis://redis:6379/0")

# Create connection pool
redis_pool = redis.ConnectionPool.from_url(REDIS_URL, decode_responses=True)

def get_redis() -> redis.Redis:
    """Get a Redis client from the connection pool"""
    return redis.Redis(connection_pool=redis_pool)

async def get_cache(key: str) -> Optional[Any]:
    """Get a JSON value from cache"""
    client = get_redis()
    try:
        val = await client.get(key)
        if val:
            return json.loads(val)
        return None
    except Exception as e:
        print(f"Redis get error for {key}: {e}")
        return None
    finally:
        await client.aclose()

async def set_cache(key: str, value: Any, expire: int = 300) -> bool:
    """Set a JSON value in cache with expiration (seconds)"""
    client = get_redis()
    try:
        await client.set(key, json.dumps(value), ex=expire)
        return True
    except Exception as e:
        print(f"Redis set error for {key}: {e}")
        return False
    finally:
        await client.aclose()
