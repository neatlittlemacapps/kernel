// AllergyCard — FHIR AllergyIntolerance. Seed → Sprout → Shoot.
// Criticality (high/low) drives status pill; substance is the title.

import { Card, StatusPill, IconPill, EditChip } from './Card.jsx';
import { propertyIcons, ReactionList, PrimaryCTA, txtNL } from './lib.jsx';

const React = window.React;

const CRIT_LABEL = {
  high:               txtNL.criticalityHigh,
  low:                txtNL.criticalityLow,
  'unable-to-assess': 'Onbekend',
};

const CRIT_TO_STATUS = {
  high:               'critical',
  low:                'borderline',
  'unable-to-assess': 'low',
};

export function AllergyCard({ data, stage = 'sprout', onEdit, ...rest }) {
  const Icon = propertyIcons.allergy;
  const statusKey = CRIT_TO_STATUS[data.criticality] || 'borderline';
  const statusLabel = CRIT_LABEL[data.criticality] || data.criticality;

  return (
    <Card
      stage={stage}
      tone="allergy"
      status={statusKey}
      ariaLabel={`Allergie: ${data.substance}, ${statusLabel}`}
      leading={<IconPill label={data.substance}><Icon size={18} /></IconPill>}
      title={data.substance}
      trailing={
        stage === 'shoot'
          ? <EditChip label={txtNL.edit} onClick={onEdit} /> : null
      }
      value={null}
      meta={<StatusPill status={statusKey} label={statusLabel} />}
      media={
        stage !== 'seed' && data.reactions && data.reactions.length
          ? <ReactionList reactions={data.reactions} />
          : null
      }
      footer={
        stage === 'sprout' && data.recordedDate
          ? (
            <>
              <span>Geregistreerd · {data.recordedDate}</span>
              {data.lastVerified && <span>Laatst bevestigd · {data.lastVerified}</span>}
            </>
          )
          : null
      }
      actions={
        stage === 'shoot'
          ? <PrimaryCTA onClick={onEdit}>Ernst bijwerken</PrimaryCTA>
          : null
      }
      {...rest}
    />
  );
}

export const meta = {
  AllergyCard: {
    layer: 'composite', scope: 'global', usecases: ['allergy', 'sprout-pattern'], status: 'experimental',
    summary: 'FHIR AllergyIntolerance card. Criticality maps to status interpretation (critical/borderline).',
    props: {
      data: 'object',          // { substance, criticality, reactions, recordedDate, lastVerified }
      stage: "'seed'|'sprout'|'shoot'",
      onEdit: '?fn',
    },
    composes: ['Card', 'StatusPill', 'IconPill', 'EditChip', 'ReactionList', 'PrimaryCTA'],
  },
};
