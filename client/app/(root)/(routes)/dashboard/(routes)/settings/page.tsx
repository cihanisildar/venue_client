"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// Mock data - replace with actual data fetching logic
const mockUser = {
  id: "1",
  email: "user@example.com",
  username: "cooluser",
  name: "John Doe",
  age: 30,
  phoneNumber: "+1234567890",
  role: "CUSTOMER",
  reliabilityScore: 95.5,
};

export default function SettingsPage() {
  const [user, setUser] = useState(mockUser);

  const handleInputChange = (e: any) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    // Here you would typically send the updated user data to your backend
    console.log("Updated user data:", user);
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "CUSTOMER":
        return "bg-blue-500";
      case "CAFE_OWNER":
        return "bg-green-500";
      case "VENUE_MANAGER":
        return "bg-purple-500";
      case "ADMIN":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className="mx-auto px-8 py-4">
      <div className="w-full flex items-center justify-between">
        {" "}
        <h2 className="text-3xl font-bold"> Profile Information</h2>
        <div className="flex items-center mb-6 w-fit">
          <Badge
            className={`${getRoleBadgeColor(
              user.role
            )} text-white hover:text-white rounded-[4px] hover:bg-blue-500`}
          >
            {user.role}
          </Badge>
        </div>
      </div>
      <Card className="border-none">
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4 py-4 px-6 mt-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                value={user.email}
                readOnly
                className="bg-muted border-slate-300 cursor-not-allowed bg-slate-100 rounded-[4px]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                name="username"
                value={user.username}
                className="rounded-[4px] border-slate-300"
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                value={user.name}
                className="rounded-[4px] border-slate-300"
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="age">Age</Label>
              <Input
                id="age"
                name="age"
                type="number"
                value={user.age}
                className="rounded-[4px] border-slate-300"
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phoneNumber">Phone Number</Label>
              <Input
                id="phoneNumber"
                name="phoneNumber"
                value={user.phoneNumber}
                className="rounded-[4px] border-slate-300"
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="reliabilityScore">Reliability Score</Label>
              <Input
                id="reliabilityScore"
                name="reliabilityScore"
                value={user.reliabilityScore}
                readOnly
                className="bg-muted border-slate-300 cursor-not-allowed bg-slate-100 rounded-[4px]"
              />
            </div>
          </CardContent>
          <CardFooter className="w-full flex items-center justify-end mt-4">
            <Button type="submit" variant={"save"}>
              Save Changes
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
