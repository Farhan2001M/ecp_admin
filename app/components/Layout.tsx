// components/Layout.tsx

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const pathname = usePathname(); // ✅ Correct way to get the active path in Next.js 15

  const menuItems = [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Categories", path: "/categories" },
    { name: "Products", path: "/products" },
    { name: "Orders", path: "/orders" },
    { name: "Settings", path: "/adminsettings" },
  ];

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 text-white p-5">
        <h2 className="text-xl font-bold mb-4 text-center">Admin Panel</h2>
        <ul>
          {menuItems.map((item) => (
            <li key={item.path}>
              <Link href={item.path} legacyBehavior>
                <a
                  className={`block p-3 cursor-pointer rounded-lg my-1 ${
                    pathname === item.path ? "bg-gray-600 text-white font-semibold w-full block" : "hover:bg-gray-700"
                  }`}
                >
                  {item.name}
                </a>
              </Link>
            </li>
          ))}
        </ul>
      </aside>

      {/* Main Content (Full Background on Active Page) */}
      <main className="flex-1">
        <div className="bg-gray-100 h-full p-6">{children}</div>
      </main>
    </div>
  );
};

export default Layout;
