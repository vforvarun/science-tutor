import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { Download, Upload, Volume2, RotateCcw } from 'lucide-react'
import { useStore } from '../lib/store'
import { englishVoices, speak, configureVoice } from '../lib/speech'
import { Page, PageHeader, Card, Button } from '../components/ui'

function Row({ title, sub, children }: { title: string; sub?: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-center gap-3 border-b border-line py-4 last:border-0">
      <div className="min-w-0 flex-1">
        <div className="font-semibold">{title}</div>
        {sub && <div className="text-sm text-ink-soft">{sub}</div>}
      </div>
      <div>{children}</div>
    </div>
  )
}

function Seg<T extends string | number>({ value, options, onChange }: { value: T; options: [T, string][]; onChange: (v: T) => void }) {
  return (
    <div className="flex rounded-2xl bg-cream p-1">
      {options.map(([v, l]) => (
        <button key={String(v)} onClick={() => onChange(v)} className={`rounded-xl px-3 py-1.5 text-sm font-semibold transition ${value === v ? 'bg-white text-ink shadow' : 'text-ink-soft'}`}>
          {l}
        </button>
      ))}
    </div>
  )
}

export function SettingsPage() {
  const s = useStore()
  const p = s.profile
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>(englishVoices())
  const [msg, setMsg] = useState('')
  const [confirmReset, setConfirmReset] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const load = () => setVoices(englishVoices())
    window.speechSynthesis?.addEventListener?.('voiceschanged', load)
    const t = setTimeout(load, 800)
    return () => {
      window.speechSynthesis?.removeEventListener?.('voiceschanged', load)
      clearTimeout(t)
    }
  }, [])

  const exportData = () => {
    const raw = localStorage.getItem('spark-science-v1') ?? '{}'
    const a = document.createElement('a')
    a.href = URL.createObjectURL(new Blob([raw], { type: 'application/json' }))
    a.download = `science-progress-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    setMsg('Progress file downloaded. On the other device, open Settings and choose “Load progress”.')
  }

  return (
    <Page>
      <PageHeader title="Settings" emoji="⚙️" />
      <div className="grid gap-5 lg:grid-cols-2">
        <Card className="px-5">
          <Row title="Your name">
            <input value={p.name} onChange={(e) => s.setProfile({ name: e.target.value })} className="w-40 rounded-xl border-2 border-line px-3 py-2 font-medium outline-none focus:border-violet" />
          </Row>
          <Row title="Year level" sub="Controls which topics appear in your plan and tests">
            <Seg value={p.level} options={[[9, 'Year 9'], [10, 'Year 10']]} onChange={(v) => s.setProfile({ level: v })} />
          </Row>
          <Row title="Daily XP goal">
            <Seg value={p.dailyGoal} options={[[30, 'Easy'], [60, 'Regular'], [100, 'Serious'], [150, 'Intense']]} onChange={(v) => s.setProfile({ dailyGoal: v })} />
          </Row>
          <Row title="Sound effects">
            <Seg value={p.sound ? 'on' : 'off'} options={[['on', 'On'], ['off', 'Off']]} onChange={(v) => s.setProfile({ sound: v === 'on' })} />
          </Row>
          <Row title="Retake skills check">
            <Link to="/welcome" onClick={() => s.setProfile({ placed: false })} className="rounded-xl bg-cream px-3 py-2 text-sm font-semibold">
              Start
            </Link>
          </Row>
        </Card>

        <Card className="px-5">
          <Row title="Lesson narration" sub="Natural = pre-recorded voice (needs internet the first time)">
            <Seg
              value={p.narration ?? 'recorded'}
              options={[['recorded', 'Natural'], ['device', 'Device voice']]}
              onChange={(v) => {
                s.setProfile({ narration: v })
                configureVoice(p.voiceURI, p.rate, v === 'recorded')
              }}
            />
          </Row>
          <Row title="Device voice" sub={p.narration === 'device' ? 'Used in the animated lessons' : 'Backup voice if a recording can’t load'}>
            <select
              value={p.voiceURI ?? voices[0]?.voiceURI ?? ''}
              onChange={(e) => {
                s.setProfile({ voiceURI: e.target.value })
                configureVoice(e.target.value, p.rate)
                setTimeout(() => speak('Hi! Let’s explore some science together.'), 50)
              }}
              className="max-w-56 rounded-xl border-2 border-line bg-white px-3 py-2 text-sm font-medium"
            >
              {voices.map((v) => (
                <option key={v.voiceURI} value={v.voiceURI}>
                  {v.name} ({v.lang})
                </option>
              ))}
            </select>
          </Row>
          <Row title="Narration speed" sub={`${Math.round(p.rate * 100)}%`}>
            <div className="flex items-center gap-2">
              <input
                type="range"
                min={0.7}
                max={1.3}
                step={0.05}
                value={p.rate}
                onChange={(e) => {
                  s.setProfile({ rate: parseFloat(e.target.value) })
                  configureVoice(p.voiceURI, parseFloat(e.target.value))
                }}
                className="accent-violet"
              />
              <button onClick={() => speak('Energy cannot be created or destroyed.')} className="grid h-10 w-10 place-items-center rounded-full bg-violet-soft text-violet" aria-label="Test voice">
                <Volume2 size={18} />
              </button>
            </div>
          </Row>
          <div className="py-4 text-sm text-ink-soft">
            <b className="text-ink">Tip:</b> on Windows, Microsoft Edge has natural-sounding “Online (Natural)” voices (try an Australian one like Natasha or William). On iPad, download an Enhanced voice under Settings → Accessibility → Spoken Content → Voices.
          </div>
        </Card>

        <Card className="p-5">
          <div className="font-semibold">Move progress between laptop & iPad</div>
          <p className="mt-1 text-sm text-ink-soft">Progress is saved on each device. Download it here and load it on the other device (e.g. via OneDrive, Google Drive or AirDrop).</p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Button variant="secondary" onClick={exportData}>
              <Download size={18} /> Save progress file
            </Button>
            <Button variant="secondary" onClick={() => fileRef.current?.click()}>
              <Upload size={18} /> Load progress
            </Button>
            <input
              ref={fileRef}
              type="file"
              accept="application/json,.json"
              className="hidden"
              onChange={async (e) => {
                const f = e.target.files?.[0]
                if (!f) return
                setMsg(s.importAll(await f.text()) ? 'Progress loaded! ✓' : 'That file doesn’t look like a science progress file.')
              }}
            />
          </div>
          {msg && <div className="mt-3 rounded-xl bg-mint-soft p-3 text-sm font-semibold text-mint-deep">{msg}</div>}
        </Card>

        <Card className="p-5">
          <div className="font-semibold">Install as an app</div>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-ink-soft">
            <li>
              <b className="text-ink">iPad (Safari):</b> Share button → “Add to Home Screen”.
            </li>
            <li>
              <b className="text-ink">Windows (Edge):</b> ⋯ → Apps → Install this site as an app.
            </li>
          </ul>
          <div className="mt-5 font-semibold">Parent PIN</div>
          <p className="text-sm text-ink-soft">{p.pin ? 'A PIN protects the parent dashboard.' : 'Not set — you’ll be asked to create one on the parent dashboard.'}</p>
          {p.pin && (
            <button onClick={() => s.setProfile({ pin: undefined })} className="mt-2 text-sm font-semibold text-coral">
              Remove PIN
            </button>
          )}
          <div className="mt-5 border-t border-line pt-4">
            {!confirmReset ? (
              <button onClick={() => setConfirmReset(true)} className="inline-flex items-center gap-2 text-sm font-semibold text-coral">
                <RotateCcw size={16} /> Reset all progress
              </button>
            ) : (
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-sm font-semibold text-coral">Delete all progress on this device? This can’t be undone.</span>
                <Button variant="danger" className="px-3 py-2 text-sm" onClick={() => (s.resetAll(), setConfirmReset(false))}>
                  Yes, reset
                </Button>
                <Button variant="ghost" className="px-3 py-2 text-sm" onClick={() => setConfirmReset(false)}>
                  Cancel
                </Button>
              </div>
            )}
          </div>
        </Card>
      </div>
    </Page>
  )
}

export function MorePage() {
  const items = [
    { to: '/progress', emoji: '📈', title: 'Progress', hue: 'physics' },
    { to: '/warmup', emoji: '⚡', title: 'Quick-fire', hue: 'warm' },
    { to: '/formulas', emoji: '📒', title: 'Cheat sheet', hue: 'chemistry' },
    { to: '/planner', emoji: '🗓️', title: 'Term planner', hue: 'earth' },
    { to: '/parent', emoji: '👪', title: 'Parent dashboard', hue: 'biology' },
    { to: '/settings', emoji: '⚙️', title: 'Settings', hue: 'skills' },
  ]
  return (
    <Page>
      <PageHeader title="More" emoji="✨" />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {items.map((x) => (
          <Link key={x.to} to={x.to} className="card lift overflow-hidden">
            <div className={`hue-${x.hue} grid h-20 place-items-center text-4xl text-white`}>{x.emoji}</div>
            <div className="p-3 text-center font-semibold">{x.title}</div>
          </Link>
        ))}
      </div>
    </Page>
  )
}
