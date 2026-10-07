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
  metadataBase: new URL('https://upgraderboy.com'),
  title: {
    default: 'Upgrader Boy - Portfolio, Blogs, Projects',
    template: '%s | Upgrader Boy',
  },
  description:
    'Tech. That Makes Trends | Enterprise-grade full-stack software development specializing in MERN, Next.js 15, and cloud DevOps, driving India\'s Learn in Public community movement. Founded by Ankit Bhuria in Jhunjhunu, Rajasthan.',
  keywords: [
    'Upgrader Boy',
    'Ankit Bhuria',
    'Full-Stack Developer',
    'MERN Stack',
    'Next.js 15',
    'Software Agency',
    'Learn in Public',
    'Jhunjhunu',
    'Rajasthan',
  ],
  authors: [{ name: 'Ankit Bhuria', url: 'https://upgraderboy.com' }],
  openGraph: {
    title: 'Upgrader Boy - Portfolio, Blogs, Projects',
    description: 'Tech. That Makes Trends | Enterprise-grade full-stack software development, developer portfolio, technical blogs, and learning hub.',
    url: 'https://upgraderboy.com',
    siteName: 'Upgrader Boy',
    locale: 'en_US',
    type: 'website',
  },
};

import Script from 'next/script';
import { CommandPalette } from '../components/CommandPalette';

// 1. Google Sitelinks Searchbox Structured Data
const sitelinksSearchboxJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Upgrader Boy',
  alternateName: [
    'Upgrader Boy - Portfolio, Blogs, Projects',
    'UB Platform',
    'UpgraderBoy',
  ],
  url: 'https://upgraderboy.com',
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: 'https://upgraderboy.com/projects?q={search_term_string}',
    },
    'query-input': 'required name=search_term_string',
  },
};

// 2. Google Sitelinks & Sub-Routes Structured Data
const sitelinksNavigationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  itemListElement: [
    {
      '@type': 'SiteNavigationElement',
      position: 1,
      name: 'Blogs',
      description: 'All Tech Blogs from Upgrader Boy',
      url: 'https://upgraderboy.com/blogs',
    },
    {
      '@type': 'SiteNavigationElement',
      position: 2,
      name: 'Projects',
      description: 'All Projects developed by Upgrader Boy',
      url: 'https://upgraderboy.com/projects',
    },
    {
      '@type': 'SiteNavigationElement',
      position: 3,
      name: 'Memories',
      description: 'Cool Memories of Upgrader Boy in his Tech Journey',
      url: 'https://upgraderboy.com/memories',
    },
    {
      '@type': 'SiteNavigationElement',
      position: 4,
      name: 'Resources',
      description: 'All Tech Resources by Upgrader Boy',
      url: 'https://upgraderboy.com/resources',
    },
    {
      '@type': 'SiteNavigationElement',
      position: 5,
      name: 'Services',
      description: 'Enterprise full-stack engineering, mobile apps, and cloud architecture',
      url: 'https://upgraderboy.com/services',
    },
    {
      '@type': 'SiteNavigationElement',
      position: 6,
      name: 'Contact & Consultation',
      description: 'Schedule a strategic architecture call or calculate milestone project budgets',
      url: 'https://upgraderboy.com/contact',
    },
  ],
};

// 3. Organization & Local Agency Structured Data
const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Upgrader Boy',
  url: 'https://upgraderboy.com',
  logo: 'https://upgraderboy.com/favicon.ico',
  description: 'Enterprise-grade full-stack software development agency led by Ankit Bhuria.',
  founder: {
    '@type': 'Person',
    name: 'Ankit Bhuria',
    jobTitle: 'Founder & Principal Architect',
    sameAs: [
      'https://github.com/upgraderboy',
      'https://linkedin.com/in/upgraderboy',
      'https://youtube.com/@upgraderboy',
    ],
  },
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Near Toll Tax, Sikar Road',
    addressLocality: 'Jhunjhunu',
    addressRegion: 'Rajasthan',
    postalCode: '333001',
    addressCountry: 'IN',
  },
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '+91-91662-71496',
    contactType: 'customer service',
    email: 'ankit@upgraderboy.com',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`scroll-smooth ${inter.variable} ${poppins.variable} ${firaCode.variable}`}
    >
      <head>
        {/* Google Sitelinks Searchbox JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(sitelinksSearchboxJsonLd),
          }}
        />
        {/* Google Sitelinks Navigation List JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(sitelinksNavigationJsonLd),
          }}
        />
        {/* Organization & Agency JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationJsonLd),
          }}
        />
        <Script
          id="theme-initializer"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('ub-theme-mode');
                  var isDark = theme ? (theme === 'dark') : true;
                  if (isDark) {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                  var color = localStorage.getItem('ub-accent-color');
                  var glow = localStorage.getItem('ub-accent-glow');
                  var border = localStorage.getItem('ub-accent-border');
                  if (color) {
                    document.documentElement.style.setProperty('--accent-color', color);
                  }
                  if (glow) {
                    document.documentElement.style.setProperty('--accent-glow', glow);
                  }
                  if (border) {
                    document.documentElement.style.setProperty('--accent-border', border);
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col font-sans bg-slate-50 dark:bg-[#0B0F19] text-slate-800 dark:text-slate-100 antialiased selection:bg-[var(--accent-color)] selection:text-slate-900">
        <CommandPalette />
        {children}
      </body>
    </html>
  );
}
