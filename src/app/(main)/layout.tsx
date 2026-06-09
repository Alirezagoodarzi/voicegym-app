import { BottomNav } from '@/components/BottomNav'

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ paddingBottom: '80px' }}>
      {children}
      <BottomNav />
    </div>
  )
}
