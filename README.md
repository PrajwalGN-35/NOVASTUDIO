# Nova

Nova is an AI thinking and strategy advisor built to help people think more clearly, challenge assumptions, compare options, and move forward with better decisions.

This repository currently contains the public landing experience and the first functional application boundary for Phase 2. It is intentionally not a production AI product yet.

## Current Phase

Phase 2: Application Architecture

The current focus is to establish:

- a clean separation between landing experience and application experience
- a frontend application shell for future conversations and advisor workflows
- a backend API boundary contract for future intelligence
- clear architectural boundaries for reasoning, context, memory, research, and tools

This phase does not implement:

- real AI reasoning
- authentication
- persistent memory
- web research
- database storage
- model integrations
- production agent execution

## Product Positioning

Nova is positioned as:

- AI Thinking and Strategy Advisor
- designed to challenge assumptions and evaluate alternatives
- built to help users reason clearly before making decisions

The product principle remains:

Think clearly.
Decide better.
Move forward.

## Architecture

The project now follows a lightweight architecture that preserves the static landing site while creating a clear application boundary.

```text
Nova
├── Public Landing Experience
│   └── index.html + style.css + script.js
│
├── Nova Application
│   ├── app/index.html
│   ├── app/app.css
│   ├── app/app.js
│   └── frontend state + UI shell
│
├── Backend / API Boundary
│   └── api/nova.js
│
├── Contracts / Types
│   └── types/nova.ts
│
├── Environment Example
│   └── .env.example
│
└── Tooling
    ├── package.json
    └── tests/api.test.js
```

## Application Boundary

The development API endpoint is intentionally a stub layer. It validates requests and returns a predictable response contract, while clearly signaling that the intelligence system is not connected yet.

Request shape:

```json
{
  "message": "I need help evaluating a product idea.",
  "conversationId": "conversation-123",
  "context": {
    "goal": "clarify next steps",
    "phase": "Phase 2"
  }
}
```

Response shape:

```json
{
  "success": true,
  "response": "Nova has received the request ...",
  "conversationId": "conversation-123",
  "metadata": {
    "status": "stub",
    "backendConnected": false,
    "requestReceivedAt": "2026-10-07T00:00:00.000Z"
  }
}
```

This contract is designed to support future reasoning, confidence scoring, assumptions, risks, recommendations, sources, and memory references without breaking the UI.

## Project Structure

```text
NOVASTUDIO/
├── api/
│   └── nova.js
├── app/
│   ├── app.css
│   ├── app.js
│   └── index.html
├── tests/
│   └── api.test.js
├── types/
│   └── nova.ts
├── .env.example
├── .gitignore
├── index.html
├── package.json
├── README.md
├── script.js
├── style.css
└── .git
```

## Getting Started

Clone the repository:

```bash
git clone https://github.com/PrajwalGN-35/NOVASTUDIO.git
cd NOVASTUDIO
```

Install dependencies:

```bash
npm install
```

Run the local Vercel-style development flow:

```bash
npm run dev
```

Open the landing page at:

```text
http://localhost:3000/
```

Open the application shell at:

```text
http://localhost:3000/app/
```

## Available Commands

```bash
npm run dev
npm test
npm run typecheck
npm run build
```

## Current API Boundary

The current stub endpoint is available at:

```text
POST /api/nova
```

Behavior:

- validates request shape
- rejects empty or malformed input
- preserves a clean response contract
- clearly marks the backend as unavailable
- never calls a real AI model
- never exposes API keys

## Design and UX Notes

The original premium dark landing experience is preserved. It remains visually polished and continues to work independently. The new app shell sits beside it as a future application surface without disrupting the public site experience.

## What Is Intentionally Not Included

- AI model integration
- authentication
- database persistence
- memory layer
- web research layer
- tool execution
- production persona or fake conversation simulation
- backend business logic beyond the request contract

## Recommended Next Phase

The next step should be introducing a real application backend behind the same contract, followed by content-aware context handling, a reasoning service boundary, and an operational model configuration layer.

## Author

Prajwal G N

B.Tech — Artificial Intelligence & Data Science
