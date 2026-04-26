export const book = {
  id: 'comprehension-intermediate',
  series: 'comprehension',
  level: 'Intermediate',
  title: 'PEEL Comprehension Workbook',
  subtitle: 'Intermediate Level',
  color: '#7C3AED',
  lightColor: '#EDE9FE',
  description:
    'Deepen your comprehension and build structured analytical responses using the PEEL method.',
  units: [
    {
      id: 1,
      title: 'Life in the City',
      image: '/images/comprehension-intermediate-unit-1.webp',
      imagePrompt:
        'A vibrant, wide-angle illustration of a diverse African city skyline at dusk, with minibus taxis, cyclists, and commuters on busy streets below. Include tall apartment buildings with glowing windows, a bustling street market, and a modern train passing overhead. Show people of different ages and backgrounds walking, talking on phones, and carrying groceries. Warm orange and purple sunset tones blending with the cool blue lights of the city.',
      passage: `Living in a city can feel like standing at the centre of the world. Every morning, millions of commuters pour into busy streets, choosing between crowded buses, minibus taxis, electric trains, and even bicycles to reach their workplaces. Cities offer extraordinary opportunities: universities, hospitals, theatres, and jobs in industries ranging from finance to technology. For many families, moving to a city means a chance at a better education and a higher income.

However, urban life also carries significant challenges. Housing costs can be overwhelming, forcing some families to share small apartments or live far from where they work. The constant hum of traffic, sirens, and construction creates noise pollution that disturbs sleep and concentration. Air quality often suffers as factories and vehicles release harmful emissions into the atmosphere. Green spaces, where children once played freely, are shrinking as developers build upwards to accommodate growing populations.

Despite these difficulties, cities continue to attract newcomers because they represent possibility. They are places where ideas collide, cultures blend, and ordinary people transform their futures — if they can navigate the demands of urban living wisely.`,
      vocabulary: ['commuters', 'extraordinary', 'overwhelming', 'emissions', 'accommodate'],
      peelQuestions: [
        {
          question: 'According to the passage, what are three forms of transport that city commuters use each morning?',
          tier: 'literal',
          scaffold: {
            P: 'According to the passage, city commuters use several different forms of transport.',
            E: 'The text states: "Every morning, millions of commuters pour into busy streets, choosing between crowded buses, minibus taxis, electric trains, and even bicycles."',
            E2: 'This shows that cities offer many transport options because such large numbers of people need to move at once.',
            L: 'This connects to the idea that cities depend on varied transport systems to function effectively each day.',
          },
        },
        {
          question: 'Why might families choose to stay in cities even when housing costs are overwhelming?',
          tier: 'inferential',
          scaffold: {
            P: 'Families stay in cities despite high costs because the opportunities outweigh the difficulties.',
            E: 'The text suggests this when it says cities offer "universities, hospitals, theatres, and jobs" and are "places where ideas collide, cultures blend, and ordinary people transform their futures."',
            E2: 'This implies that families believe the long-term benefits of education and employment justify the short-term sacrifices of expensive housing.',
            L: 'This connects to the broader idea that people often endure hardship in the present in order to build a better future for themselves and their children.',
          },
        },
        {
          question: 'Do you think the opportunities of city life outweigh the challenges? Support your answer with evidence from the passage.',
          tier: 'evaluative',
          scaffold: {
            P: 'I (agree/disagree) that the opportunities of city life outweigh the challenges.',
            E: 'The evidence shows that cities provide "universities, hospitals, theatres, and jobs" but also cause "noise pollution," poor "air quality," and shrinking "green spaces."',
            E2: 'I believe this because _____ , since the benefits of _____ are (greater/less important) than the costs of _____.',
            L: 'This matters because the choice to live in a city shapes not only a person\'s daily life but also their health, family, and future prospects.',
          },
        },
      ],
    },
    {
      id: 2,
      title: 'The Ocean',
      image: '/images/comprehension-intermediate-unit-2.webp',
      imagePrompt:
        'A dramatic split-view illustration showing the ocean above and below the surface. Above: a clear blue horizon with gentle waves and seabirds. Below: a thriving coral reef bursting with colourful fish, sea turtles, and swaying kelp forests, but with subtle warning signs — a plastic bottle drifting past, a patch of bleached coral, and a fishing net tangled on rocks. Use vivid turquoise, coral pink, and deep navy tones to convey both beauty and fragility.',
      passage: `The ocean is far more than a vast expanse of salty water. It covers over seventy percent of our planet and plays a crucial role in regulating the Earth's climate. By absorbing heat from the sun and storing carbon dioxide, the ocean slows down the effects of global warming and keeps temperatures stable enough for life to thrive. Without this enormous natural system, our world would be a very different, harsher place.

Beneath the waves lies astonishing biodiversity. Coral reefs, often called the rainforests of the sea, shelter thousands of species of fish, crustaceans, and marine plants. Mangroves and seagrass beds protect coastlines from storms while providing nurseries for young sea creatures. Humans also depend on the ocean for food, medicines, and livelihoods.

Unfortunately, human activity is pushing the ocean toward a crisis. Plastic pollution chokes marine life, overfishing empties once-abundant waters, and rising sea temperatures bleach delicate coral reefs. If we do not act urgently — by reducing waste, supporting sustainable fishing, and cutting carbon emissions — we risk losing this irreplaceable ecosystem forever. Protecting the ocean is not optional; it is essential for our survival.`,
      vocabulary: ['regulating', 'biodiversity', 'sustainable', 'abundant', 'irreplaceable'],
      peelQuestions: [
        {
          question: 'What percentage of the Earth does the ocean cover, and what is one way it regulates the climate?',
          tier: 'literal',
          scaffold: {
            P: 'According to the passage, the ocean covers a huge portion of the planet and regulates the climate in several ways.',
            E: 'The text states: "It covers over seventy percent of our planet" and regulates climate "by absorbing heat from the sun and storing carbon dioxide."',
            E2: 'This shows that the ocean functions like a natural thermostat, balancing the Earth\'s temperature and atmosphere.',
            L: 'This connects to the idea that life on land is only possible because the ocean quietly does its work every day.',
          },
        },
        {
          question: 'Why do you think the author calls the ocean "irreplaceable"?',
          tier: 'inferential',
          scaffold: {
            P: 'The author calls the ocean irreplaceable because no other system on Earth could do what it does.',
            E: 'The passage explains that the ocean regulates climate, shelters biodiversity, protects coastlines, and provides "food, medicines, and livelihoods."',
            E2: 'This implies that if the ocean collapses, humans could not invent or recreate a substitute, because its services are too vast and interconnected.',
            L: 'This connects to the broader idea that some parts of nature are so vital that losing them would permanently change life on Earth.',
          },
        },
        {
          question: 'Do you believe individuals can make a real difference in protecting the ocean, or is this mainly the responsibility of governments? Justify your answer with evidence.',
          tier: 'evaluative',
          scaffold: {
            P: 'I believe that (individuals / governments / both) have the strongest responsibility to protect the ocean.',
            E: 'The evidence shows that the text calls on everyone to act "by reducing waste, supporting sustainable fishing, and cutting carbon emissions."',
            E2: 'I agree with this because _____ , since the scale of the problem requires (small daily choices / large policy changes / both working together).',
            L: 'This matters because the decisions we make today — as citizens and as leaders — will determine whether the next generation inherits a living ocean or a dying one.',
          },
        },
      ],
    },
    {
      id: 3,
      title: 'How Plants Grow',
      image: '/images/comprehension-intermediate-unit-3.webp',
      imagePrompt:
        'A detailed, educational cross-section illustration showing the life cycle of a plant. On the left, a seed buried in rich brown soil with tiny roots beginning to emerge. In the middle, a young sprout pushing up through the earth toward a bright yellow sun. On the right, a fully grown green plant with broad leaves, clearly labelled arrows showing sunlight entering leaves, water travelling up from the roots, and oxygen being released. Bright, clear colours suitable for a science classroom.',
      passage: `Plants may appear silent and still, but inside them, a remarkable process is always unfolding. To grow successfully, every plant requires four essential ingredients: sunlight, water, air, and nutrients from the soil. If even one of these is missing, the plant will struggle to survive.

The journey begins with germination. When a seed is placed in warm, moist soil, it absorbs water and swells until its protective coat splits open. A tiny root pushes downward, anchoring the seedling, while a delicate shoot stretches upward in search of light. This is the first sign that the plant has successfully begun its life.

As leaves develop, they start performing one of nature's most important tasks: photosynthesis. During this process, the leaves capture sunlight and combine it with water drawn up from the roots and carbon dioxide taken from the air. The plant converts these ingredients into glucose, a type of sugar that fuels its growth, and releases oxygen as a by-product. Without this extraordinary transformation, animals and humans would have no oxygen to breathe. In this way, plants quietly sustain nearly all life on Earth.`,
      vocabulary: ['germination', 'nutrients', 'photosynthesis', 'converts', 'sustain'],
      peelQuestions: [
        {
          question: 'What are the four essential ingredients a plant needs to grow?',
          tier: 'literal',
          scaffold: {
            P: 'According to the passage, plants need four essential ingredients to grow.',
            E: 'The text states: "every plant requires four essential ingredients: sunlight, water, air, and nutrients from the soil."',
            E2: 'This shows that plant growth is not automatic but depends on a specific combination of natural resources working together.',
            L: 'This connects to the idea that healthy ecosystems must provide all of these elements if plants — and the life that depends on them — are to thrive.',
          },
        },
        {
          question: 'Why might the author describe photosynthesis as "extraordinary"?',
          tier: 'inferential',
          scaffold: {
            P: 'The author describes photosynthesis as extraordinary because it is a transformation that sustains nearly all life.',
            E: 'The passage explains that leaves "capture sunlight and combine it with water drawn up from the roots and carbon dioxide taken from the air" to make glucose and release oxygen.',
            E2: 'This implies that the process is remarkable because a simple green leaf can turn light, water, and gas into food and breathable air — something no human factory can replicate as efficiently.',
            L: 'This connects to the broader idea that some of the most powerful processes on Earth happen quietly, inside living things we often overlook.',
          },
        },
        {
          question: 'Do you think humans should do more to protect plants, given what the passage reveals about photosynthesis? Support your answer.',
          tier: 'evaluative',
          scaffold: {
            P: 'I (agree/disagree) that humans should do much more to protect plants.',
            E: 'The evidence shows that plants release oxygen and that "without this extraordinary transformation, animals and humans would have no oxygen to breathe."',
            E2: 'I believe this because the evidence shows that our survival depends on plants, so protecting forests, gardens, and farmland is (urgent/optional) for our future.',
            L: 'This matters because every plant cut down without replacement weakens the very system that keeps every living creature — including us — alive.',
          },
        },
      ],
    },
    {
      id: 4,
      title: 'A Day at the Market',
      image: '/images/comprehension-intermediate-unit-4.webp',
      imagePrompt:
        'A warm, richly detailed illustration of a traditional African outdoor market at mid-morning. A young child holding the hand of a smiling grandmother in a bright headwrap walks between colourful stalls of oranges, tomatoes, spices in woven baskets, folded fabrics, and handmade wooden crafts. Vendors chat, a chicken wanders past, and steam rises from a pot of food at a corner stall. Sunlight filters through cloth awnings in warm yellows, reds, and greens.',
      passage: `Amara had visited supermarkets many times, but nothing had prepared her for the day Gogo took her to the old market. The moment they stepped through the gates, a swirl of colours and sounds wrapped around them. Vendors called out friendly greetings, the scent of roasted maize drifted on the breeze, and baskets overflowed with tomatoes, guavas, and bright yellow peppers.

Gogo moved slowly, greeting each stallholder by name. She squeezed mangoes, inhaled the perfume of fresh basil, and gently bargained with a wide smile. Amara, however, grew impatient. "Why don't we just pay the price on the sticker, like at the supermarket?" she whispered.

Her grandmother paused and looked at her kindly. "My child, this is not only about the fruit. These people know our family. When I buy from them, I help them feed their children. When they give me a good price, they show me respect. A market is a conversation, not a transaction."

That afternoon, as they walked home carrying warm bread and laughing about Gogo's jokes, Amara realised she had learned something no supermarket had ever taught her.`,
      vocabulary: ['vendors', 'bargained', 'inhaled', 'transaction', 'realised'],
      peelQuestions: [
        {
          question: 'What does Gogo do as she moves through the market, and how do the vendors respond to her?',
          tier: 'literal',
          scaffold: {
            P: 'As Gogo moves through the market, she interacts with the vendors in a personal and respectful way.',
            E: 'The text states: "Gogo moved slowly, greeting each stallholder by name. She squeezed mangoes, inhaled the perfume of fresh basil, and gently bargained with a wide smile."',
            E2: 'This shows that Gogo approaches shopping as a social activity rather than a rushed errand, and the vendors clearly know and welcome her.',
            L: 'This connects to the idea that traditional markets build relationships, not just sales.',
          },
        },
        {
          question: 'What lesson does the author want the reader to take from Gogo\'s words, "A market is a conversation, not a transaction"?',
          tier: 'inferential',
          scaffold: {
            P: 'Gogo\'s words teach that shopping in a community carries deeper meaning than simply exchanging money for goods.',
            E: 'She explains: "When I buy from them, I help them feed their children. When they give me a good price, they show me respect."',
            E2: 'This implies that the author wants readers to understand that everyday choices — like where we shop — can strengthen or weaken the bonds between people.',
            L: 'This connects to the broader idea that economic decisions are also human decisions, with real consequences for families and communities.',
          },
        },
        {
          question: 'Do you think traditional markets are more valuable than supermarkets? Use evidence from the passage to justify your view.',
          tier: 'evaluative',
          scaffold: {
            P: 'I believe traditional markets are (more / less / equally) valuable compared to supermarkets.',
            E: 'The evidence shows that in the market "these people know our family," vendors are greeted "by name," and the experience teaches Amara "something no supermarket had ever taught her."',
            E2: 'I agree/disagree because the evidence shows that _____ , which suggests that human connection is (worth more than / less important than) convenience.',
            L: 'This matters because the way we shop shapes the kind of community we build — one based on relationships, or one based only on speed and price.',
          },
        },
      ],
    },
    {
      id: 5,
      title: 'Endangered Animals',
      image: '/images/comprehension-intermediate-unit-5.webp',
      imagePrompt:
        'A poignant collage illustration featuring four endangered animals in their natural habitats: a black rhino on African savannah, a mountain gorilla in a misty forest, a sea turtle swimming near a coral reef, and a pangolin curled on a leafy forest floor. In the background, subtle imagery shows both threats (smoke from deforestation, a distant fishing net) and hope (a ranger patrolling, children planting trees). Warm earth tones with hopeful greens and blues.',
      passage: `Across the world, thousands of animal species are quietly disappearing. When scientists describe an animal as "endangered," they mean its population has fallen so low that it may vanish from the Earth forever. Once an animal becomes extinct, no power on the planet can bring it back.

The causes of endangerment are largely human. Deforestation destroys the homes of creatures like mountain gorillas and orangutans. Poaching — the illegal hunting of animals for their horns, tusks, or scales — has pushed rhinos and pangolins dangerously close to extinction. Pollution and climate change threaten polar bears, coral reef fish, and sea turtles that rely on stable temperatures and clean water. Even well-loved animals, such as African elephants, face shrinking territories as farms and roads expand.

Yet there is genuine reason for hope. Conservation organisations, dedicated rangers, and local communities are working tirelessly to protect wildlife reserves, rescue injured animals, and prosecute poachers. Young people can contribute by supporting ethical tourism, refusing products made from endangered species, and spreading awareness online. Every choice matters. Saving endangered animals is not only about saving them — it is about protecting the rich, breathing web of life we all share.`,
      vocabulary: ['endangered', 'extinct', 'poaching', 'conservation', 'prosecute'],
      peelQuestions: [
        {
          question: 'According to the passage, what are two specific threats that human activity creates for endangered animals?',
          tier: 'literal',
          scaffold: {
            P: 'According to the passage, human activity creates several direct threats for endangered animals.',
            E: 'The text states: "Deforestation destroys the homes of creatures like mountain gorillas" and "Poaching — the illegal hunting of animals for their horns, tusks, or scales — has pushed rhinos and pangolins dangerously close to extinction."',
            E2: 'This shows that both the destruction of habitats and the direct killing of animals are driving species toward disappearance.',
            L: 'This connects to the idea that the pressures humans place on nature often come from multiple directions at once.',
          },
        },
        {
          question: 'Why does the author describe the natural world as a "rich, breathing web of life"?',
          tier: 'inferential',
          scaffold: {
            P: 'The author uses the image of a "rich, breathing web" to emphasise how all living things are connected.',
            E: 'The passage explains that climate change harms many different species and that "saving endangered animals is not only about saving them — it is about protecting the rich, breathing web of life we all share."',
            E2: 'This implies that when one species is lost, the whole web weakens, because animals depend on each other for food, pollination, and balance.',
            L: 'This connects to the broader idea that nature is not a collection of separate creatures but a single living system that includes us.',
          },
        },
        {
          question: 'Do you agree that young people have a real responsibility to help protect endangered animals? Justify your answer using evidence.',
          tier: 'evaluative',
          scaffold: {
            P: 'I (agree/disagree) that young people have a real responsibility to help protect endangered animals.',
            E: 'The evidence shows that "young people can contribute by supporting ethical tourism, refusing products made from endangered species, and spreading awareness online."',
            E2: 'I believe this because _____ , since young people today will (inherit / shape / decide) the world these animals must survive in.',
            L: 'This matters because the choices of the next generation will determine whether endangered animals recover, or vanish while the world watches.',
          },
        },
      ],
    },
    {
      id: 6,
      title: 'Seasons and Change',
      image: '/images/comprehension-intermediate-unit-6.webp',
      imagePrompt:
        'A circular illustration divided into four equal sections, each showing the same tree and landscape across the four seasons. Spring: pink blossoms, baby birds in a nest, green shoots. Summer: full leafy canopy, bright sunshine, children playing in the grass. Autumn: golden, red, and orange leaves falling, a squirrel gathering nuts. Winter: bare branches with snow or frost, a deer standing quietly, a warm sunset in a pale sky. Gentle, harmonious colour palette.',
      passage: `The seasons move in a gentle, predictable rhythm, and each one transforms the world around us. In spring, the air softens, blossoms appear on bare branches, and baby animals are born. Farmers prepare their fields, knowing that longer days and warm rains will coax new life from the soil. It is a season of hope and fresh beginnings.

Summer follows, bringing heat, long afternoons, and abundant fruit. Trees stand at their fullest, offering shade to anyone who walks beneath them. Children splash in rivers, while insects hum endlessly in the grass. Then, almost without warning, autumn arrives. Leaves burn in shades of red and gold before drifting to the ground. Animals such as squirrels and bears begin storing food, sensing that harder days are ahead.

Winter is perhaps the most striking contrast. Trees stand bare and silent, and many creatures either migrate to warmer lands or hibernate until spring returns. Yet even in the stillness, life continues beneath the surface, waiting. This cycle reminds us that change is natural — and that every ending quietly prepares the way for a new beginning.`,
      vocabulary: ['predictable', 'abundant', 'migrate', 'hibernate', 'striking'],
      peelQuestions: [
        {
          question: 'According to the passage, what do animals like squirrels and bears do when autumn arrives?',
          tier: 'literal',
          scaffold: {
            P: 'According to the passage, animals prepare for the colder months during autumn.',
            E: 'The text states: "Animals such as squirrels and bears begin storing food, sensing that harder days are ahead."',
            E2: 'This shows that animals instinctively respond to seasonal change by gathering resources while food is still available.',
            L: 'This connects to the idea that nature equips living things with powerful instincts to survive challenging conditions.',
          },
        },
        {
          question: 'What does the author mean by saying that "every ending quietly prepares the way for a new beginning"?',
          tier: 'inferential',
          scaffold: {
            P: 'The author is suggesting that endings in nature are not really endings but preparations for renewal.',
            E: 'The passage explains that in winter "life continues beneath the surface, waiting," and that the cycle of seasons is natural and repeating.',
            E2: 'This implies that what looks like loss — bare trees, silent landscapes — is actually part of a hidden process of rebuilding for spring.',
            L: 'This connects to the broader idea that change, even when it feels painful, often leads to growth and new opportunity.',
          },
        },
        {
          question: 'Which season do you believe teaches humans the most important lesson, and why? Support your answer with evidence from the passage.',
          tier: 'evaluative',
          scaffold: {
            P: 'I believe the season that teaches humans the most important lesson is _____.',
            E: 'The evidence shows that in this season, the passage describes _____ (for example, "a season of hope and fresh beginnings" for spring, or animals that "hibernate until spring returns" for winter).',
            E2: 'I believe this because the evidence shows that this season mirrors a powerful human experience, such as _____ , which teaches us to _____.',
            L: 'This matters because understanding nature\'s cycles can help us respond to the seasons of our own lives with more patience and wisdom.',
          },
        },
      ],
    },
    {
      id: 7,
      title: 'Friendship',
      image: '/images/comprehension-intermediate-unit-7.webp',
      imagePrompt:
        'A heart-warming illustration of two friends of different backgrounds — one wearing a school uniform, the other in casual clothes — sitting on a wooden bench under a large tree. One friend has an arm around the other\'s shoulder as they share a quiet, supportive conversation. In the background, other children play, but the focus is on this pair. Soft golden afternoon light, leaves drifting gently, warm and hopeful mood.',
      passage: `True friendship is one of the most valuable gifts a person can experience. It does not depend on how long two people have known each other, nor on whether they share every interest. Instead, real friendship is built on trust, honesty, and genuine care. A true friend celebrates your achievements without jealousy and supports you during difficult moments without judgement.

Some people mistake popularity for friendship. They surround themselves with many acquaintances but feel lonely in their company. Others invest quietly in a small circle of loyal companions and feel understood, even if their group is not large. Quality, not quantity, is what makes a friendship meaningful.

Friendships also teach us important lessons. They show us how to listen, how to apologise, and how to forgive. When disagreements happen — and they always do — a strong friendship survives not because the friends avoid conflict, but because they face it with respect. Through every argument and reconciliation, we learn more about ourselves and about other people.

In a world that often rewards noise and attention, genuine friendship reminds us that being truly known by one person is worth far more than being liked by many.`,
      vocabulary: ['genuine', 'acquaintances', 'loyal', 'reconciliation', 'meaningful'],
      peelQuestions: [
        {
          question: 'What does the author say true friendship is built on?',
          tier: 'literal',
          scaffold: {
            P: 'According to the author, true friendship is built on a clear set of foundations.',
            E: 'The text states: "real friendship is built on trust, honesty, and genuine care."',
            E2: 'This shows that friendship is not about time or shared hobbies, but about the values two people bring to their relationship.',
            L: 'This connects to the idea that meaningful relationships grow from qualities we choose, not from circumstances alone.',
          },
        },
        {
          question: 'Why might a person with many acquaintances still feel lonely, according to the passage?',
          tier: 'inferential',
          scaffold: {
            P: 'A person with many acquaintances can feel lonely because popularity is not the same as true connection.',
            E: 'The passage explains that some people "surround themselves with many acquaintances but feel lonely in their company," and that "quality, not quantity, is what makes a friendship meaningful."',
            E2: 'This implies that without trust, honesty, and real care, even a crowded social life can feel empty because no one truly knows the person.',
            L: 'This connects to the broader idea that human beings need to be understood, not just surrounded.',
          },
        },
        {
          question: 'Do you agree that "being truly known by one person is worth far more than being liked by many"? Justify your answer with evidence.',
          tier: 'evaluative',
          scaffold: {
            P: 'I (agree/disagree) that being truly known by one person is worth far more than being liked by many.',
            E: 'The evidence shows that the passage contrasts people who "feel lonely" in large groups with those who "feel understood" in small, loyal circles.',
            E2: 'I believe this because _____ , since being truly known (supports/limits) a person\'s emotional well-being and confidence more than popularity.',
            L: 'This matters because in a world full of social media and public attention, it is easy to chase being liked and forget the deeper joy of being understood.',
          },
        },
      ],
    },
    {
      id: 8,
      title: 'Jobs People Do',
      image: '/images/comprehension-intermediate-unit-8.webp',
      imagePrompt:
        'A detailed, cheerful illustration showing a diverse group of workers from many professions arranged like a community scene: a doctor with a stethoscope, a teacher at a chalkboard, a farmer holding produce, an engineer with a laptop, a chef at a stove, a nurse, a mechanic, a software developer at a screen, and a street cleaner smiling. People of different genders, ages, and backgrounds. Bright colours, friendly expressions, set against a simple town backdrop.',
      passage: `Every community functions because of the countless jobs people do. Some roles, such as doctors, teachers, and firefighters, are widely celebrated. Others — the farmers who grow our food, the drivers who transport goods across the country, and the cleaners who keep public spaces safe — are equally important, even if they receive less attention. Without this quiet network of workers, daily life would quickly fall apart.

The world of work is also changing rapidly. Technology has created new careers that did not exist twenty years ago, such as software developers, data analysts, and renewable energy engineers. At the same time, machines now perform tasks that humans once did, forcing workers to adapt and learn new skills. Lifelong learning has become as essential as any particular qualification.

Choosing a career can feel overwhelming, but a few questions can guide any young person. What problems do you enjoy solving? What kind of environment helps you thrive — busy or quiet, outdoors or indoors? Whose lives do you hope to improve? When work aligns with your interests and values, it becomes more than a way to earn money. It becomes a way to contribute something meaningful to the world.`,
      vocabulary: ['celebrated', 'network', 'adapt', 'qualification', 'contribute'],
      peelQuestions: [
        {
          question: 'According to the passage, which jobs does the author say are "equally important" even though they receive less attention?',
          tier: 'literal',
          scaffold: {
            P: 'According to the passage, several less-celebrated jobs are equally important to society.',
            E: 'The text states that "the farmers who grow our food, the drivers who transport goods across the country, and the cleaners who keep public spaces safe" are equally important.',
            E2: 'This shows that the author values the contribution of workers whose roles are often overlooked but whose absence would disrupt everyday life.',
            L: 'This connects to the idea that a community is held together by many hidden hands, not only by famous professions.',
          },
        },
        {
          question: 'Why does the author suggest that "lifelong learning has become as essential as any particular qualification"?',
          tier: 'inferential',
          scaffold: {
            P: 'The author suggests lifelong learning is essential because the world of work keeps changing.',
            E: 'The passage explains that "technology has created new careers" and that "machines now perform tasks that humans once did, forcing workers to adapt and learn new skills."',
            E2: 'This implies that a single qualification is no longer enough, because workers who stop learning may find their skills outdated within a few years.',
            L: 'This connects to the broader idea that success in the modern world depends on curiosity and flexibility, not only on what is learned in school.',
          },
        },
        {
          question: 'Do you think young people should choose a career based on money or on meaning? Use evidence from the passage to support your view.',
          tier: 'evaluative',
          scaffold: {
            P: 'I believe young people should choose a career based mainly on (money / meaning / a balance of both).',
            E: 'The evidence shows the author asking, "What problems do you enjoy solving?" and arguing that work becomes "more than a way to earn money" when it aligns with interests and values.',
            E2: 'I agree/disagree because the evidence shows that _____ , and in my view (meaningful work / financial stability / both) leads to a more fulfilling life.',
            L: 'This matters because the careers young people choose today will shape not only their personal happiness but also the communities and problems they help to solve tomorrow.',
          },
        },
      ],
    },
  ],
}
