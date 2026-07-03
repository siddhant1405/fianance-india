"""
PDF report generator for Finance India daily watchlist reports.

Uses ReportLab for PDF layout and Matplotlib for embedded sparkline charts.
All rendering is done in-memory (BytesIO) — no disk I/O required.
"""

import io
import logging
from datetime import datetime
from typing import Any, Dict, List, Optional

import matplotlib
matplotlib.use("Agg")  # Non-interactive backend — safe for server-side rendering
import matplotlib.pyplot as plt
import matplotlib.dates as mdates

from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_RIGHT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import cm, mm
from reportlab.platypus import (
    BaseDocTemplate,
    Frame,
    Image,
    PageBreak,
    PageTemplate,
    Paragraph,
    SimpleDocTemplate,
    Spacer,
    Table,
    TableStyle,
)

logger = logging.getLogger(__name__)

# ── Brand Colors ──────────────────────────────────────────────────────────────
BRAND_BLUE = colors.HexColor("#3b82f6")
BRAND_DARK = colors.HexColor("#060810")
BRAND_CARD = colors.HexColor("#0D1117")
BRAND_BORDER = colors.HexColor("#1E2533")
BRAND_TEXT = colors.HexColor("#E2E8F0")
BRAND_MUTED = colors.HexColor("#94A3B8")
BRAND_GREEN = colors.HexColor("#10b981")
BRAND_RED = colors.HexColor("#ef4444")
BRAND_ELEVATED = colors.HexColor("#151A22")
WHITE = colors.white


# ── Sparkline Rendering ──────────────────────────────────────────────────────
def _render_sparkline(
    dates: List[str],
    values: List[float],
    width_inches: float = 3.2,
    height_inches: float = 0.9,
) -> io.BytesIO:
    """
    Render a 7-day sparkline chart as a PNG image into a BytesIO buffer.

    Args:
        dates: List of date strings (YYYY-MM-DD).
        values: Corresponding price values.
        width_inches: Chart width.
        height_inches: Chart height.

    Returns:
        BytesIO buffer containing the PNG image.
    """
    fig, ax = plt.subplots(figsize=(width_inches, height_inches))
    fig.patch.set_facecolor("#0D1117")
    ax.set_facecolor("#0D1117")

    # Determine trend color
    if len(values) >= 2:
        line_color = "#10b981" if values[-1] >= values[0] else "#ef4444"
    else:
        line_color = "#3b82f6"

    ax.plot(range(len(values)), values, color=line_color, linewidth=1.5, antialiased=True)
    ax.fill_between(
        range(len(values)),
        values,
        min(values) if values else 0,
        alpha=0.15,
        color=line_color,
    )

    # Remove all axes / ticks for a clean sparkline look
    ax.set_xticks([])
    ax.set_yticks([])
    for spine in ax.spines.values():
        spine.set_visible(False)

    plt.subplots_adjust(left=0, right=1, top=1, bottom=0)

    buf = io.BytesIO()
    fig.savefig(buf, format="png", dpi=150, bbox_inches="tight", pad_inches=0.02,
                facecolor=fig.get_facecolor(), edgecolor="none")
    plt.close(fig)
    buf.seek(0)
    return buf


# ── Styles ────────────────────────────────────────────────────────────────────
def _build_styles() -> Dict[str, ParagraphStyle]:
    """Build custom paragraph styles for the PDF."""
    base = getSampleStyleSheet()
    return {
        "title": ParagraphStyle(
            "Finance IndiaTitle",
            parent=base["Title"],
            fontName="Helvetica-Bold",
            fontSize=22,
            textColor=WHITE,
            alignment=TA_CENTER,
            spaceAfter=4 * mm,
        ),
        "subtitle": ParagraphStyle(
            "Finance IndiaSubtitle",
            parent=base["Normal"],
            fontName="Helvetica",
            fontSize=10,
            textColor=BRAND_MUTED,
            alignment=TA_CENTER,
            spaceAfter=8 * mm,
        ),
        "section_header": ParagraphStyle(
            "SectionHeader",
            parent=base["Heading2"],
            fontName="Helvetica-Bold",
            fontSize=14,
            textColor=BRAND_BLUE,
            spaceBefore=6 * mm,
            spaceAfter=3 * mm,
        ),
        "asset_name": ParagraphStyle(
            "AssetName",
            parent=base["Normal"],
            fontName="Helvetica-Bold",
            fontSize=12,
            textColor=WHITE,
        ),
        "body": ParagraphStyle(
            "Finance IndiaBody",
            parent=base["Normal"],
            fontName="Helvetica",
            fontSize=9,
            textColor=BRAND_TEXT,
            leading=13,
        ),
        "body_muted": ParagraphStyle(
            "Finance IndiaBodyMuted",
            parent=base["Normal"],
            fontName="Helvetica",
            fontSize=8,
            textColor=BRAND_MUTED,
            leading=11,
        ),
        "price_positive": ParagraphStyle(
            "PricePositive",
            parent=base["Normal"],
            fontName="Helvetica-Bold",
            fontSize=11,
            textColor=BRAND_GREEN,
        ),
        "price_negative": ParagraphStyle(
            "PriceNegative",
            parent=base["Normal"],
            fontName="Helvetica-Bold",
            fontSize=11,
            textColor=BRAND_RED,
        ),
        "footer": ParagraphStyle(
            "Footer",
            parent=base["Normal"],
            fontName="Helvetica",
            fontSize=7,
            textColor=BRAND_MUTED,
            alignment=TA_CENTER,
        ),
    }


