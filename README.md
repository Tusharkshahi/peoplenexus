## PeopleNexus

A concise monorepo for an HR Management System with:
- Frontend: Next.js 15, React 19, TypeScript, Tailwind CSS v4, shadcn/ui, Redux Toolkit
- Backend: Express.js (Node), PostgreSQL ready
- AI services: FastAPI (Python) for resume upload, ranking, and screening (Azure OpenAI + Azure Blob)

## structure

Top-level layout (key parts only):

```
PeopleNexus/
├─ client/                 # Next.js app
│  ├─ src/
│  │  ├─ app/
│  │  │  ├─ (auth)/login, register
│  │  │  ├─ (dashboard)/layout
│  │  │  └─ (dashboard)/{dashboard, recruitment, onboarding, leave, payroll, performance}
│  │  ├─ components/      # ui/, shared/, providers
│  │  ├─ lib/             # api helpers (incl. ai-api.js)
│  │  └─ store/           # Redux Toolkit
│  └─ package.json
├─ server/                # Express API and scripts
│  ├─ server.js           # Main server
│  ├─ config/, middleware/
│  ├─ database-setup.sql, sample-data.sql
│  └─ package.json
├─ ai-services/           # FastAPI for resume rank/screen + blob storage
│  ├─ main.py, start.py, models.py
│  ├─ ai_client.py, storage_client.py, resume_ranker.py, resume_screener.py
│  ├─ requirements.txt, env.example
│  └─ README.md
├─ shared/                # Shared TS types and utils
│  └─ src/{types, utils}
└─ package.json           # Root workspace and scripts
```

## quick start

Prereqs: Node 18+, npm; Python 3.10+ (for ai-services); PostgreSQL (optional for local demo).

1) Install dependencies
- Root + workspaces
   - npm install
   - npm run install:all

2) Environment
- Do NOT commit secrets (.env is git‑ignored)
- Server: copy and edit
   - copy server/env.example server/.env
- AI: copy and edit
   - copy ai-services/env.example ai-services/.env

3) Dev servers
- Start API and client together
   - npm run dev
- Or individually
   - npm run dev:server  # http://localhost:5000
   - npm run dev:client  # http://localhost:3000

Optional: AI service
- Python deps
   - pip install -r ai-services/requirements.txt
- Run FastAPI (from ai-services/)
   - python start.py
   - Health: http://localhost:8000/health

## ai resume features

- Upload: stores files to Azure Blob
- Rank: ranks multiple resumes against a job description
- Screen: evaluates a single resume

Client calls are in `client/src/lib/ai-api.js`. FastAPI endpoints (ai-services):
- POST /upload, GET /list, DELETE /delete
- POST /rank, POST /screen, GET /health

Resilience built‑in: bounded concurrency, retries/backoff for 429/5xx, request timeouts; clear 429/504 responses.

## scripts

Root
- dev, dev:server, dev:client, build, install:all, lint, test, clean

Client
- dev, build, start, lint

Server
- dev, start

Shared
- build (ts)

## pages (client)

- /login, /register
- /dashboard
- /recruitment (includes AI ranker/screener pages)
- /onboarding, /leave, /payroll, /performance

## notes

- .env and variants are ignored repo‑wide (see `.gitignore`)
- Allowed resume types: .pdf, .docx, .txt
- If you removed package-lock.json during merge, regenerate with a fresh install before production builds

## license

MIT
