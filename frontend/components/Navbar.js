"use client";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { User } from "lucide-react";
import NotificationDropdown from "./NotificationDropdown";
import { usePathname, useRouter } from "next/navigation";

export default function Navbar() {
  const { user, logout } = useAuth(); 
  const router = useRouter();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const pathname = usePathname();
    const hideLogo = pathname === "/" || pathname === "/home";

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="flex items-center justify-between px-6 py-4 bg-[#121212] shadow border-b border-gray-800">
      <div className="text-white text-xl font-bold tracking-wide cursor-pointer" onClick={() => router.push('/')}>{hideLogo ? "TaskFlow" : ""}</div>

      {user ? (
        <div className="flex items-center gap-6">
          <NotificationDropdown />
          <div className="relative" ref={dropdownRef}>
            <button
              className="flex items-center gap-2 text-white hover:text-gray-300"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              <User className="w-5 h-5" />
              <span className="text-sm">{user?.username}</span>
            </button>
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-[#1f1f1f] text-white shadow-lg rounded p-2 text-sm">
                <button
                  onClick={logout}
                  className="w-full text-left hover:bg-[#2a2a2a] rounded px-3 py-1"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="flex gap-4">
          <Link
            href="/login"
            className="text-sm px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white font-medium transition"
          >
            Login
          </Link>
          <Link
            href="/register"
            className="text-sm px-4 py-2 rounded bg-gray-800 hover:bg-gray-700 text-white font-medium border border-gray-600 transition"
          >
            Register
          </Link>
        </div>
      )}
    </nav>
  );
}