# ── Page Background ──────────────────────────────────────────────────────────
def _draw_page_background(canvas, doc):
    """Draw the dark background and page footer on every page."""
    canvas.saveState()
    canvas.setFillColor(BRAND_DARK)
    canvas.rect(0, 0, A4[0], A4[1], fill=True, stroke=False)

    # Subtle top accent bar
    canvas.setFillColor(BRAND_BLUE)
    canvas.rect(0, A4[1] - 3 * mm, A4[0], 3 * mm, fill=True, stroke=False)

    # Footer line
    canvas.setStrokeColor(BRAND_BORDER)
    canvas.setLineWidth(0.5)
    canvas.line(2 * cm, 1.5 * cm, A4[0] - 2 * cm, 1.5 * cm)

    # Footer text
    canvas.setFillColor(BRAND_MUTED)
    canvas.setFont("Helvetica", 7)
    canvas.drawCentredString(
        A4[0] / 2,
        1 * cm,
        f"Finance India Daily Report  •  Page {doc.page}  •  Generated {datetime.now().strftime('%d %b %Y, %I:%M %p IST')}",
    )
    canvas.restoreState()


# ── Asset Card Builder ────────────────────────────────────────────────────────
def _build_asset_card(
    asset: Dict[str, Any],
    indicators: Dict[str, Any],
    sparkline_data: Optional[Dict[str, Any]],
    styles: Dict[str, ParagraphStyle],
) -> List:
    """
    Build flowable elements for a single asset card.

    Args:
        asset: Dict with keys: symbol, name, asset_type, price, change, change_percent.
        indicators: Dict with keys: rsi, sma, ema, volatility, macd_signal, bollinger_position.
        sparkline_data: Optional dict with keys: dates, values (for 7-day history).
        styles: Paragraph styles dict.

    Returns:
        List of ReportLab flowable elements.
    """
    elements = []

    change_pct = asset.get("change_percent", 0)
    is_positive = change_pct >= 0
    price_style = styles["price_positive"] if is_positive else styles["price_negative"]
    arrow = "▲" if is_positive else "▼"

    # ── Header row: Asset name + Price ──
    asset_label = f"{asset.get('name', asset.get('symbol', 'Unknown'))} ({asset.get('symbol', '')})"
    price_text = f"₹{asset.get('price', 0):,.2f}  {arrow} {abs(change_pct):.2f}%"

    header_data = [
        [
            Paragraph(asset_label, styles["asset_name"]),
            Paragraph(price_text, price_style),
        ]
    ]
    header_table = Table(header_data, colWidths=[10 * cm, 7 * cm])
    header_table.setStyle(
        TableStyle([
            ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
            ("ALIGN", (1, 0), (1, 0), "RIGHT"),
            ("BOTTOMPADDING", (0, 0), (-1, -1), 2 * mm),
        ])
    )
    elements.append(header_table)

    # ── Indicator table ──
    rsi = indicators.get("rsi")
    sma = indicators.get("sma")
    ema = indicators.get("ema")
    volatility = indicators.get("volatility")
    macd_signal = indicators.get("macd_signal", "N/A")
    bollinger_pos = indicators.get("bollinger_position", "N/A")

    ind_data = [
        [
            Paragraph("RSI(14)", styles["body_muted"]),
            Paragraph(f"{rsi:.1f}" if rsi is not None else "N/A", styles["body"]),
            Paragraph("SMA(50)", styles["body_muted"]),
            Paragraph(f"₹{sma:,.2f}" if sma is not None else "N/A", styles["body"]),
            Paragraph("EMA(50)", styles["body_muted"]),
            Paragraph(f"₹{ema:,.2f}" if ema is not None else "N/A", styles["body"]),
        ],
        [
            Paragraph("Volatility", styles["body_muted"]),
            Paragraph(f"{volatility:.1f}%" if volatility is not None else "N/A", styles["body"]),
            Paragraph("MACD", styles["body_muted"]),
            Paragraph(str(macd_signal), styles["body"]),
            Paragraph("Bollinger", styles["body_muted"]),
            Paragraph(str(bollinger_pos), styles["body"]),
        ],
    ]

    col_w = 2.83 * cm
    ind_table = Table(ind_data, colWidths=[col_w] * 6)
    ind_table.setStyle(
        TableStyle([
            ("BACKGROUND", (0, 0), (-1, -1), BRAND_CARD),
            ("TEXTCOLOR", (0, 0), (-1, -1), BRAND_TEXT),
            ("GRID", (0, 0), (-1, -1), 0.5, BRAND_BORDER),
            ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
            ("TOPPADDING", (0, 0), (-1, -1), 2 * mm),
            ("BOTTOMPADDING", (0, 0), (-1, -1), 2 * mm),
            ("LEFTPADDING", (0, 0), (-1, -1), 2 * mm),
            ("RIGHTPADDING", (0, 0), (-1, -1), 2 * mm),
        ])
    )
    elements.append(ind_table)

    # ── Sparkline chart ──
    if sparkline_data and sparkline_data.get("values"):
        try:
            sparkline_buf = _render_sparkline(
                sparkline_data.get("dates", []),
                sparkline_data["values"],
            )
            sparkline_img = Image(sparkline_buf, width=10 * cm, height=2.2 * cm)
            elements.append(Spacer(1, 2 * mm))
            elements.append(sparkline_img)
        except Exception:
            logger.warning("Failed to render sparkline for %s", asset.get("symbol"), exc_info=True)

    # Divider spacer
    elements.append(Spacer(1, 6 * mm))

    return elements


