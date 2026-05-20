import { SUITS, VALUES } from './constants';

export const createDeck = () => {
  const deck = [];
  SUITS.forEach(suit => {
    VALUES.forEach(value => {
      deck.push({ suit, value, id: `${value}${suit}` });
    });
  });
  return deck.sort(() => Math.random() - 0.5);
};

export const getHandRank = (cards) => {
  if (!cards || cards.length < 5) return { rank: 0, name: 'Əli yoxdur' };
  
  const values = cards.map(c => VALUES.indexOf(c.value));
  const suits = cards.map(c => c.suit);
  const valueCounts = {};
  values.forEach(v => valueCounts[v] = (valueCounts[v] || 0) + 1);
  
  const counts = Object.values(valueCounts).sort((a, b) => b - a);
  const isFlush = suits.every(s => s === suits[0]);
  const sortedValues = values.sort((a, b) => a - b);
  const isStraight = sortedValues.every((v, i) => i === 0 || v === sortedValues[i - 1] + 1);
  
  if (isFlush && isStraight && sortedValues[0] === 8) return { rank: 10, name: 'Royal Flush', score: 10000 };
  if (isFlush && isStraight) return { rank: 9, name: 'Straight Flush', score: 9000 + sortedValues[4] };
  if (counts[0] === 4) return { rank: 8, name: 'Dördlük', score: 8000 + sortedValues[4] };
  if (counts[0] === 3 && counts[1] === 2) return { rank: 7, name: 'Full House', score: 7000 + sortedValues[4] };
  if (isFlush) return { rank: 6, name: 'Flush', score: 6000 + sortedValues[4] };
  if (isStraight) return { rank: 5, name: 'Straight', score: 5000 + sortedValues[4] };
  if (counts[0] === 3) return { rank: 4, name: 'Üçlük', score: 4000 + sortedValues[4] };
  if (counts[0] === 2 && counts[1] === 2) return { rank: 3, name: 'İki Cüt', score: 3000 + sortedValues[4] };
  if (counts[0] === 2) return { rank: 2, name: 'Cüt', score: 2000 + sortedValues[4] };
  return { rank: 1, name: 'Yüksək Kart', score: 1000 + sortedValues[4] };
};
