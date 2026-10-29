// src/constants/clinical-taxonomy.ts
/**
 * Clinical Taxonomy, SKU Formula & Technical Specifications Blueprint
 * Modeled after HAS Medical Stapler (https://www.hasmedicalstapler.com/products.html)
 *
 * SKU Formula: ELP-[CATEGORY_CODE]-[DEVICE_CODE]-[MODEL_NUMBER]
 *   - END: Endoscopic & Powered Staplers
 *   - OPN: Open Linear & Circular Staplers
 *   - SPC: Anorectal & Urological Staplers
 *   - CLS: Wound & Fascial Closure Systems
 *   - LAP: Laparoscopic Access & Consumables
 */

export interface ClinicalCategoryPreset {
  name: string;
  slug: string;
  codePrefix: string;
  displayOrder: number;
  description: string;
  imageUrl: string;
  defaultSpecTemplate: Array<{ key: string; value: string }>;
}

export interface ClinicalSpecialtyPreset {
  name: string;
  slug: string;
  description: string;
}

export interface HasProductBlueprint {
  modelRef: string;
  name: string;
  slug: string;
  sku: string;
  categorySlug: string;
  categoryCode: string;
  specialtySlug: string;
  shortDescription: string;
  description: string;
  specifications: Record<string, string>;
  compliance: string[];
  leadTime: string;
  minOrderQuantity: number;
  isFeatured: boolean;
}

export const CLINICAL_CATEGORY_PRESETS: ClinicalCategoryPreset[] = [
  {
    name: "Endoscopic & Powered Staplers",
    slug: "endoscopic-powered-staplers",
    codePrefix: "END",
    displayOrder: 1,
    description:
      "Minimally invasive laparoscopic, thoracoscopic, and battery-powered articulating linear cutter staplers for precise tissue transection and resection. (Prefix: END)",
    imageUrl:
      "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=900&q=80",
    defaultSpecTemplate: [
      { key: "Model Reference", value: "HAS #p2 — Endoscopic Stapler Series" },
      { key: "Shaft Lengths", value: "60mm (Short), 160mm (Standard), 260mm (Long)" },
      { key: "Reload / Cartridge Sizes", value: "30mm, 45mm, 60mm" },
      {
        key: "Staple Heights (Color-Coded)",
        value: "2.0mm (White), 2.5mm (Blue), 3.5mm (Gold), 4.8mm (Green)",
      },
      { key: "Staple Rows", value: "6 Staggered Rows of Titanium Staples" },
      { key: "Articulation Angle", value: "±45° Left/Right Multi-Position; 360° Shaft Rotation" },
      { key: "Max Firing Cycles", value: "Up to 12 Reloads per Single Patient Procedure" },
      { key: "Material", value: "Medical-Grade Titanium (Ti) Staples & 316L Stainless Steel Anvil" },
      { key: "Sterilization", value: "Ethylene Oxide (EO) Sterile, Single-Use" },
    ],
  },
  {
    name: "Open Linear & Circular Staplers",
    slug: "open-linear-circular-staplers",
    codePrefix: "OPN",
    displayOrder: 2,
    description:
      "Disposable circular intraluminal staplers, open linear closure staplers, and open linear cutter staplers for gastrointestinal and thoracic anastomosis. (Prefix: OPN)",
    imageUrl:
      "https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&w=900&q=80",
    defaultSpecTemplate: [
      { key: "Model Reference", value: "HAS #p4 / #p6 / #p7 — Open Stapler Series" },
      { key: "Suture / Cut Lengths or Outer Diameter", value: "30mm, 45mm, 60mm, 90mm (or 21mm–34mm Circular OD)" },
      { key: "Staple Rows", value: "2 to 4 Staggered Rows of Titanium Staples" },
      { key: "Open Staple Heights", value: "3.5mm (Blue — Standard Tissue), 4.8mm (Green — Thick Tissue)" },
      { key: "Closed Staple Height", value: "1.5mm – 2.0mm Adjustable Tissue Compression" },
      { key: "Alignment Mechanism", value: "Parallel Guide Pin & Tactile/Audible Firing Feedback" },
      { key: "Material", value: "Medical-Grade Titanium Staples & 316L Stainless Steel" },
      { key: "Sterilization", value: "Ethylene Oxide (EO) Sterile, Single-Use" },
    ],
  },
  {
    name: "Anorectal & Urological Staplers",
    slug: "anorectal-urological-staplers",
    codePrefix: "SPC",
    displayOrder: 3,
    description:
      "Procedure-specific surgical staplers including PPH hemorrhoidal circular mucosal staplers and disposable male circumcision staplers. (Prefix: SPC)",
    imageUrl:
      "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=900&q=80",
    defaultSpecTemplate: [
      { key: "Model Reference", value: "HAS #p5 / #p14 — Specialty Stapler Series" },
      { key: "Outer / Bell Diameter", value: "32mm, 34mm (PPH) or 12mm–36mm (Circumcision)" },
      { key: "Staple Rows", value: "2 Staggered Concentric Rows / 12–28 Hemostatic Clips" },
      { key: "Staple Height", value: "3.8mm – 4.0mm Open; 0.75mm–1.5mm Adjustable Closed" },
      { key: "Included Accessories", value: "Circular Anal Dilator, Purse-String Suture Anoscope & Suture Threader" },
      { key: "Material", value: "Medical-Grade Titanium / 316L Stainless Steel & Silicone Gasket" },
      { key: "Sterilization", value: "Ethylene Oxide (EO) Sterile, Single-Use" },
    ],
  },
  {
    name: "Wound & Fascial Closure Systems",
    slug: "wound-fascial-closure-systems",
    codePrefix: "CLS",
    displayOrder: 4,
    description:
      "Disposable skin staplers with ergonomic staple extractors and laparoscopic trocar port-site fascial closure systems. (Prefix: CLS)",
    imageUrl:
      "https://images.unsplash.com/photo-1581595220892-b0739db3ba8c?auto=format&fit=crop&w=900&q=80",
    defaultSpecTemplate: [
      { key: "Model Reference", value: "HAS #p8 / #p17 — Closure System Series" },
      { key: "Staple Count / Port Compatibility", value: "35W (35 Wide Staples) or ≥10mm Trocar Port Closure" },
      { key: "Crown Width x Leg Length", value: "Regular (6.5mm x 4.0mm), Wide (7.0mm x 4.0mm)" },
      { key: "Wire Diameter / Suture Size", value: "0.58mm 316L Stainless Steel or USP 0 / 2-0 Braided Suture" },
      { key: "Included Accessories", value: "Dedicated Stainless Steel Staple Extractor / Silicone Guide Cone" },
      { key: "Material", value: "316L Medical-Grade Stainless Steel & Medical Polymer Handle" },
      { key: "Sterilization", value: "Ethylene Oxide (EO) Sterile, Single-Use" },
    ],
  },
  {
    name: "Laparoscopic Access & Consumables",
    slug: "laparoscopic-access-consumables",
    codePrefix: "LAP",
    displayOrder: 5,
    description:
      "Disposable laparoscopic trocars, incision dilators (wound protectors/retractors Type A & B), endo specimen retrieval bags, and suction irrigation sets. (Prefix: LAP)",
    imageUrl:
      "https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=900&q=80",
    defaultSpecTemplate: [
      { key: "Model Reference", value: "HAS #p10 / #p12 / #p13 / #p15 / #p16 — Laparoscopic Consumables" },
      { key: "Cannula / Ring Sizes", value: "5mm, 10mm, 12mm, 15mm (or 200mL–800mL Retrieval Bag)" },
      { key: "Working Length / Incision Range", value: "75mm, 100mm, 150mm (or 2.0cm–25.0cm Incision Range)" },
      { key: "Seal / Valve Mechanism", value: "Dual-Layer Universal氣密 Valve & 3-Way Stopcock" },
      { key: "Material", value: "Medical-Grade Polycarbonate (PC) / Thermoplastic Polyurethane (TPU)" },
      { key: "Sterilization", value: "Ethylene Oxide (EO) Sterile, Single-Use" },
    ],
  },
];

