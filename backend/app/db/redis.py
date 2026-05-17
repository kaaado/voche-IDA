from redis.asyncio import Redis
from app.core.config import settings

redis: Redis | None = None

async def get_redis_client():
    """Helper to ensure redis is connected and typed correctly."""
    if redis is None:
        raise RuntimeError(
            "Redis is not initialized. Did you call connect_redis()?"
        )
    return redis

get_redis = get_redis_client 

async def connect_redis():
    global redis
    redis_url = getattr(settings, "REDIS_URL", None) or getattr(settings, "redis_url", None)
    
    if not redis_url:
        raise ValueError("REDIS_URL is not set in settings")

    redis = Redis.from_url(
        redis_url,
        decode_responses=True,
        retry_on_timeout=True,
        health_check_interval=30
    )
    try:
        await redis.config_set("notify-keyspace-events", "Ex")
    except Exception as e:
        import logging
        logging.getLogger(__name__).warning(
            f"Unable to set notify-keyspace-events (expected behavior on managed Redis/Valkey like Render): {e}"
        )

async def disconnect_redis():
    if redis:
        await redis.aclose()