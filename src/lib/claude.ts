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
  const t = transcript.trim().toLowerCase()

  const WORD_NUMBERS: Record<string, number> = {
    one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7,
    eight: 8, nine: 9, ten: 10, eleven: 11, twelve: 12, fifteen: 15,
    twenty: 20, thirty: 30, forty: 40, fifty: 50, sixty: 60,
    ninety: 90, hundred: 100,
  }
  function toNumber(s: string): number {
    return WORD_NUMBERS[s.toLowerCase()] ?? parseInt(s, 10)
  }

  // Sets: "sets 4" / "4 sets" / "sets four"
  const setsMatch =
    t.match(/\bsets?\s+(\d+|one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|fifteen|twenty|thirty)\b/i) ??
    t.match(/\b(\d+|one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|fifteen|twenty|thirty)\s+sets?\b/i)
  if (setsMatch) result.sets = toNumber(setsMatch[1])

  // Reps: "reps 8" / "8 reps" / "reps eight"
  const repsMatch =
    t.match(/\breps?\s+(\d+|one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|fifteen|twenty|thirty)\b/i) ??
    t.match(/\b(\d+|one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|fifteen|twenty|thirty)\s+reps?\b/i)
  if (repsMatch) result.reps = toNumber(repsMatch[1])

  // Rest: "rest 90" / "90 seconds" / "rest ninety seconds"
  const restMatch =
    t.match(/\brest\s+(\d+|thirty|forty|fifty|sixty|ninety|hundred)\b/i) ??
    t.match(/\b(\d+|thirty|forty|fifty|sixty|ninety|hundred)\s*(?:seconds?|secs?)\b/i)
  if (restMatch) result.restSeconds = toNumber(restMatch[1])

  // Equipment: MUST start with "equipment" keyword
  const equipMatch = t.match(/\bequipment\s+([a-zA-Z][a-zA-Z\s'-]*?)(?:\s*$)/i)
  if (equipMatch) {
    const eq = equipMatch[1].trim()
    result.equipment = eq
    result.equipmentId = eq.toLowerCase().replace(/\s+/g, "-")
  }

  // Name: MUST start with "name" keyword
  const nameMatch = t.match(/\bname\s+([a-zA-Z][a-zA-Z\s'-]*?)(?:\s*$)/i)
  if (nameMatch) {
    result.name = nameMatch[1].trim()
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
