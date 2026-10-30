import React, { useState } from "react";
import {
  Phone,
  Mail,
  MessageSquare,
  MapPin,
  ChevronDown,
  CheckCircle2,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface ContactFormData {
  fullName: string;
  hospitalName: string;
  email: string;
  phoneNumber: string;
  message: string;
}

const PROCUREMENT_FAQ_ITEMS = [
  {
    question: "How quickly can Elpima issue an official itemized proforma invoice?",
    answer:
      "Formal institutional proforma quotes are dispatched via encrypted PDF within 2 to 4 business hours. For emergency theater surgical cases, our WhatsApp expedited desk can generate a provisional itemized quote with active batch lot numbers in under 30 minutes.",
  },
  {
    question: "What direct manufacturer warranty and calibration agreements are provided?",
    answer:
      "All capital equipment (laparoscopic video towers, patient telemetry monitors, surgical lamps, and electro-hydraulic tables) includes a comprehensive 12 to 24-month OEM warranty. This encompasses on-site quarterly preventive maintenance (PPM) and rapid emergency calibration performed by our resident Nigerian biomedical engineers.",
  },
  {
    question: "Do you supply and provide doorstep delivery to hospitals outside Lagos and Abuja?",
    answer:
      "Yes. We operate dedicated insured medical logistics networks delivering safely to federal medical centers, teaching hospitals, state specialist hospitals, and private surgical centers across all 36 Nigerian states and the FCT.",
  },
  {
    question: "Can our hospital request an equipment trial or surgeon demonstration prior to purchase?",
    answer:
      "Yes. For capital installations (such as 4K laparoscopic camera systems, harmonic scalpels, and ultrasound Doppler systems), our clinical applications specialist and biomedical team can arrange a scheduled on-site hospital demonstration or surgical team workshop.",
  },
  {
    question: "What are your institutional payment terms for government and private tenders?",
    answer:
      "We accommodate approved institutional Local Purchase Orders (LPOs), milestone-based payment schedules, and verified bank guarantees for recognized teaching hospitals and established healthcare institutions.",
  },
];

export const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState<ContactFormData>({
    fullName: "",
    hospitalName: "",
    email: "",
    phoneNumber: "+234",
    message: "",
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmittedSuccessfully, setIsSubmittedSuccessfully] = useState(false);
  const [activeFaqIndex, setActiveFaqIndex] = useState<number | null>(0);

  const handleInputChange = (
    field: keyof ContactFormData,
    value: string,
  ) => {
    setFormData((previousData) => ({
      ...previousData,
      [field]: value,
    }));
    if (formErrors[field]) {
      setFormErrors((previousErrors) => {
        const updatedErrors = { ...previousErrors };
        delete updatedErrors[field];
        return updatedErrors;
      });
    }
  };

  const handleFormSubmit = async (submitEvent: React.FormEvent) => {
    submitEvent.preventDefault();
    const errors: Record<string, string> = {};

    if (!formData.fullName.trim()) {
      errors.fullName = "Full name and title are required.";
    }
    if (!formData.hospitalName.trim()) {
      errors.hospitalName = "Hospital or healthcare clinic name is required.";
    }
    if (!formData.email.trim()) {
      errors.email = "Email address is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      errors.email = "Please enter a valid email address.";
    }
    if (!formData.phoneNumber.trim() || formData.phoneNumber.trim().length < 8) {
      errors.phoneNumber = "Valid phone or WhatsApp number is required.";
    }
    if (!formData.message.trim()) {
      errors.message = "Please describe the required equipment or inquiry.";
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      toast.error("Please fill in all required fields.");
      return;
    }

    setIsSubmitting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 800));
      setIsSubmittedSuccessfully(true);
      toast.success(
        "Inquiry received! Our medical procurement desk will reach out within 2 hours.",
      );
      setFormData({
        fullName: "",
        hospitalName: "",
        email: "",
        phoneNumber: "+234",
        message: "",
      });
    } catch {
      toast.error(
        "Could not transmit message. Please reach our direct hotline or WhatsApp.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleFaq = (index: number) => {
    setActiveFaqIndex((currentIndex) =>
      currentIndex === index ? null : index,
    );
  };

  return (
    <div className="playpen-sans md:w-[96%] lg:w-[96%] mx-auto pb-16">
      {/* SECTION 1: HEADER BANNER */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 pt-40 w-[90%] md:w-[96%] lg:w-[96%] mx-auto pb-12 md:pb-20">
        <div>
          <h1 className="font-[500] md:font-semibold lg:font-semibold text-[28px] md:text-5xl lg:text-5xl mb-4 md:mb-0 text-teal-600">
            CONTACT US
          </h1>
        </div>
        <div>
          <p className="text-md tracking-wider md:mr-20 lg:mr-20 text-[#6F7787] md:text-black font-light leading-relaxed">
            Need an institutional proforma quote, on-site theater calibration, or urgent biomedical support? We are here for you—reach out anytime and let us equip your medical facility!
          </p>
        </div>
      </section>

      {/* SECTION 2: 2-COLUMN SPLIT (GET IN TOUCH & FORM) */}
      <section className="bg-teal-600 md:bg-[#F6F6F6] lg:bg-[#F6F6F6] md:rounded-2xl lg:rounded-2xl grid grid-cols-1 lg:grid-cols-2 mb-20 shadow-sm overflow-hidden">
        {/* Left Side: GET IN TOUCH */}
        <div className="flex items-center justify-center py-12 md:py-16 text-white md:text-stone-900 px-6 sm:px-10">
          <div className="w-full max-w-md space-y-8">
            <h2 className="text-center font-bold text-xl md:text-2xl tracking-wider uppercase">
              GET IN TOUCH
            </h2>

            <div className="space-y-6">
              {/* Phone Channel */}
              <div className="flex items-center gap-4">
                <div className="text-teal-600 md:text-white bg-white md:bg-teal-600 rounded-full text-xl w-12 h-12 flex items-center justify-center shrink-0 shadow-sm">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-semibold text-sm md:text-base tracking-wide">
                    Phone Numbers
                  </p>
                  <a
                    href="tel:+234800357462"
                    className="text-xs md:text-sm text-stone-100 md:text-stone-600 hover:underline block"
                  >
                    +234 (0) 800-ELPIMA
                  </a>
                  <span className="text-[11px] text-teal-100 md:text-stone-500 block">
                    Direct Hotline: +234 814 990 0112
                  </span>
                </div>
              </div>

              {/* Email Channel */}
              <div className="flex items-center gap-4">
                <div className="text-teal-600 md:text-white bg-white md:bg-teal-600 rounded-full text-xl w-12 h-12 flex items-center justify-center shrink-0 shadow-sm">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-semibold text-sm md:text-base tracking-wide">
                    E-mail Addresses
                  </p>
                  <a
                    href="mailto:procurement@elpimasurgicals.com"
                    className="text-xs md:text-sm text-stone-100 md:text-stone-600 hover:underline block"
                  >
                    procurement@elpimasurgicals.com
                  </a>
                  <span className="text-[11px] text-teal-100 md:text-stone-500 block">
                    support@elpimasurgicals.com
                  </span>
                </div>
              </div>

              {/* WhatsApp Channel */}
              <div className="flex items-center gap-4">
                <div className="text-teal-600 md:text-white bg-white md:bg-teal-600 rounded-full text-xl w-12 h-12 flex items-center justify-center shrink-0 shadow-sm">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-semibold text-sm md:text-base tracking-wide">
                    WhatsApp Procurement Desk
                  </p>
                  <a
                    href="https://wa.me/2348149900112?text=Hello%20Elpima%20Surgicals,%20I%20would%20like%20to%20inquire%20about%20medical%20equipment"
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs md:text-sm text-stone-100 md:text-stone-600 hover:underline block font-medium"
                  >
                    +234 814 990 0112 (Active 24/7)
                  </a>
                  <span className="text-[11px] text-teal-100 md:text-stone-500 block">
                    Immediate proforma estimates via chat
                  </span>
                </div>
              </div>

              {/* Physical Office */}
              <div className="flex items-center gap-4">
                <div className="text-teal-600 md:text-white bg-white md:bg-teal-600 rounded-full text-xl w-12 h-12 flex items-center justify-center shrink-0 shadow-sm">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-semibold text-sm md:text-base tracking-wide">
                    Headquarters & Central Lab
                  </p>
                  <p className="text-xs md:text-sm text-stone-100 md:text-stone-600">
                    14 Medical Science Way, Ikeja GRA, Lagos State, Nigeria
                  </p>
                  <span className="text-[11px] text-teal-100 md:text-stone-500 block">
                    Branches in Abuja & Port Harcourt
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: CONTACT FORM CARD */}
        <div className="p-4 pb-10 md:p-8 lg:p-8">
          <div className="bg-white rounded-2xl px-6 md:px-10 py-8 shadow-md">
            <h3 className="text-center font-bold text-xl pb-6 tracking-wider text-teal-600 uppercase">
              CONTACT FORM
            </h3>

            {isSubmittedSuccessfully ? (
              <div className="text-center py-10 space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h4 className="font-bold text-lg text-stone-900">
                  Inquiry Dispatched Successfully
                </h4>
                <p className="text-xs text-stone-600 max-w-sm mx-auto font-light leading-relaxed">
                  Thank you for reaching out. Our clinical equipment desk has received your request and will provide an itemized response within 2 hours.
                </p>
                <button
                  type="button"
                  onClick={() => setIsSubmittedSuccessfully(false)}
                  className="mt-4 px-6 py-2.5 rounded-full bg-teal-600 text-white text-xs font-medium cursor-pointer"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleFormSubmit} className="space-y-6">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 uppercase mb-1">
                    FULL NAME & TITLE
                  </label>
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(changeEvent) =>
                      handleInputChange("fullName", changeEvent.target.value)
                    }
                    placeholder="e.g. Dr. Emmanuel Okoro, FWACS"
                    className="w-full border-b border-stone-400 outline-none py-1.5 text-sm text-stone-900 placeholder:text-stone-400 focus:border-teal-600 transition-colors"
                  />
                  {formErrors.fullName && (
                    <span className="text-[11px] text-rose-500 block mt-1">
                      {formErrors.fullName}
                    </span>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 uppercase mb-1">
                    HOSPITAL / CLINIC NAME
                  </label>
                  <input
                    type="text"
                    value={formData.hospitalName}
                    onChange={(changeEvent) =>
                      handleInputChange("hospitalName", changeEvent.target.value)
                    }
                    placeholder="e.g. Cedar Surgical Specialists, Abuja"
                    className="w-full border-b border-stone-400 outline-none py-1.5 text-sm text-stone-900 placeholder:text-stone-400 focus:border-teal-600 transition-colors"
                  />
                  {formErrors.hospitalName && (
                    <span className="text-[11px] text-rose-500 block mt-1">
                      {formErrors.hospitalName}
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 uppercase mb-1">
                      EMAIL ADDRESS
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(changeEvent) =>
                        handleInputChange("email", changeEvent.target.value)
                      }
                      placeholder="e.g. procurement@hospital.org"
                      className="w-full border-b border-stone-400 outline-none py-1.5 text-sm text-stone-900 placeholder:text-stone-400 focus:border-teal-600 transition-colors"
                    />
                    {formErrors.email && (
                      <span className="text-[11px] text-rose-500 block mt-1">
                        {formErrors.email}
                      </span>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 uppercase mb-1">
                      PHONE / WHATSAPP
                    </label>
                    <input
                      type="text"
                      value={formData.phoneNumber}
                      onChange={(changeEvent) =>
                        handleInputChange("phoneNumber", changeEvent.target.value)
                      }
                      placeholder="+234 800 000 0000"
                      className="w-full border-b border-stone-400 outline-none py-1.5 text-sm text-stone-900 placeholder:text-stone-400 focus:border-teal-600 transition-colors"
                    />
                    {formErrors.phoneNumber && (
                      <span className="text-[11px] text-rose-500 block mt-1">
                        {formErrors.phoneNumber}
                      </span>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 uppercase mb-2">
                    MESSAGE & EQUIPMENT SPECIFICATIONS
                  </label>
                  <textarea
                    rows={5}
                    value={formData.message}
                    onChange={(changeEvent) =>
                      handleInputChange("message", changeEvent.target.value)
                    }
                    placeholder="Describe equipment needed, clinical specialty, required quantities, or tender deadline..."
                    className="w-full border border-stone-300 rounded-xl p-3 text-sm text-stone-900 placeholder:text-stone-400 focus:border-teal-600 focus:outline-none transition-colors"
                  ></textarea>
                  {formErrors.message && (
                    <span className="text-[11px] text-rose-500 block mt-1">
                      {formErrors.message}
                    </span>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-teal-600 hover:bg-teal-700 text-white py-3 w-full rounded-xl font-medium text-sm transition-colors cursor-pointer shadow-sm disabled:opacity-50"
                >
                  {isSubmitting ? "Transmitting..." : "Send Clinical Inquiry"}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* SECTION 3: FAQ ACCORDION */}
      <section className="w-[90%] md:w-[85%] mx-auto py-10">
        <h3 className="text-2xl font-bold text-center text-teal-600 mb-2">
          Frequently Asked Questions
        </h3>
        <p className="text-center text-xs text-stone-500 font-light mb-10">
          Everything you need to know about purchasing, warranty, and logistics across Nigeria.
        </p>

        <div className="space-y-4 max-w-3xl mx-auto">
          {PROCUREMENT_FAQ_ITEMS.map((faqItem, itemIndex) => {
            const isOpen = activeFaqIndex === itemIndex;
            return (
              <div
                key={itemIndex}
                className="bg-white border border-stone-200 rounded-2xl overflow-hidden transition-all shadow-xs"
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(itemIndex)}
                  className="w-full flex items-center justify-between p-5 text-left font-medium text-stone-900 text-sm hover:text-teal-700 transition-colors cursor-pointer"
                >
                  <span>{faqItem.question}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-stone-500 transition-transform duration-200 shrink-0 ml-4 ${
                      isOpen ? "rotate-180 text-teal-600" : ""
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs text-stone-600 font-light leading-relaxed border-t border-stone-100">
                    {faqItem.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};

export default ContactPage;
