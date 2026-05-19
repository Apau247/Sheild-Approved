"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";
import { Menu, ShieldCheck, LogIn, User, LogOut } from "lucide-react";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/request-access", label: "Request Access" },
];

export default function Navbar() {
  const pathname = usePathname();
  const { user, logout, isLoading } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-vault-950/70 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="group flex items-center gap-3 rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-vault-gold"
            aria-label="Iron Vault Security Home"
            onClick={() => setMobileOpen(false)}
          >
            <div className="relative h-10 w-10 overflow-hidden rounded-full border border-vault-gold/40 bg-vault-900">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/logo.png"
                alt="Iron Vault Security logo"
                className="h-full w-full object-cover"
              />
            </div>
            <div className="hidden sm:block">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold tracking-wide text-vault-gold">
                  IRON VAULT SECURITY
                </span>
                <span className="inline-flex items-center gap-1 rounded-full border border-vault-gold/40 bg-vault-900/40 px-2 py-0.5 text-[11px] text-white/80">
                  <ShieldCheck className="h-3.5 w-3.5 text-vault-gold" />
                  shield-approved
                </span>
              </div>
              <div className="text-xs text-white/60">
                Fortified storage for gold, gems & legacy
              </div>
            </div>
          </Link>
        </div>

        <nav className="hidden items-center gap-7 md:flex" aria-label="Primary navigation">
          {navLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={[
                "text-sm transition-colors",
                pathname === l.href
                  ? "text-vault-gold"
                  : "text-white/70 hover:text-white",
              ].join(" ")}
            >
              {l.label}
            </Link>
          ))}
          {user && (
            <Link
              href="/portal"
              className={[
                "text-sm transition-colors",
                pathname === "/portal" ? "text-vault-gold" : "text-white/70 hover:text-white",
              ].join(" ")}
            >
              Portal
            </Link>
          )}
        </nav>

        <div className="flex items-center gap-2">
          <div className="hidden md:flex items-center gap-3">
            {!isLoading && !user ? (
              <>
                <Link
                  href="/login"
                  className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/80 hover:bg-white/10 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-vault-gold"
                >
                  <LogIn className="h-4 w-4 text-vault-gold" />
                  Login
                </Link>
                <Link
                  href="/signup"
                  className="inline-flex items-center gap-2 rounded-lg border border-vault-gold/30 bg-vault-gold/10 px-3 py-2 text-sm text-vault-gold hover:bg-vault-gold/15 focus:outline-none focus-visible:ring-2 focus-visible:ring-vault-gold"
                >
                  <User className="h-4 w-4" />
                  Sign up
                </Link>
              </>
            ) : (
              <button
                type="button"
                onClick={() => logout()}
                className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/80 hover:bg-white/10 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-vault-gold"
              >
                <LogOut className="h-4 w-4 text-vault-gold" />
                Logout
              </button>
            )}
          </div>

          <button
            type="button"
            className="inline-flex md:hidden items-center justify-center rounded-lg border border-white/10 bg-white/5 p-2 text-white/80 hover:bg-white/10 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-vault-gold"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((v: boolean) => !v)}
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-white/10 bg-vault-950/85 backdrop-blur">
          <div className="mx-auto max-w-7xl px-4 py-3">
            <div className="flex flex-col gap-2">
              {navLinks.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={() => setMobileOpen(false)}
                  className={[
                    "rounded-lg px-3 py-2 text-sm border border-transparent transition-colors",
                    pathname === l.href
                      ? "border-vault-gold/30 bg-vault-gold/10 text-vault-gold"
                      : "text-white/70 hover:border-white/10 hover:bg-white/5 hover:text-white",
                  ].join(" ")}
                >
                  {l.label}
                </Link>
              ))}

              {user && (
                <Link
                  href="/portal"
                  onClick={() => setMobileOpen(false)}
                  className={[
                    "rounded-lg px-3 py-2 text-sm border border-transparent transition-colors",
                    pathname === "/portal"
                      ? "border-vault-gold/30 bg-vault-gold/10 text-vault-gold"
                      : "text-white/70 hover:border-white/10 hover:bg-white/5 hover:text-white",
                  ].join(" ")}
                >
                  Portal
                </Link>
              )}

            </div>

            <div className="mt-4 flex flex-col gap-2">
              {!isLoading && !user ? (
                <>
                  <Link
                    href="/login"
                    onClick={() => setMobileOpen(false)}
                    className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/80 hover:bg-white/10 hover:text-white"
                  >
                    Login
                  </Link>
                  <Link
                    href="/signup"
                    onClick={() => setMobileOpen(false)}
                    className="rounded-lg border border-vault-gold/30 bg-vault-gold/10 px-3 py-2 text-sm text-vault-gold hover:bg-vault-gold/15"
                  >
                    Sign up
                  </Link>
                </>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    logout();
                    setMobileOpen(false);
                  }}
                  className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/80 hover:bg-white/10 hover:text-white"
                >
                  Logout
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
