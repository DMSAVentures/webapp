import "./layout.scss";
import React from "react";
import Sidenav from "@/components/navigation/sidenav";
import {Providers} from "@/contexts/providers";

export default function Layout({children}: Readonly<{ children: React.ReactNode; }>) {
  return (
      <Providers>
      <div className={"container"}>
          <div className={"sidebar"}>
              <Sidenav/>
          </div>
          <div className={"content"}>
        {children}
          </div>
      </div>
      </Providers>
  );
}
