// Banner - a persistent status message the user must notice or act on (info /
// success / warning / error), composed FROM Card rather than hand-rolled: Card
// already owns the tinted-surface + tone-border plumbing ([data-tone]) and the
// Header/Body/Footer slots. Banner adds the semantic layer Card doesn't have -
// a default icon per tone, the title/description/action/dismiss anatomy, and the
// persistent-message `variant` (subtle tint vs strong solid fill).
//
// Not for auto-expiring notices - that's a Toast (Kernel doesn't have one yet).
// Not for a block notice with its own header + body + footer actions row - that's
// the separate `Callout` atom this repo's COMPONENT-EXTRACTION-PLAN.md reserves;
// Banner stays a single Card.Header row (+ an optional collapsible detail region).
import { Card } from './Card.jsx';
import { Collapsible } from './Collapsible.jsx';
import { IconButton } from './ui.jsx';
import { Icon } from '../lib/icons.jsx';

const React = window.React;

// Default icon per tone - a status shape (circled), not the generic help/check/flag
// glyphs (those read as generic UI, not a status badge). `neutral` has no status
// icon by default (STANDARD.md: neutral has no status token either).
const TONE_ICON = {
  info: Icon.statusInfo,
  success: Icon.statusSuccess,
  warning: Icon.statusWarning,
  error: Icon.statusError,
};

// live defaults by tone (STANDARD.md §4): error is the one tone that must interrupt
// (assertive); neutral is informational chrome, not a status change (off); info /
// success / warning announce politely without stealing focus.
const TONE_LIVE = { error: 'assertive', neutral: 'off' };

export function Banner({
  tone, appearance = 'filled', variant = 'subtle', icon,
  title, description, children, action, detail, fullWidth,
  onDismiss, live, className = '', ...rest
}) {
  const resolvedIcon = icon !== undefined ? icon : (tone ? TONE_ICON[tone]?.({ size: 18 }) : null);
  const resolvedLive = live || TONE_LIVE[tone] || 'polite';
  const cls = [
    'krnl-banner-card',
    variant === 'strong' && 'krnl-banner-card--strong',
    fullWidth && 'krnl-banner-card--flush',
    className,
  ].filter(Boolean).join(' ');

  return (
    <Card
      appearance={appearance} tone={tone} className={cls}
      role={resolvedLive === 'off' ? undefined : (resolvedLive === 'assertive' ? 'alert' : 'status')}
      aria-live={resolvedLive === 'off' ? undefined : resolvedLive}
      {...rest}>
      <Card.Header
        leading={resolvedIcon ? <span className="krnl-banner-icon" aria-hidden="true">{resolvedIcon}</span> : null}
        title={title}
        description={description !== undefined ? description : children}
        action={action || onDismiss ? (
          <>
            {action}
            {onDismiss ? <IconButton aria-label="Dismiss" onClick={onDismiss}>{Icon.close({ size: 16 })}</IconButton> : null}
          </>
        ) : null}
      />
      {detail ? (
        <Card.Body>
          <Collapsible trigger="Review details" variant="plain">{detail}</Collapsible>
        </Card.Body>
      ) : null}
    </Card>
  );
}

