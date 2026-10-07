import type { ResourceCategory } from '@ub/types';

/**
 * Recursively finds a category by its ID at any nesting depth.
 */
export function findCategoryById(
  categories: ResourceCategory[],
  targetId: string
): ResourceCategory | null {
  for (const cat of categories) {
    if (cat.id === targetId) return cat;
    if (cat.children && cat.children.length > 0) {
      const found = findCategoryById(cat.children, targetId);
      if (found) return found;
    }
  }
  return null;
}

/**
 * Recursively resolves the full ancestor breadcrumb path from the root down to the target category.
 * e.g., [Level 1, Level 2, Level 3, TargetCategory]
 */
export function getCategoryBreadcrumbPath(
  categories: ResourceCategory[],
  targetId: string,
  currentPath: ResourceCategory[] = []
): ResourceCategory[] | null {
  for (const cat of categories) {
    const newPath = [...currentPath, cat];
    if (cat.id === targetId) {
      return newPath;
    }
    if (cat.children && cat.children.length > 0) {
      const foundPath = getCategoryBreadcrumbPath(cat.children, targetId, newPath);
      if (foundPath) return foundPath;
    }
  }
  return null;
}

/**
 * Recursively collects the ID of the given category and all its descendant IDs.
 */
export function getAllCategoryDescendantIds(category: ResourceCategory): string[] {
  const ids: string[] = [category.id];
  if (category.children && category.children.length > 0) {
    for (const child of category.children) {
      ids.push(...getAllCategoryDescendantIds(child));
    }
  }
  return ids;
}

/**
 * Computes recursive document counts for all categories across arbitrary depths.
 * Every parent folder count accurately reflects all items in its nested directories.
 */
export function computeRecursiveCategoryCounts(
  categories: ResourceCategory[],
  directCounts: Record<string, number>
): Record<string, number> {
  const result: Record<string, number> = {};

  function countCategory(cat: ResourceCategory): number {
    let total = directCounts[cat.id] || 0;
    if (cat.children && cat.children.length > 0) {
      for (const child of cat.children) {
        total += countCategory(child);
      }
    }
    result[cat.id] = total;
    return total;
  }

  for (const cat of categories) {
    countCategory(cat);
  }

  return result;
}
