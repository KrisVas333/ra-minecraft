#!/usr/bin/env python3
"""Original voxel / pixel art for the RA „Žaidimų kūrėjai" site.

Everything here is drawn from scratch (ASCII pixel maps + isometric cube math).
No Minecraft textures, logos, characters or screenshots are used anywhere.

  python3 tools/art.py        -> writes assets/*.svg and assets/hero-island.svg
"""
import os, json

OUT = os.path.join(os.path.dirname(__file__), "..", "assets")
os.makedirs(OUT, exist_ok=True)

# ---------------------------------------------------------------- palette
P = {
    "G": ("#6CC644", "#4FA534", "#3B7F27"),   # grass: top, left, right
    "D": ("#A0703F", "#7D5531", "#5E3F24"),   # dirt
    "S": ("#B3B3B3", "#8F8F8F", "#6F6F6F"),   # stone
    "W": ("#4FB2F7", "#2F8FDD", "#2374BC"),   # water
    "L": ("#8B5E34", "#6E4727", "#52351D"),   # log / wood
    "F": ("#3FA83F", "#2F8A2F", "#246B24"),   # leaves (foliage)
    "Y": ("#FEC404", "#DBA600", "#B88A00"),   # gold  (= RA yellow)
    "C": ("#6FEFF5", "#3FCBD6", "#239FAA"),   # diamond (cyan)
    "R": ("#D9663A", "#B64E29", "#8F3C1E"),   # mars red
    "K": ("#2E2E38", "#1F1F27", "#15151B"),   # dark / obsidian
    "P": ("#F6C7D8", "#E89CB7", "#C7779A"),   # pink (sheep/pig style, generic)
    "O": ("#FFFFFF", "#E5E5E5", "#C9C9C9"),   # white / snow / wool
}

# ---------------------------------------------------------------- isometric
TW, TH, TZ = 16, 8, 16   # half tile width, half tile height, block height


def cube(x, y, z, kind, cls="vx", extra=""):
    top, left, right = P[kind]
    sx = (x - y) * TW
    sy = (x + y) * TH - z * TZ
    t = f"{sx},{sy-TH} {sx+TW},{sy} {sx},{sy+TH} {sx-TW},{sy}"
    l = f"{sx-TW},{sy} {sx},{sy+TH} {sx},{sy+TH+TZ} {sx-TW},{sy+TZ}"
    r = f"{sx+TW},{sy} {sx},{sy+TH} {sx},{sy+TH+TZ} {sx+TW},{sy+TZ}"
    return (f'<g class="{cls}" data-k="{kind}" {extra}>'
            f'<polygon points="{l}" fill="{left}"/>'
            f'<polygon points="{r}" fill="{right}"/>'
            f'<polygon points="{t}" fill="{top}"/></g>')


def island():
    """8x8 heightmap island with pond, tree, fortress corner, gold + diamond."""
    H = [  # ground height per cell (0 = sea)
        [0,0,1,1,1,1,0,0],
        [0,1,1,2,2,1,1,0],
        [1,1,2,2,2,2,1,1],
        [1,2,2,3,3,2,2,1],
        [1,2,2,3,3,2,2,1],
        [1,1,2,2,2,2,1,1],
        [0,1,1,2,2,1,1,0],
        [0,0,1,1,1,1,0,0],
    ]
    pond = {(1,4),(1,5),(2,5)}
    blocks = []  # (x,y,z,kind,tag)
    for y in range(8):
        for x in range(8):
            h = H[y][x]
            if h == 0:
                continue
            for z in range(h):
                if (x,y) in pond and z == h-1:
                    blocks.append((x,y,z,"W","pond"))
                elif z == h-1:
                    blocks.append((x,y,z,"G","ground"))
                else:
                    blocks.append((x,y,z,"D","ground"))
    # tree at (6,2): trunk on top of ground height
    gx, gy = 6, 2
    base = H[gy][gx]
    for z in range(base, base+2):
        blocks.append((gx,gy,z,"L","tree"))
    for dy in (-1,0,1):
        for dx in (-1,0,1):
            blocks.append((gx+dx,gy+dy,base+2,"F","tree"))
    blocks.append((gx,gy,base+3,"F","tree"))
    # fortress corner: stone wall on the plateau (3,3)-(4,3) + (3,4), gold gate block
    for (x,y) in [(2,3),(3,2),(4,2)]:
        blocks.append((x,y,H[y][x],"S","wall"))
    blocks.append((2,2,H[2][2],"S","wall"))
    blocks.append((2,2,H[2][2]+1,"S","wall"))
    blocks.append((5,2,H[2][5],"Y","gold"))
    # diamond block on the peak
    blocks.append((4,4,H[4][4],"C","diamond"))
    blocks.append((3,4,H[4][3],"S","wall"))
    # painter order: by (x+y), then z
    blocks.sort(key=lambda b: (b[0]+b[1], b[2]))
    # build order (animation): ground z=0 first, then z=1 ... then decorations
    order = {}
    seq = sorted(blocks, key=lambda b: (0 if b[4]=="ground" or b[4]=="pond" else 1, b[2], b[0]+b[1]))
    for i,b in enumerate(seq):
        order[b] = i
    body = "".join(cube(x,y,z,k,"vx",f'data-o="{order[(x,y,z,k,t)]}" data-t="{t}"') for (x,y,z,k,t) in blocks)
    # bounds: x-y in [-7,7] -> sx in [-112,112]; sy from -? to ~ (14*8 + 16+8)
    svg = (f'<svg class="island" viewBox="-140 -100 280 240" xmlns="http://www.w3.org/2000/svg" '
           f'role="img" aria-label="Blokų sala: žolė, akmens siena, auksas ir deimantas" shape-rendering="crispEdges">'
           f'{body}</svg>')
    return svg, len(blocks)


