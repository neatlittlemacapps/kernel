// LabResultCard — FHIR Observation (category=laboratory). Seed → Sprout.
// Shoot is rare for labs (acknowledge / request order) and pushed to Rooted.
//
// Data shape:
//   {
//     property: 'glucose'|'hba1c'|'egfr'|'hemoglobin'|'cholesterol',
//     value: number,
//     unit: string,
//     status: 'normal'|'borderline'|'high'|'low'|'critical',
//     low: number,            // reference range low
//     high: number,           // reference range high
//     measuredAt: string,     // datetime label
//     trend: { direction, value },
//   }

import { Card, StatusPill, TrendChip, ValueDisplay, IconPill } from './Card.jsx';
import { propertyMap, propertyIcons, ReferenceRangeBar, txtNL } from './lib.jsx';

const React = window.React;

export function LabResultCard({ data, stage = 'sprout', onAcknowledge, ...rest }) {
  const meta = propertyMap[data.property] || propertyMap.glucose;
  const Icon = propertyIcons.lab;
  const statusLabel = txtNL.status[data.status] || data.status;

  return (
    <Card
      stage={stage}
      tone="lab"
      status={data.status}
      ariaLabel={`${meta.label}: ${data.value} ${data.unit}, ${statusLabel}`}
      leading={<IconPill label={meta.label}><Icon size={16} /></IconPill>}
      title={meta.label}
      trailing={null}
      value={<ValueDisplay value={data.value} unit={data.unit} />}
      meta={
        <>
          <StatusPill status={data.status} label={statusLabel} />
          {data.trend && (
            <TrendChip direction={data.trend.direction} value={data.trend.value}
              label={`${txtNL.trendLabel} ${data.trend.value}`} />
          )}
        </>
      }
      media={
        stage === 'sprout' && data.low != null && data.high != null
          ? <ReferenceRangeBar value={data.value} low={data.low} high={data.high}
              ariaLabel={`${txtNL.refRange} ${data.low}–${data.high} ${data.unit}`} />
          : null
      }
      footer={
        stage === 'sprout'
          ? (
            <>
              <span>{txtNL.refRange}: {data.low}–{data.high} {data.unit}</span>
              {data.measuredAt && <span>{txtNL.takenAt} {data.measuredAt}</span>}
            </>
          )
          : null
      }
      {...rest}
    />
  );
}

export const meta = {
  LabResultCard: {
    layer: 'composite', scope: 'global', usecases: ['lab-result', 'sprout-pattern'], status: 'experimental',
    summary: 'FHIR Observation (laboratory) Seed/Sprout. Reference range central; Shoot rare (lab acknowledge → Rooted).',
    props: {
      data: 'object',          // { property, value, unit, status, low, high, measuredAt, trend }
      stage: "'seed'|'sprout'|'shoot'",
      onAcknowledge: '?fn',
    },
    composes: ['Card', 'StatusPill', 'TrendChip', 'ValueDisplay', 'IconPill', 'ReferenceRangeBar'],
  },
};
