"use client";

import { AppSidebar } from "@/components/app-sidebar";
import Spinbar from "@/components/spinbar";
import { SidebarProvider } from "@/components/ui/sidebar";
import useUserProfile from "@/hooks/useProfile";
import { ReactNode } from "react";

export function SidebarWrapper({ children }: { children: ReactNode }) {
  const { userProfile, loading, error } = useUserProfile();

  if (loading) {
    return (
      <div>
        <Spinbar />
      </div>
    );
  }

  if (error || !userProfile) {
    return <div>Error loading user profile</div>;
  }

  return (
    <SidebarProvider className="bg-white">
      <AppSidebar userRole={userProfile.role || "CUSTOMER"} />
      {children}
    </SidebarProvider>
  );
}
