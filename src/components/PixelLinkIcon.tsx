import React from "react";

interface PixelLinkIconProps {
  width?: number;
  height?: number;
  className?: string;
  style?: React.CSSProperties;
}

export default function PixelLinkIcon({ width = 32, height = 32, className = "", style }: PixelLinkIconProps) {
  // 15 rows x 16 columns grid representing the celebrating Link character
  // 0: transparent, 1: peach/skin/yellow/orange, 2: vibrant green, 3: warm brown, 4: dark brown/black
  const grid = [
    [0, 0, 1, 1, 0, 0, 2, 2, 2, 2, 0, 0, 1, 1, 0, 0],
    [0, 1, 1, 1, 0, 2, 2, 2, 2, 2, 2, 0, 1, 1, 1, 0],
    [0, 1, 3, 1, 2, 2, 2, 2, 2, 2, 2, 2, 1, 3, 1, 0],
    [0, 0, 3, 3, 2, 2, 3, 3, 3, 3, 2, 2, 3, 3, 0, 0],
    [0, 0, 0, 3, 3, 1, 1, 1, 1, 1, 1, 3, 3, 0, 0, 0],
    [0, 0, 0, 0, 3, 1, 4, 1, 1, 4, 1, 3, 0, 0, 0, 0],
    [0, 0, 0, 0, 3, 1, 1, 4, 4, 1, 1, 3, 0, 0, 0, 0],
    [0, 0, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0, 0],
    [0, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0],
    [0, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0],
    [0, 0, 3, 3, 3, 3, 3, 1, 1, 3, 3, 3, 3, 3, 0, 0],
    [0, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0],
    [0, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0],
    [0, 0, 0, 3, 3, 3, 0, 0, 0, 0, 3, 3, 3, 0, 0, 0],
    [0, 0, 0, 3, 3, 3, 0, 0, 0, 0, 3, 3, 3, 0, 0, 0]
  ];

  const getColor = (val: number) => {
    switch (val) {
      case 1: return "#fbbf24"; // golden peach/skin
      case 2: return "#a3ff00"; // Link green
      case 3: return "#b45309"; // hair/boots brown
      case 4: return "#451a03"; // eye/mouth dark brown
      default: return "transparent";
    }
  };

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 16 15"
      shapeRendering="crispEdges"
      className={`${className} drop-shadow-[0_2px_6px_rgba(163,255,0,0.35)]`}
      style={style}
    >
      {grid.map((row, rIdx) =>
        row.map((pixel, pIdx) => {
          if (pixel === 0) return null;
          return (
            <rect
              key={`${rIdx}-${pIdx}`}
              x={pIdx}
              y={rIdx}
              width="1"
              height="1"
              fill={getColor(pixel)}
            />
          );
        })
      )}
    </svg>
  );
}
