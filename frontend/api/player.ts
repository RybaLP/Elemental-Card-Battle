import { Player } from "@/types/player";

export const createPlayer = async ( nickname : string ) : Promise<Player> => {
    const res = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + `/players` , {
        method : "POST",
        headers : {"Content-Type" : "application/json"},
        body : JSON.stringify({nickname})
    });

    if (!res.ok) {
        throw new Error("Failed to create player");
    }

    return res.json();
}