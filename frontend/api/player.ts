import { Player } from "@/types/player";
import { getBackendUrl } from "./getBackendUrl";

export const createPlayer = async ( nickname : string ) : Promise<Player> => {
    const res = await fetch(getBackendUrl() + `/players` , {
        method : "POST",
        headers : {"Content-Type" : "application/json"},
        body : JSON.stringify({nickname})
    });

    if (!res.ok) {
        throw new Error("Failed to create player");
    }

    return res.json();
}