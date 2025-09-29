"use client";
import React, { useState, useEffect } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "@/components/sidebar";
import {
  IconBrandTabler,
  IconSettings,
  IconUserBolt,
} from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import LogoIconMain from "@/components/LogoIcon";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import { AuthGuard } from "@/components/AuthGuard";
import { Logo } from "@/components/admin/AdminLogo";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!isLoading && (!isAuthenticated || !user?.isAdmin)) {
      router.push("/");
    }
  }, [isAuthenticated, user, isLoading, router]);

  const links = [
    {
      label: "Dashboard",
      href: "/admin/dashboard",
      icon: (
        <IconBrandTabler className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    },
    {
      label: "Add company",
      href: "/admin/company",
      icon: (
        <IconUserBolt className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    },
    {
      label: "Reviews",
      href: "/admin/reviews",
      icon: (
        <IconSettings className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    },
  ];

  return (
    <AuthGuard
      fallback={
        !isAuthenticated ? null : !user?.isAdmin ? (
          <div className="min-h-screen bg-black flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-white/10 backdrop-blur-sm border-white/20 rounded-lg p-6 text-center">
              <div className="mx-auto mb-4 w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center">
                <span className="text-red-400 text-xl">⚠️</span>
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">
                Access Denied
              </h2>
              <p className="text-white/70 mb-4">
                You need admin privileges to access this page
              </p>
              <button
                onClick={() => router.push("/")}
                className="px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors"
              >
                Go to Home
              </button>
            </div>
          </div>
        ) : null
      }
    >
      <div
        className={cn(
          " flex w-full flex-1 flex-col overflow-hidden rounded-md border border-neutral-200 bg-black md:flex-row dark:border-neutral-700 dark:bg-black",
          "h-screen"
        )}
      >
        <Sidebar open={open} setOpen={setOpen}>
          <SidebarBody className="justify-between gap-10">
            <div className="flex flex-1 flex-col overflow-x-hidden overflow-y-auto">
              {open ? <Logo /> : <LogoIconMain />}
              <div className="mt-8 flex flex-col gap-2">
                {links.map((link, idx) => (
                  <SidebarLink key={idx} link={link} />
                ))}
              </div>
            </div>
            <div>
              <SidebarLink
                link={{
                  label:
                    user?.firstName && user?.lastName
                      ? `${user.firstName} ${user.lastName}`
                      : user?.userName || "Admin User",
                  href: "/",
                  icon: (
                    <div className="h-7 w-7 shrink-0 rounded-full bg-purple-500 flex items-center justify-center text-white font-bold text-sm">
                      {user?.firstName
                        ? user.firstName.charAt(0).toUpperCase()
                        : "A"}
                    </div>
                  ),
                }}
              />
            </div>
          </SidebarBody>
        </Sidebar>
        <div className="flex-1">{children}</div>
      </div>
    </AuthGuard>
  );
}
