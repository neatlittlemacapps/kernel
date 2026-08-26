// @hand-authored
import { VoiceWaveform } from '@corilus/kernel/chat';

const React = window.React;

export default {
  title: 'Chat/VoiceWaveform',
  component: VoiceWaveform,
  tags: ['autodocs'],
  argTypes: {
    level: { control: { type: 'range', min: 0, max: 1, step: 0.01 }, description: "Current input loudness, 0..1 (clamped). Drag toward 0 to see the idle blinking dots.", table: { category: 'Content', defaultValue: { summary: "0" }, type: { summary: "number" } } },
    bars: { control: { type: 'range', min: 1, max: 9, step: 1 }, description: "How many bars/dots to render. Odd counts read best (the centre bar peaks).", table: { category: 'Appearance', defaultValue: { summary: "3" }, type: { summary: "number" } } },
    tone: { control: 'text', description: "Bar colour while sound is detected: a named status tone (info/success/warning/error), a data tone (data-1..data-6), \"primary\", or any colour/var. Omit for the default --action-accent fill.", table: { category: 'Appearance', type: { summary: "string" } } },
    idleTone: { control: 'text', description: "Dot colour once level drops to idle (no sound). Same value space as tone. Drag the level slider through the idle threshold (~0.08) to see it cross-fade live.", table: { category: 'Appearance', defaultValue: { summary: "warning" }, type: { summary: "string" } } },
    size: { control: 'inline-radio', options: ["sm","md","lg"], description: "Overall height: sm 16px, md 22px (default), lg 30px.", table: { category: 'Appearance', defaultValue: { summary: "md" } } },
    'aria-label': { control: 'text', description: "Accessible name for the indicator (role=\"img\"); the bars themselves are aria-hidden.", table: { category: 'Accessibility', defaultValue: { summary: "Voice input level" }, type: { summary: "string" } } },
  },
  parameters: {
    docs: {
      source: { state: 'open' },
      description: { component: "A compact row of bars that rise with the live input level and rest as blinking dots when quiet - the \"listening to you\" counterpart to TypingIndicator. Purely presentational: feed it a `level` (0..1) from your mic metering; capturing the mic is the app's job.\n\n**Import**\n\n```ts\nimport { VoiceWaveform } from '@corilus/kernel/chat'\n```\n\n**Do**\n- Drive level from real mic metering (0..1) and update it on a timer (~every 80ms); the bars transition smoothly between renders.\n- Show it in the composer while the mic is live - it is the user-speaking mirror of TypingIndicator (assistant working).\n\n**Don't**\n- Use it as a scrubbable seek/waveform for recorded audio - this is a live level meter, not a track timeline." },
    },
  },
};

// Drag the `level` slider through ~0.08: bars (tone, default primary/accent) cross-fade
// live into blinking dots (idleTone, default warning) as level falls to idle.
export const Playground = {
  args: { level: 0.55, bars: 3, size: 'md', idleTone: 'warning', 'aria-label': 'Voice input level' },
  parameters: { docs: { source: { code: `<VoiceWaveform level={0.6} bars={3} />  /* idleTone="warning" by default */` } } },
};

const Cell = ({ title, children }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'center', minWidth: 96 }}>
    <div style={{ minHeight: 32, display: 'flex', alignItems: 'center' }}>{children}</div>
    <span style={{ font: '12px/1.2 var(--typography-caption-md-font-family, sans-serif)', color: 'var(--text-muted)' }}>{title}</span>
  </div>
);

