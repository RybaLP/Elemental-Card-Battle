import privateClient from "./client/privateClient";
import publicClient from "./client/publicClient";

const setTokenCookie = (token: string) => {
    document.cookie = `token=${token}; path=/; max-age=36000; SameSite=Strict`;
};

export const register = async (username : string, email : string , password : string, confirmPassword : string) => {
    const res = await publicClient.post(`/auth/register` , {
        username,
        email,
        password,
        confirmPassword
    });

    const token = res.data;
    setTokenCookie(token);
    return token;
}

export const login = async (email: string, password: string) => {
    const res = await publicClient.post("/auth/login", {
        email,
        password
    });
    const token = res.data.jwt
    setTokenCookie(token);
    return token;
};

export const logout = () => {
    document.cookie = "token=; path=/; max-age=0";
};

export const getToken = () => {
    return document.cookie
        .split("; ")
        .find(row => row.startsWith("token="))
        ?.split("=")[1];
};

export const getProfile = async () => {
    const res = await privateClient.get("/users");
    return res.data;
}

export const getUserIdFromToken = (): number | null => {
    const token = getToken();
    if (!token) return null;
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.userId ?? null;
    } catch {
        return null;
    }
};

export const getNicknameFromToken = (): string | null => {
    const token = getToken();
    if (!token) return null;
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.nickname ?? null;
    } catch {
        return null;
    }
};