import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/navbar";

export const metadata: Metadata = {
  title: "CareerPilot AI - Resume Intelligence & Career Roadmap Platform",
  description: "Transform your resume into a personalized career intelligence roadmap. Scan for ATS compatibility, analyze skills gap, and prepare for interviews using Gemini AI.",
  keywords: ["resume analyzer", "ATS scanner", "career roadmap", "interview preparation", "skills assessment", "Google Gemini"],
  authors: [{ name: "CareerPilot Team" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className="font-sans antialiased min-h-screen text-foreground relative"
      >
        {/* Animated Aurora Background */}
        <div className="aurora-bg">
          <div className="aurora-glow-1"></div>
          <div className="aurora-glow-2"></div>
          <div className="aurora-glow-3"></div>
        </div>
        
        {/* Main Content */}
        <div className="relative z-10 flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-grow">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
