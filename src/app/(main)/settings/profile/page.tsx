'use client'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { SubHeader, SectionLabel2, FieldRow, UnitToggle } from '@/components/SettingsHelpers'

type ProfileData = {
  age: string
  weight: string
  weightUnit: 'kg' | 'lbs'
  height: string
  heightUnit: 'cm' | 'ft'
}

export default function ProfilePage() {
  const router = useRouter()
  const [profile, setProfile] = useState<ProfileData>({
    age: '', weight: '', weightUnit: 'kg',
    height: '', heightUnit: 'cm',
  })

  useEffect(() => {
    try {
      const raw = localStorage.getItem('voicegym-profile')
      if (raw) setProfile(JSON.parse(raw))
    } catch {}
  }, [])

  const save = (updated: ProfileData) => {
    setProfile(updated)
    localStorage.setItem('voicegym-profile', JSON.stringify(updated))
  }

  const inputStyle: React.CSSProperties = {
    border: 'none', background: 'transparent', outline: 'none',
    fontSize: '13px', fontWeight: 700, color: '#2D6A4F',
    textAlign: 'right', width: '60px', fontFamily: 'inherit',
  }

  return (
    <div style={{ background: '#F5F7F2', minHeight: '100vh',
      maxWidth: '430px', margin: '0 auto', paddingBottom: '100px' }}>

      <SubHeader title="Profile" sub="Your personal info"
        onBack={() => router.push('/settings')} />

      <SectionLabel2 label="Personal" />
      <div style={{ margin: '0 16px 16px', background: '#fff',
        border: '1.5px solid #E0E7D8', borderRadius: '16px', overflow: 'hidden' }}>

        <FieldRow label="Age" unit="years">
          <input type="number" value={profile.age}
            onChange={e => save({ ...profile, age: e.target.value })}
            placeholder="—"
            style={inputStyle} />
        </FieldRow>

        <FieldRow label="Body Weight">
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <input type="number" value={profile.weight}
              onChange={e => save({ ...profile, weight: e.target.value })}
              placeholder="—"
              style={{ ...inputStyle, width: '50px' }} />
            <UnitToggle
              options={['kg', 'lbs']}
              value={profile.weightUnit}
              onChange={u => save({ ...profile, weightUnit: u as 'kg' | 'lbs' })} />
          </div>
        </FieldRow>

        <FieldRow label="Height" last>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <input type="number" value={profile.height}
              onChange={e => save({ ...profile, height: e.target.value })}
              placeholder="—"
              style={{ ...inputStyle, width: '50px' }} />
            <UnitToggle
              options={['cm', 'ft']}
              value={profile.heightUnit}
              onChange={u => save({ ...profile, heightUnit: u as 'cm' | 'ft' })} />
          </div>
        </FieldRow>
      </div>
    </div>
  )
}