# ---------------------------------------------------------------- pixel maps
PX = {
    ".": None,
    "g": "#6CC644", "G": "#3B7F27", "d": "#A0703F", "D": "#5E3F24",
    "s": "#B3B3B3", "S": "#6F6F6F", "w": "#4FB2F7", "W": "#2374BC",
    "l": "#8B5E34", "f": "#3FA83F", "F": "#246B24", "y": "#FEC404", "Y": "#B88A00",
    "c": "#6FEFF5", "C": "#239FAA", "r": "#D9663A", "R": "#8F3C1E", "k": "#2E2E38",
    "o": "#FFFFFF", "p": "#F6C7D8", "P": "#C7779A", "b": "#5B6CE0", "B": "#2E3F9E",
    "n": "#152039", "x": "#FF5A5A", "i": "#F7E7C5",
}


def pixmap(rows, px=8, cls="px", label=""):
    h = len(rows); w = max(len(r) for r in rows)
    rects = []
    for yy, row in enumerate(rows):
        xx = 0
        while xx < len(row):
            ch = row[xx]
            col = PX.get(ch)
            run = 1
            while xx+run < len(row) and row[xx+run] == ch:
                run += 1
            if col:
                rects.append(f'<rect x="{xx}" y="{yy}" width="{run}" height="1" fill="{col}"/>')
            xx += run
    return (f'<svg class="{cls}" viewBox="0 0 {w} {h}" xmlns="http://www.w3.org/2000/svg" '
            f'shape-rendering="crispEdges" role="img" aria-label="{label}">' + "".join(rects) + '</svg>')


