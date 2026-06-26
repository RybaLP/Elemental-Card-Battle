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
    const token = res.data;
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