import { bank, mcq, type Gen } from '../lib/problem'
import { pick } from '../lib/num'
import * as K from '../gens/calc'
import type { TopicDef } from './topics'

const EXPERIMENTS = [
  { q: 'How does the temperature of water affect how quickly sugar dissolves?', iv: 'Temperature of the water', dv: 'Time taken for the sugar to dissolve', cv: ['Mass of sugar', 'Volume of water', 'Type of sugar'] },
  { q: 'Does the amount of light affect how tall bean plants grow?', iv: 'Amount of light', dv: 'Height of the plants', cv: ['Amount of water', 'Type of soil', 'Type of bean'] },
  { q: 'How does the drop height affect how high a ball bounces?', iv: 'Drop height', dv: 'Bounce height', cv: ['Type of ball', 'Surface it lands on', 'Air temperature'] },
  { q: 'Does the concentration of acid affect how fast magnesium reacts?', iv: 'Concentration of the acid', dv: 'Time for the magnesium to disappear', cv: ['Mass of magnesium', 'Volume of acid', 'Starting temperature'] },
  { q: 'How does the length of a pendulum affect the time for one swing?', iv: 'Length of the string', dv: 'Time for one swing', cv: ['Mass of the bob', 'Angle it’s released from', 'Type of string'] },
  { q: 'Does the number of coils on an electromagnet affect how many paperclips it picks up?', iv: 'Number of coils', dv: 'Number of paperclips picked up', cv: ['Battery voltage', 'Type of nail', 'Size of the paperclips'] },
  { q: 'How does the amount of exercise affect heart rate?', iv: 'Amount of exercise', dv: 'Heart rate (beats per minute)', cv: ['The person tested', 'Type of exercise', 'Rest time beforehand'] },
  { q: 'Does breaking up an antacid tablet affect how fast it fizzes away in water?', iv: 'Surface area (whole, pieces or powder)', dv: 'Time for the fizzing to stop', cv: ['Mass of tablet', 'Volume of water', 'Water temperature'] },
]

const variables: Gen = (d) => {
  const e = pick(EXPERIMENTS)
  const others = EXPERIMENTS.filter((x) => x !== e)
  const kind = d === 1 ? pick(['iv', 'dv'] as const) : pick(['iv', 'dv', 'cv', ...(d === 3 ? (['unfair'] as const) : [])] as const)
  const q = `Investigation: “${e.q}”`
  if (kind === 'iv') return mcq(`${q} What is the **independent** variable?`, e.iv, [e.dv, ...e.cv], [`The independent variable is the one you change on purpose: **${e.iv}**.`, `You measure the dependent variable: ${e.dv}.`], 'What are you deliberately changing?')
  if (kind === 'dv') return mcq(`${q} What is the **dependent** variable?`, e.dv, [e.iv, ...e.cv], [`The dependent variable is what you measure: **${e.dv}**.`, `It depends on what you change (${e.iv}).`], 'What are you measuring?')
  if (kind === 'cv') {
    const c = pick(e.cv)
    return mcq(`${q} Which of these should be a **controlled** variable?`, c, [e.iv, e.dv, pick(others).iv], [`Controlled variables are kept the same so the test is fair: ${e.cv.join(', ')}.`], 'What must stay the same?')
  }
  const c = pick(e.cv)
  return mcq(`${q} Which mistake would make this an **unfair** test?`, `Changing the ${c.toLowerCase()} between trials as well`, [`Repeating each trial three times`, `Recording results in a table`, `Measuring the ${e.dv.toLowerCase()} carefully`], [`If ${c.toLowerCase()} also changes, you can’t tell which variable caused the result.`])
}

