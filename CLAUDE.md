# Voice Gym Planner — Claude Code Project Context

## What This App Does
A voice-driven gym workout planner. Users speak exercise 
commands and Claude AI parses them into structured workout plans.

Voice command format:
"[exercise] on [equipment], [sets] sets, [reps] reps, [rest] seconds rest, [weight] kg"

Example: "bench press on barbell, 4 sets, 8 reps, 90 seconds rest, 80 kg"

## Tech Stack
- Next.js 14 (App Router) + TypeScript strict mode
- Tailwind CSS + shadcn/ui
- Inter font (Google Fonts, weights 400-800)
- Web Speech API (voice capture, browser-native)
- Claude API via claude-sonnet-4-5
- Zustand (client state)
- localStorage (free tier persistence)
- dnd-kit (drag to reorder)

## Design System — NEVER deviate
- --bg: #F5F7F2 (page background)
- --surface: #FFFFFF (card background)
- --surface-2: #EEF2E8 (pill/tag backgrounds)
- --green: #2D6A4F (primary)
- --green-mid: #40916C (hover)
- --green-light: #B7E4C7 (badge backgrounds)
- --lime: #AAFF00 (mic button ONLY)
- --text-1: #1A1A1A (headings)
- --text-2: #4A4A4A (body)
- --text-3: #9A9A9A (muted)
- --border: #E0E7D8 (borders)
- Use inline styles when Tailwind overrides design tokens

## Architecture
- /api/parse-exercise — ALL Claude API calls go here only
- src/types/index.ts — update types here first always
- src/lib/claude.ts — Claude API client + regex partial parser
- src/lib/storage.ts — all localStorage helpers
- src/store/useWorkoutStore.ts — Zustand store
- src/components/BottomNav.tsx — shared nav, never add to pages directly
- src/components/ExerciseSheet.tsx — add/edit bottom sheet
- src/components/SettingsHelpers.tsx — shared settings components
- src/app/(main)/ — pages with shared bottom nav layout
- src/app/session/ — full screen, no bottom nav
- src/app/page.tsx — splash screen only, auto-redirects to /planner

## Route Structure
- / — splash screen (2s auto-redirect to /planner)
- /planner — main workout planner
- /session — active workout session
- /history — past sessions
- /settings — settings menu
- /settings/profile — age, weight, height
- /settings/preferences — units, language, reminders
- /settings/about — founder info + copyright

## Core Types
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

type SetRecord = {
  setNumber: number
  done: boolean
}

type SessionExercise = {
  exercise: Exercise
  sets: SetRecord[]
}

type WorkoutSession = {
  id: string
  date: string
  duration: number
  status: "completed" | "incomplete"
  exercises: SessionExercise[]
  planName: string
  totalSets: number
  completedSets: number
}

## localStorage Keys
- voicegym-plan — current workout plan
- voicegym-sessions — session history array
- voicegym-profile — user profile (age, weight, height)
- voicegym-preferences — app preferences

## Coding Rules
- No any types — TypeScript strict always
- One component per file in src/components/
- Mobile-first — max-width 430px on all pages
- Always handle loading and error states
- No browser confirm() or alert() — use in-app modals
- No React Context — use Zustand
- No hardcoded API keys

## What NOT to Do
- NEVER use CLAUDE_API_KEY — always ANTHROPIC_API_KEY
- Never call Claude API from client components
- Never commit .env.local
- Never add bottom nav directly to pages
- Never change design tokens without explicit instruction
- Never install dependencies without asking first

## Git Workflow
- Pre-commit review before every commit
- Conventional commits: feat:, fix:, chore:, refactor:
- Never commit .env.local
- Commit after each working feature

## Environment Variables
- ANTHROPIC_API_KEY in .env.local (never commit)
- In production: set in Vercel dashboard

## Deployment
- Production: https://voicegym-app.vercel.app
- Platform: Vercel — auto-deploys on push to main
- GitHub: voicegym-app repo

## Feature Status
### v1.0.0 — Shipped
- Voice exercise parsing (Claude API)
- Add / Edit / Delete exercises with confirmation modals
- Drag to reorder (dnd-kit)
- Weight tracking (kg/lbs)
- Stepper inputs for numeric fields
- Workout session with set checkboxes + timer
- Session history with date and duration
- Settings: Profile, Preferences, About
- Splash screen with animated typing hint
- Mobile-first, tested on real device

### v2.0 — Planned
- Google login + cloud sync
- Push notifications
- Multi-language (next-intl)
- Multiple workout plans
- React Native / Expo mobile app
- Exercise history charts
- PWA for App Store / Google Play

### UI-Only (not functional yet)
- Inactivity Reminder — no notifications sent
- Language selector — stays in English
- Default weight unit — not applied to new exercises
