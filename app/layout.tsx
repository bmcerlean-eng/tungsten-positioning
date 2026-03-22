import type { Metadata } from "next";
import "./globals.css";
import NavHeader from "@/components/nav-header";

export const metadata: Metadata = {
  title: "Tungsten AI Positioning",
  description: "AI-powered sales positioning for Tungsten Automation",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className="flex flex-col h-screen overflow-hidden bg-white">
        <NavHeader />
        <main className="flex-1 min-h-0 overflow-hidden">{children}</main>
      </body>
    </html>
  );
}
