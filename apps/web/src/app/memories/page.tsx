import React from 'react';
import type { Metadata } from 'next';
import { MemoriesView } from '../../components/MemoriesView';
import { MEMORIES_DATA } from '../../data/memoriesData';

export const metadata: Metadata = {
  title: 'The Developer Odyssey: Visual Memories & Time Capsule | Upgrader Boy',
  description:
    'Experience the journey from 36-hour Smart India Hackathon 2024 national podiums to midnight engineering sprints, developer community keynotes, and founder milestones.',
  openGraph: {
    title: 'The Developer Odyssey: Visual Memories & Time Capsule | Upgrader Boy',
    description:
      'Experience the journey from 36-hour Smart India Hackathon 2024 national podiums to midnight engineering sprints and community keynotes.',
    type: 'website',
  },
};

export default function MemoriesPage() {
  return <MemoriesView initialMemories={MEMORIES_DATA} />;
}
