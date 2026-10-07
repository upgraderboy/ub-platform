import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Memories - Cool Memories of Upgrader Boy in his Tech Journey',
  description:
    'Cool Memories of Upgrader Boy in his Tech Journey. Visual milestones, national hackathons, rooftop coding sessions, and tech community meetups.',
  openGraph: {
    title: 'Memories - Cool Memories of Upgrader Boy in his Tech Journey',
    description:
      'Cool Memories of Upgrader Boy in his Tech Journey. Visual milestones, national hackathons, rooftop coding sessions, and tech community meetups.',
    url: 'https://upgraderboy.com/memories',
  },
};

export default function MemoriesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
