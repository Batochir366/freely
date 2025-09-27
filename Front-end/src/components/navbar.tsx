"use client";
import { ArrowRight, ChevronDown, Menu, X } from "lucide-react";
import type React from "react";

import { SignedIn, useAuth, UserButton, useUser } from "@clerk/nextjs";
import Image from "next/image";
import LogoIconMain from "./LogoIcon";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import axiosInstance from "@/utils/axios";

const twkLausanneFont = {
  fontFamily: '"TWK Lausanne 400", "TWK Lausanne 400 Placeholder", sans-serif',
} as React.CSSProperties;

type User = {
  clerkId: string;
  email: string;
  userName: string;
  firstName: string;
  lastName: string;
  photo: string;
  isAdmin: boolean;
};

function NavLink({
  href,
  children,
  onClick,
}: {
  href: string;
  children: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <a
      href={href}
      className="text-gray-300 hover:text-white transition-colors relative group block py-2 md:py-0"
      onClick={onClick}
    >
      <span className="block" style={twkLausanneFont}>
        {children}
      </span>
      <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-500 via-violet-500 to-pink-500 transition-all group-hover:w-full" />
    </a>
  );
}

export default function NavBar() {
  const { isSignedIn } = useAuth();
  const [signedUser, setSignedUser] = useState<User | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const { user, isLoaded } = useUser();
  const router = useRouter();
  const pathName = usePathname();

  useEffect(() => {
    const fetchUser = async () => {
      if (!isSignedIn) return;

      try {
        const res = await axiosInstance.get("/user/get-current-user");
        setSignedUser(res.data.user);
      } catch (error) {
        console.error("Failed to fetch user:", error);
      }
    };

    fetchUser();
  }, [isSignedIn]);

  // Close mobile menu when clicking outside or on navigation
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <>
      {/* Main Navigation Bar */}
      <div
        className={`w-full flex justify-center backdrop-blur-lg bg-[#111827]/30 border-t border-b border-[rgba(255,255,255,0.1)] h-[50px] fixed z-50 ${
          pathName === "/Explore" ? "bg-black" : ""
        }`}
      >
        <div className="flex items-center justify-between w-full max-w-[1080px] px-4 md:px-6">
          {/* Logo Section */}
          <div className="flex items-center gap-[15px]">
            <LogoIconMain />
            <p
              className="text-[#B8CFCE] font-semibold text-[15px]"
              style={twkLausanneFont}
            >
              Freely
            </p>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <NavLink href="/">
              <span
                className={`text-[15px] text-[rgba(99,100,117)] hover:text-white`}
                style={twkLausanneFont}
              >
                Home
              </span>
            </NavLink>
            <NavLink href="/Explore">
              <span
                className={`text-[15px] text-[rgba(99,100,117)] hover:text-white`}
                style={twkLausanneFont}
              >
                Explore
              </span>
            </NavLink>
            <NavLink href="/bookings">
              <span
                className={`text-[15px] text-[rgba(99,100,117)] hover:text-white`}
                style={twkLausanneFont}
              >
                Bookings
              </span>
            </NavLink>

            {signedUser?.isAdmin == true ? (
              <NavLink href="/admin/dashboard">
                <span
                  className={`text-[15px] text-[rgba(99,100,117)] hover:text-white`}
                  style={twkLausanneFont}
                >
                  Admin Panel
                </span>
              </NavLink>
            ) : null}
          </div>

          {/* Desktop User Section */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <SignedIn>
                {isLoaded && user && (
                  <div
                    className="flex gap-4 items-center cursor-pointer"
                    onClick={() => {
                      const userButton = document.querySelector(
                        ".cl-userButtonTrigger"
                      );
                      if (userButton) (userButton as HTMLElement).click();
                    }}
                  >
                    <UserButton
                      appearance={{
                        elements: {
                          userButtonTrigger: { display: "none" },
                          popoverContent: {
                            transform: "translateX(-200px)",
                            marginTop: "8px",
                          },
                        },
                      }}
                    />
                    <Image
                      src={user.imageUrl || "/placeholder.svg"}
                      alt={user.username || user.firstName || "User"}
                      width={32}
                      height={32}
                      className="rounded-full"
                    />
                    <p
                      className="font-medium text-[#B8CFCE] hidden lg:block"
                      style={twkLausanneFont}
                    >
                      {user.username || user.firstName || "User"}
                    </p>
                    <ChevronDown className="size-[16px] text-[#B8CFCE]" />
                  </div>
                )}
              </SignedIn>
            ) : (
              <div className="flex items-center gap-[10px] hover:opacity-60 hover:cursor-pointer">
                <p
                  className={`text-[#B8CFCE] font-medium`}
                  style={twkLausanneFont}
                  onClick={() => {
                    router.push("/sign-in");
                  }}
                >
                  Try it free
                </p>
                <ArrowRight className="text-black bg-[#B8CFCE] rounded-full size-[14px]" />
              </div>
            )}
          </div>

          {/* Mobile Menu Button & User */}
          <div className="flex md:hidden items-center gap-3">
            {/* Mobile User Avatar */}
            {user && (
              <SignedIn>
                {isLoaded && user && (
                  <div
                    className="flex items-center cursor-pointer"
                    onClick={() => {
                      const userButton = document.querySelector(
                        ".cl-userButtonTrigger"
                      );
                      if (userButton) (userButton as HTMLElement).click();
                    }}
                  >
                    <UserButton
                      appearance={{
                        elements: {
                          userButtonTrigger: { display: "none" },
                          popoverContent: {
                            transform: "translateX(-150px)",
                            marginTop: "8px",
                          },
                        },
                      }}
                    />
                    <Image
                      src={user.imageUrl || "/placeholder.svg"}
                      alt={user.username || user.firstName || "User"}
                      width={28}
                      height={28}
                      className="rounded-full"
                    />
                  </div>
                )}
              </SignedIn>
            )}

            {/* Hamburger Menu Button */}
            <button
              onClick={toggleMobileMenu}
              className="text-[#B8CFCE] hover:text-white transition-colors p-1"
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? (
                <X className="size-6" />
              ) : (
                <Menu className="size-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={closeMobileMenu}
        />
      )}

      {/* Mobile Menu */}
      <div
        className={`fixed top-[50px] left-0 right-0 bg-[#111827]/95 backdrop-blur-lg border-b border-[rgba(255,255,255,0.1)] z-40 md:hidden transition-all duration-300 ease-in-out ${
          isMobileMenuOpen
            ? "opacity-100 translate-y-0"
            : "opacity-0 -translate-y-full pointer-events-none"
        }`}
      >
        <div className="px-4 py-6 space-y-4">
          {/* Mobile Navigation Links */}
          <div className="space-y-4">
            <NavLink href="/" onClick={closeMobileMenu}>
              <span
                className={`text-[16px] text-[rgba(99,100,117)] hover:text-white`}
                style={twkLausanneFont}
              >
                Home
              </span>
            </NavLink>
            <NavLink href="/Explore" onClick={closeMobileMenu}>
              <span
                className={`text-[16px] text-[rgba(99,100,117)] hover:text-white`}
                style={twkLausanneFont}
              >
                Explore
              </span>
            </NavLink>
            <NavLink href="/bookings" onClick={closeMobileMenu}>
              <span
                className={`text-[16px] text-[rgba(99,100,117)] hover:text-white`}
                style={twkLausanneFont}
              >
                Bookings
              </span>
            </NavLink>

            {signedUser?.isAdmin == false ? (
              <NavLink href="/admin/dashboard" onClick={closeMobileMenu}>
                <span
                  className={`text-[16px] text-[rgba(99,100,117)] hover:text-white`}
                  style={twkLausanneFont}
                >
                  Admin Panel
                </span>
              </NavLink>
            ) : null}
          </div>

          {/* Mobile User Section */}
          <div className="pt-4 border-t border-[rgba(255,255,255,0.1)]">
            {user ? (
              <SignedIn>
                {isLoaded && user && (
                  <div className="flex items-center gap-3 py-2">
                    <Image
                      src={user.imageUrl || "/placeholder.svg"}
                      alt={user.username || user.firstName || "User"}
                      width={32}
                      height={32}
                      className="rounded-full"
                    />
                    <p
                      className="font-medium text-[#B8CFCE]"
                      style={twkLausanneFont}
                    >
                      {user.username || user.firstName || "User"}
                    </p>
                  </div>
                )}
              </SignedIn>
            ) : (
              <div
                className="flex items-center gap-[10px] hover:opacity-60 hover:cursor-pointer py-2"
                onClick={() => {
                  router.push("/sign-in");
                  closeMobileMenu();
                }}
              >
                <p
                  className={`text-[#B8CFCE] font-medium`}
                  style={twkLausanneFont}
                >
                  Try it free
                </p>
                <ArrowRight className="text-black bg-[#B8CFCE] rounded-full size-[14px]" />
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
