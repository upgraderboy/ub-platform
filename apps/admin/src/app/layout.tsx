import type { Metadata, Viewport } from "next";
import { Inter, Fira_Code, Poppins } from "next/font/google";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

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
  title: "UB Platform Admin Portal | Upgrader Boy",
  description: "Executive Content Management, Inquiries Inbox & System Control for Upgrader Boy Platform",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`dark ${inter.variable} ${poppins.variable} ${firaCode.variable}`}
    >
      <body className="min-h-screen bg-[#0B0F19] text-slate-100 antialiased selection:bg-[var(--accent-color)] selection:text-slate-900">
        {children}
      </body>
    </html>
  );
}