// The meaningful matrix at a glance: the idle dots, rising levels, sizes and tones.
export const Gallery = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
      <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', alignItems: 'flex-end' }}>
        <Cell title="idle · 0"><VoiceWaveform level={0} /></Cell>
        <Cell title="0.2"><VoiceWaveform level={0.2} /></Cell>
        <Cell title="0.5"><VoiceWaveform level={0.5} /></Cell>
        <Cell title="0.85"><VoiceWaveform level={0.85} /></Cell>
      </div>
      <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', alignItems: 'flex-end' }}>
        <Cell title="sm"><VoiceWaveform level={0.6} size="sm" /></Cell>
        <Cell title="md"><VoiceWaveform level={0.6} size="md" /></Cell>
        <Cell title="lg"><VoiceWaveform level={0.6} size="lg" /></Cell>
        <Cell title="5 bars"><VoiceWaveform level={0.6} bars={5} /></Cell>
        <Cell title="7 bars"><VoiceWaveform level={0.6} bars={7} /></Cell>
      </div>
      <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', alignItems: 'flex-end' }}>
        <Cell title="default"><VoiceWaveform level={0.7} /></Cell>
        <Cell title="success"><VoiceWaveform level={0.7} tone="success" /></Cell>
        <Cell title="primary"><VoiceWaveform level={0.7} tone="primary" /></Cell>
        <Cell title="error"><VoiceWaveform level={0.7} tone="error" /></Cell>
      </div>
      <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', alignItems: 'flex-end' }}>
        <Cell title="idle → warning"><VoiceWaveform level={0} /></Cell>
        <Cell title="sound → primary"><VoiceWaveform level={0.7} /></Cell>
        <Cell title="idleTone off"><VoiceWaveform level={0} idleTone="primary" /></Cell>
      </div>
    </div>
  ),
  parameters: { docs: { source: { code: `// Idle dots, rising levels, sizes, bar counts, and tones
<VoiceWaveform level={0} />                        {/* idle -> warning dots (idleTone default) */}
<VoiceWaveform level={0} idleTone="primary" />     {/* same colour in both states */}
<VoiceWaveform level={0.5} />
<VoiceWaveform level={0.85} bars={5} />
<VoiceWaveform level={0.6} size="lg" />
<VoiceWaveform level={0.7} tone="success" />       {/* info | success | warning | error | data-1..6 | primary */}` } } },
};

// Level is driven live here, so hide its slider - it would fight the animation.
const drivenLevel = { level: { control: false, table: { disable: true } } };

// Animates on its own (no mic): a CALM envelope drifts up and down - the lively motion
// is the per-bar dance, not the whole thing lurching.
function LiveDemo(args) {
  const [level, setLevel] = React.useState(0.6);
  React.useEffect(() => {
    let t = 0;
    const id = setInterval(() => { t += 0.22; setLevel(0.55 + 0.3 * Math.sin(t)); }, 140);
    return () => clearInterval(id);
  }, []);
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 14, background: 'var(--surface-raised)', border: '1px solid var(--border-subtle)', borderRadius: 999, padding: '12px 20px' }}>
      <VoiceWaveform bars={3} {...args} level={level} />
      <span style={{ font: '13px/1 var(--typography-body-sm-font-family, sans-serif)', color: 'var(--text-muted)' }}>listening…</span>
    </div>
  );
}

export const Live = {
  render: (args) => <LiveDemo {...args} />,
  argTypes: drivenLevel,
  parameters: { docs: { source: { code: `function Listening() {
  const [level, setLevel] = React.useState(0.6);
  React.useEffect(() => {
    let t = 0;
    const id = setInterval(() => { t += 0.22; setLevel(0.55 + 0.3 * Math.sin(t)); }, 140);  // calm envelope
    return () => clearInterval(id);
  }, []);
  return <VoiceWaveform level={level} bars={3} />;   // liveliness = the per-bar CSS dance
}` } } },
};

