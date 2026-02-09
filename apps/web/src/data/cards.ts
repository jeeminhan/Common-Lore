import {
  Card,
  Suit,
  Rank,
  ActionCardType,
  SUIT_THEMES,
} from '@crossings/shared';

// ============ SPADES: CAREER BRIDGE (Vision & Responsibility) ============

const spadesCards: Omit<Card, 'id'>[] = [
  {
    suit: Suit.SPADES,
    rank: Rank.ACE,
    prompt: '',
    isActionCard: true,
    actionType: ActionCardType.REFERRAL,
    actionDescription:
      'The Referral: Nominate another player to answer a question of your choice from your hand.',
  },
  {
    suit: Suit.SPADES,
    rank: Rank.KING,
    prompt:
      'If you could give a speech to the leaders of your industry today, what truth would you want them to hear?',
    isActionCard: false,
  },
  {
    suit: Suit.SPADES,
    rank: Rank.QUEEN,
    prompt:
      'How could your future career be used to serve or "bless" your community back home one day?',
    isActionCard: false,
  },
  {
    suit: Suit.SPADES,
    rank: Rank.JACK,
    prompt:
      'What does "success" look like to your parents, and how does that compare to your own definition?',
    isActionCard: false,
  },
  {
    suit: Suit.SPADES,
    rank: Rank.TEN,
    prompt:
      'When you return home, what is the first "big problem" you hope your new expertise will help solve?',
    isActionCard: false,
  },
  {
    suit: Suit.SPADES,
    rank: Rank.NINE,
    prompt:
      'Is there someone you are hoping to connect with professionally right now? How can we help?',
    isActionCard: false,
  },
  {
    suit: Suit.SPADES,
    rank: Rank.EIGHT,
    prompt:
      'Who is a leader from your home country that you would want to introduce to your American friends?',
    isActionCard: false,
  },
  {
    suit: Suit.SPADES,
    rank: Rank.SEVEN,
    prompt:
      'If visas and paperwork weren\'t an issue, what would be your "dream first step" after graduation?',
    isActionCard: false,
  },
  {
    suit: Suit.SPADES,
    rank: Rank.SIX,
    prompt:
      "What is a strength you've discovered in yourself only after moving to a different country?",
    isActionCard: false,
  },
  {
    suit: Suit.SPADES,
    rank: Rank.FIVE,
    prompt:
      "How do your personal values or faith change the kind of company you'd be willing to work for?",
    isActionCard: false,
  },
  {
    suit: Suit.SPADES,
    rank: Rank.FOUR,
    prompt:
      'What is the most surprising difference between an interview back home vs. an interview here?',
    isActionCard: false,
  },
  {
    suit: Suit.SPADES,
    rank: Rank.THREE,
    prompt:
      "What's the hardest part about translating your life story into a one-page U.S. resume?",
    isActionCard: false,
  },
  {
    suit: Suit.SPADES,
    rank: Rank.TWO,
    prompt: 'What was your very first "dream job" when you were a child?',
    isActionCard: false,
  },
];

// ============ HEARTS: HOSPITALITY BRIDGE (Oikos & Belonging) ============

