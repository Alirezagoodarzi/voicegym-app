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

        <FieldRow label="Language" last>
          <select value={prefs.language}
            onChange={e => save({ ...prefs, language: e.target.value })}
            style={{ border: 'none', background: 'transparent', outline: 'none',
              fontSize: '13px', fontWeight: 700, color: '#2D6A4F',
              fontFamily: 'inherit', cursor: 'pointer' }}>
            {['English', 'French', 'Spanish', 'Persian'].map(l => (
              <option key={l}>{l}</option>
            ))}
          </select>
        </FieldRow>
      </div>

      <SectionLabel2 label="Notifications" />
      <div style={{ margin: '0 16px 16px', background: '#fff',
        border: '1.5px solid #E0E7D8', borderRadius: '16px', overflow: 'hidden' }}>
        <FieldRow label="Inactivity Reminder"
          sub="Remind me if I haven't worked out" last>
          <Toggle
            value={prefs.inactivityReminder}
            onChange={v => save({ ...prefs, inactivityReminder: v })} />
        </FieldRow>
      </div>
    </div>
  )
}
