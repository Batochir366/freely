"use client";

import { useAuth } from "@/app/context/AuthContext";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { LogIn, ArrowRight } from "lucide-react";

interface AuthGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function AuthGuard({ children, fallback }: AuthGuardProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    if (fallback) {
      return <>{fallback}</>;
    }

    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-white/10 backdrop-blur-sm border-white/20">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <LogIn className="w-6 h-6 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold text-white">
              Please Log In
            </CardTitle>
            <CardDescription className="text-white/70">
              You need to be logged in to access this page
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              onClick={() => router.push("/sign-in")}
              className="w-full bg-gradient-to-r from-purple-500 via-violet-500 to-pink-500 text-white font-bold py-2 rounded-lg hover:opacity-90 transition-opacity"
            >
              Sign In
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button
              onClick={() => router.push("/sign-up")}
              className="w-full bg-white/20 backdrop-blur-sm border-2 border-white/30 text-white font-bold py-2 rounded-lg hover:bg-white/30 hover:border-white/50 transition-all duration-200"
            >
              Create Account
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
}
