// ActionRow — the ONE canonical "action / command item" used by BOTH the slash
// command menu and the home launcher. Token-bound; no hardcoded values.
//
// Designed to stay valid as the home list becomes CONTEXTUAL later: the row only
// knows { icon, label, description, tone, state } — it does not care whether the
// data is the 3 preset agents or a dynamic set of suggestion cards. Swap the data
// feeding it; the visual stays aligned. One component, proper props, no forks.
import { Icon } from '../lib/icons.jsx';

const React = window.React;

export function ActionRow({
  icon, label, description, tone = 'accent',
  selected = false, disabled = false, reason,
  trailing = true, onClick, onMouseEnter, onMouseDown,
}) {
  const cls = ['krnl-action', `krnl-tone--${tone}`, selected && 'is-selected', disabled && 'is-disabled']
    .filter(Boolean).join(' ');
  return (
    <button type="button" className={cls} disabled={disabled} aria-disabled={disabled}
      title={disabled ? reason : undefined}
      onClick={onClick} onMouseEnter={onMouseEnter} onMouseDown={onMouseDown}>
      <span className="krnl-action-ic">{icon}</span>
      <span className="krnl-action-text">
        <span className="krnl-action-label">{label}</span>
        {disabled && reason
          ? <span className="krnl-action-desc krnl-action-reason">{reason}</span>
          : description ? <span className="krnl-action-desc">{description}</span> : null}
      </span>
      {trailing && !disabled && <span className="krnl-action-chevron">{Icon.chevron({ size: 13 })}</span>}
    </button>
  );
}

export const meta = {
  ActionRow: {
    layer: 'atom', scope: 'global', status: 'stable', category: 'Navigation',
    usecases: ['launcher', 'slash-menu', 'suggestion'],
    keywords: ['action', 'command', 'row', 'launcher', 'menu', 'suggestion', 'list-item'],
    summary: 'The one canonical action/command row (icon, label, description, chevron); gating-aware.',
    props: [
      { name: 'icon', class: 'content', type: 'node', description: 'Leading glyph, e.g. Icon.search({ size: 18 }).' },
      { name: 'label', class: 'content', type: 'string', description: 'The action name; the primary line and accessible name.' },
      { name: 'description', class: 'content', type: 'string', required: false, description: 'Secondary line beneath the label.' },
      { name: 'tone', class: 'dsPresentation', type: 'string', required: false, description: 'Semantic colour accent for the row.' },
      { name: 'selected', class: 'dsPresentation', type: 'bool', required: false, description: 'Highlights the row as the current selection (keyboard / active item).' },
      { name: 'reason', class: 'content', type: 'string', required: false, description: 'When disabled, the gating reason shown to explain why.' },
      { name: 'onClick', class: 'event', type: 'fn', description: 'Invoked when the row is activated.' },
      { name: 'disabled', class: 'passThroughControl', passthrough: 'BaseUI.Button.disabled' },
    ],
    anatomy: [
      { name: 'Icon', required: false, description: 'Leading glyph.' },
      { name: 'Label', required: true, description: 'The action name.' },
      { name: 'Description', required: false, description: 'Secondary supporting line.' },
      { name: 'Chevron', required: false, description: 'Trailing affordance for drill-in rows.' },
    ],
    composes: [],
    usage: '<ActionRow icon={Icon.search({ size: 18 })} label="Search records" description="Find a patient" onClick={run} />',
  },
};
