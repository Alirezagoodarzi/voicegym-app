import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-bg text-text-1">
      <div className="mx-auto flex max-w-md flex-col justify-center px-6 py-20 text-center">
        <span className="mb-4 text-sm uppercase tracking-[0.3em] text-text-3">
          VoiceGym
        </span>
        <h1 className="text-[26px] font-extrabold tracking-[-0.8px] text-text-1">
          Your voice-driven workout planner.
        </h1>
        <p className="mx-auto mt-4 max-w-[28rem] text-[15px] leading-7 text-text-2">
          Plan routines by speaking naturally, review a clean mobile-first workout layout, and stay focused on the gym.
        </p>
        <Link
          href="/planner"
          className="mt-10 inline-flex items-center justify-center rounded-full bg-green px-6 py-3 text-sm font-semibold text-white transition hover:bg-green-mid"
        >
          Open Planner
        </Link>
      </div>
    </main>
  );
}
