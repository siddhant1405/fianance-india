"""
Report scheduler service for FinPulse.

Manages per-user APScheduler cron jobs that generate and email
daily watchlist PDF reports on weekdays at each user's chosen time.
"""

import logging
from datetime import datetime, time as dt_time
from typing import Any, Callable, Dict, List, Optional

from apscheduler.schedulers.asyncio import AsyncIOScheduler
from apscheduler.triggers.cron import CronTrigger
from apscheduler.triggers.interval import IntervalTrigger

logger = logging.getLogger(__name__)

# ── Module-level scheduler instance ──────────────────────────────────────────
_scheduler: Optional[AsyncIOScheduler] = None


def get_scheduler() -> AsyncIOScheduler:
    """Get or create the global AsyncIOScheduler instance."""
    global _scheduler
    if _scheduler is None:
        _scheduler = AsyncIOScheduler(
            job_defaults={
                "coalesce": True,          # Merge missed runs into one
                "max_instances": 1,        # Prevent parallel runs per user
                "misfire_grace_time": 3600, # Allow up to 1h late execution
            },
        )
    return _scheduler


def start_scheduler() -> None:
    """Start the scheduler if not already running."""
    scheduler = get_scheduler()
    if not scheduler.running:
        scheduler.start()
        logger.info("Report scheduler started")


def shutdown_scheduler() -> None:
    """Gracefully shut down the scheduler."""
    global _scheduler
    if _scheduler and _scheduler.running:
        _scheduler.shutdown(wait=False)
        logger.info("Report scheduler shut down")
    _scheduler = None


def _make_job_id(user_id: int) -> str:
    """Generate a deterministic job ID for a user's report schedule."""
    return f"report_user_{user_id}"


def schedule_user_report(
    user_id: int,
    delivery_time: dt_time,
    job_func: Callable,
    **job_kwargs: Any,
) -> bool:
    """
    Schedule or reschedule a user's daily weekday report job.

    Args:
        user_id: The user's database ID.
        delivery_time: Time of day (IST) to deliver the report.
        job_func: Async function to call when the job fires.
                  Expected signature: job_func(user_id=int)
        **job_kwargs: Additional keyword arguments passed to job_func.

    Returns:
        True if the job was scheduled successfully.
    """
    scheduler = get_scheduler()
    job_id = _make_job_id(user_id)

    # Build weekday-only cron trigger at the specified time (IST)
    trigger = CronTrigger(
        day_of_week="mon-fri",
        hour=delivery_time.hour,
        minute=delivery_time.minute,
        timezone="Asia/Kolkata",
    )

    # Remove existing job if present (reschedule scenario)
    existing = scheduler.get_job(job_id)
    if existing:
        scheduler.remove_job(job_id)
        logger.info("Removed existing report job for user %d", user_id)

    scheduler.add_job(
        job_func,
        trigger=trigger,
        id=job_id,
        name=f"Daily report for user {user_id}",
        kwargs={"user_id": user_id, **job_kwargs},
        replace_existing=True,
    )

    logger.info(
        "Scheduled report for user %d at %s IST (weekdays only)",
        user_id,
        delivery_time.strftime("%H:%M"),
    )
    return True


def unschedule_user_report(user_id: int) -> bool:
    """
    Remove a user's scheduled report job.

    Args:
        user_id: The user's database ID.

    Returns:
        True if a job was found and removed, False if no job existed.
    """
    scheduler = get_scheduler()
    job_id = _make_job_id(user_id)

    existing = scheduler.get_job(job_id)
    if existing:
        scheduler.remove_job(job_id)
        logger.info("Unscheduled report for user %d", user_id)
        return True

    logger.debug("No scheduled report found for user %d", user_id)
    return False


def get_user_job_info(user_id: int) -> Optional[Dict[str, Any]]:
    """
    Get info about a user's scheduled report job.

    Returns:
        Dict with job details or None if no job is scheduled.
    """
    scheduler = get_scheduler()
    job_id = _make_job_id(user_id)

    job = scheduler.get_job(job_id)
    if not job:
        return None

    next_run = job.next_run_time
    return {
        "job_id": job_id,
        "next_run_time": next_run.isoformat() if next_run else None,
        "is_active": job.next_run_time is not None,
    }


def load_all_schedules(
    report_preferences: List[Dict[str, Any]],
    job_func: Callable,
) -> int:
    """
    Bulk-load all enabled report schedules on app startup.

    Args:
        report_preferences: List of dicts with keys:
            user_id (int), delivery_time (time), is_enabled (bool).
        job_func: Async function to call for each report job.

    Returns:
        Number of jobs successfully scheduled.
    """
    count = 0
    for pref in report_preferences:
        if not pref.get("is_enabled", False):
            continue

        user_id = pref.get("user_id")
        delivery_time = pref.get("delivery_time")

        if user_id is None or delivery_time is None:
            logger.warning("Skipping invalid report preference: %s", pref)
            continue

        # Convert string time to dt_time if needed
        if isinstance(delivery_time, str):
            try:
                delivery_time = dt_time.fromisoformat(delivery_time)
            except ValueError:
                logger.warning("Invalid delivery_time '%s' for user %d", delivery_time, user_id)
                continue

        try:
            schedule_user_report(user_id, delivery_time, job_func)
            count += 1
        except Exception:
            logger.error("Failed to schedule report for user %d", user_id, exc_info=True)

    logger.info("Loaded %d report schedules on startup", count)
    return count

def schedule_price_ingestion(job_func: Callable) -> bool:
    """
    Schedule a background job to run every 30 minutes for price ingestion.
    """
    scheduler = get_scheduler()
    job_id = "price_ingestion_job"
    
    existing = scheduler.get_job(job_id)
    if existing:
        scheduler.remove_job(job_id)
        
    scheduler.add_job(
        job_func,
        trigger=IntervalTrigger(minutes=30),
        id=job_id,
        name="Price Ingestion Job",
        replace_existing=True,
    )
    
    logger.info("Scheduled price ingestion job every 30 minutes")
    return True
