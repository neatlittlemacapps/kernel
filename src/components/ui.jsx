// Design-system atoms. Base UI headless primitives + token-only styling.
// Every visible value resolves to a semantic token var via the .krnl-* classes
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
    <button ref={ref} className={`krnl-btn krnl-btn--${variant}${size ? ' krnl-btn--' + size : ''} ${className}`} {...rest}>
      {children}
    </button>
  );
});

export const IconButton = React.forwardRef(function IconButton({ active, className = '', children, ...rest }, ref) {
  return (
    <button ref={ref} className={`krnl-iconbtn${active ? ' is-active' : ''} ${className}`} {...rest}>
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
    <span className={`krnl-aibadge${glow ? ' is-glow' : ''}`} style={{ width: size, height: size }} aria-hidden="true"
      dangerouslySetInnerHTML={{ __html: brandLogoSvg(brand, idRef.current) }} />
  );
}

// Patient avatar — Base UI Avatar with initials fallback over a token gradient.
export function PAv({ p, size = 22 }) {
  if (!p) return null;
  const g = p.g || ['var(--brand-data-1)', 'var(--brand-data-4)'];
  return (
    <Avatar.Root className="krnl-avatar" style={{ width: size, height: size, fontSize: Math.round(size * 0.42), background: `linear-gradient(135deg, ${g[0]}, ${g[1]})` }}>
      <Avatar.Fallback className="krnl-avatar-fallback">{p.av || (p.name || '?').slice(0, 2).toUpperCase()}</Avatar.Fallback>
    </Avatar.Root>
  );
}

export function Tip({ label, children }) {
  if (!label) return children;
  return (
    <Tooltip.Root>
      <Tooltip.Trigger render={children} />
      <Tooltip.Portal>
        <Tooltip.Positioner className="krnl-positioner" sideOffset={6}>
          <Tooltip.Popup className="krnl-tooltip">{label}</Tooltip.Popup>
        </Tooltip.Positioner>
      </Tooltip.Portal>
    </Tooltip.Root>
  );
}

export function Toggle({ checked, onCheckedChange, id, disabled }) {
  return (
    <Switch.Root id={id} checked={checked} disabled={disabled} onCheckedChange={onCheckedChange} className="krnl-switch">
      <Switch.Thumb className="krnl-switch-thumb" />
    </Switch.Root>
  );
}

export function TextInput({ className = '', ...rest }) {
  return <input className={`krnl-input ${className}`} {...rest} />;
}

// FFSection — one collapsible Feature-flags section. Base UI Accordion.Item, so
// the FF page scales as sections multiply. Wrap with <Accordion.Root openMultiple>.
export function FFSection({ value, title, children }) {
  return (
    <Accordion.Item className="krnl-ffsec" value={value}>
      <Accordion.Header className="krnl-ffsec-head">
        <Accordion.Trigger className="krnl-ffsec-trig">
          <span className="krnl-ffsec-title">{title}</span>
          <span className="krnl-ffsec-chev">{Icon.chevron({ size: 14 })}</span>
        </Accordion.Trigger>
      </Accordion.Header>
      <Accordion.Panel className="krnl-ffsec-panel"><div className="krnl-ffsec-body">{children}</div></Accordion.Panel>
    </Accordion.Item>
  );
}

export { Accordion };

// AI verify marker chip — sits on every screen's output [C27].
export function AIMarker({ text }) {
  return (
    <div className="krnl-aimarker" role="note">
      <span className="krnl-aimarker-dot" aria-hidden="true" />
      {text}
    </div>
  );
}

// ── component catalog metadata (tree-shaken from the bundle; read by build/gen-components.mjs) ──
export const meta = {
  Btn: {
    layer: 'atom', scope: 'global', status: 'stable', category: 'Action',
    usecases: ['action'],
    keywords: ['button', 'btn', 'cta', 'submit', 'action', 'primary', 'secondary'],
    summary: 'Primary/secondary text button.',
    props: [
      { name: 'variant', class: 'dsPresentation', values: ['primary', 'secondary'], default: 'primary', description: 'Visual emphasis. Reserve primary for the single most important action in a view.' },
      { name: 'size', class: 'dsPresentation', type: 'string', description: 'Size step; resolves to the density / size-step tokens.' },
      { name: 'children', class: 'content', type: 'ReactNode', description: 'The button label. Write the action ("Save changes"), not "OK" or "Click here".' },
      { name: 'disabled', class: 'passThroughControl', passthrough: 'BaseUI.Button.disabled' },
    ],
    bestPractices: [
      { do: true, text: 'Reserve primary for the single most important action in the view; use secondary for the rest.' },
      { do: true, text: 'Write labels that describe the action ("Save changes", "Delete account"), not "OK".' },
      { do: false, text: 'Place more than one primary button in the same view - it dilutes the hierarchy.' },
      { do: false, text: 'Use a Btn for navigation; if it only goes to another page, use a link.' },
    ],
    anatomy: [
      { name: 'Label', required: true, description: 'The visible text (children); also the accessible name.' },
      { name: 'Icon', required: false, description: 'An optional leading icon reinforcing the label.' },
    ],
    related: ['IconButton'],
    composes: [],
    usage: '<Btn variant="primary">Save changes</Btn>',
    examples: [
      { name: 'Primary', code: '<Btn variant="primary">Save changes</Btn>' },
      { name: 'Secondary', code: '<Btn variant="secondary">Cancel</Btn>', description: 'Lower emphasis; pairs with a primary.' },
    ],
    // prop descriptions adapted from Astryx Button.doc.mjs (MIT), rewritten to the Kernel API.
  },
  IconButton: {
    layer: 'atom', scope: 'global', status: 'stable', category: 'Action',
    usecases: ['action'],
    keywords: ['icon-button', 'icon', 'button', 'toolbar', 'compact', 'action'],
    summary: 'Square icon button; Base UI render-target (forwardRef).',
    props: [
      { name: 'active', class: 'dsPresentation', type: 'bool', description: 'Renders the pressed / active visual state (e.g. a toggled toolbar button).' },
      { name: 'children', class: 'content', type: 'ReactNode', description: 'The icon element, e.g. Icon.close({ size: 18 }).' },
      { name: 'aria-label', class: 'a11y', type: 'string', description: 'Accessible name; required since there is no visible label.' },
      { name: 'disabled', class: 'passThroughControl', passthrough: 'BaseUI.Button.disabled' },
    ],
    related: ['Btn'],
    composes: [],
    usage: '<IconButton aria-label="Close">{Icon.close({ size: 18 })}</IconButton>',
  },
  AIBadge: {
    layer: 'atom', scope: 'global', status: 'stable', category: 'Identity',
    usecases: ['identity'],
    keywords: ['ai', 'badge', 'brain', 'companion', 'mark', 'identity'],
    summary: 'Companion brain mark (inline SVG, token gradient); optional glow.',
    props: [
      { name: 'size', class: 'dsPresentation', type: 'number', description: 'Pixel size of the mark.' },
      { name: 'glow', class: 'dsPresentation', type: 'bool', description: 'Adds the token-driven glow treatment for emphasis.' },
    ],
    composes: [],
    usage: '<AIBadge size={20} glow />',
  },
  PAv: {
    layer: 'atom', scope: 'global', status: 'stable', category: 'Identity',
    usecases: ['identity'],
    keywords: ['avatar', 'patient', 'profile', 'initials', 'photo', 'identity'],
    summary: 'Patient avatar with initials fallback.',
    props: [
      { name: 'p', class: 'content', type: 'patient', description: 'The patient record; the name drives the initials fallback when no photo is available.' },
      { name: 'size', class: 'dsPresentation', type: 'number', description: 'Pixel diameter of the (always circular) avatar.' },
    ],
    anatomy: [
      { name: 'Photo', required: false, description: 'The patient image, shown when available.' },
      { name: 'Initials', required: false, description: 'One or two letters from the name; shown when there is no photo.' },
    ],
    composes: [],
    usage: '<PAv p={patient} size={32} />',
  },
  Tip: {
    layer: 'atom', scope: 'global', status: 'stable', category: 'Overlay',
    usecases: ['affordance'],
    keywords: ['tooltip', 'hint', 'hover', 'infotip', 'flyout'],
    summary: 'Tooltip wrapper (Base UI).',
    props: [
      { name: 'label', class: 'content', type: 'string', description: 'Short tooltip text shown on hover / focus of the trigger.' },
      { name: 'children', class: 'content', type: 'ReactNode', description: 'The trigger element the tooltip is attached to.' },
    ],
    composes: [],
    usage: '<Tip label="Copy"><IconButton aria-label="Copy">{Icon.dots({ size: 16 })}</IconButton></Tip>',
  },
  Toggle: {
    layer: 'atom', scope: 'global', status: 'stable', category: 'Data Input',
    usecases: ['control'],
    keywords: ['switch', 'toggle', 'on-off', 'boolean', 'checkbox'],
    summary: 'On/off switch (Base UI).',
    props: [
      { name: 'checked', class: 'passThroughControl', passthrough: 'BaseUI.Switch.checked' },
      { name: 'onCheckedChange', class: 'passThroughControl', passthrough: 'BaseUI.Switch.onCheckedChange' },
      { name: 'disabled', class: 'passThroughControl', passthrough: 'BaseUI.Switch.disabled' },
    ],
    composes: [],
    usage: '<Toggle checked={on} onCheckedChange={setOn} />',
  },
  TextInput: {
    layer: 'atom', scope: 'global', status: 'stable', category: 'Data Input',
    usecases: ['control'],
    keywords: ['input', 'textfield', 'text', 'search', 'field'],
    summary: 'Outlined text field.',
    props: [
      { name: 'value', class: 'passThroughControl', passthrough: 'HTMLInputElement.value' },
      { name: 'onChange', class: 'passThroughControl', passthrough: 'HTMLInputElement.onChange' },
      { name: 'placeholder', class: 'passThroughControl', passthrough: 'HTMLInputElement.placeholder' },
    ],
    composes: [],
    usage: '<TextInput placeholder="Search records" />',
  },
  FFSection: {
    layer: 'composite', scope: 'global', status: 'stable', category: 'Utility',
    usecases: ['feature-flags'],
    keywords: ['feature-flag', 'accordion', 'collapsible', 'section', 'settings'],
    summary: 'Collapsible Feature-flags section (Base UI Accordion item).',
    props: [
      { name: 'title', class: 'content', type: 'string', description: 'Section heading shown on the accordion trigger.' },
      { name: 'children', class: 'content', type: 'ReactNode', description: 'The flag controls revealed when the section is open.' },
      { name: 'value', class: 'passThroughControl', passthrough: 'BaseUI.Accordion.Item.value' },
    ],
    composes: [],
    usage: '<FFSection value="experiments" title="Experiments">{flags}</FFSection>',
  },
  AIMarker: {
    layer: 'atom', scope: 'global', status: 'stable', category: 'AI',
    usecases: ['ai-disclosure'],
    keywords: ['ai', 'disclosure', 'provenance', 'verify', 'transparency', 'ai-act'],
    summary: 'AI-generated / verify provenance marker.',
    props: [
      { name: 'text', class: 'content', type: 'string', description: 'The disclosure text, e.g. "AI-generated - verify before acting".' },
    ],
    composes: [],
    usage: '<AIMarker text="AI-generated - verify before acting" />',
  },
};
