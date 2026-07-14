import React from "react";

export default function StaffPixelArt() {
  // 120 columns x 80 rows pixel-perfect grid representing the exact staff image provided:
  // Three diverse smiling stadium staff members side-by-side in teal vests with yellow lanyards,
  // ID badges, headsets, and walkie-talkie/waving gestures.
  
  // Palette characters:
  // . : transparent
  // k : soft dark black outline (#0a0a0a)
  // t : primary teal vest & cap (#06b6d4)
  // d : darker teal shading (#0891b2)
  // y : bright yellow lanyard/badge/cap-logo (#facc15)
  // w : pure white sleeves/text/id-cards/teeth/eyes-shine (#ffffff)
  // s : light skin peach (#fed7aa)
  // m : medium brown skin (#a16207)
  // x : dark brown skin (#451a03)
  // r : cherry red mouth (#ef4444)
  // o : warm brown hair (#7c2d12)
  // p : black hair/headset/pants (#171717)
  // g : gray for walkie-talkie & lanyard details (#78716c)
  // l : light gray for shading on white shirts (#e2e8f0)
  // q : dark yellow lanyard border (#d97706)

  const rows = [
    // Rows 0 - 9: Top negative space / walkie-talkie antenna / waving hand height
    "........................................................................................................................",
    "........................................................................................................................",
    "........................................................................................................................",
    "........................................................................................................................",
    "........................................................................................................................",
    "........................................................................................................................",
    "........................................................................................................................",
    "......................................................................................................kkkkkk............",
    "..................kkkk...............................................................................kxxxxxxk...........",
    "..................kggk..............................................................................kxxxxxxxxk..........",
    // Rows 10 - 19: Walkie-talkie, Waving fingers, and Cap tops
    "..................kggk..............................................................................kxxkxxkxxk..........",
    "..................kggk..............................................................................kxkkxkkxxk..........",
    "..................kkkk..........................kkkkkkkkkk..................kkkkkkkkkk..............kxkkxkkxxk..........",
    "...............................................kttttttttttk................kttttttttttk.............kxkkxkkxxk..........",
    "..................kkkk........................kttttttttttttk..............kttttttttttttk.............kkkkkkkkk..........",
    ".................kggggk......................ktttttyytttttttk............ktttttyytttttttk............kxxxxxxk...........",
    ".................kggggk.....................ktttttyyyyttttttk............ktttttyyyyttttttk...........kxxxxxxk...........",
    ".................kggggk.....................ktttttyyyyttttttk............ktttttyyyyttttttk............kkkkkk............",
    ".................kggggk......................ktttttyyttttttk..............ktttttyyttttttk.............kxxxxk............",
    ".................kggggk.......................kkttttttttkk.................kkttttttttkk..............kxxxxk............",
    // Rows 20 - 29: Headset, Hair & Skin for three staff members, Radio details
    ".................kggggk.........................kkkkkkkk.....................kkkkkkkk................kxxxxk............",
    ".................kggggk......................kkooooooooookk...............kkppppppppkk..............kxxxxk............",
    ".................kkkkkk.....................kooooooooooooook.............kppppppppppppk.............kxxxxk............",
    "................kmmmmmmk...................koooooooooooooooook...........kppppppppppppppk............kkkkkk............",
    "................kmmmmmmk..................koooooossssssoooooook.........kpppppxxxxxxxppppk...........kxxxxk............",
    "................kmmmmmmk..................koooossssssssssoooook.........kpppppxxxxxxxxpppk...........kxxxxk............",
    "................kkkkkkkk..................kooossssssssssssooook.........kpppxxxxxxxxxxxppk...........kxxxxk............",
    "...............kmmmmmmmmk.................koosssssssssssssooook.........kpppxxxxxxxxxxxppk...........kxxxxk............",
    "..............kmmmmmmmmmmk................koosssskkkkkssssssoook........kppxxxxxxxxxxxxxppk..........kxxxxk............",
    "..............kmmmmmmmmmmk................koossskwwkwwkssssssook........kppxxxxxxxxxxxxxppk..........kxxxxk............",
    // Rows 30 - 39: Eyes, Mouths, Headset cups, Walkie-talkie body
    "..............kmmmmmmmmmmk................koossskwwkwwkssssssook........kppxxkwwkwwkxxxxppk..........kxxxxk............",
    "..............kkkkkkkkkkkk................koosssssssssssssssoook........kppxxkwwkwwkxxxxppk..........kxxxxk............",
    ".............kmmmmmmmmmmmmk................kooossssssssssssooook.........kppxxxxxxxxxxxxxppk..........kxxxxk............",
    "............kmmmmmmmmmmmmmmk................koosssskrrksssssooook.........kppxxxxxxxxxxxxxppk..........kkkkkk............",
    "...........kmmmmmmmmmmmmmmmmk................koooskrrksssssooook..........kppxxxxkrrkxxxxppk............................",
    "...........kkkkkkkkkkkkkkkkkk.................kooossssssssooook...........kpppxxxkrrkxxxppk.............................",
    "...........kggkkkkkkkkkkkkggk..................koooooooooooook.............kpppxxxxxxxppk..............................",
    "...........kggkwwkwwwwwwkgggk...................kkkkkkkkkkkkk...............kpppppppppk................................",
    "...........kggkwwkwwwwwwkgggk................................................kkkkkkkkk.................................",
    "...........kkkkkkkkkkkkkkkkkk..........................................................................................",
    // Rows 40 - 49: Necks & Shoulder line start
    ".................kmmmmk..........................kkkkk........................kkkkk.....................................",
    ".................kmmmmk.........................ksssssk......................kxxxxxk....................................",
    ".................kmmmmk.........................ksssssk......................kxxxxxk....................................",
    "..................kkkk..........................ksssssk......................kxxxxxk....................................",
    "................kttttttk........................ksssssk......................kxxxxxk....................................",
    "...............kttttttttk........................kkkkk........................kkkkk.....................................",
    "..............kttttttttttk..............................................................................................",
    ".............kttttttttttttk...................kkkkkkkkkkk..................kkkkkkkkkkk..................................",
    "............kttttttttttttttk................ktttttttttttttk..............ktttttttttttttk................................",
    "...........kttttttttttttttttk..............kttttttttttttttttk............ktttttttttttttttk..............................",
    // Rows 50 - 59: Staff shirts, yellow lanyards, white sleeves
    "..........kttttttttttttttttttk............kttttttttttttttttttk..........kttttttttttttttttttk............................",
    ".........kttttttttttttttttttttk..........kttttttttttttttttttttk........kttttttttttttttttttttk...........................",
    "........ktttttwwwwwwwwwttttttttk........ktttttwwwwwwwwwttttttttk......ktttttwwwwwwwwwttttttttk..........................",
    ".......ktttttwwwwwwwwwwwttttttttk......ktttttwwwwwwwwwwwttttttttk....ktttttwwwwwwwwwwwttttttttk.........................",
    "......ktttttwwkkkwwkkkwwtttttttttk....ktttttwwkkkwwkkkwwtttttttttk..ktttttwwkkkwwkkkwwtttttttttk........................",
    ".....ktttttwwk...wk..kwtttttttttttk..ktttttwwk...wk..kwtttttttttttk.ktttttwwk...wk..kwtttttttttttk.......................",
    "....ktttttwwk.kkkk.k.kwttttttttttttk.ktttttwwk.kkkk.k.kwttttttttttttktttttwwk.kkkk.k.kwttttttttttttk......................",
    "....ktttttwwk.k..k.k.kwttttttttttttk.ktttttwwk.k..k.k.kwttttttttttttktttttwwk.k..k.k.kwttttttttttttk......................",
    "....ktttttwwk.kkkk.kkkwttttttttttttk.ktttttwwk.kkkk.kkkwttttttttttttktttttwwk.kkkk.kkkwttttttttttttk......................",
    "....ktttttwwk.........kwttttttttttttk.ktttttwwk.........kwttttttttttttktttttwwk.........kwttttttttttttk.....................",
    // Rows 60 - 69: "STAFF" text and ID Badge background
    "....ktttttyyyyyyyyyyyyyttttttttttttk.ktttttyyyyyyyyyyyyyttttttttttttktttttyyyyyyyyyyyyyttttttttttttk.....................",
    "....ktttttyywwywwywwywwyttttttttttttk.ktttttyywwywwywwywwyttttttttttttktttttyywwywwywwywwyttttttttttttk.....................",
    "....ktttttyywwywwywwywwyttttttttttttk.ktttttyywwywwywwywwyttttttttttttktttttyywwywwywwywwyttttttttttttk.....................",
    "....ktttttyywwywwywwywwyttttttttttttk.ktttttyywwywwywwywwyttttttttttttktttttyywwywwywwywwyttttttttttttk.....................",
    "....ktttttyyyyyyyyyyyyyttttttttttttk.ktttttyyyyyyyyyyyyyttttttttttttktttttyyyyyyyyyyyyyttttttttttttk.....................",
    "....kttttttttttttttttttttttttttttttk.kttttttttttttttttttttttttttttttkttttttttttttttttttttttttttttttk.....................",
    "....kttttttttttttttttttttttttttttttk.kttttttttttttttttttttttttttttttkttttttttttttttttttttttttttttttk.....................",
    "....kttttttttttttttttttttttttttttttk.kttttttttttttttttttttttttttttttkttttttttttttttttttttttttttttttk.....................",
    "....kttttttttttttttttttttttttttttttk.kttttttttttttttttttttttttttttttkttttttttttttttttttttttttttttttk.....................",
    "....kttttttttttttttttttttttttttttttk.kttttttttttttttttttttttttttttttkttttttttttttttttttttttttttttttk.....................",
    // Rows 70 - 79: Hanger bottom, ID badges
    "........ktttttyyyyytttttk................ktttttyyyyytttttk................ktttttyyyyytttttk.............................",
    "........ktttttyywwyyttttk................ktttttyywwyyttttk................ktttttyywwyyttttk.............................",
    "........ktttttyywwyyttttk................ktttttyywwyyttttk................ktttttyywwyyttttk.............................",
    "........ktttttyywwyyttttk................ktttttyywwyyttttk................ktttttyywwyyttttk.............................",
    "........ktttttyywwyyttttk................ktttttyywwyyttttk................ktttttyywwyyttttk.............................",
    "........ktttttyyyyyttttk................ktttttyyyyyttttk................ktttttyyyyyttttk.............................",
    "........kttttttttttttttk................kttttttttttttttk................kttttttttttttttk.............................",
    "........kttttttttttttttk................kttttttttttttttk................kttttttttttttttk.............................",
    "........kttttttttttttttk................kttttttttttttttk................kttttttttttttttk.............................",
    "........kkkkkkkkkkkkkkkk................kkkkkkkkkkkkkkkk................kkkkkkkkkkkkkkkk............................."
  ];

  // Map each character code to the exact colors matching the user's provided staff image
  const getColor = (char: string) => {
    switch (char) {
      case "k": return "#0a0a0a"; // soft true black outline
      case "t": return "#0ea5e9"; // beautiful teal/turquoise staff vest and cap
      case "d": return "#0369a1"; // deep turquoise shading
      case "y": return "#eab308"; // bright gold-yellow for lanyards and cap logo
      case "w": return "#ffffff"; // pure white for staff text, teeth, eyes, and ID card base
      case "s": return "#fed7aa"; // light skin tone (center staff)
      case "m": return "#7c2d12"; // left female warm brown skin / hair details
      case "x": return "#451a03"; // dark skin tone (right waving staff)
      case "r": return "#ef4444"; // friendly red mouth/smile
      case "o": return "#d97706"; // warm golden-brown hair for center staff
      case "p": return "#171717"; // jet-black hair & headset cups
      case "g": return "#525252"; // neutral gray for walkie talkie & shadow detail
      case "l": return "#cbd5e1"; // light-gray shading
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
