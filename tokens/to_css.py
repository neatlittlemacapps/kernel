#!/usr/bin/env python3
"""Flatten DTCG tokens to CSS custom properties with theme + density contexts.
Handles colour objects, dimensions ({value,unit}) and fontFamily (arrays)."""
import json, re, sys, pathlib
ALIAS = re.compile(r"^\{(.+)\}$")
# DTCG fontWeight keywords → CSS numeric (CSS font/font-weight reject "regular","semi-bold").
WEIGHT_MAP = {"thin":"100","hairline":"100","extra-light":"200","ultra-light":"200",
              "light":"300","normal":"400","regular":"400","book":"400","medium":"500",
              "semi-bold":"600","demi-bold":"600","bold":"700","extra-bold":"800",
              "ultra-bold":"800","black":"900","heavy":"900"}

def walk(node, path, out):
    if not isinstance(node, dict): return
    if "$value" in node:
        name = "-".join(path); v = node["$value"]
        out.append((name, v))
        # Typography composite → ALSO emit longhand parts, so components can bind
        # a named role (e.g. var(--typography-body-md-font-size)) WITHOUT the CSS
        # `font` shorthand, which would reset font-family/variant. This is the
        # role-per-part application surface (Polaris/Carbon style).
        if isinstance(v, dict) and ("fontSize" in v or "fontFamily" in v):
            for sub, suffix in (("fontFamily", "font-family"), ("fontSize", "font-size"),
                                ("fontWeight", "font-weight"), ("lineHeight", "line-height")):
                if sub in v: out.append((name + "-" + suffix, v[sub]))
        return
    for k, v in node.items():
        if k.startswith("$"): continue
        walk(v, path + [k], out)

def shadow_str(s):
    def dim(d):
        return f'{d["value"]}{d["unit"]}' if isinstance(d, dict) else str(d)
    return " ".join([
        dim(s["offsetX"]), dim(s["offsetY"]),
        dim(s.get("blur", {"value": 0, "unit": "px"})),
        dim(s.get("spread", {"value": 0, "unit": "px"})),
        render(s["color"]),
    ])

def render(v):
    if isinstance(v, str):
        m = ALIAS.match(v)
        if m: return "var(--" + m.group(1).replace(".", "-") + ")"
        return WEIGHT_MAP.get(v, v)
    if isinstance(v, list):
        if v and isinstance(v[0], dict) and "offsetX" in v[0]:  # shadow layers
            return ", ".join(shadow_str(s) for s in v)
        # cubicBezier — 4 numbers
        if len(v) == 4 and all(isinstance(x, (int, float)) for x in v):
            return f"cubic-bezier({v[0]}, {v[1]}, {v[2]}, {v[3]})"
        return ", ".join(f'"{x}"' if " " in x else x for x in v)  # fontFamily
    if isinstance(v, dict):
        if "fontSize" in v or "fontFamily" in v:  # typography composite → CSS `font` shorthand
            fw = render(v.get("fontWeight", "normal")); fs = render(v.get("fontSize", "inherit"))
            lh = render(v.get("lineHeight", "normal")); ff = render(v.get("fontFamily", "inherit"))
            return f"{fw} {fs}/{lh} {ff}"
        if "offsetX" in v:  # single shadow
            return shadow_str(v)
        if "colorSpace" in v:
            a = v.get("alpha", 1)
            if a is not None and a < 1:
                comp = v.get("components")
                if v["colorSpace"] == "srgb" and comp:
                    r, g, b = [round(c * 255) for c in comp[:3]]
                    return f"rgb({r} {g} {b} / {a})"
                # OKLCH translucent → emit oklch(L C H / a). Without this the
                # alpha was silently dropped (fell through to the opaque hex
                # fallback below), which is why translucent overlays used to be
                # authored as sRGB. Keeps alpha on the cross-platform OKLCH core.
                if v["colorSpace"] == "oklch" and comp:
                    L, C, H = comp[:3]
                    return f"oklch({L} {C} {H} / {a})"
                return v.get("hex", "#000")
            return v.get("hex", "#000")
        if "value" in v and "unit" in v:  # dimension
            return f'{v["value"]}{v["unit"]}'
    return str(v)

def block_pairs(root, rel):
    data = json.loads((root / rel).read_text()); out = []
    walk(data, [], out)
    return [(n, render(v)) for n, v in out]

def format_pairs(pairs):
    return [f"  --{n}: {v};" for n, v in pairs]

def block(root, rel):
    return format_pairs(block_pairs(root, rel))

VAR_REF = re.compile(r"var\(--([a-z0-9-]+)")  # group has no "--" prefix, matching walk()'s raw names

