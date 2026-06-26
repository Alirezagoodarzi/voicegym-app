'use client'
import { useRouter } from 'next/navigation'

export default function PrivacyPage() {
  const router = useRouter()

  return (
    <div style={{ background: '#F5F7F2', minHeight: '100vh',
      maxWidth: '430px', margin: '0 auto', paddingBottom: '40px' }}>

      {/* Header */}
      <div style={{ background: '#2D6A4F', padding: '16px 20px 20px',
        position: 'sticky', top: 0, zIndex: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            onClick={() => router.back()}
            style={{ background: 'rgba(255,255,255,0.15)', border: 'none',
              borderRadius: '10px', width: '36px', height: '36px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', color: '#fff', fontSize: '18px', flexShrink: 0 }}
          >
            ←
          </button>
          <div>
            <div style={{ fontSize: '16px', fontWeight: 700, color: '#fff' }}>
              Privacy Policy
            </div>
            <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.7)',
              marginTop: '1px' }}>
              Last updated: June 23, 2026
            </div>
          </div>
        </div>
      </div>

      <div style={{ padding: '16px' }}>

        {/* Overview */}
        <Section title="Overview">
          VoiceGym is a voice-driven gym workout planner. This privacy policy explains what
          information we collect, how we use it, and how we protect it. We are committed to
          keeping your data minimal, transparent, and under your control.
        </Section>

        {/* Information We Collect */}
        <Section title="Information We Collect">
          <strong style={{ color: '#1A1A1A' }}>We do not collect personal information.</strong>
          {' '}VoiceGym does not require account creation, sign-up, or any form of registration.
          {'\n\n'}The only data the app works with:
          <BulletList items={[
            'Voice commands — spoken input captured locally on your device to parse exercise details. Voice audio is sent to Anthropic\'s Claude API for processing and is not stored permanently by us.',
            'Exercise and workout data — stored locally on your device only.',
            'Optional profile data (age, weight, height) — stored locally on your device only.',
            'Preferences — unit settings stored locally on your device only.',
          ]} />
        </Section>

        {/* How We Use Your Information */}
        <Section title="How We Use Your Information">
          <BulletList items={[
            'Voice commands are used solely to parse exercise details via AI.',
            'Workout and profile data is used solely to display and manage your workouts.',
            'We do not use your data for advertising, profiling, or any purpose beyond operating the app\'s core features.',
          ]} />
        </Section>

        {/* Data Storage */}
        <Section title="Data Storage">
          All app data is stored exclusively in your device&apos;s local storage. It never
          leaves your device except for voice commands sent to Anthropic&apos;s API for processing.
          <BulletList items={[
            'No data is stored on our servers.',
            'No cloud sync in the free tier.',
            'Uninstalling the app removes all locally stored data.',
          ]} />
        </Section>

        {/* Third-Party Services */}
        <Section title="Third-Party Services (Anthropic Claude API)">
          VoiceGym uses the Anthropic Claude API to interpret your voice commands and parse
          them into structured exercise data.
          Voice commands are temporarily transmitted to Anthropic&apos;s Claude API for processing
          into structured exercise data. Audio data is processed in real-time and is not stored
          permanently by us or Anthropic beyond each request.{' '}
          <a href="https://anthropic.com/privacy" target="_blank" rel="noopener noreferrer"
            style={{ color: '#2D6A4F', fontWeight: 600 }}>
            Learn more at anthropic.com/privacy
          </a>
          <BulletList items={[
            'When you use a voice command, the transcribed text is sent to Anthropic\'s servers for processing.',
            'Anthropic\'s data handling is governed by their own Privacy Policy at anthropic.com/privacy.',
            'We do not send any personal profile data (age, weight, height) to Anthropic.',
            'Voice audio is processed on-device by your browser\'s Web Speech API before any text is sent to Anthropic.',
          ]} />
        </Section>

        {/* Voice Data */}
        <Section title="Voice Data">
          <BulletList items={[
            'Voice audio is captured and transcribed entirely on your device using the browser\'s built-in Web Speech API.',
            'Only the resulting text transcript is sent to Anthropic\'s Claude API.',
            'No audio recordings are stored or transmitted by VoiceGym.',
            'Transcripts are processed in real time and not retained after the exercise is parsed.',
          ]} />
        </Section>

        {/* Children's Privacy */}
        <Section title="Children's Privacy">
          VoiceGym is not directed at children under the age of 13. We do not knowingly
          collect any information from children under 13. If you believe a child under 13
          has used the app, please contact us and we will take appropriate steps.
        </Section>

        {/* Changes */}
        <Section title="Changes to This Policy">
          We may update this privacy policy from time to time. When we do, we will update
          the &quot;Last updated&quot; date at the top of this document. Continued use of the app
          after changes constitutes acceptance of the revised policy.
        </Section>

        {/* Contact */}
        <Section title="Contact Us">
          If you have questions or concerns about this privacy policy, please contact us:
          <div style={{ marginTop: '10px', background: '#EEF2E8',
            border: '1.5px solid #E0E7D8', borderRadius: '10px', padding: '12px 14px' }}>
            <div style={{ fontSize: '12px', fontWeight: 600, color: '#2D6A4F' }}>Email</div>
            <div style={{ fontSize: '13px', color: '#1A1A1A', marginTop: '2px' }}>
              privacy@voicegym.app
            </div>
          </div>
        </Section>

        {/* Footer */}
        <div style={{ textAlign: 'center', marginTop: '24px',
          fontSize: '11px', color: '#9A9A9A', lineHeight: '1.6' }}>
          © 2026 Dr. Alireza Goodarzi. All rights reserved.{'\n'}
          VoiceGym v1.0.0
        </div>
      </div>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ background: '#fff', border: '1.5px solid #E0E7D8',
      borderRadius: '14px', padding: '16px', marginBottom: '10px' }}>
      <div style={{ fontSize: '13px', fontWeight: 700, color: '#2D6A4F',
        marginBottom: '8px' }}>
        {title}
      </div>
      <div style={{ fontSize: '12px', color: '#4A4A4A', lineHeight: '1.7' }}>
        {children}
      </div>
    </div>
  )
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul style={{ margin: '8px 0 0', paddingLeft: '16px' }}>
      {items.map((item, i) => (
        <li key={i} style={{ fontSize: '12px', color: '#4A4A4A',
          lineHeight: '1.7', marginBottom: '4px' }}>
          {item}
        </li>
      ))}
    </ul>
  )
}
