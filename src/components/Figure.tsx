import type { Fig } from '../lib/problem'

const C = { ink: '#1d1b3a', soft: '#5d5a7a', line: '#e3def5', violet: '#6246ea', coral: '#ff6b6b', mint: '#2ec4b6', sun: '#ffbe0b', sky: '#3a86ff', green: '#12a15a' }

export function Figure({ fig }: { fig: Fig }) {
  switch (fig.type) {
    case 'plot':
      return <Plot fig={fig} />
    case 'circuit':
      return <Circuit fig={fig} />
    case 'punnett':
      return <Punnett fig={fig} />
    case 'atom':
      return <Atom fig={fig} />
    case 'wave':
      return <Wave fig={fig} />
  }
}

function Plot({ fig }: { fig: Extract<Fig, { type: 'plot' }> }) {
  const [x0, y0, w, h] = [52, 20, 260, 190]
  const px = (x: number) => x0 + (x / fig.xMax) * w
  const py = (y: number) => y0 + h - (y / fig.yMax) * h
  const xs = fig.xStep ?? fig.xMax / 5
  const ys = fig.yStep ?? fig.yMax / 5
  const ticks = (max: number, step: number) => Array.from({ length: Math.round(max / step) + 1 }, (_, i) => +(i * step).toFixed(6))
  const cols = [C.violet, C.coral, C.mint, C.sun]
  return (
    <svg viewBox="0 0 330 260" className="mx-auto h-auto w-full max-w-sm">
      {ticks(fig.xMax, xs).map((t) => (
        <g key={'x' + t}>
          <line x1={px(t)} y1={y0} x2={px(t)} y2={y0 + h} stroke={C.line} />
          <text x={px(t)} y={y0 + h + 14} fontSize={10} fill={C.soft} textAnchor="middle">
            {t}
          </text>
        </g>
      ))}
      {ticks(fig.yMax, ys).map((t) => (
        <g key={'y' + t}>
          <line x1={x0} y1={py(t)} x2={x0 + w} y2={py(t)} stroke={C.line} />
          <text x={x0 - 5} y={py(t) + 3} fontSize={10} fill={C.soft} textAnchor="end">
            {t}
          </text>
        </g>
      ))}
      <line x1={x0} y1={y0 + h} x2={x0 + w} y2={y0 + h} stroke={C.soft} strokeWidth={2} />
      <line x1={x0} y1={y0} x2={x0} y2={y0 + h} stroke={C.soft} strokeWidth={2} />
      {fig.series.map((s, i) => (
        <g key={i}>
          <path d={s.pts.map(([x, y], j) => `${j ? 'L' : 'M'}${px(x).toFixed(1)} ${py(y).toFixed(1)}`).join(' ')} fill="none" stroke={s.color ?? cols[i % 4]} strokeWidth={3.5} strokeLinejoin="round" strokeLinecap="round" />
          {fig.dots && s.pts.map(([x, y], j) => <circle key={j} cx={px(x)} cy={py(y)} r={4} fill={s.color ?? cols[i % 4]} stroke="white" strokeWidth={1.5} />)}
          {s.label && (
            <text x={px(s.pts[s.pts.length - 1][0]) - 4} y={py(s.pts[s.pts.length - 1][1]) - 8} fontSize={12} fontWeight={700} fill={s.color ?? cols[i % 4]} textAnchor="end">
              {s.label}
            </text>
          )}
        </g>
      ))}
      <text x={x0 + w / 2} y={252} fontSize={12} fill={C.soft} textAnchor="middle" fontWeight={600}>
        {fig.xLabel}
      </text>
      <text x={14} y={y0 + h / 2} fontSize={12} fill={C.soft} textAnchor="middle" fontWeight={600} transform={`rotate(-90 14 ${y0 + h / 2})`}>
        {fig.yLabel}
      </text>
    </svg>
  )
}

