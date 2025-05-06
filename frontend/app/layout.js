"use client";

import "./globals.css";
import { usePathname } from "next/navigation";
import { AuthProvider } from "../context/AuthContext";
import { ToastContainer } from "react-toastify";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { useEffect } from "react";


export default function RootLayout({ children }) {
  const pathname = usePathname();
  const hideSidebar = pathname === "/" || pathname === "/home";

  useEffect(() => {
    document.title = "Stamurai TaskFlow";
  }, []);

  return (
    <html lang="en">
      <body className="bg-[#0f0f0f] text-white font-sans">
        <AuthProvider>
          <ToastContainer />
          <div className="flex h-screen">
            {!hideSidebar && <Sidebar />}
            <main className="flex-1 flex flex-col">
              <div className="w-full">
              <Navbar />

              </div>
              <div className="p-6 overflow-y-auto bg-[#111] rounded-tl-2xl shadow-inner overflow-auto">
                {children}
              </div>
            </main>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
