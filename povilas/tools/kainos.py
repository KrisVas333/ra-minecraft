#!/usr/bin/env python3
"""kainos.py: po config.js pakeitimo perrašo VISAS išvestines kopijas vienu žingsniu.

    python3 v2/tools/kainos.py            # iš repo šaknies (arba iš bet kur: kelias absoliutus)
    python3 v2/tools/kainos.py --no-render  # tik tekstai, be og.jpg ir PDF (greita patikra)
    python3 v2/tools/kainos.py --root /kelias/iki/repo

Ką daro:
  1. Perskaito v2/config.js (vienintelis kainų ir tekstų šaltinis).
  2. Perrašo atsarginį tekstą kiekviename `data-cfg="..."` elemente (puslapis, lankstinukas, komandai),
     kad tą patį matytų ir paieškos robotai, ir naršyklė be JavaScript.
  3. Perrašo sąrašus iš config (`#incl`, `#school-tiles`, `#org-needs`).
  4. Patikrina, kad meta description / og:description neturėtų kainų (jos ten nerašomos).
  5. Pergeneruoja og.jpg (v2/tools/og-src.html → headless Chrome → sips) ir lankstinuko PDF (headless Chrome).
  6. Išspausdina, kas pasikeitė. Reikia: python3, node (config.js nuskaitymui) ir Google Chrome (5 žingsniui).
"""
import html
import json
import os
import re
import shutil
import subprocess
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(HERE, '..', '..'))
if '--root' in sys.argv:
    ROOT = os.path.abspath(sys.argv[sys.argv.index('--root') + 1])
V2 = os.path.join(ROOT, 'v2')
CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
NBSP = ' '
RENDER = '--no-render' not in sys.argv

PAGES = [
    os.path.join(V2, 'index.html'),
    os.path.join(V2, 'lankstinukas', 'index.html'),
    os.path.join(V2, 'komandai', 'index.html'),
    os.path.join(HERE, 'og-src.html'),
]
LISTS = {'incl': ('included',), 'school-tiles': ('school', 'tiles'), 'org-needs': ('school', 'needs')}
# tekstai, kurie rodomi tik įjungus vėliavą: kol ji false, atsarginis tekstas lieka tuščias (puslapyje nėra nei „0 €", nei COI eilutės)
GATES = {'firstLessonLine': 'firstLessonFree', 'coi.text': 'coi.show'}


def load_cfg():
    cfg_path = os.path.join(V2, 'config.js')
    node = shutil.which('node')
    if node:
        js = "global.window={};require(process.argv[1]);process.stdout.write(JSON.stringify(window.RA_CFG))"
        out = subprocess.run([node, '-e', js, cfg_path], capture_output=True, text=True)
        if out.returncode == 0 and out.stdout.strip():
            return json.loads(out.stdout)
        print('node nepavyko:', out.stderr.strip()[:200])
    if os.path.exists(CHROME):
        tmp = os.path.join(HERE, '_cfg.html')
        with open(tmp, 'w', encoding='utf-8') as f:
            f.write('<!doctype html><meta charset="utf-8"><script src="../config.js"></script><pre id="o"></pre><script>document.getElementById("o").textContent=JSON.stringify(window.RA_CFG)</script>')
        out = subprocess.run([CHROME, '--headless=new', '--disable-gpu', '--allow-file-access-from-files', '--dump-dom', 'file://' + tmp], capture_output=True, text=True, timeout=60)
        os.remove(tmp)
        m = re.search(r'<pre id="o">(.*?)</pre>', out.stdout, re.S)
        if m:
            return json.loads(html.unescape(m.group(1)))
    sys.exit('Nepavyko perskaityti config.js: reikia node arba Google Chrome.')


def eur(n):
    s = ('%.2f' % (round(n * 100) / 100.0)).replace('.00', '').replace('.', ',')
    return s + NBSP + '€'


def get(cfg, path):
    m = path.split('.')
    if m[0] == 'price' and m[1] in cfg.get('prices', {}):
        return eur(cfg['prices'][m[1]]['amount'])
    if m[0] == 'perlesson' and m[1] in cfg.get('prices', {}):
        return eur(cfg['prices'][m[1]]['amount'] / float(cfg.get('lessonsPerMonth') or 4))
    v = cfg
    for k in m:
        if not isinstance(v, dict) or k not in v:
            return None
        v = v[k]
    return v


def tpl(s, cfg):
    return re.sub(r'\{\{([\w.]+)\}\}', lambda mm: '' if get(cfg, mm.group(1)) is None else str(get(cfg, mm.group(1))), str(s))


def esc(s):
    return html.escape(str(s), quote=False).replace(NBSP, '&nbsp;')


def rewrite_cfg(text, cfg, changes, label):
    pat = re.compile(r'<(\w+)([^>]*?\sdata-cfg="([^"]+)"[^>]*)>([^<]*)</\1>')

    def rep(m):
        tag, attrs, keys, inner = m.group(1), m.group(2), m.group(3), m.group(4)
        vals = []
        for k in keys.split('|'):
            k = k.strip()
            v = get(cfg, k)
            if v is None:
                return m.group(0)
            if k in GATES and not get(cfg, GATES[k]):
                v = ''
            vals.append(tpl(v, cfg) if isinstance(v, str) else str(v))
        new = esc(' · '.join(vals))
        if new != inner:
            changes.append((label, keys, html.unescape(inner), html.unescape(new)))
        return '<%s%s>%s</%s>' % (tag, attrs, new, tag)
    return pat.sub(rep, text)


