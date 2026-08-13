// Tests for the shared metering tone resolver (src/lib/tone.js).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { toneSlug, toneFill, STATUS_TONES, DATA_TONES } from '../src/lib/tone.js';

test('toneSlug maps status tones to status-{tone}', () => {
  for (const t of STATUS_TONES) assert.equal(toneSlug(t), `status-${t}`);
});

test('toneSlug maps data tones to data-tone-{n}', () => {
  for (const t of DATA_TONES) assert.equal(toneSlug(t), `data-tone-${t.split('-')[1]}`);
});

test('toneSlug returns null for primary and arbitrary colours', () => {
  assert.equal(toneSlug('primary'), null);
  assert.equal(toneSlug('#ff0000'), null);
  assert.equal(toneSlug('neutral'), null);
});

test('toneFill: omitted or neutral tone returns undefined (caller default applies)', () => {
  assert.equal(toneFill(undefined), undefined);
  assert.equal(toneFill(null), undefined);
  assert.equal(toneFill('neutral'), undefined);
});

test('toneFill: primary resolves to --action-accent', () => {
  assert.equal(toneFill('primary'), 'var(--action-accent)');
});

test('toneFill: status tones resolve to their vivid .500 accent rung', () => {
  assert.equal(toneFill('info'), 'var(--status-info-accent)');
  assert.equal(toneFill('error'), 'var(--status-error-accent)');
});

test('toneFill: data tones resolve to their accent rung', () => {
  assert.equal(toneFill('data-3'), 'var(--data-tone-3-accent)');
});

test('toneFill: arbitrary colour strings pass through unchanged', () => {
  assert.equal(toneFill('#ff0000'), '#ff0000');
  assert.equal(toneFill('var(--some-custom-color)'), 'var(--some-custom-color)');
});
