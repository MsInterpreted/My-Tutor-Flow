export const book = {
  id: 'comprehension-pre-advanced',
  series: 'comprehension',
  level: 'Pre-Advanced',
  title: 'PEEL Comprehension Workbook',
  subtitle: 'Pre-Advanced Level',
  color: '#7C3AED',
  lightColor: '#EDE9FE',
  description:
    'Develop analytical reading and structured written responses using the PEEL method.',
  units: [
    {
      id: 1,
      title: 'Climate Change and Our World',
      image: '/images/comprehension-preadvanced-unit-1.webp',
      imagePrompt:
        'A split-screen editorial illustration: on the left, a pristine boreal forest reflected in a glassy lake under a cool blue sky; on the right, the same landscape fractured by wildfire smoke, a receding glacier, and flooded coastline. In the foreground, a scientist in a field jacket holds a tablet displaying a rising CO2 graph, while a young activist holds a handwritten sign. Muted documentary palette, cinematic lighting, shallow depth of field.',
      passage: `Few scientific questions are now as settled, or as politically unsettled, as climate change. The Intergovernmental Panel on Climate Change has concluded, with greater than ninety-five percent certainty, that the warming observed since the mid-twentieth century is the consequence of human activity — principally the combustion of fossil fuels, the clearing of forests, and intensive agriculture. The mechanism is not contested among scientists: greenhouse gases trap outgoing heat, and their atmospheric concentration, once stable for millennia, has risen precipitously within a single human lifetime.

The consequences are no longer speculative. Global average temperatures have climbed by approximately 1.2 degrees Celsius above pre-industrial levels; oceans have absorbed the equivalent of billions of atomic detonations of heat; ice sheets in Greenland and West Antarctica are losing mass at rates that alarm even veteran glaciologists. Biodiversity is collapsing along a wavefront of shifting climate zones. Extreme weather — once measured in decades — now arrives in seasons. Climate scientist Katharine Hayhoe has warned that "climate change is a threat multiplier, taking issues like poverty, hunger, disease and conflict, and making them worse."

The international response has been the Paris Agreement of 2015, in which nearly every nation pledged to limit warming to well below two degrees. Yet a decade on, current policies place the world on a trajectory closer to three degrees — a world in which coral reefs vanish, monsoons falter, and hundreds of millions are displaced. The gap between what is pledged and what is done has become the defining feature of climate diplomacy.

Why this gap? The technologies of decarbonisation — solar, wind, storage, electrified transport — have become dramatically cheaper. The economic case is clear. What remains absent, critics argue, is not capability but political will: the willingness of governments to confront entrenched fossil interests, price carbon honestly, and accept that justice between generations demands sacrifice from this one. The climate problem, in the final analysis, may be less a problem of science than of courage.`,
      vocabulary: ['precipitously', 'glaciologists', 'decarbonisation', 'trajectory', 'entrenched'],
      peelQuestions: [
        {
          question:
            'What does the writer suggest about the true nature of the climate problem, and how does the structure of the final paragraph reinforce this suggestion?',
          tier: 'inferential',
          scaffold: {
            P: 'The writer suggests that the climate problem is fundamentally one of _____ rather than _____, and the final paragraph reinforces this by _____.',
            E: 'This is evident when the writer states: "What remains absent, critics argue, is not capability but political will." The concluding sentence further claims that "The climate problem, in the final analysis, may be less a problem of science than of courage."',
            E2: 'The phrase "problem of courage" is significant because it implies _____, shifting the frame from a technical diagnosis to a moral one, and suggesting that _____.',
            L: 'This connects to the broader argument that _____, which challenges the reader to consider whether responsibility lies with _____.',
          },
        },
        {
          question:
            'Evaluate the effectiveness of the writer\'s decision to include Katharine Hayhoe\'s quotation and the comparison of ocean warming to "billions of atomic detonations." Do these rhetorical choices strengthen or weaken the argument?',
          tier: 'evaluative',
          scaffold: {
            P: 'I believe these rhetorical choices largely (strengthen/weaken) the argument because _____.',
            E: 'Hayhoe\'s quote — "climate change is a threat multiplier, taking issues like poverty, hunger, disease and conflict, and making them worse" — lends _____, while the image of "billions of atomic detonations of heat" serves to _____.',
            E2: 'In my view, these choices are significant because _____, demonstrating that _____ and challenging the notion that climate data alone can _____.',
            L: 'This connects to the broader question of how scientific evidence should be communicated, and suggests that _____.',
          },
        },
        {
          question:
            'To what extent is the writer justified in concluding that climate change is "a problem of courage" rather than a problem of science? Weigh the evidence presented.',
          tier: 'evaluative',
          scaffold: {
            P: 'In my opinion, the writer\'s conclusion is (fully/partially/insufficiently) justified because _____.',
            E: 'In support of this view, the passage cites that "technologies of decarbonisation — solar, wind, storage, electrified transport — have become dramatically cheaper" and that "the economic case is clear." However, one might also note that _____.',
            E2: 'I believe framing the issue as moral rather than technical is significant because _____, demonstrating that _____ and challenging the assumption that climate change can be solved purely through _____.',
            L: 'This connects to broader debates about intergenerational justice, and suggests that responsibility ultimately lies with _____.',
          },
        },
      ],
    },
    {
      id: 2,
      title: 'The Power of Music',
      image: '/images/comprehension-preadvanced-unit-2.webp',
      imagePrompt:
        'A layered illustration in warm, saturated colours: at the centre, a pair of headphones radiating concentric sound waves; within the waves, silhouettes of people across eras — a tribal drummer, a 1960s civil rights marcher singing, a hospice patient listening with a therapist, a teenager streaming on a phone. Subtle neural pathways thread between the figures, suggesting music\'s cognitive reach. Painterly style with a touch of surrealism.',
      passage: `Music is perhaps the most universal of human practices. No society, however remote or ancient, has been discovered without it. The archaeological record yields bone flutes more than forty thousand years old, predating agriculture, cities, and the written word. Long before humans could write down what they thought, they were already singing what they felt.

Modern neuroscience has begun to explain why. Listening to music engages an unusually wide network of brain regions — auditory, motor, limbic, and prefrontal. Pleasurable music triggers the release of dopamine in the same reward circuits implicated in food and love. Rhythm synchronises neural oscillations, while melody shapes expectation and its release. Clinical music therapy, once dismissed as soft adjunct, now has a rigorous evidence base: it measurably reduces anxiety in surgical patients, assists stroke survivors in recovering speech, and brings reminiscence to people living with advanced dementia when little else can.

Yet music\'s social power may matter as much as its neurological one. Songs mark identity — national, religious, generational. They bind communities, carry memory across diasporas, and give voice to dissent. The civil rights movement was not only marched but sung; "We Shall Overcome" was a theology of hope compressed into a melody. Similar threads run through the protest music of apartheid South Africa, the Chilean nueva canción, and the samizdat tapes of the Soviet era. Music, in such moments, is not decoration but infrastructure.

The digital age has transformed how music reaches us. Streaming platforms have placed almost every recording in human history a tap away, democratising access on an extraordinary scale. But critics note that the economics have shifted ruthlessly against musicians themselves, while algorithms increasingly curate taste rather than expand it. The listener gains breadth; the artist loses ground.

What remains unchanged is the underlying fact. Long after the playlists are forgotten, people will still, in moments of joy and sorrow, reach for a song. Music is not an accessory to human life. It is one of the ways we are human.`,
      vocabulary: ['adjunct', 'oscillations', 'diasporas', 'samizdat', 'democratising'],
      peelQuestions: [
        {
          question:
            'What does the writer imply by describing music as "infrastructure" rather than "decoration" during protest movements, and why is this distinction significant?',
          tier: 'inferential',
          scaffold: {
            P: 'The writer implies that music is _____ to political struggle, by deliberately contrasting "infrastructure" with "decoration".',
            E: 'This is evident in: "Music, in such moments, is not decoration but infrastructure." The writer reinforces this by referencing protest traditions from "the civil rights movement", "apartheid South Africa", "the Chilean nueva canción, and the samizdat tapes of the Soviet era."',
            E2: 'The metaphor of "infrastructure" is significant because it reframes music as _____, meaning _____, and suggesting that movements cannot function without _____.',
            L: 'This connects to the broader argument that music is not an accessory to human life, and challenges readers to reconsider _____.',
          },
        },
        {
          question:
            'Evaluate the writer\'s use of specific historical examples (civil rights, apartheid, nueva canción, samizdat). How effectively do they support the claim that music is a political force?',
          tier: 'evaluative',
          scaffold: {
            P: 'I believe the writer\'s use of these examples is (highly/partly) effective because _____.',
            E: 'The examples demonstrate that "The civil rights movement was not only marched but sung; \'We Shall Overcome\' was a theology of hope compressed into a melody." The writer then extends the pattern across "apartheid South Africa, the Chilean nueva canción, and the samizdat tapes of the Soviet era."',
            E2: 'In my view, drawing on four different continents and regimes is significant because _____, demonstrating that music\'s political power is _____ and challenging the notion that protest is only _____.',
            L: 'This connects to a broader understanding of how art and politics intersect, and suggests that _____.',
          },
        },
        {
          question:
            'The writer concludes that "the listener gains breadth; the artist loses ground." To what extent does this balanced judgement about digital streaming hold up against the passage\'s other claims?',
          tier: 'evaluative',
          scaffold: {
            P: 'The writer\'s balanced judgement is largely/partially sustainable because _____.',
            E: 'On one hand, the passage notes that "___________." On the other, "___________."',
            E2: 'The significance of this tension is _____ because _____, demonstrating that technological change _____ and challenging the simple narrative that _____.',
            L: 'This connects to broader debates about _____ in the creative economy, raising important questions about _____, suggesting that _____.',
          },
        },
      ],
    },
    {
      id: 3,
      title: 'The Importance of Education',
      image: '/images/comprehension-preadvanced-unit-3.webp',
      imagePrompt:
        'A documentary-style composition: in the foreground, a girl in a rural village reads under a single solar lamp; in the middle distance, a half-built schoolhouse with a faded UN flag; in the background, a modern urban classroom with screens but empty desks. A chalkboard in the centre reads "Article 26" in several languages. Warm late-afternoon light, a palette of earth tones and deep blues, suggesting both hope and unfinished work.',
      passage: `Education is among the most widely affirmed human rights. Article 26 of the 1948 Universal Declaration of Human Rights asserts that everyone has the right to education, and that elementary schooling shall be free and compulsory. In the decades since, that principle has been restated in countless conventions, constitutions, and campaign speeches. It is a rare consensus in a contentious world.

Yet consensus on the page has not translated neatly into reality. UNESCO estimates that around 260 million children and adolescents remain out of school, the majority of them girls, and disproportionately children affected by conflict, disability, or poverty. In parts of the Sahel, a decade of instability has emptied entire school districts. In refugee populations, fewer than half of secondary-age children are enrolled. The right exists; the access, for many, does not.

Even where children do attend, another crisis has emerged, one that the World Bank has termed "learning poverty." It is estimated that more than half of ten-year-olds in low- and middle-income countries cannot read and understand a simple story. Enrolment figures, long the headline metric, can obscure this quieter failure. A child may sit in a classroom for years and still leave without the foundational literacy and numeracy that schooling is supposed to guarantee. Access, in other words, is not the same as quality — and quality is not the same as learning.

What, then, does genuine reform require? Some argue for more resources: better-trained teachers, smaller classes, textbooks in the languages children actually speak. Others insist the problem is structural, bound up with inequality, gender norms, and the political economy of who benefits from an educated population. Still others warn against the uncritical export of Western curricula into contexts with different needs and knowledge traditions.

These debates are unlikely to resolve neatly. What is clear is that the ambition of 1948 — education as a universal birthright — remains a destination rather than an arrival. The work of turning a declared right into a lived one is the unfinished project of our century.`,
      vocabulary: ['compulsory', 'contentious', 'disproportionately', 'enrolment', 'uncritical'],
      peelQuestions: [
        {
          question:
            'What does the writer imply by the repeated sentence structure "Access, in other words, is not the same as quality — and quality is not the same as learning"? How does this rhetorical device advance the argument?',
          tier: 'inferential',
          scaffold: {
            P: 'The writer implies through this tripartite structure that _____, in order to _____.',
            E: 'This is developed earlier in the passage: "___________." The structure then compresses this into: "___________."',
            E2: 'The choice to use escalating contrasts is significant because it implies _____, meaning _____, and exposing the assumption that _____.',
            L: 'This connects to the broader argument that _____, which challenges the reader to move beyond _____ towards _____.',
          },
        },
        {
          question:
            'Evaluate how the writer balances multiple perspectives on educational reform (resource-based, structural, and post-colonial). Is this pluralism a strength or an evasion?',
          tier: 'evaluative',
          scaffold: {
            P: 'The writer\'s presentation of multiple perspectives is principally a strength/evasion because _____.',
            E: 'The passage outlines the resource view ("___________"), the structural view ("___________"), and the critique of Western export.',
            E2: 'The significance of holding these perspectives in tension is _____ because _____, demonstrating that _____ and challenging the notion that _____.',
            L: 'This connects to broader debates about _____ in global development, raising important questions about _____, and suggesting that _____.',
          },
        },
        {
          question:
            'The passage closes by calling universal education "a destination rather than an arrival." Evaluate whether the evidence in the passage justifies such measured pessimism.',
          tier: 'evaluative',
          scaffold: {
            P: 'The writer\'s measured pessimism is justified/only partly justified because _____.',
            E: 'Supporting evidence includes "___________" and "___________." However, one might counter that _____.',
            E2: 'The significance of framing progress as unfinished rather than failed is _____ because _____, demonstrating that _____ and challenging the assumption that _____.',
            L: 'This connects to broader questions about _____, raising the issue of _____, and suggesting that _____.',
          },
        },
      ],
    },
    {
      id: 4,
      title: 'Technology in Modern Life',
      image: '/images/comprehension-preadvanced-unit-4.webp',
      imagePrompt:
        'A double-exposure illustration: on one face of a smartphone screen, a surgeon uses AI imaging to find a tumour, a child in a remote village attends a video lesson, and a deaf user signs through a translation app; on the reverse, a teenager scrolls anxiously at midnight, a surveillance camera watches a crowd, and an elderly hand struggles with a locked interface. The phone is held in the centre of the frame by a diverse pair of hands. Clean editorial illustration, muted gradients, high contrast.',
      passage: `It has become a cliché to observe that technology is transforming modern life. What is less often said is that the transformation is not a single story. Digital tools are neither the liberators their enthusiasts proclaim nor the destroyers their critics fear. They are, more accurately, amplifiers — intensifying capacities already present in human societies, for better and for worse.

The case for optimism is substantial. Artificial intelligence now detects early-stage cancers in radiology with accuracy comparable to senior specialists. Remote learning platforms have brought instruction to regions where qualified teachers are scarce, and, during recent pandemic closures, kept entire education systems tethered to some version of continuity. Messaging services permit migrant families to maintain daily intimacy across oceans. Assistive technologies — screen readers, real-time captioning, speech generators — have expanded participation for people with disabilities in ways unimaginable a generation ago.

Yet the same infrastructures carry serious costs. Recommender algorithms, optimised for engagement rather than accuracy, can herd users into filter bubbles in which conspiracy thrives and common ground erodes. Mass data collection has made surveillance possible at scales that would have astonished twentieth-century authoritarians. Longitudinal research has linked intensive social media use with rising rates of anxiety and depression in adolescent girls, though causation remains debated. Meanwhile, a persistent "digital divide" means that the poorest, rural, and elderly populations are often excluded from services that have quietly become essential — banking, identification, health records, employment.

If technology amplifies, then the decisive question is: which human capacities do we choose to amplify? The same platform that convenes democratic deliberation can be weaponised for harassment. The same algorithms that personalise learning can profile citizens for discrimination. Neither outcome is inevitable; both are products of design choices, regulatory frameworks, and public willingness to engage.

The future of the digital age, in other words, is not something that will happen to us. It is something we are, collectively, now choosing — whether we notice or not.`,
      vocabulary: ['amplifiers', 'longitudinal', 'authoritarians', 'deliberation', 'regulatory'],
      peelQuestions: [
        {
          question:
            'What does the writer imply by insisting that technology is an "amplifier" rather than a liberator or destroyer, and how does this framing structure the argument that follows?',
          tier: 'inferential',
          scaffold: {
            P: 'The writer implies that _____ by rejecting _____ in favour of _____.',
            E: 'This framing appears early — "___________" — and governs the later contrast between "___________" and "___________."',
            E2: 'The metaphor of the "amplifier" is significant because it implies _____, meaning _____, and redirecting responsibility from _____ to _____.',
            L: 'This connects to the broader argument that _____, which challenges readers to reconsider _____.',
          },
        },
        {
          question:
            'Evaluate how effectively the writer balances benefits and harms. Does the passage achieve genuine even-handedness, or does it tilt towards one side?',
          tier: 'evaluative',
          scaffold: {
            P: 'The writer\'s balance is largely genuine/subtly tilted because _____.',
            E: 'On the benefit side, the writer cites "___________." On the harm side, "___________." Notably, "___________."',
            E2: 'The significance of this balance is _____ because _____, demonstrating that _____ and challenging the notion that _____.',
            L: 'This connects to the broader question of _____, raising important issues about _____, and suggesting that _____.',
          },
        },
        {
          question:
            'Assess the writer\'s claim that the future of technology is "something we are, collectively, now choosing." Is this empowering, or does it understate structural forces?',
          tier: 'evaluative',
          scaffold: {
            P: 'The writer\'s claim is empowering/partially misleading because _____.',
            E: 'The argument rests on "___________" and is reinforced by "___________." Yet one might object that _____.',
            E2: 'The significance of framing agency at the collective level is _____ because _____, demonstrating that _____ and challenging the assumption that _____.',
            L: 'This connects to broader debates about _____ in technological governance, raising questions about _____, and suggesting that _____.',
          },
        },
      ],
    },
    {
      id: 5,
      title: 'Biodiversity and Ecosystems',
      image: '/images/comprehension-preadvanced-unit-5.webp',
      imagePrompt:
        'A painterly cross-section of a coral reef transitioning into a tropical forest and then into agricultural monoculture, each zone losing species as the eye moves rightward. Above, an aeroplane in flight has rivets being pulled one by one from its wing. Scientific illustration aesthetic meets editorial surrealism. Rich blues and greens fading into bleached ochres.',
      passage: `Biodiversity is the term biologists use for the variety of living forms on Earth — the species, the genetic variation within them, and the ecosystems they compose. It is easy, in a world of concrete and screens, to regard this variety as ornamental: pleasant to visit, perhaps, but peripheral to the real work of economies and states. A half-century of ecological research suggests the opposite.

The natural world supplies, at no charge, the services that make civilisation possible. Wild pollinators sustain roughly seventy-five percent of the crop species on which human diets depend. Coastal mangroves and reefs absorb storm surges that would otherwise devastate cities. Forests regulate rainfall hundreds of kilometres inland, purify water, and store vast quantities of carbon that, if released, would accelerate warming. One large study estimated the annual economic value of global ecosystem services in the tens of trillions of dollars — a figure comparable to global GDP itself.

These services are now in jeopardy. Scientists increasingly refer to the present moment as a "sixth mass extinction," the first in sixty-six million years and the first ever driven by a single species. Vertebrate populations have declined, on average, by more than two-thirds since 1970. Primary drivers are well understood: habitat destruction, especially for agriculture; overexploitation, through fishing and hunting; climate change; pollution; and invasive species. The causes are neither mysterious nor inevitable.

The ecologist Paul Ehrlich once offered a chilling metaphor. Imagine, he wrote, boarding an aeroplane and noticing a mechanic removing rivets from the wing. How many rivets can be removed before the plane falls from the sky? You cannot know in advance, and by the time you find out, it is too late. Each species lost is a rivet; each ecosystem weakened, a section of fuselage strained. The plane, for now, still flies.

The argument for conservation, then, is not sentimental but strategic. Protecting biodiversity is not a luxury for wealthy nations. It is the maintenance of the system on which every nation, every economy, and every human future depends.`,
      vocabulary: ['peripheral', 'pollinators', 'overexploitation', 'fuselage', 'sentimental'],
      peelQuestions: [
        {
          question:
            'What does the writer imply by juxtaposing "ornamental" biodiversity with the language of "services," "trillions of dollars," and "strategic" conservation?',
          tier: 'inferential',
          scaffold: {
            P: 'The writer implies that _____ by reframing nature in _____ terms.',
            E: 'This shift is signalled in: "___________." It is reinforced later by "___________."',
            E2: 'The deliberate use of economic vocabulary is significant because it implies _____, meaning _____, and appealing to readers who _____.',
            L: 'This connects to the broader argument that _____, which challenges the reader to accept _____.',
          },
        },
        {
          question:
            'Evaluate the effectiveness of Paul Ehrlich\'s "rivet" metaphor. Does such vivid imagery strengthen the scientific argument, or does it risk trivialising it?',
          tier: 'evaluative',
          scaffold: {
            P: 'I believe Ehrlich\'s metaphor is principally (effective/problematic) because _____.',
            E: 'The metaphor operates by asking readers to imagine "boarding an aeroplane and noticing a mechanic removing rivets from the wing. How many rivets can be removed before the plane falls from the sky?" It gains force from the surrounding claim that "Each species lost is a rivet; each ecosystem weakened, a section of fuselage strained."',
            E2: 'In my view, using a concrete image is significant because _____, demonstrating that abstract ecological risk can be made _____, and challenging the notion that extinction is _____.',
            L: 'This connects to broader debates about how science is communicated to the public, and suggests that metaphor may be _____.',
          },
        },
        {
          question:
            'To what extent does the writer succeed in arguing that conservation is "not sentimental but strategic"? Consider whether the dichotomy itself is justified.',
          tier: 'evaluative',
          scaffold: {
            P: 'The writer largely succeeds/partially succeeds because _____, although the dichotomy between sentiment and strategy may itself be _____.',
            E: 'The passage offers evidence such as "___________" and "___________." Yet one might argue that _____.',
            E2: 'The significance of this framing is _____ because _____, demonstrating that _____ and challenging the assumption that _____.',
            L: 'This connects to broader questions about _____, raising the issue of _____, and suggesting that _____.',
          },
        },
      ],
    },
    {
      id: 6,
      title: 'Human Rights',
      image: '/images/comprehension-preadvanced-unit-6.webp',
      imagePrompt:
        'A diptych illustration: on the left, the 1948 signing of the Universal Declaration of Human Rights, Eleanor Roosevelt holding a printed copy against a bright backdrop of hopeful post-war reconstruction; on the right, contemporary scenes — a journalist typing under surveillance, a lawyer speaking with prisoners, a protester facing riot police, a judge in robes. A faint grid of Declaration articles overlays both halves. Solemn, dignified, painterly style.',
      passage: `The modern concept of human rights is, in historical terms, surprisingly recent. Its foundational document, the Universal Declaration of Human Rights, was adopted by the newly formed United Nations in December 1948, in the immediate aftermath of a war that had demonstrated with unbearable clarity what states could do when no higher principle restrained them. The drafters — Eleanor Roosevelt, René Cassin, Peng Chun Chang, Charles Malik, and others — came from radically different legal and philosophical traditions, yet produced a document asserting that certain rights belonged not to citizens of a particular country but to every human being, everywhere, by virtue of being human.

The Declaration is, in its way, a revolutionary text. It grants rights that sovereign states had long reserved to themselves: to speak freely, to assemble, to leave and return, to due process, to work, to education, to a standard of living adequate for health and dignity. Ratifying it costs nothing; honouring it costs a great deal.

The gap between those two things has defined the field ever since. Nearly every nation now signs human rights conventions, yet the annual reports of Amnesty International and Human Rights Watch catalogue torture, arbitrary detention, and silencing of dissent across most of the world. The rights exist; their enforcement is uneven, sporadic, and — under authoritarian regimes — sometimes nonexistent. A right that cannot be claimed is, in practice, no right at all.

Into this gap step the human rights defenders: lawyers representing political prisoners, journalists exposing corruption at great personal risk, activists documenting abuses in places where documentation itself is criminalised. Their work is often slow and dangerous, and their successes are frequently reversed. Yet without them, the Declaration would have remained mere paper.

Human rights, then, are best understood not as a fixed inheritance but as an ongoing argument — one that each generation must choose whether to continue. The legacy of 1948 is not a problem solved. It is an obligation renewed.`,
      vocabulary: ['foundational', 'sovereign', 'ratifying', 'sporadic', 'authoritarian'],
      peelQuestions: [
        {
          question:
            'What does the writer imply with the contrast "Ratifying it costs nothing; honouring it costs a great deal"? How does this shape the reader\'s understanding of the rest of the passage?',
          tier: 'inferential',
          scaffold: {
            P: 'The writer implies that _____ by juxtaposing _____ with _____.',
            E: 'This contrast is developed in: "___________." It is later echoed by the claim that "___________."',
            E2: 'The antithesis is significant because it implies _____, meaning _____, and exposing the pretence that _____.',
            L: 'This connects to the broader argument that _____, which challenges the reader to see rights not as _____ but as _____.',
          },
        },
        {
          question:
            'Evaluate how effectively the writer uses the tension between ideals and reality to structure the passage. Is this a persuasive analytical strategy or an overly pessimistic one?',
          tier: 'evaluative',
          scaffold: {
            P: 'The writer\'s use of ideal-versus-reality tension is largely persuasive/risks pessimism because _____.',
            E: 'The ideal is sketched in "___________" while the reality is illustrated by "___________." The defenders are introduced as "___________."',
            E2: 'The significance of this structural choice is _____ because _____, demonstrating that _____ and challenging the notion that _____.',
            L: 'This connects to broader debates about _____, raising important questions about _____, and suggesting that _____.',
          },
        },
        {
          question:
            'The passage concludes that human rights are "not a fixed inheritance but an ongoing argument." To what extent does the preceding evidence support such a dynamic, contested view of rights?',
          tier: 'evaluative',
          scaffold: {
            P: 'The conclusion is well supported/partially supported because _____.',
            E: 'The passage offers "___________" and "___________" as evidence that rights must be contested. However, some might argue that _____.',
            E2: 'The significance of viewing rights as argument rather than inheritance is _____ because _____, demonstrating that _____ and challenging the assumption that _____.',
            L: 'This connects to broader questions about _____, raising the issue of _____, and suggesting that each generation must _____.',
          },
        },
      ],
    },
    {
      id: 7,
      title: 'The Art of Storytelling',
      image: '/images/comprehension-preadvanced-unit-7.webp',
      imagePrompt:
        'A sweeping illustration showing storytelling across time: an ancestral fire-circle with figures casting animal shadows on a cave wall on the left, transitioning through a medieval scribe, a 19th-century novelist, a cinema projectionist, and finally a modern phone displaying short-form video. In the centre, a single warm thread of light connects each scene. At the edges, a chorus of faces listens with changing emotion. Cinematic, luminous, slightly mythic.',
      passage: `Storytelling is almost certainly older than writing, older than agriculture, perhaps older than the languages we still speak. Around fires on every continent, our ancestors converted experience into narrative, and narrative into memory. Anthropologists studying contemporary hunter-gatherer societies have found that a substantial portion of night-time conversation consists of storytelling — about ancestors, animals, landscapes, consequences. Stories, long before they entertained, taught.

Recent psychological research has begun to describe what stories do to the mind. When a reader or listener enters a narrative, a process called "narrative transportation" occurs: attention narrows, critical resistance softens, and the boundaries of the self briefly loosen. Neuroimaging has shown that readers of emotionally rich fiction engage brain regions associated with physical experience, effectively simulating what characters undergo. This, psychologists argue, is why literature correlates with measurable gains in empathy — not because it lectures us on virtue, but because it lets us inhabit other minds.

Stories also bind groups. A community that shares founding myths, heroes, villains, and cautionary tales holds a shared interpretive key. Such stories can nourish belonging; they can also harden into prejudice. The Nigerian novelist Chimamanda Ngozi Adichie has warned of the "danger of a single story" — the way that repeated, narrow narratives about a people can reduce them to a caricature. "The single story," she writes, "creates stereotypes, and the problem with stereotypes is not that they are untrue, but that they are incomplete."

The forms of storytelling multiply. Novels share the cultural field with films, serial television, podcasts, video essays, immersive games, and the algorithmically amplified micro-narratives of social media. Some mourn this fragmentation; others celebrate its democratisation. What persists beneath every form is the underlying need: to make pattern out of chaos, meaning out of time.

To tell and to listen to stories is not, therefore, a diversion. It is closer to a survival skill — one of the ways a social species coordinates, remembers, and, with luck, understands.`,
      vocabulary: ['anthropologists', 'transportation', 'neuroimaging', 'caricature', 'fragmentation'],
      peelQuestions: [
        {
          question:
            'What does the writer suggest by describing storytelling as "closer to a survival skill" than a diversion, and how do earlier paragraphs prepare the reader for this conclusion?',
          tier: 'inferential',
          scaffold: {
            P: 'The writer suggests that _____ by reframing storytelling as _____ rather than _____.',
            E: 'The groundwork is laid in "___________" and in the observation that "___________."',
            E2: 'The final claim is significant because it implies _____, meaning _____, and challenging the common view that _____.',
            L: 'This connects to the broader argument that _____, which challenges the reader to see narrative as _____.',
          },
        },
        {
          question:
            'Evaluate the writer\'s integration of Adichie\'s "single story" concept. Does it deepen the argument, or sit awkwardly alongside the empathy research?',
          tier: 'evaluative',
          scaffold: {
            P: 'Adichie\'s concept principally deepens/complicates the argument because _____.',
            E: 'Earlier the writer claims that "___________." Adichie then counters that "___________."',
            E2: 'The significance of this tension is _____ because _____, demonstrating that storytelling _____ and challenging the notion that _____.',
            L: 'This connects to broader debates about _____, raising important questions about _____, and suggesting that _____.',
          },
        },
        {
          question:
            'Assess the writer\'s treatment of new digital storytelling forms. Is the balanced position ("some mourn... others celebrate") genuinely even-handed, or a rhetorical evasion?',
          tier: 'evaluative',
          scaffold: {
            P: 'The writer\'s position is genuinely even-handed/an evasion because _____.',
            E: 'The passage describes new forms as "___________" and responds to both critics and celebrants by stating "___________."',
            E2: 'The significance of refusing a clear verdict is _____ because _____, demonstrating that _____ and challenging the assumption that _____.',
            L: 'This connects to broader questions about _____ in cultural change, raising issues of _____, and suggesting that _____.',
          },
        },
      ],
    },
    {
      id: 8,
      title: 'Artificial Intelligence: Opportunity or Threat?',
      image: '/images/comprehension-preadvanced-unit-8.webp',
      imagePrompt:
        'A centred illustration of a stylised neural network weaving through human life: one strand diagnoses a medical scan, another tutors a child, another reads aloud for a blind user; a second cluster of strands shows a worker replaced by a robot, a biased algorithm rejecting a loan, and a surveillance feed parsing a crowd. At the heart of the network sits a set of balance scales held by a hand in a judge\'s sleeve. Sleek editorial style, cool tones with accents of warm amber.',
      passage: `Few technologies have provoked more ambivalence, in less time, than artificial intelligence. Within a single decade, AI systems have moved from curiosities that could barely recognise cats to systems that converse fluently, generate images indistinguishable from photographs, and outperform specialists in narrow diagnostic tasks. The pace of capability has outstripped the pace of governance, and the question of what AI will mean for human life is being answered, in part, by default.

The case for opportunity is genuine. Machine learning models have identified patterns in medical imaging that radiologists overlook, with early detection implications for cancers, retinal disease, and cardiovascular risk. In education, adaptive tutoring systems can personalise practice to individual learners in ways no single teacher can sustain at scale. Assistive AI is transforming participation for people with disabilities: real-time captioning, sign-language translation, navigation aids, and text-to-speech have quietly become lifelines.

The case for caution is equally serious. Automation threatens not only routine manufacturing jobs but, increasingly, white-collar work in translation, coding, and customer service. Algorithmic systems deployed in hiring, lending, policing, and welfare have repeatedly reproduced — and sometimes amplified — the biases embedded in their training data. Privacy erodes as behavioural data becomes the fuel on which such systems run. Beyond these present-day harms lies what researchers call the "alignment problem": the difficulty of ensuring that increasingly powerful systems pursue goals that are genuinely beneficial to humans, rather than proxy objectives that diverge from human flourishing in subtle, compounding ways.

Neither utopia nor catastrophe is inevitable. What separates the two is governance: the laws, standards, audits, and democratic debates that shape how AI is developed and deployed. The European Union has begun one such effort; others are underway. The decade ahead is decisive, not because the technology itself decides, but because the window in which humans can shape its trajectory will not remain open indefinitely.

What we do — or fail to do — now, will echo.`,
      vocabulary: ['ambivalence', 'diagnostic', 'algorithmic', 'alignment', 'trajectory'],
      peelQuestions: [
        {
          question:
            'What does the writer imply by observing that "the pace of capability has outstripped the pace of governance" and that questions about AI "are being answered, in part, by default"?',
          tier: 'inferential',
          scaffold: {
            P: 'The writer implies that _____ by contrasting _____ with _____.',
            E: 'This is reinforced later by: "___________." The idea resurfaces in "___________."',
            E2: 'The phrase "by default" is significant because it implies _____, meaning _____, and shifting responsibility onto _____.',
            L: 'This connects to the broader argument that _____, which challenges the reader to recognise _____.',
          },
        },
        {
          question:
            'Evaluate how effectively the writer balances the case for opportunity against the case for caution. Does the structure genuinely weigh both sides, or foreground one?',
          tier: 'evaluative',
          scaffold: {
            P: 'The writer\'s balance is largely genuine/subtly weighted because _____.',
            E: 'On the opportunity side: "___________." On the caution side: "___________." Notably, the passage devotes _____ to each.',
            E2: 'The significance of this structural balance is _____ because _____, demonstrating that _____ and challenging the notion that _____.',
            L: 'This connects to broader debates about _____, raising important questions about _____, and suggesting that _____.',
          },
        },
        {
          question:
            'Assess the writer\'s central claim that "governance" is what separates AI utopia from catastrophe. Is this claim sufficient, or does it underplay other forces (market, culture, geopolitics)?',
          tier: 'evaluative',
          scaffold: {
            P: 'The writer\'s claim is partially sufficient/insufficient because _____.',
            E: 'The passage supports governance through "___________" and concludes "___________." Yet one might argue that _____.',
            E2: 'The significance of foregrounding governance over other forces is _____ because _____, demonstrating that _____ and challenging the assumption that _____.',
            L: 'This connects to broader questions about _____, raising the issue of _____, and suggesting that the coming decade will be decisive because _____.',
          },
        },
      ],
    },
  ],
}
