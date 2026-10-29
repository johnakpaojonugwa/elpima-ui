import React from "react";
import { useNavigate } from "react-router-dom";

export interface HeroSectionProps {
  onPartnerClick?: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onPartnerClick }) => {
  const navigate = useNavigate();

  return (
    <div className="relative w-full h-full min-h-[420px] lg:min-h-full flex flex-col justify-between p-6 sm:p-10 lg:p-14 overflow-hidden select-none bg-stone-900">
      {/* Background Medical/Surgical Photography with Deep Contrast Overlay */}
      <img
        src="https://images.unsplash.com/photo-1516549655169-df83a0774514?q=80&w=1600&auto=format&fit=crop"
        alt="Modern clinical surgical theatre and diagnostic medical equipment"
        referrerPolicy="no-referrer"
        className="absolute inset-0 w-full h-full object-cover object-center scale-105 transition-transform duration-1000 ease-out"
      />

      {/* Dark Vignette & Gradient Overlays for High Legibility */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/45 to-black/65 pointer-events-none" />
      <div className="absolute inset-0 bg-emerald-950/25 mix-blend-multiply pointer-events-none" />

      {/* Brand Header */}
      <div className="relative z-10 flex items-center justify-between">
        <div
          onClick={() => navigate("/")}
          role="button"
          tabIndex={0}
          className="flex items-center gap-2 group cursor-pointer"
        >
          <div className="flex items-center">
            <div className="relative">
              <div className="absolute -top-2 left-0 w-7 h-2.5 border-t-[3.5px] border-l-[3.5px] border-[#3FA46A] rounded-tl-full rounded-tr-full transform -rotate-12" />
              <span className="font-extrabold text-2xl tracking-tight text-[#EE6427]">
                Elp<span className="text-[#F17D37]">ima</span>
              </span>
            </div>
          </div>
        </div>

        {/* Subtle trust badge */}
        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-white/90 text-xs font-medium">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          ISO & SON Certified Medical Supply
        </div>
      </div>

      {/* Main Headline & Sub-action */}
      <div className="relative z-10 max-w-md my-auto pt-16 pb-8 lg:py-0">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-[1.18] tracking-tight drop-shadow-md">
          Precision Surgical & Diagnostic Equipment Across Nigeria
        </h1>

        <p className="mt-4 text-sm text-stone-300 leading-relaxed">
          Manage hospital RFQ inquiries, clinical equipment inventory, proforma
          invoices, and supervising managers from one unified portal.
        </p>

        <div className="mt-8 pt-4">
          <p className="text-stone-200 text-sm sm:text-base font-normal flex items-center flex-wrap gap-1.5">
            <span>Looking for hospital equipment quotes?</span>
            <button
              type="button"
              onClick={() =>
                onPartnerClick ? onPartnerClick() : navigate("/catalog")
              }
              className="text-[#F77F38] hover:text-[#FFA066] font-semibold underline underline-offset-4 decoration-[#F77F38]/70 hover:decoration-[#FFA066] transition-colors cursor-pointer"
            >
              Browse Catalog &rarr;
            </button>
          </p>
        </div>
      </div>

      <div className="relative z-10 flex items-center justify-between text-xs text-white/60">
        <span>Elpima Surgicals Limited</span>
        <span>Staff & Executive Portal</span>
      </div>
    </div>
  );
};

