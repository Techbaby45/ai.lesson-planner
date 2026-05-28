import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Lesson Planner",
  description: "AI-powered lesson planner for Zambian secondary school mathematics teachers",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}