export const CLINICAL_SPECIALTY_PRESETS: ClinicalSpecialtyPreset[] = [
  {
    name: "General & Laparoscopic Surgery",
    slug: "general-laparoscopic-surgery",
    description:
      "Minimally invasive laparoscopic access, tissue transection, specimen retrieval, peritoneal irrigation, and port-site fascial closure.",
  },
  {
    name: "Gastrointestinal & Colorectal Surgery",
    slug: "gastrointestinal-colorectal-surgery",
    description:
      "Bastric, gastric, small bowel, colorectal resection, end-to-end circular anastomosis, and PPH hemorrhoidal mucopexy.",
  },
  {
    name: "Cardiothoracic & Vascular Surgery",
    slug: "cardiothoracic-vascular-surgery",
    description:
      "VATS lobectomy, pulmonary wedge resection, bronchial stump closure, and vascular tissue division.",
  },
  {
    name: "Urology",
    slug: "urology",
    description:
      "Automated circular male circumcision, nephrectomy access, and urological tissue reconstruction.",
  },
  {
    name: "Obstetrics & Gynaecology (OB/GYN)",
    slug: "obstetrics-gynaecology",
    description:
      "Cesarean incision retraction, laparoscopic hysterectomy, myomectomy, and skin closure.",
  },
];

