"use client";
import { useState, useEffect } from "react";
import { fetchProfile } from "@/api/profile";
import { ProfileData } from "@/types/profileData";

export const useProfile = () => {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const data = await fetchProfile();
        setProfile(data);
      } catch (err) {
        setError("Failed to load profile.");
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  return { profile, isLoading, error };
};