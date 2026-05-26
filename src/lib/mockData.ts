// ─────────────────────────────────────────────
//  Mock data for Iron Vault Security
// ─────────────────────────────────────────────

export const COMPANY = {
  name: "Iron Vault Security",
  tagline: "Fortified Storage for Gold, Gems & Legacy",
  phone: "+44 20 7946 0958",
  email: "IronVaultSecurity@protonmail.com",
  emailAlt: "ironvaultsecurity.co.uk",
  address: "45 Bankside Lane, London EC2V 7NQ, UK",
  mapEmbedUrl:
    "https://maps.google.com/maps?q=45+Bankside+Lane,+London+EC2V+7NQ,+UK&t=k&z=16&ie=UTF8&iwloc=&output=embed",
  social: {
    facebook: "#",
    twitter: "#",
    linkedin: "#",
  },
};

export interface ShipmentRecord {
  id: string;
  contents: string;
  origin: string;
  destination: string;
  status: "In Transit" | "Delivered" | "Processing" | "Pending";
  eta: string;
  progress: number;
}

export const MOCK_SHIPMENTS: ShipmentRecord[] = [
  {
    id: "IVS-78432",
    contents: "Gold Bullion (12 bars)",
    origin: "Zurich, CH",
    destination: "London Vault A",
    status: "In Transit",
    eta: "2025-06-05",
    progress: 65,
  },
  {
    id: "IVS-78419",
    contents: "Diamond Collection",
    origin: "Antwerp, BE",
    destination: "London Vault B",
    status: "Delivered",
    eta: "2025-05-28",
    progress: 100,
  },
  {
    id: "IVS-78401",
    contents: "Heirloom Jewellery Set",
    origin: "Geneva, CH",
    destination: "London Vault C",
    status: "Processing",
    eta: "2025-06-10",
    progress: 20,
  },
  {
    id: "IVS-78388",
    contents: "Platinum Coins (x50)",
    origin: "Frankfurt, DE",
    destination: "London Vault A",
    status: "In Transit",
    eta: "2025-06-08",
    progress: 42,
  },
  {
    id: "IVS-78350",
    contents: "Corporate Document Set",
    origin: "Dubai, UAE",
    destination: "London Vault D",
    status: "Delivered",
    eta: "2025-05-20",
    progress: 100,
  },
  {
    id: "IVS-78301",
    contents: "Rare Gemstone Collection",
    origin: "Cape Town, ZA",
    destination: "London Vault B",
    status: "Pending",
    eta: "2025-06-15",
    progress: 5,
  },
];

export interface AssetRecord {
  id: string;
  client: string;
  assetName: string;
  type: string;
  quantity: string;
  vault: string;
  status: "Stored" | "Awaiting Intake" | "In Review" | "Released";
  addedDate: string;
  value?: string;
}

export const MOCK_ASSETS: AssetRecord[] = [
  {
    id: "AST-001",
    client: "J. Harrington",
    assetName: "Gold Bars",
    type: "Precious Metal",
    quantity: "12 bars / 150kg",
    vault: "Vault A-04",
    status: "Stored",
    addedDate: "2025-01-15",
    value: "£4,200,000",
  },
  {
    id: "AST-002",
    client: "M. Thornton",
    assetName: "Diamond Collection",
    type: "Gemstones",
    quantity: "47 pieces",
    vault: "Vault B-11",
    status: "Stored",
    addedDate: "2025-02-03",
    value: "£2,800,000",
  },
  {
    id: "AST-003",
    client: "R. Marchetti",
    assetName: "Heirloom Jewellery",
    type: "Jewellery",
    quantity: "1 collection",
    vault: "Vault C-07",
    status: "Stored",
    addedDate: "2025-02-18",
    value: "£950,000",
  },
  {
    id: "AST-004",
    client: "E. Sundqvist",
    assetName: "Platinum Bullion",
    type: "Precious Metal",
    quantity: "50 coins",
    vault: "Vault A-09",
    status: "Awaiting Intake",
    addedDate: "2025-03-01",
    value: "£680,000",
  },
  {
    id: "AST-005",
    client: "L. Fontaine",
    assetName: "Vintage Watch Collection",
    type: "Watches",
    quantity: "8 pieces",
    vault: "Vault B-03",
    status: "Stored",
    addedDate: "2025-03-14",
    value: "£1,200,000",
  },
  {
    id: "AST-006",
    client: "K. Oduya",
    assetName: "Investment Gold",
    type: "Precious Metal",
    quantity: "3 bars / 37.5kg",
    vault: "Vault D-01",
    status: "In Review",
    addedDate: "2025-04-02",
    value: "£1,050,000",
  },
];

