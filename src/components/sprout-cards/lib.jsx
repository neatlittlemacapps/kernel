// Sprout-cards companion atoms: icons, mini-media components, Dutch labels,
// and the FHIR-property → tone/icon registry. Per-object cards import from here.
// All token-driven; no hardcoded colours/sizes.

import { Button } from '@base-ui-components/react/button';

const React = window.React;

// ── Strings (Dutch primary; matches reference image vocabulary) ──────────
// In production these would extend src/lib/i18n.js. Kept local for the
// exploration so the patterns lib doesn't pollute the companion's i18n table.
export const txtNL = {
  // status pill labels
  status: {
    normal: 'Normaal',
    borderline: 'Grenswaarde',
    high: 'Verhoogd',
    low: 'Verlaagd',
    critical: 'Kritisch',
  },
  // vital sign labels
  vitals: {
    heartRate: 'Hartslag',
    respiratoryRate: 'Ademhalingsfrequentie',
    oxygenSaturation: 'Zuurstofsaturatie',
    temperature: 'Temperatuur',
    bloodPressure: 'Bloeddruk',
    height: 'Lengte',
    weight: 'Gewicht',
    bmi: 'BMI',
    headCircumference: 'Hoofdomtrek',
  },
  // lab labels
  labs: {
    glucose: 'Glucose',
    hba1c: 'HbA1c',
    egfr: 'eGFR',
    hemoglobin: 'Hemoglobine',
    cholesterol: 'Cholesterol (totaal)',
  },
  // common UI
  edit: 'Bewerken',
  save: 'Waarde opslaan',
  takenAt: 'Gemeten',
  trendLabel: 'Trend',
  resting: 'rust',
  days7: '7-daags',
  refRange: 'Referentie',
  active: 'Actief',
  resolved: 'Opgelost',
  inRemission: 'In remissie',
  criticalityHigh: 'Hoog risico',
  criticalityLow: 'Laag risico',
  schedule: 'Schema',
  reaction: 'Reactie',
  noData: 'Geen meting',
  rooted: 'Open in dossier',
};

// ── Property registry ────────────────────────────────────────────────────
// FHIR property → { tone, icon, defaults }. Single source of truth.
export const propertyMap = {
  // vitals
  heartRate:          { loinc: '8867-4',  tone: 'heart',       label: txtNL.vitals.heartRate,         unit: 'bpm',        trendUp: 'warning' },
  respiratoryRate:    { loinc: '9279-1',  tone: 'breath',      label: txtNL.vitals.respiratoryRate,   unit: '/min',       trendUp: 'warning' },
  oxygenSaturation:   { loinc: '2708-6',  tone: 'oxygen',      label: txtNL.vitals.oxygenSaturation,  unit: '%',          trendUp: 'success' },
  temperature:        { loinc: '8310-5',  tone: 'temperature', label: txtNL.vitals.temperature,       unit: '°C',         trendUp: 'warning' },
  bloodPressure:      { loinc: '85354-9', tone: 'pressure',    label: txtNL.vitals.bloodPressure,     unit: 'mmHg',       trendUp: 'warning' },
  height:             { loinc: '8302-2',  tone: 'body',        label: txtNL.vitals.height,            unit: 'cm',         trendUp: 'info'    },
  weight:             { loinc: '29463-7', tone: 'body',        label: txtNL.vitals.weight,            unit: 'kg',         trendUp: 'warning' },
  bmi:                { loinc: '39156-5', tone: 'body',        label: txtNL.vitals.bmi,               unit: 'kg/m²',      trendUp: 'warning' },
  headCircumference:  { loinc: '9843-4',  tone: 'body',        label: txtNL.vitals.headCircumference, unit: 'cm',         trendUp: 'info'    },
  // labs
  glucose:            { tone: 'lab', label: txtNL.labs.glucose,     unit: 'mmol/L', trendUp: 'warning' },
  hba1c:              { tone: 'lab', label: txtNL.labs.hba1c,       unit: '%',      trendUp: 'warning' },
  egfr:               { tone: 'lab', label: txtNL.labs.egfr,        unit: 'mL/min', trendUp: 'success' },
  hemoglobin:         { tone: 'lab', label: txtNL.labs.hemoglobin,  unit: 'g/dL',   trendUp: 'success' },
  cholesterol:        { tone: 'lab', label: txtNL.labs.cholesterol, unit: 'mmol/L', trendUp: 'warning' },
};

