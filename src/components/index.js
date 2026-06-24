// Design-system primitive layer — the public surface of the reusable components.
//
// This barrel is the EXTRACTION BOUNDARY: everything the companion (or any future
// consumer) uses from the DS goes through here. The app layer (src/companion/*)
// should import primitives from '../components' — never reach into individual
// files. When the DS is later lifted into its own package, this file becomes the
// package entry; nothing else has to move.
//
// Rule of the boundary: primitives NEVER import from src/companion/* (verified —
// the dependency only points downward). These are token-styled Base UI wrappers;
// their visual contract is the `.krnl-*` classes in styles.css + the design tokens,
// which is the framework-neutral part other platforms re-implement against.

export { Btn, IconButton, AIBadge, PAv, Tip, Toggle, TextInput, FFSection, Accordion, AIMarker } from './ui.jsx';
export { ActionRow } from './ActionRow.jsx';