export const EARTH: TopicDef[] = [
  {
    id: 'tectonics', title: 'Plate tectonics', strand: 'earth', level: 9, emoji: '🌋', scene: 'tectonics',
    summary: 'Moving plates, and the earthquakes, volcanoes and mountains they make.',
    analogy: { emoji: '🥣', title: 'Rafts on porridge', text: 'Earth’s crust is like the cracked shell of a hard-boiled egg — broken into pieces (plates) that ride on the slowly churning mantle beneath, like rafts on a pot of thick, simmering porridge.' },
    lesson: `
Earth has layers: a thin rocky **crust**, a thick **mantle** of hot rock that flows very slowly, a liquid **outer core** and a solid **inner core**.

The crust and the top of the mantle are broken into giant **tectonic plates** that move a few centimetres a year — about as fast as your fingernails grow. **Convection currents** in the mantle drive them.

**Plate boundaries**

- **Divergent** — plates move **apart**. Magma rises and makes new crust (mid-ocean ridges, rift valleys).
- **Convergent** — plates move **together**. A dense ocean plate sinks under another (**subduction**), making deep trenches and volcanoes. Two continents crumple up into **mountains** (the Himalayas).
- **Transform** — plates **slide past** each other, causing **earthquakes** (the San Andreas Fault).

**Evidence for plate tectonics** (building on Alfred **Wegener’s** idea of continental drift):

- The coastlines of South America and Africa fit together like a jigsaw.
- Matching fossils and rock types are found on continents now oceans apart.
- **Sea-floor spreading**: rocks are youngest near mid-ocean ridges and older further away.
- Earthquakes and volcanoes cluster along plate boundaries (like the Pacific **Ring of Fire**).

Australia sits in the middle of the Indo-Australian plate, moving north about **7 cm per year** — so it has few big earthquakes and no active volcanoes.

! The mantle is solid rock that flows very slowly — not an ocean of liquid lava.`,
    examples: [
      { q: 'Why does Japan have so many earthquakes and volcanoes?', steps: ['It sits where plates converge, at subduction zones.', 'Plates grinding together cause earthquakes; the sinking plate melts and feeds volcanoes.'] },
      { q: 'Australia moves 7 cm north each year. How far is that in 1 million years?', steps: ['7 × 1 000 000 = 7 000 000 cm', '= 70 000 m = 70 km'] },
    ],
    mistakes: ['Saying the mantle is liquid lava', 'Mixing up convergent (together) and divergent (apart)', 'Thinking continents move quickly — it is only centimetres per year'],
    formulas: [],
    terms: [
      ['Tectonic plate', 'A huge slab of Earth’s crust and upper mantle that moves slowly'],
      ['Mantle', 'The thick layer of hot rock under the crust that flows slowly'],
      ['Convergent boundary', 'Where two plates move towards each other'],
      ['Divergent boundary', 'Where two plates move apart'],
      ['Transform boundary', 'Where two plates slide past each other'],
      ['Subduction', 'One plate sinking beneath another'],
      ['Continental drift', 'Wegener’s idea that the continents slowly move'],
      ['Sea-floor spreading', 'New ocean crust forming at mid-ocean ridges'],
    ],
    practice: [
      ['Plate movement', K.plateMove],
      ['Boundaries & evidence', bank([
        { q: 'What drives the movement of tectonic plates?', a: 'Convection currents in the mantle', w: ['Ocean tides', 'The Moon’s gravity', 'Wind'], why: 'Heat from the core makes the mantle rock slowly circulate.' },
        { q: 'At a divergent boundary, plates…', a: 'move apart', w: ['move together', 'slide past each other', 'stay still'], why: 'Diverge = move apart.' },
        { q: 'What forms when two continental plates collide?', a: 'Fold mountains', w: ['Mid-ocean ridges', 'Rift valleys', 'Coral reefs'], why: 'Neither plate sinks, so the crust crumples upwards — like the Himalayas.' },
        { q: 'What is the outermost layer of Earth?', a: 'The crust', w: ['The mantle', 'The inner core', 'The outer core'], why: 'The crust is the thin rocky skin we live on.' },
        { q: 'Which is evidence for continental drift?', a: 'Matching fossils on continents now oceans apart', w: ['The phases of the Moon', 'The changing seasons', 'Rainfall patterns'], why: 'The same land animals couldn’t have crossed the oceans.' },
        { q: 'What happens at a subduction zone?', a: 'A denser ocean plate sinks under another plate', w: ['Two plates move apart', 'New crust forms at a ridge', 'Plates stop moving'], why: 'Ocean crust is denser, so it sinks into the mantle.', d: 2 },
        { q: 'The San Andreas Fault is a transform boundary. What mainly happens there?', a: 'Earthquakes, as the plates slide past each other', w: ['New ocean forms', 'Volcanoes erupt constantly', 'Mountains grow quickly'], why: 'Plates stick, build up stress, then slip suddenly.', d: 2 },
        { q: 'Why does Australia have no active volcanoes?', a: 'It is in the middle of a plate, far from the boundaries', w: ['It is too hot', 'It is moving too fast', 'It has no mantle beneath it'], why: 'Most volcanoes are at plate boundaries.', d: 2 },
        { q: 'Rocks get older the further they are from a mid-ocean ridge. What does this show?', a: 'New crust forms at the ridge and spreads outwards', w: ['The ridge is the oldest rock', 'Oceans are shrinking everywhere', 'Rocks age faster underwater'], why: 'This is sea-floor spreading.', d: 3 },
        { q: 'Why was Wegener’s idea rejected at first?', a: 'He couldn’t explain what made the continents move', w: ['There were no fossils', 'He had no maps', 'Gravity holds continents in place'], why: 'Evidence for mantle convection and sea-floor spreading came decades later.', d: 3 },
      ])],
    ],
  },
  {
    id: 'universe', title: 'The Big Bang & the universe', strand: 'earth', level: 10, emoji: '🌌', scene: 'universe',
    summary: 'Where the universe came from, and the evidence that it’s expanding.',
    analogy: { emoji: '🎈', title: 'Dots on a balloon', text: 'Draw dots on a balloon and blow it up. Every dot moves away from every other dot, and the dots furthest apart separate fastest. Galaxies behave the same way in our expanding universe.' },
    lesson: `
The **Big Bang theory** says the universe began about **13.8 billion years ago** from an extremely hot, dense state, and has been **expanding** and cooling ever since.

**Evidence for the Big Bang**

- **Red shift:** light from distant galaxies is stretched to longer (redder) wavelengths, which means they are moving **away** from us. The further away a galaxy is, the faster it is moving away — the universe is expanding.
- **Cosmic microwave background (CMB) radiation:** a faint microwave “afterglow” of the Big Bang, coming from every direction in space.
- The amounts of hydrogen and helium in the universe match the theory’s predictions.

**The structure of the universe**

- **Stars** form in clouds of gas and dust (**nebulae**) pulled together by gravity. Nuclear **fusion** of hydrogen into helium powers them.
- **Galaxies** are huge collections of billions of stars. We live in the **Milky Way**.
- Distances are measured in **light-years** — the distance light travels in a year (about 9.5 trillion km).

**The life of a star:** nebula → main-sequence star (like the Sun) → red giant → white dwarf. Massive stars swell into supergiants, explode as **supernovas**, and leave a **neutron star** or a **black hole**. Elements heavier than helium are made inside stars and supernovas — we are made of star dust!

> When you look at a distant galaxy, you see light that left it long ago — you are looking back in time.

! A light-year is a distance, not a time.`,
    examples: [
      { q: 'What does red shift tell us?', steps: ['Light from a galaxy that is moving away is stretched to longer, redder wavelengths.', 'Almost all galaxies are red-shifted, so the universe is expanding.'] },
      { q: 'Light from the Sun takes about 500 s to reach us. What does this mean?', steps: ['We see the Sun as it was about 8 minutes ago.', 'If it suddenly vanished, we wouldn’t know for 8 minutes!'] },
    ],
    mistakes: ['Thinking a light-year is a unit of time', 'Picturing the Big Bang as an explosion in space — space itself expanded', 'Thinking red shift means a galaxy looks red'],
    formulas: ['\\text{distance} = \\text{speed} \\times \\text{time}', 'c = 3 \\times 10^{8} \\text{ m/s}'],
    terms: [
      ['Big Bang theory', 'The idea that the universe began from a hot, dense state and has expanded since'],
      ['Red shift', 'Light from galaxies moving away being stretched to longer wavelengths'],
      ['Cosmic microwave background', 'Leftover radiation from the early universe, seen in every direction'],
      ['Galaxy', 'A huge system of billions of stars held together by gravity'],
      ['Light-year', 'The distance light travels in one year'],
      ['Nuclear fusion', 'Small nuclei joining to make bigger ones, releasing energy in stars'],
      ['Nebula', 'A cloud of gas and dust where stars form'],
      ['Supernova', 'The huge explosion of a massive star'],
    ],
    practice: [
      ['Light & distance', K.lightTravel],
      ['Big Bang & stars', bank([
        { q: 'How old is the universe, according to the Big Bang theory?', a: 'About 13.8 billion years', w: ['About 4.6 billion years', 'About 6000 years', 'About 100 million years'], why: '4.6 billion years is the age of Earth and the Sun.' },
        { q: 'What is a light-year?', a: 'The distance light travels in one year', w: ['The time light takes to reach Earth', 'A year on another planet', 'The brightness of a star'], why: 'Despite the name, it measures distance.' },
        { q: 'What powers stars like the Sun?', a: 'Nuclear fusion of hydrogen into helium', w: ['Burning coal', 'Nuclear fission of uranium', 'Chemical reactions with oxygen'], why: 'Huge pressure and temperature in the core fuse hydrogen nuclei.' },
        { q: 'Which galaxy do we live in?', a: 'The Milky Way', w: ['Andromeda', 'The Southern Cross', 'The Magellanic Cloud'], why: 'The Southern Cross is a constellation, not a galaxy.' },
        { q: 'Where do stars form?', a: 'In nebulae — clouds of gas and dust', w: ['Inside black holes', 'On planets', 'In the cosmic microwave background'], why: 'Gravity pulls the gas together until fusion starts.' },
        { q: 'The red shift of distant galaxies shows that…', a: 'they are moving away, so the universe is expanding', w: ['they are made of red rock', 'they are getting hotter', 'they are moving towards us'], why: 'Light from objects moving away is stretched to longer wavelengths.', d: 2 },
        { q: 'What is the cosmic microwave background?', a: 'Leftover radiation from the early universe', w: ['Signals from mobile phones', 'Light from the Sun', 'Radio waves from aliens'], why: 'It is the cooled afterglow of the Big Bang.', d: 2 },
        { q: 'What will the Sun become at the end of its life?', a: 'A red giant, then a white dwarf', w: ['A black hole', 'A neutron star straight away', 'A new planet'], why: 'The Sun isn’t massive enough to explode as a supernova.', d: 2 },
        { q: 'Where were most elements heavier than helium made?', a: 'Inside stars and in supernova explosions', w: ['In the Big Bang only', 'On Earth’s surface', 'Inside black holes'], why: 'Fusion in stars builds heavier nuclei; supernovas scatter them.', d: 3 },
        { q: 'Why do the most distant galaxies show the biggest red shift?', a: 'They are moving away fastest as the universe expands', w: ['They are the hottest', 'They contain the oldest stars', 'They are made of iron'], why: 'Like dots on an inflating balloon, further apart means separating faster.', d: 3 },
      ])],
    ],
  },
  {
    id: 'climate', title: 'Global systems & climate change', strand: 'earth', level: 10, emoji: '🌍', scene: 'climate',
    summary: 'The greenhouse effect, the carbon cycle and a warming world.',
    analogy: { emoji: '🛏️', title: 'An extra blanket', text: 'Greenhouse gases are like a blanket around Earth. One blanket keeps you comfortably warm — without it, Earth would be frozen. But pile on extra blankets (by burning fossil fuels) and you start to overheat.' },
    lesson: `
Earth’s systems interact: the **atmosphere** (air), **hydrosphere** (water), **geosphere** (rock) and **biosphere** (living things). Carbon and water cycle between them.

**The greenhouse effect** is natural and essential:

- Sunlight passes through the atmosphere and warms Earth’s surface.
- The warm surface gives off **infrared** radiation.
- **Greenhouse gases** — carbon dioxide ($\\ce{CO2}$), methane ($\\ce{CH4}$), water vapour and nitrous oxide — absorb some of this infrared and send it back, keeping Earth about 33 °C warmer than it would otherwise be.

**The enhanced greenhouse effect:** since the Industrial Revolution, humans have added extra greenhouse gases by burning **fossil fuels** (coal, oil and gas), **clearing forests** and farming (methane from livestock). Atmospheric $\\ce{CO2}$ has risen from about 280 parts per million to over 420. More heat is trapped, causing **global warming**.

**Effects of climate change:** rising sea levels (melting land ice and warmer water expanding), more extreme weather (heatwaves, droughts, floods, bushfires), coral bleaching and changing ecosystems.

**Responses:** renewable energy (solar, wind, hydro), using energy more efficiently, electric transport, planting trees (carbon sinks) and international agreements.

**Evidence:** temperature records, **ice cores** (air bubbles trapped in ancient ice show past $\\ce{CO2}$ levels), shrinking glaciers and sea ice, and rising sea levels.

! Weather is day-to-day; climate is the average over 30 or more years. One cold day doesn’t disprove global warming.`,
    examples: [
      { q: 'Explain how burning coal leads to global warming.', steps: ['Burning coal releases CO₂.', 'Extra CO₂ absorbs more of the infrared radiation given off by Earth’s surface.', 'More heat is trapped, so the average temperature rises.'] },
      { q: 'How do ice cores tell us about past climate?', steps: ['As snow turns to ice, it traps tiny bubbles of air.', 'Scientists measure the CO₂ in bubbles from deeper (older) layers.'] },
    ],
    mistakes: ['Saying the greenhouse effect is bad — the natural effect keeps Earth liveable; the problem is the enhanced effect', 'Confusing the ozone hole with global warming', 'Confusing weather with climate'],
    formulas: [],
    terms: [
      ['Greenhouse effect', 'Gases in the atmosphere trapping heat and warming Earth'],
      ['Greenhouse gas', 'A gas, such as CO₂ or methane, that absorbs infrared radiation'],
      ['Enhanced greenhouse effect', 'Extra warming caused by greenhouse gases added by humans'],
      ['Fossil fuel', 'Coal, oil or gas formed from the remains of ancient living things'],
      ['Carbon sink', 'Something that absorbs more carbon than it releases, like a forest'],
      ['Climate', 'The average weather conditions over a long period'],
      ['Renewable energy', 'Energy from sources that won’t run out, like the Sun and wind'],
      ['Ice core', 'A cylinder of ancient ice that records past atmospheres'],
    ],
    practice: [
      ['Greenhouse effect', bank([
        { q: 'Which gas contributes most to the enhanced greenhouse effect?', a: 'Carbon dioxide', w: ['Oxygen', 'Nitrogen', 'Helium'], why: 'Burning fossil fuels has raised CO₂ levels by about 50%.' },
        { q: 'What type of radiation do greenhouse gases absorb?', a: 'Infrared', w: ['Ultraviolet only', 'Gamma', 'Radio waves'], why: 'The warm Earth gives off infrared, which greenhouse gases absorb.' },
        { q: 'Without the natural greenhouse effect, Earth would be…', a: 'much colder', w: ['much hotter', 'exactly the same', 'without seasons'], why: 'About −18 °C on average instead of about 15 °C.' },
        { q: 'Which human activity adds the most CO₂ to the air?', a: 'Burning fossil fuels', w: ['Planting trees', 'Recycling paper', 'Using solar panels'], why: 'Coal, oil and gas release carbon that was locked away for millions of years.' },
        { q: 'Why does clearing forests increase CO₂ levels?', a: 'Fewer trees absorb CO₂, and burning or rotting wood releases it', w: ['Trees release CO₂ only when alive', 'Soil absorbs oxygen', 'It makes more clouds'], why: 'Forests are important carbon sinks.', d: 2 },
        { q: 'Cattle farming adds which greenhouse gas?', a: 'Methane', w: ['Oxygen', 'Ozone', 'Hydrogen'], why: 'Cattle digestion produces methane, a powerful greenhouse gas.', d: 2 },
        { q: 'What is the difference between weather and climate?', a: 'Weather is day-to-day; climate is the long-term average', w: ['They mean the same thing', 'Climate is only about temperature', 'Weather is only about rain'], why: 'Climate is averaged over 30 or more years.', d: 2 },
        { q: 'How do ice cores give evidence of past CO₂ levels?', a: 'They contain trapped air bubbles from long ago', w: ['They melt into fossil fuels', 'They show tree rings', 'They contain ancient plants'], why: 'Deeper ice = older air.', d: 3 },
        { q: 'Is the ozone hole the main cause of global warming?', a: 'No — it is a separate problem about ultraviolet radiation', w: ['Yes — it lets heat in', 'Yes — it traps CO₂', 'No — ozone is a fossil fuel'], why: 'The ozone layer blocks UV; global warming is about greenhouse gases trapping infrared.', d: 3 },
      ])],
      ['Impacts & solutions', bank([
        { q: 'Which is a renewable energy source?', a: 'Wind', w: ['Coal', 'Natural gas', 'Oil'], why: 'Wind won’t run out and produces no CO₂ when generating electricity.' },
        { q: 'How do forests act as carbon sinks?', a: 'Trees absorb CO₂ for photosynthesis and store the carbon', w: ['Trees release CO₂ all day', 'Forests reflect sunlight', 'They produce methane'], why: 'The carbon is stored in wood, leaves and roots.' },
        { q: 'Which is a likely effect of climate change in Australia?', a: 'More frequent and intense heatwaves and bushfires', w: ['More snow in Darwin', 'No change at all', 'Colder summers'], why: 'Australia has already warmed by about 1.5 °C since 1910.' },
        { q: 'Which action reduces greenhouse gas emissions most directly?', a: 'Replacing coal power with solar and wind', w: ['Using more air-conditioning', 'Clearing land for farms', 'Driving more'], why: 'Electricity from coal is a major source of CO₂.' },
        { q: 'Why do sea levels rise as Earth warms?', a: 'Land ice melts and warmer water expands', w: ['It rains more over the oceans', 'Fish produce more water', 'The Moon pulls harder'], why: 'Both effects add volume to the oceans.', d: 2 },
        { q: 'Why are coral reefs threatened by climate change?', a: 'Warmer, more acidic oceans cause coral bleaching', w: ['Corals need more CO₂ to grow', 'Sea levels drop', 'Fish eat all the coral'], why: 'Stressed corals expel the algae that feed them.', d: 2 },
        { q: 'Why do oceans become more acidic as CO₂ rises?', a: 'CO₂ dissolves in seawater, forming carbonic acid', w: ['Rain is salty', 'Fish release acid', 'Ice is acidic'], why: 'Oceans have absorbed about a quarter of the CO₂ we have released.', d: 3 },
        { q: 'Melting sea ice can speed up warming because…', a: 'dark ocean water absorbs more sunlight than white ice', w: ['ice releases CO₂ as it melts', 'water is only a greenhouse gas when frozen', 'melting ice is hot'], why: 'This is a positive feedback loop.', d: 3 },
      ])],
    ],
  },
  {
    id: 'inquiry', title: 'Experiments & fair tests', strand: 'skills', level: 9, emoji: '🔬', scene: 'inquiry',
    summary: 'Variables, hypotheses, reliability and errors.',
    analogy: { emoji: '🎛️', title: 'A sound mixing desk', text: 'Imagine a sound desk covered in sliders. To find out what one slider does, you move just that one and leave all the others exactly where they are. A fair test changes one variable at a time.' },
    lesson: `
A good experiment starts with a **question**, a **hypothesis** and a plan.

**Hypothesis:** a testable prediction, often written “If … then … because …”. For example: if the water is warmer, then sugar will dissolve faster, because the particles move faster.

**Variables**

- **Independent variable:** the one thing **you change** on purpose.
- **Dependent variable:** what **you measure** — it depends on the independent variable.
- **Controlled variables:** everything else, which you keep **the same** so it is a **fair test**.

> Memory hook: **I** change the **I**ndependent; the **D**ependent is the **D**ata.

**Reliable and valid results**

- **Repeat** each trial and calculate the **mean** — this makes results more **reliable** and helps you spot **outliers**.
- A **control** (a trial with no change) gives you something to compare with.
- **Accuracy** = how close a result is to the true value. **Precision** = how close repeated results are to each other.
- **Validity** = whether the experiment really tests what it claims to (a fair test).

**Errors**

- **Random errors** are unpredictable (like reaction time with a stopwatch) — reduce them by repeating.
- **Systematic errors** shift every reading the same way (like scales that aren’t zeroed) — fix them by calibrating the equipment.

**Safety:** a **risk assessment** lists the hazards (heat, chemicals, glass) and how to reduce them (safety glasses, tie hair back, use a heatproof mat).

! Changing two variables at once makes the test unfair — you can’t tell which one caused the result.`,
    examples: [
      { q: 'Does the height a ball is dropped from affect how high it bounces? Identify the variables.', steps: ['Independent: drop height (what you change).', 'Dependent: bounce height (what you measure).', 'Controlled: same ball, same surface, same temperature, measured the same way.'] },
      { q: 'Why repeat each trial three times?', steps: ['Repeats reduce the effect of random errors.', 'You can calculate a mean and spot outliers, so the results are more reliable.'] },
    ],
    mistakes: ['Mixing up the independent and dependent variables', 'Saying repeating makes results more accurate — it makes them more reliable', 'Writing a hypothesis that can’t be tested'],
    formulas: ['\\text{mean} = \\dfrac{\\text{sum of results}}{\\text{number of results}}'],
    terms: [
      ['Hypothesis', 'A testable prediction'],
      ['Independent variable', 'The variable you change on purpose'],
      ['Dependent variable', 'The variable you measure'],
      ['Controlled variable', 'A variable kept the same so the test is fair'],
      ['Fair test', 'An experiment where only one variable is changed'],
      ['Reliability', 'How consistent results are when the experiment is repeated'],
      ['Accuracy', 'How close a result is to the true value'],
      ['Outlier', 'A result that doesn’t fit the pattern of the others'],
    ],
    practice: [
      ['Variables', variables],
      ['Averages & outliers', K.trialMean],
      ['Reliability & errors', bank([
        { q: 'Why do scientists repeat experiments?', a: 'To make results more reliable and spot outliers', w: ['To change the hypothesis', 'To make the experiment longer', 'To use more equipment'], why: 'Consistent repeats give confidence in the results.' },
        { q: 'What is a fair test?', a: 'Only one variable is changed; all the others are kept the same', w: ['Everyone in the class gets a turn', 'All the variables are changed at once', 'The teacher checks the results'], why: 'Then any change in results must be caused by the independent variable.' },
        { q: 'Which is the best hypothesis?', a: 'If the water is warmer, then sugar will dissolve faster, because the particles move faster', w: ['Sugar is nice', 'Water and sugar will do something', 'I think it will work'], why: 'It is testable and gives a reason.' },
        { q: 'Which safety equipment protects your eyes?', a: 'Safety glasses', w: ['A heatproof mat', 'A lab coat', 'Gloves'], why: 'Always wear them when heating or using chemicals.' },
        { q: 'A scale shows 2 g with nothing on it. This causes a…', a: 'systematic error', w: ['random error', 'reliable result', 'controlled variable'], why: 'Every reading will be 2 g too high.', d: 2 },
        { q: 'Results that are all very close together are…', a: 'precise', w: ['always accurate', 'outliers', 'invalid'], why: 'Precise results can still be inaccurate if there is a systematic error.', d: 2 },
        { q: 'What is the purpose of a control in an experiment?', a: 'To compare against, so you know the independent variable caused the change', w: ['To make the experiment safer', 'To replace repeat trials', 'To measure the dependent variable'], why: 'For example, a plant given no fertiliser.', d: 2 },
        { q: 'Human reaction time when using a stopwatch causes…', a: 'random errors', w: ['systematic errors', 'no errors', 'controlled variables'], why: 'Sometimes you are early, sometimes late — unpredictably.', d: 2 },
        { q: 'Plants in a growth experiment were given different amounts of water by mistake. The results are…', a: 'not valid, because it wasn’t a fair test', w: ['more reliable', 'more accurate', 'more precise'], why: 'Water became a second independent variable.', d: 3 },
        { q: 'A thermometer always reads 1 °C too high. How can you deal with this?', a: 'Calibrate it, or subtract 1 °C from every reading', w: ['Repeat the experiment more times', 'Use a bigger beaker', 'Take readings faster'], why: 'Repeating doesn’t remove a systematic error.', d: 3 },
      ])],
    ],
  },
  {
    id: 'data', title: 'Data, graphs & conclusions', strand: 'skills', level: 10, emoji: '📈', scene: 'data',
    summary: 'Choosing and reading graphs, trends and writing conclusions.',
    analogy: { emoji: '🕵️', title: 'A detective', text: 'A scientist is like a detective. The data are the clues, the graph lines them up so the pattern jumps out, and the conclusion names the culprit — but only if the evidence really supports it.' },
    lesson: `
**Choosing a graph**

- **Line graph** — when both variables are **numbers** (continuous data), e.g. temperature against time.
- **Bar graph** — when the independent variable is **categories**, e.g. different materials.
- **Pie chart** — parts of a whole (percentages).

**Drawing a good graph:** put the independent variable on the **x-axis** and the dependent variable on the **y-axis**, label both with **units**, use an even scale, and add a **title**. Draw a **line of best fit** — a smooth line or curve with the points scattered evenly either side. Don’t join the dots!

**Reading graphs**

- **Trend:** “As X increases, Y increases (or decreases).”
- **Interpolation:** reading a value **between** your data points.
- **Extrapolation:** extending the line **beyond** your data — less reliable.
- The **gradient** of a straight line (rise ÷ run) often has a meaning, such as a speed or a rate.

**Correlation vs causation:** two things changing together (correlation) doesn’t prove that one causes the other. Ice-cream sales and drownings both rise in summer — hot weather causes both.

**Writing a conclusion**

- State the **trend**, using data as evidence.
- Say whether it **supports** the hypothesis.
- **Evaluate:** sources of error, outliers, and improvements (more repeats, better equipment, a wider range of values).

> Science changes as new evidence arrives — that’s a strength, not a weakness.

! “Proves” is too strong — data **supports** (or doesn’t support) a hypothesis.`,
    examples: [
      { q: 'A student times how long ice takes to melt in cups made of five different materials. Which graph should they draw?', steps: ['The independent variable (material) is categories, not numbers.', 'So use a bar graph.'] },
      { q: 'A straight line of best fit through the origin passes through (2 kg, 6 cm). Predict the stretch for 3 kg.', steps: ['Gradient = 6 ÷ 2 = 3 cm per kg.', '3 × 3 = 9 cm — this is interpolation.'] },
    ],
    mistakes: ['Joining the dots instead of drawing a line of best fit', 'Putting the dependent variable on the x-axis', 'Saying a correlation proves cause and effect'],
    formulas: ['\\text{gradient} = \\dfrac{\\text{rise}}{\\text{run}}'],
    terms: [
      ['Line of best fit', 'A smooth line showing the trend, with points scattered evenly either side'],
      ['Trend', 'The general pattern in a set of data'],
      ['Interpolation', 'Reading a value between measured data points'],
      ['Extrapolation', 'Extending a graph beyond the measured data'],
      ['Correlation', 'A relationship where two variables change together'],
      ['Causation', 'When a change in one variable directly causes a change in another'],
      ['Conclusion', 'A summary of what the results show, linked to the hypothesis'],
      ['Continuous data', 'Data that can take any value within a range'],
    ],
    practice: [
      ['Reading graphs', K.graphGradient],
      ['Graphs & conclusions', bank([
        { q: 'Which graph should you use to compare the strength of four different glues?', a: 'Bar graph', w: ['Line graph', 'Pie chart', 'Scatter plot'], why: 'Glue type is a category, not a number.' },
        { q: 'Which variable goes on the x-axis?', a: 'The independent variable', w: ['The dependent variable', 'A controlled variable', 'Whichever has bigger numbers'], why: 'What you change goes along the bottom.' },
        { q: 'What should a line of best fit look like?', a: 'A smooth line with points scattered evenly either side', w: ['A line joining every dot', 'A line through only the first and last points', 'A zigzag'], why: 'It shows the overall trend, not each point.' },
        { q: 'Reading a value between your data points is called…', a: 'interpolation', w: ['extrapolation', 'correlation', 'calibration'], why: 'Inter = between.', d: 2 },
        { q: 'Why is extrapolation less reliable?', a: 'The pattern might not continue beyond the measured range', w: ['It uses too many data points', 'It only works for bar graphs', 'It is always wrong'], why: 'You have no data out there to check against.', d: 2 },
        { q: 'Ice-cream sales and sunburn both rise in summer. What is the best conclusion?', a: 'They are correlated, but hot sunny weather causes both', w: ['Ice cream causes sunburn', 'Sunburn makes people buy ice cream', 'There is no relationship at all'], why: 'A third factor explains both.', d: 2 },
        { q: 'Which wording is best in a conclusion?', a: 'The results support the hypothesis', w: ['The results prove the hypothesis forever', 'The hypothesis is now a fact', 'The experiment was perfect'], why: 'New evidence could always change our ideas.', d: 2 },
        { q: 'On a temperature–time graph, a steeper line means…', a: 'the temperature is changing faster', w: ['the temperature is higher', 'the experiment took longer', 'there was an error'], why: 'Gradient = rate of change.', d: 2 },
        { q: 'How could you make a conclusion more convincing?', a: 'Repeat the trials and test a wider range of values', w: ['Remove results you don’t like', 'Do only one trial', 'Change several variables at once'], why: 'More data across a wider range gives stronger evidence.', d: 3 },
        { q: 'A data point is far from the line of best fit. What should you do?', a: 'Treat it as a possible outlier — check it and repeat that trial', w: ['Ignore the whole experiment', 'Draw the line through it', 'Change the hypothesis'], why: 'Outliers usually come from a mistake in that trial.', d: 3 },
      ])],
    ],
  },
]