function Resistor({ x, y, label, vertical = false }: { x: number; y: number; label: string; vertical?: boolean }) {
  return vertical ? (
    <g>
      <rect x={x - 11} y={y - 24} width={22} height={48} rx={3} fill="#fff7e0" stroke={C.ink} strokeWidth={2.5} />
      <text x={x + 18} y={y + 5} fontSize={14} fontWeight={700} fill={C.ink}>
        {label}
      </text>
    </g>
  ) : (
    <g>
      <rect x={x - 24} y={y - 11} width={48} height={22} rx={3} fill="#fff7e0" stroke={C.ink} strokeWidth={2.5} />
      <text x={x} y={y - 18} fontSize={14} fontWeight={700} fill={C.ink} textAnchor="middle">
        {label}
      </text>
    </g>
  )
}

function Circuit({ fig }: { fig: Extract<Fig, { type: 'circuit' }> }) {
  const [l, r, t, b] = [40, 290, 50, 200]
  const n = fig.resistors.length
  const cc = fig.kind === 'series' ? 165 : 78 // cell centre
  const px = (i: number) => 130 + (i * 140) / Math.max(1, n - 1)
  return (
    <svg viewBox="0 0 330 240" className="mx-auto h-auto w-full max-w-sm">
      {/* wires: series is one loop; parallel has the outer loop end at the last branch */}
      <path d={fig.kind === 'series' ? `M${l} ${t} L${r} ${t} L${r} ${b} L${l} ${b} Z` : `M${px(n - 1)} ${t} L${l} ${t} L${l} ${b} L${px(n - 1)} ${b}`} fill="none" stroke={C.ink} strokeWidth={2.5} />
      {/* cell on the bottom wire (left of the branches in parallel) */}
      <rect x={cc - 15} y={b - 16} width={30} height={32} fill="white" />
      <line x1={cc - 8} y1={b - 16} x2={cc - 8} y2={b + 16} stroke={C.ink} strokeWidth={3} />
      <line x1={cc + 6} y1={b - 8} x2={cc + 6} y2={b + 8} stroke={C.ink} strokeWidth={6} />
      <text x={cc} y={b + 34} fontSize={14} fontWeight={700} fill={C.coral} textAnchor="middle">
        {fig.cell}
      </text>
      {fig.ammeter && (
        <g>
          <circle cx={l} cy={(t + b) / 2} r={14} fill="white" stroke={C.ink} strokeWidth={2.5} />
          <text x={l} y={(t + b) / 2 + 5} fontSize={14} fontWeight={800} fill={C.sky} textAnchor="middle">
            A
          </text>
        </g>
      )}
      {fig.kind === 'series' ? (
        fig.resistors.map((lab, i) => <Resistor key={i} x={l + ((r - l) * (i + 1)) / (n + 1)} y={t} label={lab} />)
      ) : (
        <g>
          {fig.resistors.map((lab, i) => (
            <g key={i}>
              <line x1={px(i)} y1={t} x2={px(i)} y2={b} stroke={C.ink} strokeWidth={2.5} />
              {i < n - 1 && <circle cx={px(i)} cy={t} r={4} fill={C.ink} />}
              {i < n - 1 && <circle cx={px(i)} cy={b} r={4} fill={C.ink} />}
              <Resistor x={px(i)} y={(t + b) / 2 - 10} label={lab} vertical />
            </g>
          ))}
        </g>
      )}
    </svg>
  )
}

function Punnett({ fig }: { fig: Extract<Fig, { type: 'punnett' }> }) {
  const s = 70
  const [x0, y0] = [110, 50]
  const cells = fig.cells ?? [fig.side[0] + fig.top[0], fig.side[0] + fig.top[1], fig.side[1] + fig.top[0], fig.side[1] + fig.top[1]].map((g) => (g[0] === g[0].toLowerCase() && g[1] !== g[1].toLowerCase() ? g[1] + g[0] : g))
  return (
    <svg viewBox="0 0 330 210" className="mx-auto h-auto w-full max-w-xs">
      {fig.top.map((a, i) => (
        <text key={'t' + i} x={x0 + s * i + s / 2} y={y0 - 14} fontSize={24} fontWeight={800} fill={C.sky} textAnchor="middle" fontStyle="italic">
          {a}
        </text>
      ))}
      {fig.side.map((a, i) => (
        <text key={'s' + i} x={x0 - 20} y={y0 + s * i + s / 2 + 8} fontSize={24} fontWeight={800} fill={C.coral} textAnchor="middle" fontStyle="italic">
          {a}
        </text>
      ))}
      {cells.map((c, i) => (
        <g key={i}>
          <rect x={x0 + s * (i % 2)} y={y0 + s * Math.floor(i / 2)} width={s} height={s} fill={c === '?' ? '#fff3cc' : '#ece8ff'} stroke={C.violet} strokeWidth={2.5} />
          <text x={x0 + s * (i % 2) + s / 2} y={y0 + s * Math.floor(i / 2) + s / 2 + 8} fontSize={22} fontWeight={700} fill={C.ink} textAnchor="middle" fontStyle="italic">
            {c}
          </text>
        </g>
      ))}
    </svg>
  )
}