SKY = "b"
# 24 x 16 scenes
GAMES = {
"skiemenu-tiltas": ("Skiemenų tiltas: tiltas iš teisingų skiemenų blokų", [
"bbbbbbbbbbbbbbbbbbbbbbbb",
"bbbbbbbbbbbbbbbbbbbbbbbb",
"bbbbbbbbbbbbbbbbbbbbbbbb",
"bbbbbbbbbbbbbbbbbbffffbb",
"bbbbbbbbbbbbbbbbbbflfbbb",
"ggggbbbbbbbbbbbbbggggggg",
"ddddbbbbbbbbbbbbbddddddd",
"ddddyyyyllllyyyybddddddd",
"ddddYyyYllllYyyYbddddddd",
"wwwwwwwwwwwwwwwwwwwwwwww",
"wWwwwWwwwwWwwwWwwwwWwwwW",
"wwwwwwwwwwwwwwwwwwwwwwww",
"wwwWwwwwwwwWwwwwwwWwwwww",
"wwwwwwwwwwwwwwwwwwwwwwww",
"wwwwwwWwwwwwwwwwwwwwwwww",
"wwwwwwwwwwwwwwwwwwwwwwww",
]),
"daugybos-tvirtove": ("Daugybos tvirtovė: siena iš 4×6 blokų ir vartai", [
"bbbbbbbbbbbbbbbbbbbbbbbb",
"bbbbbbbbbbbbbbbbbbbbbbbb",
"bbssbbssbbbbbbbbssbbssbb",
"bbssssssbbbbbbbbssssssbb",
"bbsSsSssbbbbbbbbssSsSsbb",
"bbssssssssssssssssssssbb",
"bbsSsSsSsSsSsSsSsSsSsSbb",
"bbssssssssssssssssssssbb",
"bbsSsSsSsSyyyysSsSsSsSbb",
"bbssssssssyYYyssssssssbb",
"bbsSsSsSsSyyyysSsSsSsSbb",
"bbssssssssyYYyssssssssbb",
"gggggggggggggggggggggggg",
"ddddddddddddddddddddddDd",
"dDddddddddDddddddddddddd",
"dddddddddddddddddddddddd",
]),
"gyvunu-rezervatas": ("Gyvūnų rezervatas: kiekvienam gyvūnui tinkamas biomas", [
"bbbbbbbbbbbbbbbbbbbbbbbb",
"bbbbbbbbbbbbbbbbbbbbbbbb",
"bbbffffbbbbbbbbbbbbbbbbb",
"bbffffffbbbbbbbbbbbbbbbb",
"bbbfllfbbbbbbbbbbbbbbbbb",
"bbbbllbbbbbbbbbbbbbbbbbb",
"ggggllgggggggggggggggggg",
"ggggggggggoooogggggggggg",
"ggggggggggoooogggppppggg",
"gggggggggkokokggpkppkpgg",
"gggggggggggggggggggggggg",
"gggggggwwwwwwwwwwwwggggg",
"ggggggwwwwwWwwwwwwwwgggg",
"gggggwwwWwwwwwwwWwwwwggg",
"ggggggwwwwwwwwWwwwwwgggg",
"gggggggwwwwwwwwwwwwggggg",
]),
"raidziu-gaudykle": ("Raidžių gaudyklė: gaudyk raides iš eilės", [
"nnnnnnnnnnnnnnnnnnnnnnnn",
"nnnnnnnnnnnnnnnnnnnnnnnn",
"nnnyyynnnnnnnnnnnnnnnnnn",
"nnnynynnnnnnnnnncccnnnnn",
"nnnyyynnnnnnnnnncnnnnnnn",
"nnnynynnnnpppnnncccnnnnn",
"nnnnnnnnnnpnpnnnnnnnnnnn",
"nnnnnnnnnnpppnnnnnnnnnnn",
"nnnnnnnnnnpnpnnnnnnnnnnn",
"nnnnnnnnnnpnpnnnnnnnnnnn",
"nnnnnnnnnnnnnnnnnnnnnnnn",
"nnnnnnnnnllllllnnnnnnnnn",
"nnnnnnnnnlddddlnnnnnnnnn",
"nnnnnnnnnlddddlnnnnnnnnn",
"nnnnnnnnnllllllnnnnnnnnn",
"nnnnnnnnnnnnnnnnnnnnnnnn",
]),
"skaiciu-lenktynes": ("Skaičių lenktynės: mašina greitėja už teisingą atsakymą", [
"bbbbbbbbbbbbbbbbbbbbbbbb",
"bbbbbbbbbbbbbbbbbbbbbbbb",
"bbbbbbbbbbbbbbbbbbbbbbbb",
"bbbbyyybbbbbbbbbbyyybbbb",
"gggggggggggggggggggggggg",
"SSSSSSSSSSSSSSSSSSSSSSSS",
"ssssssssssssssssssssssss",
"ssssooooossssssssssssss.",
"ssssssssssssssxxxxxsssss",
"ssssssssssssxxxxxxxxssss",
"ssssssssssssxxkkxxkkxsss",
"sssssssssssskkkkkkkkksss",
"ssssssssssssskkssskksss.",
"ssooooossssssssssoooooss",
"SSSSSSSSSSSSSSSSSSSSSSSS",
"gggggggggggggggggggggggg",
]),
"marso-baze": ("Marso bazė: saulės jėgainės ir kupolas", [
"nnnnnnnnnnnnnnnnnnnnnnnn",
"nnnnnonnnnnnnnnnnnnnnnnn",
"nnnnnnnnnnnnnnnnnnnonnnn",
"nnnnnnnnnnnnnnnnnnnnnnnn",
"nnnnnnnnnnccccccnnnnnnnn",
"nnnnnnnnncccccccccnnnnnn",
"nnnnnnnncccccccccccnnnnn",
"nnbbbbnnccccccccccccnnnn",
"nnBBBBnnccccccccccccnnnn",
"nnnknnnnccccyyyycccccnnn",
"nnnknnnnccccyyyycccccnnn",
"rrrrrrrrrrrrrrrrrrrrrrrr",
"rRrrrrrrRrrrrrrrrrrRrrrr",
"rrrrrrrrrrrrrrrrrrrrrrrr",
"rrrrrRrrrrrrrRrrrrrrrrrr",
"rrrrrrrrrrrrrrrrrrrrrrrr",
]),
}

