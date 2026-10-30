import React from "react";
import { Link } from "react-router-dom";
import { ShieldCheck, ArrowUp } from "lucide-react";
import { ROUTES } from "@/routes";

export const SafetyCompliancePage: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const complianceSections = [
    {
      id: "nafdac-ce",
      number: "1",
      title: "NAFDAC & CE Medical Device Certification",
    },
    {
      id: "iso-13485",
      number: "2",
      title: "ISO 13485:2016 Quality Management",
    },
    {
      id: "sterilization-protocols",
      number: "3",
      title: "Sterilization & Metallurgy Protocols",
    },
    {
      id: "cold-chain-logistics",
      number: "4",
      title: "Secure Hospital Transit & Cold-Chain",
    },
    {
      id: "biomedical-calibration",
      number: "5",
      title: "Biomedical Engineering & Calibration",
    },
    {
      id: "ndpr-compliance",
      number: "6",
      title: "NDPR Compliance & Institutional Privacy",
    },
  ];

  return (
    <div className="playpen-sans w-[90%] md:w-[94%] lg:w-[94%] mx-auto pb-20">
      {/* SECTION 1: HEADER BANNER */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 pt-40 mx-auto md:pb-10 lg:pb-10 border-0 md:border-b-4 border-stone-200">
        <div>
          <h1 className="font-[500] md:font-semibold lg:font-semibold text-[28px] md:text-5xl lg:text-5xl mb-4 md:mb-0 text-teal-600 uppercase">
            SAFETY & COMPLIANCE
          </h1>
          <p className="text-stone-500 mt-2 text-xs md:text-sm font-semibold">
            Clinical Governance & Institutional Quality Assurance
          </p>
        </div>
        <div>
          <p className="text-sm md:text-base tracking-wider md:mr-10 text-stone-700 leading-relaxed font-light">
            Elpima Surgicals Limited is dedicated to maintaining the highest standards of patient safety, clinical efficacy, and regulatory compliance throughout all our healthcare procurement operations across Nigeria. Every piece of equipment, instrument tray, and biomedical component is verified against international standards before dispatch.
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
              {complianceSections.map((sectionItem) => (
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

          {/* Right: Detailed Content Sections */}
          <div className="space-y-12 text-stone-800">
            {/* Intro Lead */}
            <div className="bg-[#FFF2F0] p-6 rounded-2xl border border-teal-100">
              <p className="text-sm font-light text-stone-700 leading-relaxed">
                At Elpima Surgicals Limited, clinical safety and patient well-being govern every inventory purchase order, importation protocol, and hospital installation. We strictly adhere to the guidelines set by the National Agency for Food and Drug Administration and Control (NAFDAC), the Standards Organisation of Nigeria (SONCAP), ISO 13485:2016, and the Nigeria Data Protection Regulation (NDPR).
              </p>
            </div>

            {/* Section 1 */}
            <div id="nafdac-ce" className="scroll-mt-28">
              <h2 className="font-bold text-lg md:text-xl mb-3 text-teal-600 tracking-wide flex items-center gap-2">
                <span>1.</span> NAFDAC & CE Medical Device Certification
              </h2>
              <p className="text-sm font-light leading-relaxed text-stone-600 mb-4">
                All surgical and diagnostic medical equipment imported, distributed, or calibrated by Elpima Surgicals is registered with NAFDAC under Nigerian medical device regulations and carries the European CE Mark (CE 0123 / CE 0197):
              </p>

              <div className="space-y-3 pl-2">
                <div className="flex gap-4 relative">
                  <div className="mr-3 mt-1.5 shrink-0">
                    <div className="w-3.5 h-3.5 bg-teal-600 rounded"></div>
                  </div>
                  <p className="text-xs md:text-sm font-light leading-relaxed text-stone-700">
                    <strong className="font-semibold text-stone-900">Official NAFDAC Registration:</strong> Each batch of instruments, implants, and capital apparatus possesses authenticated NAFDAC listing numbers readily verifiable by hospital procurement committees and pharmacy boards.
                  </p>
                </div>

                <div className="flex gap-4 relative">
                  <div className="mr-3 mt-1.5 shrink-0">
                    <div className="w-3.5 h-3.5 bg-teal-600 rounded"></div>
                  </div>
                  <p className="text-xs md:text-sm font-light leading-relaxed text-stone-700">
                    <strong className="font-semibold text-stone-900">Certificate of Conformity (CoC):</strong> Every shipment is backed by manufacturer certificates verifying compliance with EU Medical Device Regulation (MDR 2017/745) Class I, IIa, IIb, and III standards.
                  </p>
                </div>

                <div className="flex gap-4 relative">
                  <div className="mr-3 mt-1.5 shrink-0">
                    <div className="w-3.5 h-3.5 bg-teal-600 rounded"></div>
                  </div>
                  <p className="text-xs md:text-sm font-light leading-relaxed text-stone-700">
                    <strong className="font-semibold text-stone-900">SONCAP Verification:</strong> Pre-export inspection certificates issued by accredited international testing bodies confirm electrical and safety tolerances before border clearance.
                  </p>
                </div>
              </div>
            </div>

            {/* Section 2 */}
            <div id="iso-13485" className="scroll-mt-28">
              <h2 className="font-bold text-lg md:text-xl mb-3 text-teal-600 tracking-wide flex items-center gap-2">
                <span>2.</span> ISO 13485:2016 Quality Management Standards
              </h2>
              <p className="text-sm font-light leading-relaxed text-stone-600 mb-4">
                ISO 13485:2016 specifies requirements for a comprehensive quality management system where an organization demonstrates its ability to provide medical devices that consistently meet customer and regulatory requirements:
              </p>

              <div className="space-y-3 pl-2">
                <div className="flex gap-4 relative">
                  <div className="mr-3 mt-1.5 shrink-0">
                    <div className="w-3.5 h-3.5 bg-[#D4AF37] rounded"></div>
                  </div>
                  <p className="text-xs md:text-sm font-light leading-relaxed text-stone-700">
                    <strong className="font-semibold text-stone-900">Batch Lot Traceability:</strong> Every surgical instrument box, laparoscopy telescope, and telemetry monitor carries a unique laser-engraved serial or GS1-128 barcoded batch number to enable complete end-to-end recall capability.
                  </p>
                </div>

                <div className="flex gap-4 relative">
                  <div className="mr-3 mt-1.5 shrink-0">
                    <div className="w-3.5 h-3.5 bg-[#D4AF37] rounded"></div>
                  </div>
                  <p className="text-xs md:text-sm font-light leading-relaxed text-stone-700">
                    <strong className="font-semibold text-stone-900">Post-Market Surveillance:</strong> Structured reporting mechanisms allow theatre superintendents and biomedical engineers to log performance feedback, triggering immediate technical reviews.
                  </p>
                </div>
              </div>
            </div>

            {/* Section 3 */}
            <div id="sterilization-protocols" className="scroll-mt-28">
              <h2 className="font-bold text-lg md:text-xl mb-3 text-teal-600 tracking-wide flex items-center gap-2">
                <span>3.</span> Sterilization & Metallurgy Protocols
              </h2>
              <p className="text-sm font-light leading-relaxed text-stone-600 mb-4">
                Counterfeit surgical instruments with substandard metallurgy corrode during high-pressure steam autoclaving, causing rust, micro-cracks, and patient infection hazards. We guarantee:
              </p>

              <div className="space-y-3 pl-2">
                <div className="flex gap-4 relative">
                  <div className="mr-3 mt-1.5 shrink-0">
                    <div className="w-3.5 h-3.5 bg-[#E07A5F] rounded"></div>
                  </div>
                  <p className="text-xs md:text-sm font-light leading-relaxed text-stone-700">
                    <strong className="font-semibold text-stone-900">Certified Surgical Steels:</strong> All manual instruments are forged from certified German 316L, 420B, and 440A stainless steels or medical-grade Ti-6Al-4V ELI (Grade 5 Titanium), resisting repeated sterilization cycles.
                  </p>
                </div>

                <div className="flex gap-4 relative">
                  <div className="mr-3 mt-1.5 shrink-0">
                    <div className="w-3.5 h-3.5 bg-[#E07A5F] rounded"></div>
                  </div>
                  <p className="text-xs md:text-sm font-light leading-relaxed text-stone-700">
                    <strong className="font-semibold text-stone-900">Validated Autoclave Compatibility:</strong> Rated for steam sterilization at 134°C (273°F) for up to 18 minutes under DIN EN 285, STERRAD low-temperature hydrogen peroxide gas plasma, and Ethylene Oxide (EtO).
                  </p>
                </div>
              </div>
            </div>

            {/* Section 4 */}
            <div id="cold-chain-logistics" className="scroll-mt-28">
              <h2 className="font-bold text-lg md:text-xl mb-3 text-teal-600 tracking-wide flex items-center gap-2">
                <span>4.</span> Secure Hospital Transit & Cold-Chain
              </h2>
              <p className="text-sm font-light leading-relaxed text-stone-600 mb-4">
                Medical hardware and electronic telemetry require meticulous physical protection during transit across Nigerian terrain:
              </p>

              <div className="space-y-3 pl-2">
                <div className="flex gap-4 relative">
                  <div className="mr-3 mt-1.5 shrink-0">
                    <div className="w-3.5 h-3.5 bg-teal-600 rounded"></div>
                  </div>
                  <p className="text-xs md:text-sm font-light leading-relaxed text-stone-700">
                    <strong className="font-semibold text-stone-900">Shock-Proof Aluminum Roadcases:</strong> High-value endoscopic cameras, surgical lights, and ICU monitors are dispatched in custom water-resistant, shock-dampened flight cases.
                  </p>
                </div>

                <div className="flex gap-4 relative">
                  <div className="mr-3 mt-1.5 shrink-0">
                    <div className="w-3.5 h-3.5 bg-teal-600 rounded"></div>
                  </div>
                  <p className="text-xs md:text-sm font-light leading-relaxed text-stone-700">
                    <strong className="font-semibold text-stone-900">Insured Doorstep Delivery:</strong> Full comprehensive transit insurance covering equipment replacement from our central warehouse in Ikeja to hospitals nationwide.
                  </p>
                </div>
              </div>
            </div>

            {/* Section 5 */}
            <div id="biomedical-calibration" className="scroll-mt-28">
              <h2 className="font-bold text-lg md:text-xl mb-3 text-teal-600 tracking-wide flex items-center gap-2">
                <span>5.</span> Biomedical Engineering & Calibration
              </h2>
              <p className="text-sm font-light leading-relaxed text-stone-600 mb-4">
                Hospital equipment must be calibrated upon arrival to ensure zero measurement drift or electrical leakage:
              </p>

              <div className="space-y-3 pl-2">
                <div className="flex gap-4 relative">
                  <div className="mr-3 mt-1.5 shrink-0">
                    <div className="w-3.5 h-3.5 bg-[#D4AF37] rounded"></div>
                  </div>
                  <p className="text-xs md:text-sm font-light leading-relaxed text-stone-700">
                    <strong className="font-semibold text-stone-900">Electrical Safety Testing:</strong> Verification under IEC 60601-1 and IEC 62353 standards to guarantee chassis earth leakage and patient lead insulation.
                  </p>
                </div>

                <div className="flex gap-4 relative">
                  <div className="mr-3 mt-1.5 shrink-0">
                    <div className="w-3.5 h-3.5 bg-[#D4AF37] rounded"></div>
                  </div>
                  <p className="text-xs md:text-sm font-light leading-relaxed text-stone-700">
                    <strong className="font-semibold text-stone-900">Preventive Maintenance Schedules (PPM):</strong> Institutional service level agreements (SLAs) with scheduled 6-month calibration and emergency engineer dispatch within 4 hours.
                  </p>
                </div>
              </div>
            </div>

            {/* Section 6 */}
            <div id="ndpr-compliance" className="scroll-mt-28">
              <h2 className="font-bold text-lg md:text-xl mb-3 text-teal-600 tracking-wide flex items-center gap-2">
                <span>6.</span> NDPR Compliance & Institutional Privacy
              </h2>
              <p className="text-sm font-light leading-relaxed text-stone-600 mb-4">
                The Nigeria Data Protection Act 2023 and NDPR safeguard organizational data and clinical requests handled by our online RFQ platform:
              </p>

              <div className="space-y-3 pl-2">
                <div className="flex gap-4 relative">
                  <div className="mr-3 mt-1.5 shrink-0">
                    <div className="w-3.5 h-3.5 bg-teal-600 rounded"></div>
                  </div>
                  <p className="text-xs md:text-sm font-light leading-relaxed text-stone-700">
                    <strong className="font-semibold text-stone-900">Encrypted RFQ Submissions:</strong> Hospital purchase requests and proforma invoices are transmitted via TLS 1.3 encryption with AES-256 rest encryption.
                  </p>
                </div>

                <div className="flex gap-4 relative">
                  <div className="mr-3 mt-1.5 shrink-0">
                    <div className="w-3.5 h-3.5 bg-teal-600 rounded"></div>
                  </div>
                  <p className="text-xs md:text-sm font-light leading-relaxed text-stone-700">
                    <strong className="font-semibold text-stone-900">Confidentiality Agreements:</strong> Strict non-disclosure protocols governing hospital procurement pricing, doctor rosters, and custom theater blueprints.
                  </p>
                </div>
              </div>
            </div>

            {/* Inquiries Footer Callout */}
            <div className="border-t border-stone-200 pt-8 mt-12 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h4 className="font-bold text-sm text-stone-900">
                  Questions on Clinical Safety & Regulations?
                </h4>
                <p className="text-xs text-stone-500 font-light">
                  Contact our Quality Assurance & Regulatory Affairs Desk.
                </p>
              </div>
              <Link
                to={ROUTES.PUBLIC.CONTACT}
                className="px-5 py-2.5 rounded-full bg-teal-600 hover:bg-teal-700 text-white text-xs font-medium cursor-pointer transition-colors shadow-sm"
              >
                Contact Regulatory Team
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SafetyCompliancePage;