# Every :root-declared semantic/typography/foundations/component token whose var()
# chain (transitively) resolves through brand.*/font.* must be RE-DECLARED inside
# each [data-brand=X] block, not just the raw brand primitives. A var() reference
# resolves against the value of the referenced custom property AT THE ELEMENT WHERE
# THE REFERENCING DECLARATION ITSELF LIVES — since these tokens are declared only
# at :root (i.e. <html>), and Kernel's brand override lands on a descendant (the
# `.krnl-companion-layer` wrapper, not <html>), leaving them undeclared here freezes
# them to the Corilus default no matter which brand is selected. Computed by
# transitive closure over the var() reference graph, not hand-maintained, so it
# never goes stale as semantic/component tokens are added.
def brand_dependent_redeclares(root_pairs):
    seed = {n for n in root_pairs if n.startswith("brand-") or n.startswith("font-")}
    dependent = set(seed)
    changed = True
    while changed:
        changed = False
        for n, v in root_pairs.items():
            if n in dependent: continue
            if any(ref in dependent for ref in VAR_REF.findall(v)):
                dependent.add(n); changed = True
    return format_pairs([(n, v) for n, v in root_pairs.items() if n in dependent and n not in seed])

def main(root):
    root = pathlib.Path(root)
    L = ["/* Generated from DTCG tokens. Do not edit by hand. */", ":root {"]
    root_pairs = {}  # name -> rendered value, insertion-ordered (last write wins, as CSS would)
    for rel in ["primitives/colors.tokens.json",
                "primitives/typography.tokens.json","primitives/radius.tokens.json",
                "primitives/space.tokens.json","primitives/motion.tokens.json",
                "brand/corilus.tokens.json",
                "semantic/light.tokens.json","responsive/comfortable.tokens.json",
                "responsive/type-desktop.tokens.json","semantic/typography.tokens.json",
                "semantic/foundations.tokens.json",
                "components/button.tokens.json","components/pill.tokens.json",
                "components/card.tokens.json","components/sparkline.tokens.json",
                "components/canvas.tokens.json"]:
        pairs = block_pairs(root, rel)
        L.append(f"\n  /* {rel} */"); L += format_pairs(pairs)
        root_pairs.update(pairs)
    L.append("}")
    # Brand modifier — overrides the brand-tier vars (colour, radius, font), then
    # re-declares every semantic/typography/foundations/component alias that
    # depends on them (see brand_dependent_redeclares above) so those aliases
    # resolve against THIS brand's primitives instead of the frozen :root default.
    # Additive: only the deltas are emitted; unspecified brand vars stay at the
    # :root (Corilus) value. To add a brand, just drop in brand/{name}.tokens.json —
    # discovered automatically, no other changes needed.
    brand_redeclares = brand_dependent_redeclares(root_pairs)
    for brand_file in sorted(p.name for p in (root / "brand").glob("*.tokens.json")):
        name = brand_file.removesuffix(".tokens.json")
        if name == "corilus": continue  # corilus IS the :root default; nothing to override
        L.append(f'\n[data-brand="{name}"] {{')
        L += block(root, f"brand/{brand_file}")
        L.append(f"\n  /* {len(brand_redeclares)} brand-dependent aliases, re-declared at this scope */")
        L += brand_redeclares
        L.append("}")
    L.append('\n[data-theme="dark"] {'); L += block(root, "semantic/dark.tokens.json"); L.append("}")
    L.append('\n[data-density="compact"] {'); L += block(root, "responsive/compact.tokens.json"); L.append("}")
    L.append('\n[data-density="comfortable"] {'); L += block(root, "responsive/comfortable.tokens.json"); L.append("}")
    L.append('\n[data-density="spacious"] {'); L += block(root, "responsive/spacious.tokens.json"); L.append("}")
    # Breakpoint modifier — overrides the type-size scale; the typography `font`
    # shorthands reference var(--type-size-*), so they re-resolve per breakpoint.
    # Desktop is the :root default. Mobile pins density to one value (see CHANGELOG).
    L.append('\n[data-breakpoint="tablet"] {'); L += block(root, "responsive/type-tablet.tokens.json"); L.append("}")
    # Mobile pins density to ONE value: the comfortable spacing is re-emitted here so it
    # overrides any [data-density=*] (equal specificity, emitted later → wins). Desktop +
    # tablet keep the three-density choice; mobile collapses it (per Frank's spec).
    L.append('\n[data-breakpoint="mobile"] {'); L += block(root, "responsive/type-mobile.tokens.json")
    L.append("\n  /* density pinned to comfortable on mobile */"); L += block(root, "responsive/comfortable.tokens.json"); L.append("}")
    print("\n".join(L))

if __name__ == "__main__":
    main(sys.argv[1] if len(sys.argv) > 1 else ".")
