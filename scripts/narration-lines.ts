// Prints every animated-lesson narration line as JSON: [{ id, i, t, say }]
// `t` is the on-screen caption; `say` is the plain-words version sent to the voice.
import { SCENES } from '../src/scenes'
import { narrationText } from './narration-text'

const out = Object.values(SCENES).flatMap((s) => s.steps.map((t, i) => ({ id: s.id, i, t, say: narrationText(t) })))
if (process.argv.includes('--text')) for (const l of out) console.log(`${l.id}#${l.i}: ${l.say}`)
else console.log(JSON.stringify(out))
