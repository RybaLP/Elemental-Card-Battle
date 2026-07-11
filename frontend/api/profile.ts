import privateClient from "./client/privateClient";
import { ProfileData } from "@/types/profileData";

export const fetchProfile = async (): Promise<ProfileData> => {
  const { data } = await privateClient.get("/users/profile");
  return data;
};