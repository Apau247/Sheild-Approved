import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { Toaster } from "react-hot-toast";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
  metadataBase: new URL("https://sheild-approved.vercel.app"),
  title: {
    default: "Iron Vault Security – Fortified Storage for Gold, Gems & Legacy",
    template: "%s | Iron Vault Security",
  },
  description:
    "Iron Vault Security provides elite, high-security vault storage for precious minerals, gold, diamonds, and fine jewelry in London's financial district.",
  keywords: [
    "vault storage London",
    "gold storage",
    "diamond storage",
    "precious metals vault",
    "secure storage UK",
    "private vault",
    "asset protection",
    "LBMA compliant storage",
  ],
  authors: [{ name: "Iron Vault Security" }],
  openGraph: {
    title: "Iron Vault Security – Fortified Storage for Gold, Gems & Legacy",
    description:
      "Premier vault storage specialising in secure storage of precious minerals, gold, diamonds, fine jewelry, and high-value assets in London.",
    type: "website",
    url: "https://shield-approved",
    siteName: "Iron Vault Security",
    images: [
      {
        url: "/images/hero1.avif",
        width: 1200,
        height: 630,
        alt: "Iron Vault Security – London Vault Facility",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Iron Vault Security",
    description:
      "Elite high-security vault storage for precious minerals, gold, and diamonds in London.",
    images: ["/images/hero1.avif"],
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: "/images/logo.png",
    apple: "/images/logo.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="bg-vault-900 text-white antialiased">
        <AuthProvider>
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: "#1a1a1a",
                color: "#f0ede6",
                border: "1px solid rgba(212,175,55,0.3)",
                borderRadius: "4px",
                fontSize: "14px",
              },
              success: {
                iconTheme: {
                  primary: "#d4af37",
                  secondary: "#0a0a0a",
                },
              },
              error: {
                iconTheme: {
                  primary: "#ef4444",
                  secondary: "#0a0a0a",
                },
              },
            }}
          />
          <Navbar />
          <main>{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
