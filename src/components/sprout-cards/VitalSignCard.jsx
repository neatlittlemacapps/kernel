// VitalSignCard — FHIR Observation (category=vital-signs) at Seed/Sprout/Shoot.
// Handles 9 vital signs incl. blood pressure (multi-component: systolic + diastolic).
//
// Data shape (lean projection of FHIR Observation):
//   {
//     property: 'heartRate' | … | 'bloodPressure',
//     value: number | { systolic: number, diastolic: number },
//     unit: string,
//     status: 'normal'|'borderline'|'high'|'low'|'critical',
//     measuredAt: string,            // 'HH:mm' or any display string
//     history: number[],             // for sparkline (Sprout)
//     reference: string,             // 'rust 64' / display label
//     trend: { direction, value }    // optional
//   }

import { Card, StatusPill, TrendChip, ValueDisplay, Stepper, IconPill, EditChip } from './Card.jsx';
import { propertyMap, propertyIcons, Sparkline, PrimaryCTA, txtNL } from './lib.jsx';

const React = window.React;

export function VitalSignCard({ data, stage = 'sprout', onSave, onEdit, ...rest }) {
  const meta = propertyMap[data.property] || propertyMap.heartRate;
  const tone = meta.tone;
  const isBP = data.property === 'bloodPressure';

  const Icon = propertyIcons[data.property] || propertyIcons.identity;

  const renderValue = () => {
    if (isBP) {
      const { systolic, diastolic } = data.value;
      return (
        <span className="cc-pcard-value-display">
          <span className="cc-pcard-value-num">{systolic}</span>
          <span className="cc-pcard-value-num cc-pcard-value-sep">/</span>
          <span className="cc-pcard-value-num">{diastolic}</span>
          <span className="cc-pcard-value-unit">{data.unit}</span>
        </span>
      );
    }
    if (stage === 'shoot' && !isBP) {
      return (
        <Stepper value={data.value} unit={data.unit} step={meta.step || 1}
          onChange={(v) => onSave?.(v)} ariaLabel={meta.label} />
      );
    }
    return <ValueDisplay value={data.value} unit={data.unit} />;
  };

  // Per-property trend direction tone (TOKEN-GAPS #10). For HR/temp/weight/BP,
  // "up" is concerning (warning); for SpO₂, "up" is good (success). Approximate
  // by reading propertyMap.trendUp.
  const trendDirection = data.trend ? {
    ...data.trend,
    statusHint: meta.trendUp,
  } : null;

  const statusLabel = txtNL.status[data.status] || data.status;

  return (
    <Card
      stage={stage}
      tone={tone}
      status={data.status}
      ariaLabel={`${meta.label}: ${formatVitalValue(data)} ${data.unit}, ${statusLabel}`}
      leading={<IconPill label={meta.label}><Icon size={16} /></IconPill>}
      title={meta.label}
      trailing={
        stage === 'sprout'
          ? <EditChip label={txtNL.edit} onClick={onEdit} />
          : null
      }
      value={renderValue()}
      meta={
        stage === 'seed'
          ? <StatusPill status={data.status} label={statusLabel} />
          : (
            <>
              <StatusPill status={data.status} label={statusLabel} />
              {trendDirection && (
                <TrendChip direction={trendDirection.direction} value={trendDirection.value}
                  label={`${txtNL.trendLabel} ${trendDirection.value}`} />
              )}
            </>
          )
      }
      media={
        stage === 'sprout' && data.history && data.history.length > 1
          ? <Sparkline data={data.history} ariaLabel={`${meta.label} trend`} />
          : null
      }
      footer={
        stage === 'sprout'
          ? (
            <>
              {data.reference && <span>{txtNL.days7} · {data.reference}</span>}
              {data.measuredAt && <span>{txtNL.takenAt} {data.measuredAt}</span>}
            </>
          )
          : null
      }
      actions={
        stage === 'shoot'
          ? <PrimaryCTA onClick={() => onSave?.(data.value)}>{txtNL.save}</PrimaryCTA>
          : null
      }
      {...rest}
    />
  );
}

function formatVitalValue(data) {
  if (data.property === 'bloodPressure') {
    return `${data.value.systolic}/${data.value.diastolic}`;
  }
  return String(data.value);
}

export const meta = {
  VitalSignCard: {
    layer: 'composite', scope: 'global', usecases: ['vital-sign', 'sprout-pattern'], status: 'experimental',
    summary: 'FHIR Observation (vital-signs) at Seed/Sprout/Shoot. Handles 9 properties incl. blood pressure (multi-component).',
    props: {
      data: 'object',          // { property, value, unit, status, history, measuredAt, reference, trend }
      stage: "'seed'|'sprout'|'shoot'",
      onSave: '?fn',
      onEdit: '?fn',
    },
    composes: ['Card', 'StatusPill', 'TrendChip', 'ValueDisplay', 'Stepper', 'IconPill', 'EditChip', 'Sparkline', 'PrimaryCTA'],
  },
};
