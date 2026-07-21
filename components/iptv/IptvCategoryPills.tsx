"use client";

import React, { memo } from "react";

interface IptvCategoryPillsProps {
  categories: string[];
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
  totalChannelsCount: number;
}

export const IptvCategoryPills: React.FC<IptvCategoryPillsProps> = memo(
  ({ categories, selectedCategory, onSelectCategory, totalChannelsCount }) => {
    if (!categories || categories.length === 0) return null;

    return (
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
        <button
          onClick={() => onSelectCategory("all")}
          className={`px-3 py-1 rounded-md text-xs font-mono whitespace-nowrap transition-colors ${
            selectedCategory === "all"
              ? "bg-white text-black font-bold"
              : "bg-[#18181B] text-[#A1A1AA] hover:bg-[#27272A] hover:text-white"
          }`}
        >
          All Categories ({totalChannelsCount})
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => onSelectCategory(cat)}
            className={`px-3 py-1 rounded-md text-xs font-mono whitespace-nowrap transition-colors ${
              selectedCategory === cat
                ? "bg-white text-black font-bold"
                : "bg-[#18181B] text-[#A1A1AA] hover:bg-[#27272A] hover:text-white"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>
    );
  }
);

IptvCategoryPills.displayName = "IptvCategoryPills";
