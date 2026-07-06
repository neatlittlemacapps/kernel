// Kernel template: ai-chat (grove BACKLOG B-34).
//
// Frame-first reference skeleton for a companion / Juglans conversation surface (the Astryx
// AI-chat shape): a scrolling message list, a composer, an optional tool-call / artifact-preview
// side region, and AI-disclosure marks. Not a runnable app - a layout to fill in. Every control
// is a real Kernel component; discover the pieces with `kernel component <Name>`.

export const meta = {
  name: 'ai-chat',
  title: 'AI chat / companion surface',
  summary: 'Message list + composer + optional tool-call/artifact side panel, with AI disclosure.',
  regions: ['header:identity', 'main:message-list', 'aside:tool-calls', 'footer:composer'],
  composes: ['AIBadge', 'AIMarker', 'Card', 'TextInput', 'Btn', 'IconButton', 'Icon'],
};

import { AIBadge, AIMarker, Card, TextInput, Btn, IconButton, Icon } from '@corilus/kernel';

export function AIChat({ messages = [], toolCalls = [], draft, onDraftChange, onSend }) {
  return (
    <div className="chat-shell">
      {/* region: header - assistant identity + AI disclosure */}
      <header className="chat-shell__header">
        <AIBadge size={20} glow />
        <span>Companion</span>
        <AIMarker text="AI-generated - verify before acting" />
      </header>

      <div className="chat-shell__body">
        {/* region: main - the scrolling conversation */}
        <main className="chat-shell__messages" aria-live="polite">
          {messages.map((m) => (
            <Card key={m.id} tone={m.role === 'assistant' ? 'info' : 'neutral'}>
              {m.text}
            </Card>
          ))}
        </main>

        {/* region: aside - tool calls / artifact preview (drop when unused) */}
        <aside className="chat-shell__tools" aria-label="Tool calls and artifacts">
          {toolCalls.map((t) => (
            <Card key={t.id} title={t.name} tone="neutral">{t.summary}</Card>
          ))}
        </aside>
      </div>

      {/* region: footer - the composer */}
      <footer className="chat-shell__composer">
        <TextInput value={draft} onChange={onDraftChange} placeholder="Ask the companion..." />
        <IconButton aria-label="Attach">{Icon.attach({ size: 18 })}</IconButton>
        <Btn variant="primary" onClick={onSend}>Send</Btn>
      </footer>
    </div>
  );
}