// ── Icons (one glyph per property; minimal stroke style to match Companion) ─
const S = (p) => ({
  width: p.size || 18,
  height: p.size || 18,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
});

export const propertyIcons = {
  heartRate: (p) => <svg {...S(p)}><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" /></svg>,
  respiratoryRate: (p) => <svg {...S(p)}><path d="M6 12c0-3 2-5 4-5 1.5 0 2 1 2 2s-.5 2-2 2-2-1-2-2" /><path d="M18 12c0-3-2-5-4-5-1.5 0-2 1-2 2s.5 2 2 2 2-1 2-2" /><path d="M12 14v6" /><path d="M9 20h6" /></svg>,
  oxygenSaturation: (p) => <svg {...S(p)}><path d="M12 2L5 12a7 7 0 1014 0L12 2z" /></svg>,
  temperature: (p) => <svg {...S(p)}><path d="M14 14.76V3.5a2.5 2.5 0 00-5 0v11.26a4.5 4.5 0 105 0z" /></svg>,
  bloodPressure: (p) => <svg {...S(p)}><circle cx="12" cy="12" r="8" /><path d="M12 8v4l3 2" /></svg>,
  height: (p) => <svg {...S(p)}><path d="M4 22V2" /><path d="M9 5h-5" /><path d="M9 12h-5" /><path d="M9 19h-5" /><path d="M16 22V2" /><path d="M20 5h-4" /><path d="M20 12h-4" /><path d="M20 19h-4" /></svg>,
  weight: (p) => <svg {...S(p)}><path d="M2 21l1-7h18l1 7H2z" /><circle cx="12" cy="9" r="3" /><path d="M12 3v3" /></svg>,
  bmi: (p) => <svg {...S(p)}><rect x="3" y="6" width="18" height="12" rx="2" /><path d="M7 12h2" /><path d="M11 9v6" /><path d="M11 12h3" /><path d="M16 9v6" /></svg>,
  headCircumference: (p) => <svg {...S(p)}><circle cx="12" cy="12" r="9" /><path d="M3 12c0-2 4-4 9-4s9 2 9 4" /></svg>,
  // labs (all share the lab icon — a flask)
  lab: (p) => <svg {...S(p)}><path d="M10 2v6L4 20a2 2 0 002 2h12a2 2 0 002-2L14 8V2" /><path d="M9 2h6" /><path d="M7 16h10" /></svg>,
  // condition / allergy / medication / identity
  condition: (p) => <svg {...S(p)}><circle cx="12" cy="12" r="9" /><path d="M12 8v4" /><circle cx="12" cy="16" r="1" fill="currentColor" stroke="none" /></svg>,
  allergy: (p) => <svg {...S(p)}><path d="M12 2l3 7h7l-5.5 4.5L18 21l-6-4-6 4 1.5-7.5L2 9h7l3-7z" /></svg>,
  medication: (p) => <svg {...S(p)}><path d="M10.5 20.5L3 13a5 5 0 017-7l7.5 7.5a5 5 0 01-7 7z" /><line x1="8.5" y1="8.5" x2="15.5" y2="15.5" /></svg>,
  identity: (p) => <svg {...S(p)}><circle cx="12" cy="8" r="4" /><path d="M4 20v-1a8 8 0 0116 0v1" /></svg>,
};

// resolve a property key (or a tone string for cross-resource cards) to an icon
export function iconFor(propertyOrTone) {
  return propertyIcons[propertyOrTone] || propertyIcons.identity;
}

