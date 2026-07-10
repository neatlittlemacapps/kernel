// ConditionCard — FHIR Condition. Seed → Sprout → Shoot (status transition).
// No numeric value; the "value" is the condition text. Status = clinicalStatus.

import { PatientCard, StatusPill, IconPill, EditChip } from './PatientCard.jsx';
import { propertyIcons, FieldList, PrimaryCTA, txtNL } from './lib.jsx';

const React = window.React;

const CLINICAL_STATUS_LABEL = {
  active:     txtNL.active,
  recurrence: 'Herhaling',
  relapse:    'Recidief',
  inactive:   'Inactief',
  remission:  txtNL.inRemission,
  resolved:   txtNL.resolved,
};

const CLINICAL_STATUS_TO_STATUS = {
  active:     'high',         // active condition = elevated attention
  recurrence: 'high',
  relapse:    'critical',
  inactive:   'normal',
  remission:  'normal',
  resolved:   'normal',
};

export function ConditionCard({ data, stage = 'sprout', onEdit, onStatusChange, ...rest }) {
  const Icon = propertyIcons.condition;
  const statusKey = CLINICAL_STATUS_TO_STATUS[data.clinicalStatus] || 'normal';
  const statusLabel = CLINICAL_STATUS_LABEL[data.clinicalStatus] || data.clinicalStatus;

  const fields = [
    data.onsetDate && { label: 'Aanvang',  value: data.onsetDate },
    data.severity  && { label: 'Ernst',    value: data.severity },
    data.verification && { label: 'Verificatie', value: data.verification },
  ].filter(Boolean);

  return (
    <PatientCard
      stage={stage}
      tone="condition"
      status={statusKey}
      ariaLabel={`${data.code}, ${statusLabel}`}
      leading={<IconPill label={data.code}><Icon size={18} /></IconPill>}
      title={data.code}
      trailing={
        stage === 'shoot'
          ? <EditChip label={txtNL.edit} onClick={onEdit} /> : null
      }
      value={null}
      meta={<StatusPill status={statusKey} label={statusLabel} />}
      media={stage !== 'seed' && fields.length ? <FieldList items={fields} /> : null}
      footer={
        stage === 'sprout' && data.note
          ? <span>{data.note}</span>
          : null
      }
      actions={
        stage === 'shoot'
          ? <PrimaryCTA onClick={() => onStatusChange?.(data)}>Status bijwerken</PrimaryCTA>
          : null
      }
      {...rest}
    />
  );
}

export const meta = {
  ConditionCard: {
    layer: 'composite', scope: 'global', usecases: ['condition', 'sprout-pattern'], status: 'experimental',
    category: 'Clinical',
    keywords: ['condition', 'diagnosis', 'problem', 'fhir', 'clinical status', 'severity', 'onset', 'remission'],
    summary: 'FHIR Condition card. Status pill follows clinicalStatus mapped to interpretation.',
    props: {
      data: { class: 'content', type: 'object', description: 'The FHIR Condition: { code, clinicalStatus, severity, onsetDate, verification, note }. code is the title; clinicalStatus drives the status pill; the rest render as a field list.' },
      stage: { class: 'dsPresentation', values: ['seed', 'sprout', 'shoot'], description: 'Fidelity forwarded to the underlying Card. Sprout and Shoot render the onset/severity/verification field list; Sprout adds the note; Shoot exposes the status-update CTA.' },
      onEdit: { class: 'event', type: 'fn', description: 'Invoked when the user taps the edit chip in Shoot stage.' },
      onStatusChange: { class: 'event', type: 'fn', description: 'Invoked with the condition when the user triggers the Shoot-stage status-update CTA.' },
    },
    composes: ['Card', 'StatusPill', 'IconPill', 'EditChip', 'FieldList', 'PrimaryCTA'],
    usage: '<ConditionCard data={condition} stage="sprout" onEdit={handleEdit} />',
  },
};
