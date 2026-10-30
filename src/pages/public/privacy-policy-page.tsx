import React from "react";
import { Link } from "react-router-dom";
import { ShieldCheck, ArrowUp } from "lucide-react";
import { ROUTES } from "@/routes";

export const PrivacyPolicyPage: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const policySections = [
    {
      id: "information-we-collect",
      number: "1",
      title: "What Information Do We Collect?",
    },
    {
      id: "how-we-process",
      number: "2",
      title: "How Do We Process Your Information?",
    },
    {
      id: "legal-bases",
      number: "3",
      title: "Legal Bases Under Nigerian Law (NDPR)",
    },
    {
      id: "sharing-information",
      number: "4",
      title: "When & With Whom Do We Share Information?",
    },
    {
      id: "data-retention",
      number: "5",
      title: "How Long Do We Retain Your Information?",
    },
    {
      id: "security-measures",
      number: "6",
      title: "How Do We Protect Your Information?",
    },
    {
      id: "your-privacy-rights",
      number: "7",
      title: "Your Privacy Rights & Controls",
    },
    {
      id: "contact-dpo",
      number: "8",
      title: "Contacting Our Data Protection Officer",
    },
  ];

  return (
    <div className="playpen-sans w-[90%] md:w-[94%] lg:w-[94%] mx-auto pb-20">
      {/* SECTION 1: HEADER BANNER */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 pt-40 mx-auto md:pb-10 lg:pb-10 border-0 md:border-b-4 border-stone-200">
        <div>
          <h1 className="font-[500] md:font-semibold lg:font-semibold text-[28px] md:text-5xl lg:text-5xl mb-4 md:mb-0 text-teal-600 uppercase">
            PRIVACY POLICY
          </h1>
          <p className="text-stone-500 mt-2 text-xs md:text-sm font-semibold">
            Last updated: October 2026 • Elpima Surgicals Limited
          </p>
        </div>
        <div>
          <p className="text-sm md:text-base tracking-wider md:mr-10 text-stone-700 leading-relaxed font-light">
            We are committed to safeguarding the institutional records, clinical procurement data, and professional information of our client hospitals. This policy outlines how Elpima Surgicals Limited collects, utilizes, stores, and protects your information in accordance with the Nigeria Data Protection Act (NDPA) and NDPR guidelines.
          </p>
        </div>
      </section>

      {/* SECTION 2: 2-COLUMN LAYOUT WITH STICKY TABLE OF CONTENTS */}
      <section className="mb-15 md:mb-20 lg:mb-30 mt-10">
        <div className="grid grid-cols-1 md:grid-cols-[4fr_7fr] lg:grid-cols-[3fr_7fr] gap-8">
          {/* Left: Sticky Table of Contents */}
          <div className="bg-[#FAF6EE] border border-[#D4AF37]/30 rounded-2xl px-6 pt-10 pb-12 sticky top-24 z-30 hidden md:block self-start shadow-xs">
            <div className="flex items-center justify-center gap-2 mb-6">
              <ShieldCheck className="w-5 h-5 text-teal-700" />
              <h2 className="font-bold text-base text-stone-900 uppercase tracking-wide">
                Table of Contents
              </h2>
            </div>

            <div className="grid grid-cols-1 gap-3.5 text-xs font-light text-stone-700">
              {policySections.map((sectionItem) => (
                <a
                  key={sectionItem.id}
                  href={`#${sectionItem.id}`}
                  className="flex items-start gap-3 hover:text-teal-700 transition-colors py-1 group"
                >
                  <span className="font-semibold text-teal-700 w-4 shrink-0">
                    {sectionItem.number}.
                  </span>
                  <span className="group-hover:underline">
                    {sectionItem.title}
                  </span>
                </a>
              ))}
            </div>

            <div
              onClick={scrollToTop}
              className="mt-8 flex items-center gap-1.5 justify-center hover:underline cursor-pointer text-center pt-4 text-teal-700 border-t border-stone-300 w-full"
            >
              <span className="text-xs font-semibold">Back to top</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Right: Detailed Policy Content */}
          <div className="space-y-12 text-stone-800">
            {/* Intro Lead */}
            <div className="bg-[#FFF2F0] p-6 rounded-2xl border border-teal-100">
              <p className="text-sm font-light text-stone-700 leading-relaxed">
                This privacy notice for <strong className="font-semibold text-stone-900">Elpima Surgicals Limited</strong> ("<strong>we</strong>," "<strong>us</strong>," or "<strong>our</strong>"), describes how and why we might collect, store, use, and process your institutional and personal information when you access our medical equipment portal at{" "}
                <strong className="text-teal-800">elpimasurgicals.com</strong>, submit proforma requests, or interact with our biomedical engineering staff.
              </p>
            </div>

            {/* Section 1 */}
            <div id="information-we-collect" className="scroll-mt-28">
              <h2 className="font-bold text-lg md:text-xl mb-3 text-teal-600 tracking-wide flex items-center gap-2">
                <span>1.</span> What Information Do We Collect?
              </h2>
              <p className="text-sm font-light leading-relaxed text-stone-600 mb-4">
                We collect information that you voluntarily provide when registering an institutional account, drafting an RFQ quote batch, or consulting our procurement specialists:
              </p>

              <div className="space-y-3 pl-2">
                <div className="flex gap-4 relative">
                  <div className="mr-3 mt-1.5 shrink-0">
                    <div className="w-3.5 h-3.5 bg-teal-600 rounded"></div>
                  </div>
                  <p className="text-xs md:text-sm font-light leading-relaxed text-stone-700">
                    <strong className="font-semibold text-stone-900">Institutional & Facility Identity:</strong> Teaching hospital name, surgical center accreditation number, state of operation, department, and facility delivery address.
                  </p>
                </div>

                <div className="flex gap-4 relative">
                  <div className="mr-3 mt-1.5 shrink-0">
                    <div className="w-3.5 h-3.5 bg-teal-600 rounded"></div>
                  </div>
                  <p className="text-xs md:text-sm font-light leading-relaxed text-stone-700">
                    <strong className="font-semibold text-stone-900">Procurement & Clinical Personnel:</strong> Contact person name, surgical specialty, medical registration credentials (MDCN / Nursing council), direct phone/WhatsApp numbers, and institutional email.
                  </p>
                </div>

                <div className="flex gap-4 relative">
                  <div className="mr-3 mt-1.5 shrink-0">
                    <div className="w-3.5 h-3.5 bg-teal-600 rounded"></div>
                  </div>
                  <p className="text-xs md:text-sm font-light leading-relaxed text-stone-700">
                    <strong className="font-semibold text-stone-900">Equipment Specifications & RFQ Data:</strong> Instrument tray codes, quantities, surgical theater power tolerances, sterilization capabilities, and delivery urgency.
                  </p>
                </div>
              </div>
            </div>

            {/* Section 2 */}
            <div id="how-we-process" className="scroll-mt-28">
              <h2 className="font-bold text-lg md:text-xl mb-3 text-teal-600 tracking-wide flex items-center gap-2">
                <span>2.</span> How Do We Process Your Information?
              </h2>
              <p className="text-sm font-light leading-relaxed text-stone-600 mb-4">
                We process your information for legitimate clinical and business purposes, including:
              </p>

              <div className="space-y-3 pl-2">
                <div className="flex gap-4 relative">
                  <div className="mr-3 mt-1.5 shrink-0">
                    <div className="w-3.5 h-3.5 bg-[#D4AF37] rounded"></div>
                  </div>
                  <p className="text-xs md:text-sm font-light leading-relaxed text-stone-700">
                    <strong className="font-semibold text-stone-900">Generating Official Proforma Invoices:</strong> Calculating accurate institutional quotations, tax rates, batch discounts, and transit insurance schedules.
                  </p>
                </div>

                <div className="flex gap-4 relative">
                  <div className="mr-3 mt-1.5 shrink-0">
                    <div className="w-3.5 h-3.5 bg-[#D4AF37] rounded"></div>
                  </div>
                  <p className="text-xs md:text-sm font-light leading-relaxed text-stone-700">
                    <strong className="font-semibold text-stone-900">Scheduling Biomedical Maintenance & Warranties:</strong> Logging equipment serial numbers, maintenance timelines, and engineer dispatch records.
                  </p>
                </div>

                <div className="flex gap-4 relative">
                  <div className="mr-3 mt-1.5 shrink-0">
                    <div className="w-3.5 h-3.5 bg-[#D4AF37] rounded"></div>
                  </div>
                  <p className="text-xs md:text-sm font-light leading-relaxed text-stone-700">
                    <strong className="font-semibold text-stone-900">Fulfilling NAFDAC & SON Regulatory Audits:</strong> Maintaining traceable records of all medical devices released into the Nigerian healthcare ecosystem.
                  </p>
                </div>
              </div>
            </div>

            {/* Section 3 */}
            <div id="legal-bases" className="scroll-mt-28">
              <h2 className="font-bold text-lg md:text-xl mb-3 text-teal-600 tracking-wide flex items-center gap-2">
                <span>3.</span> Legal Bases Under Nigerian Law (NDPR & NDPA 2023)
              </h2>
              <p className="text-sm font-light leading-relaxed text-stone-600 mb-4">
                We only process personal and hospital data when permitted under Nigerian law:
              </p>

              <div className="space-y-3 pl-2">
                <div className="flex gap-4 relative">
                  <div className="mr-3 mt-1.5 shrink-0">
                    <div className="w-3.5 h-3.5 bg-[#E07A5F] rounded"></div>
                  </div>
                  <p className="text-xs md:text-sm font-light leading-relaxed text-stone-700">
                    <strong className="font-semibold text-stone-900">Contractual Performance:</strong> Processing necessary to fulfill supply contracts, purchase orders, or warranty maintenance agreements.
                  </p>
                </div>

                <div className="flex gap-4 relative">
                  <div className="mr-3 mt-1.5 shrink-0">
                    <div className="w-3.5 h-3.5 bg-[#E07A5F] rounded"></div>
                  </div>
                  <p className="text-xs md:text-sm font-light leading-relaxed text-stone-700">
                    <strong className="font-semibold text-stone-900">Legal Compliance:</strong> Fulfilling tax, commercial reporting, and NAFDAC medical device traceability obligations.
                  </p>
                </div>

                <div className="flex gap-4 relative">
                  <div className="mr-3 mt-1.5 shrink-0">
                    <div className="w-3.5 h-3.5 bg-[#E07A5F] rounded"></div>
                  </div>
                  <p className="text-xs md:text-sm font-light leading-relaxed text-stone-700">
                    <strong className="font-semibold text-stone-900">Explicit Consent:</strong> Provided when you voluntarily submit inquiries or request proforma quotes via our online portal.
                  </p>
                </div>
              </div>
            </div>

            {/* Section 4 */}
            <div id="sharing-information" className="scroll-mt-28">
              <h2 className="font-bold text-lg md:text-xl mb-3 text-teal-600 tracking-wide flex items-center gap-2">
                <span>4.</span> When & With Whom Do We Share Information?
              </h2>
              <p className="text-sm font-light leading-relaxed text-stone-600 mb-4">
                We never monetize or sell hospital or physician data. Information is shared only with verified operational partners:
              </p>

              <div className="space-y-3 pl-2">
                <div className="flex gap-4 relative">
                  <div className="mr-3 mt-1.5 shrink-0">
                    <div className="w-3.5 h-3.5 bg-teal-600 rounded"></div>
                  </div>
                  <p className="text-xs md:text-sm font-light leading-relaxed text-stone-700">
                    <strong className="font-semibold text-stone-900">Original Equipment Manufacturers (OEMs):</strong> Shared strictly for warranty registration, firmware licensing, and specialized surgical hardware calibration.
                  </p>
                </div>

                <div className="flex gap-4 relative">
                  <div className="mr-3 mt-1.5 shrink-0">
                    <div className="w-3.5 h-3.5 bg-teal-600 rounded"></div>
                  </div>
                  <p className="text-xs md:text-sm font-light leading-relaxed text-stone-700">
                    <strong className="font-semibold text-stone-900">Insured Logistics & Freight Partners:</strong> Direct delivery information shared with medical logistics couriers operating across Nigerian states.
                  </p>
                </div>
              </div>
            </div>

            {/* Section 5 */}
            <div id="data-retention" className="scroll-mt-28">
              <h2 className="font-bold text-lg md:text-xl mb-3 text-teal-600 tracking-wide flex items-center gap-2">
                <span>5.</span> How Long Do We Retain Your Information?
              </h2>
              <p className="text-sm font-light leading-relaxed text-stone-600 mb-4">
                We retain procurement data and warranty records for as long as necessary to fulfill statutory medical equipment lifecycles (minimum 7 years for capital theater installations) and satisfy NAFDAC traceability directives.
              </p>
            </div>

            {/* Section 6 */}
            <div id="security-measures" className="scroll-mt-28">
              <h2 className="font-bold text-lg md:text-xl mb-3 text-teal-600 tracking-wide flex items-center gap-2">
                <span>6.</span> How Do We Protect Your Information?
              </h2>
              <p className="text-sm font-light leading-relaxed text-stone-600 mb-4">
                Our technology platform uses robust technical and organizational security controls:
              </p>

              <div className="space-y-3 pl-2">
                <div className="flex gap-4 relative">
                  <div className="mr-3 mt-1.5 shrink-0">
                    <div className="w-3.5 h-3.5 bg-[#E07A5F] rounded"></div>
                  </div>
                  <p className="text-xs md:text-sm font-light leading-relaxed text-stone-700">
                    <strong className="font-semibold text-stone-900">Encryption at Rest & in Transit:</strong> Encrypted using TLS 1.3 for all web interactions and AES-256 encryption across our database storage layer.
                  </p>
                </div>

                <div className="flex gap-4 relative">
                  <div className="mr-3 mt-1.5 shrink-0">
                    <div className="w-3.5 h-3.5 bg-[#E07A5F] rounded"></div>
                  </div>
                  <p className="text-xs md:text-sm font-light leading-relaxed text-stone-700">
                    <strong className="font-semibold text-stone-900">Role-Based Access Control (RBAC):</strong> Only authenticated procurement managers and biomedical technicians have access to institutional RFQ histories.
                  </p>
                </div>
              </div>
            </div>

            {/* Section 7 */}
            <div id="your-privacy-rights" className="scroll-mt-28">
              <h2 className="font-bold text-lg md:text-xl mb-3 text-teal-600 tracking-wide flex items-center gap-2">
                <span>7.</span> Your Privacy Rights & Controls
              </h2>
              <p className="text-sm font-light leading-relaxed text-stone-600 mb-4">
                Under the Nigeria Data Protection Act 2023, you have the right to request access to your records, rectify inaccurate data, request restriction of processing, or lodge a complaint with the Nigeria Data Protection Commission (NDPC).
              </p>
            </div>

            {/* Section 8 */}
            <div id="contact-dpo" className="scroll-mt-28">
              <h2 className="font-bold text-lg md:text-xl mb-3 text-teal-600 tracking-wide flex items-center gap-2">
                <span>8.</span> Contacting Our Data Protection Officer (DPO)
              </h2>
              <p className="text-sm font-light leading-relaxed text-stone-600 mb-4">
                If you have questions or concerns regarding our privacy governance or wish to exercise your rights, please contact our Data Protection Officer:
              </p>

              <div className="bg-[#FAF6EE] p-5 rounded-2xl border border-[#D4AF37]/30 text-xs text-stone-700 space-y-1.5 font-light">
                <p><strong className="font-semibold text-stone-900">Data Protection Officer:</strong> Elpima Surgicals Limited</p>
                <p><strong className="font-semibold text-stone-900">Office:</strong> 14 Medical Science Way, Ikeja GRA, Lagos State, Nigeria</p>
                <p><strong className="font-semibold text-stone-900">Email:</strong> privacy@elpimasurgicals.com</p>
                <p><strong className="font-semibold text-stone-900">Hotline:</strong> +234 (0) 800-ELPIMA</p>
              </div>
            </div>

            {/* Inquiries Footer Callout */}
            <div className="border-t border-stone-200 pt-8 mt-12 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h4 className="font-bold text-sm text-stone-900">
                  Need Clarification on Hospital Data Handling?
                </h4>
                <p className="text-xs text-stone-500 font-light">
                  Our compliance officers are available for institutional consultations.
                </p>
              </div>
              <Link
                to={ROUTES.PUBLIC.CONTACT}
                className="px-5 py-2.5 rounded-full bg-teal-600 hover:bg-teal-700 text-white text-xs font-medium cursor-pointer transition-colors shadow-sm"
              >
                Contact Privacy Desk
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PrivacyPolicyPage;

