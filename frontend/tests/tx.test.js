import test from 'node:test';
import assert from 'node:assert/strict';
import { assertAccepted, statusName } from '../src/lib/tx.js';

test('decodes accepted and undetermined statuses', () => {
  assert.equal(statusName(5), 'ACCEPTED');
  assert.equal(statusName(6), 'UNDETERMINED');
});

test('fails closed on unsuccessful consensus', () => {
  assert.doesNotThrow(() => assertAccepted({ status: 'FINALIZED' }));
  assert.throws(() => assertAccepted({ status: 'UNDETERMINED' }), /No change was confirmed/);
});
