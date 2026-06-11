#!/usr/bin/env python3
"""Render a Tungsten positioning brief to BOTH a Word doc and a standalone HTML file.

Reads the same JSON schema the app's document generator uses (see
scripts/generate_doc.py) from stdin and writes:

    <out_base>.docx   — branded Word document (reuses the app's exact styling)
    <out_base>.html   — self-contained, print-ready HTML mirroring the doc

Usage:
    echo '{"title": ...}' | python render_outputs.py /path/to/output_basename

Prints the two output paths (docx, then html), one per line, on stdout.
The .docx step requires python-docx; the .html step is pure stdlib.
"""

import html
import io
import json
import os
import sys
from pathlib import Path

# Brand palette (mirrors lib/constants.ts + generate_doc.py)
NAVY = "#002854"
GOLD = "#FFC600"
DARK = "#231F20"
STEEL = "#98AFC9"
BRIGHT_BLUE = "#00A0FB"
LIGHT_GRAY = "#F5F5F5"

FOOTER_TEXT = (
    "Proprietary and Confidential © 2026 Tungsten Automation Corp. "
    "All rights reserved."
)


# ---------------------------------------------------------------------------
# DOCX — reuse the app's generator so output matches the web app byte-for-byte
# ---------------------------------------------------------------------------
def write_docx(data, out_path):
    """Render the .docx by importing the app's create_document(). Returns path or None."""
    repo_root = Path(__file__).resolve().parents[4]
    app_scripts = repo_root / "scripts"
    sys.path.insert(0, str(app_scripts))
    try:
        from generate_doc import create_document  # type: ignore
    except Exception as exc:  # pragma: no cover - dependency/path issue
        print(
            f"WARN: could not render .docx ({exc}). "
            "Ensure python-docx is installed and scripts/generate_doc.py exists.",
            file=sys.stderr,
        )
        return None

    doc = create_document(data)
    doc.save(out_path)
    return out_path


# ---------------------------------------------------------------------------
# HTML — self-contained, print-ready, mirrors the document layout
# ---------------------------------------------------------------------------
def _esc(text):
    return html.escape(str(text), quote=True)


def _render_keystats(stats):
    if not stats:
        return ""
    cards = []
    for s in stats:
        cards.append(
            f'<div class="stat">'
            f'<div class="stat-value">{_esc(s.get("value", ""))}</div>'
            f'<div class="stat-label">{_esc(s.get("label", ""))}</div>'
            f"</div>"
        )
    return f'<div class="stats">{"".join(cards)}</div>'


def _render_section(sec):
    t = sec.get("type", "heading")

    if t == "heading":
        return f'<h2 class="sec-heading">{_esc(sec.get("title", ""))}</h2>'

    if t == "subheading":
        return f'<h3 class="sec-subheading">{_esc(sec.get("title", ""))}</h3>'

    if t == "paragraph":
        return f'<p class="sec-paragraph">{_esc(sec.get("text", ""))}</p>'

    if t == "bullets":
        items = "".join(f"<li>{_esc(i)}</li>" for i in sec.get("items", []))
        return f'<ul class="sec-bullets">{items}</ul>'

    if t == "callout":
        label = (
            f'<div class="callout-label">{_esc(sec["label"]).upper()}</div>'
            if sec.get("label")
            else ""
        )
        attr = (
            f'<div class="callout-attr">&mdash; {_esc(sec["attribution"])}</div>'
            if sec.get("attribution")
            else ""
        )
        return (
            f'<div class="callout">{label}'
            f'<div class="callout-text">{_esc(sec.get("text", ""))}</div>'
            f"{attr}</div>"
        )

    if t == "table":
        headers = sec.get("headers", [])
        rows = sec.get("rows", [])
        if not headers or not rows:
            return ""
        head = "".join(f"<th>{_esc(h)}</th>" for h in headers)
        body = []
        for r in rows:
            cells = "".join(f"<td>{_esc(c)}</td>" for c in r)
            body.append(f"<tr>{cells}</tr>")
        return (
            f'<table class="sec-table"><thead><tr>{head}</tr></thead>'
            f'<tbody>{"".join(body)}</tbody></table>'
        )

    if t == "page_break":
        return '<div class="page-break"></div>'

    return ""


def write_html(data, out_path):
    title = data.get("title", "Positioning Document")
    subtitle = data.get("subtitle", "")
    date = data.get("date", "")

    sections_html = "\n".join(_render_section(s) for s in data.get("sections", []))

    page = f"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{_esc(title)}</title>
