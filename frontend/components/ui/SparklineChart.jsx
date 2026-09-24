export function SparklineChart({ data, trend = 'stable', width = 120, height = 30 }) {
  if (!data || data.length === 0) return <div style={{ width, height }} />;

  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  
  // Create points
  const points = data.map((val, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - ((val - min) / range) * (height - 4) - 2; // pad 2px top/bottom
    return `${x},${y}`;
  }).join(' ');

  const color = trend === 'rising' ? '#10b981' : trend === 'falling' ? '#ef4444' : '#6b7280';
  
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="overflow-visible">
      {/* Path shadow for glow effect */}
      <polyline
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points}
        style={{ filter: `drop-shadow(0px 2px 4px ${color}40)` }}
      />
      {/* Circle at the end point */}
      {data.length > 0 && (
        <circle 
          cx={width} 
          cy={height - ((data[data.length - 1] - min) / range) * (height - 4) - 2} 
          r="2.5" 
          fill={color} 
        />
      )}
    </svg>
  );
}
