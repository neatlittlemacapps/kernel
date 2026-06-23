// ConditionCard — FHIR Condition. Seed → Sprout → Shoot (status transition).
// No numeric value; the "value" is the condition text. Status = clinicalStatus.

import { Card, StatusPill, IconPill, EditChip } from './Card.jsx';
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
    <Card
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
    summary: 'FHIR Condition card. Status pill follows clinicalStatus → interpretation mapping.',
    props: {
      data: 'object',          // { code, clinicalStatus, severity, onsetDate, verification, note }
      stage: "'seed'|'sprout'|'shoot'",
      onEdit: '?fn',
      onStatusChange: '?fn',
    },
    composes: ['Card', 'StatusPill', 'IconPill', 'EditChip', 'FieldList', 'PrimaryCTA'],
  },
};