<style>
  :root {{
    --navy: {NAVY}; --gold: {GOLD}; --dark: {DARK};
    --steel: {STEEL}; --bright: {BRIGHT_BLUE}; --gray: {LIGHT_GRAY};
  }}
  * {{ box-sizing: border-box; }}
  body {{
    margin: 0; background: #e9e9ec; color: var(--dark);
    font-family: Arial, "Helvetica Neue", Helvetica, sans-serif;
    line-height: 1.6; font-size: 15px;
  }}
  .page {{
    max-width: 820px; margin: 32px auto; background: #fff;
    box-shadow: 0 2px 24px rgba(0,0,0,.12);
    padding: 0 0 64px;
  }}
  .gold-bar {{ height: 6px; background: var(--gold); }}
  .brandbar {{
    padding: 14px 56px; border-bottom: 1px solid var(--gold);
    font-size: 12px; font-weight: 700; letter-spacing: .12em; color: var(--navy);
  }}
  .titleblock {{ padding: 56px 56px 24px; }}
  .tag {{
    color: var(--bright); font-weight: 700; font-size: 12px;
    letter-spacing: .12em; margin-bottom: 6px;
  }}
  h1 {{
    color: var(--navy); font-size: 38px; line-height: 1.15;
    margin: 0 0 10px; font-weight: 800;
  }}
  .date {{ color: var(--steel); font-size: 13px; margin-bottom: 28px; }}
  .stats {{
    display: flex; gap: 16px; border-top: 1px solid #e6e6e6;
    border-bottom: 1px solid #e6e6e6; padding: 22px 0; margin-top: 8px;
  }}
  .stat {{ flex: 1; text-align: center; }}
  .stat-value {{ color: var(--navy); font-size: 30px; font-weight: 800; }}
  .stat-label {{ color: var(--steel); font-size: 11px; margin-top: 4px; }}
  .content {{ padding: 8px 56px 0; }}
  .sec-heading {{
    color: var(--navy); font-size: 22px; margin: 34px 0 10px;
    padding-bottom: 6px; border-bottom: 2px solid var(--gold);
  }}
  .sec-subheading {{ color: var(--navy); font-size: 16px; margin: 22px 0 6px; }}
  .sec-paragraph {{ margin: 0 0 12px; }}
  .sec-bullets {{ margin: 0 0 14px; padding-left: 22px; }}
  .sec-bullets li {{ margin-bottom: 6px; }}
  .callout {{
    background: var(--navy); color: #fff; border-radius: 8px;
    padding: 20px 24px; margin: 20px 0;
  }}
  .callout-label {{
    color: var(--gold); font-size: 11px; font-weight: 700;
    letter-spacing: .1em; margin-bottom: 6px;
  }}
  .callout-text {{ font-style: italic; font-size: 16px; }}
  .callout-attr {{ color: var(--steel); font-size: 12px; margin-top: 8px; }}
  .sec-table {{
    width: 100%; border-collapse: collapse; margin: 16px 0 22px; font-size: 13px;
  }}
  .sec-table th {{
    background: var(--navy); color: #fff; text-align: left;
    padding: 9px 12px; font-size: 12px;
  }}
  .sec-table td {{ padding: 8px 12px; border: 1px solid #e2e2e2; }}
  .sec-table tbody tr:nth-child(even) td {{ background: var(--gray); }}
  .footer {{
    margin-top: 48px; padding: 14px 56px 0; border-top: 1px solid #ececec;
    color: var(--steel); font-size: 10px; text-align: center;
  }}
  .page-break {{ height: 0; }}
  @media print {{
    body {{ background: #fff; }}
    .page {{ box-shadow: none; margin: 0; max-width: none; }}
    .page-break {{ page-break-before: always; }}
  }}
</style>
</head>
<body>
  <div class="page">
    <div class="gold-bar"></div>
    <div class="brandbar">TUNGSTEN AUTOMATION</div>
    <div class="titleblock">
      {f'<div class="tag">{_esc(subtitle).upper()}</div>' if subtitle else ''}
      <h1>{_esc(title)}</h1>
      {f'<div class="date">{_esc(date)}</div>' if date else ''}
      {_render_keystats(data.get("keyStats", []))}
    </div>
    <div class="content">
      {sections_html}
    </div>
    <div class="footer">{_esc(FOOTER_TEXT)}</div>
  </div>
</body>
</html>
"""
    with open(out_path, "w", encoding="utf-8") as f:
        f.write(page)
    return out_path


def main():
    if len(sys.argv) < 2:
        print("Usage: echo '{...}' | python render_outputs.py <out_basename>", file=sys.stderr)
        sys.exit(1)

    out_base = sys.argv[1]
    os.makedirs(os.path.dirname(os.path.abspath(out_base)) or ".", exist_ok=True)

    try:
        stdin_text = io.TextIOWrapper(sys.stdin.buffer, encoding="utf-8").read()
        data = json.loads(stdin_text)
    except (json.JSONDecodeError, ValueError) as exc:
        print(f"Invalid JSON on stdin: {exc}", file=sys.stderr)
        sys.exit(1)

    docx_path = write_docx(data, out_base + ".docx")
    html_path = write_html(data, out_base + ".html")

    if docx_path:
        print(docx_path)
    print(html_path)


if __name__ == "__main__":
    main()