export const TESTIMONIALS = [
  {
    id: 1,
    quote:
      "Iron Vault Security gave me confidence that my investment gold was in the safest possible place. Highly professional and absolutely secure.",
    author: "J.H.",
    role: "Private Collector, Northern Europe",
    image: "/images/face1.jpg",
  },
  {
    id: 2,
    quote:
      "Discreet and efficient. I trust Iron Vault with our family's heirloom jewelry. Their London facility is exceptional.",
    author: "M.T.",
    role: "Family Office, Central Europe",
    image: "/images/Face2.jpg",
  },
  {
    id: 3,
    quote:
      "We transferred our company's diamond inventory from a bank to Iron Vault Security due to their superior security. Outstanding service.",
    author: "R.M.",
    role: "Corporate Client, United Kingdom",
    image: "/images/face3.jpg",
  },
  {
    id: 4,
    quote:
      "Iron Vault defines excellence in asset protection. Their London facility offers a level of discretion and security that is truly unmatched.",
    author: "E.S.",
    role: "Private Client, Western Europe",
    image: "/images/face4.jpg",
  },
];

export const STATS = [
  { label: "Assets Secured", value: 2500, suffix: "+" },
  { label: "Private Vaults in Operation", value: 1200, suffix: "+" },
  { label: "Tracked Deliveries", value: 300, suffix: "+" },
  { label: "Years of Excellence", value: 15, suffix: "+" },
];

export const SERVICES = [
  {
    id: "vaulting-facilities",
    title: "Vaulting Facilities",
    description:
      "State-of-the-art private vaults with biometric access control, 24/7 monitoring, and LBMA-compliant construction. Sizes from 1m² to 30m².",
    image: "/images/VaultFacilities.png",
    features: [
      "Biometric & 2FA access",
      "Climate-controlled environment",
      "Armed on-site response",
      "CCTV & motion detection",
    ],
  },
  {
    id: "diamond-jewellery",
    title: "Diamond & Jewellery",
    description:
      "Secure intake for diamonds, fine jewelry, watches, and heirloom sets with gemological verification and specialist insurance.",
    image: "/images/Diamond.png",
    features: [
      "Gemological verification",
      "Insurance documentation",
      "Climate-controlled display",
      "Private viewing rooms",
    ],
  },
  {
    id: "precious-metals",
    title: "Precious Metals",
    description:
      "Gold, silver, platinum, and bullion protection with full chain-of-custody documentation and weight verification.",
    image: "/images/Predious.png",
    features: [
      "Weight & purity verification",
      "Chain-of-custody logging",
      "Bullion storage capacity",
      "LBMA compliant",
    ],
  },
  {
    id: "secure-cargo",
    title: "Secure Cargo & Transit",
    description:
      "End-to-end tracked transport for high-value shipments across 30+ countries with full insurance coverage and real-time monitoring.",
    image: "/images/hero5.jpg",
    features: [
      "Live GPS tracking",
      "Armed escort options",
      "30+ country coverage",
      "Lloyd's backed insurance",
    ],
  },
  {
    id: "elite-protection",
    title: "Elite Asset Protection",
    description:
      "Concierge-grade security with RFID asset tracking, home and office coverage, panic alerts, and Lloyd's of London backed insurance.",
    image: "/images/hero2.jpg",
    features: [
      "RFID asset tracking",
      "Home/office coverage",
      "Panic alert system",
      "24/7 concierge team",
    ],
  },
];

