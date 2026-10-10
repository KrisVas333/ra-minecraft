#!/usr/bin/env python3
"""Inline generated SVG between @marker comments (idempotent).
  python3 tools/art.py && python3 tools/build.py
"""
import os, re
ROOT = os.path.join(os.path.dirname(__file__), "..")
A = lambda n: open(os.path.join(ROOT, "assets", n), encoding="utf-8").read()

def inline(path, marker, svg):
    p = os.path.join(ROOT, path)
    s = open(p, encoding="utf-8").read()
    pat = re.compile(r"(<!--@%s start-->).*?(<!--@%s end-->)" % (marker, marker), re.S)
    assert pat.search(s), f"{path}: marker @{marker} missing"
    s = pat.sub(lambda m: m.group(1) + "\n" + svg + "\n" + m.group(2), s)
    open(p, "w", encoding="utf-8").write(s)

hero = A("hero-island.svg")
inline("index.html", "hero", hero)
inline("index.html", "thanks", hero.replace('class="island"', 'class="island done"'))
if os.path.exists(os.path.join(ROOT, "lankstinukas", "index.html")):
    inline("lankstinukas/index.html", "hero", hero)
    inline("lankstinukas/index.html", "qr", A("qr-lankstinukas.svg"))
print("inlined")
