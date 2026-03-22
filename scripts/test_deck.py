#!/usr/bin/env python3
"""Test all 3 deck generation modes."""
import subprocess
import json
import os
import sys
import shutil

script_dir = os.path.dirname(os.path.abspath(__file__))
project_dir = os.path.dirname(script_dir)
script = os.path.join(script_dir, "generate_deck.py")

test_slides = {
    "title": "Test Deck",
    "slides": [
        {
            "layout": "stats",
            "title": "The Data Reality in Banking",
            "stats": [
                {"value": ">33%", "label": "of banking processes remain unautomated"},
                {"value": "90%", "label": "indicate needed data is often unavailable"},
                {"value": "45%", "label": "cite data accuracy as top barrier to AI"}
            ],
            "speakerNotes": "Banking-specific stats."
        },
        {
            "layout": "comparison",
            "title": "Why Buy Beats Build for Trade Finance",
            "comparison": {
                "headers": ["Capability", "Tungsten", "DIY on Azure"],
                "rows": [
                    ["Time to production", "1-2 months", "6-12 months"],
                    ["Trade finance rules", "Pre-built", "Must build"],
                    ["Audit trail", "Built-in", "Must build"]
                ]
            },
            "speakerNotes": "Comparison table."
        },
        {
            "layout": "content-white",
            "title": "Real Results in Global Banking",
            "bullets": [
                "Top 10 NA bank: $2.5M annual savings",
                "Southern European bank: 333% efficiency increase",
                "FedEx: $40M+ annual ROI"
            ],
            "speakerNotes": "Proof points."
        }
    ]
}

tests = [
    ("Slides Only (replace-all)", "TungstenAutomation.potx", "replace-all"),
    ("L0 Deck (insert-after-1)", "TungstenL0.pptx", "insert-after-1"),
    ("SBR Deck (insert-after-3)", "TungstenSBR.pptx", "insert-after-3"),
]

for label, template, mode in tests:
    template_path = os.path.join(project_dir, "templates", template)
    args = [sys.executable, script, template_path, "--mode", mode]

    result = subprocess.run(
        args,
        input=json.dumps(test_slides),
        capture_output=True,
        text=True,
        encoding="utf-8"
    )

    if result.returncode == 0 and result.stdout.strip():
        pptx_path = result.stdout.strip()
        size = os.path.getsize(pptx_path)
        # Count slides
        from pptx import Presentation
        prs = Presentation(pptx_path)
        slide_count = len(prs.slides)
        print(f"OK  {label}: {slide_count} slides, {size:,} bytes")
        # Copy for inspection
        safe_name = label.split("(")[0].strip().replace(" ", "_").lower()
        dest = os.path.join(project_dir, f"test_{safe_name}.pptx")
        shutil.copy2(pptx_path, dest)
        os.unlink(pptx_path)
    else:
        print(f"FAIL {label}: RC={result.returncode}")
        if result.stderr:
            print(f"     STDERR: {result.stderr.strip()}")
