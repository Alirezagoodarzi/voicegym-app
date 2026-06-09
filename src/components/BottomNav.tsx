'use client'
import { usePathname, useRouter } from 'next/navigation'

export function BottomNav() {
  const router = useRouter()
  const pathname = usePathname()

  const items = [
    { label: 'Workout', icon: '🏋️', path: '/planner' },
    { label: 'History', icon: '🕐', path: '/history' },
    { label: 'Profile', icon: '👤', path: '/profile' },
  ]

  return (
    <div style={{
      position: 'fixed', bottom: 0, left: '50%',
      transform: 'translateX(-50%)',
      width: '100%', maxWidth: '430px',
      borderTop: '1.5px solid #E0E7D8',
      background: '#fff',
      display: 'flex', justifyContent: 'space-around',
      padding: '10px 0 24px',
      zIndex: 100,
    }}>
      {items.map(item => (
        <button key={item.path}
          onClick={() => router.push(item.path)}
          style={{
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', gap: '3px',
            fontSize: '10px', fontWeight: 600,
            color: pathname === item.path ? '#2D6A4F' : '#9A9A9A',
            background: 'transparent', border: 'none',
            cursor: 'pointer', fontFamily: 'inherit',
            padding: '4px 20px',
            borderRadius: '12px',
            backgroundColor: pathname === item.path ? '#EEF2E8' : 'transparent',
          }}>
          <span style={{ fontSize: '20px' }}>{item.icon}</span>
          <span>{item.label}</span>
        </button>
      ))}
    </div>
  )
}
