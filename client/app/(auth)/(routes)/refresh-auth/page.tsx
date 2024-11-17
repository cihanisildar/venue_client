// pages/refresh-auth.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { refreshAuthToken } from "@/actions/auth/refreshAuth";
import { FaSpinner } from "react-icons/fa";
import Spinbar from "@/components/spinbar";

const RefreshAuth = () => {
  const router = useRouter();

  useEffect(() => {
    const handleRefreshAuthToken = async () => {
      try {
        const data = await refreshAuthToken();
        if (data.success) {
          // Handle successful token refresh (e.g., store new token)
          router.push("/dashboard");
        } else {
          router.push("/sign-in");
        }
      } catch (error) {
        console.error("Error refreshing auth token:", error);
        router.push("/sign-in");
      }
    };

    handleRefreshAuthToken();
  }, [router]);

  return <Spinbar />;
};

export default RefreshAuth;
