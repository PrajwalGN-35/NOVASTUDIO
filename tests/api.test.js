import test from 'node:test';
import assert from 'node:assert/strict';

import { createNovaResponse, validateNovaRequest } from '../api/nova.js';

test('validateNovaRequest rejects empty or non-string messages', () => {
  const emptyMessage = validateNovaRequest({ message: '   ' });
  assert.equal(emptyMessage.ok, false);
  assert.match(emptyMessage.error, /message/i);

  const invalidType = validateNovaRequest({ message: 42 });
  assert.equal(invalidType.ok, false);
  assert.match(invalidType.error, /message/i);
});

test('createNovaResponse returns the expected stub contract', () => {
  const payload = {
    message: 'I need help evaluating a product launch strategy.',
    conversationId: 'conversation-123',
    context: {
      goal: 'clarify next steps',
      phase: 'Phase 2'
    }
  };

  const result = createNovaResponse(payload);

  assert.equal(result.success, true);
  assert.equal(result.conversationId, 'conversation-123');
  assert.equal(result.metadata.status, 'stub');
  assert.equal(result.metadata.backendConnected, false);
  assert.match(result.response, /not connected/i);
});
