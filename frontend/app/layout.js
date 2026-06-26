import "./globals.css";

export const metadata = {
  title: "Lesson Planner",
  description: "AI-powered lesson planner for Zambian secondary school mathematics teachers",
  manifest: "/manifest.json",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}