export const HAS_PRODUCT_BLUEPRINTS: HasProductBlueprint[] = [
  {
    modelRef: "#p2",
    name: "Disposable Endo Cutter Stapler",
    slug: "disposable-endo-cutter-stapler",
    sku: "ELP-END-ECS-002",
    categorySlug: "endoscopic-powered-staplers",
    categoryCode: "END",
    specialtySlug: "general-laparoscopic-surgery",
    shortDescription:
      "Single-use articulating laparoscopic linear cutter stapler with 6 staggered titanium rows for tissue transection and anastomosis.",
    description:
      "Modeled on HAS Medical Stapler #p2. Designed for simultaneous tissue transection and six-row staggered titanium stapling in laparoscopic general, thoracic, gynecological, and pediatric surgery. Features a 360° rotating shaft, ±45° left/right multi-angle articulation, and a fresh knife blade integrated into every reload cartridge.",
    specifications: {
      "Model Reference": "HAS #p2 — Disposable Endo Cutter Stapler",
      "Shaft Lengths": "60mm (Short), 160mm (Standard), 260mm (Long)",
      "Reload Cartridge Sizes": "30mm, 45mm, 60mm",
      "Staple Rows": "6 Staggered Rows (3 per side of cut line)",
      "Staple Heights (Color-Coded)":
        "2.0mm (White - Vascular), 2.5mm (Blue - Thin), 3.5mm (Gold - Medium), 4.8mm (Green - Thick)",
      "Articulation Angle": "±45° Left/Right (5-position lock); 360° Shaft Rotation",
      "Knife Blade": "New 440C Stainless Steel Blade Integrated in Every Cartridge",
      "Max Firing Cycles": "Up to 12 Reloads per Single Patient Procedure",
      Material: "Medical-Grade Titanium (Ti) Staples & 316L Stainless Steel Anvil",
      Sterilization: "Ethylene Oxide (EO) Sterile, Single-Use",
    },
    compliance: ["ISO 13485", "CE Mark", "NAFDAC Approved"],
    leadTime: "In Stock — Dispatched within 24 hours",
    minOrderQuantity: 5,
    isFeatured: true,
  },
  {
    modelRef: "#p3",
    name: "Endoscopic Linear Cutter Stapler",
    slug: "endoscopic-linear-cutter-stapler",
    sku: "ELP-END-ELC-003",
    categorySlug: "endoscopic-powered-staplers",
    categoryCode: "END",
    specialtySlug: "gastrointestinal-colorectal-surgery",
    shortDescription:
      "Precision endoscopic linear cutter stapler with stepped cartridge face and universal reload compatibility for GI and thoracic resection.",
    description:
      "Modeled on HAS Medical Stapler #p3. Engineered with enhanced jaw compression (" +
      "I-beam blade design) that maintains uniform distal-to-proximal gap control during firing.",
    specifications: {
      "Model Reference": "HAS #p3 — Endoscopic Linear Cutter Stapler",
      "Shaft Lengths": "70mm, 160mm, 260mm",
      "Cartridge Lengths": "30mm, 45mm, 60mm",
      "Staple Rows": "6 Staggered Rows of Titanium Staples",
      "Closed Staple Heights": "0.75mm (White), 1.0mm (Blue), 1.5mm (Gold), 2.0mm (Green)",
      "Jaw Aperture & Rotation": "Wide Distal Jaw Opening with 360° Finger-Wheel Rotation",
      "Safety Mechanism": "Empty/Spent Cartridge Lockout Protection",
      Material: "Medical-Grade Titanium (Ti) Staples, 316L Stainless Steel Jaw",
      Sterilization: "Ethylene Oxide (EO) Sterile, Single-Use",
    },
    compliance: ["ISO 13485", "CE Mark", "NAFDAC Approved"],
    leadTime: "In Stock — Dispatched within 24 hours",
    minOrderQuantity: 5,
    isFeatured: true,
  },
  {
    modelRef: "#p11",
    name: "Powered Endoscopic Linear Stapler",
    slug: "powered-endoscopic-linear-stapler",
    sku: "ELP-END-PEL-011",
    categorySlug: "endoscopic-powered-staplers",
    categoryCode: "END",
    specialtySlug: "cardiothoracic-vascular-surgery",
    shortDescription:
      "Motorized battery-powered endoscopic linear cutter stapler reducing distal tip movement by >80% during critical vascular and thoracic firings.",
    description:
      "Modeled on HAS Medical Stapler #p11. Combines motorized one-button firing with 15-second pre-compression stabilization to eliminate hand fatigue and micro-tremor at the staple line.",
    specifications: {
      "Model Reference": "HAS #p11 — Powered Endoscopic Linear Stapler",
      "Drive Mechanism": "Integrated High-Torque Lithium DC Motor (One-Handed Firing)",
      "Shaft Lengths": "60mm, 160mm, 260mm",
      "Reload Sizes": "45mm, 60mm (Stepped / Tri-Staple Compatible)",
      "Staple Rows": "6 Staggered Titanium Rows",
      "Articulation": "±45° Smooth Articulation with 360° Shaft Rotation",
      "Safety Override": "Manual Bailout / Reverse Return Switch Included",
      Material: "Medical-Grade Titanium (Ti) Staples & Aerospace-Grade Polymer Housing",
      Sterilization: "Ethylene Oxide (EO) Sterile, Single-Use",
    },
    compliance: ["ISO 13485", "CE Mark", "IEC 60601-1", "NAFDAC Approved"],
    leadTime: "In Stock — Dispatched within 24 hours",
    minOrderQuantity: 2,
    isFeatured: true,
  },
  {
    modelRef: "#p9",
    name: "Powered Cutter Stapler",
    slug: "powered-cutter-stapler",
    sku: "ELP-END-PCS-009",
    categorySlug: "endoscopic-powered-staplers",
    categoryCode: "END",
    specialtySlug: "gastrointestinal-colorectal-surgery",
    shortDescription:
      "Intelligent motorized cutter stapler with automated tissue-thickness feedback and constant-velocity blade advancement.",
    description:
      "Modeled on HAS Medical Stapler #p9. Delivers consistent motor-driven firing speed through dense or edematous gastrointestinal and pulmonary parenchyma.",
    specifications: {
      "Model Reference": "HAS #p9 — Powered Cutter Stapler",
      "Power Source": "Built-In Medical Battery Pack (No External Cord Required)",
      "Shaft Lengths": "160mm (Standard), 260mm (Bariatric/Thoracic)",
      "Cartridge Sizes": "45mm, 60mm",
      "Staple Heights": "2.5mm (Blue), 3.5mm (Gold), 4.8mm (Green), 5.0mm (Black)",
      "Firing Indicator": "LED & Acoustic Completion Feedback",
      Material: "Medical-Grade Titanium Staples & 316L Stainless Steel",
      Sterilization: "Ethylene Oxide (EO) Sterile, Single-Use",
    },
    compliance: ["ISO 13485", "CE Mark", "NAFDAC Approved"],
    leadTime: "In Stock — Dispatched within 24 hours",
    minOrderQuantity: 2,
    isFeatured: false,
  },
  {
    modelRef: "#p4",
    name: "Disposable Circular Stapler",
    slug: "disposable-circular-stapler",
    sku: "ELP-OPN-DCS-004",
    categorySlug: "open-linear-circular-staplers",
    categoryCode: "OPN",
    specialtySlug: "gastrointestinal-colorectal-surgery",
    shortDescription:
      "Curved intraluminal circular stapler for end-to-end, end-to-side, and side-to-side esophageal, gastric, and colorectal anastomosis.",
    description:
      "Modeled on HAS Medical Stapler #p4. Creates a double-staggered circular array of titanium staples while simultaneously resecting excess inverted tissue with a cylindrical internal knife.",
    specifications: {
      "Model Reference": "HAS #p4 — Disposable Circular Stapler",
      "Outer Diameter (OD) Sizes": "21mm, 24mm, 26mm, 29mm, 32mm, 34mm",
      "Staple Rows": "2 Concentric Staggered Rows of Titanium Staples",
      "Number of Staples": "16 / 18 / 20 / 24 / 28 / 32 (Size Dependent)",
      "Open Staple Height": "4.5mm – 5.5mm",
      "Adjustable Closed Staple Height": "1.0mm – 2.5mm (Green Tissue-Compression Window)",
      "Shaft Curvature": "Anatomical Curved Shaft with Detachable Low-Profile Anvil",
      Material: "Medical-Grade Titanium Staples & 316L Stainless Steel",
      Sterilization: "Ethylene Oxide (EO) Sterile, Single-Use",
    },
    compliance: ["ISO 13485", "CE Mark", "NAFDAC Approved"],
    leadTime: "In Stock — Dispatched within 24 hours",
    minOrderQuantity: 5,
    isFeatured: true,
  },
  {
    modelRef: "#p6",
    name: "Disposable Linear Stapler",
    slug: "disposable-linear-stapler",
    sku: "ELP-OPN-DLS-006",
    categorySlug: "open-linear-circular-staplers",
    categoryCode: "OPN",
    specialtySlug: "gastrointestinal-colorectal-surgery",
    shortDescription:
      "Single-use open linear closure stapler placing a double-staggered row of titanium staples for bronchial, gastric, and bowel stump closure.",
    description:
      "Modeled on HAS Medical Stapler #p6. Designed for linear tissue approximation and visceral stump closure in open abdominal and thoracic procedures.",
    specifications: {
      "Model Reference": "HAS #p6 — Disposable Linear Stapler",
      "Suture Line Lengths": "30mm, 45mm, 60mm, 90mm",
      "Staple Rows": "2 Staggered Rows of Titanium Staples (Non-Cutting)",
      "Open Staple Heights": "3.5mm (Blue — Standard Tissue), 4.8mm (Green — Thick Tissue)",
      "Closed Staple Heights": "1.5mm (Blue), 2.0mm (Green)",
      "Alignment Pin": "Automatic or Manual Tissue Retaining Pin",
      Material: "Medical-Grade Titanium Staples & 316L Stainless Steel",
      Sterilization: "Ethylene Oxide (EO) Sterile, Single-Use",
    },
    compliance: ["ISO 13485", "CE Mark", "NAFDAC Approved"],
    leadTime: "In Stock — Dispatched within 24 hours",
    minOrderQuantity: 5,
    isFeatured: false,
  },
  {
    modelRef: "#p7",
    name: "Disposable Linear Cutter Stapler",
    slug: "disposable-linear-cutter-stapler",
    sku: "ELP-OPN-DLC-007",
    categorySlug: "open-linear-circular-staplers",
    categoryCode: "OPN",
    specialtySlug: "gastrointestinal-colorectal-surgery",
    shortDescription:
      "Open surgical linear cutter stapler delivering 4 staggered titanium staple rows with simultaneous central knife transection.",
    description:
      "Modeled on HAS Medical Stapler #p7. Places two double-staggered rows of titanium staples and divides tissue between them in open gastrointestinal, thoracic, and gynecological operations.",
    specifications: {
      "Model Reference": "HAS #p7 — Disposable Linear Cutter Stapler",
      "Cut / Staple Lengths": "55mm, 75mm, 100mm",
      "Staple Rows": "4 Staggered Rows (2 per side of incision)",
      "Open Staple Heights": "3.8mm (Blue — Regular), 4.5mm (Green — Thick)",
      "Closed Staple Heights": "1.5mm (Blue), 2.0mm (Green)",
      "Firing Lever": "Dual-Side Ergonomic Firing Knob (Left or Right Hand Operation)",
      Material: "Medical-Grade Titanium Staples & 316L Stainless Steel",
      Sterilization: "Ethylene Oxide (EO) Sterile, Single-Use",
    },
    compliance: ["ISO 13485", "CE Mark", "NAFDAC Approved"],
    leadTime: "In Stock — Dispatched within 24 hours",
    minOrderQuantity: 5,
    isFeatured: false,
  },
  {
    modelRef: "#p5",
    name: "Hemorrhoids Stapler (PPH)",
    slug: "hemorrhoids-stapler-pph",
    sku: "ELP-SPC-PPH-005",
    categorySlug: "anorectal-urological-staplers",
    categoryCode: "SPC",
    specialtySlug: "gastrointestinal-colorectal-surgery",
    shortDescription:
      "Complete disposable PPH circular hemorrhoidal stapler kit for prolapsed rectal mucosa excision and mucopexy.",
    description:
      "Modeled on HAS Medical Stapler #p5. Specifically engineered for Procedure for Prolapse and Hemorrhoids (PPH) and STARR procedures.",
    specifications: {
      "Model Reference": "HAS #p5 — Hemorrhoids Stapler (PPH)",
      "Outer Diameter Sizes": "32mm, 34mm",
      "Staple Rows": "2 Staggered Concentric Rows (32 or 34 Titanium Staples)",
      "Open Staple Height": "3.8mm – 4.0mm",
      "Adjustable Closed Height": "0.75mm – 1.5mm (High-Compression Hemostasis)",
      "Housing Capacity": "Extra-Deep Casing Volume for Prolapsed Mucosal Tissue",
      "Included Kit Components":
        "PPH Stapler, Circular Anal Dilator, Purse-String Suture Anoscope, Suture Threader",
      Material: "Medical-Grade Titanium Staples & Medical Polymer Kit",
      Sterilization: "Ethylene Oxide (EO) Sterile, Single-Use",
    },
    compliance: ["ISO 13485", "CE Mark", "NAFDAC Approved"],
    leadTime: "In Stock — Dispatched within 24 hours",
    minOrderQuantity: 5,
    isFeatured: true,
  },
  {
    modelRef: "#p14",
    name: "Circumcision Stapler",
    slug: "circumcision-stapler",
    sku: "ELP-SPC-CIR-014",
    categorySlug: "anorectal-urological-staplers",
    categoryCode: "SPC",
    specialtySlug: "urology",
    shortDescription:
      "Disposable circular anastomosis circumcision stapler for rapid 5-minute sutureless foreskin excision and automatic hemostatic clip closure.",
    description:
      "Modeled on HAS Medical Stapler #p14. Performs simultaneous foreskin excision and circular hemostatic stapling in a single squeeze.",
    specifications: {
      "Model Reference": "HAS #p14 — Disposable Circumcision Stapler",
      "Bell Diameter Sizes": "12mm, 15mm, 18mm, 21mm, 26mm, 30mm, 34mm, 36mm (Pediatric to Adult)",
      "Staple Count": "12 to 28 Hemostatic Staples (Size Dependent)",
      "Mechanism": "Simultaneous Annular Foreskin Excision & Circular Stapling",
      "Protective Cushion": "Integrated Silicone Healing Ring (Spontaneous Staple Detachment in 7–14 Days)",
      "Operative Duration": "3 – 5 Minutes Without Electrocautery or Manual Suturing",
      Material: "316L Medical-Grade Stainless Steel Staples & Medical Silicone Gasket",
      Sterilization: "Ethylene Oxide (EO) Sterile, Single-Use",
    },
    compliance: ["ISO 13485", "CE Mark", "NAFDAC Approved"],
    leadTime: "In Stock — Dispatched within 24 hours",
    minOrderQuantity: 10,
    isFeatured: true,
  },
  {
    modelRef: "#p8",
    name: "Skin Stapler and Remover",
    slug: "skin-stapler-and-remover",
    sku: "ELP-CLS-SSR-008",
    categorySlug: "wound-fascial-closure-systems",
    categoryCode: "CLS",
    specialtySlug: "general-laparoscopic-surgery",
    shortDescription:
      "Ergonomic disposable 35W skin stapler paired with a precision stainless-steel staple extractor for rapid epidermal wound closure.",
    description:
      "Modeled on HAS Medical Stapler #p8. Provides fast, non-jamming epidermal approximation at the conclusion of general, orthopedic, obstetric (C-section), and cardiothoracic procedures.",
    specifications: {
      "Model Reference": "HAS #p8 — Disposable Skin Stapler & Staple Remover",
      "Pre-Loaded Staple Count": "35 Staples (35W / 35R); Optional 25 or 55 Count",
      "Staple Crown Width x Leg Length": "Regular (6.5mm x 4.0mm), Wide (7.0mm x 4.0mm)",
      "Wire Diameter": "0.58mm Medical-Grade 316L Stainless Steel",
      "Viewing Window": "Remaining Staple Counter Indicator Window",
      "Included Accessory": "Dedicated Stainless Steel Scissor-Style Staple Extractor",
      Material: "316L Stainless Steel Staples & ABS Medical Polymer Handle",
      Sterilization: "Ethylene Oxide (EO) Sterile, Single-Use",
    },
    compliance: ["ISO 13485", "CE Mark", "NAFDAC Approved"],
    leadTime: "In Stock — Dispatched within 24 hours",
    minOrderQuantity: 20,
    isFeatured: false,
  },
  {
    modelRef: "#p17",
    name: "Endo Fascial Closure System",
    slug: "endo-fascial-closure-system",
    sku: "ELP-CLS-EFC-017",
    categorySlug: "wound-fascial-closure-systems",
    categoryCode: "CLS",
    specialtySlug: "general-laparoscopic-surgery",
    shortDescription:
      "Laparoscopic port-site fascial closure device for rapid, reproducible full-thickness closure of ≥10mm trocar defects to prevent trocar-site hernia.",
    description:
      "Modeled on HAS Medical Stapler #p17. Enables safe, standardized full-thickness closure of abdominal fascia and peritoneum at 10mm, 12mm, and 15mm laparoscopic trocar sites.",
    specifications: {
      "Model Reference": "HAS #p17 — Endo Fascial Closure System",
      "Target Port Size": "≥10mm Trocar Defects (10mm, 12mm, 15mm Port Sites)",
      "Working Shaft Length": "140mm – 165mm",
      "Suture Capture Mechanism": "Dual Diagonal Guide Channels with Self-Retaining Silicone Wings",
      "Compatible Suture": "USP 0 or 2-0 Absorbable Braided Suture",
      "Clinical Indication": "Prevention of Laparoscopic Trocar-Site Incisional Hernia",
      Material: "316L Surgical Stainless Steel Needle Passers & Medical Silicone Guide Cone",
      Sterilization: "Ethylene Oxide (EO) Sterile, Single-Use",
    },
    compliance: ["ISO 13485", "CE Mark", "NAFDAC Approved"],
    leadTime: "In Stock — Dispatched within 24 hours",
    minOrderQuantity: 10,
    isFeatured: false,
  },
  {
    modelRef: "#p10",
    name: "Disposable Trocar",
    slug: "disposable-trocar",
    sku: "ELP-LAP-TRC-010",
    categorySlug: "laparoscopic-access-consumables",
    categoryCode: "LAP",
    specialtySlug: "general-laparoscopic-surgery",
    shortDescription:
      "Bladeless optical and dilating-tip disposable laparoscopic trocars (5mm, 10mm, 12mm, 15mm) with universal dual-seal gas valve.",
    description:
      "Modeled on HAS Medical Stapler #p10. Establishes reliable pneumoperitoneum access in laparoscopic surgery with a bilateral tissue-separating bladeless tip.",
    specifications: {
      "Model Reference": "HAS #p10 — Disposable Laparoscopic Trocar",
      "Cannula Diameters": "5mm, 10mm, 12mm, 15mm",
      "Working Sleeve Lengths": "75mm (Short), 100mm (Standard), 150mm (Bariatric)",
      "Obturator Tip Styles": "Bladeless Optical Tip, Conical Dilating Tip, Shielded Pyramidal Blade",
      "Seal System": "Detachable Dual-Layer Duckbill + Universal Seal (5mm–12mm Reducer-Free)",
      "Cannula Exterior": "Anti-Slip Annular Stability Ridges with 3-Way CO2 Luer-Lock Stopcock",
      Material: "Medical-Grade Polycarbonate (PC) & Medical Silicone Valve",
      Sterilization: "Ethylene Oxide (EO) Sterile, Single-Use",
    },
    compliance: ["ISO 13485", "CE Mark", "NAFDAC Approved"],
    leadTime: "In Stock — Dispatched within 24 hours",
    minOrderQuantity: 10,
    isFeatured: true,
  },
  {
    modelRef: "#p12",
    name: "Incision Dilator A",
    slug: "incision-dilator-a",
    sku: "ELP-LAP-IDA-012",
    categorySlug: "laparoscopic-access-consumables",
    categoryCode: "LAP",
    specialtySlug: "obstetrics-gynaecology",
    shortDescription:
      "Fixed-height dual-ring circumferential wound protector and 360° atraumatic incision retractor (Type A).",
    description:
      "Modeled on HAS Medical Stapler #p12. Provides 360° radial wound retraction and complete circumferential barrier protection against surgical site infection (SSI) and tumor seeding.",
    specifications: {
      "Model Reference": "HAS #p12 — Incision Dilator A (Fixed-Ring Wound Protector)",
      "Ring Diameters": "50/40mm, 70/60mm, 90/80mm, 120/110mm, 170/150mm, 220/200mm",
      "Applicable Incision Length": "2.0cm – 20.0cm",
      "Sleeve Configuration": "Fixed-Height Elastic Dual-Ring (Inner Insertion Ring + Outer Retention Ring)",
      "Clinical Function": "360° Atraumatic Retraction & Incision Margin Moisture/Infection Barrier",
      Material: "Medical-Grade Thermoplastic Polyurethane (TPU) Film",
      Sterilization: "Ethylene Oxide (EO) Sterile, Single-Use",
    },
    compliance: ["ISO 13485", "CE Mark", "NAFDAC Approved"],
    leadTime: "In Stock — Dispatched within 24 hours",
    minOrderQuantity: 10,
    isFeatured: false,
  },
  {
    modelRef: "#p13",
    name: "Incision Dilator B",
    slug: "incision-dilator-b",
    sku: "ELP-LAP-IDB-013",
    categorySlug: "laparoscopic-access-consumables",
    categoryCode: "LAP",
    specialtySlug: "general-laparoscopic-surgery",
    shortDescription:
      "Roll-down adjustable-height wound protector and incision retractor (Type B) for variable abdominal wall thicknesses.",
    description:
      "Modeled on HAS Medical Stapler #p13. Features a roll-down flip-ring upper collar that allows surgeons to tension and lock the polyurethane sleeve to the exact abdominal wall depth.",
    specifications: {
      "Model Reference": "HAS #p13 — Incision Dilator B (Adjustable Roll-Down Wound Retractor)",
      "Ring Diameters": "60/50mm, 80/70mm, 100/90mm, 150/130mm, 200/180mm, 260/240mm",
      "Applicable Incision Length": "2.5cm – 25.0cm",
      "Height Adjustment": "360° Roll-Down Tensioning Ring for Variable Abdominal Wall Thickness",
      "Clinical Applications": "Laparotomy, Cesarean Section, VATS Utility Incision, Bariatric Surgery",
      Material: "High-Tensile Medical Thermoplastic Polyurethane (TPU)",
      Sterilization: "Ethylene Oxide (EO) Sterile, Single-Use",
    },
    compliance: ["ISO 13485", "CE Mark", "NAFDAC Approved"],
    leadTime: "In Stock — Dispatched within 24 hours",
    minOrderQuantity: 10,
    isFeatured: false,
  },
  {
    modelRef: "#p15",
    name: "Laparoscopic Endo Bag",
    slug: "laparoscopic-endo-bag",
    sku: "ELP-LAP-EBG-015",
    categorySlug: "laparoscopic-access-consumables",
    categoryCode: "LAP",
    specialtySlug: "general-laparoscopic-surgery",
    shortDescription:
      "Self-opening memory-wire laparoscopic specimen retrieval bag with leak-proof TPU pouch for safe tissue extraction.",
    description:
      "Modeled on HAS Medical Stapler #p15. Deployed through a 10mm or 12mm laparoscopic trocar to encapsulate and extract resected specimens without port-site spillage.",
    specifications: {
      "Model Reference": "HAS #p15 — Disposable Laparoscopic Endo Bag",
      "Bag Volume Capacities": "100mL (Small), 200mL (Medium), 400mL (Large), 800mL (Extra-Large)",
      "Pouch Dimensions": "60x140mm, 80x180mm, 100x230mm, 130x280mm",
      "Minimum Trocar Size": "10mm / 12mm Introducer Tube",
      "Opening Mechanism": "Self-Expanding Nickel-Titanium (Nitinol) Memory Wire Ring",
      "Closure System": "Pre-Tied High-Tensile Drawstring Cinch",
      Material: "Tear-Resistant & Fluid-Impermeable Medical TPU Film",
      Sterilization: "Ethylene Oxide (EO) Sterile, Single-Use",
    },
    compliance: ["ISO 13485", "CE Mark", "NAFDAC Approved"],
    leadTime: "In Stock — Dispatched within 24 hours",
    minOrderQuantity: 20,
    isFeatured: false,
  },
  {
    modelRef: "#p16",
    name: "Suction Irrigation",
    slug: "suction-irrigation",
    sku: "ELP-LAP-SIR-016",
    categorySlug: "laparoscopic-access-consumables",
    categoryCode: "LAP",
    specialtySlug: "general-laparoscopic-surgery",
    shortDescription:
      "Disposable laparoscopic suction-irrigation trumpet valve handpiece with atraumatic 5mm/10mm probe and dual spike tubing.",
    description:
      "Modeled on HAS Medical Stapler #p16. Provides responsive one-handed control of high-flow peritoneal lavage and smoke/fluid evacuation during laparoscopic procedures.",
    specifications: {
      "Model Reference": "HAS #p16 — Disposable Laparoscopic Suction Irrigation Set",
      "Probe Diameters & Lengths": "5mm x 330mm (Standard), 5mm x 450mm (Bariatric), 10mm x 330mm",
      "Valve Control": "Color-Coded Ergonomic Trumpet Piston Valves (Blue Irrigation / White Suction)",
      "Distal Tip Design": "Blunt Atraumatic Tip with 8 Lateral Anti-Clog Fenestrations",
      "Tubing Set": "2.5m Dual-Channel DEHP-Free PVC Tubing with Dual IV Bag Spikes",
      Material: "304/316L Stainless Steel Probe & Medical-Grade PC/PVC",
      Sterilization: "Ethylene Oxide (EO) Sterile, Single-Use",
    },
    compliance: ["ISO 13485", "CE Mark", "NAFDAC Approved"],
    leadTime: "In Stock — Dispatched within 24 hours",
    minOrderQuantity: 20,
    isFeatured: false,
  },
];

