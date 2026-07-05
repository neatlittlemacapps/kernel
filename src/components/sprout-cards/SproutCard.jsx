// SproutCard — stateful orchestrator for the Seed → Sprout → Shoot fidelity
// motion. Composes any per-object card (VitalSignCard, LabResultCard, etc.) via a
// render prop and owns:
//   - stage state machine (seed → sprout → shoot, and the reverses)
//   - View Transitions API choreography (with CSS Grid + reduced-motion fallbacks)
//   - keyboard handlers (Enter/Space to expand, Esc to collapse)
//   - ARIA wiring (role, tabIndex, aria-expanded)
//
// Rooted (the 4th Sprout stage) is the native-application handoff — not modelled
// here; consumer fires onRooted and navigates the host app.
//
// Usage:
//   <SproutCard
//     render={(stage, t) => (
//       <VitalSignCard data={hr} stage={stage}
//         onEdit={t.toShoot}
//         onSave={(v) => { save(v); t.toSprout(); }} />
//     )}
//   />
//
// Or fully controlled (host owns state):
//   <SproutCard stage={stage} onStageChange={setStage} render={...} />

const React = window.React;
const ReactDOM = window.ReactDOM;

let _vtSeq = 0;

export function SproutCard({
  initialStage = 'seed',
  stage: controlledStage,      // if set, component is controlled
  onStageChange,
  render,
  onRooted,                    // fired when consumer asks for native-app handoff (Stage 4)
  className = '',
  ...rest
}) {
  const isControlled = controlledStage !== undefined;
  const [internalStage, setInternalStage] = React.useState(initialStage);
  const stage = isControlled ? controlledStage : internalStage;
  const wrapperRef = React.useRef(null);

  const setStage = React.useCallback((next) => {
    if (next === stage) return;
    onStageChange?.(next);
    if (isControlled) return; // host owns state

    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    const supportsVT = typeof document !== 'undefined'
      && typeof document.startViewTransition === 'function';

    if (reduce || !supportsVT) {
      setInternalStage(next);
      return;
    }

    // Tag only this card for the transition so duplicate view-transition-names
    // across the page don't cause spec errors. Tag removed after the transition
    // finishes (success or fail).
    const el = wrapperRef.current;
    if (el) el.style.viewTransitionName = 'krnl-pcard-active';

    const transition = document.startViewTransition(() => {
      ReactDOM.flushSync(() => setInternalStage(next));
    });

    const cleanup = () => { if (el) el.style.viewTransitionName = ''; };
    transition.finished.then(cleanup, cleanup);
  }, [stage, isControlled, onStageChange]);

  const transitions = React.useMemo(() => ({
    toSeed:   () => setStage('seed'),
    toSprout: () => setStage('sprout'),
    toShoot:  () => setStage('shoot'),
    toggle:   () => setStage(stage === 'seed' ? 'sprout' : 'seed'),
    expand: () => {
      if (stage === 'seed') setStage('sprout');
      else if (stage === 'sprout') setStage('shoot');
    },
    collapse: () => {
      if (stage === 'shoot') setStage('sprout');
      else if (stage === 'sprout') setStage('seed');
    },
    rooted: () => onRooted?.(),
  }), [stage, setStage, onRooted]);

  const interactive = stage === 'seed';

  const handleClick = interactive
    ? (e) => {
        // Block bubbled clicks from genuinely-interactive descendants (steppers,
        // edit chips at sprout/shoot). At seed there shouldn't be any.
        const inner = e.target.closest?.('button, a, input, select, textarea');
        if (inner && inner !== e.currentTarget) return;
        transitions.expand();
      }
    : undefined;

  const handleKeyDown = (e) => {
    if (interactive && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      transitions.expand();
    } else if (e.key === 'Escape' && stage !== 'seed') {
      e.preventDefault();
      transitions.collapse();
    }
  };

  return (
    <div
      ref={wrapperRef}
      className={['krnl-pcard-shell', `is-stage-${stage}`, className].filter(Boolean).join(' ')}
      data-sprout-stage={stage}
      role={interactive ? 'button' : undefined}
      tabIndex={interactive ? 0 : -1}
      aria-expanded={stage !== 'seed' || undefined}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      {...rest}
    >
      {render(stage, transitions)}
    </div>
  );
}

// ─── SproutToneProvider ─────────────────────────────────────────────────
// Subtree-scoped tone for any sprout-cards (and any other consumer of
// `--card-tone`). Sets the CSS custom property on a wrapper; descendants
// inherit via the CSS cascade — no React Context needed.
//
// Three modes, escalating in control:
//   <SproutToneProvider tone="heart">...</SproutToneProvider>
//   <SproutToneProvider customColor="oklch(.62 .18 25)">...</SproutToneProvider>
//   <SproutToneProvider customColor={{ solid, tint, tintStrong, on }}>...</SproutToneProvider>
//
// Cards inside that explicitly set their own tone (e.g. tone="oxygen") override
// the provider — the provider is the default, not a forced override.

export function SproutToneProvider({ tone, customColor, children, className = '', ...rest }) {
  const style = {};
  if (customColor) {
    if (typeof customColor === 'string') {
      style['--card-tone'] = customColor;
    } else if (typeof customColor === 'object') {
      if (customColor.solid)      style['--card-tone'] = customColor.solid;
      if (customColor.tint)       style['--card-tone-tint'] = customColor.tint;
      if (customColor.tintStrong) style['--card-tone-tint-strong'] = customColor.tintStrong;
      if (customColor.on)         style['--card-tone-on'] = customColor.on;
    }
  }
  const cls = [
    'krnl-sprout-tone-provider',
    tone && `krnl-tone--${tone}`,
    className,
  ].filter(Boolean).join(' ');
  return <div className={cls} style={style} {...rest}>{children}</div>;
}

export const meta = {
  SproutCard: {
    layer: 'composite',
    scope: 'global',
    usecases: ['sprout-pattern', 'fidelity-orchestrator'],
    status: 'experimental',
    summary: 'Stateful wrapper that owns Seed↔Sprout↔Shoot stage state and applies the cross-stage view-transition animation. Render-prop based; per-object cards stay presentational.',
    props: {
      initialStage: "'seed'|'sprout'|'shoot'",
      stage: "?'seed'|'sprout'|'shoot' (controlled mode)",
      onStageChange: '?fn',
      render: 'fn',
      onRooted: '?fn',
      className: '?string',
    },
    composes: [],
    usage: '<SproutCard initialStage="seed" render={(stage, t) => <VitalSignCard data={hr} stage={stage} onEdit={t.toShoot} />} />',
  },
  SproutToneProvider: {
    layer: 'composite',
    scope: 'global',
    usecases: ['sprout-pattern', 'theming'],
    status: 'experimental',
    summary: 'Sets --card-tone (and optionally tint/tintStrong/on) on a wrapper so descendant cards inherit a tone. Cards that explicitly pass tone override the provider.',
    props: {
      tone: "?'neutral'|'heart'|'breath'|'oxygen'|'temperature'|'pressure'|'body'|'lab'|'identity'|'condition'|'allergy'|'medication'",
      customColor: '?string|{solid,tint,tintStrong,on}',
      className: '?string',
    },
    composes: [],
  },
};
