// Design-system atoms. Base UI headless primitives + token-only styling.
// Every visible value resolves to a semantic token var via the .cc-* classes
// in styles.css — no hardcoded color/space/radius/elevation here.
import { Avatar } from '@base-ui-components/react/avatar';
import { Tooltip } from '@base-ui-components/react/tooltip';
import { Switch } from '@base-ui-components/react/switch';
import { Accordion } from '@base-ui-components/react/accordion';
import { brandLogoSvg } from '../lib/logo.js';
import { Icon } from '../lib/icons.jsx';

const React = window.React;

// Current brand, provided by the Companion shell from flags.brand (synchronous —
// the source of truth for the brand-swappable logo, ahead of the data-brand attr).
export const BrandContext = React.createContext('corilus');

// forwardRef is REQUIRED: these are used as Base UI `render` targets
// (Menu.Trigger render={<IconButton/>}). Base UI injects a ref that must reach
// the DOM <button>, or the Positioner has no anchor and the popup lands at 0,0.
export const Btn = React.forwardRef(function Btn({ variant = 'primary', size, className = '', children, ...rest }, ref) {
  return (
    <button ref={ref} className={`cc-btn cc-btn--${variant}${size ? ' cc-btn--' + size : ''} ${className}`} {...rest}>
      {children}
    </button>
  );
});

export const IconButton = React.forwardRef(function IconButton({ active, className = '', children, ...rest }, ref) {
  return (
    <button ref={ref} className={`cc-iconbtn${active ? ' is-active' : ''} ${className}`} {...rest}>
      {children}
    </button>
  );
});

// AI identity + verify marker. One identity across all modes [C9, C27].
// Inline SVG (transparent, brand-gradient via tokens) — unique gradient id per
// instance so unmounting one badge can't break another's fill.
export function AIBadge({ size = 28, glow = false }) {
  const brand = React.useContext(BrandContext);
  const idRef = React.useRef(null);
  if (!idRef.current) idRef.current = 'ccLogoGrad-' + Math.round(window.performance ? performance.now() * 1000 : 0) + '-' + size;
  // brand-swappable: a brand with its own mark renders it verbatim; others fall
  // back to the recoloured brain-mark. Re-renders on brand change via the context.
  return (
    <span className={`cc-aibadge${glow ? ' is-glow' : ''}`} style={{ width: size, height: size }} aria-hidden="true"
      dangerouslySetInnerHTML={{ __html: brandLogoSvg(brand, idRef.current) }} />
  );
}

// Patient avatar — Base UI Avatar with initials fallback over a token gradient.
export function PAv({ p, size = 22 }) {
  if (!p) return null;
  const g = p.g || ['var(--brand-data-1)', 'var(--brand-data-4)'];
  return (
    <Avatar.Root className="cc-avatar" style={{ width: size, height: size, fontSize: Math.round(size * 0.42), background: `linear-gradient(135deg, ${g[0]}, ${g[1]})` }}>
      <Avatar.Fallback className="cc-avatar-fallback">{p.av || (p.name || '?').slice(0, 2).toUpperCase()}</Avatar.Fallback>
    </Avatar.Root>
  );
}

export function Tip({ label, children }) {
  if (!label) return children;
  return (
    <Tooltip.Root>
      <Tooltip.Trigger render={children} />
      <Tooltip.Portal>
        <Tooltip.Positioner className="cc-positioner" sideOffset={6}>
          <Tooltip.Popup className="cc-tooltip">{label}</Tooltip.Popup>
        </Tooltip.Positioner>
      </Tooltip.Portal>
    </Tooltip.Root>
  );
}

export function Toggle({ checked, onCheckedChange, id, disabled }) {
  return (
    <Switch.Root id={id} checked={checked} disabled={disabled} onCheckedChange={onCheckedChange} className="cc-switch">
      <Switch.Thumb className="cc-switch-thumb" />
    </Switch.Root>
  );
}

export function TextInput({ className = '', ...rest }) {
  return <input className={`cc-input ${className}`} {...rest} />;
}

// FFSection — one collapsible Feature-flags section. Base UI Accordion.Item, so
// the FF page scales as sections multiply. Wrap with <Accordion.Root openMultiple>.
export function FFSection({ value, title, children }) {
  return (
    <Accordion.Item className="cc-ffsec" value={value}>
      <Accordion.Header className="cc-ffsec-head">
        <Accordion.Trigger className="cc-ffsec-trig">
          <span className="cc-ffsec-title">{title}</span>
          <span className="cc-ffsec-chev">{Icon.chevron({ size: 14 })}</span>
        </Accordion.Trigger>
      </Accordion.Header>
      <Accordion.Panel className="cc-ffsec-panel"><div className="cc-ffsec-body">{children}</div></Accordion.Panel>
    </Accordion.Item>
  );
}

export { Accordion };

// AI verify marker chip — sits on every screen's output [C27].
export function AIMarker({ text }) {
  return (
    <div className="cc-aimarker" role="note">
      <span className="cc-aimarker-dot" aria-hidden="true" />
      {text}
    </div>
  );
}

// ── component catalog metadata (tree-shaken from the bundle; read by build/gen-components.mjs) ──
export const meta = {
  Btn:        { layer:'atom', scope:'global', usecases:['action'], status:'stable', summary:'Primary/secondary text button.', props:{ variant:"'primary'|'secondary'", size:'?string' }, composes:[] },
  IconButton: { layer:'atom', scope:'global', usecases:['action'], status:'stable', summary:'Square icon button; Base UI render-target (forwardRef).', props:{ active:'?bool' }, composes:[] },
  AIBadge:    { layer:'atom', scope:'global', usecases:['identity'], status:'stable', summary:'Companion brain mark (inline SVG, token gradient); optional glow.', props:{ size:'number', glow:'?bool' }, composes:[] },
  PAv:        { layer:'atom', scope:'global', usecases:['identity'], status:'stable', summary:'Patient avatar with initials fallback.', props:{ p:'patient', size:'number' }, composes:[] },
  Tip:        { layer:'atom', scope:'global', usecases:['affordance'], status:'stable', summary:'Tooltip wrapper (Base UI).', props:{ label:'string' }, composes:[] },
  Toggle:     { layer:'atom', scope:'global', usecases:['control'], status:'stable', summary:'On/off switch (Base UI).', props:{ checked:'bool', onCheckedChange:'fn', disabled:'?bool' }, composes:[] },
  TextInput:  { layer:'atom', scope:'global', usecases:['control'], status:'stable', summary:'Outlined text field.', props:{}, composes:[] },
  FFSection:  { layer:'composite', scope:'global', usecases:['feature-flags'], status:'stable', summary:'Collapsible Feature-flags section (Base UI Accordion item).', props:{ value:'string', title:'string' }, composes:[] },
  AIMarker:   { layer:'atom', scope:'global', usecases:['ai-disclosure'], status:'stable', summary:'AI-generated / verify provenance marker.', props:{ text:'string' }, composes:[] },
};
