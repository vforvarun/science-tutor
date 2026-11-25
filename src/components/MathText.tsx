import { memo } from 'react'
import katex from 'katex'
import 'katex/contrib/mhchem'

const cache = new Map<string, string>()
function render(tex: string, display: boolean) {
  const key = (display ? 'D' : 'I') + tex
  let html = cache.get(key)
  if (!html) {
    html = katex.renderToString(tex, { displayMode: display, throwOnError: false, strict: false })
    cache.set(key, html)
  }
  return html
}

export const TeX = memo(function TeX({ tex, display = false, className = '' }: { tex: string; display?: boolean; className?: string }) {
  return <span className={className} dangerouslySetInnerHTML={{ __html: render(tex, display) }} />
})

/** Renders text with $inline$, $$display$$ maths and **bold**. */
export const MathText = memo(function MathText({ text, className = '' }: { text: string; className?: string }) {
  // "\$" is a literal dollar sign (money), both in plain text and inside maths
  const parts = text.replaceAll('\\$', '\u0001').split(/(\$\$[^$]+\$\$|\$[^$]+\$|\*\*[^*]+\*\*)/g)
  const math = (t: string) => t.replaceAll('\u0001', '\\$')
  const plain = (t: string) => t.replaceAll('\u0001', '$')
  return (
    <span className={className}>
      {parts.map((p, i) => {
        if (p.startsWith('$$')) return <TeX key={i} tex={math(p.slice(2, -2))} display />
        if (p.startsWith('$')) return <TeX key={i} tex={math(p.slice(1, -1))} />
        if (p.startsWith('**')) return <strong key={i}>{plain(p.slice(2, -2))}</strong>
        return <span key={i}>{plain(p)}</span>
      })}
    </span>
  )
})
