import { useState } from 'react';
import { useGame } from './context/GameContext';
import { GameBoard } from './components/GameBoard';
import './App.css';

function App() {
  const { user, loading, gameId, gamePhase, createGame, joinGame, message, setMessage, updatePlayerName } = useGame();
  const [joinGameId, setJoinGameId] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [localName, setLocalName] = useState('');

  const handleCreateGame = async () => {
    const newGameId = await createGame();
    if (localName) await updatePlayerName(localName);
    setShowCreateModal(false);
    setLocalName('');
  };

  const handleJoinGame = async () => {
    if (!joinGameId.trim()) { setMessage('⚠️ Please enter a game code!'); return; }
    const success = await joinGame(joinGameId.toUpperCase());
    if (success) {
      if (localName) await updatePlayerName(localName);
      setShowJoinModal(false);
      setJoinGameId('');
      setLocalName('');
    }
  };

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-content">
          <div className="loading-logo">⚔️</div>
          <h1>MLBB MONOPOLY</h1>
          <div className="loading-spinner"></div>
          <p>Loading Battle Arena...</p>
        </div>
      </div>
    );
  }

  if (gameId && gamePhase !== 'lobby') return <GameBoard />;

  return (
    <div className="app">
      <div className="background-effects">
        <div className="bg-gradient"></div>
        <div className="particles">
          {[...Array(20)].map((_, i) => (
            <div key={i} className="particle" style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%`, animationDelay: `${Math.random() * 5}s`, animationDuration: `${5 + Math.random() * 5}s` }}></div>
          ))}
        </div>
      </div>
      <div className="hero-section">
        <div className="hero-badge">BATTLE ARENA EDITION</div>
        <h1 className="game-title">
          <span className="title-icon">⚔️</span>
          MLBB MONOPOLY
          <span className="title-icon">⚔️</span>
        </h1>
        <p className="game-subtitle">Dominate the Land of Dawn!</p>
        <div className="hero-cards">
          <div className="hero-card create-card" onClick={() => setShowCreateModal(true)}>
            <div className="card-icon">🚀</div>
            <h3>CREATE BATTLE</h3>
            <p>Start a new game and summon friends</p>
          </div>
          <div className="hero-card join-card" onClick={() => setShowJoinModal(true)}>
            <div className="card-icon">🎮</div>
            <h3>JOIN BATTLE</h3>
            <p>Enter battle code to enter arena</p>
          </div>
        </div>
        <div className="features">
          <div className="feature"><span className="feature-icon">🌐</span><span>Real-time Multiplayer</span></div>
          <div className="feature"><span className="feature-icon">⚔️</span><span>MLBB Heroes Theme</span></div>
          <div className="feature"><span className="feature-icon">🏆</span><span>Epic Battles</span></div>
          <div className="feature"><span className="feature-icon">💎</span><span>Gold Economy</span></div>
        </div>
      </div>
      {showCreateModal && (
        <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-icon">🚀</div>
            <h2>CREATE BATTLE</h2>
            <div className="form-group">
              <label>Your Hero Name</label>
              <input type="text" value={localName} onChange={e => setLocalName(e.target.value)} placeholder="Enter your hero name" maxLength={20} />
            </div>
            <div className="modal-actions">
              <button className="btn-secondary" onClick={() => setShowCreateModal(false)}>CANCEL</button>
              <button className="btn-primary" onClick={handleCreateGame}>START BATTLE</button>
            </div>
          </div>
        </div>
      )}
      {showJoinModal && (
        <div className="modal-overlay" onClick={() => setShowJoinModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-icon">🎮</div>
            <h2>JOIN BATTLE</h2>
            <div className="form-group">
              <label>Your Hero Name</label>
              <input type="text" value={localName} onChange={e => setLocalName(e.target.value)} placeholder="Enter your hero name" maxLength={20} />
            </div>
            <div className="form-group">
              <label>Battle Code</label>
              <input type="text" value={joinGameId} onChange={e => setJoinGameId(e.target.value.toUpperCase())} placeholder="Enter battle code" maxLength={8} />
            </div>
            <div className="modal-actions">
              <button className="btn-secondary" onClick={() => setShowJoinModal(false)}>CANCEL</button>
              <button className="btn-primary" onClick={handleJoinGame}>ENTER ARENA</button>
            </div>
          </div>
        </div>
      )}
      {message && <div className="message-toast" onClick={() => setMessage('')}>{message}</div>}
    </div>
  );
}

export default App;
