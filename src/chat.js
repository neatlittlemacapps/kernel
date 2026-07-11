// Kernel — chat tier (the "./chat" subpath).
//
// Generic conversational-UI primitives: chat bubbles, the composer / prompt field,
// the scrolling transcript, the typing indicator. NOT domain-specific (a clinical
// answer, sources, PII interstitial live in "./clinical" / the app) and NOT host-
// wired (the bus, agent switching, slash commands stay in the consuming app, which
// plugs them into these slot-driven shells). Kept behind a separate entry point so a
// build that ships no conversational surface can drop the slice. Composes the generic
// "." primitives (TextArea, IconButton, AIBadge, …) - downward dependency only.
export { ChatBubble } from './components/chat/ChatBubble.jsx';
