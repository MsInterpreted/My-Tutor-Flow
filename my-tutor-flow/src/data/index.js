import { book as compBeginner } from './comprehension/beginner.js'
import { book as compIntermediate } from './comprehension/intermediate.js'
import { book as compPreAdvanced } from './comprehension/preAdvanced.js'
import { book as phonicsBeginner } from './phonics/beginner.js'
import { book as phonicsIntermediate } from './phonics/intermediate.js'
import { book as phonicsPreAdvanced } from './phonics/preAdvanced.js'
import { book as langBeginner } from './languageSkills/beginner.js'
import { book as langIntermediate } from './languageSkills/intermediate.js'
import { book as langPreAdvanced } from './languageSkills/preAdvanced.js'

export const allBooks = [
  compBeginner, compIntermediate, compPreAdvanced,
  phonicsBeginner, phonicsIntermediate, phonicsPreAdvanced,
  langBeginner, langIntermediate, langPreAdvanced,
]

export const seriesConfig = {
  comprehension: {
    name: 'PEEL Comprehension',
    color: '#7C3AED',
    light: '#EDE9FE',
    icon: '📖',
    description: 'Build reading comprehension using the structured PEEL method.',
  },
  phonics: {
    name: 'Phonics',
    color: '#0D9488',
    light: '#CCFBF1',
    icon: '🔤',
    description: 'Systematic phonics instruction from sounds to fluent reading.',
  },
  language: {
    name: 'Language Skills',
    color: '#2563EB',
    light: '#DBEAFE',
    icon: '✏️',
    description: 'Grammar, vocabulary and writing for confident communication.',
  },
}

export const levelConfig = {
  Beginner: { badge: 'bg-green-100 text-green-800', dot: 'bg-green-500' },
  Intermediate: { badge: 'bg-amber-100 text-amber-800', dot: 'bg-amber-500' },
  'Pre-Advanced': { badge: 'bg-rose-100 text-rose-800', dot: 'bg-rose-500' },
}
