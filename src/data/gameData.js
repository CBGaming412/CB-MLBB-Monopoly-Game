// MLBB Monopoly Game Data
// Battle Arena themed Monopoly game

export const GAME_CONFIG = {
  STARTING_MONEY: 1500,
  JAIL_FINE: 50,
  PASS_GO_BONUS: 200,
  MAX_PLAYERS: 8,
  DOUBLE_JAIL_TRIGGER: 3,
};

export const PLAYER_TOKENS = ['🌟', '⚔️', '🛡️', '🔥', '⚡', '💎', '🌙', '☀️'];
export const PLAYER_COLORS = ['#ff6b35', '#00d4ff', '#7b68ee', '#32cd32', '#ffd700', '#ff69b4', '#9370db', '#20b2aa'];

export const BOARD_SPACES = [
  { id: 0, name: "BATTLE HALL", type: "start", description: "Collect 200 Gold when you pass!", icon: "🏛️", action: { collect: 200 } },
  { id: 1, name: "Gusion", group: "fighter", price: 60, rent: 4, color: "#ff4444", icon: "⚔️", description: "Shadow Blade Assassin" },
  { id: 2, name: "MYSTIC VENTURE", type: "chance", icon: "❓", description: "Draw a Mystery Card!" },
  { id: 3, name: "Ling", group: "fighter", price: 60, rent: 4, color: "#ff4444", icon: "🗡️", description: "Cloud Assassin" },
  { id: 4, name: "INCOME TAX", type: "tax", icon: "💰", description: "Pay 100 Gold to the Battle Fund", action: { pay: 100 } },
  { id: 5, name: "CENTRAL JUNGLE", type: "utility", color: "#8b4513", icon: "🌲", description: "Collect 50 Gold from each player!" },
  { id: 6, name: "Franco", group: "tank", price: 100, rent: 6, color: "#4488ff", icon: "🛡️", description: "Iron Wall Tank" },
  { id: 7, name: "MURKY WATERS", type: "chance", icon: "💧", description: "Draw a Hazard Card!" },
  { id: 8, name: "Minotaur", group: "tank", price: 100, rent: 6, color: "#4488ff", icon: "🐂", description: "Minotaur Warrior" },
  { id: 9, name: "Jawhead", group: "tank", price: 120, rent: 8, color: "#4488ff", icon: "🤖", description: "Combat Mech" },
  { id: 10, name: "SLOW ZONE", type: "jail", icon: "🔒", description: "Just visiting!" },
  { id: 11, name: "Nana", group: "mage", price: 140, rent: 10, color: "#9932cc", icon: "🧙", description: "Molina Chaos Mage" },
  { id: 12, name: "ARCANE TOWER", type: "utility", color: "#9370db", icon: "🗼", description: "Pay double rent!" },
  { id: 13, name: "Lylia", group: "mage", price: 140, rent: 10, color: "#9932cc", icon: "⚡", description: "Shadow of the Void" },
  { id: 14, name: "Valir", group: "mage", price: 160, rent: 12, color: "#9932cc", icon: "🔥", description: "Ember of the Flame" },
  { id: 15, name: "DRAGON'S LAIR", type: "railroad", color: "#ffd700", icon: "🐉", description: "Ride the Dragon!", price: 200 },
  { id: 16, name: "Hayabusa", group: "assassin", price: 180, rent: 14, color: "#2e8b57", icon: "🥷", description: "Shadow Ninja" },
  { id: 17, name: "GLOOM CELL", type: "chance", icon: "🌑", description: "Enter the Gloom Zone!" },
  { id: 18, name: "Aamon", group: "assassin", price: 180, rent: 14, color: "#2e8b57", icon: "🎭", description: "Phantom Blade" },
  { id: 19, name: "Saber", group: "assassin", price: 200, rent: 16, color: "#2e8b57", icon: "⚔️", description: "Puncture Wound" },
  { id: 20, name: "TURTLE NEXUS", type: "freeParking", icon: "🐢", description: "Rest and recover!" },
  { id: 21, name: "Layla", group: "marksman", price: 220, rent: 18, color: "#ff69b4", icon: "🔫", description: "The Starlight Survivor" },
  { id: 22, name: "FROST DOMAIN", type: "chance", icon: "❄️", description: "Enter the Frozen Arena!" },
  { id: 23, name: "Claude", group: "marksman", price: 220, rent: 18, color: "#ff69b4", icon: "🎴", description: "Master of the Arcane" },
  { id: 24, name: "Kimmy", group: "marksman", price: 240, rent: 20, color: "#ff69b4", icon: "🔧", description: "Energy Transformation" },
  { id: 25, name: "BARON'S CHAMBER", type: "utility", color: "#8b0000", icon: "👑", description: "Baron Nashor's Domain!" },
  { id: 26, name: "Miya", group: "marksman", price: 260, rent: 22, color: "#ff69b4", icon: "🏹", description: "Moonlight Archer" },
  { id: 27, name: "HURT ZONE", type: "chance", icon: "💥", description: "Sustained Damage Area!" },
  { id: 28, name: "Granger", group: "marksman", price: 260, rent: 22, color: "#ff69b4", icon: "🎻", description: "Rhapsody of Death" },
  { id: 29, name: "Beatrix", group: "marksman", price: 280, rent: 24, color: "#ff69b4", icon: "💣", description: "The Arsenal Queen" },
  { id: 30, name: "PRISON ZONE", type: "goToJail", icon: "⛓️", description: "Go directly to Prison!" },
  { id: 31, name: "Roger", group: "support", price: 300, rent: 26, color: "#00ced1", icon: "🐺", description: "Lone Wolf" },
  { id: 32, name: "SANCTUARY", type: "chance", icon: "✨", description: "Mysterious Powers!" },
  { id: 33, name: "Diggie", group: "support", price: 300, rent: 26, color: "#00ced1", icon: "🦉", description: "Young Chrono" },
  { id: 34, name: "Angela", group: "support", price: 320, rent: 28, color: "#00ced1", icon: "👼", description: "Puppet Master" },
  { id: 35, name: "TURTLE PIT", type: "railroad", color: "#ffd700", icon: "🐢", description: "Turtle control!", price: 200 },
  { id: 36, name: "COMBAT ARENA", type: "chance", icon: "⚔️", description: "Clash in the Arena!" },
  { id: 37, name: "Thamuz", group: "fighter", price: 350, rent: 35, color: "#ff4444", icon: "🔥", description: "The Inferno" },
  { id: 38, name: "SUPPLY DROP", type: "tax", color: "#8b4513", icon: "📦", description: "Emergency fee - Pay 75 Gold", action: { pay: 75 } },
  { id: 39, name: "Masha", group: "fighter", price: 400, rent: 50, color: "#ff4444", icon: "🐻", description: "Wild Bear" },
];

