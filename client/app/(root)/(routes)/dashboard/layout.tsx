import React from "react";
import { PathBreadcrumb } from "@/components/layout-breadcrumb";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { SidebarWrapper } from "./_components/sidebar-wrapper";

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-full">
      <SidebarWrapper>
        <main className="flex min-h-screen flex-col flex-1">
          <div className="sticky top-0 z-50 bg-white py-4 border-b-[1px] border-b-slate-300 ">
            <div className="flex items-center gap-4 px-4">
              {/* <SidebarTrigger /> */} {/* Make it avaliable if needed */}
              <div className="h-4 w-px bg-border" /> {/* Vertical divider */}
              <PathBreadcrumb />
            </div>
          </div>
          <div className="flex-1">{children}</div>
        </main>
      </SidebarWrapper>
    </div>
  );
};

export default MainLayout;
