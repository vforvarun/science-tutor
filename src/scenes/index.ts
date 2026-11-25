import type { ComponentType } from 'react'
import { nervous, hormones, immunity, ecosystems, dna, inheritance, evolution } from './bio'
import { atoms, radioactivity, reactions, acids, periodic, bonding, rates } from './chem'
import { heat, waves, electricity, motionScene, forces, energy } from './phys'
import { tectonics, universe, climate, inquiry, data } from './earth'

export interface SceneDef {
  id: string
  title: string
  steps: string[] // narration for each step (may contain $maths$)
  Comp: ComponentType<{ step: number }>
}

export const SCENES: Record<string, SceneDef> = Object.fromEntries(
  [nervous, hormones, immunity, ecosystems, dna, inheritance, evolution, atoms, radioactivity, reactions, acids, periodic, bonding, rates, heat, waves, electricity, motionScene, forces, energy, tectonics, universe, climate, inquiry, data].map((s) => [s.id, s]),
)
