// HighlightCard — a composed "card-shaped list of collapsible sections" (recreates
// CareConnect @cc/react-components' HighlightCard structure on the kernel Base Card).
// NOT a new primitive: it is an outer Card (the shell) whose body is a Stack of
// section-Cards, each independently toned / highlighted / collapsible. See
// CARD-STRUCTURE-PLAN.md §2 and CARECONNECT-CARD-MAPPING.md for the source mapping.
//
// Two structural decisions this component makes (both deliberate departures from the
// CareConnect source, per the plan):
//   1. Explicit slot PROPS, not react-nanny type-sniffed flat children. The shell's
//      header uses Card.Header's own leading/title/badge/action slots directly; the
//      repeatable unit is a plain `sections` array of descriptors, not a
//      <HighlightCard.Section> compound component consumers reorder by hand - this
//      mirrors how PatientCard/SproutCard expose data-driven props rather than
//      requiring a fixed compound-children shape, and lets a section be a plain
//      object a caller can build in a .map() of its own.
//   2. No framer-motion / CollapseMotion. A collapsible section IS a Card with
//      `detail` - Base UI's collapsible primitive (height var + ARIA) already owns
//      the animation, and Change A (disclosure-right) already gives it the correct
//      chevron placement/rotation for free.
//
// Accessibility note: when a section is `collapsible`, its header becomes a REAL
// button element (Base UI Collapsible.Trigger, via the base Card). Card's own contract
// forbids nesting interactive controls inside that summary (button-in-button), so a
// collapsible section's `actions` render inside the revealed `detail` panel instead
// of the header - never in the trigger. A non-collapsible section has no such
// constraint and renders `actions` directly in its header, like the shell itself.
import { Card } from './Card.jsx';
import { Stack } from './Layout.jsx';

const React = window.React;

// One repeatable section-Card. Kept internal (not exported as HighlightCard.Section)
// because the public shape is the `sections` array, not a compound-children API -
// see the file banner. Holds its own expand state so showMoreLabel/showLessLabel can
// track it even when the section is left uncontrolled.
function Section({ section }) {
  const {
    icon, title, description, tone, highlight, borderBottom, actions,
    collapsible, defaultExpanded = true, expanded: expandedProp, onExpandedChange,
    showMoreLabel, showLessLabel, content, className = '', ...rest
  } = section;

  const controlled = expandedProp !== undefined;
  const [uncontrolledExpanded, setUncontrolledExpanded] = React.useState(defaultExpanded);
  const expanded = controlled ? expandedProp : uncontrolledExpanded;
  const handleExpandedChange = (open) => {
    if (!controlled) setUncontrolledExpanded(open);
    onExpandedChange?.(open);
  };

  // A plain <span>, never a control - safe inside the collapsible trigger.
  const hint = (collapsible && (showMoreLabel || showLessLabel))
    ? <span className="krnl-hcard-section-hint">{expanded ? showLessLabel : showMoreLabel}</span>
    : null;

  const header = (
    <Card.Header
      leading={icon}
      title={title}
      description={description}
      action={collapsible ? hint : (actions || null)}
    />
  );

  const cls = ['krnl-hcard-section', className].filter(Boolean).join(' ');
  const shared = {
    tone,
    surface: highlight ? 'tinted' : undefined,
    'data-border-bottom': borderBottom || undefined,
    className: cls,
    ...rest,
  };

  if (collapsible) {
    return (
      <Card
        {...shared}
        {...(controlled ? { expanded: expandedProp } : { defaultExpanded })}
        onExpandedChange={handleExpandedChange}
        detail={(actions || content != null) ? (
          <>
            {actions ? <div className="krnl-hcard-section-actions">{actions}</div> : null}
            {content}
          </>
        ) : null}
      >
        {header}
      </Card>
    );
  }

  return (
    <Card {...shared}>
      {header}
      {content != null ? <Card.Body>{content}</Card.Body> : null}
    </Card>
  );
}

// HighlightCard - the shell. `tone`/`bordered` forward straight to the outer Card
// (the shell is deliberately never `interactive`/`detail` itself - see the file
// banner - so it can never nest a section's own trigger button inside another
// button). `leading`/`title`/`badge`/`action` are Card.Header's own slots. `body` is
// plain content with no section chrome (a HighlightCard with no discrete sections);
// `sections` is the repeatable, independently-toned/collapsible unit; `footer` is a
// full-width closing row.
export const HighlightCard = React.forwardRef(function HighlightCard(
  { tone, bordered, leading, title, badge, action, body, sections = [], footer,
    onClick, className = '', style, ...rest }, ref) {
  const hasBody = body != null || sections.length > 0;
  return (
    <Card
      ref={ref}
      tone={tone}
      bordered={bordered}
      onClick={onClick}
      className={['krnl-hcard', className].filter(Boolean).join(' ')}
      style={style}
      {...rest}
    >
      <Card.Header leading={leading} title={title} badge={badge} action={action} />
      {hasBody ? (
        <Card.Body>
          <Stack gap={3}>
            {body != null ? <div className="krnl-hcard-body">{body}</div> : null}
            {sections.map((s, i) => <Section key={s.key ?? i} section={s} />)}
          </Stack>
        </Card.Body>
      ) : null}
      {footer != null ? <Card.Footer>{footer}</Card.Footer> : null}
    </Card>
  );
});

