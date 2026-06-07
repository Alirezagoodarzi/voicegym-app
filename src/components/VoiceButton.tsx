"use client";

import { useState, useRef } from "react";

type VoiceButtonProps = {
  onTranscript: (transcript: string) => Promise<void>;
};

interface SpeechAlternative {
  transcript: string
}

interface SpeechResult {
  isFinal: boolean
  readonly length: number
  [index: number]: SpeechAlternative
}

interface SpeechResultList {
  readonly length: number
  [index: number]: SpeechResult
}

interface SpeechResultEvent extends Event {
  results: SpeechResultList
}

interface SpeechErrorEvent extends Event {
  error: string
}

interface ISpeechRecognition extends EventTarget {
  continuous: boolean
  interimResults: boolean
  lang: string
  onresult: ((event: SpeechResultEvent) => void) | null
  onerror: ((event: SpeechErrorEvent) => void) | null
  onend: (() => void) | null
  start(): void
  stop(): void
}

declare global {
  interface Window {
    SpeechRecognition: new () => ISpeechRecognition
    webkitSpeechRecognition: new () => ISpeechRecognition
  }
}

export function VoiceButton({ onTranscript }: VoiceButtonProps) {
  const [status, setStatus] = useState<"idle" | "listening" | "processing">("idle");
  const [feedback, setFeedback] = useState<string>("");
  const recognitionRef = useRef<ISpeechRecognition | null>(null);

  const label =
    status === "listening"
      ? "listening..."
      : status === "processing"
      ? "processing..."
      : "tap to record";

  const handleClick = async () => {
    if (status !== "idle") return;

    const SR =
      typeof window !== "undefined"
        ? (window.SpeechRecognition ?? window.webkitSpeechRecognition)
        : null;

    if (!SR) {
      setFeedback("Speech recognition not supported in this browser.");
      return;
    }

    setFeedback("");

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
      setStatus("idle");
      if (event.error === "no-speech") {
        setFeedback("No speech detected. Try again.");
      } else if (event.error === "not-allowed") {
        setFeedback("Microphone access denied.");
      } else {
        setFeedback(`Error: ${event.error}`);
      }
    };

    recognition.onend = async () => {
      if (!finalTranscript.trim()) {
        setStatus("idle");
        setFeedback("No speech detected. Try again.");
        return;
      }
      setStatus("processing");
      try {
        await onTranscript(finalTranscript.trim());
      } catch {
        setFeedback("Failed to process. Try again.");
      } finally {
        setStatus("idle");
      }
    };

    setStatus("listening");
    recognition.start();
  };

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative">
        <button
          type="button"
          onClick={handleClick}
          aria-label={label}
          className={`relative flex h-[72px] w-[72px] items-center justify-center rounded-full text-[28px] shadow-[0_4px_20px_rgba(170,255,0,0.4)] transition-colors ${
            status === "processing"
              ? "bg-green text-white"
              : "bg-[color:var(--lime)] text-[color:var(--text-1)]"
          }`}
        >
          {status === "processing" ? "⚡" : "🎤"}
        </button>
        {status === "listening" ? (
          <span className="pointer-events-none absolute inset-[-12px] rounded-full border border-[rgba(170,255,0,0.4)] opacity-40 animate-pulse" />
        ) : null}
      </div>
      <span className="text-[13px] font-medium text-text-2 uppercase tracking-[0.12em]">
        {label}
      </span>
      {feedback ? (
        <span className="text-[12px] text-[color:var(--text-3)]">{feedback}</span>
      ) : null}
    </div>
  );
}
