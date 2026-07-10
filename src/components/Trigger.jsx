// Trigger - the AI discovery-trigger atom. One state machine (the discovery ladder
// idle -> staged -> promotion -> active, plus disabled) and one anatomy (mark +
// indicator + optional label), positioned by `placement`. The juglans' entry
// surfaces compose this: nav (top bar / sidebar), fab, mobile bar, record action,
// inline summons, explain chip. Inline / explain additionally wrap it in a Popover
// (molecules). Renders a real <button> - the successor to the bare-button + bespoke
// `.krnl-trig*` class stopgap (B-42). The `.krnl-trig*` token styling lives in
// styles.css; this owns the behaviour + the class contract.
import { AIBadge, Tooltip } from './ui.jsx';

const React = window.React;

// default brain-mark size per placement (the visual weight each surface wants).
const MARK_SIZE = { nav: 18, fab: 28, mobile: 22, action: 13, inline: 12, explain: 11 };
// which placements show the standard dot / pulse discovery indicator. fab shows its
// own aura + count badge; inline / explain show none (they are quiet affordances).
const STD_INDICATOR = { nav: true, mobile: true, action: true };

// Display priority for the visible state: disabled > active > promotion > staged > idle.
function resolveState({ discovery, disabled, active }) {
  if (disabled) return 'disabled';
  if (active) return 'active';
  if (discovery === 'promotion') return 'promotion';
  if (discovery === 'staged') return 'staged';
  return 'idle';
}

// The discovery indicator: a dot (staged, with an optional count) or a pulse
// (promotion). Active is carried by the trigger's own pressed style, so nothing
// renders for it here.
function DiscoveryIndicator({ state, count }) {
  if (state === 'staged') {
    return <span className="krnl-trig-dot" aria-hidden="true">{count > 1 ? <span className="krnl-trig-dot-n">{count}</span> : null}</span>;
  }
  if (state === 'promotion') return <span className="krnl-trig-pulse" aria-hidden="true" />;
  return null;
}

export const Trigger = React.forwardRef(function Trigger({
  placement = 'action', discovery = 'idle', stagedCount = 0, active = false,
  disabled = false, disabledReason, scope, label, mark, ariaLabel,
  onClick, onPromotionDismiss, className = '', children, ...rest
}, ref) {
  const state = resolveState({ discovery, disabled, active });
  const handleClick = (e) => {
    if (disabled) return;
    if (state === 'promotion' && onPromotionDismiss) onPromotionDismiss();
    onClick && onClick(e);
  };
  const markNode = mark !== undefined ? mark : <AIBadge size={MARK_SIZE[placement] || 18} />;
  const isFab = placement === 'fab';

  const node = (
    <button ref={ref} type="button"
      className={`krnl-trig krnl-trig--${placement} ${className}`.trim()}
      data-state={state}
      disabled={disabled}
      aria-label={ariaLabel || (typeof label === 'string' ? label : undefined)}
      title={disabled ? disabledReason : undefined}
      onClick={handleClick}
      {...rest}>
      {isFab && (state === 'staged' || state === 'promotion') && (
        <span className={`krnl-trig-fab-aura krnl-trig-fab-aura--${state}`} aria-hidden="true" />
      )}
      <span className="krnl-trig-mark">
        {markNode}
        {STD_INDICATOR[placement] ? <DiscoveryIndicator state={state} count={stagedCount} /> : null}
      </span>
      {isFab && state === 'staged' && stagedCount > 0 && (
        <span className="krnl-trig-fab-badge" aria-hidden="true">{stagedCount > 9 ? '9+' : stagedCount}</span>
      )}
      {label ? <span className="krnl-trig-label">{label}</span> : null}
      {children}
    </button>
  );
  return scope ? <Tooltip label={scope}>{node}</Tooltip> : node;
});

export const meta = {
  Trigger: {
    layer: 'atom', scope: 'global', status: 'experimental', category: 'Actions',
    usecases: ['ai trigger', 'discoverability', 'entry point'],
    keywords: ['trigger', 'ai', 'assistant', 'launcher', 'fab', 'discovery', 'summon', 'entry point'],
    summary: 'AI discovery-trigger: the idle/staged/promotion/active state ladder + mark / indicator / label anatomy, positioned by placement. The juglans entry surfaces (nav, fab, mobile, action, inline, explain) compose it.',
    props: [
      { name: 'placement', class: 'dsPresentation', values: ['nav', 'fab', 'mobile', 'action', 'inline', 'explain'], default: 'action', description: 'Where the trigger sits; sets the base modifier class, the default mark size, and which indicator shows (nav/mobile/action get the dot/pulse; fab its aura + count badge; inline/explain none).' },
      { name: 'discovery', class: 'dsPresentation', values: ['idle', 'staged', 'promotion'], default: 'idle', description: 'The discovery-ladder input; combined with active/disabled into the visible data-state.' },
      { name: 'stagedCount', class: 'dsPresentation', type: 'number', description: 'Count shown on the staged indicator (dot number / fab badge).' },
      { name: 'active', class: 'dsPresentation', type: 'bool', description: 'The juglans is open from this trigger (pressed state; wins over staged/promotion).' },
      { name: 'mark', class: 'content', type: 'ReactNode', description: 'The identity glyph; defaults to <AIBadge> sized for the placement. Pass to override.' },
      { name: 'label', class: 'content', type: 'ReactNode', description: 'Optional text label beside the mark (nav/mobile/action/inline). Also the fallback aria-label.' },
      { name: 'scope', class: 'dsPresentation', type: 'string', description: 'When set, wraps the trigger in a Tooltip disclosing the data scope (C18).' },
      { name: 'disabled', class: 'passThroughControl', passthrough: 'HTMLButtonElement.disabled' },
      { name: 'disabledReason', class: 'dsApi', type: 'string', description: 'Native title shown while disabled (why it is unavailable).' },
      { name: 'onClick', class: 'event', type: '(event) => void', description: 'Opens the juglans / fires the trigger action.' },
      { name: 'onPromotionDismiss', class: 'event', type: '() => void', description: 'Called before onClick when firing from the promotion state (so the host can clear the promotion).' },
      { name: 'ariaLabel', class: 'a11y', type: 'string', description: 'Accessible name; falls back to a string label.' },
    ],
    bestPractices: [
      { do: true, text: 'Compose Trigger for any juglans entry point; pick the placement, wire onOpen to onClick.' },
      { do: true, text: 'Give an icon-only placement (fab/explain) an ariaLabel or scope.' },
      { do: false, text: 'Hand-roll a bare button with .krnl-trig* classes - that is what this atom replaces.' },
    ],
    anatomy: [
      { name: 'mark', required: true, description: 'The identity glyph (AIBadge by default).' },
      { name: 'indicator', required: false, description: 'Discovery dot / pulse / fab badge, driven by state.' },
      { name: 'label', required: false, description: 'Optional text beside the mark.' },
    ],
    related: ['Button', 'Fab', 'Chip', 'Popover'],
    composes: ['AIBadge', 'Tooltip'],
    usage: '<Trigger placement="nav" label="Juglans" discovery="staged" stagedCount={2} onClick={open} />',
  },
};
