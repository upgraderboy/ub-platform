import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Resources - All Tech Resources by Upgrader Boy',
  description:
    'All Tech Resources by Upgrader Boy. Curated study materials, computer science playbooks, DSA sheets, and full-stack architecture notes.',
  openGraph: {
    title: 'Resources - All Tech Resources by Upgrader Boy',
    description:
      'All Tech Resources by Upgrader Boy. Curated study materials, computer science playbooks, DSA sheets, and full-stack architecture notes.',
    url: 'https://upgraderboy.com/resources',
  },
};

export default function ResourcesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