def rewrite_lists(text, cfg, changes, label):
    for lid, path in LISTS.items():
        items = get(cfg, '.'.join(path))
        if not items:
            continue
        m = re.search(r'(<ul[^>]*\sid="%s"[^>]*>)(.*?)(</ul>)' % lid, text, re.S)
        if not m:
            continue
        first = re.search(r'(\s*)<li>(<img[^>]*>)<span>', m.group(2))
        indent, img = (first.group(1), first.group(2)) if first else ('\n      ', '<img class="px" src="assets/v1/ico-check-navy.svg" alt="">')
        body = ''.join('%s<li>%s<span>%s</span></li>' % (indent, img, esc(tpl(t, cfg))) for t in items) + indent.rstrip(' ') + '    '
        old_items = [html.unescape(x) for x in re.findall(r'<span>([^<]*)</span>', m.group(2))]
        new_items = [html.unescape(esc(tpl(t, cfg))) for t in items]
        if old_items != new_items:
            changes.append((label, '#' + lid, ' | '.join(old_items), ' | '.join(new_items)))
            text = text[:m.start(2)] + body + text[m.end(2):]
    return text


def rewrite_age(text, cfg, changes, label):
    """Amžiaus intervalas (ageLabel '1–4 klasė') ir <title>, meta, og:title bei formos klausime."""
    m = re.match(r'(\d+)[–-](\d+)', str(cfg.get('ageLabel') or ''))
    if not m:
        return text
    rng = m.group(1) + '–' + m.group(2)
    out = text
    for pat in (r'būrelis \d+–\d+ klasei', r'· \d+–\d+ kl\.</title>', r'Kiek \d+–\d+ klasių'):
        for old in set(re.findall(pat, out)):
            new = re.sub(r'\d+–\d+', rng, old)
            if new != old:
                changes.append((label, 'ageLabel', old, new))
                out = out.replace(old, new)
    return out


def check_meta(text, label, warnings):
    for name, rx in (('description', r'<meta name="description" content="([^"]*)"'), ('og:description', r'<meta property="og:description" content="([^"]*)"')):
        m = re.search(rx, text)
        if m and re.search(r'\d\s*€', m.group(1)):
            warnings.append('%s: %s turi kainą; kainos meta tekste nerašomos' % (label, name))


def render_og():
    tmp_png = os.path.join(HERE, '_og.png')
    subprocess.run([CHROME, '--headless=new', '--disable-gpu', '--hide-scrollbars', '--allow-file-access-from-files',
                    '--window-size=1200,630', '--virtual-time-budget=6000', '--screenshot=' + tmp_png,
                    'file://' + os.path.join(HERE, 'og-src.html')], capture_output=True, text=True, timeout=120)
    if not os.path.exists(tmp_png):
        return 'og.jpg: Chrome nesukūrė ekrano kopijos'
    out = os.path.join(V2, 'og.jpg')
    subprocess.run(['sips', '-s', 'format', 'jpeg', '-s', 'formatOptions', '84', tmp_png, '--out', out], capture_output=True, text=True, timeout=120)
    os.remove(tmp_png)
    return 'og.jpg: %d KB' % (os.path.getsize(out) // 1024)


def render_pdf():
    out = os.path.join(V2, 'lankstinukas', 'lankstinukas.pdf')
    subprocess.run([CHROME, '--headless=new', '--disable-gpu', '--allow-file-access-from-files', '--no-pdf-header-footer',
                    '--virtual-time-budget=8000', '--print-to-pdf=' + out,
                    'file://' + os.path.join(V2, 'lankstinukas', 'index.html')], capture_output=True, text=True, timeout=180)
    return 'lankstinukas.pdf: %d KB' % (os.path.getsize(out) // 1024) if os.path.exists(out) else 'lankstinukas.pdf: nepavyko'


def main():
    cfg = load_cfg()
    changes, warnings = [], []
    for page in PAGES:
        label = os.path.relpath(page, ROOT)
        with open(page, encoding='utf-8') as f:
            text = f.read()
        new = rewrite_cfg(text, cfg, changes, label)
        new = rewrite_lists(new, cfg, changes, label)
        new = rewrite_age(new, cfg, changes, label)
        check_meta(new, label, warnings)
        if new != text:
            with open(page, 'w', encoding='utf-8') as f:
                f.write(new)
    print('config.js: mokykloje %s · centre %s · %s pamokos po %s min' % (
        get(cfg, 'price.mokykla'), get(cfg, 'price.centras'), cfg.get('lessonsPerMonth'), cfg.get('lessonMinutes')))
    if changes:
        print('Pakeista %d vietų:' % len(changes))
        for label, key, old, new in changes:
            print('  %s  %s: "%s" -> "%s"' % (label, key, old[:60], new[:60]))
    else:
        print('Tekstai jau sutapo su config.js, nieko nekeista.')
    for w in warnings:
        print('  ⚠ ' + w)
    if RENDER:
        if not os.path.exists(CHROME):
            print('Chrome nerastas: og.jpg ir PDF nepergeneruoti.')
        else:
            print(render_og())
            print(render_pdf())
    else:
        print('(--no-render: og.jpg ir PDF nepergeneruoti)')
    print('Toliau: git add -A && git commit -m "config: kainos" && git push')


if __name__ == '__main__':
    main()
