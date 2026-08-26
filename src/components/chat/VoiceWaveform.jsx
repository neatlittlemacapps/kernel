// VoiceWaveform - the "listening to you" affordance: a compact row of bars that rise
// with the live input level and collapse into blinking dots when it goes quiet. The
// user-speaking counterpart to TypingIndicator's assistant-is-working dots. Purely
// presentational and level-driven (0..1) - capturing mic/metering is the app's concern,
// not the design system's. Token-styled via .krnl-voicewave* (NOT .krnl-wave - that is the
// waving-hand emoji); each bar also dances independently on a staggered scaleY loop.
// Colour reacts to the SAME level in real time: `tone` (default the accent/"primary" fill)
// paints the bars while sound is detected, `idleTone` (default "warning") paints the dots
// once level drops back to idle - no extra state, both are just var() swaps on `idle`.
import { toneFill } from '../../lib/tone.js';

const React = window.React;

// Below this level the indicator rests as blinking dots rather than bars.
const IDLE_BELOW = 0.08;
// Symmetric bell weighting so the centre bar reacts most - the familiar voice look.
const bell = (i, n) => 0.55 + 0.45 * Math.sin((Math.PI * (i + 0.5)) / n);

export const VoiceWaveform = React.forwardRef(function VoiceWaveform(
  { level = 0, bars = 3, tone, idleTone = 'warning', size = 'md', className = '', style, 'aria-label': ariaLabel, ...rest }, ref) {
  const lvl = Math.max(0, Math.min(1, level));
  const idle = lvl <= IDLE_BELOW;
  const fill = toneFill(tone);
  const idleFill = toneFill(idleTone);
  return (
    <div ref={ref}
      className={`krnl-voicewave${idle ? ' is-idle' : ''} ${className}`.trim()}
      data-size={size !== 'md' ? size : undefined}
      role="img" aria-label={ariaLabel || 'Voice input level'}
      style={{
        '--wave-level': lvl,
        ...(fill ? { '--wave-fill': fill } : null),
        ...(idleFill ? { '--wave-fill-idle': idleFill } : null),
        ...style,
      }}
      {...rest}>
      {(() => {
        const n = Math.max(1, bars);
        const center = (n - 1) / 2;
        return Array.from({ length: n }).map((_, i) => {
          // Distance from centre drives the phase: centre leads (most negative delay),
          // edges lag (0), so the wave radiates outward symmetrically. All delays <= 0
          // so there is no one-time start pause.
          const delay = (-(center - Math.abs(i - center)) * 0.14).toFixed(3);
          return <i key={i} aria-hidden="true" style={{ '--i': i, '--w': bell(i, n).toFixed(3), '--wave-delay': `${delay}s` }} />;
        });
      })()}
    </div>
  );
});

export const meta = {
  VoiceWaveform: {
    layer: 'atom', scope: 'global', status: 'experimental', category: 'Communication',
    usecases: ['voice input', 'listening', 'recording', 'mic level'],
    keywords: ['voice', 'waveform', 'wave', 'audio', 'mic', 'microphone', 'listening', 'recording', 'level', 'bars', 'dots'],
    summary: 'A compact row of bars that rise with the live input level and rest as blinking dots when quiet - the "listening to you" counterpart to TypingIndicator.',
    props: [
      { name: 'level', class: 'content', type: 'number', default: 0, description: 'Current input loudness, 0..1 (clamped). The app feeds this from its mic metering; at/below ~0.08 the bars rest as blinking dots.' },
      { name: 'bars', class: 'dsPresentation', type: 'number', default: 3, description: 'How many bars/dots to render. Odd counts read best (the centre bar peaks).' },
      { name: 'tone', class: 'dsPresentation', type: 'string', description: 'Bar colour while sound is detected (level above idle): a named status tone (info/success/warning/error), a data tone (data-1..data-6), "primary", or any colour/var. Omit for the default --action-accent fill.' },
      { name: 'idleTone', class: 'dsPresentation', type: 'string', default: 'warning', description: 'Dot colour once level drops to idle (no sound detected) - same value space as tone. Swaps in real time as level crosses the idle threshold; pass "primary" (or match tone) to keep one colour throughout, or null/"neutral" for the default fill in both states.' },
      { name: 'size', class: 'dsPresentation', values: ['sm', 'md', 'lg'], default: 'md', description: 'Overall height: sm 16px, md 22px (default), lg 30px. Bar width and dot size stay constant.' },
      { name: 'aria-label', class: 'a11y', type: 'string', default: 'Voice input level', description: 'Accessible name for the indicator (role="img"); the bars themselves are aria-hidden.' },
    ],
    bestPractices: [
      { do: true, text: 'Drive level from real mic metering (0..1) and update it on a timer (~every 80ms); the bars transition smoothly between renders.' },
      { do: true, text: 'Show it in the composer while the mic is live - it is the user-speaking mirror of TypingIndicator (assistant working).' },
      { do: true, text: 'Leave idleTone at its "warning" default so the colour itself signals "not hearing you yet" - no separate status text needed for that state.' },
      { do: false, text: 'Use it as a scrubbable seek/waveform for recorded audio - this is a live level meter, not a track timeline.' },
    ],
    anatomy: [
      { name: 'bars', required: true, description: 'The animated bars; their height maps from level with a centre-weighted bell; coloured by tone.' },
      { name: 'dots', required: false, description: 'The idle state - each bar collapses to a round blinking dot when level is near zero; coloured by idleTone.' },
    ],
    related: ['TypingIndicator', 'PromptField'],
    composes: [],
    usage: '<VoiceWaveform level={0.6} bars={3} /> {/* idleTone="warning" by default; add tone="primary" to be explicit about the active colour */}',
  },
};
