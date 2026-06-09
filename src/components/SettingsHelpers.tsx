'use client'

export function SubHeader({ title, sub, onBack }: {
  title: string; sub: string; onBack: () => void
}) {
  return (
    <div style={{ padding: '16px 18px 12px', display: 'flex',
      alignItems: 'center', gap: '12px' }}>
      <button onClick={onBack}
        style={{ background: 'transparent', border: 'none',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '20px', cursor: 'pointer',
          color: '#1A1A1A', padding: '4px' }}>←</button>
      <div>
        <div style={{ fontSize: '17px', fontWeight: 800, color: '#1A1A1A',
          letterSpacing: '-0.3px' }}>{title}</div>
        {sub && <div style={{ fontSize: '11px', color: '#9A9A9A',
          marginTop: '1px' }}>{sub}</div>}
      </div>
    </div>
  )
}

export function SectionLabel2({ label }: { label: string }) {
  return (
    <div style={{ fontSize: '10px', fontWeight: 700, color: '#9A9A9A',
      textTransform: 'uppercase' as const, letterSpacing: '0.5px',
      margin: '0 16px 6px' }}>{label}</div>
  )
}

export function FieldRow({ label, sub, children, last }: {
  label: string; sub?: string; unit?: string; children: React.ReactNode; last?: boolean
}) {
  return (
    <div style={{ padding: '14px 16px', display: 'flex', alignItems: 'center',
      justifyContent: 'space-between', gap: '12px',
      borderBottom: last ? 'none' : '1px solid #E0E7D8' }}>
      <div>
        <div style={{ fontSize: '13px', fontWeight: 600,
          color: '#1A1A1A' }}>{label}</div>
        {sub && <div style={{ fontSize: '10px', color: '#9A9A9A',
          marginTop: '2px' }}>{sub}</div>}
      </div>
      {children}
    </div>
  )
}

export function UnitToggle({ options, value, onChange }: {
  options: string[]; value: string; onChange: (v: string) => void
}) {
  return (
    <div style={{ display: 'flex', gap: '4px' }}>
      {options.map(opt => (
        <button key={opt} onClick={() => onChange(opt)}
          style={{ padding: '5px 10px', borderRadius: '8px', fontSize: '11px',
            fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit',
            border: '1.5px solid',
            borderColor: value === opt ? '#2D6A4F' : '#E0E7D8',
            background: value === opt ? '#2D6A4F' : '#EEF2E8',
            color: value === opt ? '#fff' : '#4A4A4A' }}>
          {opt}
        </button>
      ))}
    </div>
  )
}

export function Toggle({ value, onChange }: {
  value: boolean; onChange: (v: boolean) => void
}) {
  return (
    <div onClick={() => onChange(!value)}
      style={{ width: '44px', height: '24px', borderRadius: '12px',
        background: value ? '#2D6A4F' : '#E0E7D8',
        position: 'relative', cursor: 'pointer',
        transition: 'background 0.2s' }}>
      <div style={{ position: 'absolute', top: '2px',
        left: value ? '22px' : '2px', width: '20px', height: '20px',
        borderRadius: '50%', background: '#fff',
        transition: 'left 0.2s',
        boxShadow: '0 1px 4px rgba(0,0,0,0.2)' }} />
    </div>
  )
}