// Sparkline + FieldList were EXTRACTED to ../content/content.jsx (2026-08) and
// PROMOTED to the generic surface. Re-exported here so this clinical slice + its
// existing '@corilus/kernel/clinical' importers keep working unchanged.
export { Sparkline, FieldList } from '../content/content.jsx';
// Inline SVG line + soft gradient fill. Uses the card tone via currentColor so
// the consumer needs only style="color: var(--card-tone)" on a parent — but
// in practice we set `currentColor` to the card tone via .krnl-pcard-media.
// ── Reference-range bar — lab card media ────────────────────────────────
// A horizontal range strip with the patient's marker. low/high define the
// normal range; value is the measurement; absMin/absMax bound the axis.
export function ReferenceRangeBar({ value, low, high, absMin, absMax, ariaLabel }) {
  const min = absMin != null ? absMin : Math.min(value, low) * 0.7;
  const max = absMax != null ? absMax : Math.max(value, high) * 1.3;
  const pct = (v) => Math.max(0, Math.min(100, ((v - min) / (max - min)) * 100));
  const lowPct = pct(low);
  const highPct = pct(high);
  const valPct = pct(value);
  const inRange = value >= low && value <= high;
  return (
    <div className="krnl-refbar" role="img" aria-label={ariaLabel}>
      <div className="krnl-refbar-track">
        <div className="krnl-refbar-normal" style={{ left: `${lowPct}%`, width: `${highPct - lowPct}%` }} />
        <div className={`krnl-refbar-marker ${inRange ? 'is-in-range' : 'is-out-of-range'}`}
             style={{ left: `${valPct}%` }} />
      </div>
      <div className="krnl-refbar-scale">
        <span>{low}</span>
        <span>{high}</span>
      </div>
    </div>
  );
}

// ── Schedule strip — medication 7-day adherence ──────────────────────────
export function ScheduleStrip({ days = [], ariaLabel }) {
  // days: array of { label, status: 'taken'|'missed'|'upcoming'|'paused' }
  return (
    <ol className="krnl-schedule-strip" role="img" aria-label={ariaLabel}>
      {days.map((d, i) => (
        <li key={i} className={`krnl-schedule-day is-${d.status}`} title={d.label}>
          <span className="krnl-schedule-day-label">{d.label}</span>
          <span className="krnl-schedule-day-dot" aria-hidden="true" />
        </li>
      ))}
    </ol>
  );
}

// ── ReactionList — allergy reactions ─────────────────────────────────────
export function ReactionList({ reactions = [] }) {
  return (
    <ul className="krnl-reaction-list">
      {reactions.map((r, i) => (
        <li key={i} className="krnl-reaction-item">
          <span className="krnl-reaction-dot" aria-hidden="true" />
          <span>{r}</span>
        </li>
      ))}
    </ul>
  );
}

// ── Primary CTA used in the actions slot ────────────────────────────────
// Composes Base UI Button (a11y/focus baseline from useButton). Visual style
// is owned here via .krnl-pcard-primary-cta (token-driven).
export function PrimaryCTA({ children, onClick, disabled }) {
  return (
    <Button className="krnl-pcard-primary-cta" onClick={onClick} disabled={disabled}>
      {children}
    </Button>
  );
}

