
import React from "react";
import Navbar from "./Navbar";
import { AppProvider } from "@/context/AppContext";
import { Toaster } from "@/components/ui/toaster";

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <AppProvider>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="container mx-auto px-4 py-6">{children}</main>
        <Toaster />
      </div>
    </AppProvider>
  );
};

export default Layout;
