// Turns lesson narration (with $maths$) into plain words for a neural voice.

const DIGITS = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine']
const FRACS: Record<string, string> = { '12': 'a half', '13': 'a third', '14': 'a quarter', '34': 'three quarters', '43': 'four thirds', '23': 'two thirds' }

function frac(n: string, d: string) {
  return FRACS[n + d] ?? `${n} over ${d}`
}

/** Words for one maths expression (the inside of $...$). */
export function mathWords(m: string): string {
  let s = m
    .replace(/\\left|\\right/g, '')
    // letters first, on the raw notation (never touching \commands):
    // ab → a b, Prn → P r n, 2bc → 2 b c, and the letter a is "ay" (not the article)
    .replace(/(?<![\\a-zA-Z])([a-zA-Z]{2,})(?![a-zA-Z])/g, (w) => w.split('').join(' '))
    .replace(/(\d)([a-zA-Z])/g, '$1 $2')
    .replace(/(?<![\\a-zA-Z])[aA](?![a-zA-Z])/g, ' ay ')
    .replace(/\\frac\{([^}]*)\}\{([^}]*)\}/g, (_, n, d) => ` ${frac(n.trim(), d.trim())} `)
    .replace(/\\frac(\d)(\d)/g, (_, n, d) => ` ${frac(n, d)} `)
    .replace(/\\sqrt\{([^}]*)\}/g, ' the square root of $1 ')
    .replace(/\bP\(([A-Z |]+)\)/g, ' P of $1 ')
    .replace(/\|/g, ' given ')
    .replace(/([a-zA-Z])\s*\(/g, '$1 times (')
    .replace(/\)\^2/g, '), all squared')
    .replace(/\)\^3/g, '), all cubed')
    .replace(/\)\^\{?(\w)\}?/g, '), all to the power of $1')
    .replace(/\)\s*\(/g, ') times (')
    .replace(/(\d)\s*\(/g, '$1 times (')
    .replace(/\^\{-(\d+)\}/g, ' to the power of negative $1 ')
    .replace(/\^2/g, ' squared ')
    .replace(/\^3/g, ' cubed ')
    .replace(/\^\{?([0-9a-z]+)\}?/g, ' to the power of $1 ')
    .replace(/(^|[=<>(,]\s*|\\le\s*|\\ge\s*)-\s*/g, '$1 negative ')
    .replace(/\\times/g, ' times ')
    .replace(/\\div/g, ' divided by ')
    .replace(/\\approx/g, ' is about ')
    .replace(/\\le/g, ' is less than or equal to ')
    .replace(/\\ge/g, ' is greater than or equal to ')
    .replace(/</g, ' is less than ')
    .replace(/>/g, ' is greater than ')
    .replace(/\\pi/g, ' pi ')
    .replace(/\\theta/g, ' theta ')
    .replace(/\\sin/g, ' sine ')
    .replace(/\\cos/g, ' coz ')
    .replace(/\\tan/g, ' tan ')
    .replace(/°/g, ' degrees ')
    .replace(/=/g, ' equals ')
    .replace(/\+/g, ' plus ')
    .replace(/[-−]/g, ' minus ')
    .replace(/\(/g, ' ')
    .replace(/\)/g, ', ')
    .replace(/\\[a-zA-Z]+/g, ' ')
    .replace(/[{}]/g, ' ')
  s = s.replace(/\s+,/g, ',').replace(/,\s*,/g, ',').replace(/\s+/g, ' ').trim()
  return s.replace(/,$/, '')
}

/** Whole narration line → speakable text. */
export function narrationText(t: string): string {
  let s = t.replaceAll('\\$', '\u0001')
  s = s.replace(/\$\$?([^$]+)\$\$?/g, (_, m) => ' ' + mathWords(m) + ' ')
  s = s
    .replace(/\u0001\s*(\d(?:[\d,]*\d)?(?:\.\d+)?)/g, '$1 dollars')
    .replace(/\u0001/g, ' dollars ')
    .replace(/\*\*/g, '')
    .replace(/θ/g, 'theta')
    .replace(/\b(side|letter) a\b/g, '$1 ay')
    .replace(/\b([Bb]ase) A\b/g, '$1 ay')
    .replace(/\s+/g, ' ')
    .replace(/−(\d)/g, 'negative $1')
    // bearings like 045° → zero four five degrees
    .replace(/\b0(\d)(\d)°/g, (_, a, b) => `zero ${DIGITS[+a]} ${DIGITS[+b]} degrees`)
    .replace(/°/g, ' degrees')
    .replace(/\bP\(([^)]*)\)/g, (_, x) => `P of ${x.length <= 3 && x === x.toUpperCase() ? x.split('').join(' ') : x}`)
    .replace(/\bQ(\d)\b/g, 'Q $1')
    .replace(/ \| /g, ' given ')
    .replace(/\bIQR\b/g, 'I Q R')
    .replace(/(\d) m\b/g, '$1 metres')
    .replace(/(\d) cm\b/g, '$1 centimetres')
    .replace(/(\d)%/g, '$1 percent')
    .replace(/÷/g, ' divided by ')
    .replace(/×/g, ' times ')
    .replace(/≈/g, ' is about ')
    .replace(/¼/g, ' a quarter ')
    .replace(/½/g, ' a half ')
    .replace(/ = /g, ' equals ')
    .replace(/ [−-] /g, ' minus ')
    .replace(/ \+ /g, ' plus ')
  return s.replace(/\s+([,.?!:])/g, '$1').replace(/\s+/g, ' ').trim()
}
