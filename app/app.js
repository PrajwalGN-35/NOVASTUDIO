const conversationEl = document.getElementById('conversation');
const formEl = document.getElementById('nova-form');
const inputEl = document.getElementById('nova-input');
const formStatusEl = document.getElementById('form-status');
const sendButtonEl = document.getElementById('send-button');
const resetButtonEl = document.getElementById('reset-button');
const emptyStateEl = document.getElementById('empty-state');
const responsePanelEl = document.getElementById('response-panel');

if (!conversationEl || !formEl || !inputEl || !formStatusEl || !sendButtonEl || !resetButtonEl || !emptyStateEl || !responsePanelEl) {
  throw new Error('Nova app shell is missing required elements.');
}

let conversationId = `nova-${Date.now()}`;

/**
 * @param {string} message
 * @param {string} [type='']
 */
function setStatus(message, type = '') {
  formStatusEl.textContent = message;
  formStatusEl.className = `form-status ${type}`.trim();
}

function renderEmptyState() {
  conversationEl.innerHTML = '';
  conversationEl.appendChild(emptyStateEl);
}

/**
 * @param {'user' | 'system'} role
 * @param {string} label
 * @param {string} text
 */
function appendMessage(role, label, text) {
  const wrapper = document.createElement('div');
  wrapper.className = `message-bubble ${role}`;

  const labelEl = document.createElement('span');
  labelEl.className = 'message-label';
  labelEl.textContent = label;

  const messageEl = document.createElement('div');
  messageEl.textContent = text;

  wrapper.append(labelEl, messageEl);
  conversationEl.appendChild(wrapper);
  conversationEl.scrollTop = conversationEl.scrollHeight;
}

/**
 * @param {string} responseText
 */
function updateResponsePanel(responseText) {
  const body = responsePanelEl.querySelector('.response-body');

  if (!body) {
    throw new Error('Nova response panel is missing its body element.');
  }

  body.textContent = responseText;
}

function resetSession() {
  conversationId = `nova-${Date.now()}`;
  renderEmptyState();
  updateResponsePanel('This Nova application shell is ready for a future backend connection. No model is active yet.');
  setStatus('');
  inputEl.value = '';
  inputEl.focus();
}

/**
 * @param {SubmitEvent} event
 */
async function handleSubmit(event) {
  event.preventDefault();

  const message = inputEl.value.trim();

  if (!message) {
    setStatus('Please enter a message before sending.', 'error');
    inputEl.focus();
    return;
  }

  sendButtonEl.disabled = true;
  setStatus('Sending request...', 'loading');

  try {
    const response = await fetch('/api/nova', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        message,
        conversationId,
        context: {
          source: 'nova-app-shell',
          phase: 'Phase 2',
          feature: 'architecture boundary'
        }
      })
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.error || 'The request failed unexpectedly.');
    }

    conversationEl.innerHTML = '';
    appendMessage('user', 'You', message);
    appendMessage('system', 'Nova', data.response);
    updateResponsePanel(`Conversation ID: ${data.conversationId} — ${data.metadata.status}`);
    setStatus('Request accepted by the development API boundary.', 'success');
    inputEl.value = '';
  } catch (error) {
    const messageText = error instanceof Error ? error.message : 'Unexpected error.';
    conversationEl.innerHTML = '';
    appendMessage('user', 'You', message);
    appendMessage('system', 'System', 'The request could not be processed.');
    updateResponsePanel(`Error: ${messageText}`);
    setStatus(messageText, 'error');
  } finally {
    sendButtonEl.disabled = false;
  }
}

formEl.addEventListener('submit', handleSubmit);
resetButtonEl.addEventListener('click', resetSession);

resetSession();
