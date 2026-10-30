import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Phone,
  Mail,
  ShieldCheck,
  Award,
  Stethoscope,
  MessageCircle,
} from "lucide-react";
import { ROUTES } from "@/routes";

export const PublicFooter: React.FC = () => {
  const currentLocation = useLocation();
  const isHomePage = currentLocation.pathname === ROUTES.PUBLIC.HOME;

  return (
    <footer
      className={`playpen-sans ${
        isHomePage ? "bg-[#FFF2F0] md:bg-white" : "bg-white"
      }`}
    >
      <div className="w-[85%] md:w-[80%] mx-auto pb-10 md:pb-16 pt-6">
        {/* Top Tagline Divider Bar */}
        <div className="w-[95%] md:w-[75%] lg:w-[70%] mx-auto border-t-2 border-b-2 border-stone-300 py-3 md:py-5 mb-10">
          <div className="flex items-center justify-between w-[90%] md:w-[80%] mx-auto">
            <h2 className="text-center font-bold text-base md:text-2xl text-stone-900 tracking-tight">
              Elpima Surgicals Is Here For You
            </h2>
            <div className="w-12 h-12 md:w-14 md:h-14 rounded-full p-2.5 flex items-center justify-center border-2 border-teal-600 text-teal-600 bg-teal-50">
              <Stethoscope className="w-6 h-6 md:w-7 md:h-7" />
            </div>
          </div>
        </div>

        {/* 3-Column Navigation Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 border-b-2 border-stone-200 pb-8 mb-8 gap-8">
          {/* Column 1: Brand & Overview */}
          <div className="space-y-4">
            <Link to={ROUTES.PUBLIC.HOME} className="inline-flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-teal-600 text-white flex items-center justify-center font-bold shadow-sm">
                ES
              </div>
              <div>
                <span className="font-extrabold text-xl text-teal-900 tracking-tight block">
                  ELPIMA
                </span>
                <span className="text-[10px] uppercase tracking-widest text-[#D4AF37] font-semibold block -mt-1">
                  Surgicals Limited
                </span>
              </div>
            </Link>

            <p className="text-stone-600 font-light tracking-wide text-sm leading-relaxed pr-0 md:pr-6">
              Elpima Surgicals equips teaching hospitals, medical centers, and surgical suites across Nigeria with ISO & CE certified surgical instrumentation, theatre apparatus, and nationwide biomedical engineering maintenance.
            </p>

            <div className="flex flex-wrap items-center gap-2 pt-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-[#FFF2F0] text-teal-800 border border-teal-200">
                <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
                NAFDAC Regulated
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-[#FAF6EE] text-[#8E702D] border border-[#D4AF37]/30">
                <Award className="w-3.5 h-3.5 text-[#D4AF37]" />
                ISO 13485 Standards
              </span>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="flex flex-col justify-start space-y-6 pt-2 md:pt-4">
            <h3 className="font-semibold text-stone-900 text-base tracking-wider uppercase">
              Quick Navigation
            </h3>
            <div className="grid grid-cols-2 gap-y-3.5 gap-x-6 text-sm font-light text-stone-700">
              <Link
                to={ROUTES.PUBLIC.CATALOG}
                className="hover:text-teal-600 transition-colors"
              >
                Equipment Catalog
              </Link>
              <Link
                to={ROUTES.PUBLIC.ABOUT}
                className="hover:text-teal-600 transition-colors"
              >
                About Us
              </Link>
              <Link
                to={ROUTES.PUBLIC.CONTACT}
                className="hover:text-teal-600 transition-colors"
              >
                Contact & Support
              </Link>
              <Link
                to={ROUTES.PUBLIC.QUOTE_REQUEST}
                className="hover:text-teal-600 transition-colors font-medium text-teal-700"
              >
                Request RFQ Quote
              </Link>
              <Link
                to={ROUTES.PUBLIC.SAFETY_COMPLIANCE}
                className="hover:text-teal-600 transition-colors"
              >
                Safety & Compliance
              </Link>
              <Link
                to={ROUTES.PUBLIC.PRIVACY_POLICY}
                className="hover:text-teal-600 transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                to={ROUTES.PUBLIC.TERMS_OF_USE}
                className="hover:text-teal-600 transition-colors"
              >
                Terms of Use
              </Link>
              <Link
                to={ROUTES.AUTH.ROOT}
                className="hover:text-teal-600 transition-colors text-stone-500"
              >
                Staff Portal
              </Link>
            </div>
          </div>

          {/* Column 3: Contact Channels & Immediate Assistance */}
          <div className="space-y-4 pt-2 md:pt-4">
            <h3 className="font-semibold text-stone-900 text-base tracking-wider uppercase">
              Direct Contact
            </h3>
            <div className="space-y-3 text-sm text-stone-700 font-light">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-teal-50 text-teal-600 flex items-center justify-center shrink-0">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <a
                    href="tel:+234800357462"
                    className="hover:text-teal-700 font-medium text-stone-900 block"
                  >
                    +234 (0) 800-ELPIMA
                  </a>
                  <span className="text-xs text-stone-500">
                    Direct Line: +234 814 990 0112
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#FAF6EE] text-[#8E702D] flex items-center justify-center shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <a
                    href="mailto:procurement@elpimasurgicals.com"
                    className="hover:text-teal-700 block text-stone-900"
                  >
                    procurement@elpimasurgicals.com
                  </a>
                  <span className="text-xs text-stone-500">
                    Inquiries & Official Purchase Orders
                  </span>
                </div>
              </div>

              <div className="pt-2">
                <a
                  href="https://wa.me/2348149900112?text=Hello%20Elpima%20Surgicals,%20I%20would%20like%20to%20request%20information%20on%20medical%20equipment"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#25D366] text-white text-xs font-semibold hover:bg-[#1EBE5D] transition-colors shadow-sm"
                >
                  <MessageCircle className="w-4 h-4" />
                  Chat on WhatsApp Procurement
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Copyright and National Supply Indicator */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-light text-stone-600">
          <div>
            <p>
              &copy; {new Date().getFullYear()} All rights reserved.{" "}
              <span className="text-teal-700 font-medium">
                Elpima Surgicals Limited
              </span>
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-normal text-stone-700">
              Supplying Healthcare Across Nigeria
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-semibold text-[11px]">
              NG 🇳🇬
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default PublicFooter;
