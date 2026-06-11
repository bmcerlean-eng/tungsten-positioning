#!/usr/bin/env python3
"""Render a Tungsten positioning deck to a self-contained HTML slideshow.

Reads the same slide JSON schema the app's deck generator uses (see
app/api/generate-deck/route.ts and scripts/generate_deck.py) from stdin and
writes a single, dependency-free `.html` file: branded, navigable with the
keyboard/clicks, speaker-notes toggle, and print-to-PDF friendly.

Usage:
    echo '{"title": ..., "slides": [...]}' | python render_deck_html.py /path/out_basename

Prints the output .html path on stdout. Pure stdlib — no install required.

Supported layouts: title, section, closing, content-white, content-blue,
stats, comparison.
"""

import html
import io
import json
import os
import sys

NAVY = "#002854"
NAVY_2 = "#1E4D8C"
GOLD = "#FFC600"
DARK = "#231F20"
STEEL = "#98AFC9"
BRIGHT = "#00A0FB"
GRAY = "#F5F5F5"

FOOTER_BRAND = "Tungsten Automation"


def _esc(text):
    return html.escape(str(text), quote=True)


def _bullets(items):
    if not items:
        return ""
    lis = "".join(f"<li>{_esc(i)}</li>" for i in items)
    return f"<ul class='bullets'>{lis}</ul>"


def _stats(stats):
    if not stats:
        return ""
    cards = "".join(
        f"<div class='stat'><div class='stat-value'>{_esc(s.get('value',''))}</div>"
        f"<div class='stat-label'>{_esc(s.get('label',''))}</div></div>"
        for s in stats
    )
    return f"<div class='stats'>{cards}</div>"


def _comparison(cmp):
    if not cmp:
        return ""
    headers = cmp.get("headers", [])
    rows = cmp.get("rows", [])
    if not headers or not rows:
        return ""
    head = "".join(f"<th>{_esc(h)}</th>" for h in headers)
    body = "".join(
        "<tr>" + "".join(f"<td>{_esc(c)}</td>" for c in r) + "</tr>" for r in rows
    )
    return f"<table class='cmp'><thead><tr>{head}</tr></thead><tbody>{body}</tbody></table>"


def _slide(slide, idx, total):
    layout = slide.get("layout", "content-white")
    title = slide.get("title", "")
    subtitle = slide.get("subtitle", "")
    notes = slide.get("speakerNotes", "")

    parts = []
    if layout in ("title", "section", "closing"):
        parts.append(f"<h2 class='hero-title'>{_esc(title)}</h2>")
        if subtitle:
            parts.append(f"<p class='hero-sub'>{_esc(subtitle)}</p>")
    else:
        parts.append(f"<h2 class='slide-title'>{_esc(title)}</h2>")

    if layout == "stats":
        parts.append(_stats(slide.get("stats")))
    elif layout == "comparison":
        parts.append(_comparison(slide.get("comparison")))
    elif layout in ("content-white", "content-blue"):
        parts.append(_bullets(slide.get("bullets")))

    notes_html = (
        f"<div class='notes' data-notes>{_esc(notes)}</div>" if notes else ""
    )

    return (
        f"<section class='slide layout-{_esc(layout)}' data-idx='{idx}'>"
        f"<div class='slide-inner'>{''.join(parts)}</div>"
        f"<div class='slide-foot'><span>{_esc(FOOTER_BRAND)}</span>"
        f"<span class='pageno'>{idx + 1} / {total}</span></div>"
        f"{notes_html}</section>"
    )


def render(data):
    deck_title = data.get("title", "Tungsten Positioning Deck")
    slides = data.get("slides", [])
    total = len(slides)
    slides_html = "\n".join(_slide(s, i, total) for i, s in enumerate(slides))

    return f"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{_esc(deck_title)}</title>
