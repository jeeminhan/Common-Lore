import { randomBytes } from 'crypto';
import { ActionCardType } from '@crossings/shared';
import type { Card, Suit, Rank } from '@crossings/shared';

// Card prompts for each suit
const SPADES_PROMPTS: Record<Exclude<Rank, 'A'>, string> = {
  K: 'If you could give a speech to the leaders of your industry today, what truth would you want them to hear?',
  Q: 'How could your future career be used to serve or "bless" your community back home one day?',
  J: 'What does "success" look like to your parents, and how does that compare to your own definition?',
  '10': 'When you return home, what is the first "big problem" you hope your new expertise will help solve?',
  '9': 'Is there someone you are hoping to connect with professionally right now? How can we help?',
  '8': 'Who is a leader from your home country that you would want to introduce to your American friends?',
  '7': 'If visas and paperwork weren\'t an issue, what would be your "dream first step" after graduation?',
  '6': 'What is a strength you\'ve discovered in yourself only after moving to a different country?',
  '5': 'How do your personal values or faith change the kind of company you\'d be willing to work for?',
  '4': 'What is the most surprising difference between an interview back home vs. an interview here?',
  '3': 'What\'s the hardest part about translating your life story into a one-page U.S. resume?',
  '2': 'What was your very first "dream job" when you were a child?',
};

const HEARTS_PROMPTS: Record<Exclude<Rank, 'A'>, string> = {
  K: 'What is a tradition from your family that you hope to pass on to your own children one day?',
  Q: 'If you could "teleport" one person from home to sit at this table for an hour, who would it be?',
  J: 'What makes a place feel like "home" to you—is it the people, the smells, or a feeling?',
  '10': 'In what specific way do you want to be a blessing to your "household" (oikos) right now?',
  '9': 'What is the most "un-homelike" thing about living in an American dorm or apartment?',
  '8': 'How can friends here best support you when you are feeling the "weight" of being away?',
  '7': 'What is a childhood story or "fable" your parents told you that you\'ll never forget?',
  '6': 'How do people in your country usually welcome a stranger into their home?',
  '5': 'If I were to pray for your family today, what is the "big hope" or "big worry" on their hearts?',
  '4': 'Who in your family was your biggest champion in getting you here? What did they sacrifice?',
  '3': 'What is a "ritual" from home (like making tea) that you keep alive here?',
  '2': 'What is the first thing you want to eat the moment you land in your home country?',
};

const DIAMONDS_PROMPTS: Record<Exclude<Rank, 'A'>, string> = {
  K: 'What does "Honor" mean to you, and how do you show it in a culture that feels "informal"?',
  Q: 'How does your community back home celebrate the biggest milestones of life?',
  J: 'How do you decide which parts of American culture to "adopt" and which to "reject"?',
  '10': 'What do people here often get wrong about your culture that you\'d love to correct?',
  '9': 'How does your family\'s faith or worldview shape the way you handle conflict?',
  '8': 'What\'s a historical event from your nation that you wish every American knew about?',
  '7': 'In your culture, who is considered a "hero," and what does that tell us about your values?',
  '6': 'What is the "Good Life"? What kind of music or songs make you think of it?',
  '5': 'How has being in the U.S. changed the way you look at your own home country?',
  '4': 'If you could give every American one childhood "memory" to help them understand your culture, what would it be?',
  '3': 'What is a piece of "grandmotherly wisdom" or a proverb you think about when life gets hard?',
  '2': 'What is one thing Americans do that they think is polite, but feels "off" to you?',
};

