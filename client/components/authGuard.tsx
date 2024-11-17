"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface AuthGuardProps {
  children: React.ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter();

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<{ id: string; role: string } | null>(null); // State to hold user info

  useEffect(() => {
    const checkAuth = async () => {
      console.log("Checking authentication..."); // Log when checking auth
      const response = await fetch("http://localhost:8000/api/auth/check", {
        method: "GET", // Specify the method if needed
        credentials: "include", // Include credentials with the request
      });
      const data = await response.json();

      console.log(data);

      if (response.status === 401) { // Check if auth token is missing
        console.log("Auth token missing, attempting to refresh...");

        const refreshResponse = await fetch("http://localhost:8000/api/auth/refresh", {
          method: "POST", // Assuming refresh token endpoint uses POST
          credentials: "include", // Include credentials with the request
        });

        if (refreshResponse.status === 200) {
          console.log("Auth token refreshed successfully.");
          // Re-check authentication after refreshing
          checkAuth(); // Re-check authentication after refreshing
          return;
        } else {
          console.log("Failed to refresh auth token, redirecting to sign-in.");
          router.push("/sign-in");
          setIsLoading(false);
          return;
        }
      }

      if (response.status !== 200 || !data.user) {
        console.log("No tokens found or invalid, redirecting to sign-in.");
        router.push("/sign-in");
        setIsLoading(false);
        return;
      }

      console.log("User is authenticated:", data.user);
      setIsAuthenticated(true);
      setUser(data.user); // Store user information
      setIsLoading(false);
    };

    checkAuth();
  }, [router]);

  if (isLoading) {
    console.log("Loading..."); // Log when loading
    return <div>Loading...</div>; // Or your loading component
  }

  console.log("Rendering children for authenticated user."); // Log when rendering children
  return isAuthenticated ? <>{children}</> : null; // Render children if authenticated
}