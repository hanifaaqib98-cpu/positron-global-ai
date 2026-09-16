import React from 'react';
import { EcosystemEntry } from '../types';
import { GLOBAL_2026_CATALOG, getAllCapabilities, getAllCategories } from '../data/catalogData';
import { Search, ExternalLink, Globe, Tag, Filter, ShieldCheck } from 'lucide-react';

interface EcosystemSweepViewProps {
  searchQuery: string;
  onSearchQueryChange: (query: string) => void;
  selectedCategory: string;
  onSelectedCategoryChange: (category: string) => void;
  selectedCapability: string;
  onSelectedCapabilityChange: (capability: string) => void;
}

export const EcosystemSweepView: React.FC<EcosystemSweepViewProps> = ({
  searchQuery,
  onSearchQueryChange,
  selectedCategory,
  onSelectedCategoryChange,
  selectedCapability,
  onSelectedCapabilityChange
}) => {
  const categories = ['ALL', ...getAllCategories()];
  const capabilities = ['ALL', ...getAllCapabilities()];

  const filteredEntries = GLOBAL_2026_CATALOG.filter((item) => {
    const matchesSearch =
      searchQuery === '' ||
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.capabilities.some((c) => c.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory = selectedCategory === 'ALL' || item.category === selectedCategory;
    const matchesCapability =
      selectedCapability === 'ALL' || item.capabilities.includes(selectedCapability);

    return matchesSearch && matchesCategory && matchesCapability;
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <Globe className="w-5 h-5 text-sky-400" />
              <h2 className="text-lg font-mono font-bold text-slate-100">
                2026 Global AI Ecosystem Sweep
              </h2>
            </div>
            <p className="text-xs text-slate-400 font-mono mt-1">
              Reconciled reference catalog of frontier AI agent frameworks, MCP protocols, coding engines, and AGI alignment architectures.
            </p>
          </div>

          <div className="flex items-center space-x-3 text-xs font-mono">
            <div className="bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800 text-sky-400 font-bold">
              {filteredEntries.length} / {GLOBAL_2026_CATALOG.length} AGENTS LOADED
            </div>
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div className="mt-5 pt-4 border-t border-slate-800/80 grid grid-cols-1 md:grid-cols-3 gap-3 font-mono text-xs">
          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchQueryChange(e.target.value)}
              placeholder="Search agent framework, MCP, capabilities..."
              className="w-full bg-slate-950 border border-slate-700 text-slate-100 rounded-lg pl-9 pr-3 py-2.5 focus:border-sky-500 focus:outline-none"
            />
          </div>

          {/* Category Filter */}
          <div>
            <select
              value={selectedCategory}
              onChange={(e) => onSelectedCategoryChange(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 text-slate-100 rounded-lg px-3 py-2.5 focus:border-sky-500 focus:outline-none"
            >
              <option value="ALL">ALL CATEGORIES ({categories.length - 1})</option>
              {categories.slice(1).map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Capability Filter */}
          <div>
            <select
              value={selectedCapability}
              onChange={(e) => onSelectedCapabilityChange(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 text-slate-100 rounded-lg px-3 py-2.5 focus:border-sky-500 focus:outline-none"
            >
              <option value="ALL">ALL CAPABILITIES ({capabilities.length - 1})</option>
              {capabilities.slice(1).map((cap) => (
                <option key={cap} value={cap}>
                  {cap}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Catalog Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredEntries.length === 0 ? (
          <div className="col-span-full py-16 text-center font-mono text-xs text-slate-500 bg-slate-900 border border-dashed border-slate-800 rounded-xl">
            No ecosystem items match your current search and filter criteria.
          </div>
        ) : (
          filteredEntries.map((item) => (
            <div
              key={item.id}
              className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl p-5 flex flex-col justify-between transition-all hover:shadow-lg hover:shadow-sky-500/5 group"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="font-mono font-bold text-slate-100 text-sm group-hover:text-sky-400 transition-colors">
                    {item.name}
                  </h3>
                  <span className="px-2 py-0.5 text-[10px] font-mono font-semibold bg-sky-950/80 text-sky-400 border border-sky-800/40 rounded shrink-0">
                    {item.category}
                  </span>
                </div>

                <p className="text-xs text-slate-300 font-sans leading-relaxed mb-4">
                  {item.summary}
                </p>
              </div>

              <div>
                {/* Capability Tags */}
                <div className="flex flex-wrap gap-1 mb-3">
                  {item.capabilities.map((cap) => (
                    <span
                      key={cap}
                      className="px-2 py-0.5 text-[10px] font-mono bg-slate-950 text-slate-400 border border-slate-800 rounded hover:text-sky-300 cursor-pointer"
                      onClick={() => onSelectedCapabilityChange(cap)}
                    >
                      #{cap}
                    </span>
                  ))}
                </div>

                {item.url && (
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-1 text-xs font-mono text-sky-400 hover:text-sky-300 transition-colors"
                  >
                    <span>Visit Reference Platform</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
