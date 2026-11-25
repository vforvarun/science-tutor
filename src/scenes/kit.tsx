// Building blocks for animated explainer scenes (SVG, 640×360).
import { motion } from 'motion/react'
import type { ReactNode } from 'react'

export const W = 640
export const H = 360

export const C = {
  ink: '#1d1b3a',
  soft: '#5d5a7a',
  line: '#e3def5',
  violet: '#6246ea',
  violetSoft: '#ece8ff',
  coral: '#ff6b6b',
  coralSoft: '#ffe5e5',
  mint: '#2ec4b6',
  mintSoft: '#d9f6f3',
  sun: '#ffbe0b',
  sunSoft: '#fff3cc',
  sky: '#3a86ff',
  skySoft: '#e1ecff',
  pink: '#f15bb5',
}

const ease = { duration: 0.7, ease: [0.3, 0.7, 0.3, 1] as const }

export function Show({ when, children, delay = 0 }: { when: boolean; children: ReactNode; delay?: number }) {
  return (
    <motion.g initial={false} animate={{ opacity: when ? 1 : 0 }} transition={{ duration: 0.5, delay: when ? delay : 0 }} style={{ pointerEvents: when ? 'auto' : 'none' }}>
      {children}
    </motion.g>
  )
}

export function T({ x, y, children, size = 22, color = C.ink, weight = 600, anchor = 'middle', show = true, delay = 0 }: { x: number; y: number; children: ReactNode; size?: number; color?: string; weight?: number; anchor?: 'start' | 'middle' | 'end'; show?: boolean; delay?: number }) {
  return (
    <motion.text initial={false} animate={{ x, y, opacity: show ? 1 : 0 }} transition={{ ...ease, delay: show ? delay : 0 }} fontSize={size} fill={color} fontWeight={weight} textAnchor={anchor} dominantBaseline="middle">
      {children}
    </motion.text>
  )
}

export function Draw({ d, show = true, color = C.violet, width = 4, delay = 0, dash, fill = 'none' }: { d: string; show?: boolean; color?: string; width?: number; delay?: number; dash?: string; fill?: string }) {
  return (
    <motion.path
      d={d}
      fill={fill}
      stroke={color}
      strokeWidth={width}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeDasharray={dash}
      initial={false}
      animate={{ pathLength: show ? 1 : 0, opacity: show ? 1 : 0 }}
      transition={{ duration: 1, delay: show ? delay : 0, ease: 'easeInOut' }}
    />
  )
}

export function Box({ x, y, w, h, fill = C.violetSoft, stroke = C.violet, show = true, r = 6, delay = 0, opacity = 1 }: { x: number; y: number; w: number; h: number; fill?: string; stroke?: string; show?: boolean; r?: number; delay?: number; opacity?: number }) {
  return (
    <motion.rect
      initial={false}
      animate={{ x, y, width: Math.max(0, w), height: Math.max(0, h), opacity: show ? opacity : 0 }}
      transition={{ ...ease, delay: show ? delay : 0 }}
      rx={r}
      fill={fill}
      stroke={stroke}
      strokeWidth={2.5}
    />
  )
}

export function Dot({ x, y, r = 7, color = C.coral, show = true, delay = 0 }: { x: number; y: number; r?: number; color?: string; show?: boolean; delay?: number }) {
  return <motion.circle initial={false} animate={{ cx: x, cy: y, r: show ? r : 0, opacity: show ? 1 : 0 }} transition={{ ...ease, delay: show ? delay : 0 }} fill={color} stroke="white" strokeWidth={2} />
}

export function Line({ x1, y1, x2, y2, color = C.ink, width = 3, show = true, dash, delay = 0 }: { x1: number; y1: number; x2: number; y2: number; color?: string; width?: number; show?: boolean; dash?: string; delay?: number }) {
  return <motion.line initial={false} animate={{ x1, y1, x2, y2, opacity: show ? 1 : 0 }} transition={{ ...ease, delay: show ? delay : 0 }} stroke={color} strokeWidth={width} strokeLinecap="round" strokeDasharray={dash} />
}

export function Poly({ points, fill = C.violetSoft, stroke = C.violet, show = true, width = 3, delay = 0 }: { points: [number, number][]; fill?: string; stroke?: string; show?: boolean; width?: number; delay?: number }) {
  const d = 'M' + points.map((p) => p.join(' ')).join(' L') + ' Z'
  return <motion.path initial={false} animate={{ d, opacity: show ? 1 : 0 }} transition={{ ...ease, delay: show ? delay : 0 }} fill={fill} stroke={stroke} strokeWidth={width} strokeLinejoin="round" />
}

export function Arrow({ x1, y1, x2, y2, color = C.coral, show = true, delay = 0, width = 3 }: { x1: number; y1: number; x2: number; y2: number; color?: string; show?: boolean; delay?: number; width?: number }) {
  const a = Math.atan2(y2 - y1, x2 - x1)
  const h = 10
  const p1 = [x2 - h * Math.cos(a - 0.45), y2 - h * Math.sin(a - 0.45)]
  const p2 = [x2 - h * Math.cos(a + 0.45), y2 - h * Math.sin(a + 0.45)]
  return (
    <Show when={show} delay={delay}>
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={width} strokeLinecap="round" />
      <path d={`M${p1[0]} ${p1[1]} L${x2} ${y2} L${p2[0]} ${p2[1]}`} fill="none" stroke={color} strokeWidth={width} strokeLinecap="round" strokeLinejoin="round" />
    </Show>
  )
}

