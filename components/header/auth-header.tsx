"use client";

import Link from "next/link";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

export default function AuthHeader() {
  return (
    <div className="flex items-center gap-2">
      <SignedOut>
        <Link
          href="/sign-in"
          className="px-3 py-1.5 text-[13px] font-medium text-[#605A57] hover:text-[#37322F] transition-colors font-sans rounded-full hover:bg-[rgba(55,50,47,0.04)]"
        >
          Sign In
        </Link>
        <Link
          href="/sign-up"
          className="px-4 py-1.5 text-[13px] font-medium bg-[oklch(0.6_0.2_45)] text-white rounded-full hover:opacity-90 transition-opacity font-sans"
        >
          Sign Up
        </Link>
      </SignedOut>
      <SignedIn>
        <Link
          href="/dashboard"
          className="px-3 py-1.5 text-[13px] font-medium text-[#605A57] hover:text-[#37322F] transition-colors font-sans rounded-full hover:bg-[rgba(55,50,47,0.04)]"
        >
          Dashboard
        </Link>
        <UserButton
          appearance={{
            elements: {
              avatarBox: "w-8 h-8",
              userButtonPopoverCard: "shadow-lg",
            },
          }}
          afterSignOutUrl="/"
        />
      </SignedIn>
    </div>
  );
}
