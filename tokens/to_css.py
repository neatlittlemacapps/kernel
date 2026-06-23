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

def block(root, rel):
    data = json.loads((root / rel).read_text()); out = []
    walk(data, [], out)
    return [f"  --{n}: {render(v)};" for n, v in out]

def main(root):
    root = pathlib.Path(root)
    L = ["/* Generated from DTCG tokens. Do not edit by hand. */", ":root {"]
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
        L.append(f"\n  /* {rel} */"); L += block(root, rel)
    L.append("}")
    # Brand modifier — overrides the brand-tier vars (colour, radius, font). The
    # semantic layer aliases var(--brand-*), so re-pointing these re-skins everything
    # without touching the semantic/theme/density blocks. Additive: only the deltas
    # are emitted; unspecified brand vars stay at the :root (Corilus) value.
    L.append('\n[data-brand="semble"] {'); L += block(root, "brand/semble.tokens.json"); L.append("}")
    L.append('\n[data-brand="myneva"] {'); L += block(root, "brand/myneva.tokens.json"); L.append("}")
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
