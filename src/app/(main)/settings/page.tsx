'use client'
import { useRouter } from 'next/navigation'

export default function SettingsPage() {
  const router = useRouter()

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
          onClick={() => {
            if (confirm('Are you sure? This will delete all your workout data.')) {
              localStorage.removeItem('voicegym-plan')
              localStorage.removeItem('voicegym-sessions')
              localStorage.removeItem('voicegym-profile')
              localStorage.removeItem('voicegym-preferences')
              alert('All data cleared.')
            }
          }} />
      </SectionCard>

      {/* About section */}
      <SectionLabel label="About" />
      <SectionCard>
        <MenuItem
          iconText="AG" iconBg="#EEF2E8" iconTextColor="#2D6A4F"
          label="About the Founder" sub="Dr. Alireza Goodarzi"
          onClick={() => router.push('/settings/about')} />
      </SectionCard>
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