// Drives level from your real microphone (Web Audio RMS). Click "Start mic" - the
// browser asks permission. This is a STORY-ONLY harness: in a real app the composer
// owns the mic and feeds `level`; the DS atom never touches getUserMedia.
function MicDemo({ gate = 0.05, gain = 7, attack = 0.5, release = 0.12, ...waveArgs }) {
  const [level, setLevel] = React.useState(0);
  const smooth = React.useRef(0);
  // Read tuning inside the rAF loop via a ref, so control changes apply live (no restart).
  const tune = React.useRef({});
  tune.current = { gate, gain, attack, release };
  const [on, setOn] = React.useState(false);
  const [err, setErr] = React.useState('');
  const ref = React.useRef({});
  const stop = () => {
    const s = ref.current;
    if (s.raf) cancelAnimationFrame(s.raf);
    if (s.stream) s.stream.getTracks().forEach((t) => t.stop());
    if (s.ctx) s.ctx.close();
    ref.current = {};
    smooth.current = 0;
    setOn(false); setLevel(0);
  };
  const start = async () => {
    setErr('');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const src = ctx.createMediaStreamSource(stream);
      const analyser = ctx.createAnalyser(); analyser.fftSize = 512;
      const data = new Uint8Array(analyser.fftSize); src.connect(analyser);
      ref.current = { stream, ctx };
      setOn(true);
      const tick = () => {
        analyser.getByteTimeDomainData(data);
        let sum = 0; for (let i = 0; i < data.length; i++) { const v = (data[i] - 128) / 128; sum += v * v; }
        const rms = Math.sqrt(sum / data.length);
        const { gate, gain, attack, release } = tune.current;
        // Gate is ON/OFF only (below = idle dots); above it map the FULL rms (gain + gamma).
        // Fast attack, slow release = peak-hold, so speech sustains tall bars and only
        // fades to dots on real silence.
        const target = rms <= gate ? 0 : Math.min(1, Math.pow(rms * gain, 0.7));
        smooth.current += (target - smooth.current) * (target > smooth.current ? attack : release);
        setLevel(smooth.current < 0.03 ? 0 : smooth.current);
        ref.current.raf = requestAnimationFrame(tick);
      };
      tick();
    } catch (e) { setErr('Mic blocked or unavailable - check the browser permission.'); }
  };
  React.useEffect(() => stop, []);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'flex-start' }}>
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: 14, background: 'var(--surface-raised)', border: '1px solid var(--border-subtle)', borderRadius: 999, padding: '12px 20px' }}>
        <VoiceWaveform bars={5} {...waveArgs} level={level} />
        <span style={{ font: '13px/1 var(--typography-body-sm-font-family, sans-serif)', color: 'var(--text-muted)' }}>{on ? 'listening…' : 'idle'}</span>
      </div>
      <button onClick={on ? stop : start} className="krnl-btn krnl-btn--primary">{on ? 'Stop mic' : 'Start mic'}</button>
      {err ? <span style={{ font: '13px/1.3 sans-serif', color: 'var(--status-error-text, crimson)' }}>{err}</span> : null}
    </div>
  );
}

// Story-only mic-processing knobs (NOT VoiceWaveform props) - grouped as "Mic tuning".
const micKnob = (min, max, step, description) => ({
  control: { type: 'range', min, max, step }, table: { category: 'Mic tuning' }, description,
});
export const Microphone = {
  args: { bars: 5, gate: 0.05, gain: 7, attack: 0.5, release: 0.12 },
  argTypes: {
    ...drivenLevel,
    gate: micKnob(0, 0.2, 0.005, 'Silence gate (RMS). Below this the mic reports 0 → idle dots. Raise if idle twitches; lower if quiet speech gets cut.'),
    gain: micKnob(1, 15, 0.5, 'Loudness → height sensitivity (multiplies RMS before the gamma curve). Higher = bars react bigger.'),
    attack: micKnob(0.05, 1, 0.05, 'How fast the level rises to peaks (per frame). Higher = snappier.'),
    release: micKnob(0.03, 0.5, 0.01, 'How slowly the level falls (peak-hold). Lower = holds tall/steady longer, fades to dots more gently.'),
  },
  render: (args) => <MicDemo {...args} />,
  parameters: { docs: { source: { code: `// Drive the waveform from the real mic. The DS atom stays presentational -
// the app owns getUserMedia and feeds a 0..1 level.
function MicWaveform({ gate = 0.05, gain = 7, attack = 0.5, release = 0.12 } = {}) {
  const [level, setLevel] = React.useState(0);
  React.useEffect(() => {
    let raf, ctx, stream;
    navigator.mediaDevices.getUserMedia({ audio: true }).then((s) => {
      stream = s;
      ctx = new AudioContext();
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 512;
      ctx.createMediaStreamSource(s).connect(analyser);
      const data = new Uint8Array(analyser.fftSize);
      let smooth = 0;
      const tick = () => {
        analyser.getByteTimeDomainData(data);
        let sum = 0;
        for (const b of data) { const v = (b - 128) / 128; sum += v * v; }
        const rms = Math.sqrt(sum / data.length);
        const target = rms <= gate ? 0 : Math.min(1, Math.pow(rms * gain, 0.7));  // gate off/on, then gain+gamma
        smooth += (target - smooth) * (target > smooth ? attack : release);       // fast attack, slow release
        setLevel(smooth < 0.03 ? 0 : smooth);
        raf = requestAnimationFrame(tick);
      };
      tick();
    });
    return () => { cancelAnimationFrame(raf); stream?.getTracks().forEach((t) => t.stop()); ctx?.close(); };
  }, []);
  return <VoiceWaveform level={level} bars={5} />;
}` } } },
};
