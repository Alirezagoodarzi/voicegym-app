import { NextRequest, NextResponse } from "next/server"
import { parseExerciseVoice, parseExerciseVoicePartial } from "@/lib/claude"

export async function POST(request: NextRequest) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json(
      { error: "ANTHROPIC_API_KEY is not configured" },
      { status: 500 }
    )
  }

  let transcript: string
  let partial: boolean
  try {
    const body = await request.json() as { transcript?: string; partial?: boolean }
    transcript = body.transcript ?? ""
    partial = body.partial ?? false
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 })
  }

  if (!transcript.trim()) {
    return NextResponse.json({ error: "transcript is required" }, { status: 400 })
  }

  try {
    if (partial) {
      const exercise = parseExerciseVoicePartial(transcript)
      return NextResponse.json({ exercise })
    }
    const exercise = await parseExerciseVoice(transcript)
    return NextResponse.json({ exercise })
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to parse exercise"
    return NextResponse.json({ error: message }, { status: 400 })
  }
}