export function slugifyText(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-");
}

export function deriveCategoryCodePrefix(
  name: string,
  slug?: string,
  description?: string,
): string {
  const existingMatch = (description || "").match(/Prefix:\s*([A-Z0-9]{3})/i);
  if (existingMatch) {
    return existingMatch[1].toUpperCase();
  }

  const normalizedSlug = slug || slugifyText(name);
  const preset = CLINICAL_CATEGORY_PRESETS.find((c) => c.slug === normalizedSlug);
  if (preset) {
    return preset.codePrefix;
  }

  const stopWords = new Set(["AND", "THE", "FOR", "WITH", "OF", "IN"]);
  const words = (name || "")
    .replace(/[^a-zA-Z\s]/g, "")
    .trim()
    .split(/\s+/)
    .filter((w) => w.length > 0 && !stopWords.has(w.toUpperCase()));

  if (words.length >= 3) {
    return `${words[0][0]}${words[1][0]}${words[2][0]}`.toUpperCase();
  }
  if (words.length === 2) {
    return `${words[0].slice(0, 2)}${words[1][0]}`.toUpperCase();
  }
  return (name || "SRG")
    .replace(/[^a-zA-Z]/g, "")
    .slice(0, 3)
    .toUpperCase()
    .padEnd(3, "X");
}

