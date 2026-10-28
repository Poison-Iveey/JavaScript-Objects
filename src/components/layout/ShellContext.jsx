import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth.js";
import { useJournal } from "../../hooks/useJournal.js";
import { useLibrary } from "../../hooks/useLibrary.js";
import { shrinkImage } from "../../utils/images.js";

// App-shell UI state shared by the sidebar, pages and modals: responsive
// layout, the drawer, the add-book and book-detail modals, image picking
// (click-to-browse and drop-anywhere) and a small toast for failures.

const ShellContext = createContext(null);

export const MOBILE_BREAKPOINT = 760;
const emptyDraft = () => ({ img: null, file: null, title: "", author: "", pages: "", status: "reading" });

export function ShellProvider({ children }) {
  const { pathname } = useLocation();
  const { updateProfile } = useAuth();
  const journal = useJournal();
  const library = useLibrary();

  const [mobile, setMobile] = useState(() => window.innerWidth < MOBILE_BREAKPOINT);
  const [drawer, setDrawer] = useState(false);
  const [collapsed, setCollapsed] = useState(() => !!journal.settings.startCollapsed);
  const [addOpen, setAddOpen] = useState(false);
  const [draft, setDraft] = useState(emptyDraft);
  const [detailId, setDetailId] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [toast, setToast] = useState(null);
  const fileRef = useRef(null);
  const fileTarget = useRef("new");
  const dragDepth = useRef(0);

  const notify = useCallback((message) => {
    setToast(message);
    window.clearTimeout(notify.t);
    notify.t = window.setTimeout(() => setToast(null), 3200);
  }, []);

  useEffect(() => {
    const onResize = () => setMobile(window.innerWidth < MOBILE_BREAKPOINT);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // Navigating, or crossing the mobile breakpoint, closes the drawer.
  useEffect(() => setDrawer(false), [pathname, mobile]);

  const openAdd = useCallback((img = null, file = null) => {
    setDraft({ ...emptyDraft(), img, file });
    setAddOpen(true);
  }, []);

  const takeImage = useCallback(
    async (file, target) => {
      try {
        if (target === "art") {
          const { dataUrl } = await shrinkImage(file, 600);
          journal.setSideArt(dataUrl);
          return;
        }
        const { dataUrl, file: small } = await shrinkImage(file);
        if (target === "new") openAdd(dataUrl, small);
        else if (target === "add") setDraft((d) => ({ ...d, img: dataUrl, file: small }));
        else if (target === "detail" && detailId) await library.setCover(detailId, small);
        else if (target === "avatar") await updateProfile({ avatarFile: small });
      } catch (err) {
        notify(err.message || "Couldn't use that image.");
      }
    },
    [detailId, journal, library, notify, openAdd, updateProfile]
  );

  const pickImage = useCallback((target) => {
    fileTarget.current = target;
    const el = fileRef.current;
    if (el) {
      el.value = "";
      el.click();
    }
  }, []);

  // Drop an image anywhere: it becomes the new book's cover, the open
  // book's cover, or your profile photo, depending on what's on screen.
  const dropTarget = addOpen ? "add" : detailId ? "detail" : pathname.startsWith("/profile") ? "avatar" : "new";
  const dropTargetRef = useRef(dropTarget);
  dropTargetRef.current = dropTarget;

  useEffect(() => {
    const hasFiles = (e) => e.dataTransfer && Array.from(e.dataTransfer.types || []).includes("Files");
    const onEnter = (e) => {
      if (!hasFiles(e)) return;
      dragDepth.current++;
      setDragging(true);
    };
    const onOver = (e) => {
      if (hasFiles(e)) e.preventDefault();
    };
    const onLeave = (e) => {
      if (!hasFiles(e)) return;
      dragDepth.current = Math.max(0, dragDepth.current - 1);
      if (!dragDepth.current) setDragging(false);
    };
    const onDrop = (e) => {
      if (!hasFiles(e)) return;
      e.preventDefault();
      dragDepth.current = 0;
      setDragging(false);
      // A drop on the sidebar artwork is handled there.
      if (e.target.closest?.("[data-drop-art]")) return;
      const f = Array.from(e.dataTransfer.files).find((x) => x.type.startsWith("image/"));
      if (f) takeImage(f, dropTargetRef.current);
    };
    window.addEventListener("dragenter", onEnter);
    window.addEventListener("dragover", onOver);
    window.addEventListener("dragleave", onLeave);
    window.addEventListener("drop", onDrop);
    return () => {
      window.removeEventListener("dragenter", onEnter);
      window.removeEventListener("dragover", onOver);
      window.removeEventListener("dragleave", onLeave);
      window.removeEventListener("drop", onDrop);
    };
  }, [takeImage]);

  const dropLabel = addOpen
    ? "Drop to use as the cover"
    : detailId
      ? "Drop to replace this cover"
      : pathname.startsWith("/profile")
        ? "Drop to set your profile photo"
        : "Drop the cover to add a book";

  const value = useMemo(
    () => ({
      mobile,
      drawer,
      openDrawer: () => setDrawer(true),
      closeDrawer: () => setDrawer(false),
      collapsed,
      toggleCollapsed: () => setCollapsed((c) => !c),
      addOpen,
      draft,
      setDraft,
      openAdd,
      closeAdd: () => setAddOpen(false),
      detailId,
      openDetail: setDetailId,
      closeDetail: () => setDetailId(null),
      pickImage,
      takeImage,
      dragging,
      dropLabel,
      toast,
      notify,
    }),
    [mobile, drawer, collapsed, addOpen, draft, openAdd, detailId, pickImage, takeImage, dragging, dropLabel, toast, notify]
  );

  return (
    <ShellContext.Provider value={value}>
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        onChange={(e) => {
          const f = e.target.files && e.target.files[0];
          if (f) takeImage(f, fileTarget.current);
        }}
      />
      {children}
    </ShellContext.Provider>
  );
}

export function useShell() {
  const ctx = useContext(ShellContext);
  if (!ctx) throw new Error("useShell must be used within a ShellProvider.");
  return ctx;
}
