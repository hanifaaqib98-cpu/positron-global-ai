import React, { useState, useMemo } from 'react';
import { Globe, Search, ExternalLink, Filter, Layers, CheckCircle, Info, X } from 'lucide-react';
import { EcosystemEntry } from '../types/positron';

interface Props {
  entries: EcosystemEntry[];
  capabilities: string[];
}

export const EcosystemSweep: React.FC<Props> = ({ entries, capabilities }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedCapability, setSelectedCapability] = useState<string>('All');
  const [inspectingItem, setInspectingItem] = useState<EcosystemEntry | null>(null);

  const categories = useMemo(() => {
    const set = new Set<string>();
    entries.forEach((e) => set.add(e.category));
    return ['All', ...Array.from(set)];
  }, [entries]);

  const filteredEntries = useMemo(() => {
    return entries.filter((e) => {
      const matchSearch =
        searchTerm === '' ||
        e.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        e.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
        e.capabilities.some((c) => c.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchCategory = selectedCategory === 'All' || e.category === selectedCategory;
      const matchCap = selectedCapability === 'All' || e.capabilities.includes(selectedCapability);

      return matchSearch && matchCategory && matchCap;
    });
  }, [entries, searchTerm, selectedCategory, selectedCapability]);

  return (
    <div id="ecosystem-sweep" className="space-y-6">
      {/* Overview Banner */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <Globe className="w-5 h-5 text-sky-400" />
              <h2 className="text-base font-semibold text-slate-100">
                Positron Global AI Ecosystem Sweep (2026 Architecture Reference)
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
              Consolidated sweep of 70+ state-of-the-art agent frameworks, autonomous coding environments,
              protocols (MCP, A2A), memory engines, and physical AI systems integrated as modular capability patterns.
            </p>
          </div>

          <div className="flex items-center space-x-4 bg-slate-950/80 px-4 py-2 rounded-lg border border-slate-800 text-xs font-mono">
            <div>
              <span className="text-slate-500 block">CATALOGED</span>
              <span className="text-emerald-400 font-bold text-sm">{entries.length} Entries</span>
            </div>
            <div className="h-6 w-px bg-slate-800" />
            <div>
              <span className="text-slate-500 block">CAPABILITIES</span>
              <span className="text-sky-400 font-bold text-sm">{capabilities.length} Distinct</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 shadow-lg space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search by system name, protocol, capability (e.g., 'mcp', 'muse', 'memory')..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-9 pr-4 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-sky-500"
            />
          </div>

          <div className="flex gap-2">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-slate-950 border border-slate-700 text-xs text-slate-200 rounded-lg px-3 py-2 focus:outline-none"
            >
              {categories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>

            <select
              value={selectedCapability}
              onChange={(e) => setSelectedCapability(e.target.value)}
              className="bg-slate-950 border border-slate-700 text-xs text-slate-200 rounded-lg px-3 py-2 focus:outline-none"
            >
              <option value="All">All Capabilities</option>
              {capabilities.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Grid of Catalog Entries */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filteredEntries.map((item) => (
          <div
            key={item.id}
            onClick={() => setInspectingItem(item)}
            className="bg-slate-900/70 border border-slate-800 hover:border-sky-500/50 rounded-xl p-4 transition-all hover:bg-slate-900/90 flex flex-col justify-between cursor-pointer group"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-1.5">
                <span className="font-semibold text-sm text-slate-100 group-hover:text-sky-300 transition-colors">
                  {item.name}
                </span>
                {item.url && (
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="text-slate-500 hover:text-sky-400 transition-colors p-1"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>

              <div className="text-[10px] text-sky-400 font-mono mb-2 uppercase tracking-wide">
                {item.category}
              </div>

              <p className="text-xs text-slate-300 leading-relaxed line-clamp-3">
                {item.summary}
              </p>
            </div>

            <div className="flex flex-wrap gap-1.5 mt-3 pt-3 border-t border-slate-800/80">
              {item.capabilities.map((cap) => (
                <span
                  key={cap}
                  className="text-[10px] bg-slate-950 text-slate-400 border border-slate-800 px-2 py-0.5 rounded font-mono"
                >
                  {cap}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Item Inspector Modal */}
      {inspectingItem && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setInspectingItem(null)}
        >
          <div
            className="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-mono uppercase text-sky-400 font-bold block mb-1">
                  {inspectingItem.category}
                </span>
                <h3 className="text-lg font-bold text-white">{inspectingItem.name}</h3>
              </div>
              <button
                type="button"
                onClick={() => setInspectingItem(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-sm text-slate-300 leading-relaxed">
              {inspectingItem.summary}
            </p>

            <div>
              <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 font-mono">
                Declared Capabilities & Invariants
              </h4>
              <div className="flex flex-wrap gap-2">
                {inspectingItem.capabilities.map((c) => (
                  <span
                    key={c}
                    className="text-xs bg-sky-950/70 text-sky-300 border border-sky-800/80 px-2.5 py-1 rounded-md font-mono"
                  >
                    {c}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs font-mono">
              <span className="text-slate-500">ID: {inspectingItem.id}</span>
              {inspectingItem.url ? (
                <a
                  href={inspectingItem.url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sky-400 hover:text-sky-300 flex items-center space-x-1"
                >
                  <span>Official Specification</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              ) : (
                <span className="text-slate-500">Internal Reference</span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
