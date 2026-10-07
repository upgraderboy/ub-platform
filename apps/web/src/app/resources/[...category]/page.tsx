import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ResourcesView } from '../../../components/ResourcesView';
import { RESOURCE_CATEGORIES } from '../../../data/resourcesData';

interface CategoryPageProps {
  params: Promise<{
    category: string[];
  }>;
}

// Generate static routes for all category permalinks
export async function generateStaticParams() {
  const paths: { category: string[] }[] = [];

  RESOURCE_CATEGORIES.forEach((cat) => {
    paths.push({ category: [cat.slug] });
    if (cat.children) {
      cat.children.forEach((child) => {
        paths.push({ category: [cat.slug, child.slug] });
      });
    }
  });

  return paths;
}

function resolveCategoryId(slugs: string[]): { id: string; name: string } | null {
  if (slugs.length === 1) {
    const parent = RESOURCE_CATEGORIES.find((c) => c.slug === slugs[0]);
    if (parent) return { id: parent.id, name: parent.name };
  } else if (slugs.length === 2) {
    const parent = RESOURCE_CATEGORIES.find((c) => c.slug === slugs[0]);
    if (parent && parent.children) {
      const child = parent.children.find((c) => c.slug === slugs[1]);
      if (child) return { id: child.id, name: child.name };
    }
  }
  return null;
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { category } = await params;
  const match = resolveCategoryId(category);

  if (!match) {
    return {
      title: 'Study Materials | Upgrader Boy',
    };
  }

  return {
    title: `${match.name} Study Materials & Playbooks | Upgrader Boy`,
    description: `Handcrafted engineering notes and architecture playbooks for ${match.name}. Free and open access.`,
  };
}

export default async function CategoryResourcesPage({ params }: CategoryPageProps) {
  const { category } = await params;
  const match = resolveCategoryId(category);

  if (!match) {
    notFound();
  }

  return <ResourcesView initialCategoryId={match.id} initialSlugPath={category} />;
}