const heartsCards: Omit<Card, 'id'>[] = [
  {
    suit: Suit.HEARTS,
    rank: Rank.ACE,
    prompt: '',
    isActionCard: true,
    actionType: ActionCardType.SHARED_TABLE,
    actionDescription:
      'The Shared Table: Everyone at the table must answer the last question asked.',
  },
  {
    suit: Suit.HEARTS,
    rank: Rank.KING,
    prompt:
      'What is a tradition from your family that you hope to pass on to your own children one day?',
    isActionCard: false,
  },
  {
    suit: Suit.HEARTS,
    rank: Rank.QUEEN,
    prompt:
      'If you could "teleport" one person from home to sit at this table for an hour, who would it be?',
    isActionCard: false,
  },
  {
    suit: Suit.HEARTS,
    rank: Rank.JACK,
    prompt:
      'What makes a place feel like "home" to you—is it the people, the smells, or a feeling?',
    isActionCard: false,
  },
  {
    suit: Suit.HEARTS,
    rank: Rank.TEN,
    prompt:
      'In what specific way do you want to be a blessing to your "household" (oikos) right now?',
    isActionCard: false,
  },
  {
    suit: Suit.HEARTS,
    rank: Rank.NINE,
    prompt:
      'What is the most "un-homelike" thing about living in an American dorm or apartment?',
    isActionCard: false,
  },
  {
    suit: Suit.HEARTS,
    rank: Rank.EIGHT,
    prompt:
      'How can friends here best support you when you are feeling the "weight" of being away?',
    isActionCard: false,
  },
  {
    suit: Suit.HEARTS,
    rank: Rank.SEVEN,
    prompt:
      "What is a childhood story or \"fable\" your parents told you that you'll never forget?",
    isActionCard: false,
  },
  {
    suit: Suit.HEARTS,
    rank: Rank.SIX,
    prompt:
      'How do people in your country usually welcome a stranger into their home?',
    isActionCard: false,
  },
  {
    suit: Suit.HEARTS,
    rank: Rank.FIVE,
    prompt:
      'If I were to pray for your family today, what is the "big hope" or "big worry" on their hearts?',
    isActionCard: false,
  },
  {
    suit: Suit.HEARTS,
    rank: Rank.FOUR,
    prompt:
      'Who in your family was your biggest champion in getting you here? What did they sacrifice?',
    isActionCard: false,
  },
  {
    suit: Suit.HEARTS,
    rank: Rank.THREE,
    prompt:
      'What is a "ritual" from home (like making tea) that you keep alive here?',
    isActionCard: false,
  },
  {
    suit: Suit.HEARTS,
    rank: Rank.TWO,
    prompt:
      'What is the first thing you want to eat the moment you land in your home country?',
    isActionCard: false,
  },
];

// ============ DIAMONDS: CULTURAL BRIDGE (Identity & Wisdom) ============

const diamondsCards: Omit<Card, 'id'>[] = [
  {
    suit: Suit.DIAMONDS,
    rank: Rank.ACE,
    prompt: '',
    isActionCard: true,
    actionType: ActionCardType.TRANSLATOR,
    actionDescription:
      'The Translator: Choose a player to explain their answer using a metaphor or a word/phrase from their native language.',
  },
  {
    suit: Suit.DIAMONDS,
    rank: Rank.KING,
    prompt:
      'What does "Honor" mean to you, and how do you show it in a culture that feels "informal"?',
    isActionCard: false,
  },
  {
    suit: Suit.DIAMONDS,
    rank: Rank.QUEEN,
    prompt:
      'How does your community back home celebrate the biggest milestones of life?',
    isActionCard: false,
  },
  {
    suit: Suit.DIAMONDS,
    rank: Rank.JACK,
    prompt:
      'How do you decide which parts of American culture to "adopt" and which to "reject"?',
    isActionCard: false,
  },
  {
    suit: Suit.DIAMONDS,
    rank: Rank.TEN,
    prompt:
      "What do people here often get wrong about your culture that you'd love to correct?",
    isActionCard: false,
  },
  {
    suit: Suit.DIAMONDS,
    rank: Rank.NINE,
    prompt:
      "How does your family's faith or worldview shape the way you handle conflict?",
    isActionCard: false,
  },
  {
    suit: Suit.DIAMONDS,
    rank: Rank.EIGHT,
    prompt:
      "What's a historical event from your nation that you wish every American knew about?",
    isActionCard: false,
  },
  {
    suit: Suit.DIAMONDS,
    rank: Rank.SEVEN,
    prompt:
      'In your culture, who is considered a "hero," and what does that tell us about your values?',
    isActionCard: false,
  },
  {
    suit: Suit.DIAMONDS,
    rank: Rank.SIX,
    prompt:
      'What is the "Good Life"? What kind of music or songs make you think of it?',
    isActionCard: false,
  },
  {
    suit: Suit.DIAMONDS,
    rank: Rank.FIVE,
    prompt:
      'How has being in the U.S. changed the way you look at your own home country?',
    isActionCard: false,
  },
  {
    suit: Suit.DIAMONDS,
    rank: Rank.FOUR,
    prompt:
      'If you could give every American one childhood "memory" to help them understand your culture, what would it be?',
    isActionCard: false,
  },
  {
    suit: Suit.DIAMONDS,
    rank: Rank.THREE,
    prompt:
      'What is a piece of "grandmotherly wisdom" or a proverb you think about when life gets hard?',
    isActionCard: false,
  },
  {
    suit: Suit.DIAMONDS,
    rank: Rank.TWO,
    prompt:
      'What is one thing Americans do that they think is polite, but feels "off" to you?',
    isActionCard: false,
  },
];