/** Cartesian plane helper */
export function plane(ox: number, oy: number, unit: number) {
  return {
    px: (x: number) => ox + x * unit,
    py: (y: number) => oy - y * unit,
    unit,
  }
}

export function Axes({ ox, oy, unit, xr = [-6, 6], yr = [-4, 4], labels = true }: { ox: number; oy: number; unit: number; xr?: [number, number]; yr?: [number, number]; labels?: boolean }) {
  const lines: ReactNode[] = []
  for (let x = xr[0]; x <= xr[1]; x++) lines.push(<line key={'gx' + x} x1={ox + x * unit} y1={oy - yr[1] * unit} x2={ox + x * unit} y2={oy - yr[0] * unit} stroke={C.line} strokeWidth={1} />)
  for (let y = yr[0]; y <= yr[1]; y++) lines.push(<line key={'gy' + y} x1={ox + xr[0] * unit} y1={oy - y * unit} x2={ox + xr[1] * unit} y2={oy - y * unit} stroke={C.line} strokeWidth={1} />)
  return (
    <g>
      {lines}
      <line x1={ox + xr[0] * unit} y1={oy} x2={ox + xr[1] * unit} y2={oy} stroke={C.soft} strokeWidth={2} />
      <line x1={ox} y1={oy - yr[1] * unit} x2={ox} y2={oy - yr[0] * unit} stroke={C.soft} strokeWidth={2} />
      {labels && (
        <>
          <text x={ox + xr[1] * unit + 10} y={oy + 5} fontSize={16} fill={C.soft} fontWeight={600}>
            x
          </text>
          <text x={ox + 6} y={oy - yr[1] * unit - 8} fontSize={16} fill={C.soft} fontWeight={600}>
            y
          </text>
          {Array.from({ length: xr[1] - xr[0] + 1 }, (_, i) => xr[0] + i)
            .filter((x) => x !== 0 && x % 2 === 0)
            .map((x) => (
              <text key={'lx' + x} x={ox + x * unit} y={oy + 16} fontSize={11} fill={C.soft} textAnchor="middle">
                {x}
              </text>
            ))}
          {Array.from({ length: yr[1] - yr[0] + 1 }, (_, i) => yr[0] + i)
            .filter((y) => y !== 0 && y % 2 === 0)
            .map((y) => (
              <text key={'ly' + y} x={ox - 8} y={oy - y * unit + 4} fontSize={11} fill={C.soft} textAnchor="end">
                {y}
              </text>
            ))}
        </>
      )}
    </g>
  )
}

/** Build an SVG path for y = f(x) over a range */
export function fnPath(f: (x: number) => number, x0: number, x1: number, px: (x: number) => number, py: (y: number) => number, clip?: [number, number]) {
  const pts: string[] = []
  const steps = 80
  for (let i = 0; i <= steps; i++) {
    const x = x0 + ((x1 - x0) * i) / steps
    let y = f(x)
    if (clip) y = Math.max(clip[0], Math.min(clip[1], y))
    pts.push(`${i === 0 ? 'M' : 'L'}${px(x).toFixed(1)} ${py(y).toFixed(1)}`)
  }
  return pts.join(' ')
}

export function Pill({ x, y, text, color = C.violet, show = true, delay = 0, size = 18 }: { x: number; y: number; text: string; color?: string; show?: boolean; delay?: number; size?: number }) {
  const w = text.length * size * 0.56 + 26
  return (
    <Show when={show} delay={delay}>
      <rect x={x - w / 2} y={y - size} width={w} height={size * 2} rx={size} fill={color} />
      <text x={x} y={y + 1} fontSize={size} fill="white" fontWeight={700} textAnchor="middle" dominantBaseline="middle">
        {text}
      </text>
    </Show>
  )
}

/** An emoji drawn as SVG text. */
export function Emo({ x, y, e, size = 40, show = true, delay = 0 }: { x: number; y: number; e: string; size?: number; show?: boolean; delay?: number }) {
  return (
    <Show when={show} delay={delay}>
      <text x={x} y={y} fontSize={size} textAnchor="middle" dominantBaseline="middle">
        {e}
      </text>
    </Show>
  )
}

/** A dot that travels round and round along a list of points (impulses, current, energy). */
export function Pulse({ pts, show = true, color = C.coral, r = 7, dur = 1.8, delay = 0 }: { pts: [number, number][]; show?: boolean; color?: string; r?: number; dur?: number; delay?: number }) {
  return (
    <Show when={show}>
      <motion.circle r={r} fill={color} stroke="white" strokeWidth={2} initial={{ cx: pts[0][0], cy: pts[0][1] }} animate={show ? { cx: pts.map((p) => p[0]), cy: pts.map((p) => p[1]) } : {}} transition={{ duration: dur, repeat: Infinity, ease: 'linear', delay }} />
    </Show>
  )
}

/** Children spin around (cx, cy). An invisible ring of radius r keeps the rotation centred. */
export function Orbit({ cx, cy, r, dur = 8, children, reverse = false }: { cx: number; cy: number; r: number; dur?: number; children: ReactNode; reverse?: boolean }) {
  return (
    <motion.g animate={{ rotate: reverse ? -360 : 360 }} transition={{ duration: dur, repeat: Infinity, ease: 'linear' }}>
      <circle cx={cx} cy={cy} r={r + 8} fill="none" stroke="none" />
      {children}
    </motion.g>
  )
}