export const meta = {
  HighlightCard: {
    layer: 'composite', scope: 'global', status: 'stable', category: 'Data Display',
    usecases: ['tagged summary card', 'multi-section record', 'grouped collapsible detail'],
    keywords: ['highlight', 'card', 'section', 'collapsible', 'tag', 'consult', 'grouped', 'accordion-like'],
    summary: 'A tagged header row over a stack of independently toned, optionally collapsible section-Cards - composes Card + Stack, not a new primitive.',
    props: [
      { name: 'tone', class: 'dsPresentation', type: 'string', description: 'Colour identity of the outer shell, forwarded to the shell Card\'s own `tone` (any value Card accepts: a named status, a data-N tone, "primary", or a colour/var).' },
      { name: 'bordered', class: 'dsPresentation', type: 'bool', description: 'Forwarded to the shell Card\'s own `bordered` (the hairline border). Omit to inherit Card\'s default.' },
      { name: 'leading', class: 'content', type: 'ReactNode', description: 'The shell\'s leading tag (an IconPill + label is the usual choice) - Card.Header\'s leading slot.' },
      { name: 'title', class: 'content', type: 'ReactNode', description: 'The shell heading - Card.Header\'s title slot.' },
      { name: 'badge', class: 'content', type: 'ReactNode', description: 'Inline badge(s) next to the title (a StatusPill / Chip) - Card.Header\'s badge slot.' },
      { name: 'action', class: 'content', type: 'ReactNode', description: 'Trailing header control(s) (one node or a fragment of several buttons) - Card.Header\'s action slot. Safe here because the shell is never a collapsible trigger.' },
      { name: 'body', class: 'content', type: 'ReactNode', description: 'Plain content with no section chrome, rendered above any `sections` (for a HighlightCard with no discrete sections at all - the CareConnect "no side content" pattern).' },
      { name: 'sections', class: 'content', type: 'Array<Section>', description: 'The repeatable unit: { icon, title, description, tone, highlight, borderBottom, actions, collapsible, defaultExpanded, expanded, onExpandedChange, showMoreLabel, showLessLabel, content, key }. Each renders as its own Card - `tone` colours it independently of the shell; `highlight` sets surface="tinted"; `collapsible` wraps `content` in that section Card\'s own `detail` (Change A gives it the right-aligned, down/up chevron for free); `borderBottom` draws a tone-coloured rule under the section header instead of Card\'s usual top strip. `actions` render in the section header when NOT collapsible, and inside `detail` (never the trigger) when collapsible - avoids nesting a control inside the trigger button.' },
      { name: 'footer', class: 'content', type: 'ReactNode', description: 'A full-width closing row - Card.Footer.' },
      { name: 'onClick', class: 'event', type: '(event) => void', description: 'Click handler on the shell Card. The shell is never `interactive` (no button semantics), matching the source\'s plain onClick div - use a section `action` for a real keyboard-operable control.' },
      { name: 'className', class: 'dsPresentation', type: 'string', description: 'Extra class names appended after the canonical `krnl-hcard` class.' },
    ],
    bestPractices: [
      { do: true, text: 'Use `sections` for repeatable, independently-toned or collapsible content; use `body` only when the card has no discrete sections at all.' },
      { do: true, text: 'Put a section\'s buttons in `actions` - they land in the header for a static section, and inside `detail` (not the trigger) for a collapsible one, so a control never nests inside the trigger button.' },
      { do: false, text: 'Make the shell itself `interactive`/collapsible - it never is; independent disclosure lives per-section.' },
      { do: false, text: 'Reorder or scan `sections`/`body` by element type - they are plain data/content, not children the component sniffs.' },
    ],
    anatomy: [
      { name: 'Header', required: true, description: 'leading tag + title + badge + action, via Card.Header.' },
      { name: 'Sections', required: false, description: 'A Stack of section-Cards, each with its own tone/highlight/collapsible state.' },
      { name: 'Body', required: false, description: 'Plain content with no section chrome (the `body` prop).' },
      { name: 'Footer', required: false, description: 'A full-width closing row.' },
    ],
    related: ['Card', 'Stack', 'Collapsible', 'PatientCard', 'Banner'],
    composes: ['Card', 'Stack'],
    usage: '<HighlightCard\n  leading={<IconPill label="Consult">{Icon.calendar({ size: 18 })}</IconPill>}\n  title="Consultation summary"\n  action={<IconButton aria-label="Edit">{Icon.edit()}</IconButton>}\n  sections={[\n    { title: "Reason", content: <FieldList items={[{ label: "Reden", value: "…" }]} /> },\n    { title: "Parameters", tone: "warning", highlight: true, collapsible: true, content: "…" },\n  ]}\n/>',
  },
};
