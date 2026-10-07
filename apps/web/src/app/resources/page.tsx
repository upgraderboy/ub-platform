import React from 'react';
import type { Metadata } from 'next';
import { ResourcesView } from '../../components/ResourcesView';

export const metadata: Metadata = {
  title: 'Engineering Study Materials & Playbooks | Upgrader Boy',
  description:
    'Handcrafted computer science visual notes, SIH 2024 national winning blueprints, distributed systems architectures, and production readiness checklists.',
};

export default function ResourcesPage() {
  return <ResourcesView initialCategoryId="all" />;
}
