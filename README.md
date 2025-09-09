# Horologium

A self-hostable **Steam Game playtime booster** built with **Next.js 15**, **Express**, **Prisma**, and **SteamUser**.  
It lets you log into your Steam account, manage the list of games you want to farm hours in, and control them through a clean dashboard UI.

---

## ✨ Features
- 🔑 Steam login with refresh token support  
- 🔒 2FA (Steam Guard) verification  
- 🎮 Add / remove games by their AppID  
- 🗃 Persistent storage with SQLite (via Prisma ORM)  
- 📦 Clean Next.js 15 App Router frontend with Shadcn UI components  

---

## ⚡️ Getting Started

### 1. Clone the repo
```bash
git clone https://github.com/RunerraX/Horologium.git
cd horologium
```

### 2. Install dependencies
```bash
npm install
```

### 3. Dev server
```bash
npx prisma migrate dev
npm run dev
```

### 4. Build for production 
```bash
npx prisma migrate deploy
npm build
npm start
```


🖥 Usage

Go to http://localhost:3000/login

Enter Steam username + password

If Steam Guard is enabled, you will be asked for code

After login, visit the Dashboard to:

Add a game AppID

Remove a game AppID

See which games are currently being simulated as "played"