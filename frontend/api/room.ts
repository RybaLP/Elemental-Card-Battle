import { Room } from "@/types/room";

export const fetchRooms = async () : Promise <Room[]> => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/rooms`,
        {
            method : "GET",
            headers : {"Content-Type" : "application/json"}
        }
    );

    if (!res.ok) {
        throw new Error("Failed to create player");
    }

    return res.json();
}

export const createPublicRoom = async (name : string , playerId : string) : Promise<Room> => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/rooms/create-public`, {
        method : "POST",
        headers : {"Content-Type" : "application/json"},
        body : JSON.stringify({name, playerId})
    })

    if (!res.ok) {
        throw new Error(`Błąd tworzenia pokoju: ${res.statusText}`);
    }

    const room = await res.json();
    return room;
}

export const getRoomById = async (roomId : string) : Promise<Room> => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/rooms/${roomId}`, {
        method : "GET",
        headers : {"Content-Type" : "application/json"},
    })

    if (!res.ok) {
        throw new Error(`Błąd tworzenia pokoju: ${res.statusText}`);
    }

    const room = res.json();
    return room;
}


export const joinPublicRoom = async (playerId : string, roomId : string) : Promise<Room> => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/rooms/join-public`, {
        method : "POST",
        headers : {"Content-Type" : "application/json"},
        body : JSON.stringify({playerId, roomId})
    });
    
    if (!res.ok) {
        throw new Error(`Błąd tworzenia pokoju: ${res.statusText}`);
    }

    const room = res.json();
    return room;
}


export const leaveRoom = async (playerId : string , roomId : string) : Promise<void> => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/rooms/leave`, {
        method : "POST",
        headers : {"Content-Type" : "application/json"},
        body : JSON.stringify({playerId : playerId, roomId : roomId})
    })

    if (!res.ok) {
        throw new Error(`Could not leave room!`);
    }
}

export const leaveRoomAndDelete = async (playerId : string, roomId : string) : Promise<void> => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/rooms/leave-and-delete`, {
        method : "DELETE",
        headers : {"Content-Type" : "application/json"},
        body : JSON.stringify({playerId : playerId, roomId : roomId})
    })
        if (!res.ok) {
        throw new Error(`Could not leave room!`);
    }
}