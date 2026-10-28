// Sidebar groups and the mobile tab bar. `key` identifies the nav item that
// lights up; `to` is its route.
export const NAV_GROUPS = [
  {
    label: "Reading",
    items: [
      { key: "dash", label: "Dashboard", icon: "grid", to: "/dashboard" },
      { key: "lib", label: "Library", icon: "shelf", to: "/library" },
      { key: "log", label: "Reading Log", icon: "log", to: "/log" },
      { key: "quotes", label: "Quotes & Notes", icon: "quote", to: "/quotes" },
      { key: "chal", label: "Challenges", icon: "heart", to: "/challenges" },
      { key: "want", label: "Wishlist", icon: "star", to: "/wishlist" },
    ],
  },
  {
    label: "Community",
    items: [
      { key: "social", label: "Social", icon: "people", to: "/social" },
      { key: "msgs", label: "Messages", icon: "chat", to: "/messages" },
      { key: "blog", label: "Blog", icon: "blog", to: "/blog" },
    ],
  },
  {
    label: "Account",
    items: [
      { key: "profile", label: "Profile", icon: "user", to: "/profile" },
      { key: "settings", label: "Settings", icon: "gear", to: "/settings" },
      { key: "about", label: "About us", icon: "info", to: "/about" },
    ],
  },
];

export const TAB_BAR = [
  { key: "dash", label: "Home", icon: "grid", to: "/dashboard" },
  { key: "lib", label: "Library", icon: "shelf", to: "/library" },
  { key: "add" },
  { key: "msgs", label: "Messages", icon: "chat", to: "/messages" },
  { key: "profile", label: "Profile", icon: "user", to: "/profile" },
];

// Route prefix → nav key, page title and mobile bar title.
export const PAGES = [
  { path: "/dashboard", key: "dash", title: "Literary Journey Readers Dashboard", mobileTitle: "Literary Journey" },
  { path: "/library", key: "lib", title: "Library" },
  { path: "/wishlist", key: "want", title: "Wishlist" },
  { path: "/log", key: "log", title: "Reading Log" },
  { path: "/quotes", key: "quotes", title: "Quotes & Notes" },
  { path: "/challenges", key: "chal", title: "Reading Challenges" },
  { path: "/social", key: "social", title: "Social" },
  { path: "/readers", key: "social", title: "Reader" },
  { path: "/messages", key: "msgs", title: "Messages" },
  { path: "/blog", key: "blog", title: "Blog" },
  { path: "/profile", key: "profile", title: "Profile" },
  { path: "/settings", key: "settings", title: "Settings" },
  { path: "/about", key: "about", title: "About us" },
];

export function pageFor(pathname) {
  return PAGES.find((p) => pathname === p.path || pathname.startsWith(p.path + "/")) ?? PAGES[0];
}
