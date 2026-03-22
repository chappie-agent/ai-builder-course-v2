"use client";

import { Button } from "@repo/design-system/components/ui/button";
import { PanelLeftIcon } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

export function SidebarToggle() {
  const [collapsed, setCollapsed] = useState(false);

  const toggle = useCallback(() => {
    setCollapsed((prev) => {
      const next = !prev;
      document.documentElement.setAttribute("data-sidebar-collapsed", String(next));
      return next;
    });
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("data-sidebar-collapsed", String(collapsed));
  }, [collapsed]);

  return (
    <Button
      variant="ghost"
      size="icon"
      className="h-8 w-8 text-[#8b7355] hover:bg-[#f0e9dd] hover:text-[#2c231a]"
      onClick={toggle}
      aria-label={collapsed ? "Toon sidebar" : "Verberg sidebar"}
    >
      <PanelLeftIcon className="h-4 w-4" />
    </Button>
  );
}