export const CHANCE_CARDS = [
  { id: 1, text: "🔮 Mystic Power! Collect 150 Gold", action: 'collect', amount: 150 },
  { id: 2, text: "⚔️ EPIC BATTLE! Pay 100 Gold", action: 'pay', amount: 100 },
  { id: 3, text: "📢 Squad Call! Advance to Masha", action: 'goto', position: 39 },
  { id: 4, text: "🏆 MVP Bonus! Collect 200 Gold", action: 'collect', amount: 200 },
  { id: 5, text: "🌟 Legend Rising! Go to Battle Hall", action: 'goto', position: 0, collect: 200 },
  { id: 6, text: "📦 Supply Package! Receive 50 Gold", action: 'collect', amount: 50 },
  { id: 7, text: "⛓️ AMBUSH! Go to Prison Zone", action: 'jail' },
  { id: 8, text: "🐉 Dragon's Blessing! Go to Dragon's Lair", action: 'goto', position: 15 },
  { id: 9, text: "❄️ Frozen! Go back 3 spaces", action: 'back', amount: 3 },
  { id: 10, text: "⚡ SPEED BOOST! Advance 3 spaces", action: 'forward', amount: 3 },
  { id: 11, text: "💎 Rare Skin Won! Collect 100 Gold", action: 'collect', amount: 100 },
  { id: 12, text: "🎯 Precision Strike! Pay 30 Gold", action: 'pay', amount: 30 },
  { id: 13, text: "👑 Baron Nashor! Pay 150 Gold", action: 'pay', amount: 150 },
  { id: 14, text: "🏰 Tower Defense! Collect 50 Gold each", action: 'collectFromAll', amount: 50 },
];

