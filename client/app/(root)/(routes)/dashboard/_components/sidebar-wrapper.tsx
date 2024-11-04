'use client'

import { AppSidebar } from "@/components/app-sidebar"
import { SidebarProvider } from "@/components/ui/sidebar"
import { ReactNode } from "react"

export function SidebarWrapper({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider className="bg-white">
      <AppSidebar userRole={"CUSTOMER"} />
      {children}
    </SidebarProvider>
  )
}