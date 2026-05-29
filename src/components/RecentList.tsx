"use client";

import { RecentEntry } from "@/lib/recent";

interface RecentListProps {
  items: RecentEntry[];
  onSelect: (cc: string, num: string) => void;
  onClear: () => void;
}

export function RecentList({ items, onSelect, onClear }: RecentListProps) {
  if (items.length === 0) return null;

  return (
    <div className="wa-recent-card">
      <div className="wa-recent-header">
        <div className="wa-label" style={{ margin: 0 }}>
          Recent
        </div>
        <button className="wa-btn-clear" onClick={onClear}>
          Clear
        </button>
      </div>
      <div className="wa-recent-list">
        {items.map((r) => (
          <button
            key={r.label}
            className="wa-recent-item"
            onClick={() => onSelect(r.cc, r.num)}
          >
            <div className="wa-recent-dot" />
            <span className="wa-recent-num">{r.label}</span>
            <span className="wa-recent-arrow">&#8250;</span>
          </button>
        ))}
      </div>
    </div>
  );
}
