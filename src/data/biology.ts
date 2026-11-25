import { bank } from '../lib/problem'
import * as K from '../gens/calc'
import type { TopicDef } from './topics'

export const BIOLOGY: TopicDef[] = [
  {
    id: 'nervous', title: 'The nervous system', strand: 'biology', level: 9, emoji: '🧠', scene: 'nervous',
    summary: 'How your body detects changes and responds — in a split second.',
    analogy: { emoji: '📞', title: 'A phone network', text: 'Your nerves work like a phone network. Receptors make the call, sensory neurons carry it to the switchboard (your brain and spinal cord), and motor neurons deliver the reply to your muscles — all in a fraction of a second.' },
    lesson: `
Your body constantly detects changes (**stimuli**) and responds. The **nervous system** does this fast, using electrical signals.

**Stimulus → receptor → sensory neuron → CNS → motor neuron → effector → response**

- **Receptors** detect stimuli: light (eyes), sound (ears), touch, heat and pain (skin), chemicals (nose and tongue).
- The **central nervous system (CNS)** — the brain and spinal cord — processes the information.
- **Effectors** carry out the response: **muscles** contract or **glands** release chemicals.

**Neurons** are long, thin cells that carry electrical impulses. Between two neurons is a tiny gap called a **synapse**. The signal crosses it as chemicals called **neurotransmitters**.

**Reflexes** are automatic, fast responses that protect you — like pulling your hand off a hot stove. The signal goes to the **spinal cord** and straight back out, so you react before your brain even feels the pain.

> Reflex arc: receptor → sensory neuron → relay neuron (in the spinal cord) → motor neuron → muscle.

! A reflex doesn’t need the brain to decide — that’s why it’s so fast.`,
    examples: [
      { q: 'You touch a hot pan and pull your hand away. Describe the pathway.', steps: ['Stimulus: heat. Receptors: heat and pain receptors in the skin.', 'A sensory neuron carries the impulse to the spinal cord.', 'A relay neuron passes it straight to a motor neuron.', 'Effector: arm muscles contract, so your hand pulls away.'] },
      { q: 'Why is a reflex faster than a voluntary action?', steps: ['The impulse only travels to the spinal cord and back.', 'The brain doesn’t have to process it and decide, so the pathway is shorter with fewer synapses.'] },
    ],
    mistakes: ['Saying “the brain controls the reflex” — reflexes are coordinated by the spinal cord', 'Mixing up sensory neurons (towards the CNS) and motor neurons (away from the CNS)', 'Calling the stimulus the response'],
    formulas: [],
    terms: [
      ['Stimulus', 'A change in the environment that the body detects'],
      ['Receptor', 'A cell or organ that detects a stimulus'],
      ['Effector', 'A muscle or gland that carries out a response'],
      ['Neuron', 'A nerve cell that carries electrical impulses'],
      ['Synapse', 'The tiny gap between two neurons'],
      ['Reflex', 'A fast, automatic response that doesn’t involve thinking'],
      ['Central nervous system', 'The brain and spinal cord'],
      ['Neurotransmitter', 'A chemical that carries the signal across a synapse'],
    ],
    practice: [
      ['The pathway', bank([
        { q: 'What is the correct order for a nervous response?', a: 'Stimulus → receptor → CNS → effector → response', w: ['Receptor → stimulus → effector → CNS → response', 'Stimulus → effector → CNS → receptor → response', 'CNS → stimulus → receptor → response → effector'], why: 'A change is detected by a receptor, processed by the CNS, and an effector responds.' },
        { q: 'Which of these is an effector?', a: 'A muscle', w: ['The retina', 'A sensory neuron', 'The spinal cord'], why: 'Effectors carry out the response — muscles and glands.' },
        { q: 'The eye is an example of a…', a: 'receptor (sense organ)', w: ['effector', 'motor neuron', 'synapse'], why: 'The eye contains receptor cells that detect light.' },
        { q: 'What makes up the central nervous system?', a: 'The brain and spinal cord', w: ['The brain and nerves', 'The spinal cord and muscles', 'All the neurons in the body'], why: 'The CNS is the brain plus the spinal cord; nerves elsewhere form the peripheral nervous system.' },
        { q: 'Which stimuli are detected by receptors in the inner ear?', a: 'Sound and balance', w: ['Light', 'Temperature', 'Taste'], why: 'The cochlea detects sound and the semicircular canals detect balance.' },
        { q: 'A sensory neuron carries impulses…', a: 'from receptors to the CNS', w: ['from the CNS to muscles', 'between two muscles', 'from glands to the brain'], why: 'Sensory = from the senses, into the CNS.', d: 2 },
        { q: 'A motor neuron carries impulses…', a: 'from the CNS to effectors', w: ['from receptors to the CNS', 'only within the brain', 'from effectors to receptors'], why: 'Motor neurons make things move — they go out to muscles and glands.', d: 2 },
        { q: 'Your mouth waters when you smell dinner. What is the effector?', a: 'The salivary glands', w: ['The nose', 'The tongue', 'The brain'], why: 'The nose is the receptor; the salivary glands respond by releasing saliva.', d: 2 },
        { q: 'A gland responds to a nerve impulse by…', a: 'releasing (secreting) a chemical', w: ['contracting', 'detecting light', 'sending impulses to the brain'], why: 'Muscles contract; glands secrete substances such as saliva, sweat or hormones.', d: 3 },
      ])],
      ['Reflexes & neurons', bank([
        { q: 'Why are reflexes important?', a: 'They protect the body from harm quickly', w: ['They let you think carefully before acting', 'They only happen when you are asleep', 'They control growth over many years'], why: 'Reflexes are fast and automatic, so they protect you before you have time to think.' },
        { q: 'Which of these is a reflex?', a: 'Blinking when something flies at your eye', w: ['Choosing what to eat', 'Writing your name', 'Deciding to catch a ball'], why: 'Reflexes are automatic — you don’t decide to do them.' },
        { q: 'What is the response in the knee-jerk reflex?', a: 'The leg kicks forward', w: ['The tap on the knee', 'The stretch receptor', 'The spinal cord'], why: 'The tap is the stimulus; the leg kicking is the response.' },
        { q: 'In a reflex arc, which neuron is in the spinal cord?', a: 'The relay neuron', w: ['The receptor', 'The effector', 'The stimulus'], why: 'The relay (inter)neuron links the sensory and motor neurons inside the spinal cord.', d: 2 },
        { q: 'How does a signal cross a synapse?', a: 'Neurotransmitter chemicals diffuse across the gap', w: ['The electrical impulse jumps through the air', 'The two neurons touch and fuse', 'Blood carries it across'], why: 'At the synapse the electrical signal becomes chemical, then electrical again in the next neuron.', d: 2 },
        { q: 'Why is a reflex faster than a voluntary action?', a: 'It skips the brain’s decision-making, so the pathway is shorter', w: ['Reflex neurons are thicker than all others', 'It uses hormones instead of nerves', 'Reflexes happen in the muscles only'], why: 'The signal only goes to the spinal cord and back.', d: 2 },
        { q: 'A drug blocks neurotransmitters at synapses. What would most likely happen?', a: 'Nerve signals would be slowed or stopped', w: ['Reflexes would become faster', 'Muscles would grow larger', 'Receptors would detect more stimuli'], why: 'Without neurotransmitters the signal can’t cross from one neuron to the next.', d: 3 },
        { q: 'A person injures their spinal cord in the neck. Why might they lose feeling in their legs?', a: 'Impulses from the legs can no longer reach the brain', w: ['Their leg receptors stop growing', 'Their legs stop producing hormones', 'The brain stops making neurons'], why: 'Sensory impulses travel up the spinal cord to the brain; damage cuts the pathway.', d: 3 },
      ])],
    ],
  },
  {
    id: 'hormones', title: 'Hormones & homeostasis', strand: 'biology', level: 9, emoji: '🌡️', scene: 'hormones',
    summary: 'Chemical messengers that keep your body’s conditions just right.',
    analogy: { emoji: '🏠', title: 'A home thermostat', text: 'Homeostasis works like the thermostat in a house. If the room gets too hot, the cooling switches on; too cold, and the heater kicks in. Your body is constantly correcting itself to keep conditions steady.' },
    lesson: `
The **endocrine system** uses **hormones** — chemical messengers made by **glands** and carried in the **blood** to target organs. Hormones are slower than nerves, but their effects last longer.

- **Pancreas** → insulin and glucagon (blood glucose)
- **Adrenal glands** → adrenaline (“fight or flight”)
- **Thyroid** → thyroxine (metabolism)
- **Pituitary** → the “master gland” that controls other glands
- **Ovaries and testes** → oestrogen and testosterone (puberty)

**Homeostasis** means keeping the internal environment stable: body temperature (about 37 °C), blood glucose and water levels.

It works by **negative feedback**: a change is detected, and the body responds to **reverse** it.

- Too hot → sweating, blood vessels near the skin widen (**vasodilation**) → you cool down
- Too cold → shivering, vessels narrow (**vasoconstriction**), hairs stand up → you warm up
- Blood glucose too high → the pancreas releases **insulin** → cells take up glucose and the liver stores it
- Blood glucose too low → the pancreas releases **glucagon** → the liver releases glucose

> Nerves: fast, electrical, short-lived. Hormones: slower, chemical, longer-lasting.

! In type 1 diabetes the pancreas doesn’t make enough insulin, so blood glucose stays too high.`,
    examples: [
      { q: 'After lunch your blood glucose rises. Explain how it returns to normal.', steps: ['The pancreas detects the high blood glucose.', 'It releases insulin into the blood.', 'Insulin makes cells take up glucose and the liver store it as glycogen.', 'Blood glucose falls back to normal — negative feedback.'] },
      { q: 'Compare nervous and hormonal responses.', steps: ['Nervous: electrical impulses along neurons — very fast, short-lived, precise target.', 'Hormonal: chemicals carried in the blood — slower, longer-lasting, can affect many organs.'] },
    ],
    mistakes: ['Saying hormones travel along nerves — they travel in the blood', 'Mixing up insulin (lowers blood glucose) and glucagon (raises it)', 'Thinking “negative feedback” is bad — it simply reverses a change'],
    formulas: [],
    terms: [
      ['Hormone', 'A chemical messenger carried in the blood'],
      ['Gland', 'An organ that makes and releases hormones'],
      ['Homeostasis', 'Keeping the body’s internal conditions stable'],
      ['Negative feedback', 'A response that reverses a change back to normal'],
      ['Insulin', 'The hormone that lowers blood glucose'],
      ['Glucagon', 'The hormone that raises blood glucose'],
      ['Adrenaline', 'The hormone that prepares the body for “fight or flight”'],
      ['Vasodilation', 'Widening of blood vessels near the skin to lose heat'],
    ],
    practice: [
      ['Hormones & glands', bank([
        { q: 'How do hormones travel around the body?', a: 'In the blood', w: ['Along neurons', 'Through the lymph nodes only', 'Through the air in the lungs'], why: 'Glands release hormones into the bloodstream.' },
        { q: 'Which gland makes insulin?', a: 'Pancreas', w: ['Thyroid', 'Adrenal gland', 'Pituitary'], why: 'The pancreas makes both insulin and glucagon.' },
        { q: 'Which hormone causes the “fight or flight” response?', a: 'Adrenaline', w: ['Insulin', 'Thyroxine', 'Oestrogen'], why: 'Adrenaline (from the adrenal glands) speeds up heart rate and breathing.' },
        { q: 'Which gland is called the “master gland”?', a: 'Pituitary', w: ['Pancreas', 'Thyroid', 'Adrenal'], why: 'The pituitary releases hormones that control many other glands.' },
        { q: 'Compared with nerve signals, hormone responses are usually…', a: 'slower but longer-lasting', w: ['faster and shorter', 'faster and longer-lasting', 'exactly the same speed'], why: 'Hormones travel in the blood (slower) and stay there for a while (longer-lasting).', d: 2 },
        { q: 'Adrenaline increases your heart rate. Why is that useful in danger?', a: 'More oxygen and glucose reach the muscles', w: ['It helps you fall asleep', 'It lowers blood glucose', 'It slows breathing to save energy'], why: 'Muscles need extra oxygen and glucose to fight or run.', d: 2 },
        { q: 'Which hormone controls the rate of metabolism?', a: 'Thyroxine', w: ['Glucagon', 'Adrenaline', 'Testosterone'], why: 'Thyroxine from the thyroid gland controls how fast cells use energy.', d: 2 },
        { q: 'Why does a hormone only affect certain organs?', a: 'Only its target cells have receptors for it', w: ['It is only made in those organs', 'Blood only flows to those organs', 'Other organs destroy it instantly'], why: 'Every cell receives the hormone, but only cells with matching receptors respond.', d: 3 },
      ])],
      ['Homeostasis', bank([
        { q: 'What is homeostasis?', a: 'Keeping internal conditions stable', w: ['Growing new cells', 'Responding to danger quickly', 'Digesting food'], why: 'Homeostasis keeps temperature, glucose and water levels steady.' },
        { q: 'Normal human body temperature is about…', a: '37 °C', w: ['25 °C', '42 °C', '33 °C'], why: 'Enzymes in the body work best at about 37 °C.' },
        { q: 'When you get too hot, you…', a: 'sweat, and blood vessels near the skin widen', w: ['shiver, and blood vessels narrow', 'release glucagon', 'breathe more slowly'], why: 'Sweat evaporates and takes heat away; wider vessels bring warm blood to the surface to lose heat.' },
        { q: 'Shivering warms you up because…', a: 'muscle contractions release heat', w: ['it reduces sweating', 'it lowers blood glucose', 'it widens blood vessels'], why: 'Respiration in contracting muscles releases heat energy.', d: 2 },
        { q: 'Blood glucose is too high. The pancreas releases…', a: 'insulin, which lowers it', w: ['glucagon, which lowers it', 'insulin, which raises it', 'adrenaline, which lowers it'], why: 'Insulin makes cells take up glucose, lowering blood glucose.', d: 2 },
        { q: 'Why is homeostasis an example of negative feedback?', a: 'The response reverses the original change', w: ['The response makes the change bigger', 'It only happens when you are sick', 'It uses nerves but never hormones'], why: 'Negative feedback pushes conditions back towards normal.', d: 2 },
        { q: 'A person with type 1 diabetes injects insulin after a meal. Why?', a: 'Their pancreas can’t make enough insulin to lower blood glucose', w: ['Their liver makes too much insulin', 'Insulin raises their blood glucose', 'Insulin replaces the food they ate'], why: 'Without insulin, glucose stays in the blood instead of entering cells.', d: 3 },
        { q: 'On a cold day, why does your skin look paler?', a: 'Blood vessels near the skin narrow to keep heat in', w: ['Sweat makes the skin lighter', 'You have less blood in cold weather', 'Glucagon changes skin colour'], why: 'Vasoconstriction sends less blood to the skin surface, so less heat is lost.', d: 3 },
      ])],
    ],
  },
  {
    id: 'immunity', title: 'Disease & immunity', strand: 'biology', level: 9, emoji: '🦠', scene: 'immunity',
    summary: 'How germs make us sick, and how the body fights back.',
    analogy: { emoji: '🏰', title: 'Defending a castle', text: 'Your skin is the castle wall. White blood cells are the guards who attack invaders, and antibodies are like “wanted” posters — once your body has seen a germ, it recognises it instantly next time.' },
    lesson: `
**Pathogens** are microorganisms that cause **infectious disease**: **bacteria**, **viruses**, **fungi** and **parasites**. They spread by touch, droplets in the air, contaminated food and water, and animals called vectors (like mosquitoes).

**First line of defence — keep pathogens out**

- Skin, mucus and tiny hairs (**cilia**) in the airways
- Stomach acid, and tears and saliva containing enzymes

**Second line — attack any invader:** inflammation, fever, and white blood cells called **phagocytes** that engulf pathogens.

**Third line — a targeted attack:** white blood cells called **lymphocytes** make **antibodies** that fit one particular **antigen** (a marker on the pathogen) like a key in a lock. **Memory cells** remember it, so a second infection is fought off much faster — you are **immune**.

**Vaccines** contain a dead, weakened or partial pathogen. They create memory cells without making you sick. When enough people are vaccinated, **herd immunity** protects those who can’t be.

> **Antibiotics** kill bacteria but **not** viruses. Overusing them helps antibiotic-resistant bacteria spread.

! Antibodies are specific — the antibody for measles won’t work against the flu.`,
    examples: [
      { q: 'Why don’t you usually catch chickenpox twice?', steps: ['The first infection makes lymphocytes produce antibodies.', 'Memory cells stay in the blood afterwards.', 'Next time they recognise the antigen and make antibodies fast — before you feel sick.'] },
      { q: 'Why won’t antibiotics cure a cold?', steps: ['Colds are caused by viruses.', 'Antibiotics only kill bacteria, so they have no effect on viruses.'] },
    ],
    mistakes: ['Saying antibiotics kill viruses', 'Mixing up antigens (on the pathogen) and antibodies (made by your body)', 'Thinking vaccines contain a full-strength disease'],
    formulas: [],
    terms: [
      ['Pathogen', 'A microorganism that causes disease'],
      ['Antigen', 'A marker on a pathogen that the immune system recognises'],
      ['Antibody', 'A protein made by lymphocytes that targets one specific antigen'],
      ['Phagocyte', 'A white blood cell that engulfs pathogens'],
      ['Vaccine', 'A harmless form of a pathogen that triggers immunity'],
      ['Antibiotic', 'A medicine that kills bacteria'],
      ['Immunity', 'Protection from a disease because memory cells recognise it'],
      ['Herd immunity', 'Protection of a community when most people are immune'],
    ],
    practice: [
      ['Pathogens & defences', bank([
        { q: 'Which of these is NOT a pathogen?', a: 'A white blood cell', w: ['A virus', 'A bacterium', 'A fungus'], why: 'White blood cells are part of your immune system — they fight pathogens.' },
        { q: 'Which is part of the first line of defence?', a: 'Skin', w: ['Antibodies', 'Memory cells', 'Vaccines'], why: 'The first line stops pathogens getting in at all: skin, mucus, cilia, stomach acid.' },
        { q: 'How do mosquitoes spread malaria?', a: 'They carry the parasite from person to person (a vector)', w: ['Through drinking water', 'By touching skin', 'Through the air like a cold'], why: 'A vector is an animal that carries a pathogen between hosts.' },
        { q: 'What do phagocytes do?', a: 'Engulf and digest pathogens', w: ['Make antibodies', 'Carry oxygen', 'Send nerve impulses'], why: 'Phagocytes surround and destroy any invader.' },
        { q: 'Why is washing your hands before eating important?', a: 'It removes pathogens you could swallow', w: ['It makes antibiotics work better', 'It creates memory cells', 'It stops fever'], why: 'Hands pick up pathogens from surfaces; washing removes them.' },
        { q: 'How do mucus and cilia protect your airways?', a: 'Mucus traps pathogens and cilia sweep them away', w: ['They make antibodies', 'They kill viruses with acid', 'They produce a fever'], why: 'The sticky mucus is moved up and out of the airways by the beating cilia.', d: 2 },
        { q: 'Why does a fever help fight infection?', a: 'A higher temperature slows pathogens and speeds up immune cells', w: ['It kills all bacteria instantly', 'It makes antibodies', 'It stops the heart pumping germs'], why: 'Many pathogens reproduce slowly at higher temperatures.', d: 2 },
        { q: 'Sneezing into your elbow reduces the spread of disease mainly because…', a: 'it stops droplets carrying pathogens into the air and onto hands', w: ['it kills viruses on your arm', 'it makes you immune', 'it creates antibodies'], why: 'Many respiratory pathogens spread in droplets.', d: 2 },
      ])],
      ['Immune response & vaccines', bank([
        { q: 'Antibodies are made by…', a: 'lymphocytes', w: ['red blood cells', 'phagocytes', 'platelets'], why: 'Lymphocytes are white blood cells that produce antibodies.' },
        { q: 'What does a vaccine contain?', a: 'A dead, weakened or partial pathogen', w: ['Antibiotics', 'A full-strength live pathogen', 'White blood cells'], why: 'It shows your immune system the antigen safely.' },
        { q: 'Antibiotics are useful against…', a: 'bacteria', w: ['viruses', 'all pathogens', 'allergies'], why: 'Antibiotics attack parts of bacterial cells that viruses don’t have.' },
        { q: 'Why does a second infection by the same pathogen usually not make you sick?', a: 'Memory cells make antibodies quickly', w: ['The pathogen is weaker the second time', 'Antibiotics stay in your blood', 'Your skin becomes thicker'], why: 'The immune system recognises the antigen and responds before symptoms appear.', d: 2 },
        { q: 'Why does an antibody only work against one pathogen?', a: 'Its shape fits only one specific antigen', w: ['It is only made in one organ', 'It only lives for one day', 'Other pathogens are too big'], why: 'Antibodies and antigens fit together like a lock and key.', d: 2 },
        { q: 'How does herd immunity protect a baby too young to be vaccinated?', a: 'If most people are immune, the pathogen can’t spread to reach the baby', w: ['The baby gets antibodies from the air', 'Vaccines work on everyone nearby', 'The baby’s skin becomes immune'], why: 'The chain of infection is broken by immune people.', d: 3 },
        { q: 'Doctors worry about overusing antibiotics because…', a: 'it helps resistant bacteria survive and spread', w: ['it makes viruses stronger', 'antibiotics cause fever', 'it destroys memory cells'], why: 'Natural selection: antibiotics kill the non-resistant bacteria, leaving the resistant ones.', d: 3 },
        { q: 'Why do some vaccines need booster shots?', a: 'To keep enough memory cells and antibodies over time', w: ['Because the first vaccine was an antibiotic', 'To kill bacteria that survived', 'Because the vaccine itself contains antibodies'], why: 'Immunity can fade; a booster reminds the immune system.', d: 3 },
      ])],
    ],
  },
  {
    id: 'ecosystems', title: 'Ecosystems & energy flow', strand: 'biology', level: 9, emoji: '🌿', scene: 'ecosystems',
    summary: 'How energy flows and matter cycles through living communities.',
    analogy: { emoji: '💸', title: 'Passing money down a line', text: 'Imagine passing \\$100 along a line of people, but each person spends \\$90 before passing it on. By the fourth person there’s only 10 cents left! Energy moves through a food chain the same way — about 90% is used up at every step.' },
    lesson: `
An **ecosystem** is a community of living things (**biotic** factors) interacting with their non-living environment (**abiotic** factors: light, temperature, water, soil).

**Energy flows** in one direction:

- **Producers** (plants and algae) capture light energy by **photosynthesis**.
- **Consumers** eat other organisms: herbivores (primary consumers), then carnivores (secondary and tertiary consumers).
- **Decomposers** (bacteria and fungi) break down dead matter and return nutrients to the soil.

$$\\ce{6CO2 + 6H2O ->[light] C6H12O6 + 6O2}$$

Only about **10%** of the energy at one level passes to the next. The rest is lost as **heat** (from respiration), movement and waste. That’s why food chains rarely have more than 4–5 levels, and why there are fewer top predators.

**Matter cycles** — it is used again and again:

- **Carbon cycle:** photosynthesis removes $\\ce{CO2}$ from the air; respiration, decomposition and burning fossil fuels put it back.
- **Respiration** releases energy from glucose in every living cell.

$$\\ce{C6H12O6 + 6O2 -> 6CO2 + 6H2O}$$

> Arrows in a food chain point the way energy flows: grass → rabbit means the rabbit eats the grass.

! Energy flows (and is lost as heat); matter cycles (and is reused).`,
    examples: [
      { q: 'In grass → rabbit → fox, the grass has 50 000 kJ of energy. How much reaches the fox?', steps: ['Two steps, about 10% each.', '50 000 × 0.1 = 5000 kJ reaches the rabbits.', '5000 × 0.1 = 500 kJ reaches the foxes.'] },
      { q: 'Snakes are removed from an ecosystem. What happens to the mice they ate?', steps: ['Fewer predators, so mouse numbers rise at first.', 'More mice eat more seeds; food may run short and their numbers can fall again.'] },
    ],
    mistakes: ['Drawing food-chain arrows from predator to prey — they point from the eaten to the eater', 'Saying energy is “recycled” — it is lost as heat; only matter cycles', 'Forgetting decomposers when explaining nutrient cycles'],
    formulas: ['\\ce{6CO2 + 6H2O -> C6H12O6 + 6O2}', '\\ce{C6H12O6 + 6O2 -> 6CO2 + 6H2O}'],
    terms: [
      ['Producer', 'An organism that makes its own food by photosynthesis'],
      ['Consumer', 'An organism that eats other organisms for energy'],
      ['Decomposer', 'An organism that breaks down dead matter and recycles nutrients'],
      ['Trophic level', 'A feeding level in a food chain'],
      ['Biotic factor', 'A living part of an ecosystem'],
      ['Abiotic factor', 'A non-living part of an ecosystem, like light or temperature'],
      ['Photosynthesis', 'Plants using light energy to make glucose from carbon dioxide and water'],
      ['Respiration', 'Releasing energy from glucose inside cells'],
    ],
    practice: [
      ['Energy transfer', K.energyPyramid],
      ['Food webs & cycles', bank([
        { q: 'In grass → grasshopper → frog → snake, which is the producer?', a: 'Grass', w: ['Grasshopper', 'Frog', 'Snake'], why: 'Producers make their own food by photosynthesis — plants.' },
        { q: 'Which organism is a decomposer?', a: 'A mushroom (fungus)', w: ['A kangaroo', 'A eucalyptus tree', 'An eagle'], why: 'Fungi and bacteria break down dead matter.' },
        { q: 'Which is an abiotic factor?', a: 'Temperature', w: ['Bacteria', 'Predators', 'Grass'], why: 'Abiotic = non-living.' },
        { q: 'What do the arrows in a food chain show?', a: 'The direction energy flows', w: ['Which animal is bigger', 'Who eats whom, from predator to prey', 'The direction animals move'], why: 'The arrow points from the food to the feeder.' },
        { q: 'Which process removes carbon dioxide from the air?', a: 'Photosynthesis', w: ['Respiration', 'Burning fossil fuels', 'Decomposition'], why: 'Plants use CO₂ to make glucose.' },
        { q: 'Which process releases carbon dioxide back into the air?', a: 'Respiration', w: ['Photosynthesis', 'Making glucose', 'Absorbing sunlight'], why: 'Cells break down glucose and release CO₂.' },
        { q: 'An animal that eats both plants and animals is…', a: 'an omnivore', w: ['a herbivore', 'a producer', 'a decomposer'], why: 'Omni = all.' },
        { q: 'Why is most energy lost between trophic levels?', a: 'It is used in respiration and lost as heat, movement and waste', w: ['Plants hide energy in their roots', 'Predators are lazy', 'Digestion destroys energy'], why: 'Only about 10% is stored in new body tissue that the next level can eat.', d: 2 },
        { q: 'Foxes are removed from an ecosystem. What is the most likely short-term effect on rabbits?', a: 'Rabbit numbers increase', w: ['Rabbit numbers decrease', 'No change', 'Rabbits become producers'], why: 'Fewer predators means more rabbits survive.', d: 2 },
        { q: 'Why are there usually far fewer eagles than mice?', a: 'Less energy is available at higher trophic levels', w: ['Eagles choose to have fewer babies', 'Mice are producers', 'Eagles are decomposers'], why: 'With 90% lost at each step, only a little energy can support top predators.', d: 2 },
        { q: 'What would happen to soil nutrients without decomposers?', a: 'They would stay locked in dead matter and run out', w: ['They would increase', 'Plants would make their own', 'Nothing would change'], why: 'Decomposers return nutrients to the soil for plants to reuse.', d: 3 },
        { q: 'A pesticide builds up in a food chain. Which organism ends up with the highest concentration?', a: 'The top predator', w: ['The producer', 'The primary consumer', 'The decomposer'], why: 'Each predator eats many prey, concentrating the chemical (biomagnification).', d: 3 },
      ])],
    ],
  },
  {
    id: 'dna', title: 'DNA, genes & cell division', strand: 'biology', level: 10, emoji: '🧬', scene: 'dna',
    summary: 'The code of life, and how cells copy it.',
    analogy: { emoji: '📚', title: 'A recipe book', text: 'Your DNA is a giant recipe book. Each chromosome is a volume, each gene is one recipe (for a protein), and the four bases A, T, C and G are the letters the recipes are written in.' },
    lesson: `
**DNA** (deoxyribonucleic acid) carries the instructions for building and running every living thing.

- DNA is a **double helix** — like a twisted ladder.
- The rungs are pairs of **bases**: **A pairs with T**, and **C pairs with G**.
- A **gene** is a section of DNA that codes for a **protein**. The order of the bases is the code.
- DNA is coiled into **chromosomes** in the nucleus. Human body cells have **46** chromosomes (23 pairs).

**Mutations** are changes in the DNA base sequence, caused by copying errors, radiation (UV, X-rays) or some chemicals. Most have no effect, some are harmful, and a few are helpful.

**Cell division**

- **Mitosis** makes **two identical** body cells, each with 46 chromosomes — for growth and repair.
- **Meiosis** makes **four different** sex cells (**gametes**: sperm and eggs) with **half** the chromosomes (23). At fertilisation, 23 + 23 = 46.

> Memory hook: mi**t**osis → **t**wo identical cells. Meiosis → making eggs and sperm.

! Meiosis creates variation — that’s why siblings (except identical twins) look different.`,
    examples: [
      { q: 'One DNA strand reads ATGCCA. What is the complementary strand?', steps: ['A pairs with T, C pairs with G.', 'ATGCCA → TACGGT'] },
      { q: 'A skin cell has 46 chromosomes. How many does a sperm cell have, and why?', steps: ['Sperm are made by meiosis, which halves the chromosome number.', '46 ÷ 2 = 23, so fertilisation restores 46.'] },
    ],
    mistakes: ['Pairing A with G, or C with T', 'Mixing up mitosis (identical body cells) and meiosis (gametes with half the chromosomes)', 'Thinking all mutations are harmful'],
    formulas: [],
    terms: [
      ['DNA', 'The molecule that carries genetic instructions'],
      ['Gene', 'A section of DNA that codes for a protein'],
      ['Chromosome', 'A tightly coiled package of DNA'],
      ['Base pair', 'Two bases joined across the DNA ladder: A–T or C–G'],
      ['Mutation', 'A change in the DNA base sequence'],
      ['Mitosis', 'Cell division that makes two identical body cells'],
      ['Meiosis', 'Cell division that makes four sex cells with half the chromosomes'],
      ['Gamete', 'A sex cell: a sperm or an egg'],
    ],
    practice: [
      ['Base pairing', K.basePairs],
      ['Genes & cell division', bank([
        { q: 'Which base pairs with adenine (A) in DNA?', a: 'Thymine (T)', w: ['Guanine (G)', 'Cytosine (C)', 'Uracil (U)'], why: 'A–T and C–G.' },
        { q: 'What is a gene?', a: 'A section of DNA that codes for a protein', w: ['A whole chromosome', 'A type of cell', 'A single base'], why: 'Genes are the “recipes” within the DNA.' },
        { q: 'How many chromosomes are in a normal human body cell?', a: '46', w: ['23', '92', '48'], why: '23 pairs — one of each pair from each parent.' },
        { q: 'Mitosis produces…', a: 'two identical body cells', w: ['four different sex cells', 'two sex cells with half the DNA', 'one large cell'], why: 'Mitosis copies the cell exactly, for growth and repair.' },
        { q: 'Where in a cell is DNA found?', a: 'In the nucleus', w: ['In the cell membrane', 'In the cell wall', 'Only in the cytoplasm'], why: 'Chromosomes are stored in the nucleus.' },
        { q: 'What is the shape of a DNA molecule?', a: 'A double helix', w: ['A single straight line', 'A ring of proteins', 'A cube'], why: 'Two strands twisted around each other, like a spiral ladder.' },
        { q: 'Which of these could cause a mutation?', a: 'Too much UV radiation', w: ['Drinking water', 'Eating fruit', 'Exercise'], why: 'UV, X-rays and some chemicals can damage DNA.' },
        { q: 'Why do gametes have only 23 chromosomes?', a: 'So that fertilisation restores the full 46', w: ['Because they are smaller cells', 'Because half the DNA is damaged', 'So they divide faster'], why: '23 from the sperm + 23 from the egg = 46.', d: 2 },
        { q: 'Which process repairs a cut on your skin?', a: 'Mitosis', w: ['Meiosis', 'Fertilisation', 'Mutation'], why: 'New identical skin cells are made by mitosis.', d: 2 },
        { q: 'A mutation changes one base in a gene. Why might this affect the organism?', a: 'The protein made from that gene could change shape and stop working', w: ['The whole chromosome disappears', 'The cell will divide by meiosis', 'The DNA turns into protein'], why: 'The base sequence decides the protein; change it and the protein may change.', d: 3 },
        { q: 'Why do children of the same parents look different (unless identical twins)?', a: 'Meiosis shuffles the chromosomes, so every gamete is different', w: ['Mitosis makes random changes', 'Each child gets 46 chromosomes from each parent', 'Genes change after birth'], why: 'Each sperm and egg carries a different mix of the parent’s chromosomes.', d: 3 },
      ])],
    ],
  },
  {
    id: 'inheritance', title: 'Inheritance & Punnett squares', strand: 'biology', level: 10, emoji: '👨‍👩‍👧', scene: 'inheritance',
    summary: 'How features are passed from parents to children.',
    analogy: { emoji: '🃏', title: 'Being dealt cards', text: 'For every gene you’re dealt two cards — one from each parent. Which card you get is random. When a dominant card and a recessive card are together, the dominant one always shows.' },
    lesson: `
You inherit **two copies** of each gene — one from each parent. These versions are called **alleles**.

- A **dominant** allele (capital letter, $B$) shows whenever it’s present.
- A **recessive** allele (lowercase, $b$) only shows if there are **two** of them ($bb$).
- **Genotype** = the alleles you have ($BB$, $Bb$ or $bb$). **Phenotype** = the feature you see (brown or blue eyes).
- **Homozygous** = two the same ($BB$ or $bb$). **Heterozygous** = two different ($Bb$).

**Punnett squares** show the possible offspring. Write one parent’s alleles across the top and the other’s down the side, then fill in each box.

For $Bb \\times Bb$ the boxes are $BB$, $Bb$, $Bb$, $bb$: a **3 : 1** ratio of brown to blue, so each child has a **25%** chance of blue eyes.

**Pedigree charts** trace a trait through a family: squares are males, circles are females, and shaded shapes have the trait.

> Each box is a 25% chance for **each** child — it doesn’t mean exactly 1 in every 4 children.

! Two parents with the dominant phenotype can have a child with the recessive one — if both are heterozygous.`,
    examples: [
      { q: 'Tall ($T$) is dominant over short ($t$). What is the chance of a short plant from $Tt \\times tt$?', steps: ['Top: $T$, $t$. Side: $t$, $t$.', 'Boxes: $Tt$, $tt$, $Tt$, $tt$.', '2 of the 4 boxes are $tt$ → 50% chance of short.'] },
      { q: 'Two brown-eyed parents have a blue-eyed child. What are the parents’ genotypes?', steps: ['The child is $bb$, so it got a $b$ from each parent.', 'Both parents show brown, so each must be $Bb$.'] },
    ],
    mistakes: ['Thinking “dominant” means more common', 'Mixing up genotype (the letters) and phenotype (what you see)', 'Saying a 3 : 1 ratio guarantees exactly 3 of every 4 children'],
    formulas: [],
    terms: [
      ['Allele', 'A different version of the same gene'],
      ['Dominant', 'An allele that shows even if only one copy is present'],
      ['Recessive', 'An allele that only shows when there are two copies'],
      ['Genotype', 'The pair of alleles an organism has'],
      ['Phenotype', 'The characteristic you can observe'],
      ['Homozygous', 'Having two identical alleles'],
      ['Heterozygous', 'Having two different alleles'],
      ['Punnett square', 'A grid showing the possible offspring of a cross'],
    ],
    practice: [
      ['Punnett squares', K.punnett],
      ['Genotypes & pedigrees', bank([
        { q: 'Which genotype is heterozygous?', a: 'Bb', w: ['BB', 'bb', 'BBb'], why: 'Hetero = different: one dominant, one recessive allele.' },
        { q: 'Brown ($B$) is dominant over blue ($b$). What colour are the eyes of someone who is $Bb$?', a: 'Brown', w: ['Blue', 'Half brown, half blue', 'Green'], why: 'One dominant allele is enough to show.' },
        { q: 'Which genotype shows the recessive trait?', a: 'bb', w: ['Bb', 'BB', 'bB'], why: 'Recessive traits need two recessive alleles.' },
        { q: 'What does “phenotype” mean?', a: 'The physical trait you can observe', w: ['The letters for the alleles', 'The number of chromosomes', 'A type of cell division'], why: 'Genotype = letters; phenotype = what you see.' },
        { q: 'Two heterozygous parents ($Tt \\times Tt$): what is the ratio of tall to short offspring?', a: '3 : 1', w: ['1 : 1', '1 : 3', 'All tall'], why: 'TT, Tt, Tt, tt → 3 tall : 1 short.', d: 2 },
        { q: 'A $BB$ parent and a $bb$ parent have children. What eye colour will they have?', a: 'All brown (Bb)', w: ['All blue', 'Half brown, half blue', '1 in 4 blue'], why: 'Every child gets a $B$ and a $b$.', d: 2 },
        { q: 'In a pedigree chart, what does a shaded circle represent?', a: 'A female with the trait', w: ['A male with the trait', 'A female without the trait', 'A male carrier'], why: 'Circles are female, squares are male; shading means the trait is shown.', d: 2 },
        { q: 'Two parents without a disease have a child who has it. What does this suggest?', a: 'The disease allele is recessive and both parents are carriers', w: ['The disease is dominant', 'The environment caused it in every cell', 'Only the mother passed it on'], why: 'Both parents must be heterozygous, passing a recessive allele each.', d: 3 },
        { q: 'Why can a dominant allele still be rare?', a: '“Dominant” describes how it’s expressed, not how common it is', w: ['Dominant alleles are always rare', 'Recessive alleles take over', 'Meiosis destroys dominant alleles'], why: 'For example, the allele for Huntington’s disease is dominant but rare.', d: 3 },
        { q: 'A brown-eyed parent crossed with a blue-eyed ($bb$) parent has half brown, half blue children. What is the brown parent’s genotype?', a: 'Bb', w: ['BB', 'bb', 'Impossible to tell'], why: 'A $BB$ parent would give only brown children.', d: 3 },
      ])],
    ],
  },
  {
    id: 'evolution', title: 'Evolution & natural selection', strand: 'biology', level: 10, emoji: '🦋', scene: 'evolution',
    summary: 'How populations change over many generations.',
    analogy: { emoji: '🙈', title: 'Hide-and-seek with moths', text: 'Imagine moths of every shade resting on dark tree bark. Birds spot and eat the pale ones first. The dark moths survive to breed, so the next generation has more dark moths. Nobody chose — the environment did the selecting.' },
    lesson: `
**Evolution** is the change in the inherited features of a population over many generations. Charles **Darwin** explained it with **natural selection**:

- **Variation** — individuals in a population differ (because of mutations and meiosis).
- **Overproduction** — more offspring are born than can survive.
- **Struggle to survive** — they compete for food, mates and territory, and face predators and disease.
- **Survival of the fittest** — individuals with helpful variations (**adaptations**) are more likely to survive and **reproduce**.
- **Inheritance** — they pass the helpful alleles on, so the population changes over generations.

If populations are isolated and change in different ways, they can become separate **species** (they can no longer interbreed to produce fertile offspring).

**Evidence for evolution:** the fossil record, comparative anatomy (the same bones in a human arm, whale flipper and bat wing), DNA similarities, and seeing it happen — like antibiotic-resistant bacteria.

> Adaptations can be **structural** (body shape), **behavioural** (migration) or **physiological** (making venom).

! Individuals don’t evolve during their lifetime — **populations** evolve over generations.`,
    examples: [
      { q: 'Explain how bacteria become resistant to antibiotics.', steps: ['Variation: by chance mutation, a few bacteria are resistant.', 'The antibiotic kills the non-resistant bacteria.', 'The resistant ones survive and reproduce.', 'Over many generations, the population is mostly resistant.'] },
      { q: 'Why do bat wings and human arms have the same bones?', steps: ['They are homologous structures.', 'This suggests bats and humans share a common ancestor.'] },
    ],
    mistakes: ['Saying animals “try” or “need” to adapt — the variation is random and already there', 'Thinking individuals evolve during their lifetime', 'Thinking “fittest” means strongest — it means best suited to survive and reproduce'],
    formulas: [],
    terms: [
      ['Natural selection', 'Organisms better suited to their environment survive and reproduce more'],
      ['Adaptation', 'An inherited feature that helps an organism survive'],
      ['Variation', 'Differences between individuals of the same species'],
      ['Species', 'A group that can interbreed to produce fertile offspring'],
      ['Fossil', 'Preserved remains or traces of an ancient organism'],
      ['Extinction', 'When every member of a species has died'],
      ['Selection pressure', 'A factor, like predators or climate, that affects survival'],
      ['Common ancestor', 'An earlier species from which two later species both evolved'],
    ],
    practice: [
      ['Natural selection', bank([
        { q: 'What does natural selection act on?', a: 'Variation that already exists in a population', w: ['Changes animals decide to make', 'Features gained during life', 'Only harmful mutations'], why: 'Selection can only choose between variations that are already there.' },
        { q: 'What is the first requirement for natural selection?', a: 'Variation in the population', w: ['A large predator', 'A change in climate', 'Extinction'], why: 'Without differences there is nothing to select between.' },
        { q: '“Survival of the fittest” means…', a: 'the best-suited individuals survive and reproduce more', w: ['the strongest always win fights', 'the biggest animals live longest', 'the fastest runners evolve'], why: '“Fit” means well suited to the environment.' },
        { q: 'Why must a helpful variation be inherited for evolution to happen?', a: 'So it is passed on to the next generation', w: ['So the individual lives longer', 'So it can be learned', 'So the environment can change it'], why: 'Only inherited (genetic) features can change a population over generations.', d: 2 },
        { q: 'Rabbits living in a snowy area are mostly white. What is the best explanation?', a: 'White rabbits were less likely to be eaten, so they bred more', w: ['Rabbits turned white to hide', 'Snow bleached their fur', 'Predators prefer brown food'], why: 'Camouflaged rabbits survived to pass on the allele for white fur.', d: 2 },
        { q: 'Pests become resistant to a pesticide after years of spraying. Why?', a: 'Resistant individuals survived and passed on their genes', w: ['Each pest learned to avoid it', 'The pesticide caused all of them to become resistant', 'The pesticide got weaker'], why: 'The pesticide is a selection pressure.', d: 2 },
        { q: 'Two populations of a species are separated by mountains for a million years. What might happen?', a: 'They could evolve into separate species', w: ['They will stay exactly the same', 'They will both become extinct', 'They will merge back into one'], why: 'Different selection pressures and mutations build up on each side.', d: 3 },
        { q: 'Why can evolution be seen quickly in bacteria?', a: 'They reproduce very fast, so there are many generations', w: ['They are bigger than animals', 'They have no DNA', 'They choose to change'], why: 'Some bacteria divide every 20 minutes.', d: 3 },
      ])],
      ['Evidence & adaptations', bank([
        { q: 'Which provides evidence for evolution?', a: 'The fossil record', w: ['Weather forecasts', 'Learned behaviour', 'Haircuts'], why: 'Fossils show how life has changed over time.' },
        { q: 'A polar bear’s thick fur is an example of a…', a: 'structural adaptation', w: ['behavioural adaptation', 'physiological adaptation', 'mutation during its life'], why: 'Structural = a physical body feature.' },
        { q: 'Birds migrating north for summer is an example of a…', a: 'behavioural adaptation', w: ['structural adaptation', 'physiological adaptation', 'fossil'], why: 'Behavioural = something the organism does.' },
        { q: 'A snake making venom is a…', a: 'physiological adaptation', w: ['structural adaptation', 'behavioural adaptation', 'learned skill'], why: 'Physiological = a body process or chemical.', d: 2 },
        { q: 'Human arms, whale flippers and bat wings contain the same bones. This suggests…', a: 'they share a common ancestor', w: ['they are the same species', 'they are all extinct', 'it is a coincidence'], why: 'These are homologous structures.', d: 2 },
        { q: 'Two species have very similar DNA. What does this suggest?', a: 'They share a recent common ancestor', w: ['They can interbreed', 'One is the fossil of the other', 'They live in the same place'], why: 'The more similar the DNA, the more recently they split.', d: 2 },
        { q: 'Why are older fossils usually found in deeper rock layers?', a: 'Layers build up over time, so lower layers formed earlier', w: ['Heavy fossils sink', 'Old fossils dig downward', 'Water pushes them down'], why: 'Sedimentary layers are laid down one on top of another.', d: 3 },
        { q: 'Why are there gaps in the fossil record?', a: 'Fossils only form in rare conditions, and many are destroyed', w: ['Some species never existed', 'Evolution stopped for a while', 'Scientists haven’t looked anywhere'], why: 'Most organisms decay before they can fossilise.', d: 3 },
      ])],
    ],
  },
]
