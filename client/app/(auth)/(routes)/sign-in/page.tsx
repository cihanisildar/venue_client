"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import useSWRMutation from "swr/mutation";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

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

import signinImage from "@/public/Success-2--Streamline-Manchester.svg";
import { Eye, EyeOff } from "lucide-react";
import { FaFacebook } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";

const formSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type FormData = z.infer<typeof formSchema>;

async function sendRequest(url: string, { arg }: { arg: FormData }) {
  return fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}${url}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(arg),
  }).then((res) => res.json());
}

export default function SignInPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const { trigger, isMutating } = useSWRMutation(
    "/api/auth/login",
    sendRequest
  );

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onChange",
  });

  const onSubmit = async (data: FormData) => {
    try {
      const response = await trigger(data);

      if (response.error) {
        console.error(response.error);
        return;
      }

      console.log(response);

      Cookies.set("vn_auth_token", response.data.accessToken, {
        path: "/",
        secure: true,
        sameSite: "Strict",
      });
      // Set the refresh token
      Cookies.set("vn_refresh_token", response.data.refreshToken, {
        path: "/",
        secure: true,
        sameSite: "Strict",
      });

      router.push("/dashboard");
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center gap-16 bg-[#025951] px-8">
      <Card className="w-[400px] border-none text-center overflow-hidden bg-white px-4 py-6 rounded-[24px]">
        <CardContent className="px-4">
          <CardHeader className="p-0 mb-4 w-full flex flex-col items-center justify-center gap-2">
            <div className="w-[80%] flex flex-col items-center justify-center gap-2">
              <CardTitle className="text-2xl font-bold">Sign In</CardTitle>
              <CardDescription className="text-base">
                Welcome back! Please enter your details
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

            <div className="space-y-1 relative">
              <Input
                {...form.register("password")}
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className="border-[#5D5D5D] border-[1px] rounded-[8px] px-3 py-4 pr-8 text-sm placeholder:text-xs placeholder:text-[#797979]"
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

            <Button
              type="submit"
              disabled={
                !form.formState.isValid ||
                form.formState.isSubmitting ||
                isMutating
              }
              className={`w-full rounded-[8px] py-4 text-sm ${
                form.formState.isValid
                  ? "bg-[#28A745] hover:bg-[#28A745]/80"
                  : "bg-[#AED6B3] cursor-not-allowed"
              } text-white`}
            >
              {isMutating ? "Signing in..." : "Sign In"}
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
              Don't have an account?{" "}
              <Link
                href="/sign-up"
                className="text-black font-bold hover:underline"
              >
                Sign Up
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
      <div className="relative hidden md:block">
        <Image src={signinImage} alt="Signin illustration" />
      </div>
    </div>
  );
}
