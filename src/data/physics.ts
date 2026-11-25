import { bank } from '../lib/problem'
import * as K from '../gens/calc'
import type { TopicDef } from './topics'

export const PHYSICS: TopicDef[] = [
  {
    id: 'heat', title: 'Heat transfer', strand: 'physics', level: 9, emoji: '🔥', scene: 'heat',
    summary: 'Conduction, convection and radiation — and how to stop them.',
    analogy: { emoji: '📦', title: 'Three ways to deliver a parcel', text: 'Conduction is passing a parcel hand-to-hand along a line of people. Convection is picking it up and carrying it as you walk around the room. Radiation is throwing it across the gap — nobody needed in between.' },
    lesson: `
**Heat** is energy transferred from a **hotter** object to a **colder** one. **Temperature** measures how hot something is — how fast its particles move on average.

**Conduction** — particles vibrate and pass energy on to their neighbours.

- It happens mainly in **solids**. **Metals** are excellent conductors because they have free electrons.
- **Insulators** (wood, plastic, air, wool) conduct heat poorly.

**Convection** — happens in **liquids and gases**. Warm fluid expands, becomes **less dense** and rises; cooler, denser fluid sinks to take its place, making a **convection current**. That’s why heaters go low in a room and air-conditioners go high.

**Radiation** — energy carried by **infrared waves**. It needs **no particles**, so it can cross a vacuum. That’s how the Sun’s heat reaches Earth.

- **Dark, matt** surfaces absorb and give out radiation well.
- **Light, shiny** surfaces reflect it.

**Reducing heat transfer:** a vacuum flask has a vacuum between its walls (no conduction or convection), shiny walls (reflect radiation) and a stopper (stops convection). Houses use insulation batts, double glazing and curtains.

> Particles in hot objects move faster. When particles bump into each other, the faster ones pass energy to the slower ones.

! “Cold” doesn’t flow into things — heat flows OUT of the warmer object.`,
    examples: [
      { q: 'Why does a metal spoon in hot soup get hot, but a wooden spoon doesn’t?', steps: ['Metals are good conductors — free electrons pass energy along quickly.', 'Wood is an insulator, so energy passes through it very slowly.'] },
      { q: 'Why does a hot-air balloon rise?', steps: ['Heated air expands and becomes less dense.', 'Less dense air rises above the cooler, denser air around it — convection.'] },
    ],
    mistakes: ['Saying “heat rises” — hot fluid rises because it is less dense', 'Saying cold travels into things', 'Thinking radiation needs air to travel through'],
    formulas: [],
    terms: [
      ['Conduction', 'Heat transfer through a material as particles pass on vibrations'],
      ['Convection', 'Heat transfer by the movement of a heated liquid or gas'],
      ['Radiation', 'Heat transfer by infrared waves, which can cross a vacuum'],
      ['Insulator', 'A material that slows down the transfer of heat'],
      ['Conductor', 'A material that lets heat pass through easily'],
      ['Convection current', 'A loop of rising warm fluid and sinking cool fluid'],
      ['Temperature', 'A measure of how hot something is — the average energy of its particles'],
      ['Density', 'Mass per unit of volume; warm fluids are less dense'],
    ],
    practice: [
      ['Conduction, convection, radiation', bank([
        { q: 'How does heat from the Sun reach Earth?', a: 'Radiation', w: ['Conduction', 'Convection', 'Through the air only'], why: 'Space is a vacuum, and only radiation can cross a vacuum.' },
        { q: 'Which way does heat travel mainly through solids?', a: 'Conduction', w: ['Convection', 'Radiation', 'Evaporation'], why: 'In solids, particles are fixed in place but can pass on vibrations.' },
        { q: 'Which is the best conductor of heat?', a: 'Copper', w: ['Wood', 'Plastic', 'Air'], why: 'Metals have free electrons that carry energy quickly.' },
        { q: 'Convection happens in…', a: 'liquids and gases', w: ['solids only', 'a vacuum', 'metals only'], why: 'The particles must be free to flow.' },
        { q: 'Why does warm air rise?', a: 'It expands and becomes less dense', w: ['Heat is lighter than air', 'Hot particles weigh less', 'Warm air has no mass'], why: 'Less dense fluid floats up on denser fluid.', d: 2 },
        { q: 'Why are metals good conductors of heat?', a: 'They have free electrons that carry energy', w: ['They are heavy', 'They are shiny', 'Their particles can’t move'], why: 'Free electrons move through the metal, passing energy on fast.', d: 2 },
        { q: 'Which surface absorbs the most infrared radiation?', a: 'Matt black', w: ['Shiny silver', 'Gloss white', 'A mirror'], why: 'Dark, dull surfaces are the best absorbers (and emitters).', d: 2 },
        { q: 'Why are heaters placed low down in a room?', a: 'Warm air rises from them, setting up a convection current', w: ['Heat sinks to the floor', 'Radiation only travels downwards', 'So they conduct through the floor'], why: 'Rising warm air and sinking cool air circulate around the room.', d: 2 },
        { q: 'Why can radiation travel through space when conduction can’t?', a: 'Radiation is a wave that needs no particles', w: ['Space is too cold for conduction', 'Conduction only works in liquids', 'Radiation is made of particles'], why: 'Conduction and convection both need particles.', d: 3 },
      ])],
      ['Insulation in real life', bank([
        { q: 'Which material is a good insulator?', a: 'Wool', w: ['Aluminium', 'Iron', 'Copper'], why: 'Wool traps air, a poor conductor.' },
        { q: 'Which keeps a cup of tea hot the longest?', a: 'Putting a lid on it', w: ['Stirring it', 'Using a thin metal cup', 'Leaving it near a fan'], why: 'A lid reduces convection and evaporation from the top.' },
        { q: 'Why do houses in hot places often have white roofs?', a: 'Light surfaces reflect more of the Sun’s radiation', w: ['White roofs conduct heat inside', 'White absorbs more heat', 'It increases convection'], why: 'Less radiation absorbed → a cooler house.' },
        { q: 'Why is a woolly jumper warm?', a: 'It traps air, which is a poor conductor', w: ['Wool produces heat', 'Wool reflects all radiation', 'Wool increases convection'], why: 'Trapped air can’t move, so it can’t carry heat away by convection either.', d: 2 },
        { q: 'How does a vacuum flask stop conduction and convection?', a: 'The vacuum between its walls has no particles to carry heat', w: ['Its shiny surfaces stop them', 'Its lid is magnetic', 'It contains ice'], why: 'Both conduction and convection need particles.', d: 2 },
        { q: 'Why are the walls of a vacuum flask shiny?', a: 'To reflect infrared radiation', w: ['To look attractive', 'To conduct heat faster', 'To stop convection'], why: 'Shiny surfaces are poor absorbers and poor emitters of radiation.', d: 2 },
        { q: 'Why does double glazing keep a house warm?', a: 'The trapped air or gas between the panes is a poor conductor', w: ['Glass absorbs all radiation', 'Two panes are heavier', 'It increases convection outside'], why: 'A thin layer of trapped gas slows conduction.', d: 2 },
        { q: 'Why do penguins huddle together in winter?', a: 'Less of each penguin’s surface is exposed to the cold, so they lose less heat', w: ['Huddling creates new heat', 'It increases convection', 'Cold flows into them more slowly'], why: 'Less exposed surface area means slower heat loss.', d: 3 },
        { q: 'A tiled floor feels colder than carpet, even at the same temperature. Why?', a: 'Tiles conduct heat away from your feet faster', w: ['Tiles are actually colder', 'Carpet produces heat', 'Tiles radiate cold'], why: 'Your skin senses how fast heat leaves it, not the floor’s temperature.', d: 3 },
      ])],
    ],
  },
  {
    id: 'waves', title: 'Waves: sound & light', strand: 'physics', level: 9, emoji: '🌊', scene: 'waves',
    summary: 'How waves carry energy, and how sound and light behave.',
    analogy: { emoji: '🏟️', title: 'A Mexican wave', text: 'In a stadium Mexican wave, people only stand up and sit down — nobody runs around the stadium — yet the wave travels all the way round. Waves carry energy from place to place without carrying the material they move through.' },
    lesson: `
A **wave** transfers **energy** without transferring matter.

- **Transverse** waves vibrate at right angles to the direction of travel (light, water waves).
- **Longitudinal** waves vibrate along the direction of travel, making **compressions** and **rarefactions** (sound).

**Describing waves**

- **Wavelength** ($\\lambda$): the distance between two neighbouring crests, in metres.
- **Amplitude**: the height from the middle to a crest. Bigger amplitude = more energy (louder sound, brighter light).
- **Frequency** ($f$): the number of waves each second, in **hertz** (Hz). Higher frequency = higher pitch.

$$v = f\\lambda$$

**Sound** needs a medium (a solid, liquid or gas) — it can’t travel through a vacuum. It is fastest in solids, and travels at about **340 m/s** in air. An **echo** is reflected sound. Humans hear from about 20 Hz to 20 000 Hz; higher than that is **ultrasound** (used for medical scans and sonar).

**Light** is a transverse **electromagnetic** wave. It crosses a vacuum at **300 000 km/s**.

- **Reflection**: the angle of incidence = the angle of reflection.
- **Refraction**: light bends when it changes speed going into a new material — a straw looks bent in water.
- A prism splits white light into a spectrum of colours.

**The electromagnetic spectrum** (longest to shortest wavelength): radio, microwaves, infrared, visible light, ultraviolet, X-rays, gamma rays.

! For an echo, halve the distance — the sound travels there AND back.`,
    examples: [
      { q: 'A wave has a frequency of 5 Hz and a wavelength of 2 m. What is its speed?', steps: ['$v = f\\lambda = 5 \\times 2 = 10$ m/s'] },
      { q: 'An echo from a cliff returns after 2 s. How far away is the cliff? (Sound travels at 340 m/s.)', steps: ['Total distance = 340 × 2 = 680 m.', 'That is there and back, so the cliff is 680 ÷ 2 = 340 m away.'] },
    ],
    mistakes: ['Forgetting to halve the distance for an echo', 'Thinking sound can travel through space', 'Mixing up amplitude (loudness) and frequency (pitch)'],
    formulas: ['v = f\\lambda', '\\text{echo distance} = \\dfrac{v \\times t}{2}'],
    terms: [
      ['Wavelength', 'The distance from one crest to the next'],
      ['Amplitude', 'The height of a wave from the middle to a crest'],
      ['Frequency', 'The number of waves per second, measured in hertz'],
      ['Transverse wave', 'A wave that vibrates at right angles to its direction of travel'],
      ['Longitudinal wave', 'A wave that vibrates along its direction of travel'],
      ['Echo', 'A reflected sound wave'],
      ['Refraction', 'The bending of a wave as it changes speed'],
      ['Electromagnetic spectrum', 'The family of waves from radio waves to gamma rays'],
    ],
    practice: [
      ['Wave equation', K.waveEq],
      ['Echoes', K.echo],
      ['Sound & light', bank([
        { q: 'What do waves transfer?', a: 'Energy', w: ['Matter', 'Water', 'Air particles from place to place'], why: 'The particles vibrate in place; only energy moves along.' },
        { q: 'Sound is a…', a: 'longitudinal wave', w: ['transverse wave', 'electromagnetic wave', 'wave that can cross a vacuum'], why: 'Sound is made of compressions and rarefactions.' },
        { q: 'Why can’t sound travel through space?', a: 'There are no particles to vibrate', w: ['It is too cold', 'Space is too big', 'Light blocks it'], why: 'Sound needs a medium.' },
        { q: 'A louder sound has a bigger…', a: 'amplitude', w: ['frequency', 'wavelength only', 'speed'], why: 'Amplitude is linked to energy, which we hear as loudness.' },
        { q: 'A higher-pitched sound has a higher…', a: 'frequency', w: ['amplitude', 'speed in air', 'wavelength'], why: 'Pitch depends on frequency.' },
        { q: 'What is the unit of frequency?', a: 'Hertz (Hz)', w: ['Metres (m)', 'Decibels (dB)', 'Seconds (s)'], why: '1 Hz = one wave per second.' },
        { q: 'Why does a straw look bent in a glass of water?', a: 'Light refracts as it changes speed between water and air', w: ['Light reflects off the glass', 'The water bends the straw', 'Sound waves distort it'], why: 'Light changes direction when it changes speed.', d: 2 },
        { q: 'Which electromagnetic wave has the shortest wavelength?', a: 'Gamma rays', w: ['Radio waves', 'Visible light', 'Microwaves'], why: 'Radio is longest; gamma is shortest (and has the most energy).', d: 2 },
        { q: 'In which state of matter does sound travel fastest?', a: 'Solids', w: ['Gases', 'Liquids', 'A vacuum'], why: 'Particles in solids are close together and pass vibrations quickly.', d: 2 },
        { q: 'Light hits a mirror at 35° to the normal. What is the angle of reflection?', a: '35°', w: ['55°', '70°', '90°'], why: 'The angle of incidence equals the angle of reflection.', d: 2 },
        { q: 'Ultrasound is used to scan unborn babies because…', a: 'it reflects off tissue boundaries and isn’t ionising', w: ['it can travel through a vacuum', 'it is a type of X-ray', 'it has a very low frequency'], why: 'X-rays would be harmful; ultrasound is safe.', d: 3 },
        { q: 'If a wave’s frequency doubles and its speed stays the same, its wavelength…', a: 'halves', w: ['doubles', 'stays the same', 'is four times bigger'], why: '$\\lambda = v/f$, so doubling $f$ halves $\\lambda$.', d: 3 },
      ])],
    ],
  },
  {
    id: 'electricity', title: 'Electric circuits', strand: 'physics', level: 9, emoji: '💡', scene: 'electricity',
    summary: 'Current, voltage, resistance — and series vs parallel circuits.',
    analogy: { emoji: '🚰', title: 'Water in pipes', text: 'Think of a circuit as water pipes. Voltage is the pump’s push, current is how much water flows past each second, and resistance is a narrow section of pipe that makes it harder for the water to flow.' },
    lesson: `
An electric **circuit** needs a complete loop and an energy source (a cell or battery).

- **Current** ($I$) — the flow of charge (electrons), measured in **amperes (A)** with an **ammeter** connected **in series**.
- **Voltage** ($V$) — the “push”, or energy given to the charge, measured in **volts (V)** with a **voltmeter** connected **in parallel** across a component.
- **Resistance** ($R$) — how much a component opposes the current, measured in **ohms (Ω)**.

**Ohm’s law**

$$V = IR \\qquad I = \\dfrac{V}{R} \\qquad R = \\dfrac{V}{I}$$

**Series circuits** — only one path:

- The **same current** flows everywhere.
- The supply voltage is **shared** between the components.
- Resistances **add up**: $R_T = R_1 + R_2$
- If one bulb breaks, they all go out.

**Parallel circuits** — two or more branches:

- **Each branch gets the full supply voltage.**
- The current **splits** between the branches and adds back up: $I_T = I_1 + I_2$
- If one bulb breaks, the others stay on — that’s how houses are wired.

**Power** is the rate of using energy: $P = VI$, measured in watts (W).

> Ammeter in **series**, voltmeter in **parallel**.

! Current isn’t “used up” — the same current that leaves the battery comes back to it.`,
    examples: [
      { q: 'A 12 V battery is connected to a 4 Ω resistor. What current flows?', steps: ['$I = \\dfrac{V}{R} = \\dfrac{12}{4} = 3$ A'] },
      { q: 'Resistors of 2 Ω and 4 Ω are in series with a 12 V battery. What current flows?', steps: ['$R_T = 2 + 4 = 6$ Ω', '$I = 12 \\div 6 = 2$ A — the same through both resistors.'] },
    ],
    mistakes: ['Saying bulbs use up current', 'Connecting a voltmeter in series', 'Adding up resistances that are in parallel as if they were in series'],
    formulas: ['V = IR', 'R_T = R_1 + R_2 \\quad \\text{(series)}', 'I_T = I_1 + I_2 \\quad \\text{(parallel)}', 'P = VI'],
    terms: [
      ['Current', 'The flow of electric charge, measured in amperes'],
      ['Voltage', 'The energy given to the charge, measured in volts'],
      ['Resistance', 'How much a component opposes current, measured in ohms'],
      ['Series circuit', 'A circuit with only one path for the current'],
      ['Parallel circuit', 'A circuit with two or more branches'],
      ['Ammeter', 'A meter that measures current, connected in series'],
      ['Voltmeter', 'A meter that measures voltage, connected in parallel'],
      ['Power', 'The rate of using energy, measured in watts'],
    ],
    practice: [
      ['Ohm’s law', K.ohm],
      ['Series & parallel', K.seriesParallel],
      ['Circuit ideas', bank([
        { q: 'What is the unit of current?', a: 'Ampere (A)', w: ['Volt (V)', 'Ohm (Ω)', 'Watt (W)'], why: 'Current is measured in amps.' },
        { q: 'What is the unit of resistance?', a: 'Ohm (Ω)', w: ['Ampere (A)', 'Volt (V)', 'Joule (J)'], why: 'Resistance is measured in ohms.' },
        { q: 'How is an ammeter connected?', a: 'In series', w: ['In parallel', 'Across the battery only', 'It isn’t connected'], why: 'All the current must flow through it.' },
        { q: 'How is a voltmeter connected?', a: 'In parallel, across the component', w: ['In series', 'Only next to the switch', 'Inside the battery'], why: 'It compares the energy on either side of the component.' },
        { q: 'In a series circuit, if one bulb blows…', a: 'all the bulbs go out', w: ['only that bulb goes out', 'the others get brighter', 'the battery explodes'], why: 'The only path is broken.' },
        { q: 'Why are houses wired in parallel?', a: 'Each appliance gets the full voltage and can be switched on and off separately', w: ['It uses less wire', 'The current is the same everywhere', 'So that all lights go out together'], why: 'Each branch is its own complete loop.', d: 2 },
        { q: 'In a series circuit, the current is…', a: 'the same everywhere', w: ['bigger near the battery', 'used up by each bulb', 'zero after the first bulb'], why: 'There is only one path, so every charge passes every point.', d: 2 },
        { q: 'If the resistance increases (same voltage), the current…', a: 'decreases', w: ['increases', 'stays the same', 'reverses'], why: '$I = V/R$: bigger $R$ → smaller $I$.', d: 2 },
        { q: 'Two identical bulbs in parallel each get…', a: 'the full battery voltage', w: ['half the battery voltage', 'no voltage', 'double the voltage'], why: 'Each branch is connected directly across the battery.', d: 3 },
        { q: 'A kettle runs on 240 V and draws 10 A. What is its power?', a: '2400 W', w: ['24 W', '250 W', '230 W'], why: '$P = VI = 240 \\times 10 = 2400$ W', d: 3 },
      ])],
    ],
  },
  {
    id: 'motion', title: 'Speed, velocity & acceleration', strand: 'physics', level: 10, emoji: '🏎️', scene: 'motion',
    summary: 'Describing motion with numbers and graphs.',
    analogy: { emoji: '🚗', title: 'A car’s dashboard', text: 'Speed is what the speedometer shows. Velocity is speed plus direction — what a GPS knows. Acceleration is how quickly the speedometer needle is moving, when you press the accelerator or the brake.' },
    lesson: `
**Speed** is how far something travels per unit of time.

$$v = \\dfrac{d}{t} \\qquad \\text{(m/s)}$$

- **Distance** and **speed** are **scalars** — they have size only.
- **Displacement** and **velocity** are **vectors** — they have size **and direction**.

**Acceleration** is the rate of change of velocity:

$$a = \\dfrac{v - u}{t} \\qquad (\\text{m/s}^2)$$

where $u$ is the starting velocity and $v$ is the final velocity. Slowing down gives a **negative** acceleration (deceleration).

**Distance–time graphs**

- The **gradient** (slope) = speed.
- A straight sloping line = constant speed. A flat line = stopped. A curve = changing speed.

**Velocity–time graphs**

- The **gradient** = acceleration.
- The **area under the graph** = distance travelled.
- A flat line = constant velocity.

**Converting units:** km/h ÷ 3.6 = m/s. (72 km/h = 20 m/s.)

> Check your units: distance in metres and time in seconds → speed in m/s.

! A flat line on a distance–time graph means stopped — but on a velocity–time graph it means moving at a steady speed.`,
    examples: [
      { q: 'A car speeds up from 0 to 25 m/s in 5 s. What is its acceleration?', steps: ['$a = \\dfrac{v - u}{t} = \\dfrac{25 - 0}{5} = 5$ m/s²'] },
      { q: 'How far does a runner travel in 40 s at 6 m/s?', steps: ['$d = v \\times t = 6 \\times 40 = 240$ m'] },
    ],
    mistakes: ['Forgetting to convert km/h to m/s (÷ 3.6)', 'Mixing up distance–time and velocity–time graphs', 'Leaving out the negative sign when something slows down'],
    formulas: ['v = \\dfrac{d}{t}', 'a = \\dfrac{v - u}{t}', '\\text{m/s} = \\text{km/h} \\div 3.6'],
    terms: [
      ['Speed', 'Distance travelled per unit of time'],
      ['Velocity', 'Speed in a particular direction'],
      ['Acceleration', 'The rate of change of velocity'],
      ['Displacement', 'Straight-line distance from the start, with a direction'],
      ['Scalar', 'A quantity with size only'],
      ['Vector', 'A quantity with size and direction'],
      ['Deceleration', 'Slowing down — a negative acceleration'],
      ['Gradient', 'The slope of a graph: rise ÷ run'],
    ],
    practice: [
      ['Speed, distance, time', K.speedQ],
      ['Acceleration', K.accelQ],
      ['Motion graphs', K.dtGraph],
      ['Concepts', bank([
        { q: 'Which of these is a vector?', a: 'Velocity', w: ['Speed', 'Distance', 'Time'], why: 'Velocity includes a direction.' },
        { q: 'What is the unit of acceleration?', a: 'm/s²', w: ['m/s', 'km/h', 'N'], why: 'Metres per second, per second.' },
        { q: 'On a distance–time graph, a horizontal line means…', a: 'the object is stationary', w: ['constant speed', 'speeding up', 'slowing down'], why: 'The distance isn’t changing.' },
        { q: 'Two runners have the same speed but run in opposite directions. Their velocities are…', a: 'different', w: ['the same', 'both zero', 'both negative'], why: 'Velocity includes direction.', d: 2 },
        { q: 'On a velocity–time graph, a horizontal line means…', a: 'constant velocity', w: ['stationary', 'constant acceleration', 'slowing down'], why: 'The velocity isn’t changing.', d: 2 },
        { q: 'What does the gradient of a velocity–time graph show?', a: 'Acceleration', w: ['Distance', 'Speed', 'Time'], why: 'Change in velocity ÷ time = acceleration.', d: 2 },
        { q: 'What does the area under a velocity–time graph show?', a: 'Distance travelled', w: ['Acceleration', 'Speed', 'Force'], why: 'Velocity × time = distance.', d: 3 },
        { q: 'A car drives around a roundabout at a steady 30 km/h. Is it accelerating?', a: 'Yes — its direction, and so its velocity, is changing', w: ['No — its speed is constant', 'Only when it stops', 'No — roundabouts have no acceleration'], why: 'Any change in velocity, including direction, is acceleration.', d: 3 },
      ])],
    ],
  },
  {
    id: 'forces', title: 'Forces & Newton’s laws', strand: 'physics', level: 10, emoji: '🚀', scene: 'forces',
    summary: 'Why things start, stop and change direction.',
    analogy: { emoji: '🛒', title: 'Pushing a shopping trolley', text: 'An empty trolley is easy to get moving and easy to stop. A full trolley needs a much bigger push to speed up at the same rate. That’s Newton’s second law: F = ma.' },
    lesson: `
A **force** is a push or a pull, measured in **newtons (N)**. When several forces act, add them up (taking direction into account) to find the **net force**.

**Newton’s first law (inertia):** an object stays still, or keeps moving at a constant velocity, unless a **net force** acts on it. That’s why you lurch forward when a bus brakes — and why seatbelts matter.

**Newton’s second law:** a net force makes an object accelerate.

$$F = ma$$

A bigger force gives a bigger acceleration. A bigger mass gives a smaller acceleration for the same force.

**Newton’s third law:** for every action force there is an **equal and opposite** reaction force, acting on the **other** object. A rocket pushes gas down; the gas pushes the rocket up.

**Mass vs weight**

- **Mass** (kg) is the amount of matter — it’s the same everywhere.
- **Weight** (N) is the force of gravity on that mass: $W = mg$, where $g = 9.8$ N/kg on Earth (1.6 N/kg on the Moon).

**Balanced forces** (net force = 0) → at rest or constant velocity. **Unbalanced forces** → acceleration.

Friction and air resistance oppose motion. Car safety features — crumple zones, airbags, seatbelts — make a collision **last longer**, which reduces the force on the people inside.

! Action–reaction pairs act on DIFFERENT objects, so they never cancel each other out.`,
    examples: [
      { q: 'A 1000 kg car accelerates at 3 m/s². What net force acts on it?', steps: ['$F = ma = 1000 \\times 3 = 3000$ N'] },
      { q: 'A 60 kg astronaut goes to the Moon (g = 1.6 N/kg). What are their mass and weight there?', steps: ['Their mass is still 60 kg.', 'Weight $W = mg = 60 \\times 1.6 = 96$ N'] },
    ],
    mistakes: ['Confusing mass (kg) with weight (N)', 'Forgetting to find the net force before using F = ma', 'Thinking a moving object needs a force to keep moving at a constant speed'],
    formulas: ['F = ma', 'W = mg', 'g = 9.8 \\text{ N/kg on Earth}'],
    terms: [
      ['Force', 'A push or pull, measured in newtons'],
      ['Net force', 'The overall force when all the forces are combined'],
      ['Inertia', 'The tendency of an object to keep doing what it’s doing'],
      ['Mass', 'The amount of matter in an object, in kilograms'],
      ['Weight', 'The force of gravity on a mass, in newtons'],
      ['Friction', 'A force that opposes motion between surfaces'],
      ['Balanced forces', 'Forces that cancel out, so there is no acceleration'],
      ['Newton’s third law', 'Every action force has an equal and opposite reaction force'],
    ],
    practice: [
      ['F = ma', K.fma],
      ['Weight & mass', K.weightQ],
      ['Newton’s laws', bank([
        { q: 'What is the unit of force?', a: 'Newton (N)', w: ['Kilogram (kg)', 'Joule (J)', 'Watt (W)'], why: 'Named after Isaac Newton.' },
        { q: 'A book sits still on a table. The forces on it are…', a: 'balanced', w: ['unbalanced', 'zero because nothing touches it', 'only gravity'], why: 'Gravity pulls down; the table pushes up equally.' },
        { q: 'Why do you lurch forward when a bus suddenly brakes?', a: 'Your body tends to keep moving (inertia)', w: ['The bus pushes you forward', 'Gravity increases', 'Friction pulls you forward'], why: 'Newton’s first law — nothing has stopped your body yet.' },
        { q: 'Which law says F = ma?', a: 'Newton’s second law', w: ['Newton’s first law', 'Newton’s third law', 'Ohm’s law'], why: 'The second law links force, mass and acceleration.' },
        { q: 'A swimmer pushes the water backwards. What pushes the swimmer forwards?', a: 'The water pushing back on the swimmer', w: ['Gravity', 'Air resistance', 'The swimmer’s own mass'], why: 'Newton’s third law: equal and opposite reaction.', d: 2 },
        { q: 'An astronaut travels to the Moon. What happens to their mass?', a: 'It stays the same', w: ['It decreases', 'It increases', 'It becomes zero'], why: 'Only weight changes, because gravity is weaker.', d: 2 },
        { q: 'A car moves at a steady 60 km/h on a straight road. The driving force is…', a: 'equal to the friction and air resistance', w: ['bigger than the resistive forces', 'zero', 'smaller than the resistive forces'], why: 'Constant velocity means balanced forces.', d: 2 },
        { q: 'The same force pushes a 2 kg trolley and a 4 kg trolley. The 2 kg trolley’s acceleration is…', a: 'twice as big', w: ['half as big', 'the same', 'four times as big'], why: '$a = F/m$ — half the mass, double the acceleration.', d: 2 },
        { q: 'Why do airbags reduce injuries in a crash?', a: 'They make the collision last longer, reducing the force', w: ['They make the car heavier', 'They stop the car faster', 'They remove inertia'], why: 'Slowing down over a longer time needs a smaller force.', d: 3 },
        { q: 'Why don’t action–reaction forces cancel out?', a: 'They act on different objects', w: ['They are different sizes', 'They act in the same direction', 'One of them is always friction'], why: 'Forces only cancel if they act on the same object.', d: 3 },
      ])],
    ],
  },
  {
    id: 'energy', title: 'Energy & its conservation', strand: 'physics', level: 10, emoji: '🎢', scene: 'energy',
    summary: 'Kinetic and potential energy, transformations and efficiency.',
    analogy: { emoji: '🎢', title: 'A roller-coaster', text: 'A roller-coaster is hauled to the top and then let go. At the top it has lots of stored (potential) energy; at the bottom that has become movement (kinetic) energy. The energy keeps changing form, but the total never changes.' },
    lesson: `
**Energy** is the ability to make things happen, measured in **joules (J)**.

**Law of conservation of energy:** energy can’t be created or destroyed — only **transformed** from one form to another, or transferred between objects.

**Forms of energy:** kinetic (movement), gravitational potential (height), elastic potential (stretched or squashed), chemical, thermal (heat), electrical, light, sound and nuclear.

**Kinetic energy**

$$E_k = \\tfrac12 mv^2$$

Doubling the speed makes the kinetic energy **four times** bigger.

**Gravitational potential energy**

$$E_p = mgh \\qquad (g = 9.8 \\text{ N/kg})$$

**Transformations:** a falling ball turns $E_p$ into $E_k$; a battery turns chemical energy into electrical energy; a light bulb turns electrical energy into light (and heat).

**Efficiency:** devices waste some energy, usually as heat or sound.

$$\\text{efficiency} = \\dfrac{\\text{useful energy out}}{\\text{total energy in}} \\times 100\\%$$

> A **Sankey diagram** shows energy flows — the width of each arrow shows how much energy.

! No device is 100% efficient — but the wasted energy hasn’t disappeared; it has spread out as heat.`,
    examples: [
      { q: 'A 2 kg ball moves at 3 m/s. What is its kinetic energy?', steps: ['$E_k = \\tfrac12 mv^2 = \\tfrac12 \\times 2 \\times 3^2 = 9$ J'] },
      { q: 'A light bulb uses 100 J and gives out 20 J of light. What is its efficiency?', steps: ['$\\dfrac{20}{100} \\times 100\\% = 20\\%$', 'The other 80 J is wasted as heat.'] },
    ],
    mistakes: ['Forgetting to square the speed in ½mv²', 'Using mass in grams instead of kilograms', 'Saying wasted energy is “destroyed”'],
    formulas: ['E_k = \\tfrac12 mv^2', 'E_p = mgh', '\\text{efficiency} = \\dfrac{\\text{useful out}}{\\text{total in}} \\times 100\\%'],
    terms: [
      ['Kinetic energy', 'The energy of a moving object'],
      ['Gravitational potential energy', 'Energy stored because of an object’s height'],
      ['Conservation of energy', 'Energy can’t be created or destroyed, only transformed'],
      ['Efficiency', 'The percentage of input energy that becomes useful output'],
      ['Joule', 'The unit of energy'],
      ['Energy transformation', 'A change of energy from one form to another'],
      ['Sankey diagram', 'A diagram showing energy flows, with arrow widths for amounts'],
      ['Chemical potential energy', 'Energy stored in substances such as food and fuel'],
    ],
    practice: [
      ['Energy calculations', K.energyQ],
      ['Transformations', bank([
        { q: 'What is the unit of energy?', a: 'Joule (J)', w: ['Newton (N)', 'Watt (W)', 'Volt (V)'], why: 'Energy is measured in joules.' },
        { q: 'A torch changes chemical energy (in the battery) into…', a: 'electrical energy, then light and heat', w: ['nuclear energy', 'kinetic energy only', 'gravitational energy'], why: 'Battery → electrical → bulb → light (+ heat).' },
        { q: 'As a dropped ball falls, its…', a: 'gravitational potential energy turns into kinetic energy', w: ['kinetic energy turns into potential energy', 'energy is destroyed', 'mass increases'], why: 'It loses height and gains speed.' },
        { q: 'What does “conservation of energy” mean?', a: 'Energy can’t be created or destroyed, only changed in form', w: ['We should turn off the lights', 'Energy is lost in every change', 'Energy can be made from nothing'], why: 'The total amount of energy always stays the same.' },
        { q: 'A stretched rubber band stores…', a: 'elastic potential energy', w: ['kinetic energy', 'nuclear energy', 'sound energy'], why: 'Stretched or squashed objects store elastic energy.' },
        { q: 'If a car’s speed doubles, its kinetic energy…', a: 'becomes four times bigger', w: ['doubles', 'stays the same', 'halves'], why: '$E_k \\propto v^2$, and $2^2 = 4$.', d: 2 },
        { q: 'Most wasted energy in devices ends up as…', a: 'heat', w: ['light', 'chemical energy', 'nuclear energy'], why: 'Friction and electrical resistance produce heat.', d: 2 },
        { q: 'Where on its track is a roller-coaster car moving fastest?', a: 'At the lowest point', w: ['At the highest point', 'At the start, before it moves', 'Halfway up a climb'], why: 'Most of its potential energy has become kinetic energy there.', d: 2 },
        { q: 'Why can no machine be 100% efficient?', a: 'Some energy is always transferred as heat, for example through friction', w: ['Energy is destroyed inside machines', 'Machines create extra energy', 'Efficiency is always 50%'], why: 'Wasted energy spreads out into the surroundings.', d: 3 },
        { q: 'On a Sankey diagram, what does the width of an arrow show?', a: 'The amount of energy', w: ['The speed of the energy', 'The type of device', 'The time taken'], why: 'Wider arrow = more joules.', d: 3 },
      ])],
    ],
  },
]
