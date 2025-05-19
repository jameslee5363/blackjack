import { useEffect, useState } from 'react';
import './App.css';

const suitToUnicode = { H: '♥', D: '♦', C: '♣', S: '♠' };

function Card({ code }) {
  const rank = code.slice(0, -1);
  const suit = suitToUnicode[code.slice(-1)];
  return (
    <div className="card">
      <div className="card-rank">{rank}</div>
      <div className="card-suit">{suit}</div>
    </div>
  );
}

export default function App() {
  const [game, setGame] = useState(null);
  const [balance, setBalance] = useState(null);

  const api = async (route, method = 'GET') => {
    const res = await fetch(route, {
      method,
      credentials: 'include'
    });
  
    if (res.status === 403) {
      const data = await res.json();
      alert(data.error);  // Or display error on the page instead of alert
      return;
    }
  
    const data = await res.json();
    setGame(data);
  
    fetch('/api/v1/me', { credentials: 'include' })
      .then(res => res.json())
      .then(data => {
        if (data.balance !== undefined) {
          setBalance(data.balance);
        }
      });
  };

  useEffect(() => {
    api('/api/v1/game');
    
    fetch('/api/v1/me', {
      credentials: 'include'
    })
      .then(res => res.json())
      .then(data => {
        if (data.balance !== undefined) {
          setBalance(data.balance);
        }
      })
      .catch(err => console.error('Failed to fetch user info:', err));
  }, []);

  if (!game) return <p>Loading...</p>;

  const { player, dealer, pVal, dVal, message, status } = game;
  const dealerFaceDown = status === 'PLAYER_TURN';
  const shownDealer = dealerFaceDown ? dealer.slice(0, 1) : dealer;

  return (
    <div className="table">
      <h1 className="title">Blackjack</h1>
      {balance !== null && <h2>Balance: ${balance}</h2>}

      <div className="hand">
        <h2>Dealer {dealerFaceDown ? '' : `(${dVal})`}</h2>
        <div className="cards">
          {shownDealer.map((c, i) => (
            <Card key={i} code={c} />
          ))}
          {dealerFaceDown && <div className="card card-back" />}
        </div>
      </div>

      <div className="hand">
        <h2>You ({pVal})</h2>
        <div className="cards">
          {player.map((c, i) => (
            <Card key={i} code={c} />
          ))}
        </div>
      </div>

      <div className="controls">
        <button onClick={() => api('/api/v1/hit', 'POST')} disabled={status !== 'PLAYER_TURN'}>
          Hit
        </button>
        <button onClick={() => api('/api/v1/stand', 'POST')} disabled={status !== 'PLAYER_TURN'}>
          Stand
        </button>
        {status === 'FINISHED' && (
          <button onClick={() => api('/api/v1/game')}>Deal Again</button>
        )}
      </div>

      <div className="controls">
        <button onClick={() => window.location.href = '/'}>
          Home
        </button>
      </div>

      <p className="message">{message}</p>
    </div>
  );
}
