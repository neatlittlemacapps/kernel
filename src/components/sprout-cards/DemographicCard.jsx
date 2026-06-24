// DemographicCard — FHIR Patient (identity). Seed → Sprout → Shoot.
// Demographics differ from Observations: there's no time-series; the "value" is
// the patient's name, with attributes (age, sex, GP, phone) as a field list.

import { Card, IconPill, EditChip } from './Card.jsx';
import { propertyIcons, FieldList, PrimaryCTA, txtNL } from './lib.jsx';

const React = window.React;

export function DemographicCard({ data, stage = 'sprout', onEdit, onSave, ...rest }) {
  const Icon = propertyIcons.identity;
  const fields = [
    { label: 'Geboorte', value: `${data.birthDate} (${data.age} jaar)` },
    { label: 'Geslacht', value: data.gender === 'male' ? 'M' : data.gender === 'female' ? 'V' : 'X' },
    data.identifier   && { label: 'Rijksregister', value: data.identifier },
    data.gp           && { label: 'Huisarts',      value: data.gp },
    data.phone        && { label: 'Telefoon',      value: data.phone },
    data.address      && { label: 'Adres',         value: data.address },
  ].filter(Boolean);

  return (
    <Card
      stage={stage}
      tone="identity"
      ariaLabel={`${data.name}, ${data.age}`}
      leading={<IconPill label={data.name}><Icon size={18} /></IconPill>}
      title={data.name}
      trailing={
        stage === 'shoot'
          ? <EditChip label={txtNL.edit} onClick={onEdit} />
          : stage === 'sprout'
            ? <span className="krnl-pcard-id-line">{data.gender === 'male' ? '♂' : '♀'} {data.age}j</span>
            : null
      }
      value={
        stage === 'seed'
          ? <span className="krnl-pcard-value-display">
              <span className="krnl-pcard-value-num" style={{ fontSize: 'var(--typography-body-md-font-size)' }}>{data.age}j</span>
            </span>
          : null
      }
      media={stage !== 'seed' ? <FieldList items={fields} /> : null}
      footer={
        stage === 'sprout' && data.lastVisit
          ? <span>Laatste contact · {data.lastVisit}</span>
          : null
      }
      actions={
        stage === 'shoot'
          ? <PrimaryCTA onClick={() => onSave?.(data)}>{txtNL.save}</PrimaryCTA>
          : null
      }
      {...rest}
    />
  );
}

export const meta = {
  DemographicCard: {
    layer: 'composite', scope: 'global', usecases: ['demographic', 'sprout-pattern'], status: 'experimental',
    summary: 'FHIR Patient identity card. Seed/Sprout/Shoot. No time-series; attributes flow as a field list.',
    props: {
      data: 'object',          // { name, birthDate, age, gender, identifier, gp, phone, address, lastVisit }
      stage: "'seed'|'sprout'|'shoot'",
      onEdit: '?fn',
      onSave: '?fn',
    },
    composes: ['Card', 'IconPill', 'EditChip', 'FieldList', 'PrimaryCTA'],
  },
};