# ── Main PDF Generation ──────────────────────────────────────────────────────
def generate_watchlist_report(
    user_name: str,
    user_email: str,
    watchlist_assets: List[Dict[str, Any]],
    indicators_map: Dict[str, Dict[str, Any]],
    sparkline_map: Dict[str, Dict[str, Any]],
    ai_summary: Optional[str] = None,
    market_overview: Optional[Dict[str, Any]] = None,
) -> bytes:
    """
    Generate a complete Finance India daily watchlist PDF report.

    Args:
        user_name: Display name of the user.
        user_email: Email (used in header metadata, not displayed prominently).
        watchlist_assets: List of asset dicts, each with:
            symbol, name, asset_type, price, change, change_percent.
        indicators_map: Dict keyed by asset symbol → indicator dict with:
            rsi, sma, ema, volatility, macd_signal, bollinger_position.
        sparkline_map: Dict keyed by asset symbol → dict with dates and values lists.
        ai_summary: Optional AI-generated cross-asset market summary text.
        market_overview: Optional dict with market overview data (top_movers, etc.).

    Returns:
        Raw PDF bytes ready for email attachment or download.
    """
    buf = io.BytesIO()

    doc = SimpleDocTemplate(
        buf,
        pagesize=A4,
        leftMargin=2 * cm,
        rightMargin=2 * cm,
        topMargin=2 * cm,
        bottomMargin=2.5 * cm,
        title=f"Finance India Report — {datetime.now().strftime('%d %b %Y')}",
        author="Finance India",
    )

    styles = _build_styles()
    elements = []

    # ── Title Page Content ────────────────────────────────────────────────────
    elements.append(Spacer(1, 3 * cm))
    elements.append(Paragraph("Finance India", styles["title"]))
    elements.append(
        Paragraph("AI-Powered Multi-Asset Market Intelligence", styles["subtitle"])
    )
    elements.append(
        Paragraph(
            f"Daily Watchlist Report  •  {datetime.now().strftime('%A, %d %B %Y')}",
            styles["subtitle"],
        )
    )
    elements.append(
        Paragraph(f"Prepared for {user_name}", styles["body_muted"])
    )
    elements.append(Spacer(1, 1 * cm))

    # Summary stats bar
    asset_count = len(watchlist_assets)
    positive_count = sum(1 for a in watchlist_assets if a.get("change_percent", 0) >= 0)
    negative_count = asset_count - positive_count

    summary_data = [
        [
            Paragraph(f"Assets: {asset_count}", styles["body"]),
            Paragraph(f"▲ Gainers: {positive_count}", styles["price_positive"]),
            Paragraph(f"▼ Losers: {negative_count}", styles["price_negative"]),
        ]
    ]
    summary_table = Table(summary_data, colWidths=[5.7 * cm] * 3)
    summary_table.setStyle(
        TableStyle([
            ("BACKGROUND", (0, 0), (-1, -1), BRAND_CARD),
            ("GRID", (0, 0), (-1, -1), 0.5, BRAND_BORDER),
            ("ALIGN", (0, 0), (-1, -1), "CENTER"),
            ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
            ("TOPPADDING", (0, 0), (-1, -1), 3 * mm),
            ("BOTTOMPADDING", (0, 0), (-1, -1), 3 * mm),
        ])
    )
    elements.append(summary_table)
    elements.append(Spacer(1, 8 * mm))

    # ── Watchlist Asset Cards ────────────────────────────────────────────────
    if watchlist_assets:
        elements.append(Paragraph("Watchlist Assets", styles["section_header"]))

        for asset in watchlist_assets:
            symbol = asset.get("symbol", "")
            asset_indicators = indicators_map.get(symbol, {})
            asset_sparkline = sparkline_map.get(symbol)

            card_elements = _build_asset_card(asset, asset_indicators, asset_sparkline, styles)
            elements.extend(card_elements)
    else:
        elements.append(Spacer(1, 2 * cm))
        elements.append(
            Paragraph(
                "Your watchlist is empty. Add assets to your watchlist to receive detailed daily reports.",
                styles["body"],
            )
        )

    # ── AI Market Summary ────────────────────────────────────────────────────
    if ai_summary:
        elements.append(Spacer(1, 4 * mm))
        elements.append(Paragraph("AI Market Summary", styles["section_header"]))

        # Wrap AI text in a styled table cell for visual card effect
        ai_data = [[Paragraph(ai_summary, styles["body"])]]
        ai_table = Table(ai_data, colWidths=[17 * cm])
        ai_table.setStyle(
            TableStyle([
                ("BACKGROUND", (0, 0), (-1, -1), BRAND_ELEVATED),
                ("BORDER_COLOR", (0, 0), (-1, -1), BRAND_BLUE),
                ("BORDER_WIDTH", (0, 0), (-1, -1), 0.5),
                ("BOX", (0, 0), (-1, -1), 0.5, BRAND_BLUE),
                ("TOPPADDING", (0, 0), (-1, -1), 4 * mm),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 4 * mm),
                ("LEFTPADDING", (0, 0), (-1, -1), 4 * mm),
                ("RIGHTPADDING", (0, 0), (-1, -1), 4 * mm),
            ])
        )
        elements.append(ai_table)

    # ── Market Overview ──────────────────────────────────────────────────────
    if market_overview:
        elements.append(Spacer(1, 4 * mm))
        elements.append(Paragraph("Market Overview", styles["section_header"]))

        top_movers = market_overview.get("top_movers", [])
        if top_movers:
            mover_header = [
                Paragraph("Asset", styles["body_muted"]),
                Paragraph("Price", styles["body_muted"]),
                Paragraph("Change", styles["body_muted"]),
            ]
            mover_rows = [mover_header]
            for mover in top_movers[:10]:
                chg = mover.get("change_percent", 0)
                chg_style = styles["price_positive"] if chg >= 0 else styles["price_negative"]
                arrow = "▲" if chg >= 0 else "▼"
                mover_rows.append([
                    Paragraph(str(mover.get("symbol", "")), styles["body"]),
                    Paragraph(f"₹{mover.get('price', 0):,.2f}", styles["body"]),
                    Paragraph(f"{arrow} {abs(chg):.2f}%", chg_style),
                ])

            mover_table = Table(mover_rows, colWidths=[6 * cm, 5.5 * cm, 5.5 * cm])
            mover_table.setStyle(
                TableStyle([
                    ("BACKGROUND", (0, 0), (-1, 0), BRAND_ELEVATED),
                    ("BACKGROUND", (0, 1), (-1, -1), BRAND_CARD),
                    ("GRID", (0, 0), (-1, -1), 0.5, BRAND_BORDER),
                    ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
                    ("TOPPADDING", (0, 0), (-1, -1), 2 * mm),
                    ("BOTTOMPADDING", (0, 0), (-1, -1), 2 * mm),
                    ("LEFTPADDING", (0, 0), (-1, -1), 3 * mm),
                    ("RIGHTPADDING", (0, 0), (-1, -1), 3 * mm),
                ])
            )
            elements.append(mover_table)

    # ── Disclaimer ───────────────────────────────────────────────────────────
    elements.append(Spacer(1, 1 * cm))
    elements.append(
        Paragraph(
            "Disclaimer: This report is generated automatically for informational purposes only. "
            "It does not constitute financial advice. Past performance is not indicative of future results. "
            "Always consult a qualified financial advisor before making investment decisions.",
            styles["footer"],
        )
    )

    # ── Build PDF ────────────────────────────────────────────────────────────
    doc.build(elements, onFirstPage=_draw_page_background, onLaterPages=_draw_page_background)

    pdf_bytes = buf.getvalue()
    buf.close()

    logger.info("Generated PDF report for %s (%d assets, %d bytes)", user_name, asset_count, len(pdf_bytes))
    return pdf_bytes