const CLUBS_PROMPTS: Record<Exclude<Rank, 'A'>, string> = {
  K: 'If you could ask the Creator of the Universe one scientific question, what would it be?',
  Q: 'How do you personally balance the "seen" physical world with the "unseen" spiritual one?',
  J: 'In your research, have you ever found a pattern that felt "too perfect" to be an accident?',
  '10': 'If you had unlimited funding to help "the least of these" back home using your major, where would you start?',
  '9': 'What is the toughest ethical choice a scientist in your field has to make?',
  '8': 'Do you find that people at your university treat "Science" like it\'s a religion?',
  '7': 'How could your specific expertise be used as a "platform" for doing good globally?',
  '6': 'If the universe was designed by an Artist, what does your field reveal about the Artist\'s personality?',
  '5': 'Have you ever felt a sense of "awe" or "worship" while looking at a complex equation or microscope?',
  '4': 'What is the biggest scientific or technical challenge your home country is currently facing?',
  '3': 'Do you think science and faith are two different languages, or are they telling the same story?',
  '2': 'What is the most "beautiful" or "elegant" thing you\'ve learned about the universe lately?',
};

const ACTION_CARDS: Record<Suit, { type: typeof ActionCardType[keyof typeof ActionCardType]; description: string }> = {
  spades: {
    type: ActionCardType.REFERRAL,
    description: 'The Referral: Nominate another player to answer a question of your choice from your hand.',
  },
  hearts: {
    type: ActionCardType.SHARED_TABLE,
    description: 'The Shared Table: Everyone at the table must answer the last question asked.',
  },
  diamonds: {
    type: ActionCardType.TRANSLATOR,
    description: 'The Translator: Choose a player to explain their answer using a metaphor or a word/phrase from their native language.',
  },
  clubs: {
    type: ActionCardType.EXPERIMENT,
    description: 'The Experiment: You may "veto" a question and draw a new card, or "challenge" another player to answer your card instead.',
  },
};

function getPrompt(suit: Suit, rank: Rank): string {
  const prompts: Record<Suit, Record<Exclude<Rank, 'A'>, string>> = {
    spades: SPADES_PROMPTS,
    hearts: HEARTS_PROMPTS,
    diamonds: DIAMONDS_PROMPTS,
    clubs: CLUBS_PROMPTS,
  };

  if (rank === 'A') return '';
  return prompts[suit][rank as Exclude<Rank, 'A'>];
}

export function createDeck(): Card[] {
  const suits: Suit[] = ['spades', 'hearts', 'diamonds', 'clubs'];
  const ranks: Rank[] = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
  const deck: Card[] = [];

  for (const suit of suits) {
    for (const rank of ranks) {
      const isAce = rank === 'A';
      const actionInfo = isAce ? ACTION_CARDS[suit] : null;

      deck.push({
        id: `${suit}-${rank}`,
        suit,
        rank,
        prompt: getPrompt(suit, rank),
        isActionCard: isAce,
        actionType: actionInfo?.type,
        actionDescription: actionInfo?.description,
      });
    }
  }

  return deck;
}

// Fisher-Yates shuffle using crypto-grade randomness
export function shuffleDeck(deck: Card[]): Card[] {
  const shuffled = [...deck];
  const n = shuffled.length;

  for (let i = n - 1; i > 0; i--) {
    // Generate cryptographically secure random index
    const randomByte = randomBytes(1)[0];
    const j = Math.floor((randomByte / 256) * (i + 1));

    // Swap
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return shuffled;
}

export function dealCards(
  deck: Card[],
  playerCount: number,
  cardsPerPlayer: number
): { hands: Card[][]; remaining: Card[] } {
  const totalNeeded = playerCount * cardsPerPlayer;

  if (deck.length < totalNeeded) {
    throw new Error('Not enough cards in deck');
  }

  const hands: Card[][] = Array(playerCount)
    .fill(null)
    .map(() => []);

  // Deal cards round-robin style
  for (let cardIndex = 0; cardIndex < totalNeeded; cardIndex++) {
    const playerIndex = cardIndex % playerCount;
    hands[playerIndex].push(deck[cardIndex]);
  }

  const remaining = deck.slice(totalNeeded);

  return { hands, remaining };
}

export function drawCard(pile: Card[]): { card: Card | null; remaining: Card[] } {
  if (pile.length === 0) {
    return { card: null, remaining: [] };
  }

  const [card, ...remaining] = pile;
  return { card, remaining };
}
