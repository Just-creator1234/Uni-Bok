"use client";

import { useState } from "react";
import Sidebar from "./Sidebar";
import { Menu, X } from "lucide-react";

export default function SidebarDrawer() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* 🔹 Hamburger Button (Mobile Only) */}
      <button
        onClick={() => setOpen(true)}
        className="absolute top-4 left-4 z-40 md:hidden bg-white p-2 rounded shadow"
      >
        <Menu size={20} />
      </button>

      {/* 🔹 Desktop Sidebar */}
      <aside className="hidden md:block w-64 bg-white border-r border-gray-200 shadow-md p-4">
        <Sidebar />
      </aside>

      {/* 🔹 Mobile Sidebar */}
      {open && (
        <div className="fixed inset-0 z-50 flex">
          {/* Overlay */}
          <div
            className="absolute inset-0 bg-black bg-opacity-30"
            onClick={() => setOpen(false)}
          />

          {/* Sidebar Panel */}
          <div className="relative w-64 bg-white shadow-md z-50 p-4">
            <button
              className="absolute top-4 right-4"
              onClick={() => setOpen(false)}
            >
              <X size={20} />
            </button>

            {/* Pass close handler to Sidebar */}
            <Sidebar onLinkClick={() => setOpen(false)} />
          </div>
        </div>
      )}
    </>
  );
}
