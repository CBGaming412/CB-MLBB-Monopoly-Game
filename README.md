# 🏆 MLBB Monopoly - Battle Arena Edition

> A real-time multiplayer Monopoly game themed around Mobile Legends: Bang Bang!

![MLBB Monopoly Banner](https://img.shields.io/badge/MLBB-Monopoly-Battle%20Arena-red?style=for-the-badge&logo=gamepad)

## ⚔️ Features

- **Real-time Multiplayer** - Play with friends via Firebase Realtime Database
- **MLBB Themed Board** - 40 spaces featuring heroes, maps, and items from Mobile Legends
- **Dynamic Gameplay** - Roll dice, buy properties, collect rent, and dominate the Land of Dawn
- **Stunning UI** - Beautiful MLBB-inspired design with animations and effects
- **Monopoly Mechanics** - Properties, Chance cards, Community Chest, Jail, and more!

## 🎮 How to Play

1. **Create or Join a Game**
   - Click "CREATE BATTLE" to start a new game
   - Or click "JOIN BATTLE" and enter a game code to join an existing game

2. **Wait for Players**
   - Share the game code with friends
   - All players must click "READY" before the battle can begin

3. **Battle!**
   - Roll dice on your turn
   - Land on properties to buy them or pay rent
   - Draw Chance and Arena Event cards
   - Build monopolies by collecting all heroes in a role
   - Last hero standing wins!

## 🛠️ Setup

### Prerequisites
- Node.js 18+ installed
- A Firebase project with Realtime Database enabled

### Installation

```bash
git clone https://github.com/CBGaming412/CB-MLBB-Monopoly-Game.git
cd CB-MLBB-Monopoly-Game
npm install
npm run dev
```

### Firebase Configuration

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or use an existing one
3. Enable Realtime Database
4. Update `src/firebase/config.js` with your credentials

## 🎯 Property Groups (Monopolies)

Collect all heroes in a role to double your rent!

| Role | Heroes | Color |
|------|--------|-------|
| Fighter | Gusion, Ling, Thamuz, Masha | 🔴 Red |
| Tank | Franco, Minotaur, Jawhead | 🔵 Blue |
| Mage | Nana, Lylia, Valir | 🟣 Purple |
| Assassin | Hayabusa, Aamon, Saber | 🟢 Green |
| Marksman | Layla, Claude, Kimmy, Miya, Granger, Beatrix | 💗 Pink |
| Support | Roger, Diggie, Angela | 🔷 Cyan |

## 🚀 Deployment

```bash
npm run build
```

Build output will be in the `dist/` folder.

---

Made with ⚔️ for MLBB fans everywhere!
