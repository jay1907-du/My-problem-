import { useState } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

export default function WaterChart({ hourlyData }) {
  const [hoveredIdx, setHoveredIdx] = useState(null);

  const safeData = Array.isArray(hourlyData) && hourlyData.length > 0 ? hourlyData : [];
  const maxScale = 2.0;
  const dangerThreshold = 1.5;
  const dangerLinePercent = (dangerThreshold / maxScale) * 100;

  const firstLevel = safeData[0]?.level ?? 0;
  const latestLevel = safeData[safeData.length - 1]?.level ?? 0;
  const peakLevel = safeData.reduce((maxVal, item) => Math.max(maxVal, item.level ?? 0), 0);
  const deltaNum = Number((latestLevel - firstLevel).toFixed(1));
  const isRising = deltaNum >= 0;
  const deltaLabel = `${isRising ? '+' : ''}${deltaNum.toFixed(1)}m ${isRising ? 'rising' : 'falling'} trend`;

  const getBarColor = (level) => {
    if (level >= 1.5) return 'bg-red-500 hover:bg-red-600';
    if (level >= 1.0) return 'bg-amber-500 hover:bg-amber-600';
    return 'bg-sky-500 hover:bg-sky-600';
  };

  return (
    <section
      aria-label="Bargi Reservoir Water Level Series Chart"
      className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 flex flex-col h-full"
    >
      <div className="flex flex-wrap items-start justify-between gap-3 mb-5">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Bargi Reservoir Water Level (+414.0m)</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            CWC reservoir series (m above 414.0m datum) · Alert threshold at +1.5m (415.5m)
          </p>
        </div>

        <div
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border text-xs font-semibold font-mono tabular-nums whitespace-nowrap ${
            isRising
              ? 'bg-red-50 text-red-700 border-red-200'
              : 'bg-sky-50 text-sky-800 border-sky-200'
          }`}
        >
          {isRising ? (
            <TrendingUp className="w-3.5 h-3.5" aria-hidden="true" />
          ) : (
            <TrendingDown className="w-3.5 h-3.5" aria-hidden="true" />
          )}
          <span>{deltaLabel}</span>
        </div>
      </div>

      <div className="flex-1 flex flex-col justify-end min-h-[280px]">
        <div className="relative flex-1 flex items-end gap-2 sm:gap-3 pt-8 pb-2 pl-9 pr-2 border-b border-slate-200">
          {/* Horizontal Y-Axis Reference Grid */}
          {[1.5, 1.0, 0.5].map((mark) => {
            const bottomPct = (mark / maxScale) * 100;
            const isDanger = mark === dangerThreshold;
            return (
              <div
                key={mark}
                style={{ bottom: `${bottomPct}%` }}
                className={`absolute left-0 right-0 pointer-events-none flex items-center ${
                  isDanger ? 'z-10' : 'z-0'
                }`}
              >
                <span
                  className={`text-[10px] font-mono tabular-nums pr-2 w-9 text-right ${
                    isDanger ? 'text-red-600 font-bold' : 'text-slate-400'
                  }`}
                >
                  +{mark.toFixed(1)}m
                </span>
                <div
                  className={`flex-1 border-t ${
                    isDanger ? 'border-dashed border-red-400' : 'border-slate-100'
                  }`}
                />
              </div>
            );
          })}

          {/* Danger Line Label */}
          <div
            style={{ bottom: `${dangerLinePercent}%` }}
            className="absolute right-2 -translate-y-4 pointer-events-none z-10"
          >
            <span className="text-[10px] font-semibold text-red-600 bg-white/90 px-1.5 py-0.5 rounded border border-red-200">
              Alert +1.5m (415.5m)
            </span>
          </div>

          {/* Interactive Div Bars */}
          {safeData.map((item, idx) => {
            const heightPct = Math.min(100, Math.max(8, (item.level / maxScale) * 100));
            const isHovered = hoveredIdx === idx;
            const actualElevation = (414.0 + item.level).toFixed(2);

            return (
              <div
                key={`${item.time}-${idx}`}
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}
                className="relative flex-1 h-full flex flex-col justify-end items-center group"
              >
                {isHovered && (
                  <div className="absolute -top-8 px-2 py-0.5 rounded bg-slate-900 text-white text-[11px] font-mono tabular-nums whitespace-nowrap shadow-md z-20">
                    {item.time}: +{item.level.toFixed(2)}m ({actualElevation}m)
                  </div>
                )}

                <div
                  style={{ height: `${heightPct}%` }}
                  className={`w-full max-w-[32px] rounded-t-md transition-all duration-300 ${getBarColor(
                    item.level
                  )} ${isHovered ? 'ring-2 ring-slate-900/20' : ''}`}
                  role="img"
                  aria-label={`${item.time}: +${item.level.toFixed(2)} meters above 414.0m (${actualElevation}m elevation)`}
                />
              </div>
            );
          })}
        </div>

        {/* X-Axis Time Labels */}
        <div className="flex items-center gap-2 sm:gap-3 pl-9 pr-2 pt-2">
          {safeData.map((item, idx) => (
            <div
              key={`${item.time}-${idx}`}
              className="flex-1 text-center text-[10px] sm:text-[11px] font-mono text-slate-500 truncate"
            >
              {item.time}
            </div>
          ))}
        </div>
      </div>

      {/* Chart Footer Legend */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
        <span>
          Peak reading:{' '}
          <strong className="text-slate-900 font-mono tabular-nums">
            +{peakLevel.toFixed(2)}m ({(414.0 + peakLevel).toFixed(2)}m)
          </strong>
        </span>
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-xs bg-sky-500" aria-hidden="true" />
            Normal (&lt;+1.0m)
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-xs bg-amber-500" aria-hidden="true" />
            Watch (+1.0–1.5m)
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-xs bg-red-500" aria-hidden="true" />
            Alert (+1.5m+)
          </span>
        </div>
      </div>
    </section>
  );
}