'use client';
import { useState, useRef, useId } from 'react';

/**
 * Generate a smooth cubic Bezier path from a series of (x, y) coordinates.
 * Uses Catmull-Rom to Cubic Bezier conversion for natural curves.
 */
function getSmoothPath(pts) {
  if (!pts || pts.length === 0) return '';
  if (pts.length === 1) return `M ${pts[0].x.toFixed(1)} ${pts[0].y.toFixed(1)}`;
  if (pts.length === 2) {
    return `M ${pts[0].x.toFixed(1)} ${pts[0].y.toFixed(1)} L ${pts[1].x.toFixed(1)} ${pts[1].y.toFixed(1)}`;
  }

  let d = `M ${pts[0].x.toFixed(1)} ${pts[0].y.toFixed(1)}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = i > 0 ? pts[i - 1] : pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = i < pts.length - 2 ? pts[i + 2] : p2;

    const cp1x = p1.x + (p2.x - p0.x) / 6;
    const cp1y = p1.y + (p2.y - p0.y) / 6;
    const cp2x = p2.x - (p3.x - p1.x) / 6;
    const cp2y = p2.y - (p3.y - p1.y) / 6;

    d += ` C ${cp1x.toFixed(1)} ${cp1y.toFixed(1)}, ${cp2x.toFixed(1)} ${cp2y.toFixed(1)}, ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`;
  }
  return d;
}

export function SparklineChart({
  data,
  monthlyVolumes,
  trend,
  width = 150,
  height = 44
}) {
  const [activeIndex, setActiveIndex] = useState(null);
  const containerRef = useRef(null);
  const rawId = useId();
  const gradId = `sparkline-grad-${rawId.replace(/[^a-zA-Z0-9_-]/g, '')}`;

  // 1. Normalize items array
  let items = [];
  if (Array.isArray(monthlyVolumes) && monthlyVolumes.length > 0) {
    items = monthlyVolumes.map(m => ({
      label: m.label || '',
      volume: typeof m.volume === 'number' ? m.volume : (Number(m.monthlySearches) || 0)
    }));
  } else if (Array.isArray(data) && data.length > 0) {
    items = data.map((v, i) => ({
      label: `Month ${i + 1}`,
      volume: Number(v) || 0
    }));
  }

  // 2. Volume 0 or missing data -> render "—"
  if (items.length === 0 || items.every(it => Number(it.volume) <= 0)) {
    return <span className="text-slate-400 font-medium">—</span>;
  }

  const volumes = items.map(d => d.volume);
  const minVol = Math.min(...volumes);
  const maxVol = Math.max(...volumes);

  // 3. Dynamic color: green by default, warm orange/coral if latest month is lower than first month
  const isFalling = volumes.length >= 2 && volumes[volumes.length - 1] < volumes[0];
  const lineColor = isFalling ? '#f97316' : '#10b981';
  const fillColor = isFalling ? '#ea580c' : '#059669';

  // 4. Geometry & scaling
  const padX = 6;
  const padTop = 6;
  const padBottom = 6;
  const plotW = width - padX * 2;
  const plotH = height - padTop - padBottom;

  // Add buffer to Y range so peaks and valleys don't clip at top/bottom border
  const valDelta = maxVol - minVol;
  const buffer = valDelta > 0 ? valDelta * 0.1 : Math.max(maxVol * 0.1, 10);
  const yMin = Math.max(0, minVol - buffer);
  const yMax = maxVol + buffer;
  const yRange = yMax - yMin || 1;

  const points = items.map((item, i) => {
    const x = padX + (i / Math.max(1, items.length - 1)) * plotW;
    const y = padTop + plotH - ((item.volume - yMin) / yRange) * plotH;
    return { x, y, item, index: i };
  });

  const linePath = getSmoothPath(points);
  const lastX = points[points.length - 1].x.toFixed(1);
  const firstX = points[0].x.toFixed(1);
  const bottomY = (height - 1).toFixed(1);
  const areaPath = `${linePath} L ${lastX} ${bottomY} L ${firstX} ${bottomY} Z`;

  // 5. Pointer tracking for hover & touch
  const handlePointer = (e) => {
    if (!containerRef.current || points.length === 0) return;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const rect = containerRef.current.getBoundingClientRect();
    const relX = clientX - rect.left - padX;
    const ratio = Math.max(0, Math.min(1, relX / plotW));
    const idx = Math.round(ratio * (points.length - 1));
    setActiveIndex(idx);
  };

  const handlePointerLeave = () => {
    setActiveIndex(null);
  };

  const activePt = activeIndex !== null && points[activeIndex] ? points[activeIndex] : null;

  // Horizontal tooltip alignment to prevent edge cut-off
  let tooltipStyle = { bottom: `${height + 6}px` };
  let arrowStyle = { bottom: '-4px' };
  if (activePt) {
    const percentX = (activePt.x / width) * 100;
    if (percentX < 30) {
      tooltipStyle.left = '0px';
      arrowStyle.left = `${Math.max(10, activePt.x)}px`;
    } else if (percentX > 70) {
      tooltipStyle.right = '0px';
      arrowStyle.right = `${Math.max(10, width - activePt.x)}px`;
    } else {
      tooltipStyle.left = `${activePt.x}px`;
      tooltipStyle.transform = 'translateX(-50%)';
      arrowStyle.left = '50%';
      arrowStyle.transform = 'translateX(-50%)';
    }
  }

  return (
    <div
      ref={containerRef}
      onMouseMove={handlePointer}
      onMouseLeave={handlePointerLeave}
      onTouchStart={handlePointer}
      onTouchMove={handlePointer}
      onTouchEnd={() => setTimeout(handlePointerLeave, 2000)}
      className="relative inline-block overflow-visible cursor-crosshair select-none group py-0.5"
      style={{ width: `${width}px`, height: `${height}px` }}
    >
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        className="overflow-visible block"
      >
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={fillColor} stopOpacity="0.25" />
            <stop offset="100%" stopColor={fillColor} stopOpacity="0.0" />
          </linearGradient>
        </defs>

        {/* Gradient area fill */}
        <path d={areaPath} fill={`url(#${gradId})`} />

        {/* Smooth line */}
        <path
          d={linePath}
          fill="none"
          stroke={lineColor}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Active hover dot & guide line */}
        {activePt ? (
          <g>
            <line
              x1={activePt.x}
              y1={2}
              x2={activePt.x}
              y2={height - 2}
              stroke={lineColor}
              strokeWidth="1"
              strokeDasharray="2 2"
              opacity="0.65"
            />
            <circle
              cx={activePt.x}
              cy={activePt.y}
              r="3.5"
              fill="#ffffff"
              stroke={lineColor}
              strokeWidth="2.5"
            />
          </g>
        ) : (
          /* Subtle dot on the latest month */
          points.length > 0 && (
            <circle
              cx={points[points.length - 1].x}
              cy={points[points.length - 1].y}
              r="2.5"
              fill={lineColor}
            />
          )
        )}
      </svg>

      {/* Floating tooltip */}
      {activePt && (
        <div
          className="pointer-events-none absolute z-50 px-2.5 py-1.5 bg-slate-900/95 text-white rounded-lg shadow-xl backdrop-blur-xs whitespace-nowrap border border-slate-700/80 animate-in fade-in zoom-in-95 duration-100"
          style={tooltipStyle}
        >
          <div className="font-medium text-slate-300 text-[10px] leading-tight text-center">
            {activePt.item.label}
          </div>
          <div className="font-bold text-white text-xs leading-tight text-center mt-0.5">
            {activePt.item.volume.toLocaleString()} searches
          </div>
          <div
            className="absolute border-4 border-transparent border-t-slate-900/95"
            style={arrowStyle}
          />
        </div>
      )}
    </div>
  );
}
