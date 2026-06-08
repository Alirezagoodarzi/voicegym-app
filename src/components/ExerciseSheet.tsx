"use client";

import { useState, useRef } from "react";
import type { CSSProperties } from "react";
import type { Exercise } from "@/types";

interface SpeechAlternative { transcript: string }
interface SpeechResult { isFinal: boolean; readonly length: number; [index: number]: SpeechAlternative }
interface SpeechResultList { readonly length: number; [index: number]: SpeechResult }
interface SpeechResultEvent extends Event { results: SpeechResultList }
interface SpeechErrorEvent extends Event { error: string }
interface ISpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: ((event: SpeechResultEvent) => void) | null;
  onerror: ((event: SpeechErrorEvent) => void) | null;
  onend: (() => void) | null;
  start(): void;
  stop(): void;
}

type ExerciseSheetProps = {
  mode: "edit" | "add";
  exercise?: Exercise;
  onSave: (exercise: Exercise) => void;
  onDelete?: () => void;
  onClose: () => void;
};

type FormState = {
  name: string;
  equipment: string;
  equipmentId: string;
  sets: string;
  reps: string;
  restSeconds: string;
  weight: string;
  weightUnit: "kg" | "lbs";
};

const labelStyle: CSSProperties = {
  fontSize: "10px",
  fontWeight: 600,
  color: "#9A9A9A",
  textTransform: "uppercase",
  letterSpacing: "0.5px",
  display: "block",
  marginBottom: "4px",
};

const baseInputStyle: CSSProperties = {
  width: "100%",
  background: "#EEF2E8",
  borderWidth: "1.5px",
  borderStyle: "solid",
  borderRadius: "10px",
  padding: "8px 10px",
  fontSize: "13px",
  fontWeight: 600,
  color: "#1A1A1A",
  outline: "none",
  fontFamily: "inherit",
  boxSizing: "border-box",
};

const numericFields = [
  { key: "sets" as const, label: "Sets" },
  { key: "reps" as const, label: "Reps" },
  { key: "restSeconds" as const, label: "Rest (s)" },
];

