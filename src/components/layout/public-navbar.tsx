import React, { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  ChevronDown,
  ChevronUp,
  FileText,
  Info,
  Menu,
  Phone,
  ShieldCheck,
  ShoppingBag,
  Stethoscope,
  X,
} from "lucide-react";
import { ROUTES } from "@/routes";
import { useQuoteBagStore } from "@/store/quote-bag-store";

export const PublicNavbar: React.FC = () => {
  const [isAboutDropdownOpen, setIsAboutDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const mobileMenuRef = useRef<HTMLDivElement | null>(null);
  const location = useLocation();

  const quoteItems = useQuoteBagStore((state) => state.items);
  const totalQuoteCount = quoteItems.reduce(
    (accumulator, currentItem) => accumulator + currentItem.quantity,
    0,
  );

  const isHomePage = location.pathname === ROUTES.PUBLIC.HOME;

  // Handle clicking outside the About dropdown or mobile menu
  useEffect(() => {
    const handleClickOutside = (clickEvent: MouseEvent) => {
      const targetElement = clickEvent.target as Node;
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(targetElement)
      ) {
        setIsAboutDropdownOpen(false);
      }
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(targetElement) &&
        !(clickEvent.target as HTMLElement).closest(".mobile-menu-toggle")
      ) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Prevent background scrolling when mobile drawer is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  return (
    <>
      <nav
        className={`px-4 w-full xl:w-[85%] xl:mx-auto playpen-sans justify-between items-center absolute z-50 left-1/2 transform -translate-x-1/2 top-4 flex`}
      >
        {/* Brand Logo & Mobile Toggle */}
        <div className="w-full md:w-fit flex items-center justify-between">
          <Link to={ROUTES.PUBLIC.HOME} className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-teal-600 text-white flex items-center justify-center shadow-md">
              <Stethoscope className="w-5 h-5" />
            </div>
            <div>
              <span
                className={`font-bold text-xl tracking-tight ${
                  isHomePage ? "text-white" : "text-stone-900"
                }`}
              >
                Elpima
                <span className="text-[#D4AF37] ml-1 text-sm font-semibold uppercase tracking-wider">
                  Surgicals
                </span>
              </span>
            </div>
          </Link>

          {/* Circular Mobile Menu Toggle (get-treat-ui signature style) */}
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen((isCurrentlyOpen) => !isCurrentlyOpen)}
            className={`w-9 h-9 flex md:hidden items-center justify-center border-2 rounded-full mobile-menu-toggle cursor-pointer transition-colors ${
              isHomePage
                ? "border-white/80 text-white hover:bg-white/10"
                : "border-teal-600 text-teal-700 hover:bg-teal-50"
            }`}
            aria-label="Toggle Navigation Menu"
          >
            {isMobileMenuOpen ? (
              <X className="text-xl" />
            ) : (
              <Menu className="text-lg" />
            )}
          </button>
        </div>

        {/* Desktop Navigation Links (get-treat-ui signature style) */}
        <div
          className={`hidden md:flex items-center justify-end ${
            isHomePage ? "text-white" : "text-stone-900"
          }`}
        >
          {/* Main Links with Divider */}
          <div
            className={`flex gap-8 lg:gap-10 md:text-[14px] lg:text-[15px] items-center pr-8 lg:pr-10 py-1 border-r-2 ${
              isHomePage ? "border-white/40" : "border-stone-300"
            }`}
          >
            <Link
              to={ROUTES.PUBLIC.CATALOG}
              className="hover:text-teal-400 transition-colors"
            >
              Equipment Catalog
            </Link>

            {/* About Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <div
                className="flex items-center gap-1.5 cursor-pointer hover:text-teal-400 transition-colors select-none"
                onClick={() =>
                  setIsAboutDropdownOpen((isCurrentlyOpen) => !isCurrentlyOpen)
                }
              >
                <span>About Us</span>
                {isAboutDropdownOpen ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </div>

              {isAboutDropdownOpen && (
                <div className="absolute top-[130%] left-1/2 transform -translate-x-1/2 mt-2 w-60 bg-white rounded-xl py-2 shadow-xl border border-stone-100 overflow-hidden z-50 text-stone-800">
                  <Link
                    to={ROUTES.PUBLIC.ABOUT}
                    className="px-4 py-2.5 hover:bg-teal-50 hover:text-teal-700 flex items-center gap-3 text-sm font-medium transition-colors"
                    onClick={() => setIsAboutDropdownOpen(false)}
                  >
                    <Info className="w-4 h-4 text-teal-600" />
                    <span>About Elpima</span>
                  </Link>
                  <Link
                    to={ROUTES.PUBLIC.SAFETY_COMPLIANCE}
                    className="px-4 py-2.5 hover:bg-teal-50 hover:text-teal-700 flex items-center gap-3 text-sm font-medium transition-colors"
                    onClick={() => setIsAboutDropdownOpen(false)}
                  >
                    <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
                    <span>Safety & ISO Compliance</span>
                  </Link>
                  <Link
                    to={ROUTES.PUBLIC.CONTACT}
                    className="px-4 py-2.5 hover:bg-teal-50 hover:text-teal-700 flex items-center gap-3 text-sm font-medium transition-colors"
                    onClick={() => setIsAboutDropdownOpen(false)}
                  >
                    <Phone className="w-4 h-4 text-[#E07A5F]" />
                    <span>Contact Clinical Desk</span>
                  </Link>
                </div>
              )}
            </div>

            <Link
              to={ROUTES.PUBLIC.CONTACT}
              className="hover:text-teal-400 transition-colors"
            >
              Contact
            </Link>
          </div>

          {/* Right Action Cluster */}
          <div className="flex items-center gap-5 lg:gap-7 pl-6 lg:pl-8">
            {/* WhatsApp Quick Chat */}
            <a
              href="https://wa.me/2348149900112?text=Hello%20Elpima%20Surgicals,%20I%20would%20like%20to%20inquire%20about%20hospital%20equipment."
              target="_blank"
              rel="noopener noreferrer"
              className={`hover:text-teal-400 text-xs font-semibold flex items-center gap-1 transition-colors ${
                isHomePage ? "text-[#D4AF37]" : "text-[#8E702D]"
              }`}
              title="Chat with Clinical Desk on WhatsApp"
            >
              <span>WhatsApp RFQ</span>
            </a>

            {/* Quote Bag Icon with Badge */}
            <Link
              to={ROUTES.PUBLIC.QUOTE_REQUEST}
              className="relative p-1.5 rounded-lg hover:opacity-80 transition-opacity"
              title="Inspect Quote Request Bag"
            >
              <ShoppingBag className="w-5 h-5 text-teal-500" />
              {totalQuoteCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#E07A5F] text-[10px] font-bold text-white shadow-xs">
                  {totalQuoteCount}
                </span>
              )}
            </Link>

            {/* Staff Portal Login */}
            <Link
              to={ROUTES.AUTH.ROOT}
              className="md:text-sm lg:text-sm hover:underline font-medium"
            >
              Staff Portal
            </Link>

            {/* Primary Action Button (get-treat-ui style) */}
            <Link
              to={ROUTES.PUBLIC.QUOTE_REQUEST}
              className="bg-teal-600 hover:bg-teal-700 text-white py-2 px-4 rounded-xl text-xs sm:text-sm font-semibold shadow-md transition-colors flex items-center gap-1.5"
            >
              <FileText className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Get Proforma Quote</span>
            </Link>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer (get-treat-ui signature style) */}
      {isMobileMenuOpen && (
        <div
          ref={mobileMenuRef}
          className="fixed inset-0 z-50 bg-[#FAF8F5] playpen-sans flex flex-col justify-between p-6 sm:p-8 animate-in fade-in duration-200"
        >
          <div className="flex items-center justify-between pb-6 border-b border-stone-200">
            <Link
              to={ROUTES.PUBLIC.HOME}
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-2"
            >
              <div className="w-8 h-8 rounded-lg bg-teal-600 text-white flex items-center justify-center">
                <Stethoscope className="w-4 h-4" />
              </div>
              <span className="font-bold text-lg text-stone-900">
                Elpima <span className="text-[#D4AF37]">Surgicals</span>
              </span>
            </Link>
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(false)}
              className="w-8 h-8 rounded-full border border-stone-300 flex items-center justify-center text-stone-700"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex flex-col space-y-5 py-8 text-lg font-medium text-stone-800">
            <Link
              to={ROUTES.PUBLIC.HOME}
              onClick={() => setIsMobileMenuOpen(false)}
              className="hover:text-teal-700 transition-colors"
            >
              Home
            </Link>
            <Link
              to={ROUTES.PUBLIC.CATALOG}
              onClick={() => setIsMobileMenuOpen(false)}
              className="hover:text-teal-700 transition-colors"
            >
              Equipment Catalog
            </Link>
            <Link
              to={ROUTES.PUBLIC.ABOUT}
              onClick={() => setIsMobileMenuOpen(false)}
              className="hover:text-teal-700 transition-colors"
            >
              About Us
            </Link>
            <Link
              to={ROUTES.PUBLIC.SAFETY_COMPLIANCE}
              onClick={() => setIsMobileMenuOpen(false)}
              className="hover:text-teal-700 transition-colors"
            >
              Safety & Compliance
            </Link>
            <Link
              to={ROUTES.PUBLIC.CONTACT}
              onClick={() => setIsMobileMenuOpen(false)}
              className="hover:text-teal-700 transition-colors"
            >
              Contact Hospital Desk
            </Link>
            <Link
              to={ROUTES.PUBLIC.QUOTE_REQUEST}
              onClick={() => setIsMobileMenuOpen(false)}
              className="hover:text-teal-700 transition-colors flex items-center justify-between"
            >
              <span>Quote Request Bag</span>
              <span className="px-2 py-0.5 rounded-full bg-[#E07A5F] text-white text-xs font-bold">
                {totalQuoteCount}
              </span>
            </Link>
          </div>

          <div className="space-y-3 pt-6 border-t border-stone-200">
            <Link
              to={ROUTES.PUBLIC.QUOTE_REQUEST}
              onClick={() => setIsMobileMenuOpen(false)}
              className="w-full block text-center bg-teal-600 hover:bg-teal-700 text-white py-3 rounded-xl font-bold text-sm shadow-md"
            >
              Request Proforma Quote
            </Link>
            <Link
              to={ROUTES.AUTH.ROOT}
              onClick={() => setIsMobileMenuOpen(false)}
              className="w-full block text-center border border-stone-300 text-stone-700 py-3 rounded-xl font-medium text-sm"
            >
              Staff Portal Login
            </Link>
          </div>
        </div>
      )}
    </>
  );
};

export default PublicNavbar;
