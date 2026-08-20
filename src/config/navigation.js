import { BookMarked, Heart, Library, PenLine, Settings, Tags } from "lucide-react";

export const NAV_ITEMS = [
  { to: "/library", label: "Library", icon: Library },
  { to: "/reading", label: "Currently Reading", icon: PenLine },
  { to: "/favorites", label: "Favorites", icon: Heart },
  { to: "/authors", label: "Authors", icon: BookMarked },
  { to: "/genres", label: "Genres", icon: Tags },
  { to: "/settings", label: "Settings", icon: Settings },
];

export const PRIMARY_MOBILE_NAV = ["/library", "/reading", "/settings"];
