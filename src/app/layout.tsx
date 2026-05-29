import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MindBridge — Your Mind Deserves a Softer Place to Land",
  description:
    "AI-powered emotional wellness platform. Calm down, understand your emotions, reframe difficult thoughts, and talk to a gentle AI companion whenever things feel heavy.",
  keywords: [
    "mental health",
    "emotional wellness",
    "AI companion",
    "breathing exercises",
    "mindfulness",
    "anxiety support",
    "thought reframing",
    "CBT",
    "student mental health",
  ],
  authors: [{ name: "MindBridge" }],
  openGraph: {
    title: "MindBridge — AI Emotional Wellness Platform",
    description:
      "Your mind deserves a softer place to land. AI-powered support for anxiety, stress, and emotional wellbeing.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#071013",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased">{children}</body>
    </html>
  );
}
