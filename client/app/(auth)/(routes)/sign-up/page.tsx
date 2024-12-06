"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import useSWRMutation from "swr/mutation";
import { useRouter } from "next/navigation";

import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";

import signupImage from "@/public/Success-3--Streamline-Manchester.svg";
import { Eye, EyeOff } from "lucide-react";
import { FaFacebook } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { Checkbox } from "@/components/ui/checkbox";

const formSchema = z
  .object({
    email: z.string().email("Invalid email address"),
    username: z.string().min(3, "Username must be at least 3 characters"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
    acceptTerms: z.boolean().refine((val) => val === true, {
      message: "You must accept the terms and conditions",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type FormData = z.infer<typeof formSchema>;

async function sendRequest(
  url: string,
  {
    arg,
  }: {
    arg:
      | Omit<FormData, "confirmPassword" | "acceptTerms">
      | { id: string; email: string; username: string };
  }
) {
  return fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}${url}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(arg),
  }).then((res) => res.json());
}

export default function SignupPage() {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { trigger: registerTrigger, isMutating: isRegistering } =
    useSWRMutation("/api/auth/register", sendRequest);

  const { trigger: profileTrigger, isMutating: isUpdatingProfile } =
    useSWRMutation("/api/user/profile", sendRequest);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      username: "",
      password: "",
      confirmPassword: "",
      acceptTerms: false,
    },
    mode: "onChange",
  });

  const onSubmit = async (data: FormData) => {
    try {
      const { confirmPassword, acceptTerms, ...registerData } = data;

      console.log("Sending registration data:", registerData);

      // Trigger the registration API
      const registerResult = await registerTrigger(registerData);

      if (!registerResult || registerResult.error) {
        console.error(
          "Registration failed:",
          registerResult?.error || "Unknown error"
        );
        return;
      }

      const { id, email, username } = registerResult.data.user;

      console.log("Registration successful:", { id, email, username });

      // Redirect to sign-in page
      router.push("/sign-in");
    } catch (error) {
      console.error("An unexpected error occurred during registration:", error);
    }
  };

  const isFormValid = () => {
    const values = form.getValues();
    return (
      values.email !== "" &&
      values.username !== "" &&
      values.password !== "" &&
      values.confirmPassword !== "" &&
      values.acceptTerms === true &&
      Object.keys(form.formState.errors).length === 0
    );
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center gap-16 bg-[#025951] px-8">
      <Card className="w-[440px] border-none text-center overflow-hidden bg-white py-4 px-6 rounded-[24px]">
        <CardContent className="px-4">
          <CardHeader className="p-0 mb-4 w-full flex flex-col items-center justify-center gap-2">
            <div className="w-[80%] flex flex-col items-center justify-center gap-2">
              <CardTitle className="text-2xl font-bold">Sign Up</CardTitle>
              <CardDescription className="text-base">
                Hey, Enter your details to login to your account
              </CardDescription>
            </div>
          </CardHeader>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
            <div className="space-y-1">
              <Input
                {...form.register("email")}
                id="email"
                type="email"
                placeholder="Email"
                className="border-[#5D5D5D] border-[1px] rounded-[8px] px-3 py-4 text-sm placeholder:text-xs placeholder:text-[#797979]"
              />
              {form.formState.errors.email && (
                <p className="text-red-500 text-xs text-left">
                  {form.formState.errors.email.message}
                </p>
              )}
            </div>

            <div className="space-y-1">
              <Input
                {...form.register("username")}
                id="username"
                placeholder="Username"
                className="border-[#5D5D5D] border-[1px] rounded-[8px] px-3 py-4 text-sm placeholder:text-xs placeholder:text-[#797979]"
              />
              {form.formState.errors.username && (
                <p className="text-red-500 text-xs text-left">
                  {form.formState.errors.username.message}
                </p>
              )}
            </div>

            <div className="space-y-1 relative">
              <Input
                {...form.register("password")}
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className="border-[#5D5D5D] border-[1px] rounded-[8px] px-3 py-4 text-sm placeholder:text-xs placeholder:text-[#797979]"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/3 -translate-y-1/2 text-gray-500"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
              {form.formState.errors.password && (
                <p className="text-red-500 text-xs text-left">
                  {form.formState.errors.password.message}
                </p>
              )}
            </div>

            <div className="space-y-1 relative">
              <Input
                {...form.register("confirmPassword")}
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm Password"
                className="border-[#5D5D5D] border-[1px] rounded-[8px] px-3 py-4 text-sm placeholder:text-xs placeholder:text-[#797979]"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/3 -translate-y-1/2 text-gray-500"
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
              {form.formState.errors.confirmPassword && (
                <p className="text-red-500 text-xs text-left">
                  {form.formState.errors.confirmPassword.message}
                </p>
              )}
            </div>

            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="acceptTerms"
                  checked={form.watch("acceptTerms")}
                  onCheckedChange={(checked) => {
                    form.setValue("acceptTerms", checked === true);
                  }}
                  className="border-[#5D5D5D] data-[state=checked]:bg-[#28A745] h-3 w-3"
                />
                <label
                  htmlFor="acceptTerms"
                  className="text-xs font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  I agree to the{" "}
                  <Link
                    href="/terms"
                    className="text-[#28A745] hover:underline"
                  >
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link
                    href="/privacy"
                    className="text-[#28A745] hover:underline"
                  >
                    Privacy Policy
                  </Link>
                </label>
              </div>
              {form.formState.errors.acceptTerms && (
                <p className="text-red-500 text-xs text-left">
                  {form.formState.errors.acceptTerms.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              disabled={
                !isFormValid() ||
                form.formState.isSubmitting ||
                isRegistering ||
                isUpdatingProfile
              }
              className={`w-full rounded-[8px] py-4 text-sm ${
                isFormValid()
                  ? "bg-[#28A745] hover:bg-[#28A745]/80"
                  : "bg-[#AED6B3] cursor-not-allowed"
              } text-white`}
            >
              {isRegistering || isUpdatingProfile ? "Signing up..." : "Sign Up"}
            </Button>

            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-muted-foreground">
                  or sign in with
                </span>
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1 flex items-center gap-1 border-[#5D5D5D] rounded-[8px] py-4 text-xs"
              >
                <FcGoogle className="h-4 w-4" />
                Google
              </Button>
              <Button
                variant="outline"
                className="flex-1 flex items-center gap-1 border-[#5D5D5D] rounded-[8px] py-4 text-xs"
              >
                <FaFacebook className="h-4 w-4 text-blue-600" />
                Facebook
              </Button>
            </div>

            <p className="text-xs text-muted-foreground">
              Already have an account?{" "}
              <Link
                href="/sign-in"
                className="text-black font-bold hover:underline"
              >
                Sign In
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
      <div className="relative hidden md:block">
        <Image src={signupImage} alt="Signup illustration" />
      </div>
    </div>
  );
}
