// Iconography — Font Awesome (regular), bundled from the project Kit
// (@awesome.me/kit-c983fdf9da) as inline SVG. No icon font, no network: each icon
// object carries its path data, rendered into an inline <svg fill="currentColor">
// so it inherits color + works offline / file:// / under strict CSP (the juglans
// bundle invariant). Same call shape as before: Icon.name({ size, style }).
//
// Regular style only: nothing in the component set swaps an icon on selection
// (selection reads via accent color + a check affordance + backgrounds), so no
// solid variant is needed. Add one here only if a future component requires it.
import {
  faPlus, faRobot, faArrowUp, faPaperclipVertical, faAngleLeft, faBookBlank,
  faComment, faCheck, faAngleRight, faXmark, faCode, faFile, faEllipsisVertical,
  faArrowUpRightFromSquare, faFlag, faExpand, faHeart, faCircleQuestion, faImage,
  faBars, faMicrophone, faCapsules, faMagnifyingGlass, faPaperPlane, faShieldHalved,
  faSparkles, faUser, faUsers,
} from '@awesome.me/kit-c983fdf9da/icons/classic/regular';

// Render an FA icon object as inline SVG at a pixel size. FA icon object shape:
// { icon: [w, h, ligatures, unicode, pathData] }; viewBox = "0 0 w h". The svg is
// square (size x size) and preserveAspectRatio (default xMidYMid meet) fits the
// glyph centered, so every icon keeps a consistent square footprint.
const fa = (def) => (p = {}) => {
  const [w, h, , , d] = def.icon;
  const size = p.size || 16;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${w} ${h}`} fill="currentColor"
      style={p.style} aria-hidden="true" focusable="false">
      <path d={Array.isArray(d) ? d.join('') : d} />
    </svg>
  );
};

// Inline stroke fallback — kept ONLY for the view-mode glyphs the Kit doesn't have
// yet (floating / bottomsheet are pending custom uploads; sidebar stays inline too
// so the view-switcher trio renders in one consistent style until the customs land).
const S = (props) => (
  <svg width={props.size || 16} height={props.size || 16} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth={props.w || 1.8} strokeLinecap="round" strokeLinejoin="round"
    style={props.style}>{props.children}</svg>
);

export const Icon = {
  // ── Font Awesome (regular) ──
  menu: fa(faBars),
  dots: fa(faEllipsisVertical),
  close: fa(faXmark),
  back: fa(faAngleLeft),
  check: fa(faCheck),
  plus: fa(faPlus),
  add: fa(faPlus),
  chat: fa(faComment),
  search: fa(faMagnifyingGlass),
  user: fa(faUser),
  users: fa(faUsers),
  mic: fa(faMicrophone),
  doc: fa(faFile),
  pill: fa(faCapsules),
  book: fa(faBookBlank),
  flag: fa(faFlag),
  help: fa(faCircleQuestion),
  chevron: fa(faAngleRight),
  fullscreen: fa(faExpand),
  send: fa(faPaperPlane),
  spark: fa(faSparkles),
  arrowUp: fa(faArrowUp),
  external: fa(faArrowUpRightFromSquare),
  attach: fa(faPaperclipVertical),
  agent: fa(faRobot),
  code: fa(faCode),
  image: fa(faImage),
  heart: fa(faHeart),
  shield: fa(faShieldHalved),

  // ── inline fallback: view-mode glyphs (pending Kit custom icons) ──
  floating: (p) => <S {...p}><rect x="2" y="6" width="20" height="14" rx="2" /><path d="M8 6V4" /><path d="M16 6V4" /></S>,
  sidebar: (p) => <S {...p}><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M9 3v18" /></S>,
  bottomsheet: (p) => <S {...p}><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M3 14h18" /></S>,
};
