/**
 * @typedef {Record<string, unknown>} NovaPayload
 */

/**
 * @param {NovaPayload | undefined} payload
 * @returns {{ ok: true } | { ok: false, error: string }}
 */
export function validateNovaRequest(payload = {}) {
  const request = payload ?? {};
  const message = request.message;

  if (!request || typeof request !== 'object' || Array.isArray(request)) {
    return {
      ok: false,
      error: 'Request body must be an object.'
    };
  }

  if (typeof message !== 'string' || !message.trim()) {
    return {
      ok: false,
      error: 'A non-empty message is required.'
    };
  }

  if (message.trim().length > 4000) {
    return {
      ok: false,
      error: 'Message exceeds the maximum allowed length.'
    };
  }

  const context = request.context;
  if (context !== undefined && (typeof context !== 'object' || Array.isArray(context))) {
    return {
      ok: false,
      error: 'Context must be an object when provided.'
    };
  }

  const conversationId = request.conversationId;
  if (conversationId !== undefined && typeof conversationId !== 'string') {
    return {
      ok: false,
      error: 'conversationId must be a string when provided.'
    };
  }

  return { ok: true };
}

/**
 * @param {NovaPayload | undefined} payload
 * @returns {{ success: boolean, response?: string, conversationId?: string, metadata?: { status: string, backendConnected: boolean, requestReceivedAt?: string, mode?: string, model?: string | null, messageLength?: number, contextKeys?: string[] }, error?: string }}
 */
export function createNovaResponse(payload = {}) {
  const validation = validateNovaRequest(payload);

  if (!validation.ok) {
    return {
      success: false,
      error: validation.error,
      metadata: {
        status: 'invalid_request',
        backendConnected: false
      }
    };
  }

  const request = payload ?? {};
  const conversationId =
    typeof request.conversationId === 'string' && request.conversationId.trim()
      ? request.conversationId.trim()
      : 'nova-conversation';

  const context = request.context && typeof request.context === 'object' ? request.context : {};
  const message = typeof request.message === 'string' ? request.message : '';

  return {
    success: true,
    response:
      'Nova has received the request and the contract is active, but the intelligence backend is not connected yet. This development stub keeps the frontend and backend boundary ready for a future reasoning engine without pretending that AI is live.',
    conversationId,
    metadata: {
      status: 'stub',
      backendConnected: false,
      requestReceivedAt: new Date().toISOString(),
      mode: 'development',
      model: null,
      messageLength: message.trim().length,
      contextKeys: Object.keys(context)
    }
  };
}

/**
 * @param {{ method?: string, body?: unknown }} req
 * @param {{ status: (code: number) => { json: (body: unknown) => unknown } }} res
 */
export default async function handler(req, res) {
  if (!req || !res) {
    throw new Error('A Vercel request and response object is required.');
  }

  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      error: 'Only POST requests are supported for Nova.',
      metadata: {
        status: 'method_not_allowed',
        backendConnected: false
      }
    });
  }

  try {
    let payload = req.body;

    if (typeof payload === 'string') {
      payload = JSON.parse(payload);
    }

    const validation = validateNovaRequest(payload);

    if (!validation.ok) {
      return res.status(400).json({
        success: false,
        error: validation.error,
        conversationId: typeof payload?.conversationId === 'string' ? payload.conversationId : null,
        metadata: {
          status: 'invalid_request',
          backendConnected: false
        }
      });
    }

    return res.status(200).json(createNovaResponse(payload));
  } catch (_error) {
    return res.status(400).json({
      success: false,
      error: 'The request body could not be parsed as JSON.',
      metadata: {
        status: 'invalid_request',
        backendConnected: false
      }
    });
  }
}