export const STORAGE_TIERS = [
  {
    id: "1m2",
    size: "1m²",
    label: "Essential",
    description: "Watches, small jewelry sets, coin collections",
    price: "£350",
    period: "/month",
    features: [
      "Biometric access",
      "24/7 CCTV",
      "Basic insurance",
      "Monthly reporting",
    ],
    popular: false,
  },
  {
    id: "5m2",
    size: "5m²",
    label: "Standard",
    description: "Larger jewelry boxes, gold bars, luxury items",
    price: "£950",
    period: "/month",
    features: [
      "Biometric + 2FA access",
      "24/7 CCTV & motion",
      "Enhanced insurance",
      "Weekly reporting",
      "Private viewing access",
    ],
    popular: false,
  },
  {
    id: "10m2",
    size: "10m²",
    label: "Premium",
    description: "Multiple safe boxes, diversified asset holdings",
    price: "£1,800",
    period: "/month",
    features: [
      "Biometric + 2FA + guard",
      "Full CCTV suite",
      "Premium Lloyd's cover",
      "Daily reporting",
      "Priority access",
      "Transport service",
    ],
    popular: true,
  },
  {
    id: "20m2",
    size: "20m²",
    label: "Elite",
    description: "Institutional or family office holdings",
    price: "POA",
    period: "",
    features: [
      "Dedicated security team",
      "Custom access protocols",
      "Bespoke insurance",
      "Real-time asset tracking",
      "24/7 concierge service",
      "Global transport network",
      "Dedicated account manager",
    ],
    popular: false,
  },
];

export const TIMELINE = [
  {
    year: "2010",
    title: "Foundation",
    desc: "Iron Vault Security was established in London's financial district with a mission to provide discreet, institutional-grade asset protection.",
  },
  {
    year: "2014",
    title: "LBMA Accreditation",
    desc: "Achieved full compliance with London Bullion Market Association standards for vault construction and chain of custody.",
  },
  {
    year: "2018",
    title: "Global Expansion",
    desc: "Launched secure cargo and transport services, completing over 300 tracked deliveries across 30+ countries.",
  },
  {
    year: "2023",
    title: "Elite Tier Launch",
    desc: "Introduced concierge-grade Elite Asset Protection with RFID tracking, integrated security coverage, and Lloyd's backed insurance.",
  },
  {
    year: "2025",
    title: "Digital Transformation",
    desc: "Launched client portal with live asset tracking, biometric authentication, and real-time shipment monitoring.",
  },
];

export const TEAM = [
  {
    name: "Kenneth Johnson",
    role: "Chief Executive Officer",
    image: "/images/face1.jpg",
  },
  {
    name: "Benson Elio",
    role: "Chief Security Officer",
    image: "/images/Face2.jpg",
  },
  {
    name: "Bright Archie",
    role: "Head of Client Relations",
    image: "/images/face3.jpg",
  },
  {
    name: "Regina Sigrid",
    role: "Director of Operations",
    image: "/images/face4.jpg",
  },
];

export const GALLERY_IMAGES = [
  {
    src: "/images/hero5.jpg",
    alt: "Iron Vault Security Facility",
    caption: "London Vault Facility",
  },
  {
    src: "/images/hero2.jpg",
    alt: "Secure Interior",
    caption: "Secure Interior Vault",
  },
  {
    src: "/images/hero10.jpg",
    alt: "Access Control",
    caption: "Biometric Access Control",
  },
  {
    src: "/images/VaultFacilities.png",
    alt: "Vault Facilities",
    caption: "Private Vault Suites",
  },
  {
    src: "/images/Diamond.png",
    alt: "Diamond Storage",
    caption: "Diamond & Gemstone Storage",
  },
  {
    src: "/images/Predious.png",
    alt: "Precious Metals",
    caption: "Precious Metals Vault",
  },
];

// Mock users stored in memory (simulate a DB)
export const MOCK_USERS: Array<{
  id: string;
  email: string;
  password: string;
  name: string;
  tier: string;
  joinedDate: string;
}> = [
  {
    id: "usr-001",
    email: "demo@ironvaultsecurity.co.uk",
    password: "demo1234",
    name: "James Harrington",
    tier: "Premium",
    joinedDate: "2024-09-01",
  },
];