export function deriveDeviceCode(productName: string): string {
  const matchedBlueprint = HAS_PRODUCT_BLUEPRINTS.find(
    (b) => b.name.toLowerCase() === productName.trim().toLowerCase(),
  );
  if (matchedBlueprint) {
    const parts = matchedBlueprint.sku.split("-");
    if (parts[2]) return parts[2];
  }

  const stopWords = new Set(["AND", "THE", "FOR", "WITH", "SYSTEM", "DISPOSABLE"]);
  const words = (productName || "")
    .replace(/[^a-zA-Z0-9\s]/g, "")
    .toUpperCase()
    .split(/\s+/)
    .filter((w) => w.length > 0 && !stopWords.has(w));

  if (words.length >= 3) {
    return `${words[0][0]}${words[1][0]}${words[2][0]}`;
  }
  if (words.length === 2) {
    return `${words[0].slice(0, 2)}${words[1][0]}`.padEnd(3, "X");
  }
  if (words.length === 1) {
    return words[0].slice(0, 3).padEnd(3, "X");
  }
  return "DEV";
}

export function generateClinicalSku(
  categoryCode: string,
  productName: string,
  modelSequence: number | string = 1,
): string {
  const matchedBlueprint = HAS_PRODUCT_BLUEPRINTS.find(
    (b) => b.name.toLowerCase() === productName.trim().toLowerCase(),
  );
  if (matchedBlueprint) {
    return matchedBlueprint.sku;
  }

  const cat = (categoryCode || "END").toUpperCase().slice(0, 3).padEnd(3, "X");
  const dev = deriveDeviceCode(productName);
  const seqStr = String(modelSequence).replace(/\D/g, "");
  const paddedModel = (seqStr || "001").padStart(3, "0").slice(-3);

  return `ELP-${cat}-${dev}-${paddedModel}`;
}

export function getDefaultSpecsForCategorySlug(
  categorySlug?: string,
  productName?: string,
): Array<{ key: string; value: string }> {
  if (productName) {
    const matchedBlueprint = HAS_PRODUCT_BLUEPRINTS.find(
      (b) => b.name.toLowerCase() === productName.trim().toLowerCase(),
    );
    if (matchedBlueprint) {
      return Object.entries(matchedBlueprint.specifications).map(([key, value]) => ({
        key,
        value,
      }));
    }
  }

  const categoryPreset = CLINICAL_CATEGORY_PRESETS.find((c) => c.slug === categorySlug);
  if (categoryPreset) {
    return categoryPreset.defaultSpecTemplate.map((row) => ({ ...row }));
  }

  return [
    { key: "Model Reference", value: "HAS Series — Surgical Instrument" },
    { key: "Sizes / Dimensions", value: "30mm, 45mm, 60mm" },
    { key: "Staple Rows / Mechanism", value: "Staggered Titanium Staple Array" },
    { key: "Material", value: "Medical-Grade Titanium (Ti) & 316L Stainless Steel" },
    { key: "Sterilization", value: "Ethylene Oxide (EO) Sterile, Single-Use" },
  ];
}

