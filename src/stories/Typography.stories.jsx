// @hand-authored - a Foundations reference, not a component. Lists every Kernel
// typography role token (--typography-<role>) with a live sample, so a designer or
// engineer can see the full type scale and - the point of this page - which roles are
// set in the HEADING font vs the BODY font. In Corilus both resolve to "Corporate S
// Pro", but the split is real (it re-brands per --font-heading / --font-body), so build
// headings from the heading roles and running text from the body roles rather than
// mixing arbitrary sizes.
const React = window.React;

// Each role rendered from its GRANULAR parts (family + size + weight + line-height),
// not the `--typography-<role>` `font` shorthand: the shorthand resets font-family, and
// we want to show the family the token actually carries. Overline/label add their own
// tracking + case, which live outside the shorthand too (per TYPE-MAP.md).
const ROLE = (role, { tracking, transform } = {}) => ({
  role,
  style: {
    fontFamily: `var(--typography-${role}-font-family)`,
    fontSize: `var(--typography-${role}-font-size)`,
    fontWeight: `var(--typography-${role}-font-weight)`,
    lineHeight: `var(--typography-${role}-line-height)`,
    letterSpacing: tracking ? `var(--type-tracking-${tracking})` : undefined,
    textTransform: transform,
    color: 'var(--text-default)',
    margin: 0,
  },
});

const HEADING_ROLES = [
  ROLE('display'), ROLE('heading-lg'), ROLE('heading-md'), ROLE('heading-sm'),
  ROLE('title-md'), ROLE('title-sm'),
];
const BODY_ROLES = [
  ROLE('body-lg'), ROLE('body-md'), ROLE('body-sm'),
  ROLE('label-lg'), ROLE('label-md'), ROLE('label-sm'),
  ROLE('overline', { tracking: 'wide', transform: 'uppercase' }),
  ROLE('caption-md'), ROLE('caption-sm'), ROLE('micro'),
];

const SAMPLE = 'The five boxing wizards jump quickly';

// A tiny live probe so the metadata line shows the *resolved* px + weight, not a guess -
// it stays correct if the scale is ever retuned.
function Row({ role, style }) {
  const meta = React.useRef(null);
  const [txt, setTxt] = React.useState('');
  React.useEffect(() => {
    if (!meta.current) return;
    const cs = getComputedStyle(meta.current);
    setTxt(`${Math.round(parseFloat(cs.fontSize))}px · ${cs.fontWeight}`);
  }, []);
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '150px 1fr', gap: '1.5rem', alignItems: 'baseline', padding: '0.6rem 0', borderBottom: '1px solid var(--border-subtle)' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <code style={{ fontFamily: 'var(--typography-caption-md-font-family)', fontSize: 'var(--typography-caption-md-font-size)', color: 'var(--text-default)', fontWeight: 'var(--type-weight-semibold)' }}>{role}</code>
        <span ref={meta} style={style} aria-hidden="true" data-probe />
        <span style={{ fontFamily: 'var(--typography-caption-sm-font-family)', fontSize: 'var(--typography-caption-sm-font-size)', color: 'var(--text-muted)' }}>{txt}</span>
      </div>
      <p style={style}>{SAMPLE}</p>
    </div>
  );
}

function Group({ label, font, roles }) {
  return (
    <section style={{ marginBottom: '2.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.75rem', marginBottom: '0.5rem' }}>
        <h3 style={{ margin: 0, fontFamily: 'var(--typography-title-md-font-family)', fontSize: 'var(--typography-title-md-font-size)', fontWeight: 'var(--typography-title-md-font-weight)', color: 'var(--text-default)' }}>{label}</h3>
        <code style={{ fontFamily: 'var(--typography-caption-md-font-family)', fontSize: 'var(--typography-caption-md-font-size)', color: 'var(--text-muted)' }}>{font}</code>
      </div>
      {roles.map((r) => <Row key={r.role} {...r} />)}
    </section>
  );
}

export default {
  title: 'Foundations/Typography',
  parameters: {
    layout: 'fullscreen',
    docs: { description: { component: 'Every Kernel typography role token, live. Headings + titles are set in `--font-heading`; running text, labels, and captions in `--font-body`. Build type from these roles - never a raw font-size - so the scale (and the heading/body split, which re-brands per family token) stays consistent.' } },
  },
};

export const Scale = {
  render: () => (
    <div style={{ padding: '2rem', maxWidth: 900, fontFamily: 'var(--font-body)' }}>
      <h2 style={{ fontFamily: 'var(--typography-display-font-family)', fontSize: 'var(--typography-heading-lg-font-size)', fontWeight: 'var(--typography-heading-lg-font-weight)', color: 'var(--text-default)', margin: '0 0 0.25rem' }}>Typography roles</h2>
      <p style={{ fontFamily: 'var(--typography-body-md-font-family)', fontSize: 'var(--typography-body-md-font-size)', color: 'var(--text-muted)', margin: '0 0 2rem', maxWidth: '58ch', lineHeight: 'var(--typography-body-md-line-height)' }}>
        16 roles across two families. Compose UI from a role token (<code>--typography-&lt;role&gt;-*</code>), not a hand-picked px size — that is what keeps the page from mixing typefaces and weights. Use the granular <code>-font-family</code>/<code>-font-size</code>/<code>-font-weight</code> parts (not the <code>font</code> shorthand, which resets family).
      </p>
      <Group label="Heading &amp; title" font="--font-heading" roles={HEADING_ROLES} />
      <Group label="Body, label &amp; caption" font="--font-body" roles={BODY_ROLES} />
    </div>
  ),
};
