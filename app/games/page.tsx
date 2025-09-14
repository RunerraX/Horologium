import GameCard from "@/components/GameCard"
import AddGameCard from "@/components/AddGameCard.tsx";
import "dotenv/config"

export default async function GamesPage() {


    const res = await fetch(`http://localhost:${process.env.STEAM_API_PORT}/steam/games/getOwned`, {
        cache: "no-store",
    })
    const data = await res.json()
    return (
        <>
        <div className="max-w-lg mx-auto p-6">
            <h1 className="text-center">If you dont see the game you want, add it by id</h1>
            <a className="block text-center text-blue-500" href="https://steamdb.info/" target="_blank">Get appId here</a>
            <AddGameCard></AddGameCard>
        </div>


        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
            {data.length > 0 ? data.map((app: { appId: number; name: string }) => (
                <GameCard app={app} key={app.appId} />
            )): <p>Loading...</p>}
        </div>
        </>
    )
}
