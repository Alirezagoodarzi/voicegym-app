import type { Exercise } from "@/types"

export class ClaudeAPIError extends Error {
  constructor(public readonly status: number, message: string) {
    super(message)
    this.name = "ClaudeAPIError"
  }
}

export function parseExerciseVoicePartial(
  transcript: string
): Partial<Omit<Exercise, "id">> {
  const result: Partial<Omit<Exercise, "id">> = {}
  const t = transcript.trim()

  // Sets: "4 sets" / "4 set"
  const setsMatch = t.match(/\b(\d+)\s*sets?\b/i)
  if (setsMatch) result.sets = parseInt(setsMatch[1], 10)

  // Reps: "8 reps" / "8 rep"
  const repsMatch = t.match(/\b(\d+)\s*reps?\b/i)
  if (repsMatch) result.reps = parseInt(repsMatch[1], 10)

  // Rest: "90 seconds rest" / "90 seconds" / "90 sec" / "rest 90"
  const restMatch =
    t.match(/\b(\d+)\s*(?:seconds?|secs?)\b/i) ??
    t.match(/\brest\s+(?:for\s+)?(\d+)\b/i)
  if (restMatch) result.restSeconds = parseInt(restMatch[1], 10)

  // Equipment: text after "on" up to a comma, digit, or end
  const equipMatch = t.match(/\bon\s+([a-zA-Z][a-zA-Z\s'-]*?)(?=\s*[,\d]|\s*$)/i)
  if (equipMatch) {
    const eq = equipMatch[1].trim()
    result.equipment = eq
    result.equipmentId = eq.toLowerCase().replace(/\s+/g, "-")
  }

  // Name: leading words before "on …", a digit, or end of string
  // Skip if the phrase starts with an action word like "change" or "update"
  const nameMatch = t.match(/^([a-zA-Z][a-zA-Z\s'-]*?)(?=\s+on\s|\s+\d|\s*$)/i)
  if (nameMatch) {
    const candidate = nameMatch[1].trim()
    if (candidate && !/^(change|update|modify|edit|switch)\b/i.test(candidate)) {
      result.name = candidate
    }
  }

  return result
}

const DEFAULT_SYSTEM_PROMPT = `You are a gym workout parser. Parse the user's voice command into a JSON object. Return ONLY valid JSON, no markdown, no explanation. If the user does not mention sets, reps, or rest time, omit those fields completely — do NOT guess or use defaults. Format: {"name": "string", "equipment": "string", "equipmentId": "string", "sets": "number or omit", "reps": "number or omit", "restSeconds": "number or omit"}`
export async function parseExerciseVoice(
  transcript: string,
  systemPrompt?: string
): Promise<Exercise | Partial<Omit<Exercise, "id">>> {
  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "x-api-key": process.env.ANTHROPIC_API_KEY ?? "",
      "anthropic-version": "2023-06-01",
      "content-type": "application/json",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-5",
      max_tokens: 1000,
      system: systemPrompt ?? DEFAULT_SYSTEM_PROMPT,
      messages: [{ role: "user", content: transcript }],
    }),
  })

  if (!response.ok) {
    throw new ClaudeAPIError(response.status, `Anthropic API error ${response.status}`)
  }

  const data = (await response.json()) as {
    content: Array<{ type: string; text: string }>
  }

  const text = data.content?.[0]?.text
  if (!text) {
    throw new Error("Empty response from Claude")
  }

  const raw = text
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim()

  let parsed: Omit<Exercise, "id">
  try {
    parsed = JSON.parse(raw) as Omit<Exercise, "id">;
  } catch {
    throw new Error(`Failed to parse Claude response as JSON: ${raw}`)
  }

  // When a custom system prompt is used (partial mode), skip strict validation
  if (systemPrompt) {
    return parsed as Partial<Omit<Exercise, "id">>
  }
if (
  typeof parsed.name !== "string" ||
  typeof parsed.equipment !== "string" ||
  typeof parsed.equipmentId !== "string"
) {
  throw new Error(`Invalid exercise fields in response: ${raw}`)
}
  return { ...parsed, id: crypto.randomUUID() }
}
