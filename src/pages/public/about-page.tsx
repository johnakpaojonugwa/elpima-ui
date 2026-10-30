import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Quote } from "lucide-react";
import { ROUTES } from "@/routes";

export const AboutPage: React.FC = () => {
  const [currentTestimonialIndex, setCurrentTestimonialIndex] = useState(0);

  const testimonials = [
    {
      content:
        "Elpima Surgicals completely equipped our new surgical wing with high-definition laparoscopic towers and titanium orthopedic sets. Their biomedical engineers personally conducted calibration and user training in Ikeja. We have had zero equipment downtime in 18 months of intensive theater usage.",
      author: "Prof. Babatunde Ejiro, FWACS",
      role: "Head of Surgery, Lagos Premier Surgical Center",
    },
    {
      content:
        "When procuring critical anesthesia apparatus and patient monitors for our hospital network, authenticity and warranty reliability are paramount. Elpima provided prompt proforma RFQs, compliant NAFDAC documentation, and doorstep delivery across our three regional branches in Nigeria.",
      author: "Dr. Harikeh Alabi, MBBS, DA",
      role: "Director of Anesthesia & Critical Care, Abuja Medical Specialists",
    },
    {
      content:
        "The responsiveness of Elpima's biomedical technical team is unmatched. For any routine preventive servicing or specialized surgical instrument replenishment, their support hotline responds immediately. They are truly an indispensable clinical partner.",
      author: "Pharm. Chris Ruth Umeh",
      role: "Chief Procurement Officer, Port Harcourt University Teaching Annex",
    },
  ];

  const handleNextTestimonial = () => {
    setCurrentTestimonialIndex((previousIndex) =>
      previousIndex === testimonials.length - 1 ? 0 : previousIndex + 1,
    );
  };

  const handleSelectTestimonial = (targetIndex: number) => {
    setCurrentTestimonialIndex(targetIndex);
  };

  useEffect(() => {
    const autoRotationTimer = setInterval(() => {
      handleNextTestimonial();
    }, 5500);

    return () => clearInterval(autoRotationTimer);
  }, []);

  return (
    <div className="playpen-sans bg-white">
      {/* SECTION 1: TOP INTRO SPLIT */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 pt-40 w-[90%] md:w-[95%] lg:w-[78%] mx-auto">
        <div>
          <h1 className="font-[500] md:font-semibold lg:font-semibold text-[28px] md:text-5xl lg:text-5xl mb-4 md:mb-0 text-teal-600">
            ABOUT ELPIMA SURGICALS
          </h1>
        </div>
        <div>
          <p className="text-base tracking-wider md:mr-10 text-[#6F7787] md:text-stone-800 font-light leading-relaxed">
            Elpima Surgicals Limited is Nigeria's trusted healthcare infrastructure and surgical technology partner, equipping teaching hospitals, medical centers, and surgical suites with authenticated CE & ISO certified surgical instruments, telemetry, and 24/7 biomedical engineering maintenance.
          </p>
        </div>
      </section>

      {/* SECTION 2: STORY HERO WITH OVERLAY */}
      <section className="w-full relative flex items-center justify-center h-[50vh] md:h-screen lg:h-screen overflow-hidden mt-16 md:mt-20">
        <img
          src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=2000&auto=format&fit=crop"
          alt="Modern Hospital Surgical Theater"
          className="h-full w-full object-cover"
        />
        <div className="bg-[#032320b8] flex items-center h-full w-full justify-center absolute top-0 p-6 font-semibold text-white">
          <div className="w-[90%] md:w-[75%] lg:w-7/12 tracking-wide mx-auto text-center">
            <span className="inline-block px-4 py-1 rounded-full text-xs font-semibold bg-[#FAF6EE]/20 text-[#D4AF37] border border-[#D4AF37]/40 mb-4">
              Our Clinical Heritage
            </span>
            <h2 className="text-2xl md:text-3xl lg:text-4xl mb-4 font-bold">
              Our Story
            </h2>
            <p className="font-light text-sm md:text-base lg:text-lg mb-6 leading-relaxed text-stone-100">
              Elpima Surgicals emerged from the acute need for authentic, traceable, and reliable surgical instruments across Nigerian healthcare facilities. Counterfeit metallurgy and lack of preventive biomedical servicing often endangered theater outcomes. We set out to bridge this gap through direct OEM partnerships, ISO 13485 compliance, and certified resident technicians across Nigeria.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 3: 2x2 MISSION & VISION TILES */}
      <section className="grid grid-cols-1 lg:grid-cols-2 text-stone-900 md:text-white">
        {/* Mission Box */}
        <div className="bg-white md:bg-teal-800 lg:bg-teal-800 flex items-center justify-center py-12 md:py-20 lg:h-160">
          <div className="px-8 md:px-12 lg:px-20">
            <h3 className="font-semibold text-2xl lg:text-3xl text-start lg:text-center mb-4 text-teal-800 md:text-white">
              Mission
            </h3>
            <p className="tracking-wide font-light text-stone-600 md:text-stone-100 leading-relaxed text-sm md:text-base">
              Healthcare and surgical interventions are the bedrock of human dignity and survival. Our mission is to transform clinical care by supplying Nigerian surgeons, anesthetists, and medical professionals with world-class, sterile, and durable surgical instruments, telemetry apparatus, and rapid technical calibration that safeguards every operating room procedure.
            </p>
          </div>
        </div>

        {/* Mission Photo */}
        <div className="w-full flex items-center justify-center h-[50vh] md:h-[65vh] lg:h-160 relative overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=1200&auto=format&fit=crop"
            alt="Surgical Precision Instruments"
            className="object-cover h-full w-full"
          />
        </div>

        {/* Vision Photo */}
        <div className="w-full hidden lg:flex items-center justify-center h-160 overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1551076805-e1869033e561?q=80&w=1200&auto=format&fit=crop"
            alt="Operating Room Monitoring and Bed"
            className="object-cover h-full w-full"
          />
        </div>

        {/* Vision Box */}
        <div className="bg-white md:bg-[#594937] lg:bg-[#594937] flex items-center justify-center py-12 md:py-20 lg:h-160">
          <div className="px-8 md:px-12 lg:px-20">
            <h3 className="font-semibold text-2xl lg:text-3xl text-start lg:text-center mb-4 text-[#8E702D] md:text-white">
              Vision
            </h3>
            <p className="tracking-wide font-light text-stone-600 md:text-stone-100 leading-relaxed text-sm md:text-base">
              Elpima's vision is to establish West Africa's gold standard for medical technology logistics and hospital equipment reliability. We envision a healthcare landscape where zero surgical operations in Nigeria are postponed due to instrument shortages, uncalibrated equipment, or lack of replacement parts.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 4: EDITORIAL PERSPECTIVE */}
      <section className="mt-16 md:mt-24">
        {/* Bridge 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-[3fr_4fr] w-[90%] lg:w-[80%] mx-auto mb-10 gap-6">
          <div className="font-semibold text-2xl lg:text-3xl text-stone-900">
            <p>We Build Bridges Between</p>
            <p className="text-teal-600">Surgeons & Reliable Equipment</p>
          </div>
          <div className="text-stone-600 tracking-wide font-light text-sm md:text-base leading-relaxed space-y-3">
            <p>
              We believe that absolute reliability in surgical instrumentation is non-negotiable. Every scalpel, forceps, laparoscopic trocar, and electrosurgical unit plays a direct role in patient recovery. By maintaining rigorous ISO 13485:2016 traceability and CE certifications, we ensure that every instrument deployed in a Nigerian operating room performs with flawless mechanical precision.
            </p>
            <p>
              Our resident biomedical teams collaborate directly with theater nurses and surgical teams, conducting structured maintenance drills and autoclave compatibility checks to maximize instrument longevity.
            </p>
          </div>
        </div>

        <div className="flex items-center justify-center overflow-hidden h-[60vh] md:h-[80vh] w-full">
          <img
            src="https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?q=80&w=1800&auto=format&fit=crop"
            alt="Surgical Precision Instruments Array"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Bridge 2 */}
        <div className="mt-16 md:mt-24 grid grid-cols-1 lg:grid-cols-[3fr_4fr] w-[90%] lg:w-[80%] mx-auto mb-10 gap-6">
          <div className="font-semibold text-2xl lg:text-3xl text-stone-900">
            <p>We Believe in Mutual</p>
            <p className="text-[#8E702D]">Institutional Collaboration</p>
          </div>
          <div className="text-stone-600 tracking-wide font-light text-sm md:text-base leading-relaxed space-y-3">
            <p>
              Equipping modern medical centers requires deep synergy between hospital boards, procurement committees, and biomedical engineers. We provide transparent proforma RFQs, verified warranty frameworks, and rapid spare-part replenishment across all 36 Nigerian states.
            </p>
            <p>
              From our regional hubs in Lagos, Abuja, and Port Harcourt, we ensure seamless supply chain transit with certified cold-chain and shock-protected delivery protocols.
            </p>
          </div>
        </div>

        <div className="flex items-center justify-center overflow-hidden h-[60vh] md:h-[80vh] w-full">
          <img
            src="https://images.unsplash.com/photo-1516549655169-df83a0774514?q=80&w=1800&auto=format&fit=crop"
            alt="Clinical Monitoring Center"
            className="w-full h-full object-cover"
          />
        </div>
      </section>

      {/* SECTION 5: TESTIMONIALS CAROUSEL */}
      <section className="w-full lg:w-[80%] mx-auto py-16 md:py-24 overflow-x-hidden">
        <h2 className="text-center font-bold text-2xl text-teal-600 mb-2">
          Endorsements from Healthcare Providers
        </h2>
        <p className="text-center text-xs text-stone-600 font-light mb-12">
          Read what Chief Medical Directors and surgical specialists say about partnering with Elpima Surgicals.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-12 items-center gap-10">
          <div className="lg:col-span-5 flex items-center justify-center">
            <div className="w-64 h-64 md:w-80 md:h-80 rounded-full border-4 border-teal-600 p-2 relative shadow-xl">
              <img
                src="https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=800&auto=format&fit=crop"
                alt="Nigerian Hospital Surgeon"
                className="w-full h-full object-cover rounded-full"
              />
              <div className="absolute -bottom-3 -right-3 bg-[#FAF6EE] text-[#8E702D] border border-[#D4AF37] px-4 py-1.5 rounded-full text-xs font-semibold shadow-md">
                Verified Clinical Partner
              </div>
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="bg-[#FFF2F0] md:bg-white rounded-2xl border-2 border-teal-600 p-8 md:p-10 relative shadow-sm">
              <div className="bg-teal-600 text-white p-2 rounded-full absolute -top-4 left-8 shadow-sm">
                <Quote className="w-5 h-5" />
              </div>

              <p className="text-stone-700 text-sm md:text-base leading-relaxed font-light mb-8 pt-2">
                "{testimonials[currentTestimonialIndex].content}"
              </p>

              <div>
                <h4 className="font-bold text-base text-stone-900">
                  {testimonials[currentTestimonialIndex].author}
                </h4>
                <p className="text-xs text-teal-800 font-medium">
                  {testimonials[currentTestimonialIndex].role}
                </p>
              </div>

              <div className="flex items-center space-x-2 mt-6">
                {testimonials.map((_, dotIndex) => (
                  <button
                    key={dotIndex}
                    type="button"
                    onClick={() => handleSelectTestimonial(dotIndex)}
                    className={`transition-all duration-300 rounded-full ${
                      dotIndex === currentTestimonialIndex
                        ? "bg-teal-700 w-8"
                        : "bg-stone-300 w-2.5"
                    } h-2.5 cursor-pointer`}
                    aria-label={`Go to testimonial ${dotIndex + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* BOTTOM CTA BANNER */}
      <section className="bg-teal-900 py-16 px-6 text-center text-white">
        <div className="max-w-3xl mx-auto space-y-4">
          <h3 className="text-2xl md:text-3xl font-bold tracking-tight">
            Ready to Equip Your Surgical Theater?
          </h3>
          <p className="text-stone-300 text-sm font-light leading-relaxed">
            Contact our institutional procurement desk for certified equipment proforma quotes, equipment leasing options, and customized clinical sets.
          </p>
          <div className="pt-4 flex flex-wrap justify-center gap-4">
            <Link to={ROUTES.PUBLIC.CATALOG}>
              <button
                type="button"
                className="bg-white text-teal-900 hover:bg-stone-100 font-medium px-6 py-3 rounded-full text-sm cursor-pointer shadow-md transition-colors"
              >
                Browse Catalog
              </button>
            </Link>
            <Link to={ROUTES.PUBLIC.CONTACT}>
              <button
                type="button"
                className="bg-transparent border border-white text-white hover:bg-white/10 font-medium px-6 py-3 rounded-full text-sm cursor-pointer transition-colors"
              >
                Contact Procurement Desk
              </button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