export const COMMUNITY_CHEST_CARDS = [
  { id: 1, text: "🏛️ Welcome Back! Collect 200 Gold", action: 'collect', amount: 200 },
  { id: 2, text: "💊 Health Potion! Receive 75 Gold", action: 'collect', amount: 75 },
  { id: 3, text: "🛡️ Shield Broken! Pay 50 Gold", action: 'pay', amount: 50 },
  { id: 4, text: "⛓️ TOWER DIVE! Go to Prison Zone", action: 'jail' },
  { id: 5, text: "🌲 Jungle Camp! Collect 100 Gold", action: 'collect', amount: 100 },
  { id: 6, text: "📢 Global Rush! Each pays 30 Gold", action: 'collectFromAll', amount: 30 },
  { id: 7, text: "🏥 Respawn Fee! Pay 100 Gold", action: 'pay', amount: 100 },
  { id: 8, text: "🎁 Achievement Bonus! Collect 40 Gold", action: 'collect', amount: 40 },
  { id: 9, text: "🔥 KILL STREAK! +150 Gold", action: 'collect', amount: 150 },
  { id: 10, text: "❌ DEBUFF! Pay 80 Gold", action: 'pay', amount: 80 },
  { id: 11, text: "🐢 Turtle Secured! Go to Turtle Nexus", action: 'goto', position: 20 },
  { id: 12, text: "⭐ Legend Rank! Go to Battle Hall", action: 'goto', position: 0, collect: 100 },
  { id: 13, text: "🎭 Stealth Mode! Go back 4 spaces", action: 'back', amount: 4 },
  { id: 14, text: "💫 Star Glory! Collect 60 Gold", action: 'collect', amount: 60 },
];

export const PROPERTY_GROUPS = {
  fighter: { name: "FIGHTER", color: "#ff4444", properties: [1, 3, 37, 39] },
  tank: { name: "TANK", color: "#4488ff", properties: [6, 8, 9] },
  mage: { name: "MAGE", color: "#9932cc", properties: [11, 13, 14] },
  assassin: { name: "ASSASSIN", color: "#2e8b57", properties: [16, 18, 19] },
  marksman: { name: "MARKSMAN", color: "#ff69b4", properties: [21, 23, 24, 26, 28, 29] },
  support: { name: "SUPPORT", color: "#00ced1", properties: [31, 33, 34] },
};

export const getPropertyById = (id) => BOARD_SPACES.find(space => space.id === id);

export const shuffleArray = (array) => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

export const calculateRent = (property, gameState) => {
  if (!property || property.type !== 'property') return 0;
  if (!gameState?.properties?.[property.id]?.owner) return 0;
  
  const owner = gameState.properties[property.id].owner;
  const ownedProperties = Object.entries(gameState.properties || {})
    .filter(([id, data]) => data.owner === owner && BOARD_SPACES.find(s => s.id === parseInt(id))?.group === property.group)
    .map(([id]) => parseInt(id));
  
  const groupInfo = PROPERTY_GROUPS[property.group];
  if (!groupInfo) return property.rent;
  
  const hasMonopoly = groupInfo.properties.every(id => ownedProperties.includes(id));
  if (hasMonopoly) return property.rent * 2;
  return property.rent;
};