export const meta = {
  Banner: {
    layer: 'molecule', scope: 'global', status: 'experimental', category: 'Feedback & Status',
    usecases: ['persistent status message', 'inline notice', 'form-level error', 'system notice'],
    keywords: ['banner', 'notice', 'alert', 'status', 'message', 'info', 'success', 'warning', 'error'],
    summary: 'Persistent status message (info/success/warning/error) composing Card + Collapsible - not for auto-expiring notices (a Toast) or a block notice with its own header/body/footer (a Callout).',
    props: [
      { name: 'tone', class: 'dsPresentation', values: ['neutral', 'info', 'success', 'warning', 'error'], description: 'Semantic color, passed through to Card. Also selects the default icon and the default `live` politeness. Omit for a neutral banner (Card’s default surface, no icon).' },
      { name: 'variant', class: 'dsPresentation', values: ['subtle', 'strong'], default: 'subtle', description: 'subtle (default) is Card’s tinted surface (--status-{tone}-tint background). strong is a solid fill (--status-{tone}-solid background + --text-on-accent) for a banner that must dominate the view.' },
      { name: 'appearance', class: 'dsPresentation', values: ['filled', 'outline', 'subtle', 'elevated'], default: 'filled', description: 'Passthrough to Card’s surface treatment. elevated gives Astryx’s "Floating" raised variant (shadow + ring, no border) - confirmed against Card’s existing elevated CSS rather than assumed.' },
      { name: 'title', class: 'content', type: 'ReactNode', description: 'The banner headline. Required - rendered in Card.Header’s title slot.' },
      { name: 'description', class: 'content', type: 'ReactNode', description: 'Supporting text below the title, rendered in Card.Header’s description slot. Falls back to `children` when omitted, so a single-line banner can just pass text as children.' },
      { name: 'icon', class: 'content', type: 'ReactNode', description: 'Overrides the tone-derived default icon (info/success/warning/error each have one). Pass null to render no icon.' },
      { name: 'action', class: 'content', type: 'ReactNode', description: 'A Button rendered in Card.Header’s trailing action slot, alongside the dismiss control when both are present. Use variant="secondary" (the banner itself carries the emphasis) with tone matching the Banner’s own tone, so the action reads as part of the same status, not a competing primary CTA.' },
      { name: 'detail', class: 'content', type: 'ReactNode', description: 'Optional extra detail, revealed behind a "Review details" Collapsible below the header - Astryx’s collapsible-banner variant. Omit for a single-row banner.' },
      { name: 'fullWidth', class: 'dsPresentation', type: 'bool', description: 'Flush, no-radius, edge-to-edge treatment for a page-level notice. A Banner-only style override (not a new Card appearance) - Card has no flush concept and other Card consumers should not gain one by association.' },
      { name: 'onDismiss', class: 'event', type: '(event) => void', description: 'Renders an IconButton "Dismiss" close control in the action slot when supplied (opt-in, like Chip’s onRemove - no separate boolean gates it). Make info/success banners dismissible; leave error banners persistent until the underlying problem is resolved.' },
      { name: 'live', class: 'a11y', values: ['off', 'polite', 'assertive'], description: 'Maps to role/aria-live. Defaults from tone when omitted: error -> assertive, neutral -> off, info/success/warning -> polite.' },
    ],
    bestPractices: [
      { do: true, text: 'Pick tone by message severity: info for updates, success for confirmations, warning for caution, error for problems.' },
      { do: true, text: 'Make info/success banners dismissible; keep error banners persistent (no onDismiss) until the user resolves the underlying problem.' },
      { do: false, text: 'Use Banner for an auto-expiring notification - build a Toast for that (not part of this component).' },
      { do: false, text: 'Use Banner for a block notice with its own header + body + footer actions row - compose Callout for that; Banner stays one Card.Header row plus an optional collapsible detail.' },
    ],
    anatomy: [
      { name: 'Icon', required: false, description: 'Leading tone icon (Card.Header’s leading slot).' },
      { name: 'Title', required: true, description: 'Headline (Card.Header’s title slot).' },
      { name: 'Description', required: false, description: 'Supporting text (Card.Header’s description slot).' },
      { name: 'Action', required: false, description: 'Trailing button + dismiss control (Card.Header’s action slot).' },
      { name: 'Detail', required: false, description: 'Collapsible region below the header.' },
    ],
    related: ['Card', 'Collapsible', 'IconButton'],
    composes: ['Card', 'Collapsible', 'IconButton'],
    usage: '<Banner tone="warning" title="Renewal needed" description="Your certificate expires in 3 days." action={<Button size="sm" variant="secondary" tone="warning">Renew</Button>} onDismiss={dismiss} />',
    examples: [
      { name: 'Single line', code: '<Banner tone="info" title="New version available" />', description: 'Title only, no description - a compact status row.' },
      { name: 'With detail', code: '<Banner tone="error" title="3 items failed to sync" detail={<ul>...</ul>} />', description: 'Persistent error banner with a collapsible detail list; no onDismiss, so it stays until resolved.' },
      { name: 'Strong + floating', code: '<Banner tone="success" variant="strong" appearance="elevated" title="Changes saved" onDismiss={dismiss} />', description: 'Solid-fill, raised banner for a confirmation that should stand out.' },
    ],
  },
};
