import express from "express";
import SteamUser from "steam-user";
import { success } from "zod";
import prisma from "./lib/prisma.ts";

const app = express();
app.use(express.json());

let guardCallback: ((code: string) => void) | undefined;

export class Steam {
  public loggedIn: boolean
  private steam: SteamUser;
  public blocked: boolean = false
  public online: boolean
  public username: string
  public games: number[] = []


  constructor() {
    this.loggedIn = false;
    this.steam = new SteamUser({ autoRelogin: false, dataDirectory: "./data", protocol: 1 });
    this.online = false
    this.setup()
    this.username = ""

  }
  public setup(): void {
    this.steam.on("disconnected", (eresult, msg) => {
      console.log("[DEBUG] event: disconnected", eresult, msg);
      this.loggedIn = false;
    })

    this.steam.on("playingState", (blocked, playingApp) => {
      this.blocked = blocked

      // If we're not blocked & we are already playing something
      if (!blocked && playingApp !== 0) {
        return;
      }

      console.log(`Playing state changed: ${blocked} (App ID: ${playingApp})`)

      this.play()
    })

    this.steam.on("refreshToken", async (refreshToken) => {
      console.log("New refresh token recieved")
      await prisma.token.upsert({
        create: {
          token: refreshToken,
          username: this.username
        },
        update: {
          token: refreshToken,
          username: this.username
        },
        where: {
          username: this.username
        }
      })
    })


  }

  public async login(username: string, password: string): Promise<any> {
    return new Promise(async (resolve, reject) => {
      this.username = username
      const token = await prisma.token.findUnique({
        where: {
          username: username
        }
      })

      if (token) {
        this.steam.logOn({ refreshToken: token.token });
        resolve({
          require2FA: false,
          success: true
        })
      } else {
        this.steam.logOn({ accountName: username, password: password });
      }



      this.steam.once("steamGuard", (domain, callback) => {
        guardCallback = callback;
        resolve({ require2FA: true, domain });
      });

      this.steam.once("loggedOn", () => {
        this.loggedIn = true;
        resolve({
          success: true,
          steamID: this.steam.steamID!.getSteam3RenderedID()
        });
      });

      this.steam.once("error", (err) => {
        reject(err);
      });

      this.steam.once("error", (err) => {
        console.error("Steam login error:", err);
        resolve({
          success: false,
          error: err.message
        })
      });

    });
  }

  public async play() {
    if (this.blocked) {
      this.steam.gamesPlayed([]);
      console.log("Stopped playing games")
    } else {
      if (this.games.length === 0) {
        this.games = await prisma.games.findMany().then(games => games.map(game => game.gameId))
      }
      this.steam.gamesPlayed(this.games);
      console.log(`Playing ${this.games.length} games.`)
    }

  }

}

const steam = new Steam();


app.listen(4000, () => {
  console.log("Steam server is running on port 4000");
});

app.post("/steam/login", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: "Missing username or password" });
  }

  if (!steam.loggedIn) {
    const LoginResult = await steam.login(username, password);

    if (LoginResult.require2FA) {
      return res.json({ require2FA: true, domain: LoginResult.domain });
    }

    if (!LoginResult.success) {
      return res.status(401).json({ error: LoginResult.error });
    }

    if (LoginResult.success) {
      return res.json({ success: true, steamID: LoginResult.steamID });
    }

  }
});

app.post("/steam/verify", (req, res) => {
  const { code } = req.body;

  if (!guardCallback) {
    return res.status(400).json({ error: "No pending 2FA challenge" });
  }

  guardCallback(code);
  guardCallback = undefined;

  res.json({ success: true });
});

app.post("/steam/games/play", async (req, res) => {
  const { games } = req.body;

  const gamesInDb = [...await prisma.games.findMany()].map(game => game.gameId)
  
  if (!gamesInDb.includes(games)) {
    await prisma.games.create({
      data: {
        gameId: games
      }
    })
  }

  if (!steam.loggedIn) {
    return res.status(401).json({ error: "Not logged in" });
  }

  const combinedGames = [...gamesInDb, Number(games)];

  steam.games = combinedGames;
  await steam.play();

  res.json({ success: true });

  
})

app.post("/steam/games/remove", async (req, res) => {
  const { games } = req.body;

  await prisma.games.delete({
      where: {
        gameId: Number(games)
      }
    })

  const newGames = [...await prisma.games.findMany()].map(game => game.gameId)

  steam.games = newGames;
  await steam.play();

  res.json({ success: true });

})
