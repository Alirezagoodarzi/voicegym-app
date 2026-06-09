'use client'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { SubHeader, SectionLabel2, FieldRow, UnitToggle, Toggle } from '@/components/SettingsHelpers'

type Prefs = {
  defaultWeightUnit: 'kg' | 'lbs'
  language: string
  inactivityReminder: boolean
}

export default function PreferencesPage() {
  const router = useRouter()
  const [prefs, setPrefs] = useState<Prefs>({
    defaultWeightUnit: 'kg',
    language: 'English',
    inactivityReminder: false,
  })

  useEffect(() => {
    try {
      const raw = localStorage.getItem('voicegym-preferences')
      if (raw) setPrefs(JSON.parse(raw))
    } catch {}
  }, [])

  const save = (updated: Prefs) => {
    setPrefs(updated)
    localStorage.setItem('voicegym-preferences', JSON.stringify(updated))
  }

  return (
    <div style={{ background: '#F5F7F2', minHeight: '100vh',
      maxWidth: '430px', margin: '0 auto', paddingBottom: '100px' }}>

      <SubHeader title="Preferences" sub="App settings"
        onBack={() => router.push('/settings')} />

      <SectionLabel2 label="Units & Language" />
      <div style={{ margin: '0 16px 16px', background: '#fff',
        border: '1.5px solid #E0E7D8', borderRadius: '16px', overflow: 'hidden' }}>

        <FieldRow label="Default Weight Unit">
          <UnitToggle
            options={['kg', 'lbs']}
            value={prefs.defaultWeightUnit}
            onChange={u => save({ ...prefs, defaultWeightUnit: u as 'kg' | 'lbs' })} />
        </FieldRow>

        <div style={{ padding: '14px 16px', display: 'flex', alignItems: 'center',
          justifyContent: 'space-between', gap: '12px' }}>
          <div style={{ fontSize: '13px', fontWeight: 600, color: '#1A1A1A' }}>
            Language
            <span style={{ background: '#EEF2E8', color: '#2D6A4F', fontSize: '9px',
              fontWeight: 700, padding: '2px 6px', borderRadius: '6px',
              marginLeft: '6px' }}>Soon</span>
          </div>
          <select value={prefs.language}
            onChange={e => save({ ...prefs, language: e.target.value })}
            disabled
            style={{ border: 'none', background: 'transparent', outline: 'none',
              fontSize: '13px', fontWeight: 700, color: '#2D6A4F',
              fontFamily: 'inherit', cursor: 'not-allowed', opacity: 0.5 }}>
            {['English', 'French', 'Spanish', 'Persian'].map(l => (
              <option key={l}>{l}</option>
            ))}
          </select>
        </div>
      </div>

      <SectionLabel2 label="Notifications" />
      <div style={{ margin: '0 16px 16px', background: '#fff',
        border: '1.5px solid #E0E7D8', borderRadius: '16px', overflow: 'hidden' }}>
        <div style={{ padding: '14px 16px', display: 'flex', alignItems: 'center',
          justifyContent: 'space-between', gap: '12px' }}>
          <div>
            <div style={{ fontSize: '13px', fontWeight: 600, color: '#1A1A1A' }}>
              Inactivity Reminder
              <span style={{ background: '#EEF2E8', color: '#2D6A4F', fontSize: '9px',
                fontWeight: 700, padding: '2px 6px', borderRadius: '6px',
                marginLeft: '6px' }}>Soon</span>
            </div>
            <div style={{ fontSize: '10px', color: '#9A9A9A', marginTop: '2px' }}>
              Remind me if I haven&apos;t worked out
            </div>
          </div>
          <div style={{ opacity: 0.5, cursor: 'not-allowed', pointerEvents: 'none' }}>
            <Toggle
              value={prefs.inactivityReminder}
              onChange={v => save({ ...prefs, inactivityReminder: v })} />
          </div>
        </div>
      </div>
    </div>
  )
}
