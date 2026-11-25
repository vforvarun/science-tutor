// Pre-records the animated-lesson narration with Kokoro (open-source neural TTS, Apache-2.0).
//
//   npm install kokoro-js@1.2.1        (anywhere outside this repo — it's ~400 MB)
//   KOKORO=/path/to/node_modules/kokoro-js/dist/kokoro.js npx tsx scripts/narrate.ts
//
// Writes public/narration/<scene>-<step>-<hash>.m4a and src/data/narration.json.
// Lines whose text hasn't changed are skipped, so editing one lesson only re-records that line.
import { createHash } from 'node:crypto'
import { execFileSync } from 'node:child_process'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { SCENES } from '../src/scenes'
import { narrationText } from './narration-text'

const VOICE = process.env.VOICE ?? 'bf_emma'
const OUT = path.resolve('public/narration')
const MANIFEST = path.resolve('src/data/narration.json')
const KOKORO = process.env.KOKORO
if (!KOKORO) throw new Error('Set KOKORO to the path of kokoro-js/dist/kokoro.js')

const { KokoroTTS } = await import(KOKORO)
const tts = await KokoroTTS.from_pretrained('onnx-community/Kokoro-82M-v1.0-ONNX', { dtype: 'q8', device: 'cpu' })

fs.mkdirSync(OUT, { recursive: true })
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'narrate-'))
const manifest: Record<string, string[]> = {}
const keep = new Set<string>()
const scenes = Object.values(SCENES)
const total = scenes.reduce((a, s) => a + s.steps.length, 0)
let n = 0
let made = 0
const t0 = Date.now()

for (const s of scenes) {
  manifest[s.id] = []
  for (let i = 0; i < s.steps.length; i++) {
    n++
    const say = narrationText(s.steps[i])
    const hash = createHash('sha1').update(VOICE + '|' + say).digest('hex').slice(0, 8)
    const file = `${s.id}-${i}-${hash}.m4a`
    manifest[s.id].push(file)
    keep.add(file)
    if (fs.existsSync(path.join(OUT, file))) continue
    const audio = await tts.generate(say, { voice: VOICE })
    const wav = path.join(tmp, 'line.wav')
    await audio.save(wav)
    // AAC in .m4a plays in Safari (iPad), Edge and Chrome; ~40 kbps mono is plenty for speech
    execFileSync('afconvert', ['-f', 'm4af', '-d', 'aac', '-c', '1', '-b', '40000', wav, path.join(OUT, file)])
    made++
    const eta = ((Date.now() - t0) / made) * (total - n)
    console.log(`[${n}/${total}] ${file}  (~${Math.ceil(eta / 60000)} min left)`)
  }
}

// drop recordings for lines that no longer exist
for (const f of fs.readdirSync(OUT)) if (f.endsWith('.m4a') && !keep.has(f)) fs.unlinkSync(path.join(OUT, f))
fs.writeFileSync(MANIFEST, JSON.stringify({ voice: VOICE, files: manifest }, null, 1) + '\n')
console.log(`Done: ${made} recorded, ${total - made} unchanged. Voice ${VOICE}.`)
