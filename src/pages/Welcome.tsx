import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'motion/react'
import { useStore } from '../lib/store'
import { TOPICS, topicById } from '../data/topics'
import { pick } from '../lib/num'
import { ProblemRunner, type Result } from '../components/ProblemRunner'
import { Button, Page } from '../components/ui'

const CHECK = ['nervous', 'immunity', 'ecosystems', 'atoms', 'reactions', 'acids', 'heat', 'waves', 'electricity', 'inquiry']

export function Welcome() {
  const [step, setStep] = useState<'hello' | 'check' | 'result'>('hello')
  const [name, setName] = useState('')
  const [level, setLevel] = useState<9 | 10>(9)
  const [res, setRes] = useState<Result[]>([])
  const { setProfile } = useStore()
  const nav = useNavigate()
  const items = useMemo(() => CHECK.map((id) => ({ topic: id, gen: pick(topicById(id)!.gens) })), [])

  if (step === 'check') {
    return (
      <Page>
        <div className="mb-4 text-center">
          <h1 className="text-2xl font-bold">Quick skills check</h1>
          <p className="font-medium text-ink-soft">10 questions · it’s fine to skip what you haven’t learned yet — just make your best guess</p>
        </div>
        <ProblemRunner
          count={items.length}
          make={(i) => ({ p: items[i].gen(1), topic: items[i].topic, diff: 1 })}
          mode="test"
          title="Skills check"
          onExit={() => {
            setProfile({ name: name.trim(), level, placed: true })
            nav('/')
          }}
          onFinish={(r) => {
            setRes(r)
            setProfile({ name: name.trim(), level })
            setStep('result')
          }}
        />
      </Page>
    )
  }

  if (step === 'result') {
    const right = res.filter((r) => r.ok).length
    const strong = res.filter((r) => r.ok).map((r) => topicById(r.item.topic!)!.title)
    const weak = res.filter((r) => !r.ok).map((r) => topicById(r.item.topic!)!.title)
    return (
      <Page>
        <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="card mx-auto max-w-lg p-8">
          <div className="text-center text-6xl">🎯</div>
          <h1 className="mt-3 text-center text-3xl font-bold">You got {right} out of 10</h1>
          {strong.length > 0 && (
            <div className="mt-5">
              <div className="font-semibold text-mint-deep">Strong already 💪</div>
              <div className="mt-1 flex flex-wrap gap-1.5">
                {strong.map((t) => (
                  <span key={t} className="rounded-full bg-mint-soft px-2.5 py-1 text-sm font-medium">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          )}
          {weak.length > 0 && (
            <div className="mt-4">
              <div className="font-semibold text-violet">We’ll work on these together 🌱</div>
              <div className="mt-1 flex flex-wrap gap-1.5">
                {weak.map((t) => (
                  <span key={t} className="rounded-full bg-violet-soft px-2.5 py-1 text-sm font-medium">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          )}
          <p className="mt-5 text-center font-medium text-ink-soft">Your daily plan will guide you through the topics, starting with the lessons.</p>
          <Button
            className="mt-6 w-full"
            onClick={() => {
              setProfile({ placed: true })
              nav('/')
            }}
          >
            Let’s go! 🚀
          </Button>
        </motion.div>
      </Page>
    )
  }

  return (
    <div className="relative min-h-dvh overflow-hidden bg-gradient-to-br from-[#0fa37f] via-[#1f8fb8] to-violet text-white">
      <div className="pointer-events-none absolute inset-0">
        {['⚛', 'H₂O', 'DNA', 'CO₂', 'E=mc²', '⚡', 'pH', 'F=ma', '🧬', 'V=IR', '☀', '🔬'].map((s, i) => (
          <motion.span key={i} className="absolute font-display text-5xl font-bold opacity-15" style={{ left: `${(i * 37) % 92}%`, top: `${(i * 53) % 88}%` }} animate={{ y: [0, -16, 0], rotate: [0, 8, 0] }} transition={{ duration: 4 + (i % 3), repeat: Infinity, delay: i * 0.3 }}>
            {s}
          </motion.span>
        ))}
      </div>
      <div className="relative mx-auto flex min-h-dvh max-w-lg flex-col justify-center px-6 py-10">
        <motion.img initial={{ scale: 0.6, rotate: -10 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: 'spring' }} src={`${import.meta.env.BASE_URL}icon.svg`} className="h-24 w-24 rounded-3xl shadow-2xl" alt="" />
        <motion.h1 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="mt-6 text-5xl font-bold">
          Welcome to Spark!
        </motion.h1>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="mt-3 text-lg font-medium text-white/85">
          Science explained simply — with animations, real-life examples and practice that adapts to you. A little every day goes a long way.
        </motion.p>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }} className="mt-8 rounded-3xl bg-white p-5 text-ink shadow-2xl">
          <label className="text-sm font-semibold text-ink-soft">What’s your name?</label>
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your first name" className="mt-2 w-full rounded-2xl border-2 border-line bg-cream/60 px-4 py-3 text-lg font-semibold outline-none focus:border-violet" />
          <div className="mt-4 text-sm font-semibold text-ink-soft">Which year are you in?</div>
          <div className="mt-2 grid grid-cols-2 gap-2">
            {([9, 10] as const).map((l) => (
              <button key={l} onClick={() => setLevel(l)} className={`rounded-2xl border-2 py-3 font-semibold transition ${level === l ? 'border-violet bg-violet text-white' : 'border-line'}`}>
                Year {l}
              </button>
            ))}
          </div>
          <Button className="mt-5 w-full" onClick={() => setStep('check')}>
            Start a quick skills check (5 min)
          </Button>
          <button
            className="mt-3 w-full text-sm font-medium text-ink-soft hover:text-ink"
            onClick={() => {
              setProfile({ name: name.trim(), level, placed: true })
              nav('/')
            }}
          >
            Skip for now
          </button>
        </motion.div>
        <div className="mt-6 text-center text-sm text-white/70">{TOPICS.length} topics · animated lessons · endless practice</div>
      </div>
    </div>
  )
}
