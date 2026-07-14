import React from "react";
import { motion } from "motion/react";

export default function PixelDuckLogo() {
  // Let's define the 24x24 pixel grid for our cool sunglasses duck
  // 0: transparent, 1: black outline, 2: main yellow body, 3: shadow yellow, 4: sunglasses black, 5: sunglasses white spec, 6: orange/red beak, 7: beak shadow/border
  const grid = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 3, 2, 2, 2, 2, 1, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 2, 2, 2, 2, 2, 2, 1, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 4, 4, 5, 4, 4, 4, 5, 4, 1, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 4, 4, 4, 4, 4, 4, 4, 4, 1, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 2, 2, 2, 6, 6, 6, 6, 1, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 2, 2, 6, 6, 6, 1, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 2, 2, 2, 2, 2, 1, 1, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 0, 0, 0, 0, 0],
    [0, 0, 0, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 0, 0, 0, 0],
    [0, 0, 1, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 0, 0, 0, 0],
    [0, 0, 1, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 0, 0, 0, 0],
    [0, 0, 0, 1, 2, 2, 2, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 1, 1, 1, 0, 0, 1, 1, 2, 2, 2, 2, 2, 1, 1, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  ];

  // Helper to color each pixel index
  const getColor = (val: number) => {
    switch (val) {
      case 1: return "#000000"; // outline
      case 2: return "#facc15"; // bright yellow
      case 3: return "#fef08a"; // highlight yellow
      case 4: return "#000000"; // sunglasses frame
      case 5: return "#ffffff"; // sunglasses shine
      case 6: return "#ef4444"; // red/orange beak
      case 7: return "#b91c1c"; // dark red
      default: return "transparent";
    }
  };

  // 8x8 pixel football coordinates (simple neat pixel map)
  // 0: transparent, 1: black, 2: white
  const ballGrid = [
    [0, 0, 1, 1, 1, 1, 0, 0],
    [0, 1, 2, 2, 1, 2, 1, 0],
    [1, 2, 1, 2, 2, 1, 2, 1],
    [1, 1, 2, 1, 1, 2, 1, 1],
    [1, 2, 1, 2, 2, 1, 2, 1],
    [0, 1, 2, 2, 1, 2, 1, 0],
    [0, 0, 1, 1, 1, 1, 0, 0]
  ];

  const getBallColor = (val: number) => {
    if (val === 1) return "#000000";
    if (val === 2) return "#ffffff";
    return "transparent";
  };

  return (
    <div className="flex items-center gap-3 select-none relative" id="header-cool-duck-logo">
      {/* Animated jumping/bobbing yellow pixel duck container */}
      <motion.div
        className="relative"
        animate={{
          y: [0, -3, 0],
        }}
        transition={{
          repeat: Infinity,
          duration: 1.8,
          ease: "easeInOut",
        }}
      >
        <svg
          width="42"
          height="42"
          viewBox="0 0 24 20"
          shapeRendering="crispEdges"
          className="drop-shadow-[0_2px_8px_rgba(250,204,21,0.2)]"
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
      </motion.div>

      {/* Spinning & bouncing pixel football on top / next to the duck! */}
      <motion.div
        className="absolute -top-3 -right-2"
        animate={{
          y: [0, -7, 0],
          rotate: [0, 180, 360],
        }}
        transition={{
          repeat: Infinity,
          duration: 1.8,
          ease: "easeInOut",
        }}
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 8 7"
          shapeRendering="crispEdges"
          className="drop-shadow-[0_1px_4px_rgba(255,255,255,0.4)]"
        >
          {ballGrid.map((row, rIdx) =>
            row.map((pixel, pIdx) => {
              if (pixel === 0) return null;
              return (
                <rect
                  key={`${rIdx}-${pIdx}`}
                  x={pIdx}
                  y={rIdx}
                  width="1"
                  height="1"
                  fill={getBallColor(pixel)}
                />
              );
            })
          )}
        </svg>
      </motion.div>
    </div>
  );
}
