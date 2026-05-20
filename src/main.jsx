import React from 'react';
import ReactDOM from 'react-dom/client';
import PokerGame from './PokerGame';
import './index.css'; // Əgər CSS faylınız varsa, yoxdursa bu sətri silə bilərsiniz

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <PokerGame />
  </React.StrictMode>
);

