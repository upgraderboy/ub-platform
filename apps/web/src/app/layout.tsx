import type { Metadata } from "next";
import { Inter, Fira_Code, Poppins } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800", "900"],
});

const firaCode = Fira_Code({
  variable: "--font-fira-code",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "Upgrader Boy | Full-Stack Software Agency & Developer Brand",
  description:
    "Enterprise-grade full-stack software development specializing in MERN, Next.js 15, and cloud DevOps, driving India's Learn in Public community movement. Founded by Ankit Bhuria in Jhunjhunu, Rajasthan.",
  keywords: [
    "Upgrader Boy",
    "Ankit Bhuria",
    "Full-Stack Developer",
    "MERN Stack",
    "Next.js 15",
    "Software Agency",
    "Learn in Public",
    "Jhunjhunu",
    "Rajasthan",
  ],
  authors: [{ name: "Ankit Bhuria", url: "https://upgraderboy.com" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`dark scroll-smooth ${inter.variable} ${poppins.variable} ${firaCode.variable}`}
    >
      <body className="min-h-full flex flex-col font-sans bg-slate-50 dark:bg-[#0B0F19] text-slate-800 dark:text-slate-100 antialiased selection:bg-[#00FF1E] selection:text-[#0B0F19]">
        {children}
      </body>
    </html>
  );
}
