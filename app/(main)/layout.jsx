import React from "react";
import DashboardProvider from "../(main)/provider";

function DashboardLayout({ children }) {
  return (
    // <div className="bg-gradient-to-l from-blue-300 to-blue-50  p-10">
    <div className="bg-secondary  p-10">

      <DashboardProvider>
        <div className="">{children}</div>
      </DashboardProvider>
    </div>
  );
}

export default DashboardLayout;