// ============ CLUBS: WONDER BRIDGE (Science & Faith) ============

const clubsCards: Omit<Card, 'id'>[] = [
  {
    suit: Suit.CLUBS,
    rank: Rank.ACE,
    prompt: '',
    isActionCard: true,
    actionType: ActionCardType.EXPERIMENT,
    actionDescription:
      'The Experiment: You may "veto" a question and draw a new card, or "challenge" another player to answer your card instead.',
  },
  {
    suit: Suit.CLUBS,
    rank: Rank.KING,
    prompt:
      'If you could ask the Creator of the Universe one scientific question, what would it be?',
    isActionCard: false,
  },
  {
    suit: Suit.CLUBS,
    rank: Rank.QUEEN,
    prompt:
      'How do you personally balance the "seen" physical world with the "unseen" spiritual one?',
    isActionCard: false,
  },
  {
    suit: Suit.CLUBS,
    rank: Rank.JACK,
    prompt:
      'In your research, have you ever found a pattern that felt "too perfect" to be an accident?',
    isActionCard: false,
  },
  {
    suit: Suit.CLUBS,
    rank: Rank.TEN,
    prompt:
      'If you had unlimited funding to help "the least of these" back home using your major, where would you start?',
    isActionCard: false,
  },
  {
    suit: Suit.CLUBS,
    rank: Rank.NINE,
    prompt:
      'What is the toughest ethical choice a scientist in your field has to make?',
    isActionCard: false,
  },
  {
    suit: Suit.CLUBS,
    rank: Rank.EIGHT,
    prompt:
      'Do you find that people at your university treat "Science" like it\'s a religion?',
    isActionCard: false,
  },
  {
    suit: Suit.CLUBS,
    rank: Rank.SEVEN,
    prompt:
      'How could your specific expertise be used as a "platform" for doing good globally?',
    isActionCard: false,
  },
  {
    suit: Suit.CLUBS,
    rank: Rank.SIX,
    prompt:
      "If the universe was designed by an Artist, what does your field reveal about the Artist's personality?",
    isActionCard: false,
  },
  {
    suit: Suit.CLUBS,
    rank: Rank.FIVE,
    prompt:
      'Have you ever felt a sense of "awe" or "worship" while looking at a complex equation or microscope?',
    isActionCard: false,
  },
  {
    suit: Suit.CLUBS,
    rank: Rank.FOUR,
    prompt:
      'What is the biggest scientific or technical challenge your home country is currently facing?',
    isActionCard: false,
  },
  {
    suit: Suit.CLUBS,
    rank: Rank.THREE,
    prompt:
      'Do you think science and faith are two different languages, or are they telling the same story?',
    isActionCard: false,
  },
  {
    suit: Suit.CLUBS,
    rank: Rank.TWO,
    prompt:
      'What is the most "beautiful" or "elegant" thing you\'ve learned about the universe lately?',
    isActionCard: false,
  },
];

// ============ GENERATE FULL DECK ============

function generateCardId(suit: Suit, rank: Rank): string {
  return `${suit}-${rank}`;
}

function addCardIds(cards: Omit<Card, 'id'>[]): Card[] {
  return cards.map((card) => ({
    ...card,
    id: generateCardId(card.suit, card.rank),
  }));
}

export const SPADES_CARDS: Card[] = addCardIds(spadesCards);
export const HEARTS_CARDS: Card[] = addCardIds(heartsCards);
export const DIAMONDS_CARDS: Card[] = addCardIds(diamondsCards);
export const CLUBS_CARDS: Card[] = addCardIds(clubsCards);