export const meta = {
  ReferenceRangeBar: {
    layer: 'atom', scope: 'global', status: 'experimental', category: 'Data display',
    usecases: ['card-media', 'lab-range'],
    keywords: ['reference-range', 'range', 'lab', 'marker', 'normal', 'gauge', 'threshold', 'bar'],
    summary: 'Horizontal reference-range strip: a normal band plus a marker for the measured value, colour-coded in or out of range.',
    props: {
      value: { class: 'content', type: 'number', required: true, example: 5.9, description: 'The measured value; positions the marker and decides its in-range or out-of-range styling.' },
      low: { class: 'content', type: 'number', required: true, example: 4, description: 'Lower bound of the normal band, shown as the left scale tick.' },
      high: { class: 'content', type: 'number', required: true, example: 5.6, description: 'Upper bound of the normal band, shown as the right scale tick.' },
      absMin: { class: 'content', type: 'number', description: 'Left end of the drawn axis. Defaults to 70% of the smaller of value and low when omitted, so the marker never sits on the edge.' },
      absMax: { class: 'content', type: 'number', description: 'Right end of the drawn axis. Defaults to 130% of the larger of value and high when omitted.' },
      ariaLabel: { class: 'a11y', type: 'string', description: 'Accessible name for the img-role strip, e.g. the value against its reference range in words.' },
    },
    anatomy: [
      { name: 'Track', required: true, description: 'The full-width axis the marker travels along.' },
      { name: 'Normal band', required: true, description: 'The shaded span between low and high.' },
      { name: 'Marker', required: true, description: 'The value indicator; styled in-range or out-of-range.' },
      { name: 'Scale', required: true, description: 'The low and high numeric ticks under the track.' },
    ],
    composes: [],
    usage: '<ReferenceRangeBar value={5.9} low={4} high={5.6} ariaLabel="HbA1c 5.9%, reference 4 to 5.6" />',
  },
  ScheduleStrip: {
    layer: 'atom', scope: 'global', status: 'experimental', category: 'Data display',
    usecases: ['card-media', 'medication'],
    keywords: ['schedule', 'adherence', 'medication', 'dose', 'week', 'strip', 'calendar', 'compliance'],
    summary: 'Compact row of day cells for medication adherence; each cell colours by its taken / missed / upcoming / paused status.',
    props: {
      days: { class: 'content', type: 'Array<{ label: string, status: string }>', required: true, example: [{ label: 'Mo', status: 'taken' }, { label: 'Tu', status: 'taken' }, { label: 'We', status: 'missed' }, { label: 'Th', status: 'taken' }, { label: 'Fr', status: 'upcoming' }, { label: 'Sa', status: 'upcoming' }, { label: 'Su', status: 'paused' }], description: 'Ordered day cells. label is the short day name shown under each dot; status is one of taken, missed, upcoming, or paused and drives the dot colour.' },
      ariaLabel: { class: 'a11y', type: 'string', description: 'Accessible name for the img-role list, e.g. a summary of the adherence week.' },
    },
    bestPractices: [
      { do: true, text: 'Use taken and missed for past days, upcoming for future doses, and paused for a suspended course.' },
      { do: true, text: 'Keep labels to one or two characters (weekday initials) so the strip stays compact.' },
      { do: false, text: 'Drive this from a status value outside taken, missed, upcoming, or paused; unknown values get no styled dot.' },
    ],
    composes: [],
    usage: '<ScheduleStrip days={[{ label: "Mo", status: "taken" }, { label: "Tu", status: "missed" }]} ariaLabel="Adherence this week" />',
  },
  ReactionList: {
    layer: 'atom', scope: 'global', status: 'experimental', category: 'Data display',
    usecases: ['card-body', 'allergy'],
    keywords: ['reaction', 'allergy', 'list', 'symptoms', 'bulleted', 'intolerance'],
    summary: 'Bulleted list of allergy reactions, each with a leading dot marker.',
    props: {
      reactions: { class: 'content', type: 'string[]', required: true, example: ['Netelroos', 'Angio-oedeem', 'Anafylaxie'], description: 'The reaction descriptions to list, one bullet each (e.g. hives, anaphylaxis).' },
    },
    composes: [],
    usage: '<ReactionList reactions={["Hives", "Anaphylaxis"]} />',
  },
  PrimaryCTA: {
    layer: 'atom', scope: 'global', status: 'experimental', category: 'Action',
    usecases: ['card-actions'],
    keywords: ['button', 'cta', 'primary', 'action', 'save', 'confirm', 'submit'],
    summary: 'Primary action button for the card actions slot; composes Base UI Button for the focus and keyboard baseline, styled via tokens.',
    props: {
      children: { class: 'content', type: 'ReactNode', example: 'Waarde opslaan', description: 'The button label. Write the action it performs (e.g. "Save value"), not "OK".' },
      onClick: { class: 'event', type: 'fn', description: 'Invoked when the button is activated by pointer or keyboard.' },
      disabled: { class: 'passThroughControl', passthrough: 'BaseUI.Button.disabled' },
    },
    composes: [],
    usage: '<PrimaryCTA onClick={save}>Save value</PrimaryCTA>',
  },
};
