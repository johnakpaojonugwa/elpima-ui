import React, { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { PublicNavbar } from "./public-navbar";
import { PublicFooter } from "./public-footer";

interface PublicLayoutProps {
  children?: React.ReactNode;
}

export const PublicLayout: React.FC<PublicLayoutProps> = ({ children }) => {
  const currentLocation = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentLocation.pathname]);

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-stone-900 font-sans antialiased selection:bg-teal-600 selection:text-white">
      <PublicNavbar />
      <main className="flex-1">
        {children ? children : <Outlet />}
      </main>
      <PublicFooter />
    </div>
  );
};

export default PublicLayout;

