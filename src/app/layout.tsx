import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SmartCity Admin",
  description: "Admin and User Dashboard",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased bg-gray-100 text-gray-900">
        {children}
      </body>
    </html>
  );
}