<style>
  :root {{
    --navy:{NAVY}; --navy2:{NAVY_2}; --gold:{GOLD}; --dark:{DARK};
    --steel:{STEEL}; --bright:{BRIGHT}; --gray:{GRAY};
  }}
  * {{ box-sizing:border-box; margin:0; padding:0; }}
  html,body {{ height:100%; }}
  body {{
    background:#0c1422; font-family:Arial,"Helvetica Neue",sans-serif;
    color:var(--dark); overflow:hidden;
  }}
  .stage {{
    position:fixed; inset:0; display:flex; align-items:center; justify-content:center;
  }}
  .slide {{
    display:none; position:relative; width:min(96vw,1280px); aspect-ratio:16/9;
    background:#fff; border-radius:10px; overflow:hidden;
    box-shadow:0 12px 60px rgba(0,0,0,.5);
  }}
  .slide.active {{ display:block; }}
  .slide-inner {{
    position:absolute; inset:0; padding:7% 8% 10%;
    display:flex; flex-direction:column; justify-content:center;
  }}
  /* gold accent strip */
  .slide::before {{
    content:""; position:absolute; top:0; left:0; right:0; height:8px; background:var(--gold);
  }}
  .slide-foot {{
    position:absolute; bottom:0; left:0; right:0; height:44px; padding:0 8%;
    display:flex; align-items:center; justify-content:space-between;
    font-size:13px; color:var(--steel); letter-spacing:.04em;
  }}
  .slide-title {{ color:var(--navy); font-size:clamp(22px,3.4vw,42px); line-height:1.12; margin-bottom:3%; }}
  .bullets {{ list-style:none; }}
  .bullets li {{
    position:relative; padding-left:30px; margin:1.4% 0;
    font-size:clamp(15px,2.1vw,26px); color:var(--dark); line-height:1.35;
  }}
  .bullets li::before {{
    content:""; position:absolute; left:0; top:.55em; width:12px; height:12px;
    background:var(--gold); border-radius:2px;
  }}
  /* hero layouts */
  .layout-title, .layout-section, .layout-closing {{
    background:linear-gradient(135deg,var(--navy) 0%,var(--navy2) 55%,var(--bright) 130%);
  }}
  .layout-title .slide-foot, .layout-section .slide-foot, .layout-closing .slide-foot {{
    color:rgba(255,255,255,.6);
  }}
  .hero-title {{ color:#fff; font-size:clamp(26px,4.2vw,54px); line-height:1.1; font-weight:800; }}
  .hero-sub {{ color:var(--gold); font-size:clamp(15px,2vw,24px); margin-top:2.5%; font-weight:600; }}
  .layout-section .hero-title {{ border-left:6px solid var(--gold); padding-left:24px; }}
  /* blue content slide */
  .layout-content-blue {{ background:linear-gradient(135deg,var(--navy) 0%,var(--navy2) 100%); }}
  .layout-content-blue .slide-title {{ color:#fff; }}
  .layout-content-blue .bullets li {{ color:#eaf2fb; }}
  /* stats */
  .stats {{ display:flex; gap:4%; margin-top:3%; }}
  .stat {{ flex:1; text-align:center; }}
  .stat-value {{ color:var(--navy); font-size:clamp(34px,6vw,72px); font-weight:800; line-height:1; }}
  .stat-label {{ color:var(--steel); font-size:clamp(12px,1.5vw,18px); margin-top:10px; }}
  /* comparison table */
  table.cmp {{ width:100%; border-collapse:collapse; margin-top:2.5%; font-size:clamp(12px,1.6vw,20px); }}
  table.cmp th {{ background:var(--navy); color:#fff; text-align:left; padding:.7em .9em; }}
  table.cmp td {{ padding:.6em .9em; border:1px solid #e2e2e2; }}
  table.cmp tbody tr:nth-child(even) td {{ background:var(--gray); }}
  table.cmp td:first-child, table.cmp th:first-child {{ font-weight:600; }}
  /* notes */
  .notes {{ display:none; }}
  body.show-notes .notes {{
    display:block; position:fixed; left:0; right:0; bottom:0; max-height:30vh; overflow:auto;
    background:#11192a; color:#cdd6e4; padding:16px 24px; font-size:14px; line-height:1.5;
    border-top:3px solid var(--gold);
  }}
  body.show-notes .slide.active ~ .notes {{ }}
  /* nav hint + controls */
  .hint {{
    position:fixed; top:14px; right:18px; color:rgba(255,255,255,.5);
    font-size:12px; font-family:Arial; user-select:none;
  }}
  .nav {{ position:fixed; top:0; bottom:0; width:18%; cursor:pointer; z-index:5; }}
  .nav.prev {{ left:0; }} .nav.next {{ right:0; }}
  @media print {{
    body {{ background:#fff; overflow:visible; }}
    .stage {{ position:static; display:block; }}
    .hint,.nav {{ display:none; }}
    .slide {{
      display:block !important; width:100%; aspect-ratio:16/9; border-radius:0;
      box-shadow:none; page-break-after:always; margin:0;
    }}
    body.show-notes .notes {{ position:static; max-height:none; }}
  }}
</style>
</head>
<body>
  <div class="hint">← → / Space &nbsp;·&nbsp; N: notes &nbsp;·&nbsp; F: fullscreen</div>
  <div class="nav prev" onclick="go(-1)"></div>
  <div class="nav next" onclick="go(1)"></div>
  <div class="stage" id="stage">
    {slides_html}
  </div>
<script>
  var slides = Array.prototype.slice.call(document.querySelectorAll('.slide'));
  var cur = 0;
  function show(i) {{
    cur = Math.max(0, Math.min(slides.length - 1, i));
    slides.forEach(function(s, n) {{ s.classList.toggle('active', n === cur); }});
    // move active notes next to body for the CSS sibling rule
    var note = slides[cur].querySelector('.notes');
    document.querySelectorAll('body > .notes').forEach(function(n){{ n.remove(); }});
    if (note) {{ document.body.appendChild(note.cloneNode(true)); }}
  }}
  function go(d) {{ show(cur + d); }}
  document.addEventListener('keydown', function(e) {{
    if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'PageDown') {{ go(1); e.preventDefault(); }}
    else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {{ go(-1); }}
    else if (e.key === 'Home') {{ show(0); }}
    else if (e.key === 'End') {{ show(slides.length - 1); }}
    else if (e.key.toLowerCase() === 'n') {{ document.body.classList.toggle('show-notes'); show(cur); }}
    else if (e.key.toLowerCase() === 'f') {{
      if (!document.fullscreenElement) document.documentElement.requestFullscreen();
      else document.exitFullscreen();
    }}
  }});
  show(0);
</script>
</body>
</html>
"""


def main():
    if len(sys.argv) < 2:
        print("Usage: echo '{...}' | python render_deck_html.py <out_basename>", file=sys.stderr)
        sys.exit(1)

    out_base = sys.argv[1]
    out_path = out_base if out_base.endswith(".html") else out_base + ".html"
    os.makedirs(os.path.dirname(os.path.abspath(out_path)) or ".", exist_ok=True)

    try:
        stdin_text = io.TextIOWrapper(sys.stdin.buffer, encoding="utf-8").read()
        data = json.loads(stdin_text)
    except (json.JSONDecodeError, ValueError) as exc:
        print(f"Invalid JSON on stdin: {exc}", file=sys.stderr)
        sys.exit(1)

    with open(out_path, "w", encoding="utf-8") as f:
        f.write(render(data))
    print(out_path)


if __name__ == "__main__":
    main()
