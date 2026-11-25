import { bank, mcq, num, type Gen, type Fig } from '../lib/problem'
import { pick, round, tx } from '../lib/num'
import * as K from '../gens/calc'
import type { TopicDef } from './topics'

/** Gas-volume curves for two versions of a reaction. */
const rateGraph: Gen = (d) => {
  const vmax = pick([40, 50, 60, 80])
  const [kA, kB] = [pick([0.12, 0.15, 0.2]), pick([0.05, 0.06, 0.07])]
  const curve = (k: number, v = vmax): [number, number][] => Array.from({ length: 31 }, (_, i) => [i * 2, round(v * (1 - Math.exp(-k * i * 2)), 2)])
  const why = pick([
    ['powdered marble', 'marble chips', 'Powder has a larger surface area, so there are more collisions per second.'],
    ['warm acid', 'cold acid', 'Particles move faster at a higher temperature, so they collide more often and with more energy.'],
    ['concentrated acid', 'dilute acid', 'More acid particles in the same volume means more frequent collisions.'],
    ['a catalyst', 'no catalyst', 'A catalyst lowers the activation energy, so more collisions succeed.'],
  ])
  const fig: Fig = { type: 'plot', series: [{ pts: curve(kA), label: 'A' }, { pts: curve(kB), label: 'B' }], xLabel: 'time (s)', yLabel: 'gas (cm³)', xMax: 60, yMax: vmax + 10, xStep: 10, yStep: 10 }
  if (d === 1 || Math.random() < 0.35) return mcq(`Two reactions were run, one with **${why[0]}** and one with **${why[1]}**. Which line shows the reaction with ${why[0]}?`, 'A — it is steeper at the start', ['B — it is less steep', 'A — it ends higher', 'You can’t tell from the graph'], ['The steeper the line, the faster the reaction.', why[2]], undefined, fig)
  if (d === 2) return mcq('Why do both reactions end with the same volume of gas?', 'The same amount of reactant was used, so the same amount of product forms', ['Reaction B caught up because it was faster', 'The syringe was full', 'The catalyst was used up'], ['Changing the rate doesn’t change how much product you get — only how fast.', why[2]], undefined, fig)
  const T = pick([10, 20, 25])
  const V = round(vmax * (1 - Math.exp(-kA * T)), 0)
  return num(`In reaction A, ${V} cm³ of gas was collected in the first ${T} s. What was the average rate of reaction in cm³/s? (1 decimal place)`, round(V / T, 1), [`$\\text{rate} = \\dfrac{\\text{volume of gas}}{\\text{time}} = \\dfrac{${V}}{${T}} \\approx ${tx(round(V / T, 1), 1)}$ cm³/s`], { unit: 'cm³/s', tol: 0.06, fig })
}

