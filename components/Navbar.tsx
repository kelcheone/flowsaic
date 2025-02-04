// components/Navbar.tsx
import Link from "next/link";
import { ModeToggle } from "./ToggleTheme";

export function Navbar() {
  return (
    <nav className="border-b bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold">
              Your App
            </Link>
            <div className="hidden md:block ml-10">
              <div className="flex items-center space-x-4">
                <Link
                  href="/dashboard"
                  className="text-foreground/60 hover:text-foreground"
                >
                  Dashboard
                </Link>
                <Link
                  href="/studio"
                  className="text-foreground/60 hover:text-foreground"
                >
                  Studio
                </Link>
              </div>
            </div>
          </div>
          <div className="flex items-center">
            <ModeToggle />
          </div>
        </div>
      </div>
    </nav>
  );
}
