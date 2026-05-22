import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { database } from '../firebase/config';
import { ref, set, onValue, update, remove, get } from 'firebase/database';
import { auth } from '../firebase/config';
import { signInAnonymously, onAuthStateChanged } from 'firebase/auth';
import { v4 as uuidv4 } from 'uuid';
import { BOARD_SPACES, GAME_CONFIG, CHANCE_CARDS, COMMUNITY_CHEST_CARDS, PLAYER_COLORS, PLAYER_TOKENS, shuffleArray, getPropertyById, calculateRent } from '../data/gameData';

const GameContext = createContext(null);

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) throw new Error('useGame must be used within GameProvider');
  return context;
};

export const GameProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [gameId, setGameId] = useState(null);
  const [gameState, setGameState] = useState(null);
  const [players, setPlayers] = useState([]);
  const [currentPlayer, setCurrentPlayer] = useState(null);
  const [isHost, setIsHost] = useState(false);
  const [gamePhase, setGamePhase] = useState('lobby');
  const [diceValues, setDiceValues] = useState([1, 1]);
  const [isRolling, setIsRolling] = useState(false);
  const [diceAnimation, setDiceAnimation] = useState(false);
  const [canBuyProperty, setCanBuyProperty] = useState(false);
  const [currentProperty, setCurrentProperty] = useState(null);
  const [showCard, setShowCard] = useState(null);
  const [message, setMessage] = useState('');
  const [jailOptions, setJailOptions] = useState(false);
  const [isMyTurn, setIsMyTurn] = useState(false);
  const [doublesCount, setDoublesCount] = useState(0);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) setUser(currentUser);
      else {
        try {
          const result = await signInAnonymously(auth);
          setUser(result.user);
        } catch (error) { console.error('Auth error:', error); }
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!gameId) return;
    const gameRef = ref(database, `games/${gameId}`);
    const unsubscribe = onValue(gameRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setGameState(data);
        setPlayers(data.players ? Object.values(data.players) : []);
        setCurrentPlayer(data.currentPlayer);
        setGamePhase(data.phase || 'lobby');
        const myPlayer = data.players?.[user?.uid];
        setIsMyTurn(data.currentPlayer === user?.uid && data.phase === 'playing');
        if (data.currentPlayer === user?.uid && myPlayer?.inJail) setJailOptions(true);
        else setJailOptions(false);
        if (data.currentPlayer === user?.uid && data.phase === 'playing' && !myPlayer?.inJail) {
          const currentPos = data.players?.[user?.uid]?.position;
          if (currentPos !== undefined) {
            const space = getPropertyById(currentPos);
            if (space?.type === 'property' && !data.properties?.[currentPos]?.owner && (myPlayer?.money || 0) >= space.price) {
              setCanBuyProperty(true);
              setCurrentProperty(space);
            } else {
              setCanBuyProperty(false);
              setCurrentProperty(null);
            }
          }
        } else {
          setCanBuyProperty(false);
          setCurrentProperty(null);
        }
        setDoublesCount(data.doublesCount || 0);
      }
    });
    return () => unsubscribe();
  }, [gameId, user?.uid]);

  const createGame = useCallback(async () => {
    if (!user) return;
    const newGameId = uuidv4().slice(0, 8).toUpperCase();
    const gameRef = ref(database, `games/${newGameId}`);
    const player = {
      id: user.uid, name: 'Hero ' + PLAYER_TOKENS[0], token: PLAYER_TOKENS[0], color: PLAYER_COLORS[0],
      money: GAME_CONFIG.STARTING_MONEY, position: 0, inJail: false, jailTurns: 0, properties: [], isHost: true, ready: false,
    };
    await set(gameRef, {
      id: newGameId, phase: 'lobby', currentPlayer: user.uid, turnNumber: 0,
      players: { [user.uid]: player }, properties: {},
      chanceDeck: shuffleArray([...CHANCE_CARDS]), communityDeck: shuffleArray([...COMMUNITY_CHEST_CARDS]),
      chanceIndex: 0, communityIndex: 0, doublesCount: 0, createdAt: Date.now(),
    });
    setGameId(newGameId);
    setIsHost(true);
    setGamePhase('lobby');
    return newGameId;
  }, [user]);

  const joinGame = useCallback(async (joinGameId) => {
    if (!user) return;
    const gameRef = ref(database, `games/${joinGameId}`);
    const snapshot = await get(gameRef);
    if (!snapshot.exists()) { setMessage('⚠️ Game not found!'); return false; }
    const data = snapshot.val();
    if (data.phase !== 'lobby') { setMessage('⚠️ Game already in progress!'); return false; }
    const playerCount = Object.keys(data.players || {}).length;
    if (playerCount >= GAME_CONFIG.MAX_PLAYERS) { setMessage('⚠️ Game is full!'); return false; }
    const player = {
      id: user.uid, name: 'Hero ' + PLAYER_TOKENS[playerCount], token: PLAYER_TOKENS[playerCount], color: PLAYER_COLORS[playerCount],
      money: GAME_CONFIG.STARTING_MONEY, position: 0, inJail: false, jailTurns: 0, properties: [], isHost: false, ready: false,
    };
    await update(ref(database, `games/${joinGameId}/players/${user.uid}`), player);
    setGameId(joinGameId);
    setIsHost(false);
    setGamePhase('waiting');
    return true;
  }, [user]);

  const startGame = useCallback(async () => {
    if (!gameId || !isHost) return;
    await update(ref(database, `games/${gameId}`), { phase: 'playing', turnNumber: 1, currentPlayer: Object.keys(gameState?.players || {})[0] });
  }, [gameId, isHost, gameState]);

  const toggleReady = useCallback(async () => {
    if (!gameId || !user) return;
    const playerRef = ref(database, `games/${gameId}/players/${user.uid}/ready`);
    const currentReady = gameState?.players?.[user.uid]?.ready || false;
    await set(playerRef, !currentReady);
  }, [gameId, user, gameState]);

  const leaveGame = useCallback(async () => {
    if (!gameId || !user) return;
    if (isHost) await remove(ref(database, `games/${gameId}`));
    else await remove(ref(database, `games/${gameId}/players/${user.uid}`));
    setGameId(null); setGameState(null); setPlayers([]); setIsHost(false); setGamePhase('lobby');
  }, [gameId, user, isHost]);

  const endTurn = async (wasDoubles) => {
    if (!gameId || !gameState) return;
    if (wasDoubles) return;
    const playerIds = Object.keys(gameState.players || {});
    const currentIndex = playerIds.indexOf(currentPlayer);
    const nextIndex = (currentIndex + 1) % playerIds.length;
    await update(ref(database, `games/${gameId}`), { currentPlayer: playerIds[nextIndex], turnNumber: (gameState.turnNumber || 0) + 1, doublesCount: 0 });
    setMessage('');
  };

  const movePlayer = async (spaces, isDoubles = false) => {
    if (!gameId || !user) return;
    const myPlayer = gameState?.players?.[user.uid];
    const currentPos = myPlayer?.position || 0;
    const newPos = (currentPos + spaces) % BOARD_SPACES.length;
    await update(ref(database, `games/${gameId}/players/${user.uid}`), { position: newPos });
    await new Promise(resolve => setTimeout(resolve, 500));
    const space = getPropertyById(newPos);
    switch (space?.type) {
      case 'tax':
        const taxAmount = space.action?.pay || 100;
        const newMoney = myPlayer.money - taxAmount;
        if (newMoney < 0) { await handleBankruptcy(user.uid, taxAmount); }
        else { await update(ref(database, `games/${gameId}/players/${user.uid}/money`), newMoney); setMessage(`💰 Paid ${taxAmount} Gold in taxes!`); }
        await new Promise(resolve => setTimeout(resolve, 1000));
        await endTurn(isDoubles);
        break;
      case 'chance': await drawCard('chance'); break;
      case 'goToJail':
        await update(ref(database, `games/${gameId}/players/${user.uid}`), { inJail: true, jailTurns: 0, position: 10 });
        setMessage('⛓️ BANNED! Go to jail!');
        await endTurn(isDoubles);
        break;
      case 'property':
      case 'railroad':
        const propertyData = gameState?.properties?.[newPos];
        if (propertyData?.owner && propertyData.owner !== user.uid) {
          const rent = space.type === 'railroad' ? space.rent * 2 : calculateRent(space, gameState);
          const playerNewMoney = myPlayer.money - rent;
          if (playerNewMoney < 0) { await handleBankruptcy(user.uid, rent, propertyData.owner); }
          else {
            await update(ref(database, `games/${gameId}/players/${user.uid}/money`), playerNewMoney);
            const ownerMoney = gameState?.players?.[propertyData.owner]?.money || 0;
            await update(ref(database, `games/${gameId}/players/${propertyData.owner}/money`), ownerMoney + rent);
            setMessage(`💸 Paid ${rent} Gold rent!`);
          }
          await new Promise(resolve => setTimeout(resolve, 1000));
          await endTurn(isDoubles);
        } else { setCanBuyProperty(true); setCurrentProperty(space); }
        break;
      case 'utility':
        const utilData = gameState?.properties?.[newPos];
        if (utilData?.owner && utilData.owner !== user.uid) {
          const totalDice = diceValues[0] + diceValues[1];
          const rent = totalDice * 10;
          const playerNewMoney = myPlayer.money - rent;
          if (playerNewMoney < 0) { await handleBankruptcy(user.uid, rent, utilData.owner); }
          else {
            await update(ref(database, `games/${gameId}/players/${user.uid}/money`), playerNewMoney);
            const ownerMoney = gameState?.players?.[utilData.owner]?.money || 0;
            await update(ref(database, `games/${gameId}/players/${utilData.owner}/money`), ownerMoney + rent);
            setMessage(`⚡ Paid ${rent} Gold utility fee!`);
          }
          await new Promise(resolve => setTimeout(resolve, 1000));
          await endTurn(isDoubles);
        } else { setCanBuyProperty(true); setCurrentProperty(space); }
        break;
      default: await endTurn(isDoubles);
    }
  };

  const drawCard = async (type) => {
    if (!gameId || !gameState) return;
    const deckKey = type === 'chance' ? 'chanceDeck' : 'communityDeck';
    const indexKey = type === 'chance' ? 'chanceIndex' : 'communityIndex';
    const deck = gameState[deckKey] || [];
    let index = gameState[indexKey] || 0;
    const card = deck[index];
    const newIndex = (index + 1) % deck.length;
    await update(ref(database, `games/${gameId}`), { [indexKey]: newIndex });
    setShowCard({ ...card, type });
    await new Promise(resolve => setTimeout(resolve, 2000));
    const myPlayer = gameState?.players?.[user.uid];
    switch (card.action) {
      case 'collect':
        await update(ref(database, `games/${gameId}/players/${user.uid}/money`), (myPlayer?.money || 0) + card.amount);
        setMessage(card.text);
        break;
      case 'pay':
        const newMoneyPay = (myPlayer?.money || 0) - card.amount;
        if (newMoneyPay < 0) { await handleBankruptcy(user.uid, card.amount); }
        else { await update(ref(database, `games/${gameId}/players/${user.uid}/money`), newMoneyPay); setMessage(card.text); }
        break;
      case 'goto':
        await update(ref(database, `games/${gameId}/players/${user.uid}`), { position: card.position });
        if (card.collect) await update(ref(database, `games/${gameId}/players/${user.uid}/money`), (myPlayer?.money || 0) + card.collect + GAME_CONFIG.PASS_GO_BONUS);
        setMessage(card.text);
        await new Promise(resolve => setTimeout(resolve, 1500));
        break;
      case 'back':
        const currentPos = myPlayer?.position || 0;
        await update(ref(database, `games/${gameId}/players/${user.uid}`), { position: Math.max(0, currentPos - card.amount) });
        setMessage(card.text);
        await new Promise(resolve => setTimeout(resolve, 1000));
        await endTurn(false);
        return;
      case 'forward':
        const currentPosFwd = myPlayer?.position || 0;
        await update(ref(database, `games/${gameId}/players/${user.uid}`), { position: (currentPosFwd + card.amount) % BOARD_SPACES.length });
        setMessage(card.text);
        await new Promise(resolve => setTimeout(resolve, 1000));
        await endTurn(false);
        return;
      case 'jail':
        await update(ref(database, `games/${gameId}/players/${user.uid}`), { inJail: true, jailTurns: 0, position: 10 });
        setMessage(card.text);
        await new Promise(resolve => setTimeout(resolve, 1000));
        await endTurn(false);
        return;
    }
    await new Promise(resolve => setTimeout(resolve, 1000));
    await endTurn(false);
  };

  const rollDice = useCallback(async () => {
    if (!gameId || !user || !isMyTurn || isRolling) return;
    const myPlayer = gameState?.players?.[user.uid];
    if (myPlayer?.inJail && jailOptions) { setMessage('⚠️ Pay fine or roll doubles!'); return; }
    setIsRolling(true); setDiceAnimation(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    const die1 = Math.floor(Math.random() * 6) + 1;
    const die2 = Math.floor(Math.random() * 6) + 1;
    setDiceValues([die1, die2]); setDiceAnimation(false); setIsRolling(false);
    const isDoubles = die1 === die2;
    const totalDice = die1 + die2;
    if (myPlayer?.inJail) {
      if (isDoubles) {
        await update(ref(database, `games/${gameId}/players/${user.uid}`), { inJail: false, jailTurns: 0 });
        setMessage('🎉 Doubles! Free!');
        await movePlayer(totalDice);
      } else {
        const newJailTurns = (myPlayer.jailTurns || 0) + 1;
        if (newJailTurns >= GAME_CONFIG.DOUBLE_JAIL_TRIGGER) {
          const newMoney = myPlayer.money - GAME_CONFIG.JAIL_FINE;
          if (newMoney < 0) { setMessage('💸 Not enough gold!'); await handleBankruptcy(user.uid, GAME_CONFIG.JAIL_FINE); }
          else {
            await update(ref(database, `games/${gameId}/players/${user.uid}`), { inJail: false, jailTurns: 0, money: newMoney });
            setMessage('💰 Paid 50 Gold to escape.');
            await movePlayer(totalDice);
          }
        } else {
          await update(ref(database, `games/${gameId}/players/${user.uid}`), { jailTurns: newJailTurns });
          setMessage(`⛓️ Still in jail! ${GAME_CONFIG.DOUBLE_JAIL_TRIGGER - newJailTurns} turns left.`);
          await endTurn(isDoubles);
        }
      }
      return;
    }
    if (isDoubles) {
      const newDoublesCount = (gameState?.doublesCount || 0) + 1;
      if (newDoublesCount >= 3) {
        await update(ref(database, `games/${gameId}/players/${user.uid}`), { inJail: true, jailTurns: 0, position: 10 });
        await update(ref(database, `games/${gameId}`), { doublesCount: 0 });
        setMessage('🎲 Three doubles! Go to jail!');
        await endTurn(false);
        return;
      }
      await update(ref(database, `games/${gameId}`), { doublesCount: newDoublesCount });
      setMessage(`🎲 Doubles! Roll again! (${newDoublesCount}/3)`);
    } else {
      await update(ref(database, `games/${gameId}`), { doublesCount: 0 });
    }
    await movePlayer(totalDice, isDoubles);
  }, [gameId, user, isMyTurn, isRolling, gameState, jailOptions]);

  const buyProperty = useCallback(async () => {
    if (!gameId || !user || !currentProperty) return;
    const myPlayer = gameState?.players?.[user.uid];
    if (myPlayer.money < currentProperty.price) { setMessage('💸 Not enough gold!'); return; }
    await update(ref(database, `games/${gameId}/properties/${currentProperty.id}`), { owner: user.uid, purchasedAt: Date.now() });
    await update(ref(database, `games/${gameId}/players/${user.uid}`), { money: myPlayer.money - currentProperty.price, properties: [...(myPlayer.properties || []), currentProperty.id] });
    setMessage(`🏠 Purchased ${currentProperty.name} for ${currentProperty.price} Gold!`);
    setCanBuyProperty(false); setCurrentProperty(null);
    await new Promise(resolve => setTimeout(resolve, 1500));
    await endTurn(false);
  }, [gameId, user, currentProperty, gameState]);

  const dontBuyProperty = useCallback(async () => {
    setCanBuyProperty(false); setCurrentProperty(null);
    await endTurn(false);
  }, []);

  const payJailFine = useCallback(async () => {
    if (!gameId || !user) return;
    const myPlayer = gameState?.players?.[user.uid];
    if (myPlayer.money < GAME_CONFIG.JAIL_FINE) { setMessage('💸 Not enough gold!'); return; }
    await update(ref(database, `games/${gameId}/players/${user.uid}`), { inJail: false, jailTurns: 0, money: myPlayer.money - GAME_CONFIG.JAIL_FINE });
    setMessage(`💰 Paid ${GAME_CONFIG.JAIL_FINE} Gold to escape.`);
    setJailOptions(false);
    await new Promise(resolve => setTimeout(resolve, 1000));
    await rollDice();
  }, [gameId, user, gameState, rollDice]);

  const handleBankruptcy = async (playerId, amount, creditorId = null) => {
    if (!gameId) return;
    const bankruptPlayer = gameState?.players?.[playerId];
    if (!bankruptPlayer) return;
    if (creditorId && bankruptPlayer.properties) {
      for (const propId of bankruptPlayer.properties) {
        const propData = gameState?.properties?.[propId];
        if (propData) await update(ref(database, `games/${gameId}/properties/${propId}`), { owner: creditorId });
      }
    }
    await remove(ref(database, `games/${gameId}/players/${playerId}`));
    setMessage(`💀 ${bankruptPlayer.name} has been eliminated!`);
    const remainingPlayers = Object.keys(gameState.players || {}).filter(id => id !== playerId);
    if (remainingPlayers.length === 1) {
      const winner = gameState.players[remainingPlayers[0]];
      await update(ref(database, `games/${gameId}`), { phase: 'ended', winner: remainingPlayers[0], winnerName: winner.name });
      setMessage(`🏆 ${winner.name} WINS THE GAME!`);
    }
  };

  const updatePlayerName = useCallback(async (name) => {
    if (!gameId || !user) return;
    await update(ref(database, `games/${gameId}/players/${user.uid}`), { name });
  }, [gameId, user]);

  const closeCard = useCallback(() => setShowCard(null), []);

  const value = {
    user, loading, gameId, gameState, players, currentPlayer, isHost, gamePhase,
    diceValues, isRolling, diceAnimation, canBuyProperty, currentProperty,
    showCard, message, setMessage, jailOptions, isMyTurn, doublesCount,
    createGame, joinGame, startGame, leaveGame, toggleReady, updatePlayerName,
    rollDice, buyProperty, dontBuyProperty, payJailFine, closeCard,
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};