# 10x10 icons, single-colour maps drawn in white ("o") with an accent ("y"/"c"/"g")
ICONS = {
"clock": [
"...oooo...",
"..o....o..",
".o......o.",
"o...o....o",
"o...o....o",
"o...ooo..o",
"o........o",
".o......o.",
"..o....o..",
"...oooo...",
],
"tablet": [
"oooooooooo",
"o........o",
"o.cccccc.o",
"o.cccccc.o",
"o.cccccc.o",
"o.cccccc.o",
"o.cccccc.o",
"o........o",
"o...oo...o",
"oooooooooo",
],
"shield": [
"..oooooo..",
".o......o.",
"o..g..g..o",
"o..g..g..o",
"o..gggg..o",
"o..g..g..o",
".o.g..g.o.",
".o......o.",
"..o....o..",
"...oooo...",
],
"group": [
"..oo..oo..",
".o..oo..o.",
".o..oo..o.",
"..oo..oo..",
"..........",
".oooooooo.",
"o........o",
"o........o",
"o........o",
"oooooooooo",
],
"pin": [
"...oooo...",
"..o....o..",
".o..yy..o.",
".o..yy..o.",
".o......o.",
"..o....o..",
"...o..o...",
"....oo....",
"....oo....",
"....oo....",
],
"euro": [
"....oooo..",
"...o....o.",
"..o.......",
".oooooo...",
"..o.......",
".oooooo...",
"..o.......",
"...o....o.",
"....oooo..",
"..........",
],
"block": [
"....oo....",
"..oo..oo..",
"oo......oo",
"o.oo..oo.o",
"o...oo...o",
"o...oo...o",
"o...oo...o",
"oo..oo..oo",
"..oo..oo..",
"....oo....",
],
"chip": [
".o.o.o.o..",
"oooooooooo",
".o......o.",
"oo.cccc.oo",
".o.c..c.o.",
".o.c..c.o.",
"oo.cccc.oo",
".o......o.",
"oooooooooo",
".o.o.o.o..",
],
"book": [
".ooooooooo",
"o........o",
"o.oooooo.o",
"o........o",
"o.oooooo.o",
"o........o",
"o.oooo...o",
"o........o",
"o........o",
".ooooooooo",
],
"calc": [
"oooooooooo",
"o........o",
"o.yyyyyy.o",
"o........o",
"o.o.o.o..o",
"o........o",
"o.o.o.o..o",
"o........o",
"o.o.o.oo.o",
"oooooooooo",
],
"leaf": [
".......oo.",
".....oogg.",
"...oogggg.",
"..oggggg..",
".oggggg...",
".ogggg....",
"ogggo.....",
"ogg.......",
"oo........",
"o.........",
],
"heart": [
"..........",
".oo...oo..",
"oxxo.oxxo.",
"oxxxoxxxo.",
"oxxxxxxxo.",
".oxxxxxo..",
"..oxxxo...",
"...oxo....",
"....o.....",
"..........",
],
"check": [
"..........",
".........o",
"........oo",
".......oo.",
"o.....oo..",
"oo...oo...",
".oo.oo....",
"..ooo.....",
"...o......",
"..........",
],
"home": [
"....oo....",
"...o..o...",
"..o....o..",
".o......o.",
"o..oooo..o",
".o.o..o.o.",
".o.o..o.o.",
".o.oyyo.o.",
".o.oyyo.o.",
".ooooooooo",
],
"school": [
"....oo....",
"..oooooo..",
"oooooooooo",
"o........o",
"o.oo..oo.o",
"o.oo..oo.o",
"o........o",
"o.oo.yy..o",
"o.oo.yy..o",
"oooooooooo",
],
"cloud": [
"........oooo......",
"......oooooooo....",
"..oooooooooooooo..",
"oooooooooooooooooo",
"oooooooooooooooooo",
"..oooooooooooooo..",
],
"question": [
"...oooo...",
"..o....o..",
".o......o.",
"........o.",
".......o..",
"......o...",
".....o....",
".....o....",
"..........",
".....o....",
],
}


def write(name, svg):
    with open(os.path.join(OUT, name), "w") as f:
        f.write(svg)


if __name__ == "__main__":
    hero, n = island()
    write("hero-island.svg", hero)
    for slug,(label,rows) in GAMES.items():
        write(f"game-{slug}.svg", pixmap(rows, cls="px game", label=label))
    for k,rows in ICONS.items():
        write(f"ico-{k}.svg", pixmap(rows, cls="px ico", label=""))
    write("ico-check-navy.svg", pixmap(ICONS["check"], cls="px ico", label="").replace('#FFFFFF','#152039'))
    # favicon: a single gold block on transparent
    write("favicon.svg", '<svg xmlns="http://www.w3.org/2000/svg" viewBox="-18 -10 36 36" shape-rendering="crispEdges">'
          + cube(0,0,0,"Y","") + '</svg>')
    print(f"hero island blocks: {n}; games: {len(GAMES)}; icons: {len(ICONS)}")
