import "./layout.scss";
import React from "react";
import Sidenav from "@/components/navigation/sidenav";

export default function Layout({children}: Readonly<{ children: React.ReactNode; }>) {
  return (
      <div className={"container"}>
          <div className={"sidebar"}>
              <Sidenav/>
          </div>
          <div className={"content"}>
        {children}
          </div>
      </div>
  );
}
