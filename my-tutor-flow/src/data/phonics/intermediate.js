export const book = {
  id: 'phonics-intermediate',
  series: 'phonics',
  level: 'Intermediate',
  title: 'Phonics Workbook',
  subtitle: 'Intermediate Level',
  color: '#0D9488',
  lightColor: '#CCFBF1',
  description: 'Advance your phonics skills with blends, digraphs and long vowel patterns.',
  units: [
    {
      id: 1,
      image: '/images/phonics-intermediate-unit-1.webp',
      title: 'L-Blends at the Start of Words',
      focus: 'Reading and spelling words that begin with two consonants where the second letter is L.',
      soundFocus: 'bl-, cl-, fl-, gl-, pl-, sl-',
      introduction:
        'When two consonants sit side by side at the start of a word, we call them a blend. In an L-blend, you can still hear both letters clearly — the first consonant slides smoothly into the /l/ sound. Say each sound quickly and let them join together: b-l, c-l, f-l. Today you will read, sort and spell words that begin with the six most common L-blends.',
      wordList: [
        { blend: 'bl-', words: ['black', 'blue', 'bland', 'bless', 'blot', 'blush', 'blind', 'block', 'blaze', 'blade'] },
        { blend: 'cl-', words: ['clap', 'class', 'clip', 'clock', 'cloth', 'cloud', 'clean', 'clue', 'claim', 'clash'] },
        { blend: 'fl-', words: ['flag', 'flap', 'flip', 'flop', 'flat', 'flush', 'flock', 'flame', 'float', 'flute'] },
        { blend: 'gl-', words: ['glad', 'glass', 'glue', 'glow', 'glide', 'globe', 'gleam', 'glare', 'gloss', 'glance'] },
        { blend: 'pl-', words: ['plan', 'plus', 'plot', 'play', 'place', 'plate', 'plum', 'plug', 'plead', 'plank'] },
        { blend: 'sl-', words: ['slip', 'slap', 'slam', 'slid', 'slot', 'slum', 'sled', 'slope', 'slime', 'slush'] },
      ],
      pictureWords: ['clock', 'flag', 'glass', 'plate', 'sled', 'cloud'],
      activities: [
        {
          type: 'sort',
          instruction: 'Sort the words below into the correct L-blend column: bl-, cl-, fl-, gl-, pl-, sl-.',
          words: ['black', 'flock', 'plate', 'slim', 'glow', 'clap', 'flame', 'plum', 'bless', 'sled', 'clip', 'glass'],
        },
        {
          type: 'fill',
          instruction: 'Fill in the missing L-blend (bl, cl, fl, gl, pl, sl) to complete each word.',
          blanks: ['__ock (time)', '__ue (sticky)', '__ate (dinner)', '__ag (in the wind)', '__ush (red cheeks)', '__ed (in the snow)'],
        },
        {
          type: 'sentences',
          instruction: 'Read each sentence and underline every L-blend word you can find.',
          sentences: [
            'The class clapped when the black flag flapped in the breeze.',
            'Please place the blue plate next to the glass.',
            'A fluffy cloud floated past the shining globe.',
            'Slim Sam slid down the slope on his new sled.',
          ],
        },
        {
          type: 'build',
          instruction: 'Build new words by adding an L-blend to the ending given. Write two real words for each.',
          content: '-ip, -ap, -ot, -ag, -ame, -ock',
        },
        {
          type: 'write',
          instruction: 'Write three sentences about a rainy day. Use at least one bl-, one cl- and one fl- word in your sentences.',
          content: '',
        },
      ],
      decodablePassage: {
        title: 'Clara and the Blue Kite',
        text: `Clara found a blue kite in the cluttered closet. She wiped off the dust with a soft cloth and placed it on the flat grass. A big black cloud floated above, but Clara was glad the wind was strong. She held the clip tight and let the kite climb. It flipped and flapped high over the classroom roof. Her brother Blake clapped and cheered. "Please let me play!" he called. Clara let Blake grip the string. The kite began to glide like a plane. They ran through the clover, feeling the glow of the sun. What a splendid afternoon for two best friends.`,
        questions: [
          'Where did Clara find the blue kite?',
          'What did Clara use to clean the kite?',
          'What did the kite do when the wind was strong?',
        ],
      },
      tip: 'When you meet an L-blend, do not try to squeeze an extra vowel between the two letters. Say them quickly — b-l-ack, not buh-lack. The sounds should slide into each other.',
    },
    {
      id: 2,
      image: '/images/phonics-intermediate-unit-2.webp',
      title: 'R-Blends at the Start of Words',
      focus: 'Reading and spelling words that begin with a consonant plus R.',
      soundFocus: 'br-, cr-, dr-, fr-, gr-, pr-, tr-',
      introduction:
        'R-blends are two consonants where the second letter is R. The /r/ sound is made at the back of your mouth, so R-blends can feel tricky at first. Say the first consonant, then roll quickly into the /r/ — br, cr, dr. In this unit you will meet seven common R-blends and practise them in words and stories.',
      wordList: [
        { blend: 'br-', words: ['bread', 'bring', 'brown', 'brick', 'brave', 'branch', 'broom', 'brush'] },
        { blend: 'cr-', words: ['crab', 'cry', 'crack', 'crisp', 'cream', 'crown', 'crash', 'crumb'] },
        { blend: 'dr-', words: ['drop', 'drum', 'drink', 'dress', 'drive', 'dream', 'dragon', 'draw'] },
        { blend: 'fr-', words: ['frog', 'from', 'fresh', 'friend', 'frame', 'front', 'frost', 'fruit'] },
        { blend: 'gr-', words: ['grass', 'green', 'grow', 'grape', 'grand', 'grip', 'grin', 'ground'] },
        { blend: 'pr-', words: ['print', 'press', 'pretty', 'prize', 'prank', 'proud', 'price', 'problem'] },
        { blend: 'tr-', words: ['tree', 'truck', 'trip', 'train', 'trust', 'track', 'trade', 'treat'] },
      ],
      pictureWords: ['frog', 'tree', 'dress', 'crab', 'bread', 'drum'],
      activities: [
        {
          type: 'sort',
          instruction: 'Sort these words into the correct R-blend column: br-, cr-, dr-, fr-, gr-, pr-, tr-.',
          words: ['brown', 'crash', 'drop', 'fresh', 'green', 'proud', 'train', 'brush', 'crumb', 'drum', 'frost', 'grape'],
        },
        {
          type: 'fill',
          instruction: 'Fill in the missing R-blend to make a real word.',
          blanks: ['__own (hair colour)', '__ash (loud noise)', '__ess (clothing)', '__iend (buddy)', '__ip (squeeze)', '__ain (runs on tracks)'],
        },
        {
          type: 'sentences',
          instruction: 'Read and underline every R-blend you can find in these sentences.',
          sentences: [
            'The brave frog jumped from the green branch to the brown ground.',
            'Priya printed her name with a pretty pen and felt proud.',
            'Fred and his friend Grace drove the truck across the track.',
            'Mum will press the fresh bread before we eat our crisp treat.',
          ],
        },
        {
          type: 'build',
          instruction: 'Add an R-blend to each ending to build real words. Write one sentence using one of your new words.',
          content: '-ip, -ap, -and, -ack, -ain, -ick',
        },
        {
          type: 'write',
          instruction: 'Write a short paragraph (3-4 sentences) about a trip you would like to take. Use at least four R-blend words.',
          content: '',
        },
      ],
      decodablePassage: {
        title: 'Grandpa and the Brown Truck',
        text: `Grandpa drove his brown truck to the farm at the end of the gravel track. Fresh green grass grew along the fence, and a friendly frog croaked from the pond. "Grab the basket!" Grandpa cried with a proud grin. Priya pressed her nose against the window and gasped. A brave crab was crawling across the bridge! She tried not to cry. Grandpa gently picked up the crab and placed it back in the stream. "He was just on a trip," he said. Priya drew a picture of the crab on the grass. It was the best present her grandpa could bring her that bright spring day.`,
        questions: [
          'What colour was Grandpa\'s truck?',
          'What animal did Priya see crawling across the bridge?',
          'What did Priya do at the end of the story?',
        ],
      },
      tip: 'R is a powerful letter — it changes the sound of many vowels, and it also changes how a blend feels in your mouth. Practise by saying the R first on its own, then attaching the first consonant: rrr... b-rrr... br!',
    },
    {
      id: 3,
      image: '/images/phonics-intermediate-unit-3.webp',
      title: 'Digraphs: th, wh, ph',
      focus: 'Two letters that team up to make one new sound.',
      soundFocus: 'th (voiceless and voiced), wh = /w/, ph = /f/',
      introduction:
        'A digraph is two letters that work together to make one sound. Unlike a blend, you do not hear both letters — you hear something brand new. The digraph "th" actually has two sounds: a quiet voiceless /th/ as in "thin" and a buzzy voiced /th/ as in "this". The digraph "wh" usually sounds like /w/ (when), and "ph" sounds like /f/ (phone). Let your tongue and lips find the feel of each new sound.',
      wordList: [
        { blend: 'th (voiceless, as in thin)', words: ['thin', 'thick', 'thank', 'think', 'third', 'thump', 'bath', 'path', 'math', 'cloth'] },
        { blend: 'th (voiced, as in this)', words: ['this', 'that', 'then', 'them', 'there', 'they', 'those', 'mother', 'father', 'weather'] },
        { blend: 'wh- (as in when)', words: ['when', 'what', 'where', 'which', 'whip', 'whisk', 'wheat', 'wheel', 'whale', 'whisper'] },
        { blend: 'ph (as in phone)', words: ['phone', 'photo', 'graph', 'phase', 'phantom', 'alphabet', 'dolphin', 'elephant', 'trophy', 'nephew'] },
      ],
      pictureWords: ['thumb', 'whale', 'phone', 'bath', 'wheel', 'elephant'],
      activities: [
        {
          type: 'sort',
          instruction: 'Sort these words into three columns: th words, wh words, ph words.',
          words: ['thank', 'phone', 'when', 'bath', 'whale', 'graph', 'those', 'wheel', 'dolphin', 'think', 'what', 'photo'],
        },
        {
          type: 'fill',
          instruction: 'Fill in the missing digraph (th, wh or ph) to finish each word.',
          blanks: ['__ank you', '__en did you come?', '__one call', 'ba__ time', 'ele__ant', '__isper softly'],
        },
        {
          type: 'sentences',
          instruction: 'Read each sentence. Underline th words once, wh words twice, and circle ph words.',
          sentences: [
            'When will the phone ring?',
            'That elephant is thirsty and thin.',
            'Whisper the answer to your father.',
            'Phoebe took a photo of the white whale.',
          ],
        },
        {
          type: 'build',
          instruction: 'Change the first digraph to build a new word. Example: when → then. Try: what → ?, phone → ?, bath → ?',
          content: 'when / what / this / phone / bath / thin',
        },
        {
          type: 'write',
          instruction: 'Write three questions that start with wh- (what, when, where, which, why). Make sure each question makes sense.',
          content: '',
        },
      ],
      decodablePassage: {
        title: 'Phoebe and the Whispering Whale',
        text: `Phoebe loved the beach more than anything. One thin, misty morning, she walked along the path with her mother. "What is that sound?" she whispered. A quiet thump came from the shore. There, in the shallow water, was a small white whale. Phoebe grabbed her phone and took a photo. Then she ran to thank the lifeguard, who was thick in conversation with a marine ranger. Together they helped the whale back to the deep blue waves. "Thank you, Phoebe," said her mother. "Without you, that whale might still be stuck." Phoebe felt proud. She whispered goodbye as the whale swam away through the foam.`,
        questions: [
          'What did Phoebe find in the shallow water?',
          'What did Phoebe use to take a photo?',
          'Who helped Phoebe save the whale?',
        ],
      },
      tip: 'Place your hand on your throat and say "thin" then "this". Feel the buzz? The voiced /th/ makes your throat vibrate; the voiceless /th/ does not. Same spelling, two sounds.',
    },
    {
      id: 4,
      image: '/images/phonics-intermediate-unit-4.webp',
      title: "Long Vowel A: a_e, ai, ay",
      focus: 'Three spellings of the long /ā/ sound — the sound that says its own name.',
      soundFocus: 'a_e (cake), ai (rain), ay (play)',
      introduction:
        'A long vowel says its own name. Long A can be spelled three main ways. The "a_e" pattern (sometimes called silent-e or magic-e) stretches a short vowel into a long one: can → cane. The "ai" pattern usually sits in the middle of a word: rain, paid. The "ay" pattern usually sits at the end of a word: play, day. Learning where each pattern lives will help you spell correctly.',
      wordList: [
        { blend: 'a_e (silent e)', words: ['cake', 'make', 'take', 'bake', 'lake', 'gate', 'late', 'name', 'game', 'plane', 'frame', 'shape'] },
        { blend: 'ai (middle of word)', words: ['rain', 'pain', 'main', 'train', 'brain', 'chain', 'paint', 'wait', 'sail', 'nail', 'snail', 'trail'] },
        { blend: 'ay (end of word)', words: ['play', 'day', 'way', 'say', 'may', 'stay', 'tray', 'clay', 'spray', 'today', 'crayon', 'Monday'] },
      ],
      pictureWords: ['cake', 'rain', 'tray', 'snail', 'plane', 'crayon'],
      activities: [
        {
          type: 'sort',
          instruction: 'Sort these long-A words by spelling pattern: a_e, ai, or ay.',
          words: ['cake', 'rain', 'play', 'gate', 'train', 'tray', 'paint', 'name', 'stay', 'snail', 'plane', 'spray'],
        },
        {
          type: 'fill',
          instruction: 'Fill in the correct long-A spelling (a_e, ai, or ay) to make a real word.',
          blanks: ['c__k__ (sweet treat)', 'r__n (water from sky)', 'pl__ (to have fun)', 'tr__n (runs on tracks)', 'g__t__ (door in a fence)', 'tr__ (holds food)'],
        },
        {
          type: 'sentences',
          instruction: 'Read and underline every long-A word you can find.',
          sentences: [
            'On a rainy day, Jay stayed inside to paint a plane.',
            'Grace baked a cake and placed it on the tray.',
            'The snail took the long trail to reach the lake.',
            'Please wait by the gate until I say your name.',
          ],
        },
        {
          type: 'build',
          instruction: 'Add silent-e to each short word to make a long-A word. What new word do you get?',
          content: 'can → ?, man → ?, tap → ?, rat → ?, mad → ?, cap → ?',
        },
        {
          type: 'write',
          instruction: 'Write four sentences about a rainy Saturday. Use at least one a_e word, one ai word, and one ay word.',
          content: '',
        },
      ],
      decodablePassage: {
        title: 'Jay and the Paper Plane',
        text: `It was a grey, rainy day and Jay could not play outside. Mum gave him a tray of paper and a crayon. "Make something great," she said with a smile. Jay folded a paper plane and painted it with bright stripes. He named it Blaze. When the rain began to fade away, Jay raced to the lake with Blaze in his hand. A snail crawled slowly along the trail as Jay waited for the right wind. At last, he gave Blaze a gentle push. The plane sailed high above the gate and across the lake. Jay cheered. What a splendid way to spend a rainy Saturday!`,
        questions: [
          'Why could Jay not play outside at the start of the story?',
          'What did Jay name his paper plane?',
          'Where did Jay go to fly his plane?',
        ],
      },
      tip: 'Here is a handy rule: "ai" likes the middle of a word, and "ay" likes the end. Think "main" versus "may". This is because English usually avoids ending words with the letter i.',
    },
    {
      id: 5,
      image: '/images/phonics-intermediate-unit-5.webp',
      title: "Long Vowel E: ee, ea, e_e",
      focus: 'Three common spellings of the long /ē/ sound.',
      soundFocus: 'ee (feet), ea (eat), e_e (theme)',
      introduction:
        'The long E sound says its own name — "eee". It is spelled most often with "ee" (as in feet, tree) or "ea" (as in read, beach). Less often you will see the silent-e pattern "e_e" in words like theme and Pete. When you see two vowels side by side, the first one usually does the talking — that is why "ea" and "ee" both say /ē/.',
      wordList: [
        { blend: 'ee (as in feet)', words: ['feet', 'tree', 'see', 'bee', 'green', 'sweet', 'sleep', 'queen', 'street', 'cheese', 'three', 'wheel'] },
        { blend: 'ea (as in eat)', words: ['eat', 'sea', 'read', 'beach', 'leaf', 'clean', 'dream', 'meal', 'team', 'speak', 'cream', 'teach'] },
        { blend: 'e_e (silent e)', words: ['theme', 'Pete', 'these', 'even', 'compete', 'complete', 'concrete', 'extreme', 'Eve', 'scene'] },
      ],
      pictureWords: ['tree', 'bee', 'leaf', 'cheese', 'sheep', 'beach'],
      activities: [
        {
          type: 'sort',
          instruction: 'Sort these long-E words into three groups: ee, ea, or e_e.',
          words: ['feet', 'eat', 'theme', 'green', 'beach', 'these', 'sleep', 'dream', 'complete', 'queen', 'leaf', 'Pete'],
        },
        {
          type: 'fill',
          instruction: 'Fill in the missing long-E spelling (ee, ea or e_e).',
          blanks: ['tr__ (plant)', 's__ (ocean)', 'ch__s__ (yellow food)', 'r__d (a book)', 'gr__n (colour)', 'dr__m (at night)'],
        },
        {
          type: 'sentences',
          instruction: 'Read and underline every long-E word you can find.',
          sentences: [
            'Three busy bees buzzed in the green tree.',
            'Pete had a dream about eating cheese by the sea.',
            'The queen liked to read stories to her team.',
            'We swept the street clean before the feast.',
          ],
        },
        {
          type: 'build',
          instruction: 'Change one letter to make a new long-E word. Example: feet → feed. Try: tree → ?, seat → ?, meal → ?, beat → ?',
          content: 'feet / tree / seat / meal / beat / deep',
        },
        {
          type: 'write',
          instruction: 'Write five sentences about a dream. Use at least six long-E words.',
          content: '',
        },
      ],
      decodablePassage: {
        title: "Pete's Sweet Dream",
        text: `Pete had a strange but sweet dream. He was deep beneath a tall green tree, sipping cream tea with three busy bees. "Please eat," said the queen bee. She placed a neat slice of cheese on his plate. Pete began to read the theme on her menu. Every meal was free! He felt his feet tingle as he heard the gentle beat of little wings. Suddenly, the scene changed. He was at the beach, chasing a leaping seal. The sea was clean and the breeze was cool. Pete woke up with a grin. "What a complete and extreme dream," he said. Then he went to eat his breakfast.`,
        questions: [
          'Who did Pete meet under the tree?',
          'What did the queen bee give Pete to eat?',
          'Where was Pete at the end of his dream?',
        ],
      },
      tip: 'When two vowels walk together, the first one often does the talking and the second one stays silent. That is why "ea" and "ee" both say the long /ē/ sound — the e speaks.',
    },
    {
      id: 6,
      image: '/images/phonics-intermediate-unit-6.webp',
      title: "Long Vowel I: i_e, igh, ie, y",
      focus: 'Four spellings of the long /ī/ sound.',
      soundFocus: 'i_e (bike), igh (night), ie (pie), y (fly)',
      introduction:
        'Long I says its own name. There are four main spellings. The "i_e" silent-e pattern is in words like bike and time. The "igh" pattern (with a silent gh) appears in night, light, high. The "ie" pattern is usually at the end of short words like pie and tie. Finally, the letter "y" can act as a vowel and say long I at the end of one-syllable words like fly and sky.',
      wordList: [
        { blend: 'i_e (silent e)', words: ['bike', 'time', 'like', 'ride', 'side', 'line', 'nine', 'slide', 'shine', 'kite'] },
        { blend: 'igh (silent gh)', words: ['night', 'light', 'right', 'might', 'sight', 'fight', 'bright', 'high', 'flight', 'tight'] },
        { blend: 'ie (at end of word)', words: ['pie', 'tie', 'lie', 'die', 'cried', 'tried', 'fried', 'flies'] },
        { blend: 'y (at end of word)', words: ['fly', 'sky', 'why', 'try', 'my', 'cry', 'shy', 'sly', 'spy', 'dry'] },
      ],
      pictureWords: ['bike', 'pie', 'fly', 'kite', 'light', 'tie'],
      activities: [
        {
          type: 'sort',
          instruction: 'Sort these long-I words by spelling pattern: i_e, igh, ie, or y.',
          words: ['bike', 'night', 'pie', 'fly', 'light', 'kite', 'tie', 'sky', 'shine', 'bright', 'cried', 'try'],
        },
        {
          type: 'fill',
          instruction: 'Fill in the missing long-I spelling to finish each word.',
          blanks: ['b__k__ (two wheels)', 'n__t (not day)', 'p__ (dessert)', 'fl__ (wings)', 'k__t__ (in the wind)', 'br__t (shining)'],
        },
        {
          type: 'sentences',
          instruction: 'Read and underline every long-I word.',
          sentences: [
            'At night, my kite flies high in the bright sky.',
            'Mike tried to ride his new bike past the big slide.',
            'The shy fly sat quietly on the apple pie.',
            'Why did the little spy tie a knot in the line?',
          ],
        },
        {
          type: 'build',
          instruction: 'Build a new word by swapping the beginning letter. Example: bike → hike → Mike. Try: night → ?, fly → ?, pie → ?',
          content: 'night / fly / pie / time / light / try',
        },
        {
          type: 'write',
          instruction: 'Write a short paragraph describing the night sky. Use at least five long-I words.',
          content: '',
        },
      ],
      decodablePassage: {
        title: 'Mike and the Midnight Kite',
        text: `Mike liked to ride his bike at twilight. One bright summer night he tied a silver kite to the back of his bike and set off down the side path. The sky shone with nine white stars. "Why not let it fly high?" Mike said with a smile. He pedalled faster, and the kite lifted into the night. It flapped like a giant butterfly. A shy fly buzzed past, and an owl cried from a tall pine. Mike laughed out loud. By the time he reached home, he had flown his kite higher than the rooftops. He untied the line and sighed. What a fine, delightful ride.`,
        questions: [
          'What did Mike tie to the back of his bike?',
          'How many stars were in the sky?',
          'How did Mike feel at the end of his ride?',
        ],
      },
      tip: 'The "igh" pattern looks odd because the gh is silent, but it is worth memorising — it appears in many common words. Try this chant: "I-G-H says /ī/ and we don\'t know why!"',
    },
    {
      id: 7,
      image: '/images/phonics-intermediate-unit-7.webp',
      title: "Long Vowel O: o_e, oa, ow",
      focus: 'Three spellings of the long /ō/ sound.',
      soundFocus: 'o_e (note), oa (boat), ow (snow)',
      introduction:
        'Long O says its own name. You will see it spelled three common ways. The "o_e" silent-e pattern gives us words like note and home. The "oa" pattern usually appears in the middle of a word: boat, road, goal. The "ow" pattern usually appears at the end of a word: snow, low, window. Each pattern has its favourite spot in a word.',
      wordList: [
        { blend: 'o_e (silent e)', words: ['note', 'home', 'rope', 'bone', 'cone', 'hope', 'stone', 'phone', 'globe', 'smoke', 'close', 'those'] },
        { blend: 'oa (middle of word)', words: ['boat', 'coat', 'road', 'goat', 'soap', 'toad', 'loaf', 'coast', 'toast', 'float', 'cloak', 'goal'] },
        { blend: 'ow (end of word)', words: ['snow', 'low', 'grow', 'show', 'blow', 'slow', 'mow', 'throw', 'window', 'yellow', 'pillow', 'elbow'] },
      ],
      pictureWords: ['boat', 'snow', 'rope', 'goat', 'coat', 'window'],
      activities: [
        {
          type: 'sort',
          instruction: 'Sort these long-O words into three groups: o_e, oa, or ow.',
          words: ['note', 'boat', 'snow', 'home', 'coat', 'low', 'rope', 'road', 'show', 'stone', 'soap', 'window'],
        },
        {
          type: 'fill',
          instruction: 'Fill in the missing long-O spelling (o_e, oa, or ow).',
          blanks: ['n__t__ (short message)', 'b__t (on water)', 'sn__ (cold weather)', 'h__m__ (where you live)', 'g__t (farm animal)', 'sh__ (let others see)'],
        },
        {
          type: 'sentences',
          instruction: 'Read and underline every long-O word.',
          sentences: [
            'Joan rode home in a yellow boat along the road.',
            'The goat slowly ate the oats beside the open gate.',
            'Please close the window before the snow blows in.',
            'I hope Rose will show me her phone at home.',
          ],
        },
        {
          type: 'build',
          instruction: 'Add silent-e or change the spelling to make a long-O word. Example: hop → hope. Try: not → ?, rob → ?, con → ?, slop → ?',
          content: 'not / rob / con / slop / rod / cop',
        },
        {
          type: 'write',
          instruction: 'Write four sentences about a snowy day. Use at least one o_e, one oa, and one ow word.',
          content: '',
        },
      ],
      decodablePassage: {
        title: 'Joan and the Yellow Coat',
        text: `Joan pulled on her yellow coat and stepped outside. Fresh snow had covered the whole road overnight. She threw a soft snowball that landed with a quiet thump on the window. Her goat, Toast, ate oats from a bucket by the gate. "Let us go to the lake!" Joan called. She slowly rowed her small boat out onto the cold water. Her nose glowed pink in the breeze. Soap bubbles from last night's bath floated from her pocket. Joan grinned and blew them into the low sky. When she got home, she wrote a note to her Gran about the lovely morning. It felt like a dream.`,
        questions: [
          'What colour was Joan\'s coat?',
          'What was the goat\'s name?',
          'Who did Joan write a note to at the end?',
        ],
      },
      tip: 'Think of "oa" as a team that likes the middle, and "ow" as a team that likes the end. "Boat" in the middle, "snow" at the end. This pattern works most of the time.',
    },
    {
      id: 8,
      image: '/images/phonics-intermediate-unit-8.webp',
      title: "Long Vowel U and Cousins: u_e, ue, ew, oo",
      focus: 'Long /ū/ spellings and the related /oo/ sound.',
      soundFocus: 'u_e (cube), ue (blue), ew (new), oo (moon)',
      introduction:
        'Long U is a little different — it can say two sounds. Sometimes it says "yoo" as in cube and music. Sometimes it says "oo" as in blue, new and moon. The spellings "u_e", "ue", "ew" and "oo" all belong to this family of sounds. Listen carefully as you read and your ear will soon tell you which sound is which.',
      wordList: [
        { blend: 'u_e (silent e)', words: ['cube', 'use', 'tune', 'cute', 'mute', 'rule', 'June', 'huge', 'flute', 'prune'] },
        { blend: 'ue (at end of word)', words: ['blue', 'true', 'glue', 'clue', 'due', 'Sue', 'rescue', 'value'] },
        { blend: 'ew (at end of word)', words: ['new', 'few', 'grew', 'blew', 'chew', 'drew', 'flew', 'stew', 'crew', 'threw'] },
        { blend: 'oo (as in moon)', words: ['moon', 'soon', 'food', 'cool', 'pool', 'zoo', 'room', 'boot', 'spoon', 'broom'] },
      ],
      pictureWords: ['moon', 'glue', 'flute', 'spoon', 'boot', 'balloon'],
      activities: [
        {
          type: 'sort',
          instruction: 'Sort these long-U words by spelling pattern: u_e, ue, ew, or oo.',
          words: ['cube', 'blue', 'new', 'moon', 'flute', 'glue', 'drew', 'pool', 'June', 'true', 'threw', 'spoon'],
        },
        {
          type: 'fill',
          instruction: 'Fill in the missing spelling (u_e, ue, ew, or oo).',
          blanks: ['m__n (shines at night)', 'bl__ (colour)', 'n__ (not old)', 'sp__n (eating tool)', 'c__b__ (six faces)', 'gl__ (sticky)'],
        },
        {
          type: 'sentences',
          instruction: 'Read each sentence and underline every long-U word.',
          sentences: [
            'Sue drew a huge blue balloon on the new paper.',
            'The crew flew to the moon in June.',
            'Please use the glue to stick the cube to the board.',
            'A few cool drops of rain fell into the pool.',
          ],
        },
        {
          type: 'build',
          instruction: 'Change one letter or add silent-e to make a long-U word. Example: cub → cube. Try: tub → ?, us → ?, cut → ?, hug → ?',
          content: 'cub / us / cut / hug / plum / tub',
        },
        {
          type: 'write',
          instruction: 'Write a short paragraph about a trip to the zoo. Use at least five long-U or /oo/ words.',
          content: '',
        },
      ],
      decodablePassage: {
        title: 'Sue and the Blue Balloon',
        text: `In June, Sue went to the zoo with her new friend Drew. She held a huge blue balloon that glowed in the afternoon sun. They grew hungry and sat by the pool to eat stew from a deep spoon. "Look at the moon kite!" Drew cried. A cool breeze blew, and Sue's balloon flew high into the air. "Oh no!" she cried. Drew drew a plan in his notebook. They would use glue and string to catch it. Soon the balloon dropped into a tree. Drew threw a soft boot and knocked it down. Sue grinned. It was a true and wonderful day at the zoo.`,
        questions: [
          'Where did Sue and Drew go together?',
          'What did they eat from a deep spoon?',
          'How did they get the balloon back?',
        ],
      },
      tip: 'Listen carefully: "cute" has a little /y/ sound before the /oo/, but "rule" does not. Both are spelled with u_e. Your ear is the best guide — let the word roll off your tongue.',
    },
    {
      id: 9,
      image: '/images/phonics-intermediate-unit-9.webp',
      title: 'R-Controlled Vowels: ar, or, er, ir, ur',
      focus: 'Vowels whose sound is changed by a following R.',
      soundFocus: 'ar (car), or (for), er (her), ir (bird), ur (burn)',
      introduction:
        'When a vowel is followed by the letter R, the R bosses the vowel around and changes the sound. We call these "R-controlled vowels" or sometimes "bossy R". The "ar" sound is heard in car and star. The "or" sound is heard in for and sport. Here is the tricky part: "er", "ir" and "ur" all make the same sound — /er/ as in her, bird and burn. You must learn which spelling each word uses.',
      wordList: [
        { blend: 'ar (as in car)', words: ['car', 'star', 'farm', 'park', 'arm', 'barn', 'shark', 'smart', 'dark', 'hard'] },
        { blend: 'or (as in for)', words: ['for', 'sport', 'fork', 'born', 'corn', 'short', 'storm', 'horse', 'north', 'morning'] },
        { blend: 'er (as in her)', words: ['her', 'herd', 'verb', 'term', 'fern', 'person', 'water', 'mother', 'father', 'winter'] },
        { blend: 'ir (as in bird)', words: ['bird', 'girl', 'dirt', 'first', 'shirt', 'third', 'stir', 'chirp', 'thirst', 'birthday'] },
        { blend: 'ur (as in burn)', words: ['burn', 'turn', 'hurt', 'curl', 'fur', 'church', 'purple', 'Thursday', 'nurse', 'surf'] },
      ],
      pictureWords: ['car', 'horse', 'bird', 'nurse', 'shirt', 'star'],
      activities: [
        {
          type: 'sort',
          instruction: 'Sort these words by r-controlled pattern: ar, or, er, ir, or ur.',
          words: ['car', 'for', 'her', 'bird', 'burn', 'star', 'sport', 'dirt', 'turn', 'fern', 'fork', 'park'],
        },
        {
          type: 'fill',
          instruction: 'Fill in the missing r-controlled pattern (ar, or, er, ir or ur).',
          blanks: ['c__ (vehicle)', 'b__d (has wings)', 'n__se (helps the sick)', 'st__m (bad weather)', 'h__ (belongs to a girl)', 'sh__t (clothing)'],
        },
        {
          type: 'sentences',
          instruction: 'Read and underline every r-controlled vowel you find.',
          sentences: [
            'The smart girl parked her car by the barn.',
            'A purple bird chirped on the short fern.',
            'Her father wore a shirt with a star on the corner.',
            'In the morning, the nurse will turn on the lamp.',
          ],
        },
        {
          type: 'build',
          instruction: 'Three spellings sound the same! Make a word list of three er/ir/ur words that rhyme. Example: her, stir, fur.',
          content: 'er / ir / ur — find rhyming sets',
        },
        {
          type: 'write',
          instruction: 'Write four sentences about something you do in the morning. Use at least four r-controlled words.',
          content: '',
        },
      ],
      decodablePassage: {
        title: "Bert's Birthday on the Farm",
        text: `It was Bert's third birthday on the big green farm. Early in the morning, a herd of horses ran past the barn. A tiny bird chirped in the fern. Bert wore a bright purple shirt and a smart dark cap. His sister Carmen served corn bread and fresh fruit on the porch. "Turn around!" she called. There was a huge star-shaped cake in the corner of the garden. Bert grinned. He cut the first slice with a silver fork. After lunch, he and Carmen took turns riding on Sparky, the short brown horse. Bert said it was the best birthday he had ever had on the farm.`,
        questions: [
          'How old was Bert turning?',
          'What colour was Bert\'s shirt?',
          'What was the name of the brown horse?',
        ],
      },
      tip: 'Because "er", "ir" and "ur" sound identical, you have to remember which spelling fits each word. Reading lots of books is the best cure — your eyes learn the right shape of each word.',
    },
    {
      id: 10,
      image: '/images/phonics-intermediate-unit-10.webp',
      title: 'Multi-Syllable Words and Syllable Division',
      focus: 'Breaking bigger words into smaller parts to read them smoothly.',
      soundFocus: 'syllable division: VC/CV, V/CV, and consonant+le',
      introduction:
        'A syllable is a chunk of sound that has one vowel sound. Every word has at least one syllable. Long words become easy to read when you break them into syllables. Three helpful rules: VC/CV means split between two consonants (nap-kin, bas-ket). V/CV means split before a single consonant so the first vowel stays long (pi-lot, ba-by). Consonant+le means the last three letters form their own syllable (can-dle, ta-ble).',
      wordList: [
        { blend: 'Two syllables: VC/CV (split between consonants)', words: ['nap-kin', 'bas-ket', 'rab-bit', 'pic-nic', 'sud-den', 'ten-nis', 'pen-cil', 'win-ter'] },
        { blend: 'Two syllables: V/CV (open first syllable)', words: ['pi-lot', 'ba-by', 'ti-ger', 'ro-bot', 'mu-sic', 'o-pen', 'pa-per', 'fro-zen'] },
        { blend: 'Two syllables: consonant + le', words: ['ta-ble', 'can-dle', 'pur-ple', 'lit-tle', 'un-cle', 'ea-gle', 'bub-ble', 'mid-dle'] },
        { blend: 'Three syllables', words: ['el-e-phant', 'um-brel-la', 'ba-nan-a', 'fa-mi-ly', 're-mem-ber', 'won-der-ful', 'to-ma-to', 'yes-ter-day'] },
        { blend: 'Four syllables', words: ['cal-cu-la-tor', 'al-pha-bet-i-cal', 'un-for-tu-nate', 'in-vi-ta-tion', 'ce-le-bra-tion', 'im-a-gi-na-tion'] },
      ],
      pictureWords: ['elephant', 'umbrella', 'tiger', 'candle', 'banana', 'calculator'],
      activities: [
        {
          type: 'sort',
          instruction: 'Sort these words by number of syllables: 2 syllables, 3 syllables, or 4 syllables.',
          words: ['rabbit', 'elephant', 'calculator', 'table', 'banana', 'tiger', 'invitation', 'picnic', 'family', 'purple', 'umbrella', 'imagination'],
        },
        {
          type: 'fill',
          instruction: 'Draw a line (or dash) to split each word into syllables.',
          blanks: ['pilot', 'basket', 'candle', 'tiger', 'rabbit', 'remember'],
        },
        {
          type: 'sentences',
          instruction: 'Read each sentence aloud. Underline every word that has more than one syllable.',
          sentences: [
            'The pilot flew the little plane over the frozen mountain.',
            'My uncle packed a picnic basket with bananas and purple grapes.',
            'Yesterday, the tiger hid under a wonderful green umbrella.',
            'Remember to send an invitation to every family member.',
          ],
        },
        {
          type: 'build',
          instruction: 'Add a syllable to the beginning or end of each short word to make a longer word. Example: sun → sun-ny, sun-shine.',
          content: 'sun, rain, book, play, teach, garden',
        },
        {
          type: 'write',
          instruction: 'Write a short paragraph (4-5 sentences) about your family. Use at least four words that have three or more syllables.',
          content: '',
        },
      ],
      decodablePassage: {
        title: 'A Wonderful Celebration',
        text: `Yesterday, my family held a wonderful celebration for my little cousin's birthday. My uncle packed a basket with ripe bananas, purple grapes and a big tomato salad. The table was covered in a yellow tablecloth, and a single candle glowed in the middle. My cousin opened her invitation and laughed. Inside was a photo of a tiger wearing an umbrella hat! After lunch, we played music and danced under the frozen winter sky. Even Grandpa, who is usually quiet, began to sing. I will always remember the laughter, the candles and the way my family smiled. It was a truly magical afternoon together.`,
        questions: [
          'Whose birthday was the family celebrating?',
          'What was inside the cousin\'s invitation?',
          'Who began to sing after lunch?',
        ],
      },
      tip: 'Reading long words is like eating a sandwich — one bite at a time. Split the word into syllables, say each chunk, then blend them together. The more you practise, the faster your brain will chunk new words.',
    },
  ],
}
