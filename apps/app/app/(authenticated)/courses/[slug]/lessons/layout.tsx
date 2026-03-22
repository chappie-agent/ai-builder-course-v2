import type { ReactNode } from "react";

/**
 * Lesson layout — hides the global left sidebar so the lesson player
 * gets the full viewport width alongside its own Course Content panel.
 */
const LessonsLayout = ({ children }: { children: ReactNode }) => {
  return (
    <>
      {/* Hide the global sidebar (parent SidebarProvider + Sidebar) on this route */}
      <style>{`
        [data-slot="sidebar"] { display: none !important; }
        [data-slot="sidebar-inset"] { margin-left: 0 !important; }
      `}</style>
      {children}
    </>
  );
};

export default LessonsLayout;
