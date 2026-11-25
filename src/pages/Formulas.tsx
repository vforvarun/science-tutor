import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Printer } from 'lucide-react'
import { TOPICS, STRANDS, type Strand } from '../data/topics'
import { useStore } from '../lib/store'
import { Page, PageHeader, Card, Button } from '../components/ui'
import { TeX } from '../components/MathText'

export function FormulasPage() {
  const level = useStore((s) => s.profile.level)
  const [all, setAll] = useState(false)
  const strands = Object.keys(STRANDS) as Strand[]
  return (
    <Page>
      <PageHeader
        title="Cheat sheet"
        subtitle="Every key formula and term in one place — tap a topic to revise it"
        emoji="📒"
        right={
          <Button variant="secondary" className="no-print" onClick={() => window.print()}>
            <Printer size={18} /> Print
          </Button>
        }
      />
      <label className="no-print mb-4 inline-flex items-center gap-2 text-sm font-medium text-ink-soft">
        <input type="checkbox" checked={all} onChange={(e) => setAll(e.target.checked)} className="accent-violet" /> Include Year 10 topics
      </label>
      <div className="columns-1 gap-4 md:columns-2">
        {strands.map((st) => {
          const list = TOPICS.filter((t) => t.strand === st && (all || t.level <= level))
          if (!list.length) return null
          return (
            <Card key={st} className="mb-4 break-inside-avoid overflow-hidden">
              <div className={`hue-${st} px-5 py-3 font-display text-lg font-bold text-white`}>
                {STRANDS[st].emoji} {STRANDS[st].name}
              </div>
              <div className="divide-y divide-line">
                {list.map((t) => (
                  <div key={t.id} className="px-5 py-3">
                    <Link to={`/topic/${t.id}`} className="text-sm font-semibold text-violet hover:underline">
                      {t.emoji} {t.title}
                    </Link>
                    {t.formulas.length > 0 && (
                      <div className="mt-2 space-y-1.5">
                        {t.formulas.map((f) => (
                          <div key={f} className="overflow-x-auto">
                            <TeX tex={f} />
                          </div>
                        ))}
                      </div>
                    )}
                    <ul className="mt-2 space-y-0.5 text-sm">
                      {t.terms.map(([term, def]) => (
                        <li key={term}>
                          <b>{term}:</b> <span className="text-ink-soft">{def}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </Card>
          )
        })}
      </div>
    </Page>
  )
}
