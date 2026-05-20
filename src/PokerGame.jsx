import React, { useState, useEffect } from 'react';
import { createDeck, getHandRank } from './utils';

const PokerGame = () => {
  const [balance, setBalance] = useState(1000);
  const [gameState, setGameState] = useState('betting');
  const [playerHand, setPlayerHand] = useState([]);
  const [communityCards, setCommunityCards] = useState([]);
  const [message, setMessage] = useState('Oyuna başlamaq üçün düyməyə basın!');

  const startNewGame = () => {
    const deck = createDeck();
    setPlayerHand([deck[0], deck[1]]);
    setCommunityCards([]);
    setGameState('playing');
    setMessage('Oyun başladı!');
  };

  return (
    <div style={{ textAlign: 'center', padding: '20px', fontFamily: 'Arial' }}>
      <h1>TON Poker</h1>
      <p>Balans: {balance}$</p>
      <div style={{ margin: '20px' }}>
        <h3>Sizin Kartlar:</h3>
        {playerHand.map((c, i) => <span key={i} style={{fontSize: '30px', margin: '5px'}}>{c.value}{c.suit}</span>)}
      </div>
      
      <button onClick={startNewGame} style={{ padding: '10px 20px', cursor: 'pointer' }}>
        Yeni Oyun
      </button>
      
      <p style={{ marginTop: '20px', fontWeight: 'bold' }}>{message}</p>
    </div>
  );
};

export default PokerGame;
