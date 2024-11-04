import * as React from "react";
import {
  Calendar,
  Coffee,
  DollarSign,
  Home,
  Inbox,
  Search,
  Settings,
  Users,
  Utensils,
  Star,
  Bell,
  FileText,
  MapPin,
  LucideProps,
  LogOut,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { usePathname } from "next/navigation";
import { logout } from "@/actions/auth/auth.actions";

interface MenuItem {
  title: string;
  url?: string;
  icon: React.ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>
  >;
  onClick?: () => void; // Optional onClick property
}

// Menu items for different user roles
const commonItems: MenuItem[] = [
  { title: "Home", url: "/", icon: Home },
  { title: "Search", url: "#", icon: Search },
  { title: "Inbox", url: "#", icon: Inbox },
];

const customerItems: MenuItem[] = [
  { title: "My Preferences", url: "#", icon: Settings },
  { title: "My Reviews", url: "#", icon: Star },
  { title: "My Rewards", url: "#", icon: DollarSign },
];

const ownerManagerItems: MenuItem[] = [
  { title: "My Venues", url: "#", icon: Coffee },
  { title: "Menu Management", url: "#", icon: Utensils },
  { title: "Events", url: "#", icon: Calendar },
  { title: "Reviews", url: "#", icon: Star },
  { title: "Updates", url: "#", icon: Bell },
];

const adminItems: MenuItem[] = [
  { title: "User Management", url: "/admin/users", icon: Users },
  { title: "Venue Approvals", url: "#", icon: FileText },
  { title: "Reports", url: "#", icon: FileText },
];

type UserRole = "CUSTOMER" | "CAFE_OWNER" | "VENUE_MANAGER" | "ADMIN";

interface AppSidebarProps {
  userRole: UserRole;
}

export function AppSidebar({ userRole }: AppSidebarProps) {
  const pathname = usePathname();
  const renderMenuItems = (items: typeof commonItems) =>
    items.map((item) => (
      <SidebarMenuItem key={item.title}>
        <SidebarMenuButton
          asChild
          className={
            pathname === item.url
              ? "bg-[#F9D374] rounded-[8px] hover:bg-[#F9D374]/90"
              : ""
          }
        >
          <a
            href={item.url}
            className="cursor-pointer"
            onClick={(e) => {
              // Prevent default navigation if onClick is defined
              if (item.onClick) {
                e.preventDefault(); // Prevent default link behavior
                item.onClick(); // Call the onClick function
              }
            }}
          >
            <item.icon className="h-4 w-4 mr-2" />
            <span className="text-[#333333]">{item.title}</span>
          </a>
        </SidebarMenuButton>
      </SidebarMenuItem>
    ));

  const handleLogout = async () => {
    try {
      await logout();
      window.location.href = "/"; // Redirect after logout
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>General</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>{renderMenuItems(commonItems)}</SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {userRole === "CUSTOMER" && (
          <SidebarGroup>
            <SidebarGroupLabel>Customer</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>{renderMenuItems(customerItems)}</SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        {(userRole === "CAFE_OWNER" || userRole === "VENUE_MANAGER") && (
          <SidebarGroup>
            <SidebarGroupLabel>Management</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>{renderMenuItems(ownerManagerItems)}</SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        {userRole === "ADMIN" && (
          <SidebarGroup>
            <SidebarGroupLabel>Administration</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>{renderMenuItems(adminItems)}</SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        <SidebarGroup>
          <SidebarGroupLabel>Account</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {renderMenuItems([
                {
                  title: "Settings",
                  url: "/dashboard/settings",
                  icon: Settings,
                },
                {
                  title: "Logout",
                  icon: LogOut,
                  onClick: handleLogout,
                }, // Add logout item
              ])}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
