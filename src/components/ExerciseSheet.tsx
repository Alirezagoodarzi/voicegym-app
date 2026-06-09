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

type StepperProps = {
  label: string;
  value: string;
  onChange: (val: string) => void;
  step?: number;
  min?: number;
};

function Stepper({ label, value, onChange, step = 1, min = 0 }: StepperProps) {
  const num = parseFloat(value) || 0;
  return (
    <div style={{ flex: 1 }}>
      <label style={{
        fontSize: "10px", fontWeight: 600, color: "#9A9A9A",
        textTransform: "uppercase" as const, letterSpacing: "0.5px",
        display: "block", marginBottom: "4px",
      }}>
        {label}
      </label>
      <div style={{
        display: "flex", alignItems: "center",
        background: "#EEF2E8", border: "1.5px solid #E0E7D8",
        borderRadius: "10px", overflow: "hidden", height: "42px",
      }}>
        <button
          type="button"
          onClick={() => onChange(String(Math.max(min, num - step)))}
          style={{
            width: "42px", height: "42px", flexShrink: 0,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "20px", fontWeight: 300, color: "#2D6A4F",
            background: "transparent", border: "none", cursor: "pointer",
          }}
        >−</button>
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          style={{
            flex: 1, textAlign: "center" as const, fontSize: "15px",
            fontWeight: 700, color: "#1A1A1A", border: "none",
            background: "transparent", outline: "none",
            fontFamily: "inherit", width: "100%",
          }}
        />
        <button
          type="button"
          onClick={() => onChange(String(num + step))}
          style={{
            width: "42px", height: "42px", flexShrink: 0,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "20px", fontWeight: 300, color: "#2D6A4F",
            background: "transparent", border: "none", cursor: "pointer",
          }}
        >+</button>
      </div>
    </div>
  );
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
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
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
    if (!form.name.trim() || !form.equipment.trim()) {
      return;
    }
    onSave({
      id: mode === "edit" && exercise ? exercise.id : crypto.randomUUID(),
      name: form.name.trim(),
      equipment: form.equipment.trim(),
      equipmentId: form.equipmentId || form.equipment.trim().toLowerCase().replace(/\s+/g, "-"),
      sets: Number(form.sets) || 0,
      reps: Number(form.reps) || 0,
      restSeconds: Number(form.restSeconds) || 0,
      weight: Number(form.weight) || 0,
      weightUnit: form.weightUnit as "kg" | "lbs",
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
          padding: "0 20px 100px",
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
          <Stepper label="Sets" value={form.sets}
            onChange={(v) => setForm((f) => ({ ...f, sets: v }))} min={0} />
          <Stepper label="Reps" value={form.reps}
            onChange={(v) => setForm((f) => ({ ...f, reps: v }))} min={0} />
          <Stepper label="Rest (s)" value={form.restSeconds}
            onChange={(v) => setForm((f) => ({ ...f, restSeconds: v }))}
            step={5} min={0} />
        </div>

        {/* Weight + unit toggle */}
        <div style={{ display: "flex", gap: "8px", marginBottom: "20px", alignItems: "flex-end" }}>
          <Stepper label="Weight" value={form.weight}
            onChange={(v) => setForm((f) => ({ ...f, weight: v }))}
            step={2.5} min={0} />
          <div style={{ flex: 1 }}>
            <label style={{
              fontSize: "10px", fontWeight: 600, color: "#9A9A9A",
              textTransform: "uppercase" as const, letterSpacing: "0.5px",
              display: "block", marginBottom: "4px",
            }}>Unit</label>
            <div style={{ display: "flex", gap: "4px" }}>
              {(["kg", "lbs"] as const).map((u) => (
                <button key={u} type="button"
                  onClick={() => setForm((f) => ({ ...f, weightUnit: u }))}
                  style={{
                    flex: 1, padding: "10px 0", borderRadius: "8px",
                    fontSize: "12px", fontWeight: 700, cursor: "pointer",
                    fontFamily: "inherit", border: "1.5px solid",
                    borderColor: form.weightUnit === u ? "#2D6A4F" : "#E0E7D8",
                    background: form.weightUnit === u ? "#2D6A4F" : "#EEF2E8",
                    color: form.weightUnit === u ? "#fff" : "#4A4A4A",
                  }}
                >{u}</button>
              ))}
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div style={{ display: "flex", gap: "8px" }}>
          {mode === "edit" && onDelete && (
            <button
              onClick={() => setShowDeleteConfirm(true)}
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

      {showDeleteConfirm && (
        <>
          <div onClick={() => setShowDeleteConfirm(false)} style={{
            position: 'fixed', inset: 0,
            background: 'rgba(0,0,0,0.4)', zIndex: 200,
          }} />
          <div style={{
            position: 'fixed', bottom: 0, left: '50%',
            transform: 'translateX(-50%)',
            width: '100%', maxWidth: '430px',
            background: '#fff', borderRadius: '24px 24px 0 0',
            padding: '0 20px 40px', zIndex: 201,
          }}>
            <div style={{
              width: '36px', height: '4px', background: '#E0E7D8',
              borderRadius: '2px', margin: '12px auto 20px',
            }} />
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <div style={{ fontSize: '32px', marginBottom: '12px' }}>⚠️</div>
              <div style={{ fontSize: '16px', fontWeight: 800,
                color: '#1A1A1A', marginBottom: '8px' }}>
                Delete Exercise?
              </div>
              <div style={{ fontSize: '13px', color: '#9A9A9A',
                lineHeight: '1.5' }}>
                This will remove this exercise from your workout plan.
                This cannot be undone.
              </div>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button onClick={() => setShowDeleteConfirm(false)} style={{
                flex: 1, padding: '13px', borderRadius: '12px',
                fontSize: '14px', fontWeight: 700, cursor: 'pointer',
                background: '#EEF2E8', color: '#4A4A4A',
                border: '1.5px solid #E0E7D8', fontFamily: 'inherit',
              }}>Cancel</button>
              <button onClick={() => {
                setShowDeleteConfirm(false)
                onDelete?.()
              }} style={{
                flex: 1, padding: '13px', borderRadius: '12px',
                fontSize: '14px', fontWeight: 700, cursor: 'pointer',
                background: '#FF4D4D', color: '#fff',
                border: 'none', fontFamily: 'inherit',
              }}>Delete</button>
            </div>
          </div>
        </>
      )}
    </>
  );
}
