"use client";

import * as React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Coffee, DollarSign, FileText, Star, Users } from "lucide-react";
import Image from "next/image";
import rewardImage from "@/public/Promotion--Streamline-Manchester.svg";
import reviewImage from "@/public/Minutes-Of-Meeting--Streamline-Manchester.svg";
import favCafeImage from "@/public/Fine-Dining--Streamline-Manchester.svg";
type UserRole = "CUSTOMER" | "CAFE_OWNER" | "VENUE_MANAGER" | "ADMIN";

interface HomePageProps {
  userRole: UserRole;
  userName: string;
}

const CustomerHome: React.FC = () => (
  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
    <Card className="border-slate-300 hover:bg-yellow-300 transition-all duration-150 ease-in-out cursor-pointer">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-8">
        <CardTitle className="text-sm font-medium">Total Rewards</CardTitle>
        <DollarSign className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <Image src={rewardImage} alt="reward" />
      <CardContent className="px-8">
        <div className="text-2xl font-bold">250 points</div>
        <p className="text-xs text-muted-foreground">+20 from last visit</p>
      </CardContent>
    </Card>
    <Card className="border-slate-300 hover:bg-yellow-300 transition-all duration-150 ease-in-out cursor-pointer">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-8">
        <CardTitle className="text-sm font-medium">Recent Reviews</CardTitle>
        <Star className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <Image src={reviewImage} alt="reward" />
      <CardContent className="px-8">
        <div className="text-2xl font-bold">4.5 / 5</div>
        <p className="text-xs text-muted-foreground">
          Based on your last 5 reviews
        </p>
      </CardContent>
    </Card>
    <Card className="border-slate-300 hover:bg-yellow-300 transition-all duration-150 ease-in-out cursor-pointer">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-8">
        <CardTitle className="text-sm font-medium">Favorite Cafes</CardTitle>
        <Coffee className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <Image src={favCafeImage} alt="reward" />
      <CardContent className="px-8">
        <div className="text-2xl font-bold">3</div>
        <p className="text-xs text-muted-foreground">
          Cafes you've visited more than 5 times
        </p>
      </CardContent>
    </Card>
  </div>
);

const CafeOwnerHome: React.FC = () => (
  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
        <DollarSign className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">$12,345</div>
        <p className="text-xs text-muted-foreground">+15% from last month</p>
      </CardContent>
    </Card>
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
        <Star className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">4.7 / 5</div>
        <p className="text-xs text-muted-foreground">Based on 120 reviews</p>
      </CardContent>
    </Card>
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Total Venues</CardTitle>
        <Coffee className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">3</div>
        <p className="text-xs text-muted-foreground">2 cafes, 1 restaurant</p>
      </CardContent>
    </Card>
  </div>
);

const VenueManagerHome: React.FC = () => (
  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Today's Bookings</CardTitle>
        <Users className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">24</div>
        <p className="text-xs text-muted-foreground">4 tables available</p>
      </CardContent>
    </Card>
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Recent Reviews</CardTitle>
        <Star className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">4.8 / 5</div>
        <p className="text-xs text-muted-foreground">Last 7 days</p>
      </CardContent>
    </Card>
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Staff on Duty</CardTitle>
        <Users className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">8 / 10</div>
        <p className="text-xs text-muted-foreground">2 on break</p>
      </CardContent>
    </Card>
  </div>
);

const AdminHome: React.FC = () => (
  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Total Users</CardTitle>
        <Users className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">10,234</div>
        <p className="text-xs text-muted-foreground">+120 this week</p>
      </CardContent>
    </Card>
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Pending Approvals</CardTitle>
        <FileText className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">23</div>
        <p className="text-xs text-muted-foreground">5 urgent</p>
      </CardContent>
    </Card>
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">System Status</CardTitle>
        <Coffee className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">Healthy</div>
        <p className="text-xs text-muted-foreground">All systems operational</p>
      </CardContent>
    </Card>
  </div>
);

export default function Component({ userRole, userName }: HomePageProps) {
  let HomeComponent: React.FC;
  let roleTitle: string;

  switch (userRole) {
    case "CUSTOMER":
      HomeComponent = CustomerHome;
      roleTitle = "Customer";
      break;
    case "CAFE_OWNER":
      HomeComponent = CafeOwnerHome;
      roleTitle = "Cafe Owner";
      break;
    case "VENUE_MANAGER":
      HomeComponent = VenueManagerHome;
      roleTitle = "Venue Manager";
      break;
    case "ADMIN":
      HomeComponent = AdminHome;
      roleTitle = "Administrator";
      break;
    default:
      HomeComponent = CustomerHome;
      roleTitle = "User";
  }

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">
          Welcome back,{" "}
          <span className="bg-gradient-to-r from-[#FCCAC2] via-[#FF7449] to-[#FFB949] bg-clip-text text-transparent">
            cihan
          </span>
          {/* {userName} */}
        </h2>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        
        <Card className="col-span-4 border-slate-300">
          <CardHeader className="px-4">
            <CardTitle>Your {roleTitle} Dashboard</CardTitle>
            <CardDescription>
              Here's what's happening in your world today.
            </CardDescription>
          </CardHeader>
          <CardContent className="px-4">
            <HomeComponent />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
