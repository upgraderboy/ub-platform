import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Projects - All Projects developed by Upgrader Boy',
  description:
    'All Projects developed by Upgrader Boy. Enterprise full-stack software, cross-platform mobile apps, and scalable web architectures.',
  openGraph: {
    title: 'Projects - All Projects developed by Upgrader Boy',
    description:
      'All Projects developed by Upgrader Boy. Enterprise full-stack software, cross-platform mobile apps, and scalable web architectures.',
    url: 'https://upgraderboy.com/projects',
  },
};

export default function ProjectsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
