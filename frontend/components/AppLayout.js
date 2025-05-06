"use client";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

const AppLayout = ({ children }) => {
  return (
    <div className="flex h-screen w-full bg-[#0f0f0f] text-white">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-y-auto p-4">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
