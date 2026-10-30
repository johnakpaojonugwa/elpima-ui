import React from "react";
import { Link } from "react-router-dom";
import { ShieldCheck, ArrowUp } from "lucide-react";
import { ROUTES } from "@/routes";

export const TermsOfUsePage: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const termsSections = [
    {
      id: "scope-of-services",
      number: "1",
      title: "Scope of Procurement & Supply Services",
    },
    {
      id: "quotations-pricing",
      number: "2",
      title: "Proforma Quotations & Price Validity",
    },
    {
      id: "purchase-orders",
      number: "3",
      title: "Purchase Orders (LPO) & Payment Terms",
    },
    {
      id: "delivery-acceptance",
      number: "4",
      title: "Delivery, Insurance & Physical Inspection",
    },
    {
      id: "warranty-calibration",
      number: "5",
      title: "Manufacturer Warranty & Calibration",
    },
    {
      id: "returns-quarantine",
      number: "6",
      title: "Returns, Quarantine & Defective Goods",
    },
    {
      id: "clinical-prerequisites",
      number: "7",
      title: "Licensed Clinical Use & Prerequisites",
    },
    {
      id: "intellectual-property",
      number: "8",
      title: "Intellectual Property & Documentation",
    },
    {
      id: "limitation-liability",
      number: "9",
      title: "Limitation of Liability & Force Majeure",
    },
    {
      id: "governing-law",
      number: "10",
      title: "Governing Law & Dispute Resolution",
    },
  ];

  return (
    <div className="playpen-sans w-[90%] md:w-[94%] lg:w-[94%] mx-auto pb-20">
      {/* SECTION 1: HEADER BANNER */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 pt-40 mx-auto md:pb-10 lg:pb-10 border-0 md:border-b-4 border-stone-200">
        <div>
          <h1 className="font-[500] md:font-semibold lg:font-semibold text-[28px] md:text-5xl lg:text-5xl mb-4 md:mb-0 text-teal-600 uppercase">
            TERMS OF USE & SUPPLY
          </h1>
          <p className="text-stone-500 mt-2 text-xs md:text-sm font-semibold">
            Last updated: October 2026 • Elpima Surgicals Limited
          </p>
        </div>
        <div>
          <p className="text-sm md:text-base tracking-wider md:mr-10 text-stone-700 leading-relaxed font-light">
            These terms govern all institutional equipment inquiries, proforma quotations, equipment leasing, deliveries, warranties, and biomedical engineering maintenance agreements conducted between Elpima Surgicals Limited (RC: 1682940) and healthcare institutions across Nigeria.
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

            <div className="grid grid-cols-1 gap-3 text-xs font-light text-stone-700">
              {termsSections.map((sectionItem) => (
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

          {/* Right: Detailed Terms Content */}
          <div className="space-y-12 text-stone-800">
            {/* Intro Lead */}
            <div className="bg-[#FFF2F0] p-6 rounded-2xl border border-teal-100">
              <p className="text-sm font-light text-stone-700 leading-relaxed">
                We are <strong className="font-semibold text-stone-900">Elpima Surgicals Limited</strong> ("<strong>Elpima</strong>," "<strong>we</strong>," "<strong>us</strong>," or "<strong>our</strong>"), a company incorporated under the laws of the Federal Republic of Nigeria (RC: 1682940), operating our principal clinical logistics and engineering center at 14 Medical Science Way, Ikeja GRA, Lagos State. By utilizing our online catalog, requesting proforma quotations, or issuing purchase orders, your healthcare institution agrees to be bound by these Terms of Use and Supply.
              </p>
            </div>

            {/* Section 1 */}
            <div id="scope-of-services" className="scroll-mt-28">
              <h2 className="font-bold text-lg md:text-xl mb-3 text-teal-600 tracking-wide flex items-center gap-2">
                <span>1.</span> Scope of Procurement & Supply Services
              </h2>
              <p className="text-sm font-light leading-relaxed text-stone-600 mb-4">
                Elpima Surgicals provides specialized institutional procurement, technical importation, and calibration of clinical medical devices, including surgical instruments, electrosurgical units, laparoscopy camera towers, patient telemetry monitors, and hospital theater fixtures.
              </p>
            </div>

            {/* Section 2 */}
            <div id="quotations-pricing" className="scroll-mt-28">
              <h2 className="font-bold text-lg md:text-xl mb-3 text-teal-600 tracking-wide flex items-center gap-2">
                <span>2.</span> Proforma Quotations & Price Validity
              </h2>
              <div className="space-y-3 pl-2">
                <div className="flex gap-4 relative">
                  <div className="mr-3 mt-1.5 shrink-0">
                    <div className="w-3.5 h-3.5 bg-[#D4AF37] rounded"></div>
                  </div>
                  <p className="text-xs md:text-sm font-light leading-relaxed text-stone-700">
                    <strong className="font-semibold text-stone-900">Validity Window:</strong> Unless explicitly noted otherwise, official proforma quotations are valid for thirty (30) calendar days from the date of issuance.
                  </p>
                </div>
                <div className="flex gap-4 relative">
                  <div className="mr-3 mt-1.5 shrink-0">
                    <div className="w-3.5 h-3.5 bg-[#D4AF37] rounded"></div>
                  </div>
                  <p className="text-xs md:text-sm font-light leading-relaxed text-stone-700">
                    <strong className="font-semibold text-stone-900">Currency & Statutory Taxes:</strong> Prices are quoted in Nigerian Naira (NGN) or USD (for offshore LC procurement). Value Added Tax (VAT) and applicable statutory withholding levies are specified item-by-item.
                  </p>
                </div>
              </div>
            </div>

            {/* Section 3 */}
            <div id="purchase-orders" className="scroll-mt-28">
              <h2 className="font-bold text-lg md:text-xl mb-3 text-teal-600 tracking-wide flex items-center gap-2">
                <span>3.</span> Purchase Orders (LPO) & Payment Terms
              </h2>
              <div className="space-y-3 pl-2">
                <div className="flex gap-4 relative">
                  <div className="mr-3 mt-1.5 shrink-0">
                    <div className="w-3.5 h-3.5 bg-[#E07A5F] rounded"></div>
                  </div>
                  <p className="text-xs md:text-sm font-light leading-relaxed text-stone-700">
                    <strong className="font-semibold text-stone-900">Order Confirmation:</strong> An official purchase order (LPO) issued by an authorized hospital officer or Chief Medical Director creates a binding contract upon Elpima's written sales confirmation.
                  </p>
                </div>
                <div className="flex gap-4 relative">
                  <div className="mr-3 mt-1.5 shrink-0">
                    <div className="w-3.5 h-3.5 bg-[#E07A5F] rounded"></div>
                  </div>
                  <p className="text-xs md:text-sm font-light leading-relaxed text-stone-700">
                    <strong className="font-semibold text-stone-900">Payment Milestones:</strong> Standard commercial terms for capital installations require 70% advance commitment and 30% upon final hospital technical sign-off. Approved teaching hospitals may access credit facilities subject to credit committee clearance.
                  </p>
                </div>
              </div>
            </div>

            {/* Section 4 */}
            <div id="delivery-acceptance" className="scroll-mt-28">
              <h2 className="font-bold text-lg md:text-xl mb-3 text-teal-600 tracking-wide flex items-center gap-2">
                <span>4.</span> Delivery, Insurance & Physical Inspection
              </h2>
              <p className="text-sm font-light leading-relaxed text-stone-600 mb-4">
                Elpima delivers to hospital facilities nationwide. The receiving facility's biomedical department or head of nursing must inspect packages for mechanical damage or seal tampering before signing the delivery acceptance note.
              </p>
            </div>

            {/* Section 5 */}
            <div id="warranty-calibration" className="scroll-mt-28">
              <h2 className="font-bold text-lg md:text-xl mb-3 text-teal-600 tracking-wide flex items-center gap-2">
                <span>5.</span> Manufacturer Warranty & Biomedical Calibration
              </h2>
              <div className="space-y-3 pl-2">
                <div className="flex gap-4 relative">
                  <div className="mr-3 mt-1.5 shrink-0">
                    <div className="w-3.5 h-3.5 bg-[#D4AF37] rounded"></div>
                  </div>
                  <p className="text-xs md:text-sm font-light leading-relaxed text-stone-700">
                    <strong className="font-semibold text-stone-900">OEM Warranty Period:</strong> Capital theater monitors, operating lamps, and electrosurgical generators carry a 12 to 24-month manufacturer warranty covering manufacturing defects and circuit failures.
                  </p>
                </div>
                <div className="flex gap-4 relative">
                  <div className="mr-3 mt-1.5 shrink-0">
                    <div className="w-3.5 h-3.5 bg-[#D4AF37] rounded"></div>
                  </div>
                  <p className="text-xs md:text-sm font-light leading-relaxed text-stone-700">
                    <strong className="font-semibold text-stone-900">Warranty Exclusions:</strong> Damages resulting from hospital electrical surges (without approved AVR stabilizers), physical impact, uncalibrated third-party servicing, or non-compliance with autoclave parameters void the warranty.
                  </p>
                </div>
              </div>
            </div>

            {/* Section 6 */}
            <div id="returns-quarantine" className="scroll-mt-28">
              <h2 className="font-bold text-lg md:text-xl mb-3 text-teal-600 tracking-wide flex items-center gap-2">
                <span>6.</span> Returns, Quarantine & Defective Goods Policy
              </h2>
              <p className="text-sm font-light leading-relaxed text-stone-600 mb-4">
                Notification of defective or non-conforming items must be submitted in writing within seven (7) business days of delivery. For infection control and biohazard prevention, opened surgical instrument boxes that have entered an operating theater cannot be accepted for return without authorized autoclave decontamination certification.
              </p>
            </div>

            {/* Section 7 */}
            <div id="clinical-prerequisites" className="scroll-mt-28">
              <h2 className="font-bold text-lg md:text-xl mb-3 text-teal-600 tracking-wide flex items-center gap-2">
                <span>7.</span> Licensed Clinical Use & Operating Prerequisites
              </h2>
              <p className="text-sm font-light leading-relaxed text-stone-600 mb-4">
                Elpima Surgicals supplies hospital hardware strictly for clinical use by licensed medical practitioners, surgeons, anesthetists, and biomedical personnel. The purchaser is responsible for ensuring operating theater staff receive appropriate training on specialized apparatus.
              </p>
            </div>

            {/* Section 8 */}
            <div id="intellectual-property" className="scroll-mt-28">
              <h2 className="font-bold text-lg md:text-xl mb-3 text-teal-600 tracking-wide flex items-center gap-2">
                <span>8.</span> Intellectual Property & Technical Documentation
              </h2>
              <p className="text-sm font-light leading-relaxed text-stone-600 mb-4">
                All catalog imagery, engineering schematics, brochure downloads, and equipment user guides displayed on elpimasurgicals.com remain the intellectual property of Elpima Surgicals Limited or our licensed OEM partners. Unauthorized reproduction is strictly prohibited.
              </p>
            </div>

            {/* Section 9 */}
            <div id="limitation-liability" className="scroll-mt-28">
              <h2 className="font-bold text-lg md:text-xl mb-3 text-teal-600 tracking-wide flex items-center gap-2">
                <span>9.</span> Limitation of Liability & Force Majeure
              </h2>
              <p className="text-sm font-light leading-relaxed text-stone-600 mb-4">
                To the fullest extent permitted by Nigerian law, Elpima Surgicals Limited shall not be liable for indirect, punitive, or consequential damages resulting from operational theater delays, power outages, or improper surgical instrument application. Neither party shall be liable for delays caused by Acts of God, civil unrest, or statutory port customs embargos.
              </p>
            </div>

            {/* Section 10 */}
            <div id="governing-law" className="scroll-mt-28">
              <h2 className="font-bold text-lg md:text-xl mb-3 text-teal-600 tracking-wide flex items-center gap-2">
                <span>10.</span> Governing Law & Dispute Resolution
              </h2>
              <p className="text-sm font-light leading-relaxed text-stone-600 mb-4">
                These terms are governed by the laws of the Federal Republic of Nigeria. Any controversy or claim arising from a procurement contract that cannot be settled amicably within thirty (30) days shall be resolved through arbitration in Lagos State, Nigeria, in accordance with the Arbitration and Mediation Act 2023.
              </p>
            </div>

            {/* Inquiries Footer Callout */}
            <div className="border-t border-stone-200 pt-8 mt-12 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h4 className="font-bold text-sm text-stone-900">
                  Questions Regarding Institutional Procurement Terms?
                </h4>
                <p className="text-xs text-stone-500 font-light">
                  Our commercial legal and tender desk is available to assist your hospital board.
                </p>
              </div>
              <Link
                to={ROUTES.PUBLIC.CONTACT}
                className="px-5 py-2.5 rounded-full bg-teal-600 hover:bg-teal-700 text-white text-xs font-medium cursor-pointer transition-colors shadow-sm"
              >
                Inquire With Legal Desk
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default TermsOfUsePage;

