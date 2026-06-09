'use client'
import { useRouter } from 'next/navigation'
import { SubHeader } from '@/components/SettingsHelpers'

export default function AboutPage() {
  const router = useRouter()

  return (
    <div style={{ background: '#F5F7F2', minHeight: '100vh',
      maxWidth: '430px', margin: '0 auto', paddingBottom: '100px' }}>

      <SubHeader title="About the Founder" sub=""
        onBack={() => router.push('/settings')} />

      <div style={{ margin: '16px', background: '#fff',
        border: '1.5px solid #E0E7D8', borderRadius: '16px', padding: '20px' }}>

        {/* Avatar + name */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px',
          marginBottom: '16px' }}>
          <div style={{ width: '56px', height: '56px', borderRadius: '50%',
            background: '#2D6A4F', color: '#B7E4C7', display: 'flex',
            alignItems: 'center', justifyContent: 'center',
            fontSize: '18px', fontWeight: 800, flexShrink: 0 }}>AG</div>
          <div>
            <div style={{ fontSize: '15px', fontWeight: 700,
              color: '#1A1A1A' }}>Alireza Goodarzi</div>
            <div style={{ fontSize: '11px', color: '#2D6A4F',
              marginTop: '2px' }}>PharmD · Senior Software Developer</div>
            <div style={{ fontSize: '11px', color: '#9A9A9A',
              marginTop: '1px' }}>Bioinformatician</div>
          </div>
        </div>

        {/* Bio */}
        <p style={{ fontSize: '12px', color: '#4A4A4A', lineHeight: '1.7',
          marginBottom: '12px' }}>
          Dr. Alireza Goodarzi is a Pharmacist (PharmD), Bioinformatician,
          and Senior Software Developer with over two decades of experience
          across healthcare, pharmaceuticals, and information technology.
          Having worked both as a healthcare professional and a software
          engineer, he understands the challenges faced by practitioners,
          organizations, and patients.
        </p>
        <p style={{ fontSize: '12px', color: '#4A4A4A', lineHeight: '1.7',
          marginBottom: '16px' }}>
          His mission is to bridge healthcare expertise and technology by
          creating innovative, practical, and scalable digital solutions.
          Through a combination of clinical knowledge, software development,
          business analysis, and artificial intelligence, he focuses on
          developing tools that improve workflows, efficiency, and outcomes
          across healthcare and life sciences.
        </p>

        {/* Links */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
          {[
            { label: 'GitHub →', href: '#' },
            { label: 'LinkedIn →', href: '#' },
          ].map(link => (
            <a key={link.label} href={link.href}
              style={{ flex: 1, background: '#EEF2E8', border: '1.5px solid #E0E7D8',
                borderRadius: '10px', padding: '8px 14px', fontSize: '12px',
                fontWeight: 600, color: '#2D6A4F', textAlign: 'center',
                textDecoration: 'none', display: 'block' }}>
              {link.label}
            </a>
          ))}
        </div>

        {/* App info */}
        <div style={{ paddingTop: '14px', borderTop: '1px solid #E0E7D8',
          display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ fontSize: '11px', color: '#9A9A9A' }}>VoiceGym v1.0.0</span>
          <span style={{ fontSize: '11px', color: '#9A9A9A' }}>Built with Claude Code ⚡</span>
        </div>
      </div>
    </div>
  )
}
