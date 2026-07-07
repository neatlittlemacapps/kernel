// MedicationCard — FHIR MedicationStatement. Seed → Sprout → Shoot.
// Schedule strip in Sprout; mark-taken toggle in Shoot. Prescribing is Rooted.

import { Card, StatusPill, IconPill, EditChip } from './Card.jsx';
import { propertyIcons, ScheduleStrip, PrimaryCTA, txtNL } from './lib.jsx';

const React = window.React;

const MED_STATUS_LABEL = {
  active:    txtNL.active,
  paused:    'Gepauzeerd',
  stopped:   'Gestopt',
  completed: 'Voltooid',
  intended:  'Voorgenomen',
  'on-hold': 'On hold',
};

const MED_STATUS_TO_STATUS = {
  active:    'normal',
  paused:    'borderline',
  stopped:   'low',
  completed: 'normal',
  intended:  'low',
  'on-hold': 'borderline',
};

export function MedicationCard({ data, stage = 'sprout', onEdit, onMarkTaken, ...rest }) {
  const Icon = propertyIcons.medication;
  const statusKey = MED_STATUS_TO_STATUS[data.medicationStatus] || 'normal';
  const statusLabel = MED_STATUS_LABEL[data.medicationStatus] || data.medicationStatus;

  return (
    <Card
      stage={stage}
      tone="medication"
      status={statusKey}
      ariaLabel={`${data.name} ${data.dose}, ${statusLabel}`}
      leading={<IconPill label={data.name}><Icon size={18} /></IconPill>}
      title={data.name}
      trailing={
        stage === 'shoot'
          ? <EditChip label={txtNL.edit} onClick={onEdit} /> : null
      }
      value={
        stage === 'seed'
          ? <span className="krnl-pcard-value-display">
              <span className="krnl-pcard-value-num" style={{ fontSize: 'var(--typography-body-md-font-size)' }}>{data.dose}</span>
            </span>
          : <span className="krnl-pcard-value-display">
              <span className="krnl-pcard-value-num">{data.dose}</span>
              {data.frequency && <span className="krnl-pcard-value-unit">· {data.frequency}</span>}
            </span>
      }
      meta={<StatusPill status={statusKey} label={statusLabel} />}
      media={
        stage === 'sprout' && data.schedule && data.schedule.length
          ? <ScheduleStrip days={data.schedule} ariaLabel="7-daags inname-schema" />
          : null
      }
      footer={
        stage === 'sprout'
          ? (
            <>
              {data.reason && <span>Reden · {data.reason}</span>}
              {data.prescriber && <span>Voorschrijver · {data.prescriber}</span>}
            </>
          )
          : null
      }
      actions={
        stage === 'shoot'
          ? <PrimaryCTA onClick={() => onMarkTaken?.(data)}>Markeer ingenomen</PrimaryCTA>
          : null
      }
      {...rest}
    />
  );
}

export const meta = {
  MedicationCard: {
    layer: 'composite', scope: 'global', usecases: ['medication', 'sprout-pattern'], status: 'experimental',
    category: 'Clinical',
    keywords: ['medication', 'drug', 'prescription', 'medicationstatement', 'fhir', 'dose', 'schedule', 'adherence'],
    summary: 'FHIR MedicationStatement. Schedule strip in Sprout; mark-taken in Shoot. Prescribing requires Rooted.',
    props: {
      data: { class: 'content', type: 'object', description: 'The FHIR MedicationStatement: { name, dose, frequency, medicationStatus, schedule, reason, prescriber }.' },
      stage: { class: 'dsPresentation', values: ['seed', 'sprout', 'shoot'], description: 'Fidelity (forwarded to the underlying Card).' },
      onEdit: { class: 'event', type: 'fn', description: 'Invoked when the user enters edit (Shoot stage).' },
      onMarkTaken: { class: 'event', type: 'fn', description: 'Invoked when the user marks a dose taken.' },
    },
    composes: ['Card', 'StatusPill', 'IconPill', 'EditChip', 'ScheduleStrip', 'PrimaryCTA'],
    usage: '<MedicationCard data={med} stage="sprout" onMarkTaken={markTaken} />',
  },
};
