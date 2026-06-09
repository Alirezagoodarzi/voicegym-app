'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function SettingsPage() {
  const router = useRouter()
  const [showConfirm, setShowConfirm] = useState(false)

  return (
    <div style={{ background: '#F5F7F2', minHeight: '100vh',
      maxWidth: '430px', margin: '0 auto', paddingBottom: '100px' }}>

      {/* Header */}
      <div style={{ padding: '20px 18px 12px' }}>
        <h1 style={{ fontSize: '20px', fontWeight: 800,
          color: '#1A1A1A', letterSpacing: '-0.3px' }}>Settings</h1>
        <p style={{ fontSize: '11px', color: '#9A9A9A', marginTop: '2px' }}>
          Preferences &amp; About
        </p>
      </div>

      {/* App card */}
      <div style={{ margin: '0 16px 20px', background: '#2D6A4F',
        borderRadius: '16px', padding: '16px', display: 'flex',
        alignItems: 'center', gap: '12px' }}>
        <div style={{ width: '44px', height: '44px', borderRadius: '12px',
          background: 'rgba(255,255,255,0.15)', display: 'flex',
          alignItems: 'center', justifyContent: 'center', fontSize: '22px' }}>
          🏋️
        </div>
        <div>
          <div style={{ fontSize: '15px', fontWeight: 800, color: '#fff',
            letterSpacing: '-0.3px' }}>VoiceGym</div>
          <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.6)',
            marginTop: '2px' }}>Version 1.0.0 · Built with Claude Code ⚡</div>
        </div>
      </div>

      {/* Account section */}
      <SectionLabel label="Account" />
      <SectionCard>
        <MenuItem icon="👤" iconBg="#EEF2E8"
          label="Profile" sub="Age, weight, height"
          onClick={() => router.push('/settings/profile')} />
      </SectionCard>

      {/* App section */}
      <SectionLabel label="App" />
      <SectionCard>
        <MenuItem icon="⚖️" iconBg="#EEF2E8"
          label="Preferences" sub="Units, language, reminders"
          onClick={() => router.push('/settings/preferences')} />
        <MenuItem icon="🗑" iconBg="#FFF0F0"
          label="Clear All Data" sub="Reset workout history and plans"
          labelColor="#FF4D4D" arrowColor="#FF4D4D"
          onClick={() => setShowConfirm(true)} />
      </SectionCard>

      {/* About section */}
      <SectionLabel label="About" />
      <SectionCard>
        <MenuItem
          iconText="AG" iconBg="#EEF2E8" iconTextColor="#2D6A4F"
          label="About the Founder" sub="Dr. Alireza Goodarzi"
          onClick={() => router.push('/settings/about')} />
      </SectionCard>

      {showConfirm && (
        <>
          {/* Overlay */}
          <div onClick={() => setShowConfirm(false)} style={{
            position: 'fixed', inset: 0,
            background: 'rgba(0,0,0,0.4)', zIndex: 100,
          }} />

          {/* Modal */}
          <div style={{
            position: 'fixed', bottom: 0, left: '50%',
            transform: 'translateX(-50%)',
            width: '100%', maxWidth: '430px',
            background: '#fff', borderRadius: '24px 24px 0 0',
            padding: '0 20px 40px', zIndex: 101,
          }}>
            <div style={{
              width: '36px', height: '4px', background: '#E0E7D8',
              borderRadius: '2px', margin: '12px auto 20px',
            }} />

            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <div style={{ fontSize: '32px', marginBottom: '12px' }}>🗑️</div>
              <div style={{ fontSize: '16px', fontWeight: 800,
                color: '#1A1A1A', marginBottom: '8px' }}>
                Clear All Data?
              </div>
              <div style={{ fontSize: '13px', color: '#9A9A9A',
                lineHeight: '1.5' }}>
                This will permanently delete all your workout plans,
                session history, and profile data. This cannot be undone.
              </div>
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              <button onClick={() => setShowConfirm(false)} style={{
                flex: 1, padding: '13px', borderRadius: '12px',
                fontSize: '14px', fontWeight: 700, cursor: 'pointer',
                background: '#EEF2E8', color: '#4A4A4A',
                border: '1.5px solid #E0E7D8', fontFamily: 'inherit',
              }}>Cancel</button>
              <button onClick={() => {
                localStorage.removeItem('voicegym-plan')
                localStorage.removeItem('voicegym-sessions')
                localStorage.removeItem('voicegym-profile')
                localStorage.removeItem('voicegym-preferences')
                setShowConfirm(false)
              }} style={{
                flex: 1, padding: '13px', borderRadius: '12px',
                fontSize: '14px', fontWeight: 700, cursor: 'pointer',
                background: '#FF4D4D', color: '#fff',
                border: 'none', fontFamily: 'inherit',
              }}>Clear All</button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

function SectionLabel({ label }: { label: string }) {
  return (
    <div style={{ fontSize: '10px', fontWeight: 700, color: '#9A9A9A',
      textTransform: 'uppercase', letterSpacing: '0.5px',
      margin: '0 16px 6px' }}>
      {label}
    </div>
  )
}

function SectionCard({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ margin: '0 16px 16px', background: '#fff',
      border: '1.5px solid #E0E7D8', borderRadius: '16px',
      overflow: 'hidden' }}>
      {children}
    </div>
  )
}

type MenuItemProps = {
  icon?: string
  iconText?: string
  iconBg: string
  iconTextColor?: string
  label: string
  sub: string
  labelColor?: string
  arrowColor?: string
  onClick: () => void
}

function MenuItem({ icon, iconText, iconBg, iconTextColor,
  label, sub, labelColor, arrowColor, onClick }: MenuItemProps) {
  return (
    <div onClick={onClick} style={{ padding: '14px 16px', display: 'flex',
      alignItems: 'center', gap: '12px', borderBottom: '1px solid #E0E7D8',
      cursor: 'pointer' }}
      onMouseEnter={e => (e.currentTarget.style.background = '#F5F7F2')}
      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
      <div style={{ width: '34px', height: '34px', borderRadius: '10px',
        background: iconBg, display: 'flex', alignItems: 'center',
        justifyContent: 'center', fontSize: iconText ? '13px' : '18px',
        fontWeight: iconText ? 800 : 400, color: iconTextColor || '#1A1A1A',
        flexShrink: 0 }}>
        {icon || iconText}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: '13px', fontWeight: 600,
          color: labelColor || '#1A1A1A' }}>{label}</div>
        <div style={{ fontSize: '11px', color: '#9A9A9A',
          marginTop: '1px' }}>{sub}</div>
      </div>
      <div style={{ fontSize: '18px', color: arrowColor || '#9A9A9A' }}>›</div>
    </div>
  )
}
