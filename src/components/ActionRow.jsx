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
  const cls = ['cc-action', `cc-tone--${tone}`, selected && 'is-selected', disabled && 'is-disabled']
    .filter(Boolean).join(' ');
  return (
    <button type="button" className={cls} disabled={disabled} aria-disabled={disabled}
      title={disabled ? reason : undefined}
      onClick={onClick} onMouseEnter={onMouseEnter} onMouseDown={onMouseDown}>
      <span className="cc-action-ic">{icon}</span>
      <span className="cc-action-text">
        <span className="cc-action-label">{label}</span>
        {disabled && reason
          ? <span className="cc-action-desc cc-action-reason">{reason}</span>
          : description ? <span className="cc-action-desc">{description}</span> : null}
      </span>
      {trailing && !disabled && <span className="cc-action-chevron">{Icon.chevron({ size: 13 })}</span>}
    </button>
  );
}

export const meta = {
  ActionRow: { layer:'atom', scope:'global', usecases:['launcher','slash-menu','suggestion'], status:'stable', summary:'The one canonical action/command row (icon · label · description · chevron); gating-aware.', props:{ icon:'node', label:'string', description:'?string', tone:'?string', selected:'?bool', disabled:'?bool', reason:'?string', onClick:'fn' }, composes:[] },
};
