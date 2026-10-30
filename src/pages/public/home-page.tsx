import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ShieldCheck,
  Stethoscope,
  Award,
  Clock,
  ArrowRight,
  Plus,
  Quote,
  CheckCircle2,
  Package,
} from "lucide-react";
import { useProductsQuery } from "@/hooks/queries";
import { ROUTES } from "@/routes";
import { useQuoteBagStore } from "@/store/quote-bag-store";
import { toast } from "@/hooks/use-toast";
import type { Product } from "@/types/domain";

export const HomePage: React.FC = () => {
  const [currentTestimonialIndex, setCurrentTestimonialIndex] = useState(0);
  const addItemToQuoteBag = useQuoteBagStore((state) => state.addItem);

  // Fetch live products from backend API
  const { data: productsData, isLoading: isProductsLoading } = useProductsQuery({
    page: 1,
    limit: 6,
  });

  const liveProducts: Product[] = productsData?.items ?? [];

  const stats = [
    {
      icon: Stethoscope,
      text: "Hospitals Equipped Nationwide",
      value: "250+",
      subtext: "Teaching & Surgical Centers",
    },
    {
      icon: Award,
      text: "Certified Clinical SKUs",
      value: "1,500+",
      subtext: "NAFDAC & CE Regulated",
    },
    {
      icon: Clock,
      text: "Biomedical Response Gap",
      value: "< 4 Hours",
      subtext: "Emergency Technical Support",
    },
  ];

  const testimonials = [
    {
      content:
        "Elpima Surgicals completely equipped our new surgical wing with high-definition laparoscopic towers and titanium orthopedic sets. Their biomedical engineers personally conducted the calibration and user training in Ikeja. We have had zero equipment downtime in 18 months of intensive theater usage.",
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
    const autoRotationInterval = setInterval(() => {
      handleNextTestimonial();
    }, 6000);

    return () => clearInterval(autoRotationInterval);
  }, []);

  const handleAddProductToQuote = (targetProduct: Product) => {
    addItemToQuoteBag({
      productId: targetProduct.id,
      name: targetProduct.name,
      slug: targetProduct.slug,
      sku: targetProduct.sku,
      category:
        typeof targetProduct.category === "object"
          ? targetProduct.category?.name
          : undefined,
      image: targetProduct.images?.[0] || "",
    });

    toast.success(
      `${targetProduct.name} has been added to your institutional RFQ draft.`,
    );
  };

  return (
    <div className="playpen-sans">
      {/* HERO SECTION */}
      <section className="w-full relative flex items-center justify-center h-screen overflow-hidden">
        <div className="h-full w-full flex items-center justify-center">
          <img
            src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=2000&auto=format&fit=crop"
            alt="State-of-the-Art Hospital Operating Theater"
            className="hidden md:block object-cover h-full w-full"
          />
          <img
            src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=1200&auto=format&fit=crop"
            alt="Surgical Precision Instruments"
            className="block md:hidden h-full w-full object-cover"
          />
        </div>

        {/* Large screen hero text overlay */}
        <div className="hidden md:flex bg-gradient-to-r items-center h-full w-full from-[#032320e0] via-[#04332ee0] to-[#042f2c80] absolute top-0 p-4 font-semibold text-white">
          <div className="pl-10 lg:pl-32 w-8/12 lg:w-7/12 tracking-wide">
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-[#FAF6EE]/15 text-[#D4AF37] border border-[#D4AF37]/40 mb-6">
              <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
              Official Surgical & Medical Equipment Supplier
            </span>
            <h1 className="text-3xl lg:text-5xl mb-6 font-bold leading-tight">
              Your Clinical Equipment & Surgical Supply Partner Across Nigeria
            </h1>
            <p className="font-light text-base lg:text-lg mb-8 text-stone-200 max-w-2xl leading-relaxed">
              Equipping federal teaching hospitals, surgical clinics, and healthcare centers with CE & ISO-certified surgical sets, theater monitors, and 24/7 biomedical engineering maintenance.
            </p>
            <div className="flex items-center gap-4">
              <Link to={ROUTES.PUBLIC.CATALOG}>
                <button
                  type="button"
                  className="bg-teal-600 hover:bg-teal-700 text-white py-3.5 px-8 rounded-full font-medium text-sm lg:text-base cursor-pointer transition-colors shadow-lg"
                >
                  Explore Equipment Catalog
                </button>
              </Link>
              <Link to={ROUTES.PUBLIC.QUOTE_REQUEST}>
                <button
                  type="button"
                  className="bg-[#FAF6EE] hover:bg-white text-stone-900 border border-[#D4AF37] py-3.5 px-8 rounded-full font-medium text-sm lg:text-base cursor-pointer transition-colors"
                >
                  Request Proforma RFQ
                </button>
              </Link>
            </div>
          </div>
        </div>

        {/* Small screen hero text overlay */}
        <div className="md:hidden flex items-end h-full w-full bg-gradient-to-t from-[#021d1bfa] via-[#032320cc] to-transparent absolute top-0 p-5 font-semibold text-white">
          <div className="w-full mb-12">
            <span className="inline-block px-3 py-1 rounded-full text-[11px] font-semibold bg-teal-900/60 text-[#D4AF37] border border-[#D4AF37]/30 mb-3">
              NAFDAC & ISO Regulated
            </span>
            <h1 className="text-2xl mb-4 font-bold tracking-tight leading-snug">
              Your Clinical Equipment & Surgical Partner
            </h1>
            <p className="font-light text-xs mb-6 text-stone-200 leading-relaxed">
              Equipping Nigerian surgical theaters and hospitals with certified precision equipment and 24/7 support.
            </p>
            <div className="flex flex-col gap-2.5">
              <Link to={ROUTES.PUBLIC.CATALOG}>
                <button
                  type="button"
                  className="bg-teal-600 text-xs font-medium text-white py-3 px-6 rounded-full w-full cursor-pointer"
                >
                  Explore Equipment Catalog
                </button>
              </Link>
              <Link to={ROUTES.PUBLIC.QUOTE_REQUEST}>
                <button
                  type="button"
                  className="bg-white/10 text-xs font-medium text-white border border-white/30 py-3 px-6 rounded-full w-full cursor-pointer text-center"
                >
                  Request Proforma RFQ
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 1: STATS STRIP */}
      <section className="bg-[#FFF2F0] md:bg-teal-900 lg:bg-teal-900 p-4 md:py-10 flex items-center justify-center">
        <div className="w-full md:w-[90%] lg:w-[80%] mx-auto py-2">
          <h2 className="text-white text-center mb-8 font-semibold text-xl hidden md:block">
            Delivering Uncompromised Clinical Precision Across Nigeria
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-8 w-full">
            {stats.map((statItem, indexValue) => {
              const IconComponent = statItem.icon;
              return (
                <div
                  key={indexValue}
                  className="bg-[#FFF2F0] flex items-center gap-4 lg:gap-6 px-5 py-4 rounded-xl shadow-md md:shadow-none border border-teal-100"
                >
                  <div className="w-12 h-12 rounded-full bg-white text-teal-700 flex items-center justify-center shrink-0 shadow-sm">
                    <IconComponent className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <p className="text-teal-900 font-bold text-xl lg:text-2xl">
                      {statItem.value}
                    </p>
                    <p className="text-stone-700 text-xs lg:text-sm font-medium">
                      {statItem.text}
                    </p>
                    <p className="text-stone-500 text-[11px] font-light">
                      {statItem.subtext}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* SECTION 2: 3-BOX SPLIT (Desktop) */}
      <section className="bg-teal-950 hidden lg:block p-14">
        <div className="grid grid-cols-3 w-full lg:w-[80%] lg:mx-auto rounded-2xl overflow-hidden shadow-2xl">
          <div className="bg-[#F5E8E8] flex flex-col justify-center pt-12 pb-16 px-8 lg:px-10">
            <div className="w-full flex justify-start mb-4">
              <span className="px-3.5 py-1 rounded-full text-xs font-semibold bg-[#FAF6EE] text-[#8E702D] border border-[#D4AF37]/30">
                Institutional Quality Guarantee
              </span>
            </div>
            <h3 className="font-bold text-xl text-teal-600 mb-4">
              Equipping Nigerian Theaters with Uncompromising Precision
            </h3>
            <p className="font-light leading-relaxed text-sm text-stone-700">
              At Elpima Surgicals, we support surgeons, anesthetists, and biomedical teams at every step. From initial hospital procurement consultations to technical calibration and fast proforma generation, we supply medical hardware that meets international ISO 13485 and CE standards. Every shipment is inspected to guarantee clinical sterility, metallurgical integrity, and patient safety across Nigeria.
            </p>
          </div>
          <div className="flex items-center justify-center overflow-hidden relative">
            <img
              src="https://images.unsplash.com/photo-1551076805-e1869033e561?q=80&w=800&auto=format&fit=crop"
              alt="Modular Surgical Operating Suite"
              className="h-full w-full object-cover"
            />
          </div>
          <div className="flex items-center justify-center overflow-hidden relative">
            <img
              src="https://images.unsplash.com/photo-1583912267670-6575ad362e3b?q=80&w=800&auto=format&fit=crop"
              alt="Titanium Surgical Instruments Set"
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* SECTION 2: 2-BOX SPLIT (Mobile/Tablet) */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:hidden w-[90%] mx-auto my-8 rounded-2xl overflow-hidden shadow-md">
        <div className="w-full h-64 md:h-auto overflow-hidden flex items-center justify-center">
          <img
            src="https://images.unsplash.com/photo-1551076805-e1869033e561?q=80&w=800&auto=format&fit=crop"
            alt="Surgical Theater Equipment"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="bg-[#F5E8E8] px-6 py-8 flex flex-col justify-center">
          <h3 className="font-bold text-lg text-teal-600 mb-3">
            Equipping Nigerian Healthcare Providers
          </h3>
          <p className="text-xs leading-relaxed text-stone-700 font-light">
            At Elpima Surgicals, we empower Nigerian medical teams with certified surgical instruments, reliable patient monitors, and 24/7 biomedical engineering assistance. Every solution is tailored to the demanding environment of modern clinical facilities.
          </p>
        </div>
      </section>

      {/* SECTION 3: WHAT WE PROVIDE */}
      <section className="w-full md:w-[90%] lg:w-[80%] mx-auto py-12 md:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          {/* Left Visual Composition */}
          <div className="hidden lg:flex items-center justify-center relative h-[450px]">
            <div className="w-[80%] relative h-[90%]">
              <div className="w-[60%] h-[60%] absolute top-0 left-0 rounded-2xl overflow-hidden shadow-xl border-4 border-white">
                <img
                  src="https://images.unsplash.com/photo-1516549655169-df83a0774514?q=80&w=600&auto=format&fit=crop"
                  alt="ICU Monitoring Station"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="w-[60%] h-[60%] absolute bottom-0 right-0 rounded-2xl overflow-hidden shadow-xl border-4 border-[#FFF2F0]">
                <img
                  src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=600&auto=format&fit=crop"
                  alt="Laparoscopy System"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <div className="absolute top-6 right-8 bg-[#FAF6EE] border border-[#D4AF37]/40 text-[#8E702D] px-4 py-2 rounded-xl text-xs font-semibold shadow-md">
              ISO 13485 Certified
            </div>
            <div className="absolute bottom-6 left-8 bg-teal-50 border border-teal-200 text-teal-800 px-4 py-2 rounded-xl text-xs font-semibold shadow-md">
              24/7 Engineering Support
            </div>
          </div>

          {/* Right Checklist Items with Signature Colored Square Indicators */}
          <div className="bg-[#FFF2F0] md:bg-transparent p-6 md:p-0 rounded-2xl">
            <span className="text-xs font-bold tracking-widest text-[#D4AF37] uppercase block mb-2">
              Clinical Quality & Capabilities
            </span>
            <h3 className="font-bold text-2xl lg:text-3xl text-teal-600 mb-6">
              What We Provide For Surgical Theaters & Clinical Teams
            </h3>

            <div className="grid grid-cols-1 gap-5">
              <div className="flex gap-4 relative">
                <div className="mr-3 mt-1.5 shrink-0">
                  <div className="w-4 h-4 bg-teal-600 rounded"></div>
                </div>
                <p className="text-sm text-stone-700 leading-relaxed font-light">
                  <strong className="font-semibold text-stone-900 block">
                    German 316L & Titanium Surgical Sets:
                  </strong>
                  Precision general surgery, orthopedics, neurosurgery, and cardiovascular instrument trays crafted with corrosion-resistant metallurgy for repeated autoclave sterilization.
                </p>
              </div>

              <div className="flex gap-4 relative">
                <div className="mr-3 mt-1.5 shrink-0">
                  <div className="w-4 h-4 bg-[#D4AF37] rounded"></div>
                </div>
                <p className="text-sm text-stone-700 leading-relaxed font-light">
                  <strong className="font-semibold text-stone-900 block">
                    High-Definition 4K Laparoscopy & Imaging:
                  </strong>
                  Minimally invasive endoscopy video towers, medical-grade LED illumination systems, and ultrasound diagnostics engineered for clinical acuity.
                </p>
              </div>

              <div className="flex gap-4 relative">
                <div className="mr-3 mt-1.5 shrink-0">
                  <div className="w-4 h-4 bg-[#E07A5F] rounded"></div>
                </div>
                <p className="text-sm text-stone-700 leading-relaxed font-light">
                  <strong className="font-semibold text-stone-900 block">
                    ICU Critical Care & Anesthesia Apparatus:
                  </strong>
                  Multi-parameter telemetry monitors, microprocessor ventilators, syringe infusion pumps, and electro-hydraulic theater operating tables.
                </p>
              </div>

              <div className="flex gap-4 relative">
                <div className="mr-3 mt-1.5 shrink-0">
                  <div className="w-4 h-4 bg-teal-600 rounded"></div>
                </div>
                <p className="text-sm text-stone-700 leading-relaxed font-light">
                  <strong className="font-semibold text-stone-900 block">
                    Local Biomedical Warranty & Calibration:
                  </strong>
                  Guaranteed factory warranty, rapid replacement parts inventory, and certified biomedical engineers stationed across Lagos, Abuja, and Port Harcourt.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4: LIVE PRODUCTS FROM API */}
      <section className="bg-stone-50 py-16 md:py-24 border-y border-stone-200">
        <div className="w-[90%] lg:w-[80%] mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <span className="text-xs font-bold tracking-widest text-[#D4AF37] uppercase block mb-1">
                Hospital Procurement Inventory
              </span>
              <h2 className="text-2xl md:text-3xl font-bold text-teal-600 tracking-tight">
                Featured Clinical Equipment & Surgical Sets
              </h2>
              <p className="text-sm text-stone-600 font-light mt-1 max-w-xl">
                Real-time stock catalog ready for immediate hospital dispatch, institutional purchase orders, and proforma RFQ generation.
              </p>
            </div>
            <Link
              to={ROUTES.PUBLIC.CATALOG}
              className="inline-flex items-center gap-2 text-sm font-semibold text-teal-700 hover:text-teal-800 transition-colors"
            >
              <span>View All Equipment</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Loading Skeleton */}
          {isProductsLoading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, skeletonIndex) => (
                <div
                  key={skeletonIndex}
                  className="bg-white rounded-2xl border border-stone-200 overflow-hidden p-4 space-y-4 animate-pulse"
                >
                  <div className="h-48 bg-stone-200 rounded-xl"></div>
                  <div className="h-4 bg-stone-200 rounded w-1/3"></div>
                  <div className="h-5 bg-stone-200 rounded w-3/4"></div>
                  <div className="h-3 bg-stone-200 rounded w-full"></div>
                </div>
              ))}
            </div>
          )}

          {/* Live Products Grid */}
          {!isProductsLoading && liveProducts.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {liveProducts.map((productItem) => {
                const categoryName =
                  typeof productItem.category === "object"
                    ? productItem.category?.name
                    : "Clinical Equipment";

                const thumbnailImage =
                  productItem.images?.[0] ||
                  "https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=800&auto=format&fit=crop";

                return (
                  <div
                    key={productItem.id}
                    className="bg-white rounded-2xl border border-stone-200 overflow-hidden hover:shadow-lg transition-shadow flex flex-col justify-between"
                  >
                    <div>
                      {/* Product Thumbnail */}
                      <div className="relative h-52 bg-stone-100 overflow-hidden">
                        <img
                          src={thumbnailImage}
                          alt={productItem.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute top-3 left-3">
                          <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-white/90 text-teal-800 shadow-sm border border-stone-200">
                            {categoryName}
                          </span>
                        </div>
                        <div className="absolute top-3 right-3">
                          <span
                            className={`px-2.5 py-1 rounded-full text-[11px] font-medium shadow-sm ${
                              productItem.inStock
                                ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                                : "bg-amber-50 text-amber-800 border border-amber-200"
                            }`}
                          >
                            {productItem.inStock ? "In Stock" : "On Order"}
                          </span>
                        </div>
                      </div>

                      {/* Product Info */}
                      <div className="p-5">
                        {productItem.sku && (
                          <span className="text-[11px] font-mono text-stone-500 uppercase block mb-1">
                            SKU: {productItem.sku}
                          </span>
                        )}
                        <h4 className="font-bold text-base text-stone-900 line-clamp-1 mb-2">
                          {productItem.name}
                        </h4>
                        <p className="text-xs text-stone-600 font-light line-clamp-2 leading-relaxed mb-4">
                          {productItem.shortDescription ||
                            productItem.description ||
                            "Hospital-grade surgical apparatus meeting international safety and clinical efficacy standards."}
                        </p>

                        {/* Compliance Badges */}
                        <div className="flex flex-wrap items-center gap-1.5 mb-2">
                          <span className="inline-flex items-center gap-1 text-[10px] font-medium bg-[#FAF6EE] text-[#8E702D] px-2 py-0.5 rounded border border-[#D4AF37]/30">
                            <CheckCircle2 className="w-3 h-3 text-[#D4AF37]" />
                            CE Certified
                          </span>
                          <span className="inline-flex items-center gap-1 text-[10px] font-medium bg-[#FFF2F0] text-teal-800 px-2 py-0.5 rounded border border-teal-200">
                            ISO 13485
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Card Actions */}
                    <div className="p-5 pt-0 border-t border-stone-100 flex items-center justify-between gap-3 mt-2">
                      <Link
                        to={`${ROUTES.PUBLIC.CATALOG}?search=${encodeURIComponent(
                          productItem.name,
                        )}`}
                        className="text-xs font-medium text-stone-700 hover:text-teal-700 transition-colors"
                      >
                        Inspect Details
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleAddProductToQuote(productItem)}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-teal-600 hover:bg-teal-700 text-white transition-colors cursor-pointer shadow-sm"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add to RFQ</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Empty fallback if no products found */}
          {!isProductsLoading && liveProducts.length === 0 && (
            <div className="text-center py-12 bg-white rounded-2xl border border-stone-200">
              <Package className="w-12 h-12 text-stone-400 mx-auto mb-3" />
              <h4 className="font-semibold text-stone-800 text-base">
                Catalog Inventory Synchronizing
              </h4>
              <p className="text-xs text-stone-500 font-light max-w-md mx-auto mt-1 mb-4">
                Our medical equipment inventory is currently updating. You can still submit an institutional proforma quote request directly.
              </p>
              <Link to={ROUTES.PUBLIC.QUOTE_REQUEST}>
                <button
                  type="button"
                  className="bg-teal-600 text-white text-xs px-5 py-2.5 rounded-full font-medium cursor-pointer"
                >
                  Create Custom RFQ
                </button>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* SECTION 5: TESTIMONIALS CAROUSEL */}
      <section className="w-full lg:w-[80%] mx-auto py-16 md:py-24 overflow-x-hidden">
        <h2 className="text-center font-bold text-2xl text-teal-600 mb-2">
          Testimonials from Nigerian Healthcare Leaders
        </h2>
        <p className="text-center text-xs text-stone-600 font-light mb-12">
          Trusted by Chief Medical Directors, Heads of Surgery, and Hospital Procurement Administrators.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-12 items-center gap-10">
          {/* Circular Imagery Showcase */}
          <div className="lg:col-span-5 flex items-center justify-center">
            <div className="w-64 h-64 md:w-80 md:h-80 rounded-full border-4 border-teal-600 p-2 relative shadow-xl">
              <img
                src="https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=800&auto=format&fit=crop"
                alt="Nigerian Medical Professional"
                className="w-full h-full object-cover rounded-full"
              />
              <div className="absolute -bottom-3 -right-3 bg-[#FAF6EE] text-[#8E702D] border border-[#D4AF37] px-4 py-1.5 rounded-full text-xs font-semibold shadow-md">
                Verified Customer
              </div>
            </div>
          </div>

          {/* Testimonial Quote Card */}
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

              {/* Indicator Dots */}
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
    </div>
  );
};

export default HomePage;
