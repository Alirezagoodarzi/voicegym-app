# VoiceGym — Claude Code Project Context

## What This App Does
A voice-driven gym workout planner. Users speak exercise commands and the app
parses them into structured workout plans using the Claude API.

Voice command format: "[exercise name] on [equipment], [sets] sets, 
[reps] reps, [rest] seconds rest, [weight] kg/lbs"

Example: "bench press on barbell, 4 sets, 8 reps, 90 seconds rest, 80 kg"

## Tech Stack
- Next.js 14 (App Router) + TypeScript
- Tailwind CSS + shadcn/ui
- Web Speech API (voice capture, browser-native)
- Claude API via claude-sonnet-4-5 (voice text → structured plan)
- Zustand (client state)
- localStorage (free tier persistence)

## Architecture Decisions
- API route at /api/parse-exercise handles all Claude API calls (never call Claude from client)
- Types live in src/types/index.ts — always update types there first
- localStorage helpers are in src/lib/storage.ts — use only those functions for persistence
- Claude client wrapper is in src/lib/claude.ts

## Core Types (keep in sync with src/types/index.ts)
```typescript
type Exercise = {
  id: string
  name: string
  equipment: string
  equipmentId: string
  sets: number
  reps: number
  restSeconds: number
  weight: number
  weightUnit: "kg" | "lbs"
}

type WorkoutPlan = {
  id: string
  name: string
  createdAt: string
  exercises: Exercise[]
}
```

## Coding Rules
- Always use TypeScript strict mode — no `any` types
- Components go in src/components/ — one component per file
- Use shadcn/ui components before writing custom UI
- Never modify src/types/index.ts without telling the user first
- Always handle loading and error states in components
- Mobile-first CSS — design for small screens first

## What NOT to Do
- Do not install new dependencies without asking first
- Do not call the Claude API from client components
- Do not use React Context for state — use Zustand
- Do not hardcode API keys anywhere
- NEVER use CLAUDE_API_KEY anywhere in the codebase. The correct environment variable is always ANTHROPIC_API_KEY.

## Git Workflow
- Always run a pre-commit review before committing
- Use conventional commits format (feat:, fix:, chore:, refactor:)
- Never commit .env.local or any file with API keys
- Commit after each working feature, not at end of day

## Deployment
- Production URL: (not deployed yet — new project)
- Platform: Vercel
- Auto-deploys on push to main branch
- Environment variables are set in Vercel dashboard, not .env.local
- Previous project URL: https://voice-gym-planner-bli2pikpt-alirezagoodarzi1.vercel.app/

## Future Plans (don't build yet)
- User accounts + cloud sync (paid tier)
- React Native / Expo mobile app (will share types from this repo)
- Exercise history and progress tracking

## Design System — NEVER deviate from these
- --bg: #F5F7F2 (page background)
- --surface: #FFFFFF (card background)
- --surface-2: #EEF2E8 (pill/tag backgrounds)
- --green: #2D6A4F (primary — badges, numbers, active states)
- --green-mid: #40916C (hover states)
- --green-light: #B7E4C7 (badge backgrounds)
- --lime: #AAFF00 (mic button ONLY — nothing else)
- --text-1: #1A1A1A (headings)
- --text-2: #4A4A4A (body)
- --text-3: #9A9A9A (muted)
- --border: #E0E7D8 (all borders)
- Use inline styles when Tailwind classes are being overridden


