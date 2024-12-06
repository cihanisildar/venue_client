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
  surname: z.string().optional(),
  birthdate: z
    .string()
    .nullable()
    .optional()
    .refine((val) => !val || !isNaN(Date.parse(val)), "Invalid date format"),
  phoneNumber: z.string().optional(),
  reliabilityScore: z.number().nonnegative().nullable().optional(),
  role: z.string(),
});

// TypeScript types
type UserFormValues = z.infer<typeof userSchema>;

// Type for tracking changes
type UserFormChanges = Partial<UserFormValues>;

export default function SettingsPage() {
  const { userProfile, loading, error } = useUserProfile();
  const [toastShown, setToastShown] = useState(false);
  const [initialValues, setInitialValues] = useState<UserFormValues | null>(
    null
  );

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<UserFormValues>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      email: "",
      username: "",
      name: "",
      surname: "",
      birthdate: null,
      phoneNumber: "",
      reliabilityScore: null,
      role: "",
    },
  });

  const formValues = watch();

  useEffect(() => {
    if (userProfile) {
      const formattedProfile = {
        email: userProfile.email || "",
        username: userProfile.username || "",
        name: userProfile.name || "",
        surname: userProfile.surname || "",
        birthdate: userProfile.birthdate
          ? new Date(userProfile.birthdate).toISOString().split("T")[0]
          : null,
        phoneNumber: userProfile.phoneNumber || "",
        reliabilityScore: userProfile.reliabilityScore || null,
        role: userProfile.role || "GUEST",
      };

      setInitialValues(formattedProfile);
      reset(formattedProfile);

      if (
        !toastShown &&
        !userProfile.name &&
        (userProfile.birthdate === null ||
          userProfile.birthdate === undefined) &&
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
            icon: null,
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

  const getChangedFields = (currentValues: UserFormValues): UserFormChanges => {
    if (!initialValues) return {};

    const changedFields: UserFormChanges = {};

    // Check each field explicitly with proper type checking
    if (currentValues.email !== initialValues.email) {
      changedFields.email = currentValues.email;
    }

    if (currentValues.username !== initialValues.username) {
      changedFields.username = currentValues.username;
    }

    if (currentValues.name !== initialValues.name) {
      changedFields.name = currentValues.name;
    }

    if (currentValues.surname !== initialValues.surname) {
      changedFields.surname = currentValues.surname;
    }

    if (currentValues.birthdate !== initialValues.birthdate) {
      changedFields.birthdate = currentValues.birthdate;
    }

    if (currentValues.phoneNumber !== initialValues.phoneNumber) {
      changedFields.phoneNumber = currentValues.phoneNumber;
    }

    if (currentValues.reliabilityScore !== initialValues.reliabilityScore) {
      changedFields.reliabilityScore = currentValues.reliabilityScore;
    }

    if (currentValues.role !== initialValues.role) {
      changedFields.role = currentValues.role;
    }

    return changedFields;
  };

  const onSubmit = async (data: UserFormValues) => {
    const changedFields = getChangedFields(data);

    // If no fields have changed, show a message and return
    if (Object.keys(changedFields).length === 0) {
      // toast.info("No changes to save");
      return;
    }

    // Format birthdate if it's included in changed fields
    const formattedChanges: UserFormChanges = {
      ...changedFields,
      birthdate: changedFields.birthdate
        ? new Date(changedFields.birthdate).toISOString()
        : changedFields.birthdate,
    };

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user/profile`,
        {
          method: "PUT", // Changed to PATCH since we're doing a partial update
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(changedFields),
          credentials: "include",
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update profile");
      }

      const updatedProfile = await response.json();
      toast.success("Profile updated successfully!");

      // Update initial values with the new data
      if (initialValues) {
        setInitialValues({
          ...initialValues,
          ...formattedChanges,
        });
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error(error instanceof Error ? error.message : "An error occurred");
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
            {/* Email Field */}
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

            {/* Username Field */}
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

            {/* Name Field */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label
                  htmlFor="name"
                  className="text-sm font-medium text-gray-700"
                >
                  First Name
                </Label>
                <Input
                  id="name"
                  {...register("name")}
                  className="w-full rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.name.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="surname"
                  className="text-sm font-medium text-gray-700"
                >
                  Last Name
                </Label>
                <Input
                  id="surname"
                  {...register("surname")}
                  className="w-full rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                />
                {errors.surname && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.surname.message}
                  </p>
                )}
              </div>
            </div>

            {/* Birth Date Field */}
            <div className="space-y-2">
              <Label htmlFor="birthdate">Birth Date</Label>
              <Input
                id="birthdate"
                {...register("birthdate")}
                type="date"
                className="rounded-[4px] border-slate-300"
              />
              {errors.birthdate && (
                <p className="text-red-500 text-sm">
                  {errors.birthdate.message}
                </p>
              )}
            </div>

            {/* Phone Number Field */}
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

          {/* Submit Button */}
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
