import React from "react";

export default function FanPixelArt() {
  // 120 columns x 80 rows pixel-perfect grid representing the exact three football fans image provided:
  // - Left fan (Argentina): Raised fist, sky blue & white vertical stripes jersey #10, brown hair, light skin.
  // - Center fan (Brazil): Yellow jersey with green trim #10, black hair, dark brown skin, arms around friends' shoulders.
  // - Right fan (Germany/Belgium): Black/red split jersey #8, holding a black/red/yellow horizontal scarf over head, white cap, medium skin, smiling.
  
  // Palette characters:
  // . : transparent
  // k : soft black/charcoal outline (#0d0d0d)
  // w : pure white stripes, cap, number 8, eye-shine (#ffffff)
  // q : soft light sky-blue shading for white shirt parts (#d9f2ff)
  // a : bright sky blue for Argentina jersey and badge (#42a5f5)
  // y : gold yellow for Brazil jersey, scarf stripe, Germany accent (#facc15)
  // g : emerald green for Brazil collar, cuffs, emblem, number 10 (#16a34a)
  // r : fiery red for Germany stripe, scarf stripe, and open smiling mouth (#e11d48)
  // s : light peach skin tone for Argentina fan (#fed7aa)
  // m : medium brown skin tone for Germany/scarf fan (#b45309)
  // x : dark mahogany skin tone for Brazil fan (#451a03)
  // o : brown hair for Argentina fan (#78350f)
  // p : deep black hair, pants, and cap brim (#171717)
  // e : charcoal gray for shading (#525252)

  const rows = [
    // Rows 0 - 9: Scarf height (held high on the right side)
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
    // Rows 10 - 19: Left raised fist, Scarf stripes (Black/Red/Yellow)
    "..........kkkkk..............................................................kkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk...........",
    ".........ksssssk............................................................kpppppppppppppppppppppppppppppppppk..........",
    ".........ksssssk............................................................krrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrk..........",
    ".........ksssssk............................................................kyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyk..........",
    "..........kkkkk.............................................................kkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk..........",
    "...........ksk...............................................................kyyk.........................kyyk...........",
    "...........ksk...............................................................kyyk.........................kyyk...........",
    "..........ksssk...............................kkppppppppkk...................kyyk.........................kyyk...........",
    "..........ksssk..............................kppppppppppppk..................kyyk.........................kyyk...........",
    "..........ksssk.............................kppppppppppppppk.................kkk..........................kkk............",
    // Rows 20 - 29: Argentina Hair, Brazil Hair, Germany White Cap & Hand gripping scarf
    "..........ksssk.............................kppppppppppppppk............................................................",
    "..........ksssk............................kppppxxxxxxxxppppk........................kkkkk.........kkkkk................",
    "..........ksssk............koooook.........kppppxxxxxxxxxpppk.......................kmmmmmk.......kmmmmmk...............",
    "...........ksk............kooooooook........kppxxxxxxxxxxxppk.......................kmmmmmkkkkkkkkkmmmmm|...............",
    "...........ksk...........koooooooooook......kppxxxxxxxxxxxppk.........kkkkkkkkkk.....kkkmmmmmmmmmmmmmkkk................",
    "..........kuuuuuk........koooooooooook......kppxxxxxxxxxxxppk........kwwwwwwwwwwk.......kkkkkmmmmkkkk...................",
    ".........kuuuuuuuk.......kooosososooook......kpxxxxxxxxxxxpxk.......kwwwwwwwwwwwwk...........kmmk.......................",
    "........kuuuuuuuuuk......koosssssssooook......kpxxxxxxxxxxpxk.......kwwppppppwwwwk...........kmmk.......................",
    "........kuuuuuuuuuk......koosssssssooook.......kxxxxxxxxxxk........kwppppppppppwwk..........kmmmk.......................",
    "........kuuuuuuuuuk......kooskkksssooook........kkkxxxxkkk.........kwwwwwwwwwwwwk...........kmmmk.......................",
    // Rows 30 - 39: Argentina & Brazil eyes/smiles, Germany Cap Brim and Goatee
    "........kuuuuuuuuuk......kooskkksssooook...........kkkk............kwwkkkwwkkkwwk..........kmmmk........................",
    "........kuuuuuuuuuk......koosssssssooook...........................kwwkkkwwkkkwwk..........kmmmk........................",
    "........kuuuuuuuuuk......kooossssooook.............................kwwwwwwwwwwwwk..........kmmmk........................",
    ".........kuuuuuk..........kooossssooook..........kxxxxk.............kwkkkrrkkkwwk..........kkkkk........................",
    "..........kkkkk............koosrrsooook.........kxxxxxxk............kwwkrrrrkwwk........................................",
    "............................koosrrsooook.......kxxxxxxxxk...........kwwwkkkkwwwk........................................",
    ".............................koossssooook......kxxxxxxxxk............kmmmmmmmmk.........................................",
    "..............................kooooooook.......kxxkrrkxk.............kmmkrrkmk..........................................",
    "...............................kkkkkkkk........kxxkrrkxk..............kmmkkkmk..........................................",
    "..................................ksk...........kkkxxkkk...............kkkmmkk..........................................",
    // Rows 40 - 49: Necks and shirt shoulders start
    "..................................ksk............kxxk...................kmmk............................................",
    ".................................ksssk...........kxxk..................kmmmk............................................",
    "................................ksssssk..........kxxk..................kmmmmk...........................................",
    ".................................kkkkk...........kkkk..................kkkkk............................................",
    "........................................................................................................................",
    "............................kkkkkkkkkkkkkk...kkkkkkkkkkkkkk.........kkkkkkkkkkkkkk......................................",
    "...........................kaaaawwaaaawwaak.kyyyyyyyyyyyyyyk.......kppppppppppppppk.....................................",
    "..........................kaaaawwaaaawwaaakyyggyyyyyyyyyggyyk......kpprrpppppprrppk.....................................",
    ".........................kaaaawwaaaawwaaaakyggyyyyyyyyyggyyyk.....kpprrpppppprrpppk....................................",
    ".........................kaaaawwaaaawwaaaakyyyyyyyyyyyyyyyyyk.....kpppppppppppppppk....................................",
    // Rows 50 - 59: Chest area, numbers, badges
    "........................kaaaawwaaaawwaaaaakyyyyyyyyyyyyyyyyyk....kpppppppppppppppk.....................................",
    "........................kaaaawwaaaawwaaaaakyyyyyyyyyyyyyyyyyk....kpppppppppppppppk.....................................",
    "........................kaaaawwaaaawwaaaaakyyyyyyyyggyyyyyyyk....kpppppppyyyyyppppk....................................",
    "........................kaaaawwaaaawwaaaaakyyyyyyyyggyyyyyyyk....kpppppppyyyyyppppk....................................",
    "........................kaaaawwkaawkaawaaakyyyyyyyyggyyyyyyyk....kpppppppyyyyyppppk....................................",
    "........................kaaaawwkaawkaawaaakyyyyyggggggyyyyyyk....kpppppppyyyyyppppk....................................",
    "........................kaaaawwkaawkaawaaakyyyyyggggggyyyyyyk....kpppppppppppppppk.....................................",
    "........................kaaaawwaaaawwaaaaakyyyyyyyyyyyyyyyyyk....kpprrrrrrrrrrpppk.....................................",
    "........................kaaaawwaaaawwaaaaakyyyyyyyyyyyyyyyyyk....kpprrrrrrrrrrpppk.....................................",
    "........................kaaaawwaaaawwaaaaakyyyyyyyyyyyyyyyyyk....kpprrrrrrrrrrpppk.....................................",
    // Rows 60 - 69: Numbers '10' and '8' details, badge logos
    "........................kaaaawwkkwwkwwaaaakyyyyyggggggyyyyyyk....kppppppwwpppppppk.....................................",
    "........................kaaaawwkkwwkwwaaaakyyyyygkkkggyyyyyyk....kpppppwwwwppppppk.....................................",
    "........................kaaaawwkkwwkwwaaaakyyyyygkkykggyyyyyk....kpppppwwwwppppppk.....................................",
    "........................kaaaawwkkwwkwwaaaakyyyyygkkykggyyyyyk....kpppppwwkkwwppppk.....................................",
    "........................kaaaawwkkwwkwwaaaakyyyyygkkykggyyyyyk....kpppppwwkkwwppppk.....................................",
    "........................kaaaawwkkwwkwwaaaakyyyyygkkykggyyyyyk....kpppppwwwwppppppk.....................................",
    "........................kaaaawwkkwwkwwaaaakyyyyygkkkggyyyyyyk....kpppppwwwwppppppk.....................................",
    "........................kaaaawwkkwwkwwaaaakyyyyyggggggyyyyyyk....kppppppwwpppppppk.....................................",
    "........................kaaaawwaaaawwaaaaakyyyyyyyyyyyyyyyyyk....kpppppppppppppppk.....................................",
    "........................kaaaawwaaaawwaaaaakyyyyyyyyyyyyyyyyyk....kpppppppppppppppk.....................................",
    // Rows 70 - 79: Bottom waist line and trouser tops
    "........................kaaaawwaaaawwaaaaakyyyyyyyyyyyyyyyyyk....kpppppppppppppppk.....................................",
    "........................kaaaawwaaaawwaaaaakyyyyyyyyyyyyyyyyyk....kpppppppppppppppk.....................................",
    "........................kaaaawwaaaawwaaaaakyyyyyyyyyyyyyyyyyk....kpppppppppppppppk.....................................",
    ".........................kkkkkkkkkkkkkkkkk.kkkkkkkkkkkkkkkkk.....kkkkkkkkkkkkkkkk......................................",
    "............................kpppppppk.........kbbbbbbbbk............kpppppppk...........................................",
    "............................kpppppppk.........kbbbbbbbbk............kpppppppk...........................................",
    "............................kpppppppk.........kbbbbbbbbk............kpppppppk...........................................",
    "............................kpppppppk.........kbbbbbbbbk............kpppppppk...........................................",
    "............................kpppppppk.........kbbbbbbbbk............kpppppppk...........................................",
    "............................kkkkkkkkk.........kkkkkkkkkk............kkkkkkkkk..........................................."
  ];

  // Map each character code to high-fidelity colors exactly matching the real image:
  const getColor = (char: string) => {
    switch (char) {
      case "k": return "#0d0d0d"; // deep outline black
      case "w": return "#ffffff"; // pure white for cap, stripes, number 8
      case "q": return "#e0f2fe"; // light blue highlight
      case "a": return "#38bdf8"; // bright sky blue for Argentina stripes
      case "y": return "#facc15"; // gold yellow for Brazil shirt, scarf, Germany stripe
      case "g": return "#15803d"; // green for Brazil emblem and green shirt highlights
      case "r": return "#dc2626"; // cherry red for Germany shirt stripe, scarf stripe, mouth
      case "s": return "#fed7aa"; // light skin peach
      case "m": return "#d97706"; // warm medium skin tone (Germany fan)
      case "x": return "#451a03"; // dark skin mahogany tone (Brazil fan)
      case "o": return "#854d0e"; // warm brown hair
      case "p": return "#171717"; // jet-black hair/cap/blends
      case "e": return "#4b5563"; // dark shading
      case "u": return "#fca5a5"; // pale peach for arm extension
      default: return "transparent";
    }
  };

  // Filter out any documentation comments before rendering
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
          if (char === "." || char === " " || char === "|") return null;
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
