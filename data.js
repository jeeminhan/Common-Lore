const SUITS = [
  {
    id: 'spades', symbol: '♠', name: 'Spades',
    subtitle: 'The Career Bridge', theme: 'Professional & Vision',
    color: '#1B2A6B', accent: '#E8EBFF',
    action: { rank: 'A', name: 'The Referral', description: 'Nominate another player to answer a question of your choice from your hand.' },
    cards: [
      { rank: 'K', question: 'If you could give a speech to the leaders of your industry today, what truth would you want them to hear?' },
      { rank: 'Q', question: 'How could your future career be used to serve or "bless" your community back home one day?' },
      { rank: 'J', question: 'What does "success" look like to your parents, and how does that compare to your own definition?' },
      { rank: '10', question: 'When you return home, what is the first "big problem" you hope your new expertise will help solve?' },
      { rank: '9', question: 'Is there someone you are hoping to connect with professionally right now? How can we help?' },
      { rank: '8', question: 'Who is a leader from your home country that you would want to introduce to your American friends?' },
      { rank: '7', question: 'If visas and paperwork weren\'t an issue, what would be your "dream first step" after graduation?' },
      { rank: '6', question: 'What is a strength you\'ve discovered in yourself only after moving to a different country?' },
      { rank: '5', question: 'How do your personal values or faith change the kind of company you\'d be willing to work for?' },
      { rank: '4', question: 'What is the most surprising difference between an interview back home vs. an interview here?' },
      { rank: '3', question: 'What\'s the hardest part about translating your life story into a one-page U.S. resume?' },
      { rank: '2', question: 'What was your very first "dream job" when you were a child?' }
    ]
  },
  {
    id: 'hearts', symbol: '♥', name: 'Hearts',
    subtitle: 'The Hospitality Bridge', theme: 'Oikos & Belonging',
    color: '#8B1A1A', accent: '#FFE8E8',
    action: { rank: 'A', name: 'The Shared Table', description: 'Everyone at the table answers the last question asked.' },
    cards: [
      { rank: 'K', question: 'What is a tradition from your family that you hope to pass on to your own children one day?' },
      { rank: 'Q', question: 'If you could "teleport" one person from home to sit at this table for an hour, who would it be?' },
      { rank: 'J', question: 'What makes a place feel like "home" to you — is it the people, the smells, or a feeling?' },
      { rank: '10', question: 'In what specific way do you want to be a blessing to your "household" (oikos) right now?' },
      { rank: '9', question: 'What is the most "un-homelike" thing about living in an American dorm or apartment?' },
      { rank: '8', question: 'How can friends here best support you when you are feeling the "weight" of being away?' },
      { rank: '7', question: 'What is a childhood story or "fable" your parents told you that you\'ll never forget?' },
      { rank: '6', question: 'How do people in your country usually welcome a stranger into their home?' },
      { rank: '5', question: 'If I were to pray for your family today, what is the "big hope" or "big worry" on their hearts?' },
      { rank: '4', question: 'Who in your family was your biggest champion in getting you here? What did they sacrifice?' },
      { rank: '3', question: 'What is a "ritual" from home (like making tea or a morning routine) that you keep alive here?' },
      { rank: '2', question: 'What is the first thing you want to eat the moment you land in your home country?' }
    ]
  },
  {
    id: 'diamonds', symbol: '♦', name: 'Diamonds',
    subtitle: 'The Cultural Bridge', theme: 'Identity & Wisdom',
    color: '#C17900', accent: '#FFF8E1',
    action: { rank: 'A', name: 'The Translator', description: 'Choose a player to explain their answer using a metaphor or a word from their native language.' },
    cards: [
      { rank: 'K', question: 'What does "Honor" mean to you, and how do you show it to others in a culture that feels very "informal"?' },
      { rank: 'Q', question: 'How does your community back home celebrate the biggest milestones of life?' },
      { rank: 'J', question: 'How do you decide which parts of American culture to "adopt" and which to "reject"?' },
      { rank: '10', question: 'What do people here often get wrong about your culture that you\'d love to correct?' },
      { rank: '9', question: 'How does your family\'s faith or worldview shape the way you handle conflict?' },
      { rank: '8', question: 'What\'s a historical event from your nation that you wish every American knew about?' },
      { rank: '7', question: 'In your culture, who is considered a "hero," and what does that tell us about what your people value?' },
      { rank: '6', question: 'What is the "Good Life"? What kind of music or songs make you think of it?' },
      { rank: '5', question: 'How has being in the U.S. changed the way you look at your own home country?' },
      { rank: '4', question: 'If you could give every American one "memory" from your childhood to help them understand your culture, what would it be?' },
      { rank: '3', question: 'What is a piece of "grandmotherly wisdom" or a proverb you think about when life gets hard?' },
      { rank: '2', question: 'What is one thing Americans do that they think is polite, but feels "off" to you?' }
    ]
  },
  {
    id: 'clubs', symbol: '♣', name: 'Clubs',
    subtitle: 'The Scientific Bridge', theme: 'Creation & Wonder',
    color: '#1B5E20', accent: '#E8F5E9',
    action: { rank: 'A', name: 'The Experiment', description: 'You may "veto" a question and draw a new card, or "challenge" another player to answer your card instead.' },
    cards: [
      { rank: 'K', question: 'If you could ask the Creator of the Universe one scientific question, what would it be?' },
      { rank: 'Q', question: 'How do you personally balance the "seen" physical world with the "unseen" spiritual one?' },
      { rank: 'J', question: 'In your research, have you ever found a pattern that felt "too perfect" to be an accident?' },
      { rank: '10', question: 'If you had unlimited funding to help "the least of these" back home using your major, where would you start?' },
      { rank: '9', question: 'What is the toughest ethical choice a scientist in your field has to make?' },
      { rank: '8', question: 'Do you find that people at your university treat "Science" like it\'s a religion?' },
      { rank: '7', question: 'How could your specific expertise be used as a "platform" for doing good globally?' },
      { rank: '6', question: 'If the universe was designed by an Artist, what does your field of study reveal about the Artist\'s personality?' },
      { rank: '5', question: 'Have you ever felt a sense of "awe" or "worship" while looking at a complex equation or microscope?' },
      { rank: '4', question: 'What is the biggest scientific or technical challenge your home country is currently facing?' },
      { rank: '3', question: 'Do you think science and faith are two different languages, or are they telling the same story?' },
      { rank: '2', question: 'What is the most "beautiful" or "elegant" thing you\'ve learned about the universe lately?' }
    ]
  }
];
