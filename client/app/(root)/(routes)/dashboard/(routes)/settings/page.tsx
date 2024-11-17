"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import useUserProfile from "@/hooks/useProfile";
import toast, { Toaster } from "react-hot-toast";
import { FaInfoCircle } from "react-icons/fa";

// Zod schema for validation
const userSchema = z.object({
  email: z
    .string()
    .email("Invalid email address")
    .nonempty("Email is required"),
  username: z.string().min(3, "Username must be at least 3 characters long"),
  name: z.string().optional(),
  age: z
    .number()
    .nonnegative("Age must be a positive number")
    .optional()
    .nullable(),
  phoneNumber: z.string().optional(),
  reliabilityScore: z.number().nonnegative().nullable().optional(),
  role: z.string(),
});

// TypeScript type inference from the Zod schema
type UserFormValues = z.infer<typeof userSchema>;

export default function SettingsPage() {
  const { userProfile, loading, error } = useUserProfile();
  const [toastShown, setToastShown] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<UserFormValues>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      email: "",
      username: "",
      name: "",
      age: null,
      phoneNumber: "",
      reliabilityScore: null,
      role: "",
    },
  });

  useEffect(() => {
    if (userProfile) {
      reset({
        email: userProfile.email || "",
        username: userProfile.username || "",
        name: userProfile.name || "",
        age: userProfile.age || null,
        phoneNumber: userProfile.phoneNumber || "",
        reliabilityScore: userProfile.reliabilityScore || null,
        role: userProfile.role || "GUEST",
      });

      // Show info toast reminder if name, age, and phone number are empty
      if (
        !toastShown &&
        !userProfile.name &&
        (userProfile.age === null || userProfile.age === undefined) &&
        !userProfile.phoneNumber
      ) {
        toast(
          (t) => (
            <div className="flex items-center gap-3">
              <FaInfoCircle className="h-6 w-6 text-blue-500" />
              <div>
                <p className="font-medium">Reminder</p>
                <p className="text-sm text-gray-600">
                  Please fill in your <strong>Name</strong>,{" "}
                  <strong>Age</strong>, and <strong>Phone Number</strong>.
                </p>
              </div>
            </div>
          ),
          {
            duration: 6000,
            icon: null, // Disable default icon
            style: {
              borderRadius: "8px",
              background: "#f0f9ff",
              color: "#1e40af",
            },
          }
        );
        setToastShown(true);
      }
    }
  }, [userProfile, reset, toastShown]);

  const onSubmit = async (data: UserFormValues) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user/profile`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
          credentials: "include",
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update profile");
      }

      const updatedProfile = await response.json();
      toast.success("Profile updated successfully!");
      console.log("Updated Profile:", updatedProfile); // Optional for debugging
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error(error instanceof Error ? error.message : "An error occurred");
    }
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

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error || !userProfile) {
    return <div>Error loading user profile</div>;
  }

  return (
    <div className="mx-auto px-8 py-4">
      {/* Toast Container */}
      <Toaster position="top-right" />

      <div className="w-full flex items-center justify-between">
        <h2 className="text-3xl font-bold">Profile Information</h2>
        <div className="flex items-center mb-6 w-fit">
          <Badge
            className={`${getRoleBadgeColor(
              userProfile.role
            )} text-white hover:text-white rounded-[4px] hover:bg-blue-500`}
          >
            {userProfile.role}
          </Badge>
        </div>
      </div>
      <Card className="border-none">
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="space-y-4 py-4 px-6 mt-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                {...register("email")}
                readOnly
                className="bg-muted border-slate-300 cursor-not-allowed bg-slate-100 rounded-[4px]"
              />
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                {...register("username")}
                className="rounded-[4px] border-slate-300"
              />
              {errors.username && (
                <p className="text-red-500 text-sm">
                  {errors.username.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                {...register("name")}
                className="rounded-[4px] border-slate-300"
              />
              {errors.name && (
                <p className="text-red-500 text-sm">{errors.name.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="age">Age</Label>
              <Input
                id="age"
                {...register("age", { valueAsNumber: true })}
                type="number"
                className="rounded-[4px] border-slate-300"
              />
              {errors.age && (
                <p className="text-red-500 text-sm">{errors.age.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="phoneNumber">Phone Number</Label>
              <Input
                id="phoneNumber"
                {...register("phoneNumber")}
                className="rounded-[4px] border-slate-300"
              />
              {errors.phoneNumber && (
                <p className="text-red-500 text-sm">
                  {errors.phoneNumber.message}
                </p>
              )}
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
