"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useAuth } from "@/app/context/AuthContext";

interface AuthFormProps {
  mode: "signin" | "signup";
  onToggleMode: () => void;
}

export function AuthForm({ mode, onToggleMode }: AuthFormProps) {
  const { signIn, signUp } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Simple validation
      if (!formData.email || !formData.password) {
        toast.error("Please fill in all required fields");
        return;
      }

      if (mode === "signup") {
        if (formData.password !== formData.confirmPassword) {
          toast.error("Passwords do not match");
          return;
        }
        if (!formData.firstName || !formData.lastName) {
          toast.error("Please enter your first and last name");
          return;
        }
      }

      if (mode === "signup") {
        // Create new user
        const userData = {
          email: formData.email,
          firstName: formData.firstName,
          lastName: formData.lastName,
          userName: formData.email.split("@")[0],
          photo: "/placeholder.svg",
          isAdmin: false,
          password: formData.password,
        };

        const success = await signUp(userData);

        if (success) {
          toast.success("Account created successfully!");
          router.push("/");
        } else {
          toast.error("Failed to create account. Email might already exist.");
        }
      } else {
        // Sign in
        const success = await signIn(formData.email, formData.password);

        if (success) {
          toast.success("Welcome back!");
          router.push("/");
        } else {
          toast.error(
            "Invalid credentials. Please check your email or sign up first."
          );
        }
      }
    } catch (error: unknown) {
      console.error("Auth error:", error);
      const errorMessage =
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message || "Something went wrong. Please try again.";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto bg-black/50 backdrop-blur-lg border-white/20">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold text-white">
          {mode === "signin" ? "Welcome Back" : "Create Account"}
        </CardTitle>
        <CardDescription className="text-gray-400">
          {mode === "signin"
            ? "Sign in to your account to continue"
            : "Sign up to get started with Freely"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "signup" && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName" className="text-white/70">
                  First Name
                </Label>
                <Input
                  id="firstName"
                  name="firstName"
                  type="text"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                  placeholder="John"
                  required={mode === "signup"}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName" className="text-white/70">
                  Last Name
                </Label>
                <Input
                  id="lastName"
                  name="lastName"
                  type="text"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                  placeholder="Doe"
                  required={mode === "signup"}
                />
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="email" className="text-white/70">
              Email
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
              placeholder="john@example.com"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-white/70">
              Password
            </Label>
            <div className="relative">
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleInputChange}
                className="bg-white/10 border-white/20 text-white placeholder:text-white/50 pr-10"
                placeholder="Enter your password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white/70"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          {mode === "signup" && (
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-white/70">
                Confirm Password
              </Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type={showPassword ? "text" : "password"}
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                placeholder="Confirm your password"
                required={mode === "signup"}
              />
            </div>
          )}

          <Button
            type="submit"
            className="w-full bg-[#B8CFCE] text-black hover:bg-[#B8CFCE]/90 font-medium"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {mode === "signin" ? "Signing in..." : "Creating account..."}
              </>
            ) : mode === "signin" ? (
              "Sign In"
            ) : (
              "Create Account"
            )}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-white/70">
            {mode === "signin"
              ? "Don't have an account?"
              : "Already have an account?"}
            <button
              onClick={onToggleMode}
              className="ml-2 text-[#B8CFCE] hover:text-[#B8CFCE]/80 font-medium transition-colors"
            >
              {mode === "signin" ? "Sign up" : "Sign in"}
            </button>
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
