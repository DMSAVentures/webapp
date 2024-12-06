import "./layout.scss";
import React from "react";
import {Providers} from "@/contexts/providers";
import {UIShellWithCollapsibleNavigation} from "@/components/simpleui/UIShell/Shell/UIShellWithCollapsibleNavigation";

export default function Layout({children}: Readonly<{ children: React.ReactNode; }>) {
  return (
      <Providers>
          <UIShellWithCollapsibleNavigation logo={"DMSA"}>
              {children}
          </UIShellWithCollapsibleNavigation>
      </Providers>
  );
}
