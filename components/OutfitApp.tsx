"use client";

import { useState } from "react";
import OutfitControls from "@/components/OutfitControls";
import Wardrobe from "@/components/Wardrobe";

// The parent of both sections. It owns wardrobeVersion ("lifting state up"),
// so a change in the wardrobe list can tell the outfit picker to refresh.
export default function OutfitApp() {
  const [wardrobeVersion, setWardrobeVersion] = useState(0);
  const bump = () => setWardrobeVersion((v) => v + 1);

  return (
    <>
      <OutfitControls wardrobeVersion={wardrobeVersion} />
      <Wardrobe wardrobeVersion={wardrobeVersion} onChange={bump} />
    </>
  );
}
