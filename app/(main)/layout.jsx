import React from "react";
import DashboardProvider from "../(main)/provider";

function DashboardLayout({ children }) {
  return (
    // <div className="bg-gradient-to-l from-blue-300 to-blue-50  p-10">
    <div className="bg-secondary  p-10">
      {/* <div className="min-h-screen bg-gradient-to-b from-purple-700 via-purple-800 to-gray-800"> */}
      {/* <div className="min-h-screen bg-black/20 backdrop-blur-sm"> */}
      <DashboardProvider>
        <div className="">{children}</div>
      </DashboardProvider>
    </div>
    // </div>
    // </div>
  );
}

export default DashboardLayout;
