export const book = {
  id: 'comprehension-beginner',
  series: 'comprehension',
  level: 'Beginner',
  title: 'PEEL Comprehension Workbook',
  subtitle: 'Beginner Level',
  color: '#7C3AED',
  lightColor: '#EDE9FE',
  description: 'Build your reading and comprehension skills step by step using the PEEL method.',
  units: [
    {
      id: 1,
      title: 'My Family',
      image: '/images/comprehension-beginner-unit-1.webp',
      imagePrompt: 'A warm family scene inside a cosy kitchen: a mother with an apron stirring a pot on the stove, a father in work clothes hanging up his jacket, a young girl with braids setting the table, and a slightly older boy holding a football under one arm. Soft yellow light from a window, a ginger cat on the floor, family photos on the wall. Bright, inclusive, colourful children\'s book illustration.',
      passage: `My name is Leila. I live with my family in a small yellow house.

My mum is a nurse at the hospital. When she comes home, she cooks warm soup and soft bread. My dad drives a big blue taxi all day. He tells funny jokes at dinner.

I have one brother. His name is Sam and he is ten. Sam loves football more than anything.

On Saturdays, we go to the park together. We play, laugh and eat ice cream. I think my family is the best family in the world.`,
      vocabulary: ['family', 'nurse', 'cooks', 'together', 'laugh'],
      peelQuestions: [
        {
          question: 'Who are the people in Leila\'s family?',
          tier: 'literal',
          scaffold: {
            P: 'Leila\'s family has _____ people. They are her _____, her _____ and her _____.',
            E: 'The text says: "I live with my family in a _____ yellow house." It also says, "I have one brother. His name is _____."',
            E2: 'This shows that Leila lives with _____ because the text names each person.',
            L: 'This is important because it tells us who the story is about.',
          },
        },
        {
          question: 'What does Leila\'s mum do for work?',
          tier: 'literal',
          scaffold: {
            P: 'Leila\'s mum works as a _____.',
            E: 'The text says: "My mum is a _____ at the hospital."',
            E2: 'This shows that her mum has a job helping _____.',
            L: 'This is important because it tells us more about Leila\'s family.',
          },
        },
        {
          question: 'How do you know Leila loves her family?',
          tier: 'inferential',
          scaffold: {
            P: 'I think Leila loves her family because _____.',
            E: 'The text says: "I think my family is the _____ family in the world."',
            E2: 'This shows that Leila feels _____ about her family because they _____ together.',
            L: 'This is important because families make us feel _____.',
          },
        },
      ],
    },
    {
      id: 2,
      title: 'Animals on the Farm',
      image: '/images/comprehension-beginner-unit-2.webp',
      imagePrompt: 'A sunny farm with a big red barn, green hills in the background and a winding path. In the foreground: a brown-and-white cow chewing grass, a pink pig rolling in a muddy puddle, a small hen with fluffy chicks, a tall brown horse by a fence, a woolly white sheep, and a black-and-white dog barking happily. Bright sky with a few fluffy clouds. Warm, colourful children\'s book illustration.',
      passage: `On Mr Khan\'s farm, there are many animals. Each one helps in a different way.

The cow is big and brown. She gives us fresh milk every morning. The pig is pink and loves to roll in cool mud. The hen lays small white eggs in her nest.

The horse is tall and strong. He pulls the cart for the farmer. The sheep has soft, woolly hair. Her wool keeps us warm in winter.

The farm dog barks when strangers come close. All the animals are important on this busy little farm.`,
      vocabulary: ['farm', 'fresh', 'lays', 'woolly', 'strangers'],
      peelQuestions: [
        {
          question: 'What does the cow give us on the farm?',
          tier: 'literal',
          scaffold: {
            P: 'The cow gives us _____.',
            E: 'The text says: "She gives us _____ milk every morning."',
            E2: 'This shows that the cow is useful because she gives us _____ to drink.',
            L: 'This is important because milk helps us grow _____.',
          },
        },
        {
          question: 'Why does the dog bark on the farm?',
          tier: 'literal',
          scaffold: {
            P: 'The dog barks because _____.',
            E: 'The text says: "The farm dog barks when _____ come close."',
            E2: 'This tells us that the dog helps to keep the farm _____.',
            L: 'This is important because every animal has a _____.',
          },
        },
        {
          question: 'Why do you think all the animals are important on the farm?',
          tier: 'inferential',
          scaffold: {
            P: 'I think all the animals are important because _____.',
            E: 'The text says the cow gives us "_____," the hen "_____," and the sheep\'s wool "_____."',
            E2: 'This shows that each animal _____ in its own way.',
            L: 'This is important because without the animals, the farmer would _____.',
          },
        },
      ],
    },
    {
      id: 3,
      title: 'At the Park',
      image: '/images/comprehension-beginner-unit-3.webp',
      imagePrompt: 'A bright, busy neighbourhood park on a sunny afternoon. In the centre: a long blue slide with a child sliding down, two swings with children swinging high, and a green grass field where three children kick a red football. On a wooden bench under a leafy tree, an older man reads a newspaper. A mother pushes a pram along the path. Flowers along the edges. Warm, cheerful, inclusive children\'s book illustration.',
      passage: `After school, Amir runs to Green Park with his little sister Zara.

The park is full of children of all ages. Amir jumps onto a swing and pushes himself higher and higher. Zara is only three, so she plays in the sandpit with a yellow bucket.

His best friend Maya zooms down the long blue slide. Some big boys kick a football on the grass. Under a shady tree, an old man reads his newspaper.

A soft wind blows through the trees. Everyone at the park is smiling. Amir thinks this is his favourite place in the whole town.`,
      vocabulary: ['swing', 'sandpit', 'shady', 'zooms', 'favourite'],
      peelQuestions: [
        {
          question: 'What does Zara do at the park?',
          tier: 'literal',
          scaffold: {
            P: 'Zara plays in the _____ with a _____ bucket.',
            E: 'The text says: "Zara is only three, so she plays in the _____ with a yellow bucket."',
            E2: 'This shows that Zara is a _____ child who enjoys _____ play.',
            L: 'This is important because it shows the park has fun for all _____.',
          },
        },
        {
          question: 'Who is Amir\'s best friend and what does she do?',
          tier: 'literal',
          scaffold: {
            P: 'Amir\'s best friend is _____. She _____ down the slide.',
            E: 'The text says: "His best friend Maya _____ down the long blue slide."',
            E2: 'This tells us that Maya likes to play on the _____.',
            L: 'This is important because it shows friends enjoy playing _____.',
          },
        },
        {
          question: 'Why do you think the park is a good place for everyone?',
          tier: 'inferential',
          scaffold: {
            P: 'I think the park is a good place for everyone because _____.',
            E: 'The text says children play on "_____" and the old man "_____."',
            E2: 'This shows that both young and old people can _____ at the park.',
            L: 'This is important because public places should welcome _____.',
          },
        },
      ],
    },
    {
      id: 4,
      title: 'My School Day',
      image: '/images/comprehension-beginner-unit-4.webp',
      imagePrompt: 'A cheerful primary classroom. A kind teacher with a purple dress stands at a whiteboard pointing at numbers. Children in neat school uniforms sit at wooden desks with open books and colourful pencils. Posters on the wall show the alphabet, a world map, and a poem. A window shows green trees outside. Warm natural light, bright and welcoming, children\'s book illustration style.',
      passage: `I wake up at six o\'clock every weekday. I brush my teeth, put on my blue uniform and eat porridge for breakfast.

At school, the first lesson is reading. My teacher, Miss Nkosi, reads a funny story to us. Next, we do maths. I like counting and adding numbers on the board.

At break time, we eat our sandwiches and play outside. After break, we have English and write new words in our books.

In the afternoon, we do science and learn about plants. I walk home with my friend Tumi. School makes me feel clever and happy.`,
      vocabulary: ['uniform', 'porridge', 'lesson', 'break', 'clever'],
      peelQuestions: [
        {
          question: 'What subjects does the writer study at school?',
          tier: 'literal',
          scaffold: {
            P: 'At school, the writer studies _____, _____, _____ and _____.',
            E: 'The text says: "the first lesson is _____," then "we do _____," then "we have _____," and in the afternoon "_____."',
            E2: 'This shows that the school day has _____ different subjects.',
            L: 'This is important because learning many subjects helps us grow _____.',
          },
        },
        {
          question: 'What is the writer\'s teacher called?',
          tier: 'literal',
          scaffold: {
            P: 'The writer\'s teacher is called _____.',
            E: 'The text says: "My teacher, _____, reads a funny story to us."',
            E2: 'This shows that the teacher makes lessons _____.',
            L: 'This is important because a kind teacher helps learners to _____.',
          },
        },
        {
          question: 'How do we know the writer enjoys school?',
          tier: 'inferential',
          scaffold: {
            P: 'I can tell the writer enjoys school because _____.',
            E: 'The text says: "School makes me feel _____ and _____."',
            E2: 'This shows that the writer feels _____ at school because _____.',
            L: 'This is important because when we enjoy school, we learn _____.',
          },
        },
      ],
    },
    {
      id: 5,
      title: 'Food I Like',
      image: '/images/comprehension-beginner-unit-5.webp',
      imagePrompt: 'A warm family breakfast scene: a wooden table with a bowl of colourful fruit (bananas, apples, oranges), a plate of brown bread with jam, a glass of orange juice, and a steaming bowl of porridge. In the background, a pot of vegetable stew on the stove. A smiling child sits at the table holding a spoon. Cheerful morning light, inviting, children\'s book illustration style.',
      passage: `Food gives me energy for the whole day. I love to eat many different things.

For breakfast, I eat warm porridge with a little honey. I also drink a glass of milk. At school, I open my lunchbox and find a cheese sandwich, an apple and a small juice.

When I get home, my gran gives me a banana for a snack. For dinner, my mum cooks rice, chicken and green vegetables. Sometimes we have soup when it is cold.

Eating good food keeps my body strong and my mind sharp.`,
      vocabulary: ['energy', 'porridge', 'lunchbox', 'snack', 'strong'],
      peelQuestions: [
        {
          question: 'What does the writer eat for breakfast?',
          tier: 'literal',
          scaffold: {
            P: 'For breakfast, the writer eats _____ and drinks _____.',
            E: 'The text says: "For breakfast, I eat warm _____ with a little _____. I also drink a glass of _____."',
            E2: 'This shows that the writer starts the day with a _____ meal.',
            L: 'This is important because breakfast gives us _____ for the morning.',
          },
        },
        {
          question: 'What does the writer\'s mum cook for dinner?',
          tier: 'literal',
          scaffold: {
            P: 'For dinner, the writer\'s mum cooks _____, _____ and _____.',
            E: 'The text says: "For dinner, my mum cooks _____, _____ and green _____."',
            E2: 'This tells us that dinner is a _____ meal with many foods.',
            L: 'This is important because a balanced meal helps us stay _____.',
          },
        },
        {
          question: 'Why is it important to eat good food?',
          tier: 'inferential',
          scaffold: {
            P: 'It is important to eat good food because _____.',
            E: 'The text says: "Eating good food keeps my body _____ and my mind _____."',
            E2: 'This shows that food helps our _____ and our _____.',
            L: 'This is important because without good food we cannot _____.',
          },
        },
      ],
    },
    {
      id: 6,
      title: 'The Weather',
      image: '/images/comprehension-beginner-unit-6.webp',
      imagePrompt: 'A four-part illustration showing different weather: a sunny scene with children in shorts playing on grass; a rainy scene with a child under a red umbrella splashing in a puddle; a cold winter scene with a child in a blue jacket and scarf beside bare trees; and a windy scene with leaves flying and a child holding their hat. Bright, clear, educational, children\'s book illustration.',
      passage: `The weather is different on different days. Today might be sunny, but tomorrow could be rainy.

When the sun shines, the sky is blue and the air is warm. We wear shorts and t-shirts. We drink cold water to stay cool.

When it rains, clouds turn grey and water falls from the sky. We put on raincoats and open our umbrellas.

In winter, the air feels cold. We wear thick jackets, scarves and gloves. When the wind blows hard, leaves spin in the air.

Each morning, I look outside to see what to wear.`,
      vocabulary: ['weather', 'shines', 'raincoats', 'thick', 'spin'],
      peelQuestions: [
        {
          question: 'What do people wear when the sun shines?',
          tier: 'literal',
          scaffold: {
            P: 'When the sun shines, people wear _____ and _____.',
            E: 'The text says: "We wear _____ and _____. We drink _____ water to stay cool."',
            E2: 'This shows that people wear _____ clothes in hot weather.',
            L: 'This is important because we need to dress for the _____.',
          },
        },
        {
          question: 'What happens when it rains?',
          tier: 'literal',
          scaffold: {
            P: 'When it rains, the clouds turn _____ and water _____.',
            E: 'The text says: "When it rains, clouds turn _____ and water _____ from the sky."',
            E2: 'This tells us that rainy weather looks _____ and feels _____.',
            L: 'This is important because we need to stay _____ when it rains.',
          },
        },
        {
          question: 'Why do you think the writer looks outside each morning?',
          tier: 'inferential',
          scaffold: {
            P: 'I think the writer looks outside each morning because _____.',
            E: 'The text says: "Each morning, I look outside to see what to _____."',
            E2: 'This shows that the writer wants to dress in the right _____ for the weather.',
            L: 'This is important because wearing the right clothes keeps us _____.',
          },
        },
      ],
    },
    {
      id: 7,
      title: 'My Body',
      image: '/images/comprehension-beginner-unit-7.webp',
      imagePrompt: 'A friendly, labelled illustration of a smiling child standing with arms out. Clear, gentle labels point to: eyes (to see), ears (to hear), nose (to smell), mouth (to taste and speak), hands (to touch and hold), and feet (to walk and run). Around the child: a small picture of a toothbrush, an apple, and a bed to show healthy habits. Bright, educational, inclusive children\'s book illustration.',
      passage: `My body is amazing. Every part has a special job.

I use my eyes to see the world around me. My ears help me to hear music and voices. I use my nose to smell fresh bread and sweet flowers. My mouth helps me to taste food and to speak kind words.

My hands can hold a pencil, wave hello and clap loudly. My legs help me to walk, run and jump high.

I look after my body in simple ways. I brush my teeth, wash my hands and eat fruit. I also sleep for ten hours each night.`,
      vocabulary: ['amazing', 'voices', 'taste', 'brush', 'sleep'],
      peelQuestions: [
        {
          question: 'What do we use our eyes and ears for?',
          tier: 'literal',
          scaffold: {
            P: 'We use our eyes to _____ and our ears to _____.',
            E: 'The text says: "I use my eyes to _____ the world around me. My ears help me to _____ music and voices."',
            E2: 'This shows that our eyes and ears help us to _____ the world.',
            L: 'This is important because our senses help us every _____.',
          },
        },
        {
          question: 'How does the writer look after their body?',
          tier: 'literal',
          scaffold: {
            P: 'The writer looks after their body by _____, _____ and _____.',
            E: 'The text says: "I _____ my teeth, wash my hands and eat _____. I also sleep for _____ hours each night."',
            E2: 'This shows that looking after your body means doing small things _____.',
            L: 'This is important because healthy habits keep us _____.',
          },
        },
        {
          question: 'Why is it important to take care of your body?',
          tier: 'inferential',
          scaffold: {
            P: 'It is important to take care of your body because _____.',
            E: 'The text says every body part has "a _____ job" and lists ways to "look after my body."',
            E2: 'This shows that if we care for our bodies, we can _____ well every day.',
            L: 'This is important because our body is the only _____ we have.',
          },
        },
      ],
    },
    {
      id: 8,
      title: 'Colours and Shapes',
      image: '/images/comprehension-beginner-unit-8.webp',
      imagePrompt: 'A bright, playful scene showing everyday objects grouped by shape and colour: a round yellow sun in the sky, a red ball on the ground, a square blue book on a table, a green triangular slice of watermelon, and a long orange rectangular door. A curious child points at each object. Clean lines, bold colours, educational children\'s book illustration.',
      passage: `Colours and shapes are all around us. When you look carefully, you can see them everywhere.

A circle is round and has no corners. The sun in the sky is a yellow circle. A ball that you kick is also a circle.

A square has four sides, all the same size. A picture book is often the shape of a square. A triangle has three sides. A slice of pizza looks like a triangle.

A rectangle is long on two sides and short on the other two. A door and a blackboard are rectangles.

Red, blue, green and yellow make the world bright and fun.`,
      vocabulary: ['corners', 'sides', 'slice', 'bright', 'everywhere'],
      peelQuestions: [
        {
          question: 'What shape is the sun in the sky?',
          tier: 'literal',
          scaffold: {
            P: 'The sun in the sky is a _____ _____.',
            E: 'The text says: "The sun in the sky is a _____ _____."',
            E2: 'This shows that the sun is shaped like a _____ and is the colour _____.',
            L: 'This is important because we can see shapes in _____ things.',
          },
        },
        {
          question: 'How many sides does a triangle have?',
          tier: 'literal',
          scaffold: {
            P: 'A triangle has _____ sides.',
            E: 'The text says: "A triangle has _____ sides. A slice of _____ looks like a triangle."',
            E2: 'This tells us that a triangle is a shape we can see in everyday _____.',
            L: 'This is important because knowing shapes helps us describe _____.',
          },
        },
        {
          question: 'Why do you think knowing colours and shapes is useful?',
          tier: 'inferential',
          scaffold: {
            P: 'I think knowing colours and shapes is useful because _____.',
            E: 'The text says: "Colours and shapes are _____ us" and they "make the world _____ and fun."',
            E2: 'This shows that colours and shapes help us to _____ and describe what we see.',
            L: 'This is important because we use colours and shapes when we _____.',
          },
        },
      ],
    },
  ],
}