export const CHEMISTRY: TopicDef[] = [
  {
    id: 'atoms', title: 'Atoms & isotopes', strand: 'chemistry', level: 9, emoji: '⚛️', scene: 'atoms',
    summary: 'What atoms are made of, and how to count their particles.',
    analogy: { emoji: '🏟️', title: 'A pea in a stadium', text: 'If an atom were the size of a football stadium, its nucleus would be a pea on the centre spot — yet the pea holds almost all the mass. The electrons whizz around the stands, and everything else is empty space.' },
    lesson: `
Everything is made of **atoms**. Each atom has:

- a tiny, dense **nucleus** containing **protons** (charge +1) and **neutrons** (no charge)
- **electrons** (charge −1, almost no mass) arranged in **shells** around the nucleus

The **atomic number** ($Z$) is the number of protons — it decides which element the atom is.

The **mass number** ($A$) is the number of protons + neutrons.

$$^{23}_{11}\\text{Na}: \\quad 11 \\text{ protons}, \\ 23 - 11 = 12 \\text{ neutrons}, \\ 11 \\text{ electrons}$$

A neutral atom has **equal numbers of protons and electrons**, so the charges cancel.

**Electron shells** fill in order: 2 in the first shell, then 8, then 8. Sodium (11 electrons) is **2, 8, 1**.

**Isotopes** are atoms of the same element with **different numbers of neutrons** — same atomic number, different mass number. Carbon-12 and carbon-14 both have 6 protons, but 6 and 8 neutrons.

> Neutrons = mass number − atomic number.

! Ions form when atoms gain or lose **electrons** — the number of protons never changes.`,
    examples: [
      { q: 'How many protons, neutrons and electrons are in $^{35}_{17}\\text{Cl}$?', steps: ['Protons = atomic number = 17.', 'Neutrons = 35 − 17 = 18.', 'Electrons = protons = 17 (neutral atom).'] },
      { q: 'What is the electron configuration of magnesium (12 electrons)?', steps: ['Fill the shells 2, then 8, then the rest.', '2, 8, 2'] },
    ],
    mistakes: ['Saying the mass number is the number of neutrons', 'Thinking isotopes have different numbers of protons', 'Putting more than 2 electrons in the first shell'],
    formulas: ['\\text{neutrons} = A - Z'],
    terms: [
      ['Proton', 'A positive particle in the nucleus'],
      ['Neutron', 'A particle with no charge in the nucleus'],
      ['Electron', 'A tiny negative particle in a shell around the nucleus'],
      ['Nucleus', 'The dense centre of an atom, containing protons and neutrons'],
      ['Atomic number', 'The number of protons in an atom'],
      ['Mass number', 'The number of protons plus neutrons'],
      ['Isotope', 'Atoms of the same element with different numbers of neutrons'],
      ['Electron shell', 'An energy level that holds electrons around the nucleus'],
    ],
    practice: [
      ['Counting particles', K.subatomic],
      ['Isotopes', K.isotopeQ],
      ['Electron shells', K.electronShells],
      ['Atomic structure', bank([
        { q: 'Which particle has a negative charge?', a: 'Electron', w: ['Proton', 'Neutron', 'Nucleus'], why: 'Protons +, neutrons 0, electrons −.' },
        { q: 'Where is most of an atom’s mass?', a: 'In the nucleus', w: ['In the electron shells', 'Spread out evenly', 'In the empty space'], why: 'Protons and neutrons are about 1800 times heavier than electrons.' },
        { q: 'What does the atomic number tell you?', a: 'The number of protons', w: ['The number of neutrons', 'Protons plus neutrons', 'The number of shells'], why: 'Every atom of an element has the same number of protons.' },
        { q: 'Why is an atom neutral overall?', a: 'It has equal numbers of protons and electrons', w: ['Its neutrons cancel the charges', 'It has no electrons', 'Protons have no charge'], why: '+1 and −1 charges cancel in pairs.', d: 2 },
        { q: 'Carbon-12 and carbon-14 are isotopes. What is different about them?', a: 'The number of neutrons', w: ['The number of protons', 'The number of electrons', 'The element'], why: 'Same protons (6), different neutrons (6 and 8).', d: 2 },
        { q: 'Which model of the atom first showed a tiny, dense, positive nucleus?', a: 'Rutherford’s model (gold foil experiment)', w: ['Dalton’s solid sphere', 'Thomson’s plum pudding', 'Bohr’s water model'], why: 'A few alpha particles bounced back off a small, dense nucleus.', d: 3 },
        { q: 'In Rutherford’s experiment, most alpha particles passed straight through gold foil. What did this show?', a: 'Atoms are mostly empty space', w: ['Atoms are solid', 'Gold has no protons', 'Electrons are in the nucleus'], why: 'Only a tiny fraction hit the nucleus.', d: 3 },
        { q: 'A particle has 8 protons and 10 electrons. What is it?', a: 'An ion with a 2− charge', w: ['A neutral atom', 'An ion with a 2+ charge', 'An isotope with 10 neutrons'], why: '8 positive − 10 negative = 2−. It is an oxide ion.', d: 3 },
      ])],
    ],
  },
  {
    id: 'radioactivity', title: 'Radioactivity & half-life', strand: 'chemistry', level: 9, emoji: '☢️', scene: 'radioactivity',
    summary: 'Unstable nuclei, the radiation they give off, and how fast they decay.',
    analogy: { emoji: '🍿', title: 'Popping popcorn', text: 'You can’t predict which kernel will pop next, but you can predict that about half of them will have popped after a certain time. Radioactive decay is random for each atom but predictable for billions of them — that’s half-life.' },
    lesson: `
Some isotopes have an **unstable nucleus**. They become more stable by giving out **radiation** — this is **radioactive decay**.

- **Alpha (α):** 2 protons + 2 neutrons (a helium nucleus). Stopped by **paper** or skin. The most ionising.
- **Beta (β):** a fast electron from the nucleus (a neutron turns into a proton). Stopped by a few millimetres of **aluminium**.
- **Gamma (γ):** a high-energy electromagnetic wave. Reduced by thick **lead** or concrete. The least ionising.

**Decay equations** must balance: the mass numbers and atomic numbers add up on both sides.

$$^{238}_{92}\\text{U} \\rightarrow\\ ^{234}_{90}\\text{Th} + {}^{4}_{2}\\text{He} \\quad (\\alpha)$$

$$^{14}_{6}\\text{C} \\rightarrow\\ ^{14}_{7}\\text{N} + {}^{0}_{-1}e \\quad (\\beta)$$

**Half-life** is the time for **half** the radioactive nuclei in a sample to decay. After each half-life the amount halves: 100% → 50% → 25% → 12.5%…

**Uses:** carbon dating (carbon-14), medical tracers and radiotherapy, smoke detectors (alpha), sterilising medical equipment (gamma). **Nuclear fission** — splitting uranium nuclei — releases energy in nuclear power stations.

> Radiation is **ionising** — it can damage DNA. Protect yourself with distance, shielding and short exposure times.

! After two half-lives the sample isn’t gone — a quarter is still left.`,
    examples: [
      { q: 'A sample of 80 g has a half-life of 5 days. How much is left after 15 days?', steps: ['15 ÷ 5 = 3 half-lives.', '80 → 40 → 20 → 10 g'] },
      { q: 'Radium-226 (atomic number 88) undergoes alpha decay. What are the new mass and atomic numbers?', steps: ['An alpha particle is $^{4}_{2}\\text{He}$.', 'Mass number: 226 − 4 = 222. Atomic number: 88 − 2 = 86 (radon).'] },
    ],
    mistakes: ['Thinking a sample is all gone after two half-lives', 'Mixing up which radiation paper stops (alpha) and which needs lead (gamma)', 'In beta decay, forgetting the atomic number goes UP by 1'],
    formulas: ['\\text{amount left} = \\text{start} \\times \\left(\\tfrac12\\right)^{n}', '\\alpha = {}^{4}_{2}\\text{He} \\qquad \\beta = {}^{0}_{-1}e'],
    terms: [
      ['Radioactive decay', 'An unstable nucleus giving out radiation to become more stable'],
      ['Alpha particle', 'Two protons and two neutrons — a helium nucleus'],
      ['Beta particle', 'A fast electron given out by the nucleus'],
      ['Gamma ray', 'High-energy electromagnetic radiation from the nucleus'],
      ['Half-life', 'The time for half the radioactive nuclei in a sample to decay'],
      ['Ionising radiation', 'Radiation able to knock electrons off atoms and damage cells'],
      ['Nuclear fission', 'Splitting a large nucleus to release energy'],
      ['Background radiation', 'Low-level radiation around us all the time from natural sources'],
    ],
    practice: [
      ['Half-life', K.halfLife],
      ['Decay equations', K.decayEq],
      ['Types & uses', bank([
        { q: 'Which radiation is stopped by a sheet of paper?', a: 'Alpha', w: ['Beta', 'Gamma', 'All three'], why: 'Alpha particles are big and heavy, so they’re stopped very easily.' },
        { q: 'Which radiation needs thick lead or concrete to reduce it?', a: 'Gamma', w: ['Alpha', 'Beta', 'None of them'], why: 'Gamma rays are waves with no mass or charge, so they penetrate the most.' },
        { q: 'What is an alpha particle?', a: 'Two protons and two neutrons', w: ['A fast electron', 'An electromagnetic wave', 'A single neutron'], why: 'It is the same as a helium nucleus.' },
        { q: 'Which isotope is used to date things that were once alive?', a: 'Carbon-14', w: ['Uranium-238', 'Iodine-131', 'Cobalt-60'], why: 'Living things take in carbon-14; after death it decays with a half-life of about 5730 years.' },
        { q: 'Which type of radiation is used in smoke detectors?', a: 'Alpha', w: ['Gamma', 'Beta', 'Microwaves'], why: 'Smoke absorbs the alpha particles, which sets off the alarm.', d: 2 },
        { q: 'Why is radiation called “ionising”?', a: 'It can knock electrons off atoms', w: ['It makes atoms heavier', 'It only affects metals', 'It creates new elements in your body'], why: 'Ionising atoms in cells can damage DNA.', d: 2 },
        { q: 'Why is alpha radiation most dangerous inside the body?', a: 'It is strongly ionising and all its energy is absorbed by nearby cells', w: ['It travels the furthest', 'It is a type of gamma wave', 'It contains lead'], why: 'Outside the body, skin stops alpha; inside, it damages tissue directly.', d: 2 },
        { q: 'Why do radiographers stand behind a screen when taking X-rays?', a: 'To reduce their exposure, because they take many X-rays each day', w: ['X-rays are only dangerous to staff', 'The screen makes the image clearer', 'To hear the machine better'], why: 'Shielding and limiting exposure time keep the dose low.', d: 3 },
        { q: 'Gamma rays are used to sterilise medical equipment because they…', a: 'pass through packaging and kill bacteria', w: ['make the equipment radioactive', 'are stopped by paper', 'are heavy particles'], why: 'Gamma penetrates sealed packaging; the equipment does not become radioactive.', d: 3 },
        { q: 'In beta decay, what happens inside the nucleus?', a: 'A neutron turns into a proton, and an electron is emitted', w: ['A proton turns into an alpha particle', 'Two neutrons are lost', 'The nucleus splits in half'], why: 'That’s why the atomic number goes up by 1 while the mass number stays the same.', d: 3 },
      ])],
    ],
  },
  {
    id: 'reactions', title: 'Chemical reactions & equations', strand: 'chemistry', level: 9, emoji: '🧪', scene: 'reactions',
    summary: 'Rearranging atoms: reactants, products and balanced equations.',
    analogy: { emoji: '🧱', title: 'Rebuilding with LEGO', text: 'A chemical reaction is like pulling apart a LEGO model and building something new from the same bricks. No bricks are added or lost — they’re just rearranged. That’s why mass is conserved.' },
    lesson: `
In a **chemical reaction**, **reactants** turn into new substances called **products**. Bonds break and new bonds form — atoms are **rearranged**, never created or destroyed.

**Signs of a chemical reaction:** bubbles of gas, a colour change, a solid (**precipitate**) forming, or energy given out or taken in (a temperature change, light or sound).

**Conservation of mass:** the total mass of the reactants = the total mass of the products.

**Word and formula equations**

$$\\text{hydrogen} + \\text{oxygen} \\rightarrow \\text{water}$$

$$\\ce{2H2 + O2 -> 2H2O}$$

**Balancing:** count each type of atom on both sides. Change only the **big numbers in front** (coefficients) — never the small numbers inside a formula.

**Types of reactions**

- **Combustion:** fuel + oxygen → carbon dioxide + water (+ energy)
- **Acid + metal** → salt + hydrogen
- **Acid + carbonate** → salt + water + carbon dioxide
- **Decomposition:** one substance breaks down into two or more
- **Precipitation:** two solutions react to make an insoluble solid

**Exothermic** reactions release energy (they get hotter, like burning). **Endothermic** reactions absorb energy (they get colder, like an instant ice pack).

! In an open container a gas can escape, so the mass seems to drop — but mass is still conserved.`,
    examples: [
      { q: 'Balance $\\ce{Mg + O2 -> MgO}$', steps: ['Left: 1 Mg, 2 O. Right: 1 Mg, 1 O.', 'Put 2 in front of MgO → 2 Mg and 2 O on the right.', 'Put 2 in front of Mg: $\\ce{2Mg + O2 -> 2MgO}$ ✓'] },
      { q: 'Methane burns in oxygen. Write the word equation.', steps: ['This is combustion of a hydrocarbon fuel.', 'methane + oxygen → carbon dioxide + water'] },
    ],
    mistakes: ['Changing the small numbers (subscripts) to balance — that makes a different substance', 'Saying mass is lost when a gas escapes', 'Calling a change of state, like melting, a chemical reaction'],
    formulas: ['\\text{mass of reactants} = \\text{mass of products}', '\\text{acid} + \\text{metal} \\rightarrow \\text{salt} + \\text{hydrogen}', '\\text{acid} + \\text{carbonate} \\rightarrow \\text{salt} + \\text{water} + \\ce{CO2}', '\\text{fuel} + \\ce{O2} \\rightarrow \\ce{CO2} + \\ce{H2O}'],
    terms: [
      ['Reactant', 'A substance present at the start of a reaction'],
      ['Product', 'A new substance formed in a reaction'],
      ['Conservation of mass', 'Mass is neither created nor destroyed in a reaction'],
      ['Combustion', 'A reaction with oxygen that releases energy, like burning'],
      ['Exothermic', 'A reaction that releases energy to the surroundings'],
      ['Endothermic', 'A reaction that absorbs energy from the surroundings'],
      ['Precipitate', 'An insoluble solid formed when two solutions react'],
      ['Coefficient', 'The number in front of a formula in a balanced equation'],
    ],
    practice: [
      ['Balancing equations', K.balance],
      ['Conservation of mass', K.conserveMass],
      ['Reaction types', bank([
        { q: 'Which of these is a sign of a chemical reaction?', a: 'Bubbles of gas are produced', w: ['Ice melting', 'Sugar dissolving', 'Water boiling'], why: 'Melting, dissolving and boiling are physical changes — no new substance forms.' },
        { q: 'What are the products of burning a hydrocarbon fuel completely?', a: 'Carbon dioxide and water', w: ['Oxygen and hydrogen', 'Carbon and oxygen', 'Methane and water'], why: 'The carbon becomes CO₂ and the hydrogen becomes H₂O.' },
        { q: 'Acid + metal gives…', a: 'a salt and hydrogen', w: ['a salt and water', 'carbon dioxide and water', 'oxygen and a metal oxide'], why: 'For example, magnesium + hydrochloric acid → magnesium chloride + hydrogen.' },
        { q: 'Acid + carbonate gives…', a: 'a salt, water and carbon dioxide', w: ['a salt and hydrogen', 'only water', 'an oxide and hydrogen'], why: 'The fizzing is carbon dioxide gas.', d: 2 },
        { q: 'A reaction makes the test tube feel cold. It is…', a: 'endothermic', w: ['exothermic', 'combustion', 'not a reaction'], why: 'It absorbs heat energy from the surroundings, including your hand.', d: 2 },
        { q: 'Which of these is exothermic?', a: 'Burning wood', w: ['An instant ice pack', 'Melting ice', 'Photosynthesis'], why: 'Combustion releases heat and light.', d: 2 },
        { q: 'Why can’t you balance an equation by changing $\\ce{H2O}$ to $\\ce{H2O2}$?', a: 'That changes it into a different substance', w: ['Subscripts can’t be bigger than 1', 'It would add too much mass', 'Oxygen can’t be doubled'], why: '$\\ce{H2O2}$ is hydrogen peroxide, not water.', d: 2 },
        { q: 'Two clear solutions are mixed and a cloudy yellow solid forms. This is a…', a: 'precipitation reaction', w: ['combustion reaction', 'decomposition', 'physical change only'], why: 'An insoluble solid (precipitate) formed from two solutions.', d: 3 },
        { q: 'How do you test for hydrogen gas?', a: 'A lit splint gives a “squeaky pop”', w: ['It turns limewater milky', 'It relights a glowing splint', 'It turns blue litmus red'], why: 'Hydrogen burns rapidly with oxygen in the air.', d: 3 },
        { q: 'Which gas turns limewater milky?', a: 'Carbon dioxide', w: ['Hydrogen', 'Oxygen', 'Nitrogen'], why: 'CO₂ reacts with limewater to form a white calcium carbonate precipitate.', d: 3 },
      ])],
    ],
  },
  {
    id: 'acids', title: 'Acids, bases & pH', strand: 'chemistry', level: 9, emoji: '🍋', scene: 'acids',
    summary: 'The pH scale, indicators and neutralisation.',
    analogy: { emoji: '⚖️', title: 'A see-saw', text: 'Acids and bases sit at opposite ends of a see-saw. Add one to the other and they balance each other out — that’s neutralisation. The pH scale tells you which way the see-saw is tipped, and how far.' },
    lesson: `
**Acids** taste sour and turn blue litmus **red**. In water they release hydrogen ions ($\\ce{H+}$). Examples: lemon juice, vinegar, stomach acid ($\\ce{HCl}$).

**Bases** neutralise acids. Bases that dissolve in water are called **alkalis** — they feel soapy and turn red litmus **blue**. They release hydroxide ions ($\\ce{OH-}$). Examples: bicarbonate soda, soap, drain cleaner ($\\ce{NaOH}$).

**The pH scale** runs from 0 to 14:

- pH **below 7** → acidic (the lower, the stronger the acid)
- pH **7** → neutral (pure water)
- pH **above 7** → basic or alkaline (the higher, the stronger the base)

Each step on the scale is **10 times** stronger: pH 2 is 10 times more acidic than pH 3.

**Indicators** change colour with pH: litmus, phenolphthalein, and **universal indicator** (red for strong acid → green for neutral → purple for strong base).

**Neutralisation:** acid + base → salt + water

$$\\ce{HCl + NaOH -> NaCl + H2O}$$

Everyday uses: antacid tablets neutralise extra stomach acid, farmers add lime to acidic soil, and bicarbonate soda soothes a bee sting (which is acidic).

> Salt names come from the acid: hydrochloric → chloride, sulfuric → sulfate, nitric → nitrate.

! A higher pH means LESS acidic, not more.`,
    examples: [
      { q: 'A soil has pH 5. A farmer adds lime (a base). What happens?', steps: ['pH 5 is acidic.', 'The lime neutralises some of the acid, so the pH rises towards 7.'] },
      { q: 'Complete: sulfuric acid + potassium hydroxide → ?', steps: ['Acid + base → salt + water.', 'potassium sulfate + water'] },
    ],
    mistakes: ['Thinking a higher pH means more acidic', 'Saying neutralisation always gives exactly pH 7 — it depends on the amounts used', 'Mixing up which colour litmus turns in acids'],
    formulas: ['\\text{acid} + \\text{base} \\rightarrow \\text{salt} + \\text{water}', '\\ce{HCl + NaOH -> NaCl + H2O}'],
    terms: [
      ['Acid', 'A substance with pH below 7 that releases H⁺ ions in water'],
      ['Base', 'A substance that neutralises an acid'],
      ['Alkali', 'A base that dissolves in water'],
      ['pH', 'A scale from 0 to 14 showing how acidic or basic a solution is'],
      ['Neutral', 'pH 7 — neither acidic nor basic'],
      ['Indicator', 'A substance that changes colour depending on pH'],
      ['Neutralisation', 'An acid and a base reacting to form a salt and water'],
      ['Salt', 'An ionic compound formed when an acid reacts'],
    ],
    practice: [
      ['The pH scale', bank([
        { q: 'A solution has pH 3. It is…', a: 'acidic', w: ['neutral', 'basic', 'alkaline'], why: 'Below 7 is acidic.' },
        { q: 'Which pH is neutral?', a: '7', w: ['0', '14', '1'], why: 'Pure water has pH 7.' },
        { q: 'Which pH is the strongest base?', a: '13', w: ['8', '7', '2'], why: 'The further above 7, the stronger the base.' },
        { q: 'Which pH is the strongest acid?', a: '1', w: ['6', '7', '12'], why: 'The further below 7, the stronger the acid.' },
        { q: 'What colour does universal indicator turn in a neutral solution?', a: 'Green', w: ['Red', 'Purple', 'Yellow'], why: 'Red = strong acid, green = neutral, purple = strong base.' },
        { q: 'Blue litmus paper turns red in…', a: 'an acid', w: ['a base', 'pure water', 'an alkali'], why: 'Acids turn blue litmus red.' },
        { q: 'Which household substance is basic?', a: 'Bicarbonate soda', w: ['Vinegar', 'Lemon juice', 'Cola'], why: 'The others are all acidic.', d: 2 },
        { q: 'How many times more acidic is pH 3 than pH 4?', a: '10 times', w: ['1 time', '2 times', '100 times'], why: 'Each pH step is a factor of 10.', d: 2 },
        { q: 'How many times more acidic is pH 2 than pH 5?', a: '1000 times', w: ['3 times', '30 times', '100 times'], why: '3 steps: 10 × 10 × 10 = 1000.', d: 3 },
        { q: 'Which ion do acids release in water?', a: 'H⁺ (hydrogen ion)', w: ['OH⁻ (hydroxide ion)', 'Na⁺ (sodium ion)', 'O²⁻ (oxide ion)'], why: 'Acids release H⁺; alkalis release OH⁻.', d: 3 },
      ])],
      ['Neutralisation', bank([
        { q: 'Acid + base gives…', a: 'a salt and water', w: ['hydrogen and water', 'carbon dioxide only', 'an acid and oxygen'], why: 'This is the neutralisation reaction.' },
        { q: 'Antacid tablets help heartburn because they…', a: 'neutralise extra stomach acid', w: ['add more acid', 'kill bacteria', 'cool the stomach'], why: 'Antacids are mild bases.' },
        { q: 'Hydrochloric acid + sodium hydroxide makes…', a: 'sodium chloride + water', w: ['sodium + chlorine', 'sodium hydroxide + water', 'hydrogen + oxygen'], why: '$\\ce{HCl + NaOH -> NaCl + H2O}$', d: 2 },
        { q: 'Adding a base to an acid makes the pH…', a: 'rise towards 7', w: ['fall towards 0', 'stay the same', 'jump straight to 14'], why: 'The base neutralises the acid.', d: 2 },
        { q: 'Which type of salt does sulfuric acid make?', a: 'A sulfate', w: ['A chloride', 'A nitrate', 'A carbonate'], why: 'Sulfuric → sulfate, hydrochloric → chloride, nitric → nitrate.', d: 2 },
        { q: 'A farmer adds lime to soil with pH 5. Why?', a: 'To neutralise the acid so crops grow better', w: ['To make the soil more acidic', 'To add nitrogen', 'To kill earthworms'], why: 'Most crops grow best near neutral.', d: 2 },
        { q: 'Which acid makes nitrate salts?', a: 'Nitric acid', w: ['Hydrochloric acid', 'Sulfuric acid', 'Citric acid'], why: 'Nitric acid → nitrates.', d: 3 },
        { q: 'Why might adding too much base to an acid NOT give pH 7?', a: 'The extra base makes the solution basic', w: ['Neutralisation always gives pH 7', 'The salt is acidic', 'Water is basic'], why: 'Exact neutralisation needs exactly the right amounts.', d: 3 },
      ])],
    ],
  },
  {
    id: 'periodic', title: 'The periodic table', strand: 'chemistry', level: 10, emoji: '🗂️', scene: 'periodic',
    summary: 'How elements are organised, and the patterns that predict their behaviour.',
    analogy: { emoji: '🏢', title: 'An apartment building', text: 'The periodic table is like an apartment building. The floor (period) tells you how many shells of electrons an atom has; the column (group) tells you how many electrons live on the top floor. Atoms in the same column behave alike because their outer electrons match.' },
    lesson: `
The **periodic table** arranges the elements by **atomic number**. Dmitri **Mendeleev** made the first version in 1869, and even left gaps for elements that hadn’t been discovered yet.

- **Periods** are rows. The period number = the number of electron **shells**.
- **Groups** are columns. Elements in the same group have the same number of **outer-shell (valence) electrons**, so they react in similar ways.

**Metals** (left and centre) are shiny, conduct heat and electricity, and can be bent and shaped. **Non-metals** (right) are mostly dull, brittle and don’t conduct. **Metalloids** like silicon sit along the staircase between them.

**Key groups**

- **Group 1 – alkali metals** (Li, Na, K): 1 outer electron, very reactive, fizz in water to make hydrogen. Reactivity **increases** down the group.
- **Group 17 – halogens** (F, Cl, Br): 7 outer electrons, reactive non-metals. Reactivity **decreases** down the group.
- **Group 18 – noble gases** (He, Ne, Ar): a full outer shell, so they are **unreactive**.
- **Transition metals** (the middle block): hard, strong metals like iron and copper, often with coloured compounds.

> Atoms react to get a full outer shell — metals lose electrons, non-metals gain them.

! For groups 13–18, the number of outer electrons is the group number minus 10.`,
    examples: [
      { q: 'Sulfur has atomic number 16. Which group and period is it in?', steps: ['Electron configuration: 2, 8, 6.', '3 shells → period 3. 6 outer electrons → group 16.'] },
      { q: 'Why is potassium more reactive than sodium?', steps: ['Potassium’s outer electron is in a shell further from the nucleus.', 'It is held less tightly, so it is lost more easily.'] },
    ],
    mistakes: ['Mixing up groups (columns) and periods (rows)', 'Thinking reactivity increases down every group — it decreases for halogens', 'Saying noble gases have an empty outer shell — it is full'],
    formulas: [],
    terms: [
      ['Period', 'A row of the periodic table'],
      ['Group', 'A column of the periodic table'],
      ['Valence electrons', 'The electrons in the outer shell'],
      ['Alkali metal', 'A very reactive metal in group 1'],
      ['Halogen', 'A reactive non-metal in group 17'],
      ['Noble gas', 'An unreactive element in group 18 with a full outer shell'],
      ['Metalloid', 'An element with some properties of metals and some of non-metals'],
      ['Transition metal', 'A metal from the central block of the periodic table'],
    ],
    practice: [
      ['Groups & periods', K.groupPeriod],
      ['Families & trends', bank([
        { q: 'What are the rows of the periodic table called?', a: 'Periods', w: ['Groups', 'Families', 'Blocks'], why: 'Rows = periods, columns = groups.' },
        { q: 'Which group contains the noble gases?', a: 'Group 18', w: ['Group 1', 'Group 17', 'Group 2'], why: 'The far-right column.' },
        { q: 'Why are noble gases unreactive?', a: 'They have a full outer shell', w: ['They have no electrons', 'They are metals', 'They are too heavy'], why: 'They don’t need to gain, lose or share electrons.' },
        { q: 'Which is a property of most metals?', a: 'They conduct electricity', w: ['They are brittle', 'They are dull', 'They are gases at room temperature'], why: 'Metals have electrons that are free to move.' },
        { q: 'Elements in the same group react in similar ways because they have the same…', a: 'number of outer-shell electrons', w: ['mass number', 'number of neutrons', 'number of shells'], why: 'Reactions involve the outer electrons.', d: 2 },
        { q: 'How does reactivity change going down group 1?', a: 'It increases', w: ['It decreases', 'It stays the same', 'It increases, then decreases'], why: 'The outer electron is further from the nucleus, so it’s lost more easily.', d: 2 },
        { q: 'What gas forms when sodium reacts with water?', a: 'Hydrogen', w: ['Oxygen', 'Carbon dioxide', 'Chlorine'], why: 'sodium + water → sodium hydroxide + hydrogen.', d: 2 },
        { q: 'Why did Mendeleev leave gaps in his table?', a: 'For elements that hadn’t been discovered yet', w: ['To make it look neat', 'Because some elements are invisible', 'To separate metals and gases'], why: 'He even predicted their properties — and was proved right.', d: 2 },
        { q: 'Why does reactivity decrease going down the halogens?', a: 'The outer shell is further from the nucleus, so gaining an electron is harder', w: ['They have fewer protons', 'They become metals', 'They lose more electrons'], why: 'Halogens react by gaining an electron; a distant shell attracts it less.', d: 3 },
        { q: 'Silicon is a metalloid. What does that mean?', a: 'It has some properties of metals and some of non-metals', w: ['It is a radioactive metal', 'It is a noble gas', 'It is a liquid'], why: 'Silicon is a semiconductor — useful in computer chips.', d: 3 },
      ])],
    ],
  },
  {
    id: 'bonding', title: 'Chemical bonding', strand: 'chemistry', level: 10, emoji: '🔗', scene: 'bonding',
    summary: 'How atoms join together: ionic, covalent and metallic bonds.',
    analogy: { emoji: '🍕', title: 'Giving vs sharing', text: 'Ionic bonding is like one friend giving a lolly to another — one ends up positive, one negative, and they stick together. Covalent bonding is like two friends sharing a pizza — both keep hold of it.' },
    lesson: `
Atoms bond to get a **full outer shell** of electrons, like a noble gas.

**Ionic bonding — metal + non-metal**

- The metal **loses** electrons and becomes a **positive ion**: $\\ce{Na -> Na+ + e-}$
- The non-metal **gains** electrons and becomes a **negative ion**: $\\ce{Cl + e- -> Cl-}$
- The opposite charges attract strongly, forming a giant **lattice**.
- Ionic compounds have **high melting points** and conduct electricity when **melted or dissolved** (the ions can move).

**Writing ionic formulas:** the charges must add up to zero. $\\ce{Mg^2+}$ and $\\ce{Cl-}$ → $\\ce{MgCl2}$.

**Covalent bonding — non-metal + non-metal**

- Atoms **share** pairs of electrons, e.g. water $\\ce{H2O}$, methane $\\ce{CH4}$, oxygen $\\ce{O2}$.
- Most form small **molecules** with **low melting points** that don’t conduct electricity.

**Metallic bonding — metals**

- Positive metal ions sit in a “sea” of **delocalised electrons** that are free to move — so metals conduct electricity and can be bent.

> Ion charge from the group: group 1 → 1+, group 2 → 2+, group 13 → 3+; group 15 → 3−, group 16 → 2−, group 17 → 1−.

! Solid ionic compounds don’t conduct — the ions must be free to move (melted or dissolved).`,
    examples: [
      { q: 'What is the formula of aluminium oxide? ($\\ce{Al^3+}$ and $\\ce{O^2-}$)', steps: ['The lowest common multiple of 3 and 2 is 6.', '2 Al³⁺ = +6 and 3 O²⁻ = −6 → $\\ce{Al2O3}$'] },
      { q: 'Why does salt water conduct electricity but solid salt doesn’t?', steps: ['In solid NaCl the ions are locked in the lattice.', 'When it dissolves, the ions are free to move and carry charge.'] },
    ],
    mistakes: ['Saying ionic bonds share electrons — they transfer them', 'Thinking solid ionic compounds conduct electricity', 'Forgetting to balance the charges when writing formulas'],
    formulas: [],
    terms: [
      ['Ion', 'An atom that has gained or lost electrons'],
      ['Ionic bond', 'The attraction between oppositely charged ions'],
      ['Covalent bond', 'A shared pair of electrons between two non-metal atoms'],
      ['Metallic bond', 'Metal ions held in a sea of delocalised electrons'],
      ['Lattice', 'A regular, repeating arrangement of particles'],
      ['Molecule', 'A group of atoms joined by covalent bonds'],
      ['Cation', 'A positive ion'],
      ['Anion', 'A negative ion'],
    ],
    practice: [
      ['Ionic formulas', K.ionicFormula],
      ['Bond types & properties', bank([
        { q: 'What type of bond forms between sodium and chlorine?', a: 'Ionic', w: ['Covalent', 'Metallic', 'No bond'], why: 'Metal + non-metal → ionic.' },
        { q: 'What type of bond holds the atoms in a water molecule together?', a: 'Covalent', w: ['Ionic', 'Metallic', 'Magnetic'], why: 'Non-metal + non-metal → covalent.' },
        { q: 'In ionic bonding, metal atoms…', a: 'lose electrons and become positive ions', w: ['gain electrons and become negative ions', 'share electrons', 'lose protons'], why: 'Losing negative electrons leaves a positive charge.' },
        { q: 'What charge does a magnesium ion have? (Mg is in group 2)', a: '2+', w: ['2−', '1+', '6−'], why: 'It loses its 2 outer electrons.' },
        { q: 'What charge does a chloride ion have? (Cl is in group 17)', a: '1−', w: ['7+', '1+', '7−'], why: 'It gains 1 electron to fill its outer shell.', d: 2 },
        { q: 'Why do ionic compounds have high melting points?', a: 'Strong attractions between ions in a giant lattice', w: ['Their molecules are very small', 'They share electrons', 'They contain metals only'], why: 'Lots of energy is needed to break the many strong attractions.', d: 2 },
        { q: 'Why can metals conduct electricity?', a: 'They have delocalised electrons that can move', w: ['Their ions move freely in the solid', 'They contain covalent bonds', 'They have no electrons'], why: 'The “sea” of electrons carries the current.', d: 2 },
        { q: 'Which would conduct electricity when dissolved in water?', a: 'Potassium chloride', w: ['Sugar', 'Methane', 'Oxygen'], why: 'It is ionic, so its ions are free to move in solution.', d: 3 },
        { q: 'Methane ($\\ce{CH4}$) has a low boiling point because…', a: 'its small molecules are only weakly attracted to each other', w: ['covalent bonds are weak', 'it is ionic', 'it has a metallic lattice'], why: 'Boiling separates molecules; it doesn’t break the strong covalent bonds inside them.', d: 3 },
        { q: 'How many electrons are shared in one covalent bond?', a: '2 (one pair)', w: ['1', '4', '8'], why: 'Each atom contributes one electron to the shared pair.', d: 3 },
      ])],
    ],
  },
  {
    id: 'rates', title: 'Rates of reaction', strand: 'chemistry', level: 10, emoji: '⏱️', scene: 'rates',
    summary: 'What makes reactions go faster — and how we measure it.',
    analogy: { emoji: '🕺', title: 'A crowded dance floor', text: 'Particles only react when they bump into each other hard enough. Pack more people onto the dance floor (concentration), speed up the music (temperature) or open more doors (surface area), and there are more collisions every second.' },
    lesson: `
The **rate of reaction** is how fast reactants are used up or products are made — for example, how much gas is given off each second.

**Collision theory:** particles react only when they **collide** with enough energy (the **activation energy**). Anything that causes **more frequent** or **more energetic** collisions speeds up the reaction.

- **Higher temperature** → particles move faster → more frequent and more energetic collisions
- **Higher concentration** (or gas pressure) → more particles in the same space → more frequent collisions
- **Larger surface area** (smaller pieces or powder) → more particles exposed → more frequent collisions
- **Catalyst** → provides a pathway with **lower activation energy**, and isn’t used up. **Enzymes** are biological catalysts.

**Measuring rate:** collect gas in a syringe, measure the mass lost on a balance, or time how long a solution takes to turn cloudy.

On a graph of product against time, the curve is **steepest at the start** (the fastest rate) and flattens out when a reactant runs out.

> Average rate = amount of product formed ÷ time taken.

! A catalyst makes a reaction faster, but doesn’t make MORE product — the final amount is the same.`,
    examples: [
      { q: 'Why does powdered chalk react faster with acid than a lump of chalk?', steps: ['Powder has a much larger surface area.', 'More acid particles can collide with chalk particles every second.'] },
      { q: 'Why do we keep food in the fridge?', steps: ['At a lower temperature, the reactions of microbes and enzymes are slower.', 'So the food spoils more slowly.'] },
    ],
    mistakes: ['Saying a higher temperature gives “more product” — it gives a faster rate, not more product', 'Saying a catalyst gets used up', 'Forgetting that collisions need enough energy, not just to happen'],
    formulas: ['\\text{rate} = \\dfrac{\\text{amount of product}}{\\text{time}}'],
    terms: [
      ['Rate of reaction', 'How quickly reactants turn into products'],
      ['Collision theory', 'Particles must collide with enough energy to react'],
      ['Activation energy', 'The minimum energy needed for a reaction to happen'],
      ['Catalyst', 'A substance that speeds up a reaction without being used up'],
      ['Enzyme', 'A biological catalyst'],
      ['Concentration', 'How much substance is dissolved in a certain volume'],
      ['Surface area', 'How much of a solid is exposed to the other reactants'],
    ],
    practice: [
      ['Factors & collision theory', bank([
        { q: 'Which change would speed up a reaction?', a: 'Increasing the temperature', w: ['Using bigger lumps', 'Diluting the acid', 'Cooling it in ice'], why: 'Faster particles collide more often and with more energy.' },
        { q: 'Why does a higher temperature increase the rate?', a: 'Particles move faster, so they collide more often and with more energy', w: ['The particles get bigger', 'It adds more reactant', 'It lowers the concentration'], why: 'Both the number and the energy of collisions increase.' },
        { q: 'What does a catalyst do?', a: 'Speeds up a reaction without being used up', w: ['Makes more product', 'Slows a reaction down', 'Gets used up as a reactant'], why: 'It can be reused again and again.' },
        { q: 'Which reacts fastest with acid?', a: 'Magnesium powder', w: ['A magnesium ribbon', 'A magnesium block', 'They all react at the same rate'], why: 'Powder has the largest surface area.' },
        { q: 'Increasing concentration speeds up a reaction because…', a: 'there are more particles in the same volume, so more collisions', w: ['the particles move faster', 'the activation energy rises', 'the products form first'], why: 'More crowded → more frequent collisions.', d: 2 },
        { q: 'What is activation energy?', a: 'The minimum energy particles need to react when they collide', w: ['The energy released by a reaction', 'The energy stored in a catalyst', 'The speed of the particles'], why: 'Collisions with less energy than this just bounce off.', d: 2 },
        { q: 'Why are enzymes important in your body?', a: 'They speed up reactions at body temperature', w: ['They are used up for energy', 'They slow reactions to save energy', 'They carry oxygen'], why: 'Without enzymes, digestion and respiration would be far too slow.', d: 2 },
        { q: 'Why does food go off more slowly in the fridge?', a: 'The low temperature slows the reactions of microbes and enzymes', w: ['Cold kills all bacteria', 'The fridge removes oxygen', 'Food has less mass when cold'], why: 'Lower temperature → fewer and less energetic collisions.', d: 2 },
        { q: 'How does a catalyst speed up a reaction?', a: 'It provides a pathway with lower activation energy', w: ['It heats the reactants', 'It adds more particles', 'It makes the products heavier'], why: 'More collisions now have enough energy to react.', d: 3 },
        { q: 'Why does a reaction slow down and eventually stop?', a: 'The reactants are being used up, so there are fewer collisions', w: ['The catalyst is used up', 'The products block it forever', 'The temperature always drops to zero'], why: 'Fewer reactant particles → fewer collisions per second.', d: 3 },
      ])],
      ['Reading rate graphs', rateGraph],
    ],
  },
]
