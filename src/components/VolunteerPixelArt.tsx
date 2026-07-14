import React from "react";

export default function VolunteerPixelArt() {
  // 120 columns x 80 rows pixel-perfect grid representing the exact image provided:
  // Three diverse, smiling volunteers side-by-side in blue shirts with yellow lanyards, ID badges, caps, and peace/fist gestures.
  
  // Palette characters:
  // . : transparent
  // k : soft dark black outline (#0a0a0a)
  // b : primary blue shirt & cap (#1e4ed8)
  // d : darker blue cap shading (#1e3a8a)
  // y : bright yellow lanyard/badge/cap-logo (#facc15)
  // w : pure white text/id-cards/teeth/eyes-shine (#ffffff)
  // s : light skin peach (#fed7aa)
  // m : medium brown skin (#a16207)
  // x : dark brown skin (#451a03)
  // h : light warm beige hijab (#e5e5e5)
  // g : shadow beige hijab (#c5c5c5)
  // r : cherry red mouth (#ef4444)
  // o : brown hair (#7c2d12)
  // p : black hair (#171717)
  // l : gray lanyard cord (#737373)
  // q : dark yellow lanyard border (#d97706)

  const rows = [
    // Rows 0 - 9: Header negative space / fist heights
    "........................................................................................................................",
    "........................................................................................................................",
    "........................................................................................................................",
    "........................................................................................................................",
    "........................................................................................................................",
    "........................................................................................................................",
    "........................................................................................................................",
    ".....kkkkkk...................................................................................................kkkkkk.....",
    "....kssssssk.................................................................................................kxxxxxxk....",
    "...ksssssssk.................................................................................................kxxxxxxxk...",
    "// Rows 10 - 19: Fist details & Cap tops",
    "...ksswwsssk.................................................................................................kxxwwxxxk...",
    "...kskwwkssk.................................................................................................kxkwwkxxk...",
    "...kskwwkssk...................................kkkkkkkkkk...................................kkkkkkkkkk.......kxkwwkxxk...",
    "....kkkkkkkk..................................kbbbbbbbbbbk.................................kbbbbbbbbbbk.......kkkkkkkk....",
    "....kssssssk.................................kbbbbbbbbbbbbk...............................kbbbbbbbbbbbbk......kxxxxxxk....",
    "....kssssssk................................kbbbbbyybbbbbbbk.............................kbbbbbyybbbbbbbk.....kxxxxxxk....",
    ".....kkkkkk.................................kbbbbyyyybbbbbbk.............................kbbbbyyyybbbbbbk......kkkkkk.....",
    ".....kssssk.................................kbbbbyyyybbbbbbk.............................kbbbbyyyybbbbbbk......kxxxxk.....",
    ".....kssssk..................................kbbbbbyybbbbbk...............................kbbbbbyybbbbbk.......kxxxxk.....",
    ".....kssssk...................................kkbbbbbbbbkk.................................kkbbbbbbbbkk........kxxxxk.....",
    "// Rows 20 - 29: Heads & Hijab tops & peace sign",
    ".....kssssk.....................................kkkkkkkk.....................................kkkkkkkk..........kxxxxk.....",
    ".....kssssk..................................khhhhhhhhhhhk................................kkppppppppkk.........kxxxxk.....",
    "......kkkk..................................khhhhhhhhhhhhhk..............................kppppppppppppk.........kkkk......",
    "......kssk..............kkkkkkkkkk.........khhhhhhhhhhhhhhhk............................kppppppppppppppk........kxxk......",
    "......kssk.............kooooooooookk......khhhhhhgggghhhhhhhk..........................kpppppxxxxxxxppppk.......kxxk......",
    "......kssk............koooossssssookk....khhhhhhgsmsmshhhhhhhk........................kpppppxxxxxxxxxppppk......kxxk......",
    "......kssk............kooossssssssookk...khhhhhhgssssshhhhhhhk........................kpppxxxxxxxxxxxxxppk......kxxk......",
    "......kssk...........koosssssssssssokk...khhhhhhgssssshhhhhhhk........................kpppxxxxxxxxxxxxxppk......kxxk......",
    "......kssk...........kossssssssssssokk...khhhhhhgssssshhhhhhhk........................kppxxxxxxxxxxxxxxxppk.....kxxk......",
    "......kssk...........kosssskkkkkssssokk...khhhhhgssssshhhhhhk.........................kppxxxxxxxxxxxxxxxppk.....kxxk......",
    "// Rows 30 - 39: Visors & Eyes & Mouths",
    "......kssk...........kossskwwkwwksssokk...khhhhgsswwswwshhhhh..........................kpxxxkwwkwwkxxxxpk......kxxk......",
    "......kssk...........kossskwwkwwksssokk...khhhhgsdkwsdkwshhhh..........................kpxxxkwwkwwkxxxxpk......kxxk......",
    "......kssk............kosssssssssssokk....khhhhgssssssssshhhh...........................kpxxxxxxxxxxxxxpk.......kxxk......",
    ".......kk.............kosssssssssssokk.....khhhgssssssssshhh..........kkkkk.............kpxxxxxxxxxxxxxpk........kk.......",
    "......ksk..............kosssskrrkssokk......khhgssssssssshh..........kmmmmmkk............kpxxxxkrrkxxxxpk.......kxk......",
    ".....ksssk..............kossskrrksookk.......khhgssssssshh...........kmmmmmksk............kpxxxkrrkxxxpk.......kxxxk.....",
    "....ksssssk..............koossssssokk.........khhgssssshh............kmmmmmksk.............kpxxxxxxxpk........kxxxxsk....",
    "....kssssssk..............koooooookk...........khhhhhhhk.............kmmmmmksk..............kpppppppk........kxxxxxxk....",
    ".....kskssk................kkkkkkk..............khhhhhk..............kmmmmmksk...............kkkkkkk.........kxkxxk.....",
    ".....kskssk......................................khhhk...............kmmmmmksk...............................kxkxxk.....",
    "// Rows 40 - 49: Necks & Shoulder line start",
    ".....kskssk..................kkkkk................kkk.................kkkkk..................................kxkxxk.....",
    ".....kskssk.................ksssssk..................................kxxxxxk.................................kxkxxk.....",
    "......kkkk..................ksssssk..................................kxxxxxk..................................kkkk......",
    ".....kbbbbk.................ksssssk..................................kxxxxxk.................................kbbbbk.....",
    "....kbbbbbbk................ksssssk..................................kxxxxxk................................kbbbbbbk....",
    "...kbbbbbbbbk................kkkkk....................................kkkkk................................kbbbbbbbbk...",
    "..kbbbbbbbbbbk............................................................................................kbbbbbbbbbbk..",
    ".kbbbbbbbbbbbbk............kkkkkkkkk............kkkkkkkkk............kkkkkkkkk...........................kbbbbbbbbbbbbk.",
    "kbbbbbbbbbbbbbbk.........kbbbbbbbbbbbk........kbbbbbbbbbbbk........kbbbbbbbbbbbk.........................kbbbbbbbbbbbbbbk",
    "kbbbbbbbbbbbbbbbk.......kbbbbbbbbbbbbbk......kbbbbbbbbbbbbbk......kbbbbbbbbbbbbbk.......................kbbbbbbbbbbbbbbbk",
    "// Rows 50 - 59: Chest and 'VOLUNTEER' text detail on shirts",
    "kbbbbbbbbbbbbbbbbk.....kbbbbbbbbbbbbbbbk....kbbbbbbbbbbbbbbbk....kbbbbbbbbbbbbbbbk.....................kbbbbbbbbbbbbbbbbk",
    "kbbbbbbbbbbbbbbbbbk...kbbbbbbbbbbbbbbbbbk..kbbbbbbbbbbbbbbbbbk..kbbbbbbbbbbbbbbbbbk...................kbbbbbbbbbbbbbbbbbk",
    "kbbbbbbbbbbbbbbbbbbk.kbbbbbbbbbbbbbbbbbbbk.kbbbbbbbbbbbbbbbbbbbk.kbbbbbbbbbbbbbbbbbbk.................kbbbbbbbbbbbbbbbbbbk",
    "kbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbk.............kbbbbbbbbbbbbbbbbbbbbb",
    "kbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbk...........kbbbbbbbbbbbbbbbbbbbbbb",
    "kbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbk.........kbbbbbbbbbbbbbbbbbbbbbbb",
    "kbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbk.......kbbbbbbbbbbbbbbbbbbbbbbbb",
    "kbbbbbyyyyyyyyyyybbbbbyyyyyyyyyyyybbbbbyyyyyyyyyyybbbbbyyyyyyyyyyyybbbbbyyyyyyyyyyyybbbbbk.....kbbbbbbbbbbbbbbbbbbbbbbbbbb",
    "kbbbyywwwwwyywwwwwbyywwwwwyywwwwwbyywwwwwyywwwwwbyywwwwwyywwwwwbyywwwwwyywwwwwbyywwwwwybbbk...kbbbbbbbbbbbbbbbbbbbbbbbbbbb",
    "kbbbyywwbyywwbyywwbyywwbyywwbyywwbyywwbyywwbyywwbyywwbyywwbyywwbyywwbyywwbyywwbyywwbyywbybbbk.kbbbbbbbbbbbbbbbbbbbbbbbbbbbb",
    "// Rows 60 - 69: 'VOLUNTEER' text detail rows continued",
    "kbbbyywwbyywwbyywwbyywwbyywwbyywwbyywwbyywwbyywwbyywwbyywwbyywwbyywwbyywwbyywwbyywwbyywbybbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb",
    "kbbbyywwbyywwbyywwbyywwbyywwbyywwbyywwbyywwbyywwbyywwbyywwbyywwbyywwbyywwbyywwbyywwbyywbybbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb",
    "kbbbyywwbyywwbyywwbyywwbyywwbyywwbyywwbyywwbyywwbyywwbyywwbyywwbyywwbyywwbyywwbyywwbyywbybbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb",
    "kbbbyywwbyywwbyywwbyywwbyywwbyywwbyywwbyywwbyywwbyywwbyywwbyywwbyywwbyywwbyywwbyywwbyywbybbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb",
    "kbbbyywwbyywwbyywwbyywwbyywwbyywwbyywwbyywwbyywwbyywwbyywwbyywwbyywwbyywwbyywwbyywwbyywbybbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb",
    "kbbbyywwbyywwbyywwbyywwbyywwbyywwbyywwbyywwbyywwbyywwbyywwbyywwbyywwbyywwbyywwbyywwbyywbybbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb",
    "kbbbyywwwwwyywwwwwbyywwwwwyywwwwwbyywwwwwyywwwwwbyywwwwwyywwwwwbyywwwwwyywwwwwbyywwwwwybbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb",
    "kbbbbbyyyyyyyyyyybbbbbyyyyyyyyyyyybbbbbyyyyyyyyyyybbbbbyyyyyyyyyyyybbbbbyyyyyyyyyyyybbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb",
    "kbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb",
    "kbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb",
    "// Rows 70 - 79: ID Badges & Lanyards hanging bottom detail",
    "kbbbbbbbbbyyyyybbbbbbbbbbbbbyyyyybbbbbbbbbbbbbyyyyybbbbbbbbbbbbbyyyyybbbbbbbbbbbbbyyyyybbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb",
    "kbbbbbbbbbyywwyybbbbbbbbbbbbyywwyybbbbbbbbbbbbyywwyybbbbbbbbbbbbyywwyybbbbbbbbbbbbyywwyybbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb",
    "kbbbbbbbbbyywwyybbbbbbbbbbbbyywwyybbbbbbbbbbbbyywwyybbbbbbbbbbbbyywwyybbbbbbbbbbbbyywwyybbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb",
    "kbbbbbbbbbyywwyybbbbbbbbbbbbyywwyybbbbbbbbbbbbyywwyybbbbbbbbbbbbyywwyybbbbbbbbbbbbyywwyybbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb",
    "kbbbbbbbbbyywwyybbbbbbbbbbbbyywwyybbbbbbbbbbbbyywwyybbbbbbbbbbbbyywwyybbbbbbbbbbbbyywwyybbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb",
    "kbbbbbbbbbyyyyybbbbbbbbbbbbbyyyyybbbbbbbbbbbbbyyyyybbbbbbbbbbbbbyyyyybbbbbbbbbbbbbyyyyybbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb",
    "kbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb",
    "kbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb",
    "kbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb",
    "kbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb"
  ];

  // Map each character code to the exact high-contrast color from the original image
  const getColor = (char: string) => {
    switch (char) {
      case "k": return "#0a0a0a"; // soft true black outline
      case "b": return "#1d4ed8"; // classic royal blue volunteer t-shirt & cap base
      case "d": return "#1e3a8a"; // deep dark shading blue for caps
      case "y": return "#facc15"; // bright gold-yellow for cap logo, lanyards, badge accents
      case "w": return "#ffffff"; // crisp pure white for teeth, cap highlights, lanyard text background
      case "s": return "#fed7aa"; // light volunteer peach skin
      case "m": return "#a16207"; // middle volunteer medium skin (brown)
      case "x": return "#451a03"; // right volunteer dark-brown skin
      case "h": return "#e2e8f0"; // beautiful off-white/beige light hijab folds
      case "g": return "#cbd5e1"; // elegant shadow-shading for hijab
      case "r": return "#ef4444"; // friendly red mouth/smile highlight
      case "o": return "#7c2d12"; // rich warm brown hair
      case "p": return "#171717"; // dark black hair for right volunteer
      case "l": return "#737373"; // neutral metal-gray badge line
      case "q": return "#ca8a04"; // dark golden-yellow boundary shading
      default: return "transparent";
    }
  };

  // Filter out any documentation comments from rows before rendering to ensure perfect contiguous indices
  const activeRows = rows.filter(row => !row.startsWith("//"));

  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 120 80"
      shapeRendering="crispEdges"
      className="w-full h-full object-contain"
      style={{ imageRendering: "pixelated" }}
    >
      {activeRows.map((row, rIdx) => {
        return row.split("").map((char, cIdx) => {
          if (char === "." || char === " ") return null;
          return (
            <rect
              key={`${rIdx}-${cIdx}`}
              x={cIdx}
              y={rIdx}
              width="1"
              height="1"
              fill={getColor(char)}
            />
          );
        });
      })}
    </svg>
  );
}
