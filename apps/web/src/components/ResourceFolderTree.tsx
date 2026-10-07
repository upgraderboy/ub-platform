'use client';

import React, { useState } from 'react';
import {
  Folder,
  FolderOpen,
  ChevronDown,
  ChevronRight,
  Layers,
  Sparkles,
} from 'lucide-react';
import type { ResourceCategory } from '@ub/types';
import { getAllCategoryDescendantIds } from '../data/categoryUtils';

interface ResourceFolderTreeProps {
  categories: ResourceCategory[];
  activeCategoryId: string;
  onSelectCategory: (categoryId: string) => void;
  documentCountsByCat: Record<string, number>;
}

interface TreeNodeProps {
  category: ResourceCategory;
  level: number;
  activeCategoryId: string;
  onSelectCategory: (categoryId: string) => void;
  documentCountsByCat: Record<string, number>;
  toggledFolders: Record<string, boolean>;
  onToggleFolder: (id: string, e: React.MouseEvent) => void;
}

function FolderTreeNode({
  category,
  level,
  activeCategoryId,
  onSelectCategory,
  documentCountsByCat,
  toggledFolders,
  onToggleFolder,
}: TreeNodeProps) {
  const hasChildren = !!(category.children && category.children.length > 0);
  const isSelected = activeCategoryId === category.id;

  // Check if any descendant is currently active
  const descendantIds = getAllCategoryDescendantIds(category);
  const isDescendantActive = descendantIds.includes(activeCategoryId) && !isSelected;

  // Open if explicitly toggled OR if a descendant is selected
  const isOpen =
    isDescendantActive ||
    (toggledFolders[category.id] !== undefined ? toggledFolders[category.id] : true);

  const docCount = documentCountsByCat[category.id] || 0;

  return (
    <div className="space-y-1">
      {/* Category / Subcategory Folder Row */}
      <div
        onClick={() => onSelectCategory(category.id)}
        className={`flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer group select-none ${
          isSelected
            ? 'bg-[var(--accent-color)] text-slate-950 font-bold shadow-sm ring-2 ring-[var(--accent-color)]/30'
            : isDescendantActive
            ? 'bg-[var(--accent-glow)]/20 text-[var(--accent-color)] border border-[var(--accent-color)]/30 font-semibold'
            : 'text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/60'
        }`}
        title={`${category.name} (${docCount} items)`}
      >
        <div className="flex items-center space-x-1.5 truncate pr-1">
          {hasChildren ? (
            <button
              onClick={(e) => onToggleFolder(category.id, e)}
              className="p-1 -ml-1 text-slate-400 hover:text-slate-900 dark:hover:text-white cursor-pointer shrink-0"
              title={isOpen ? 'Collapse subfolders' : 'Expand subfolders'}
            >
              {isOpen ? (
                <ChevronDown className="w-3.5 h-3.5" />
              ) : (
                <ChevronRight className="w-3.5 h-3.5" />
              )}
            </button>
          ) : (
            <span className="w-3.5 shrink-0" />
          )}

          {isOpen || isSelected ? (
            <FolderOpen
              className={`w-3.5 h-3.5 shrink-0 ${
                isSelected ? 'text-slate-950' : 'text-[var(--accent-color)]'
              }`}
            />
          ) : (
            <Folder
              className={`w-3.5 h-3.5 shrink-0 transition-colors ${
                isSelected
                  ? 'text-slate-950'
                  : 'text-slate-400 group-hover:text-[var(--accent-color)]'
              }`}
            />
          )}

          <span className="truncate">{category.name}</span>
        </div>

        <div className="flex items-center space-x-1.5 shrink-0 ml-1">
          {isSelected && (
            <span className="text-[8px] font-mono px-1 py-0.2 rounded bg-slate-950/20 text-slate-950 font-black">
              ACTIVE
            </span>
          )}
          <span
            className={`text-[10px] font-mono px-1.5 py-0.5 rounded-full ${
              isSelected
                ? 'bg-slate-950/20 text-slate-950 font-bold'
                : 'bg-slate-100 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400'
            }`}
          >
            {docCount}
          </span>
        </div>
      </div>

      {/* Recursive Children Subfolders (Supports Infinite Arbitrary Depth) */}
      {hasChildren && isOpen && (
        <div className="ml-3.5 pl-2 border-l-2 border-slate-200 dark:border-slate-800 space-y-1">
          {category.children!.map((child) => (
            <FolderTreeNode
              key={child.id}
              category={child}
              level={level + 1}
              activeCategoryId={activeCategoryId}
              onSelectCategory={onSelectCategory}
              documentCountsByCat={documentCountsByCat}
              toggledFolders={toggledFolders}
              onToggleFolder={onToggleFolder}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function ResourceFolderTree({
  categories,
  activeCategoryId,
  onSelectCategory,
  documentCountsByCat,
}: ResourceFolderTreeProps) {
  const [toggledFolders, setToggledFolders] = useState<Record<string, boolean>>({});

  const toggleFolder = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setToggledFolders((prev) => {
      const currentVal = prev[id] !== undefined ? prev[id] : true;
      return {
        ...prev,
        [id]: !currentVal,
      };
    });
  };

  const totalDocuments = Object.values(documentCountsByCat).reduce(
    (acc, c) => acc + c,
    0
  );

  return (
    <nav
      aria-label="Study materials directory"
      className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-[#131C31] border border-slate-200 dark:border-slate-800 shadow-md space-y-4"
    >
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center space-x-2">
          <Layers className="w-4 h-4 text-[var(--accent-color)]" />
          <h3 className="font-heading font-black text-xs uppercase tracking-wider text-slate-900 dark:text-white">
            Knowledge Directory
          </h3>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800/80 text-slate-400">
          Folder Tree
        </span>
      </div>

      <div className="space-y-1.5">
        {/* Root "All Resources" Option */}
        <button
          onClick={() => onSelectCategory('all')}
          className={`w-full flex items-center justify-between px-3 py-2 rounded-2xl text-xs font-semibold transition-all cursor-pointer ${
            activeCategoryId === 'all'
              ? 'bg-[var(--accent-color)] text-slate-950 font-bold shadow-sm ring-2 ring-[var(--accent-color)]/30'
              : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80'
          }`}
        >
          <div className="flex items-center space-x-2.5">
            <Sparkles className="w-4 h-4 text-inherit" />
            <span>All Knowledge (Root Drive)</span>
          </div>
          <span
            className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${
              activeCategoryId === 'all'
                ? 'bg-slate-950/20 text-slate-950 border-slate-950/30 font-bold'
                : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
            }`}
          >
            {totalDocuments}
          </span>
        </button>

        {/* Root Node Categories - Recursive Rendering */}
        {categories.map((cat) => (
          <FolderTreeNode
            key={cat.id}
            category={cat}
            level={0}
            activeCategoryId={activeCategoryId}
            onSelectCategory={onSelectCategory}
            documentCountsByCat={documentCountsByCat}
            toggledFolders={toggledFolders}
            onToggleFolder={toggleFolder}
          />
        ))}
      </div>
    </nav>
  );
}
