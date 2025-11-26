export const startGame = async (roomId : string) => {
    const res = await fetch (`${process.env.NEXT_PUBLIC_BACKEND_URL}/game/start/${roomId}`,
        {
            method : "POST",
            headers : {"Content-Type" : "application/json"}
        }
    )

    if (!res.ok) {
        throw new Error("Could not create new game session");
    }

    return res.json();
}

export const selectCard = async (sessionId : string, playerId : string, cardId : number) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/game/select` , {
        method : "POST",
        headers : {"Content-Type" : "application/json"},
        body : JSON.stringify({sessionId, playerId, cardId})
    })

    if (!res.ok) {
        throw new Error("Could not send request");
    }

    if (res.status === 204) return null;

    return res.json();
}