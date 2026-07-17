"""
Email delivery service for Finance India daily watchlist PDF reports.

Uses Resend's HTTP API (via httpx) for reliable email delivery on Render.
SMTP port 587 is blocked on Render's free tier; this approach uses HTTPS
(port 443) which is always allowed.

Credentials are loaded from environment variables — never hardcoded.
"""

import logging
import os
from datetime import datetime
from typing import Optional

import httpx

logger = logging.getLogger(__name__)

# ── Resend API Configuration ─────────────────────────────────────────────────
RESEND_API_URL = "https://api.resend.com/emails"
MAX_RETRIES = 2


def _get_resend_credentials() -> tuple[str, str]:
    """
    Load Resend API key and sender address from environment variables.

    Raises:
        ValueError: If required env vars are not set.
    """
    api_key = os.getenv("RESEND_API_KEY")
    from_email = os.getenv("RESEND_FROM_EMAIL", "Finance India <reports@resend.dev>")

    if not api_key:
        raise ValueError(
            "RESEND_API_KEY must be set in environment variables. "
            "Sign up at https://resend.com and create an API key."
        )

    return api_key, from_email


def _build_email_html(user_name: str, report_date: str, asset_count: int) -> str:
    """
    Build the HTML email body with a brief summary.

    Uses inline styles for email client compatibility. Does not use
    dangerouslySetInnerHTML or any user-controlled content in raw HTML —
    all dynamic values are plain strings (name, date, count).
    """
    return f"""<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0; padding:0; background-color:#060810; font-family:Arial,Helvetica,sans-serif;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:#060810;">
        <tr>
            <td align="center" style="padding:40px 20px;">
                <table role="presentation" width="600" cellspacing="0" cellpadding="0" 
                       style="background-color:#0D1117; border:1px solid #1E2533; border-radius:12px;">
                    
                    <!-- Header -->
                    <tr>
                        <td style="background:linear-gradient(135deg,#3b82f6,#2563eb); padding:30px; 
                                   border-radius:12px 12px 0 0; text-align:center;">
                            <h1 style="margin:0; color:#ffffff; font-size:28px; font-weight:700;">
                                Finance India
                            </h1>
                            <p style="margin:8px 0 0; color:rgba(255,255,255,0.8); font-size:13px;">
                                AI-Powered Market Intelligence
                            </p>
                        </td>
                    </tr>
                    
                    <!-- Body -->
                    <tr>
                        <td style="padding:30px;">
                            <p style="color:#E2E8F0; font-size:16px; margin:0 0 20px;">
                                Hi {user_name},
                            </p>
                            <p style="color:#94A3B8; font-size:14px; line-height:1.6; margin:0 0 20px;">
                                Your daily watchlist report for <strong style="color:#E2E8F0;">{report_date}</strong> 
                                is attached. It covers <strong style="color:#3b82f6;">{asset_count} asset(s)</strong> 
                                with technical indicators, sparkline charts, and an AI market summary.
                            </p>
                            
                            <table role="presentation" width="100%" cellspacing="0" cellpadding="0"
                                   style="background-color:#151A22; border:1px solid #1E2533; border-radius:8px;">
                                <tr>
                                    <td style="padding:16px; text-align:center;">
                                        <p style="color:#94A3B8; font-size:12px; margin:0;">
                                            📎 See attached PDF for your complete report
                                        </p>
                                    </td>
                                </tr>
                            </table>
                            
                            <p style="color:#64748B; font-size:12px; margin:24px 0 0; line-height:1.5;">
                                This report was generated automatically by Finance India. 
                                You can adjust your delivery schedule or disable reports from your dashboard settings.
                            </p>
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td style="padding:20px 30px; border-top:1px solid #1E2533; text-align:center;">
                            <p style="color:#64748B; font-size:11px; margin:0;">
                                Finance India &copy; {datetime.now().year} &bull; AI-Powered Financial Analytics
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>"""


async def send_report_email(
    to_email: str,
    user_name: str,
    pdf_bytes: bytes,
    report_date: Optional[str] = None,
) -> bool:
    """
    Send the daily watchlist report PDF via Resend's HTTP API.

    Uses HTTPS (port 443) instead of SMTP (port 587), which is blocked
    on Render's free tier.

    Args:
        to_email: Recipient email address.
        user_name: Display name of the recipient.
        pdf_bytes: Raw PDF bytes to attach.
        report_date: Date string for the report (defaults to today).

    Returns:
        True if email was sent successfully, False otherwise.
    """
    if report_date is None:
        report_date = datetime.now().strftime("%d %B %Y")

    try:
        api_key, from_email = _get_resend_credentials()
    except ValueError:
        logger.error("Resend credentials not configured — cannot send report email")
        return False

    # Estimate asset count from PDF size (rough heuristic for email body)
    asset_count_estimate = max(1, len(pdf_bytes) // 15000)

    html_body = _build_email_html(user_name, report_date, asset_count_estimate)

    filename = f"FinanceIndia_Report_{datetime.now().strftime('%Y-%m-%d')}.pdf"

    # Resend API payload — attachments are base64-encoded
    import base64
    payload = {
        "from": from_email,
        "to": [to_email],
        "subject": f"Finance India Daily Report — {report_date}",
        "html": html_body,
        "attachments": [
            {
                "filename": filename,
                "content": base64.b64encode(pdf_bytes).decode("utf-8"),
            }
        ],
    }

    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json",
    }

    last_error = None
    for attempt in range(1, MAX_RETRIES + 1):
        try:
            async with httpx.AsyncClient(timeout=30.0) as client:
                response = await client.post(
                    RESEND_API_URL,
                    json=payload,
                    headers=headers,
                )

            if response.status_code in (200, 201):
                logger.info(
                    "Report email sent to %s via Resend (attempt %d), id=%s",
                    to_email,
                    attempt,
                    response.json().get("id", "unknown"),
                )
                return True

            # Non-2xx — log and retry
            last_error = f"HTTP {response.status_code}: {response.text}"
            logger.warning(
                "Resend API error sending to %s (attempt %d/%d): %s",
                to_email, attempt, MAX_RETRIES, last_error,
            )

        except httpx.TimeoutException as e:
            last_error = e
            logger.warning(
                "Timeout sending to %s (attempt %d/%d): %s",
                to_email, attempt, MAX_RETRIES, e,
            )
        except Exception as e:
            last_error = e
            logger.warning(
                "Unexpected error sending to %s (attempt %d/%d): %s",
                to_email, attempt, MAX_RETRIES, e,
            )

    logger.error(
        "Failed to send report email to %s after %d attempts: %s",
        to_email, MAX_RETRIES, last_error,
    )
    return False
