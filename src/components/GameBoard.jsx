import { useGame } from '../context/GameContext';
import { BOARD_SPACES, PROPERTY_GROUPS } from '../data/gameData';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import './GameBoard.css';

export const GameBoard = () => {
  const { gameId, gameState, players, currentPlayer, isHost, gamePhase, diceValues, isRolling, diceAnimation, canBuyProperty, currentProperty, showCard, message, jailOptions, user, rollDice, buyProperty, dontBuyProperty, payJailFine, leaveGame, startGame, setMessage, isMyTurn, doublesCount, toggleReady } = useGame();
  const [showLobby, setShowLobby] = useState(true);
  const [selectedProperty, setSelectedProperty] = useState(null);

  useEffect(() => { if (gamePhase === 'playing') setShowLobby(false); }, [gamePhase]);

  const currentPlayerData = players.find(p => p.id === currentPlayer);
  const myPlayer = players.find(p => p.id === user?.uid);
  const isMyTurnActive = currentPlayer === user?.uid;

  const handlePropertyClick = (space) => {
    if (space.type === 'property' || space.type === 'railroad' || space.type === 'utility') {
      setSelectedProperty(space);
    }
  };

  const getPlayersOnSpace = (spaceId) => players.filter(p => p.position === spaceId);
  const allPlayersReady = players.length >= 2 && players.every(p => p.ready);

  return (
    <div className="game-board-container">
      <div className="game-header">
        <div className="game-info">
          <span className="game-code">⚔️ BATTLE: {gameId}</span>
          <span className="turn-indicator">{isMyTurnActive ? "🎯 YOUR TURN!" : `Turn: ${currentPlayerData?.name || 'Player'}`}</span>
          {doublesCount > 0 && <span className="doubles-indicator">🎲 {doublesCount}x DBL</span>}
        </div>
        <div className="header-actions">
          <div className="my-stats">
            <span className="gold-amount">💰 {myPlayer?.money || 0}</span>
            <span className="property-count">🏠 {myPlayer?.properties?.length || 0}</span>
          </div>
          <button className="leave-btn" onClick={leaveGame}>LEAVE</button>
        </div>
      </div>

      <AnimatePresence>
        {(showLobby || gamePhase === 'lobby' || gamePhase === 'waiting') && (
          <motion.div className="lobby-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="lobby-content">
              <div className="lobby-icon">⚔️</div>
              <h2>⚔️ BATTLE ARENA ⚔️</h2>
              <p className="lobby-code">Battle Code: <strong>{gameId}</strong></p>
              <div className="players-list">
                <h3>HEROES ({players.length}/8)</h3>
                {players.map((player) => (
                  <div key={player.id} className={`player-item ${player.id === user?.uid ? 'me' : ''}`}>
                    <div className="player-token" style={{ backgroundColor: player.color }}>{player.token}</div>
                    <span className="player-name">{player.name}</span>
                    <span className="player-gold">💰 {player.money}</span>
                    {player.isHost && <span className="host-badge">🏆 CAPTAIN</span>}
                    {player.ready && <span className="ready-badge">✓ READY</span>}
                    {!player.ready && player.id !== user?.uid && <span className="waiting-badge">⏳</span>}
                  </div>
                ))}
              </div>
              <div className="lobby-actions">
                {isHost ? (
                  <>
                    <button className="ready-btn" onClick={toggleReady}>{myPlayer?.ready ? 'CANCEL READY' : 'READY'}</button>
                    {allPlayersReady && <button className="start-btn" onClick={startGame}>⚔️ START BATTLE ⚔️</button>}
                    {players.length < 2 && <p className="waiting-text">Need at least 2 heroes!</p>}
                    {players.length >= 2 && !allPlayersReady && <p className="waiting-text">All heroes must be ready!</p>}
                  </>
                ) : (
                  <button className="ready-btn" onClick={toggleReady}>{myPlayer?.ready ? 'CANCEL READY' : 'READY'}</button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="monopoly-board">
        <div className="board-row top-row">
          {BOARD_SPACES.slice(0, 11).map((space) => (
            <div key={space.id} className={`board-cell ${space.type}`}>
              <div className="cell-content" onClick={() => handlePropertyClick(space)} style={{ background: space.color ? `linear-gradient(135deg, ${space.color}88, ${space.color})` : undefined }}>
                <span className="cell-icon">{space.icon}</span>
                <span className="cell-name">{space.name}</span>
                {space.price && <span className="cell-price">💰{space.price}</span>}
              </div>
              <div className="players-on-cell">{getPlayersOnSpace(space.id).map(p => <div key={p.id} className="player-token-mini" style={{ backgroundColor: p.color }}>{p.token}</div>)}</div>
            </div>
          ))}
        </div>

        <div className="board-middle">
          <div className="board-column left-column">
            {BOARD_SPACES.slice(20, 31).reverse().map((space) => (
              <div key={space.id} className={`board-cell side-cell ${space.type}`}>
                <div className="cell-content" onClick={() => handlePropertyClick(space)} style={{ background: space.color ? `linear-gradient(135deg, ${space.color}88, ${space.color})` : undefined }}>
                  <span className="cell-icon">{space.icon}</span>
                  <span className="cell-name">{space.name}</span>
                  {space.price && <span className="cell-price">💰{space.price}</span>}
                </div>
                <div className="players-on-cell">{getPlayersOnSpace(space.id).map(p => <div key={p.id} className="player-token-mini" style={{ backgroundColor: p.color }}>{p.token}</div>)}</div>
              </div>
            ))}
          </div>

          <div className="board-center">
            <div className="center-content">
              <h1 className="center-title">⚔️</h1>
              <h2 className="center-subtitle">MLBB</h2>
              <p className="center-subtitle-2">MONOPOLY</p>
              <div className="dice-area">
                <div className={`dice dice-${diceValues[0]} ${diceAnimation ? 'rolling' : ''}`}>{getDiceDots(diceValues[0])}</div>
                <div className={`dice dice-${diceValues[1]} ${diceAnimation ? 'rolling' : ''}`}>{getDiceDots(diceValues[1])}</div>
              </div>
              <button className={`roll-btn ${isMyTurnActive && !isRolling ? 'active' : ''}`} onClick={rollDice} disabled={!isMyTurnActive || isRolling}>
                {isRolling ? '🎲 ROLLING...' : '🎲 ROLL DICE'}
              </button>
              {isMyTurnActive && <p className="roll-hint">Click to roll!</p>}
            </div>
          </div>

          <div className="board-column right-column">
            {BOARD_SPACES.slice(11, 20).map((space) => (
              <div key={space.id} className={`board-cell side-cell ${space.type}`}>
                <div className="cell-content" onClick={() => handlePropertyClick(space)} style={{ background: space.color ? `linear-gradient(135deg, ${space.color}88, ${space.color})` : undefined }}>
                  <span className="cell-icon">{space.icon}</span>
                  <span className="cell-name">{space.name}</span>
                  {space.price && <span className="cell-price">💰{space.price}</span>}
                </div>
                <div className="players-on-cell">{getPlayersOnSpace(space.id).map(p => <div key={p.id} className="player-token-mini" style={{ backgroundColor: p.color }}>{p.token}</div>)}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="board-row bottom-row">
          {BOARD_SPACES.slice(31, 40).reverse().map((space) => (
            <div key={space.id} className={`board-cell ${space.type}`}>
              <div className="cell-content" onClick={() => handlePropertyClick(space)} style={{ background: space.color ? `linear-gradient(135deg, ${space.color}88, ${space.color})` : undefined }}>
                <span className="cell-icon">{space.icon}</span>
                <span className="cell-name">{space.name}</span>
                {space.price && <span className="cell-price">💰{space.price}</span>}
              </div>
              <div className="players-on-cell">{getPlayersOnSpace(space.id).map(p => <div key={p.id} className="player-token-mini" style={{ backgroundColor: p.color }}>{p.token}</div>)}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="players-panel">
        <h3>🏆 HERO RANKINGS</h3>
        {players.sort((a, b) => b.money - a.money).map((player, index) => (
          <div key={player.id} className={`rank-item ${player.id === currentPlayer ? 'current-turn' : ''}`}>
            <span className="rank-number">#{index + 1}</span>
            <div className="rank-token" style={{ backgroundColor: player.color }}>{player.token}</div>
            <div className="rank-info">
              <span className="rank-name">{player.name}</span>
              <span className="rank-gold">💰 {player.money}</span>
            </div>
            {player.inJail && <span className="jail-badge">⛓️</span>}
          </div>
        ))}
      </div>

      <AnimatePresence>
        {canBuyProperty && currentProperty && (
          <motion.div className="modal-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className="property-modal" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.8, opacity: 0 }}>
              <div className="property-header" style={{ backgroundColor: currentProperty.color || '#3498db' }}>
                <span className="property-icon">{currentProperty.icon}</span>
                <h2>{currentProperty.name}</h2>
              </div>
              <div className="property-body">
                <p className="property-desc">{currentProperty.description}</p>
                <div className="property-price"><span className="price-label">PRICE:</span><span className="price-value">💰 {currentProperty.price}</span></div>
                <div className="property-rent"><span className="rent-label">RENT:</span><span className="rent-value">💰 {currentProperty.rent}</span></div>
                {currentProperty.group && <p className="property-hint">Doubles rent if you own all {PROPERTY_GROUPS[currentProperty.group]?.name} heroes!</p>}
              </div>
              <div className="property-actions">
                <button className="btn-decline" onClick={dontBuyProperty}>PASS</button>
                <button className="btn-buy" onClick={buyProperty}>BUY 💰</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {jailOptions && isMyTurnActive && (
          <motion.div className="modal-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className="jail-modal" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.8, opacity: 0 }}>
              <div className="jail-icon">⛓️</div>
              <h2>IN JAIL!</h2>
              <p>Pay the fine or roll doubles to escape.</p>
              <div className="jail-options">
                <button className="btn-pay-fine" onClick={payJailFine}>💰 PAY 50 GOLD</button>
                <button className="btn-roll-doubles" onClick={rollDice} disabled={isRolling}>🎲 ROLL DOUBLES</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showCard && (
          <motion.div className="modal-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => {}}>
            <motion.div className={`card-modal ${showCard.type}`} initial={{ rotateY: 90, opacity: 0 }} animate={{ rotateY: 0, opacity: 1 }} exit={{ rotateY: -90, opacity: 0 }} transition={{ duration: 0.5 }}>
              <div className="card-type">{showCard.type === 'chance' ? '⚡ CHANCE' : '📦 ARENA EVENT'}</div>
              <p className="card-text">{showCard.text}</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {message && (
          <motion.div className="message-toast" initial={{ y: 100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 100, opacity: 0 }} onClick={() => setMessage('')}>
            {message}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

function getDiceDots(value) {
  const dotPatterns = { 1: [[50, 50]], 2: [[25, 25], [75, 75]], 3: [[25, 25], [50, 50], [75, 75]], 4: [[25, 25], [75, 25], [25, 75], [75, 75]], 5: [[25, 25], [75, 25], [50, 50], [25, 75], [75, 75]], 6: [[25, 25], [75, 25], [25, 50], [75, 50], [25, 75], [75, 75]] };
  const dots = dotPatterns[value] || [];
  return dots.map((pos, i) => <div key={i} className="dice-dot" style={{ left: `${pos[0]}%`, top: `${pos[1]}%` }} />);
}