function Atom({ fig }: { fig: Extract<Fig, { type: 'atom' }> }) {
  const [cx, cy] = [165, 120]
  return (
    <svg viewBox="0 0 330 240" className="mx-auto h-auto w-full max-w-xs">
      {fig.shells.map((e, i) => {
        const r = 46 + i * 30
        return (
          <g key={i}>
            <circle cx={cx} cy={cy} r={r} fill="none" stroke={C.line} strokeWidth={2.5} />
            {Array.from({ length: e }, (_, k) => {
              const a = (k / e) * Math.PI * 2 - Math.PI / 2 + i * 0.3
              return <circle key={k} cx={cx + r * Math.cos(a)} cy={cy + r * Math.sin(a)} r={6} fill={C.sky} stroke="white" strokeWidth={1.5} />
            })}
          </g>
        )
      })}
      <circle cx={cx} cy={cy} r={30} fill="#ffe5e5" stroke={C.coral} strokeWidth={2.5} />
      <text x={cx} y={cy - 2} fontSize={13} fontWeight={700} fill={C.coral} textAnchor="middle">
        {fig.p}p
      </text>
      <text x={cx} y={cy + 14} fontSize={13} fontWeight={700} fill={C.soft} textAnchor="middle">
        {fig.n}n
      </text>
      <text x={20} y={30} fontSize={22} fontWeight={800} fill={C.ink}>
        {fig.symbol}
      </text>
    </svg>
  )
}

function Wave({ fig }: { fig: Extract<Fig, { type: 'wave' }> }) {
  const cyc = fig.cycles ?? 2.5
  const [x0, w, mid, A] = [30, 270, 110, 55]
  const pts = Array.from({ length: 241 }, (_, i) => {
    const x = (i / 240) * w
    return `${i ? 'L' : 'M'}${(x0 + x).toFixed(1)} ${(mid - A * Math.sin((x / w) * cyc * 2 * Math.PI)).toFixed(1)}`
  }).join(' ')
  const lam = w / cyc
  const crest1 = x0 + lam / 4
  return (
    <svg viewBox="0 0 330 220" className="mx-auto h-auto w-full max-w-sm">
      <line x1={x0} y1={mid} x2={x0 + w} y2={mid} stroke={C.line} strokeWidth={2} strokeDasharray="6 5" />
      <path d={pts} fill="none" stroke={C.violet} strokeWidth={3.5} />
      {fig.wavelength && (
        <g>
          <line x1={crest1} y1={mid - A - 16} x2={crest1 + lam} y2={mid - A - 16} stroke={C.coral} strokeWidth={2} />
          <line x1={crest1} y1={mid - A - 22} x2={crest1} y2={mid - A - 10} stroke={C.coral} strokeWidth={2} />
          <line x1={crest1 + lam} y1={mid - A - 22} x2={crest1 + lam} y2={mid - A - 10} stroke={C.coral} strokeWidth={2} />
          <text x={crest1 + lam / 2} y={mid - A - 24} fontSize={14} fontWeight={700} fill={C.coral} textAnchor="middle">
            {fig.wavelength}
          </text>
        </g>
      )}
      {fig.amplitude && (
        <g>
          <line x1={crest1} y1={mid} x2={crest1} y2={mid - A} stroke={C.mint} strokeWidth={2.5} />
          <text x={crest1 + 8} y={mid - A / 2 + 4} fontSize={14} fontWeight={700} fill={C.mint}>
            {fig.amplitude}
          </text>
        </g>
      )}
    </svg>
  )
}
