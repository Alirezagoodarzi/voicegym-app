import { NextRequest, NextResponse } from "next/server"
import { parseExerciseVoice, parseExerciseVoicePartial } from "@/lib/claude"

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS })
}

export async function POST(request: NextRequest) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json(
      { error: "ANTHROPIC_API_KEY is not configured" },
      { status: 500, headers: CORS_HEADERS }
    )
  }

  let transcript: string
  let partial: boolean
  try {
    const body = await request.json() as { transcript?: string; partial?: boolean }
    transcript = body.transcript ?? ""
    partial = body.partial ?? false
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400, headers: CORS_HEADERS })
  }

  if (!transcript.trim()) {
    return NextResponse.json({ error: "transcript is required" }, { status: 400, headers: CORS_HEADERS })
  }

  try {
    if (partial) {
      const exercise = parseExerciseVoicePartial(transcript)
      return NextResponse.json({ exercise }, { headers: CORS_HEADERS })
    }
    const exercise = await parseExerciseVoice(transcript)
    return NextResponse.json({ exercise }, { headers: CORS_HEADERS })
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to parse exercise"
    return NextResponse.json({ error: message }, { status: 400, headers: CORS_HEADERS })
  }
}
