'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function SplashPage() {
  const router = useRouter()

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push('/planner')
    }, 2000)
    return () => clearTimeout(timer)
  }, [router])

  return (
    <div style={{
      background: '#2D6A4F',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'Inter, sans-serif',
      position: 'relative',
    }}>

      {/* Main content */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        animation: 'fadeUp 0.6s ease forwards',
      }}>

        {/* App icon */}
        <div style={{
          width: '96px', height: '96px',
          borderRadius: '28px',
          background: 'rgba(255,255,255,0.12)',
          display: 'flex', alignItems: 'center',
          justifyContent: 'center',
          fontSize: '48px',
          marginBottom: '24px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
        }}>🏋️</div>

        {/* App name */}
        <div style={{
          fontSize: '42px',
          fontWeight: 800,
          letterSpacing: '-1.5px',
          lineHeight: 1,
          marginBottom: '8px',
        }}>
          <span style={{ color: '#fff' }}>Voice</span>
          <span style={{ color: '#AAFF00' }}>Gym</span>
        </div>

        {/* Tagline */}
        <div style={{
          fontSize: '14px',
          color: 'rgba(255,255,255,0.6)',
          letterSpacing: '0.3px',
          marginBottom: '48px',
        }}>
          Your voice-driven workout planner
        </div>

        {/* Progress bar */}
        <div style={{
          width: '48px', height: '4px',
          background: 'rgba(255,255,255,0.2)',
          borderRadius: '2px',
          overflow: 'hidden',
        }}>
          <div style={{
            height: '100%',
            background: '#AAFF00',
            borderRadius: '2px',
            animation: 'load 2s linear forwards',
          }} />
        </div>
      </div>

      {/* Footer */}
      <div style={{
        position: 'absolute',
        bottom: '32px',
        fontSize: '11px',
        color: 'rgba(255,255,255,0.3)',
        letterSpacing: '0.5px',
      }}>
        Built with Claude Code ⚡
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@700;800&display=swap');

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes load {
          from { width: 0%; }
          to { width: 100%; }
        }
      `}</style>
    </div>
  )
}
