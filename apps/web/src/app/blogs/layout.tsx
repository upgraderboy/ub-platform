import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Blogs - All Tech Blogs from Upgrader Boy',
  description:
    'All Tech Blogs from Upgrader Boy. Deep dives into Next.js 15, system architecture, cloud DevOps, and AI intelligence pipelines.',
  openGraph: {
    title: 'Blogs - All Tech Blogs from Upgrader Boy',
    description:
      'All Tech Blogs from Upgrader Boy. Deep dives into Next.js 15, system architecture, cloud DevOps, and AI intelligence pipelines.',
    url: 'https://upgraderboy.com/blogs',
  },
};

export default function BlogsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
