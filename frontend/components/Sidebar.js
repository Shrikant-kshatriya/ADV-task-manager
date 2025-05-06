"use client";

import Link from "next/link";
import { useContext } from "react";
import { useRouter, usePathname } from "next/navigation";
import { AuthContext } from "@/context/AuthContext";
import { LayoutDashboard, ShieldCheck, PlusCircle } from "lucide-react";

export default function Sidebar() {
  const { user } = useContext(AuthContext);
  const router = useRouter();
  const pathname = usePathname();

  if (!user) return null;

  const navItemStyle = (path) =>
    `flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-200
     ${
       pathname === path
         ? "bg-gray-800 text-white"
         : "text-gray-300 hover:text-white hover:bg-gray-800"
     }`;

  return (
    <aside className="w-64 min-h-screen bg-gray-950 text-gray-200 p-6 shadow-xl border-r border-gray-800 flex flex-col justify-between">
      <div>
        <div
          onClick={() => router.push("/")}
          className="text-3xl font-bold text-white text-center mb-8 cursor-pointer hover:text-green-400 transition"
        >
          TaskFlow
        </div>

        <div className="space-y-2 text-sm font-medium">
          <span className="text-gray-500 text-xs px-2">Main</span>
          <Link href="/dashboard" className={navItemStyle("/dashboard")}>
            <LayoutDashboard className="w-5 h-5" />
            <span>Dashboard</span>
          </Link>

          <Link href="/create-task" className={navItemStyle("/create-task")}>
            <PlusCircle className="w-5 h-5" />
            <span>Create Task</span>
          </Link>

          {(user.role === "admin" || user.role === "manager") && (
            <Link href="/team" className={navItemStyle("/team")}>
              <ShieldCheck className="w-5 h-5" />
              <span>Team</span>
            </Link>
          )}
        </div>
      </div>
    </aside>
  );
}
