import { useState, useEffect } from "react";
import { IUserProfile } from "@/types/user.types";

const useUserProfile = () => {
  const [userProfile, setUserProfile] = useState<IUserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        console.log("Fetching user profile...");

        const backendUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user/profile`;
        console.log("Backend URL:", backendUrl);

        const response = await fetch(backendUrl, {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            "X-Gateway-Secret":
              process.env.NEXT_PUBLIC_API_GATEWAY_SECRET || "",
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          console.error("Error response data:", errorData);
          throw new Error(errorData.message || "An error occurred");
        }

        const data = await response.json();
        console.log("Response:", data);
        setUserProfile(data);
      } catch (err: any) {
        console.error("Error fetching user profile:", err);
        setError(err.message || "An unexpected error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  return { userProfile, loading, error };
};

export default useUserProfile;
