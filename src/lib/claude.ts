import type { Exercise } from "@/types"

export async function parseExerciseVoice(transcript: string): Promise<Exercise> {
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
      system:
        "You are a gym workout parser. Parse the user's voice command into a JSON object. Return ONLY valid JSON, no markdown, no explanation.\nFormat: {\n  name: string (exercise name),\n  equipment: string (equipment name),\n  equipmentId: string (lowercase equipment name with hyphens),\n  sets: number,\n  reps: number,\n  restSeconds: number\n}",
      messages: [{ role: "user", content: transcript }],
    }),
  })

  if (!response.ok) {
    const text = await response.text()
    throw new Error(`Anthropic API error ${response.status}: ${text}`)
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

  if (
    typeof parsed.name !== "string" ||
    typeof parsed.equipment !== "string" ||
    typeof parsed.equipmentId !== "string" ||
    typeof parsed.sets !== "number" ||
    typeof parsed.reps !== "number" ||
    typeof parsed.restSeconds !== "number"
  ) {
    throw new Error(`Invalid exercise fields in response: ${raw}`)
  }

  return { ...parsed, id: crypto.randomUUID() }
}
