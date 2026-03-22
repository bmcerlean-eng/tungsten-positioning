#!/usr/bin/env python3
"""Generate a branded Tungsten Automation positioning document in Word format.

Usage:
    echo '{"title":"...","subtitle":"...","sections":[...]}' | python generate_doc.py

Reads JSON from stdin, creates a professional Word document styled to match the
Tungsten corporate brand, and prints the path to the generated .docx on stdout.
"""

import json
import os
import sys
import tempfile

from docx import Document
from docx.shared import Pt, Inches, RGBColor, Cm
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.section import WD_ORIENT


# Brand colors
NAVY = RGBColor(0x00, 0x28, 0x54)
GOLD = RGBColor(0xFF, 0xC6, 0x00)
DARK = RGBColor(0x23, 0x1F, 0x20)
STEEL = RGBColor(0x98, 0xAF, 0xC9)
BRIGHT_BLUE = RGBColor(0x00, 0xA0, 0xFB)
WHITE = RGBColor(0xFF, 0xFF, 0xFF)
LIGHT_GRAY = RGBColor(0xF5, 0xF5, 0xF5)

FOOTER_TEXT = (
    "Proprietary and Confidential \u00a9 2026 Tungsten Automation Corp. "
    "All rights reserved."
)


def _set_cell_shading(cell, color_hex):
    """Set the background shading of a table cell."""
    from docx.oxml.ns import qn
    from docx.oxml import OxmlElement
    shading = OxmlElement("w:shd")
    shading.set(qn("w:fill"), color_hex)
    shading.set(qn("w:val"), "clear")
    cell._tc.get_or_add_tcPr().append(shading)