export const ALL_CARDS: Card[] = [
  ...SPADES_CARDS,
  ...HEARTS_CARDS,
  ...DIAMONDS_CARDS,
  ...CLUBS_CARDS,
];

export const DECK_SIZE = ALL_CARDS.length; // 52

// ============ HELPER FUNCTIONS ============

export function getCardById(id: string): Card | undefined {
  return ALL_CARDS.find((card) => card.id === id);
}

export function getCardsBySuit(suit: Suit): Card[] {
  return ALL_CARDS.filter((card) => card.suit === suit);
}

export function getActionCards(): Card[] {
  return ALL_CARDS.filter((card) => card.isActionCard);
}

export function getSuitTheme(suit: Suit) {
  return SUIT_THEMES[suit];
}

export function getRankValue(rank: Rank): number {
  const values: Record<Rank, number> = {
    [Rank.ACE]: 1,
    [Rank.TWO]: 2,
    [Rank.THREE]: 3,
    [Rank.FOUR]: 4,
    [Rank.FIVE]: 5,
    [Rank.SIX]: 6,
    [Rank.SEVEN]: 7,
    [Rank.EIGHT]: 8,
    [Rank.NINE]: 9,
    [Rank.TEN]: 10,
    [Rank.JACK]: 11,
    [Rank.QUEEN]: 12,
    [Rank.KING]: 13,
  };
  return values[rank];
}

// ============ FACILITATOR GUIDANCE ============

export interface SuitGuidance {
  suit: Suit;
  name: string;
  watchFor: string;
  pivotQuestion: string;
  bridgeExpanders: string[];
}

export const SUIT_GUIDANCE: SuitGuidance[] = [
  {
    suit: Suit.SPADES,
    name: 'Career Bridge',
    watchFor: 'Anxiety regarding pressure to succeed',
    pivotQuestion: 'Who supports you when the pressure is highest?',
    bridgeExpanders: [
      'Tell me more: "That sounds significant. Can you tell us more about that?"',
      'The Inner Move: "What was going through your mind when that happened?"',
      'The Collective Move: "Is that common where you\'re from, or unique to your family?"',
      'The Bridge Move: "How does that experience help you navigate life here now?"',
    ],
  },
  {
    suit: Suit.HEARTS,
    name: 'Hospitality Bridge',
    watchFor: "Don't rush past homesickness",
    pivotQuestion: 'Missing home means it mattered.',
    bridgeExpanders: [
      'Tell me more: "That sounds significant. Can you tell us more about that?"',
      'The Inner Move: "What was going through your mind when that happened?"',
      'The Collective Move: "Is that common where you\'re from, or unique to your family?"',
      'The Bridge Move: "How does that experience help you navigate life here now?"',
    ],
  },
  {
    suit: Suit.DIAMONDS,
    name: 'Cultural Bridge',
    watchFor: 'Avoid country "lectures"',
    pivotQuestion: 'How has that tradition shaped you specifically?',
    bridgeExpanders: [
      'Tell me more: "That sounds significant. Can you tell us more about that?"',
      'The Inner Move: "What was going through your mind when that happened?"',
      'The Collective Move: "Is that common where you\'re from, or unique to your family?"',
      'The Bridge Move: "How does that experience help you navigate life here now?"',
    ],
  },
  {
    suit: Suit.CLUBS,
    name: 'Wonder Bridge',
    watchFor: 'Encourage awe over argument',
    pivotQuestion: 'What is something in your field that felt like poetry?',
    bridgeExpanders: [
      'Tell me more: "That sounds significant. Can you tell us more about that?"',
      'The Inner Move: "What was going through your mind when that happened?"',
      'The Collective Move: "Is that common where you\'re from, or unique to your family?"',
      'The Bridge Move: "How does that experience help you navigate life here now?"',
    ],
  },
];

export function getGuidanceForSuit(suit: Suit): SuitGuidance | undefined {
  return SUIT_GUIDANCE.find((g) => g.suit === suit);
}