export default function ExerciseSheet({
  mode,
  exercise,
  onSave,
  onDelete,
  onClose,
}: ExerciseSheetProps) {
  const [form, setForm] = useState<FormState>({
    name: exercise?.name ?? "",
    equipment: exercise?.equipment ?? "",
    equipmentId: exercise?.equipmentId ?? "",
    sets: exercise?.sets?.toString() ?? "",
    reps: exercise?.reps?.toString() ?? "",
    restSeconds: exercise?.restSeconds?.toString() ?? "",
    weight: exercise?.weight?.toString() ?? "0",
    weightUnit: exercise?.weightUnit ?? "kg",
  });
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [micStatus, setMicStatus] = useState<"idle" | "listening" | "processing">("idle");
  const [micError, setMicError] = useState<string>("");
  const recognitionRef = useRef<ISpeechRecognition | null>(null);

  const getInputStyle = (field: string): CSSProperties => ({
    ...baseInputStyle,
    borderColor: focusedField === field ? "#40916C" : "#E0E7D8",
  });

  const handleMic = async () => {
    if (micStatus !== "idle") return;

    const w = window as Window & {
      SpeechRecognition?: new () => ISpeechRecognition;
      webkitSpeechRecognition?: new () => ISpeechRecognition;
    };
    const SR = w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;

    if (!SR) {
      setMicError("Speech not supported");
      return;
    }

    setMicError("");
    const recognition = new SR();
    recognitionRef.current = recognition;
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    let finalTranscript = "";

    recognition.onresult = (event: SpeechResultEvent) => {
      finalTranscript = "";
      for (let i = 0; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        }
      }
    };

    recognition.onerror = (event: SpeechErrorEvent) => {
      setMicStatus("idle");
      setMicError(event.error === "not-allowed" ? "Mic access denied" : "Speech error");
    };

    recognition.onend = () => {
      const transcript = finalTranscript.trim();
      if (!transcript) {
        setMicStatus("idle");
        setMicError("No speech detected");
        return;
      }

      setMicStatus("processing");

      void (async () => {
        try {
          const res = await fetch("/api/parse-exercise", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({ transcript, partial: true }),
          });
          const data = await res.json() as { exercise?: Partial<Exercise>; error?: string };
console.log('ALi ALI:', 'ALiALiALi')
          if (res.ok && data.exercise) {
            console.log('API:', JSON.stringify(data))
            const ex = data.exercise;
            setForm((prev) => ({
              ...prev,
              name: ex.name ?? prev.name,
              equipment: ex.equipment ?? prev.equipment,
              equipmentId: ex.equipmentId ?? prev.equipmentId,
              sets: ex.sets !== undefined ? ex.sets.toString() : mode === "add" ? "0" : prev.sets,
              reps: ex.reps !== undefined ? ex.reps.toString() : mode === "add" ? "0" : prev.reps,
              restSeconds: ex.restSeconds !== undefined ? ex.restSeconds.toString() : mode === "add" ? "0" : prev.restSeconds,
              weight: ex.weight !== undefined ? ex.weight.toString() : prev.weight,
              weightUnit: ex.weightUnit ?? prev.weightUnit,
            }));
          } else {
            setMicError(data.error ?? "Failed to parse. Try again.");
          }
        } catch {
          setMicError("Network error. Please try again.");
        } finally {
          setMicStatus("idle");
        }
      })();
    };

    setMicStatus("listening");
    recognition.start();
  };

  const handleSave = () => {
    if (!form.name.trim() || !form.equipment.trim() || form.sets === "" || form.reps === "" || form.restSeconds === "") 
    {
      return;
    }
    onSave({
      id: mode === "edit" && exercise ? exercise.id : crypto.randomUUID(),
      name: form.name.trim(),
      equipment: form.equipment.trim(),
      equipmentId:
        form.equipmentId ||
        form.equipment.trim().toLowerCase().replace(/\s+/g, "-"),
      sets: Number(form.sets),
      reps: Number(form.reps),
      restSeconds: Number(form.restSeconds),
      weight: Number(form.weight),
      weightUnit: form.weightUnit,
    });
  };

  return (
    <>
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.3)",
          zIndex: 50,
        }}
      />
      <div
        style={{
          position: "fixed",
          bottom: 0,
          left: "50%",
          transform: "translateX(-50%)",
          width: "100%",
          maxWidth: "430px",
          background: "#fff",
          borderRadius: "24px 24px 0 0",
          padding: "0 20px 32px",
          zIndex: 51,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            paddingTop: "12px",
            marginBottom: "16px",
          }}
        >
          <div
            style={{
              width: "36px",
              height: "4px",
              background: "#E0E7D8",
              borderRadius: "2px",
            }}
          />
        </div>

        <p
          style={{
            fontSize: "15px",
            fontWeight: 700,
            color: "#1A1A1A",
            marginBottom: "4px",
          }}
        >
          {mode === "edit" ? "Edit Exercise" : "Add Exercise"}
        </p>
        <p style={{ fontSize: "11px", color: "#9A9A9A", marginBottom: "16px" }}>
          {mode === "edit" && exercise
            ? `${exercise.name} · ${exercise.equipment}`
            : "Speak or fill in the details"}
        </p>

        {/* Voice re-record row */}
        <div
          style={{
            background: "#EEF2E8",
            border: "1.5px solid #E0E7D8",
            borderRadius: "12px",
            padding: "10px 14px",
            marginBottom: "14px",
            display: "flex",
            gap: "10px",
            alignItems: "center",
          }}
        >
          <button
            onClick={handleMic}
            style={{
              width: "36px",
              height: "36px",
              borderRadius: "50%",
              background: "#AAFF00",
              boxShadow: "0 2px 8px rgba(170,255,0,0.4)",
              border: "none",
              cursor: micStatus !== "idle" ? "default" : "pointer",
              fontSize: "16px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            {micStatus === "processing" ? "⚡" : "🎙"}
          </button>
          <div>
            <p
              style={{
                fontSize: "11px",
                fontWeight: 700,
                color: "#2D6A4F",
                marginBottom: "2px",
              }}
            >
              {micStatus === "listening"
                ? "Listening..."
                : micStatus === "processing"
                ? "Processing..."
                : "Re-record by voice"}
            </p>
            <p style={{ fontSize: "11px", color: "#4A4A4A" }}>
              {micError || "Say any combination — e.g: 'sets 4 reps 8 rest 90' or just 'reps 10' or 'name bench press equipment barbell'"}
            </p>
          </div>
        </div>

        {/* Exercise name */}
        <div style={{ marginBottom: "10px" }}>
          <label style={labelStyle}>Exercise Name</label>
          <input
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            style={getInputStyle("name")}
            onFocus={() => setFocusedField("name")}
            onBlur={() => setFocusedField(null)}
          />
        </div>

        {/* Equipment */}
        <div style={{ marginBottom: "10px" }}>
          <label style={labelStyle}>Equipment</label>
          <input
            value={form.equipment}
            onChange={(e) => setForm((f) => ({ ...f, equipment: e.target.value }))}
            style={getInputStyle("equipment")}
            onFocus={() => setFocusedField("equipment")}
            onBlur={() => setFocusedField(null)}
          />
        </div>

        {/* Sets / Reps / Rest */}
        <div style={{ display: "flex", gap: "8px", marginBottom: "10px" }}>
          {numericFields.map(({ key, label }) => (
            <div key={key} style={{ flex: 1 }}>
              <label style={labelStyle}>{label}</label>
              <input
                type="number"
                value={form[key]}
                onChange={(e) =>
                  setForm((f) => ({ ...f, [key]: e.target.value } as FormState))
                }
                style={getInputStyle(key)}
                onFocus={() => setFocusedField(key)}
                onBlur={() => setFocusedField(null)}
              />
            </div>
          ))}
        </div>

        {/* Weight + unit toggle */}
        <div style={{ display: "flex", gap: "8px", alignItems: "flex-end", marginBottom: "20px" }}>
          <div style={{ flex: 1 }}>
            <label style={labelStyle}>Weight</label>
            <input
              type="number"
              value={form.weight}
              onChange={(e) => setForm((f) => ({ ...f, weight: e.target.value }))}
              style={getInputStyle("weight")}
              onFocus={() => setFocusedField("weight")}
              onBlur={() => setFocusedField(null)}
            />
          </div>
          <div style={{ display: "flex", gap: "4px", paddingBottom: "1px" }}>
            {(["kg", "lbs"] as const).map((unit) => (
              <button
                key={unit}
                onClick={() => setForm((f) => ({ ...f, weightUnit: unit }))}
                style={{
                  background: form.weightUnit === unit ? "#2D6A4F" : "#EEF2E8",
                  color: form.weightUnit === unit ? "#fff" : "#4A4A4A",
                  border: "none",
                  borderRadius: "8px",
                  padding: "4px 10px",
                  fontSize: "11px",
                  fontWeight: 600,
                  cursor: "pointer",
                  fontFamily: "inherit",
                }}
              >
                {unit}
              </button>
            ))}
          </div>
        </div>

        {/* Buttons */}
        <div style={{ display: "flex", gap: "8px" }}>
          {mode === "edit" && onDelete && (
            <button
              onClick={onDelete}
              style={{
                flex: 1,
                padding: "11px",
                borderRadius: "12px",
                fontSize: "13px",
                fontWeight: 700,
                background: "#EEF2E8",
                color: "#FF4D4D",
                border: "1.5px solid #FFD0D0",
                cursor: "pointer",
              }}
            >
              Delete
            </button>
          )}
          <button
            onClick={handleSave}
            style={{
              flex: 2,
              padding: "11px",
              borderRadius: "12px",
              fontSize: "13px",
              fontWeight: 700,
              background: "#2D6A4F",
              color: "#fff",
              border: "none",
              cursor: "pointer",
            }}
          >
            Save
          </button>
        </div>
      </div>
    </>
  );
}