def create_document(data):
    doc = Document()

    # --- Page setup ---
    section = doc.sections[0]
    section.page_width = Inches(8.5)
    section.page_height = Inches(11)
    section.top_margin = Inches(0.8)
    section.bottom_margin = Inches(0.8)
    section.left_margin = Inches(1.0)
    section.right_margin = Inches(1.0)

    # --- Footer ---
    footer = section.footer
    footer.is_linked_to_previous = False
    fp = footer.paragraphs[0]
    fp.text = FOOTER_TEXT
    fp.alignment = WD_ALIGN_PARAGRAPH.CENTER
    run = fp.runs[0]
    run.font.size = Pt(7)
    run.font.color.rgb = STEEL

    # --- Header bar (gold line + company name) ---
    header = section.header
    header.is_linked_to_previous = False
    hp = header.paragraphs[0]
    hr = hp.add_run("TUNGSTEN AUTOMATION")
    hr.font.size = Pt(8)
    hr.font.color.rgb = NAVY
    hr.font.bold = True
    hp.alignment = WD_ALIGN_PARAGRAPH.LEFT

    # Add a thin gold line under header using a border
    from docx.oxml.ns import qn
    from docx.oxml import OxmlElement
    pPr = hp._p.get_or_add_pPr()
    pBdr = OxmlElement("w:pBdr")
    bottom = OxmlElement("w:bottom")
    bottom.set(qn("w:val"), "single")
    bottom.set(qn("w:sz"), "8")
    bottom.set(qn("w:space"), "4")
    bottom.set(qn("w:color"), "FFC600")
    pBdr.append(bottom)
    pPr.append(pBdr)

    # --- Title Page ---
    # Add some spacing before the title
    spacer = doc.add_paragraph()
    spacer.paragraph_format.space_before = Pt(120)

    # Subtitle / category tag
    subtitle_text = data.get("subtitle", "")
    if subtitle_text:
        tag = doc.add_paragraph()
        tag.alignment = WD_ALIGN_PARAGRAPH.LEFT
        tag_run = tag.add_run(subtitle_text.upper())
        tag_run.font.size = Pt(10)
        tag_run.font.color.rgb = BRIGHT_BLUE
        tag_run.font.bold = True
        tag.paragraph_format.space_after = Pt(4)

    # Main title
    title = doc.add_paragraph()
    title.alignment = WD_ALIGN_PARAGRAPH.LEFT
    title_run = title.add_run(data.get("title", "Positioning Document"))
    title_run.font.size = Pt(28)
    title_run.font.color.rgb = NAVY
    title_run.font.bold = True
    title_run.font.name = "Arial"
    title.paragraph_format.space_after = Pt(8)

    # Date and confidentiality
    meta = doc.add_paragraph()
    meta.alignment = WD_ALIGN_PARAGRAPH.LEFT
    meta_run = meta.add_run(data.get("date", "March 2026"))
    meta_run.font.size = Pt(10)
    meta_run.font.color.rgb = STEEL
    meta.paragraph_format.space_after = Pt(40)

    # Key stats callout (if provided)
    stats = data.get("keyStats", [])
    if stats:
        table = doc.add_table(rows=1, cols=len(stats))
        table.autofit = True
        for i, stat in enumerate(stats):
            cell = table.cell(0, i)
            # Stat value
            p_val = cell.paragraphs[0]
            p_val.alignment = WD_ALIGN_PARAGRAPH.CENTER
            r_val = p_val.add_run(stat.get("value", ""))
            r_val.font.size = Pt(22)
            r_val.font.color.rgb = NAVY
            r_val.font.bold = True
            r_val.font.name = "Arial"
            # Stat label
            p_label = cell.add_paragraph()
            p_label.alignment = WD_ALIGN_PARAGRAPH.CENTER
            r_label = p_label.add_run(stat.get("label", ""))
            r_label.font.size = Pt(8)
            r_label.font.color.rgb = STEEL
        doc.add_paragraph()  # spacing

    # Page break before content
    doc.add_page_break()

    # --- Sections ---
    sections = data.get("sections", [])
    for sec in sections:
        sec_type = sec.get("type", "heading")

        if sec_type == "heading":
            h = doc.add_heading(sec.get("title", ""), level=1)
            for run in h.runs:
                run.font.color.rgb = NAVY
                run.font.name = "Arial"
            h.paragraph_format.space_before = Pt(24)
            h.paragraph_format.space_after = Pt(8)

        elif sec_type == "subheading":
            h = doc.add_heading(sec.get("title", ""), level=2)
            for run in h.runs:
                run.font.color.rgb = NAVY
                run.font.name = "Arial"
            h.paragraph_format.space_before = Pt(16)
            h.paragraph_format.space_after = Pt(6)

        elif sec_type == "paragraph":
            p = doc.add_paragraph()
            text = sec.get("text", "")
            r = p.add_run(text)
            r.font.size = Pt(10)
            r.font.color.rgb = DARK
            r.font.name = "Arial"
            p.paragraph_format.space_after = Pt(8)
            p.paragraph_format.line_spacing = Pt(16)

        elif sec_type == "bullets":
            for bullet in sec.get("items", []):
                p = doc.add_paragraph(style="List Bullet")
                r = p.add_run(bullet)
                r.font.size = Pt(10)
                r.font.color.rgb = DARK
                r.font.name = "Arial"

        elif sec_type == "callout":
            # Create a callout box using a single-cell table with navy background
            table = doc.add_table(rows=1, cols=1)
            cell = table.cell(0, 0)
            _set_cell_shading(cell, "002854")

            # Callout label
            if sec.get("label"):
                p_label = cell.paragraphs[0]
                r_label = p_label.add_run(sec["label"].upper())
                r_label.font.size = Pt(8)
                r_label.font.color.rgb = GOLD
                r_label.font.bold = True
                r_label.font.name = "Arial"
                p_label.paragraph_format.space_after = Pt(4)

            # Callout text
            p_text = cell.add_paragraph()
            r_text = p_text.add_run(sec.get("text", ""))
            r_text.font.size = Pt(10)
            r_text.font.color.rgb = WHITE
            r_text.font.italic = True
            r_text.font.name = "Arial"
            p_text.paragraph_format.space_after = Pt(4)

            # Attribution
            if sec.get("attribution"):
                p_attr = cell.add_paragraph()
                r_attr = p_attr.add_run(f"\u2014 {sec['attribution']}")
                r_attr.font.size = Pt(8)
                r_attr.font.color.rgb = STEEL
                r_attr.font.name = "Arial"

            doc.add_paragraph()  # spacing after callout

        elif sec_type == "table":
            headers = sec.get("headers", [])
            rows_data = sec.get("rows", [])
            if headers and rows_data:
                table = doc.add_table(rows=1 + len(rows_data), cols=len(headers))
                table.style = "Table Grid"
                # Header row
                for i, h_text in enumerate(headers):
                    cell = table.cell(0, i)
                    _set_cell_shading(cell, "002854")
                    p = cell.paragraphs[0]
                    r = p.add_run(h_text)
                    r.font.size = Pt(9)
                    r.font.color.rgb = WHITE
                    r.font.bold = True
                    r.font.name = "Arial"
                # Data rows
                for row_idx, row_data in enumerate(rows_data):
                    for col_idx, cell_text in enumerate(row_data):
                        cell = table.cell(row_idx + 1, col_idx)
                        p = cell.paragraphs[0]
                        r = p.add_run(str(cell_text))
                        r.font.size = Pt(9)
                        r.font.color.rgb = DARK
                        r.font.name = "Arial"
                        # Alternate row shading
                        if row_idx % 2 == 1:
                            _set_cell_shading(cell, "F5F5F5")
                doc.add_paragraph()  # spacing

        elif sec_type == "page_break":
            doc.add_page_break()

    return doc


def main():
    try:
        import io
        stdin_text = io.TextIOWrapper(sys.stdin.buffer, encoding="utf-8").read()
        data = json.loads(stdin_text)
    except json.JSONDecodeError as exc:
        print(f"Invalid JSON on stdin: {exc}", file=sys.stderr)
        sys.exit(1)

    doc = create_document(data)

    fd, tmp_path = tempfile.mkstemp(suffix=".docx")
    try:
        doc.save(tmp_path)
    except Exception as exc:
        print(f"Failed to save document: {exc}", file=sys.stderr)
        sys.exit(1)
    finally:
        os.close(fd)

    print(tmp_path)


if __name__ == "__main__":
    main()
