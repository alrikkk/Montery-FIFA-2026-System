import React from "react";

export default function OrganizerPixelArt() {
  // 120 columns x 80 rows pixel-perfect grid representing the exact organizer image provided:
  // A professional coordinator/organizer in a dark blue suit/blazer, white shirt, red tie,
  // golden lapel pin, yellow lanyard, and ID badge, wearing a headset and waving with his left hand.
  
  // Palette characters:
  // . : transparent
  // k : soft dark black outline (#0a0a0a)
  // u : rich royal dark blue blazer/suit jacket (#1e3a8a)
  // v : medium navy shading (#1e293b)
  // r : cherry red tie / smile / mouth (#ef4444)
  // d : dark red shading (#b91c1c)
  // y : bright gold yellow lanyard / lapel pin / badge clip (#facc15)
  // w : pure white dress shirt / pocket square / ID badge (#ffffff)
  // s : light skin peach (#fed7aa)
  // e : shaded warm skin peach (#fdba74)
  // o : brown hair (#7c2d12)
  // p : black headset / pants / dark hair shading (#171717)
  // g : slate gray headset metal & headset details (#737373)
  // l : light gray shading (#cbd5e1)

  const rows = [
    // Rows 0 - 9: Top negative space
    "........................................................................................................................",
    "........................................................................................................................",
    "........................................................................................................................",
    "........................................................................................................................",
    "........................................................................................................................",
    "........................................................................................................................",
    "........................................................................................................................",
    "........................................................................................................................",
    "........................................................................................................................",
    "........................................................................................................................",
    // Rows 10 - 19: Hair top, Headset band, waving fingers start on the right
    "..................................................kkkkkkkkkk............................................................",
    "...............................................kooooooooooook...........................................................",
    "..............................................kooooooooooooook..........................................................",
    ".............................................kooooooooooooooook.........................................................",
    ".............................................kooopppppppppoooook...................kkkkk................................",
    "............................................kooopppppppppppoooook.................ksssssk...............................",
    "............................................kooosssssssssssoooook................ksssssssk..............................",
    "............................................koosssssssssssssooook................kskkkskkk..............................",
    "...........................................kpoosssskkkkksssssoopk................ksksksksk..............................",
    "..........................................kgpoossskwwkwwksssssoopgk..............ksksksksk..............................",
    // Rows 20 - 29: Headset cups, Eyes, Nose, Mouth, Waving hand wrist and sleeve start
    "..........................................kgpoossskwwkwwksssssoopgk..............ksksksksk..............................",
    "..........................................kgpoossssssssssssssoopgk..........kkkkkssssssssk..............................",
    "...........................................kpoossssssssssssssoopk..........ksssssssssssssk..............................",
    "............................................koosssskrrksssssooook..........ksssssssssssssk..............................",
    "............................................kooossskrrkssssooook...........ksssssssssssk...............................",
    ".............................................kooossssssssssooook............ksssssssssk................................",
    "..............................................koosssssssssooook..............kkkkkkkkk.................................",
    "...............................................kooooooooooook.................kuuuuuk..................................",
    "................................................kkkkkkkkkkkk.................kuuuuuuuk.................................",
    "..................................................kssssssk..................kuuuuuuuuuk................................",
    // Rows 30 - 39: Neck, Microphone, Shoulders and sleeve connections
    "..................................................kssssssk...kggk...........kuuuuuuuuuuk................................",
    "..................................................kssssssk..kgk............kuuuuuuuuuuuuk...............................",
    "..................................................kssssssk.kgk............kuuuuuuuuuu00uuk..............................",
    "...................................................kkkkkk.kkk............kuuuuuuuuuuuuuuuk..............................",
    "........................................................................kuuuuuuuuuuuuuuuuk..............................",
    "............................................kkkkkkkkkkkkkkkkkkkkkkkkkkkuuuuuuuuuuuuuuuuuk...............................",
    "........................................kkkuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuk..............................",
    "......................................kkuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuk..............................",
    ".....................................kuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuk.............................",
    "....................................kuuuuuuwwuuuuuuuuuuuuuuuuuuuwwuuuuuuuuuuuuuuuuuuuuuuuuk............................",
    // Rows 40 - 49: Blazer lapels, White shirt collar, Red Tie center, Lapel pocket square
    "...................................kuuuuuuwwwwuuuuuuuuuuuuuuuuwwwwuuuuuuuuuuuuuuuuuuuuuuuuk............................",
    "..................................kuuuuuuwwwwwuuuuuuuuuuuuuuuwwwwwuuuuuuuuuuuuuuuuuuuuuuuuuk...........................",
    "..................................kuuuuuuwwwwwwuuuuuuuuuuuuuwwwwwwuuuuuuuuuuuuuuuuuuuuuuuuuk...........................",
    ".................................kuuuuuuwwwwwwwkuuuuuuuuuuukwwwwwwwuuuuuuuuuuuuuuuuuuuuuuuuuuk..........................",
    ".................................kuuuuuwwwwwkkkrrrrrrrrrrrkkkwwwwwuuuuuuuuuuuuuuuuuuuuuuuuuuk..........................",
    "................................kuuuuuwwwwwkkkrrrrrrrrrrrrrkkkwwwwwuuuuuuuuuuuuuuuuuuuuuuuuuuk.........................",
    "................................kuuuuuwwwwwkkkrrrrrrrrrrrrrkkkwwwwwuuuuuuuuuuuuuuuuuuuuuuuuuuk.........................",
    "...............................kuuuuuwwwwwkkkyrrrrrrrrrrrrrykkkwwwwwuuuuuuuuuuuuuuuuuuuuuuuuuuk........................",
    "...............................kuuuuuwwwwwkkkyyyyyyyyyyyyyyykkkwwwwwuuuuuuuuuuuuuuuuuuuuuuuuuuk........................",
    "..............................kuuuuuwwwwwkkkyyyyyyyyyyyyyyyyykkkwwwwwuwwwwwuuuuuuuuuuuuuuuuuuuuuuk......................",
    // Rows 50 - 59: Tie body, Golden pin, Lanyard detail, Badge top
    "..............................kuuuuuwwwwwkkkyyyrrrrrrrrrrryyykkkwwwwwuwwwwwuuuuuuuuuuuuuuuuuuuuuuk......................",
    ".............................kuuuuuwwwwwkkkyyyrrrrrrrrrrryyykkkwwwwwuuuuuuuuuuuuuuuuuuuuuuuuuuuuk.....................",
    ".............................kuuuuuwwwwwkkkyyyrrrrrrrrrrryyykkkwwwwwuyyyuuuuuuuuuuuuuuuuuuuuuuuuk.....................",
    "............................kuuuuuwwwwwkkk...rrrrrrrrrrr...kkkwwwwwuyyyyuuuuuuuuuuuuuuuuuuuuuuuk....................",
    "............................kuuuuuwwwwwkkk...rrrrrrrrrrr...kkkwwwwwuuyyuuuuuuuuuuuuuuuuuuuuuuuk....................",
    "...........................kuuuuuwwwwwkkk....rrrrrrrrrrr....kkkwwwwwuuyyuuuuuuuuuuuuuuuuuuuuuuuk....................",
    "...........................kuuuuuwwwwwkkk....rrrrrrrrrrr....kkkwwwwwuuuuuuuuuuuuuuuuuuuuuuuuuuuuk....................",
    "..........................kuuuuuwwwwwkkk.....rrrrrrrrrrr.....kkkwwwwwuuuuuuuuuuuuuuuuuuuuuuuuuuuuuk...................",
    "..........................kuuuuuwwwwwkkk.....rrrrrrrrrrr.....kkkwwwwwuuuuuuuuuuuuuuuuuuuuuuuuuuuuuk...................",
    ".........................kuuuuuwwwwwkkk......rrrrrrrrrrr......kkkwwwwwuuuuuuuuuuuuuuuuuuuuuuuuuuuuuk..................",
    // Rows 60 - 69: ID Card with "ORGAN SER" text representation
    ".........................kuuuuuwwwwwkkk......yyyyyyyyyyy......kkkwwwwwuuuuuuuuuuuuuuuuuuuuuuuuuuuuuk..................",
    "........................kuuuuuwwwwwkkk.......yywwwwwyyww.......kkkwwwwwuuuuuuuuuuuuuuuuuuuuuuuuuuuuuk.................",
    "........................kuuuuuwwwwwkkk.......yywwwwwyyww.......kkkwwwwwuuuuuuuuuuuuuuuuuuuuuuuuuuuuuk.................",
    ".......................kuuuuuwwwwwkkk........yywwwwwyyww........kkkwwwwwuuuuuuuuuuuuuuuuuuuuuuuuuuuuuk................",
    ".......................kuuuuuwwwwwkkk........yyyyyyyyyyy........kkkwwwwwuuuuuuuuuuuuuuuuuuuuuuuuuuuuuk................",
    "......................kuuuuuwwwwwkkk............................kkkwwwwwuuuuuuuuuuuuuuuuuuuuuuuuuuuuuk................",
    "......................kuuuuuwwwwwkkk................------------kkkwwwwwuuuuuuuuuuuuuuuuuuuuuuuuuuuuuk................",
    ".....................kuuuuuwwwwwkkk............................kkkwwwwwuuuuuuuuuuuuuuuuuuuuuuuuuuuuuk...............",
    ".....................kuuuuuwwwwwkkk............................kkkwwwwwuuuuuuuuuuuuuuuuuuuuuuuuuuuuuk...............",
    "....................kuuuuuwwwwwkkk..............................kkkwwwwwuuuuuuuuuuuuuuuuuuuuuuuuuuuuuk..............",
    // Rows 70 - 79: Bottom pants, pockets, and edge details
    "....................kuuuuuwwwwwkkk................................kkkwwwwwuuuuuuuuuuuuuuuuuuuuuuuuuuuuuk..............",
    "...................kuuuuuwwwwwkkk..................................kkkwwwwwuuuuuuuuuuuuuuuuuuuuuuuuuuuuuk.............",
    "...................kuuuuuwwwwwkkk..................................kkkwwwwwuuuuuuuuuuuuuuuuuuuuuuuuuuuuuk.............",
    "..................kuuuuuwwwwwkkk....................................kkkwwwwwuuuuuuuuuuuuuuuuuuuuuuuuuuuuuk............",
    "..................kkkkkkkkkkkkkk....................................kkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk............",
    ".................kppppppppppk........................................kppppppppppk.....................................",
    ".................kppppppppppk........................................kppppppppppk.....................................",
    ".................kppppppppppk........................................kppppppppppk.....................................",
    ".................kppppppppppk........................................kppppppppppk.....................................",
    ".................kkkkkkkkkkkk........................................kkkkkkkkkkkk....................................."
  ];

  // Map each character code to high-contrast colors matching the user's provided organizer image
  const getColor = (char: string) => {
    switch (char) {
      case "k": return "#0a0a0a"; // soft true black outline
      case "u": return "#1e3a8a"; // beautiful rich navy suit blazer
      case "v": return "#1e293b"; // slate navy suit jacket shadow
      case "y": return "#facc15"; // bright gold-yellow for lanyards and trophy pin
      case "w": return "#ffffff"; // pure white for dress shirt, pocket square, ID card
      case "s": return "#fed7aa"; // friendly peach skin tone
      case "e": return "#fdba74"; // shaded skin tone
      case "r": return "#dc2626"; // cherry red tie & mouth
      case "d": return "#991b1b"; // dark red tie shadow
      case "o": return "#7c2d12"; // warm brown hair
      case "p": return "#171717"; // headset black & pants base
      case "g": return "#4b5563"; // headset metallic gray
      case "l": return "#cbd5e1"; // light-gray shading
      default: return "transparent";
    }
  };

  // Filter out any comments/doc lines from rows before rendering
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
          if (char === "." || char === " " || char === "-") return null;
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
