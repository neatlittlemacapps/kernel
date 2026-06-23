// Inline stroke icons (currentColor). No icon font, no network.
const S = (props) => (
  <svg width={props.size || 16} height={props.size || 16} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth={props.w || 1.8} strokeLinecap="round" strokeLinejoin="round"
    style={props.style}>{props.children}</svg>
);

export const Icon = {
  menu: (p) => <S {...p}><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" /></S>,
  dots: (p) => <S {...p}><circle cx="12" cy="5" r="1" fill="currentColor" /><circle cx="12" cy="12" r="1" fill="currentColor" /><circle cx="12" cy="19" r="1" fill="currentColor" /></S>,
  close: (p) => <S {...p}><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></S>,
  back: (p) => <S {...p} w={2.2}><path d="M15 18l-6-6 6-6" /></S>,
  check: (p) => <S {...p} w={2.4}><polyline points="20 6 9 17 4 12" /></S>,
  plus: (p) => <S {...p} w={2}><path d="M12 5v14M5 12l7-7 7 7" /></S>,
  chat: (p) => <S {...p}><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" /></S>,
  search: (p) => <S {...p}><circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" /></S>,
  user: (p) => <S {...p}><circle cx="12" cy="8" r="4" /><path d="M4 20v-1a8 8 0 0116 0v1" /></S>,
  users: (p) => <S {...p}><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 00-3-3.87" /><path d="M16 3.13a4 4 0 010 7.75" /></S>,
  mic: (p) => <S {...p}><path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z" /><path d="M19 10v2a7 7 0 01-14 0v-2" /><line x1="12" y1="19" x2="12" y2="23" /></S>,
  doc: (p) => <S {...p}><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><polyline points="14 2 14 8 20 8" /></S>,
  pill: (p) => <S {...p}><path d="M10.5 20.5L3 13a5 5 0 017-7l7.5 7.5a5 5 0 01-7 7z" /><line x1="8.5" y1="8.5" x2="15.5" y2="15.5" /></S>,
  book: (p) => <S {...p}><path d="M4 19.5A2.5 2.5 0 016.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" /></S>,
  flag: (p) => <S {...p}><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" /><line x1="4" y1="22" x2="4" y2="15" /></S>,
  help: (p) => <S {...p}><circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3" /><line x1="12" y1="17" x2="12.01" y2="17" /></S>,
  chevron: (p) => <S {...p} w={2.4}><path d="M9 18l6-6-6-6" /></S>,
  floating: (p) => <S {...p}><rect x="2" y="6" width="20" height="14" rx="2" /><path d="M8 6V4" /><path d="M16 6V4" /></S>,
  sidebar: (p) => <S {...p}><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M9 3v18" /></S>,
  fullscreen: (p) => <S {...p}><polyline points="15 3 21 3 21 9" /><polyline points="9 21 3 21 3 15" /><line x1="21" y1="3" x2="14" y2="10" /><line x1="3" y1="21" x2="10" y2="14" /></S>,
  bottomsheet: (p) => <S {...p}><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M3 14h18" /></S>,
  send: (p) => <S {...p}><line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" /></S>,
  spark: (p) => <S {...p}><path d="M12 3l1.9 5.6L19.5 10l-5.6 1.9L12 17l-1.9-5.1L4.5 10l5.6-1.4L12 3z" /></S>,
  arrowUp: (p) => <S {...p} w={2.2}><line x1="12" y1="20" x2="12" y2="5" /><polyline points="6 11 12 5 18 11" /></S>,
  external: (p) => <S {...p}><path d="M15 3h6v6" /><path d="M10 14 21 3" /><path d="M21 14v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5" /></S>,
  add: (p) => <S {...p} w={2}><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></S>,
  attach: (p) => <S {...p}><path d="M21.44 11.05l-8.49 8.49a5 5 0 01-7.07-7.07l8.49-8.49a3.5 3.5 0 014.95 4.95l-8.49 8.49a2 2 0 01-2.83-2.83l7.78-7.78" /></S>,
  agent: (p) => <S {...p}><rect x="4" y="8" width="16" height="11" rx="2.5" /><path d="M12 8V5" /><circle cx="12" cy="4" r="1" fill="currentColor" stroke="none" /><circle cx="9.5" cy="13" r="0.6" fill="currentColor" stroke="none" /><circle cx="14.5" cy="13" r="0.6" fill="currentColor" stroke="none" /></S>,
  code: (p) => <S {...p} w={2}><polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" /></S>,
  image: (p) => <S {...p}><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" /></S>,
};
