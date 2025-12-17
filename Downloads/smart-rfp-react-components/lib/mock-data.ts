// Types
export interface Requirement {
  productType: string
  quantity: number
  specifications: string
  requiredTests: string[]
}

export interface SKURecommendation {
  sku: string
  matchPercentage: number
  rfpSpec: string
  skuSpec: string
  unitPrice: number
}

export interface ProductMatch {
  productType: string
  recommendations: SKURecommendation[]
}

export interface PricingItem {
  name: string
  quantity: number
  unitPrice: number
  total: number
}

export interface Pricing {
  materials: PricingItem[]
  materialsTotal: number
  tests: PricingItem[]
  testsTotal: number
  totalCost: number
}

export interface RFP {
  name: string
  client: string
  date: string
  status: "completed" | "pending" | "draft"
  processingTime: number
  requirements: Requirement[]
  productMatches: ProductMatch[]
  pricing: Pricing
}

export interface Notification {
  id: string
  title: string
  message: string
  timestamp: string
  read: boolean
  type: "info" | "success" | "warning"
}

export interface Rfp {
  id: string
  client: string
  source: string
  dueDate: string
  status: "Not Actioned" | "In Progress" | "Submitted"
  priority: "High" | "Medium" | "Low"
  daysRemaining: string
  items: RfpItem[]
}

export interface RfpItem {
  id: string
  description: string
  quantity: string
  tests: string[]
}

export interface SkuMatch {
  rfpItem: string
  sku: string
  specMatch: number
  keyDifferences: string
}

export interface PricingRow {
  sku: string
  description: string
  quantity: number
  unitPrice: number
  testCost: number
  lineTotal: number
}

export interface AtRiskRfp {
  id: string
  client: string
  dueDate: string
  stage: string
  riskReason: string
  priority: "High" | "Medium" | "Low"
}

export interface ActivityItem {
  id: string
  message: string
  time: string
}

export interface Product {
  sku: string
  name: string
  voltage: string
  conductor: string
  area: string
  insulation: string
  armouring: boolean
  basePrice: number
}

export interface RecentRfp {
  id: string
  client: string
  receivedDate: string
  source: string
  status: "Not Actioned" | "In Progress" | "Qualified" | "Technical Review" | "Pricing" | "Priced"
  priority: "High" | "Medium" | "Low"
  estimatedValue: string
  dueDate: string
}

// Mock Data
export const mockRFPs: RFP[] = [
  {
    name: "Q1 Industrial Components RFP",
    client: "Acme Manufacturing",
    date: "2025-01-10",
    status: "completed",
    processingTime: 2.3,
    requirements: [
      {
        productType: "Steel Fasteners",
        quantity: 50000,
        specifications: "Grade 8, M10 x 40mm, Zinc Plated",
        requiredTests: ["Tensile Test", "Torque Test", "Salt Spray"],
      },
      {
        productType: "Industrial Bearings",
        quantity: 1000,
        specifications: "6205-2RS, ABEC-3, Sealed",
        requiredTests: ["Load Test", "Vibration Analysis"],
      },
      {
        productType: "Hydraulic Hoses",
        quantity: 500,
        specifications: '1/2" ID, 3000 PSI, -40°C to 100°C',
        requiredTests: ["Pressure Test", "Burst Test", "Temperature Cycling"],
      },
    ],
    productMatches: [
      {
        productType: "Steel Fasteners",
        recommendations: [
          {
            sku: "SF-M10-40-G8-ZP",
            matchPercentage: 98,
            rfpSpec: "Grade 8, M10 x 40mm",
            skuSpec: "Grade 8.8, M10 x 40mm",
            unitPrice: 0.42,
          },
          {
            sku: "SF-M10-40-G8-HDG",
            matchPercentage: 95,
            rfpSpec: "Zinc Plated",
            skuSpec: "Hot-Dip Galvanized",
            unitPrice: 0.48,
          },
          {
            sku: "SF-M10-40-G5-ZP",
            matchPercentage: 85,
            rfpSpec: "Grade 8",
            skuSpec: "Grade 5",
            unitPrice: 0.35,
          },
        ],
      },
      {
        productType: "Industrial Bearings",
        recommendations: [
          {
            sku: "BR-6205-2RS-A3",
            matchPercentage: 100,
            rfpSpec: "6205-2RS, ABEC-3",
            skuSpec: "6205-2RS, ABEC-3",
            unitPrice: 12.5,
          },
          {
            sku: "BR-6205-2RS-A5",
            matchPercentage: 92,
            rfpSpec: "ABEC-3",
            skuSpec: "ABEC-5 (Higher precision)",
            unitPrice: 18.75,
          },
          {
            sku: "BR-6205-ZZ-A3",
            matchPercentage: 88,
            rfpSpec: "2RS (Sealed)",
            skuSpec: "ZZ (Shielded)",
            unitPrice: 10.2,
          },
        ],
      },
      {
        productType: "Hydraulic Hoses",
        recommendations: [
          {
            sku: "HH-12-3K-R1AT",
            matchPercentage: 96,
            rfpSpec: '1/2", 3000 PSI',
            skuSpec: '1/2", 3045 PSI (R1AT)',
            unitPrice: 8.9,
          },
          {
            sku: "HH-12-4K-R2AT",
            matchPercentage: 93,
            rfpSpec: "3000 PSI",
            skuSpec: "4350 PSI (R2AT)",
            unitPrice: 11.2,
          },
          {
            sku: "HH-12-3K-SAE100",
            matchPercentage: 90,
            rfpSpec: "-40°C to 100°C",
            skuSpec: "-40°C to 93°C",
            unitPrice: 7.5,
          },
        ],
      },
    ],
    pricing: {
      materials: [
        {
          name: "Steel Fasteners (SF-M10-40-G8-ZP)",
          quantity: 50000,
          unitPrice: 0.42,
          total: 21000,
        },
        {
          name: "Industrial Bearings (BR-6205-2RS-A3)",
          quantity: 1000,
          unitPrice: 12.5,
          total: 12500,
        },
        {
          name: "Hydraulic Hoses (HH-12-3K-R1AT)",
          quantity: 500,
          unitPrice: 8.9,
          total: 4450,
        },
      ],
      materialsTotal: 37950,
      tests: [
        { name: "Tensile Testing", quantity: 15, unitPrice: 125, total: 1875 },
        { name: "Torque Testing", quantity: 15, unitPrice: 95, total: 1425 },
        { name: "Salt Spray Testing", quantity: 10, unitPrice: 200, total: 2000 },
        { name: "Load Testing", quantity: 8, unitPrice: 175, total: 1400 },
        { name: "Vibration Analysis", quantity: 8, unitPrice: 250, total: 2000 },
        { name: "Pressure Testing", quantity: 12, unitPrice: 150, total: 1800 },
        { name: "Burst Testing", quantity: 5, unitPrice: 300, total: 1500 },
      ],
      testsTotal: 12000,
      totalCost: 49950,
    },
  },
  {
    name: "Healthcare Equipment RFP",
    client: "MedTech Solutions",
    date: "2025-01-08",
    status: "completed",
    processingTime: 1.8,
    requirements: [
      {
        productType: "Medical Grade Tubing",
        quantity: 20000,
        specifications: "Silicone, 8mm OD, USP Class VI",
        requiredTests: ["Biocompatibility", "Tensile Strength"],
      },
      {
        productType: "Surgical Instruments",
        quantity: 500,
        specifications: "Stainless Steel 316L, Autoclavable",
        requiredTests: ["Sterilization Validation", "Corrosion Test"],
      },
    ],
    productMatches: [
      {
        productType: "Medical Grade Tubing",
        recommendations: [
          {
            sku: "MT-SI-8-USP6",
            matchPercentage: 100,
            rfpSpec: "Silicone, 8mm, USP VI",
            skuSpec: "Silicone, 8mm, USP VI",
            unitPrice: 2.15,
          },
          {
            sku: "MT-SI-8-PLAT",
            matchPercentage: 95,
            rfpSpec: "USP Class VI",
            skuSpec: "Platinum-cured (exceeds USP VI)",
            unitPrice: 2.85,
          },
          {
            sku: "MT-TPE-8-USP6",
            matchPercentage: 88,
            rfpSpec: "Silicone",
            skuSpec: "TPE (alternative)",
            unitPrice: 1.75,
          },
        ],
      },
    ],
    pricing: {
      materials: [
        {
          name: "Medical Grade Tubing (MT-SI-8-USP6)",
          quantity: 20000,
          unitPrice: 2.15,
          total: 43000,
        },
      ],
      materialsTotal: 43000,
      tests: [
        { name: "Biocompatibility Testing", quantity: 3, unitPrice: 3500, total: 10500 },
        { name: "Tensile Strength Testing", quantity: 10, unitPrice: 150, total: 1500 },
      ],
      testsTotal: 12000,
      totalCost: 55000,
    },
  },
  {
    name: "Automotive Parts Tender",
    client: "AutoCorp Industries",
    date: "2025-01-05",
    status: "completed",
    processingTime: 2.1,
    requirements: [
      {
        productType: "Brake Pads",
        quantity: 10000,
        specifications: "Ceramic, Low Dust, -40°C to 650°C",
        requiredTests: ["Friction Test", "Wear Test", "Temperature Cycling"],
      },
    ],
    productMatches: [
      {
        productType: "Brake Pads",
        recommendations: [
          {
            sku: "BP-CER-LD-650",
            matchPercentage: 98,
            rfpSpec: "Ceramic, Low Dust, 650°C",
            skuSpec: "Ceramic, Ultra-Low Dust, 680°C",
            unitPrice: 15.5,
          },
          {
            sku: "BP-CER-STD-650",
            matchPercentage: 92,
            rfpSpec: "Low Dust",
            skuSpec: "Standard Dust",
            unitPrice: 12.8,
          },
          {
            sku: "BP-SEM-LD-550",
            matchPercentage: 82,
            rfpSpec: "Ceramic, 650°C",
            skuSpec: "Semi-Metallic, 550°C",
            unitPrice: 9.5,
          },
        ],
      },
    ],
    pricing: {
      materials: [
        {
          name: "Brake Pads (BP-CER-LD-650)",
          quantity: 10000,
          unitPrice: 15.5,
          total: 155000,
        },
      ],
      materialsTotal: 155000,
      tests: [
        { name: "Friction Testing", quantity: 20, unitPrice: 275, total: 5500 },
        { name: "Wear Testing", quantity: 15, unitPrice: 350, total: 5250 },
        { name: "Temperature Cycling", quantity: 10, unitPrice: 425, total: 4250 },
      ],
      testsTotal: 15000,
      totalCost: 170000,
    },
  },
  {
    name: "Electronics Component Bid",
    client: "TechFlow Systems",
    date: "2024-12-28",
    status: "completed",
    processingTime: 1.5,
    requirements: [
      {
        productType: "PCB Connectors",
        quantity: 50000,
        specifications: "20-pin, 2.54mm pitch, Gold-plated",
        requiredTests: ["Insertion Force", "Contact Resistance"],
      },
    ],
    productMatches: [
      {
        productType: "PCB Connectors",
        recommendations: [
          {
            sku: "PC-20P-254-AU",
            matchPercentage: 100,
            rfpSpec: "20-pin, 2.54mm, Gold",
            skuSpec: '20-pin, 2.54mm, Gold 30µ"',
            unitPrice: 0.85,
          },
          {
            sku: "PC-20P-254-AG",
            matchPercentage: 90,
            rfpSpec: "Gold-plated",
            skuSpec: "Silver-plated",
            unitPrice: 0.65,
          },
          {
            sku: "PC-20P-200-AU",
            matchPercentage: 85,
            rfpSpec: "2.54mm pitch",
            skuSpec: "2.00mm pitch",
            unitPrice: 0.92,
          },
        ],
      },
    ],
    pricing: {
      materials: [
        {
          name: "PCB Connectors (PC-20P-254-AU)",
          quantity: 50000,
          unitPrice: 0.85,
          total: 42500,
        },
      ],
      materialsTotal: 42500,
      tests: [
        { name: "Insertion Force Testing", quantity: 15, unitPrice: 120, total: 1800 },
        { name: "Contact Resistance Testing", quantity: 15, unitPrice: 95, total: 1425 },
      ],
      testsTotal: 3225,
      totalCost: 45725,
    },
  },
  {
    name: "Construction Materials RFP",
    client: "BuildRight Construction",
    date: "2024-12-20",
    status: "completed",
    processingTime: 2.7,
    requirements: [
      {
        productType: "Structural Steel Beams",
        quantity: 200,
        specifications: "W12x26, ASTM A992, Grade 50",
        requiredTests: ["Tensile Test", "Charpy Impact", "Chemical Analysis"],
      },
    ],
    productMatches: [
      {
        productType: "Structural Steel Beams",
        recommendations: [
          {
            sku: "SSB-W12-26-A992",
            matchPercentage: 100,
            rfpSpec: "W12x26, A992, Gr50",
            skuSpec: "W12x26, A992, Grade 50",
            unitPrice: 425,
          },
          {
            sku: "SSB-W12-30-A992",
            matchPercentage: 92,
            rfpSpec: "W12x26",
            skuSpec: "W12x30 (heavier)",
            unitPrice: 485,
          },
          {
            sku: "SSB-W10-26-A992",
            matchPercentage: 88,
            rfpSpec: "W12",
            skuSpec: "W10 (different depth)",
            unitPrice: 405,
          },
        ],
      },
    ],
    pricing: {
      materials: [
        {
          name: "Structural Steel Beams (SSB-W12-26-A992)",
          quantity: 200,
          unitPrice: 425,
          total: 85000,
        },
      ],
      materialsTotal: 85000,
      tests: [
        { name: "Tensile Testing", quantity: 6, unitPrice: 225, total: 1350 },
        { name: "Charpy Impact Testing", quantity: 6, unitPrice: 185, total: 1110 },
        { name: "Chemical Analysis", quantity: 3, unitPrice: 450, total: 1350 },
      ],
      testsTotal: 3810,
      totalCost: 88810,
    },
  },
]

export const notifications: Notification[] = [
  {
    id: "notif-1",
    title: "New RFP Uploaded",
    message: "RFP-2025-007 from NTPC Power uploaded successfully – Sales Agent will begin qualification",
    timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30 mins ago
    read: false,
    type: "success",
  },
  {
    id: "notif-2",
    title: "RFP Due in 2 Days",
    message: "RFP-2025-001 for BPCL Refinery is due on Jan 18 – currently in pricing stage",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    read: false,
    type: "warning",
  },
  {
    id: "notif-3",
    title: "Low Spec Match Alert",
    message: "Technical Agent found 68% spec match for Metro Rail RFP Item #3 – manual review recommended",
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), // 4 hours ago
    read: false,
    type: "warning",
  },
  {
    id: "notif-4",
    title: "Proposal Generated",
    message: "Pricing Agent completed proposal for RFP-2025-003 – total value ₹12.4L, ready for review",
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), // 6 hours ago
    read: false,
    type: "success",
  },
  {
    id: "notif-5",
    title: "Master Agent Update",
    message: "3 RFPs with due dates <3 days prioritized to High – check workspace for details",
    timestamp: new Date(Date.now() - 20 * 60 * 60 * 1000).toISOString(), // 20 hours ago
    read: true,
    type: "info",
  },
  {
    id: "notif-6",
    title: "New RFP from GeM Portal",
    message: "State Transmission Corporation tender identified – due in 15 days, estimated ₹8.5L",
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    read: true,
    type: "info",
  },
  {
    id: "notif-7",
    title: "SKU Matches Regenerated",
    message: "Technical Agent updated recommendations for RFP-2025-002 with 3 new catalog entries",
    timestamp: new Date(Date.now() - 36 * 60 * 60 * 1000).toISOString(), // 1.5 days ago
    read: true,
    type: "success",
  },
]

export const rfpList: Rfp[] = [
  {
    id: "RFP-2025-001",
    client: "NTPC Power",
    source: "Email",
    dueDate: "Jan 20, 2025",
    status: "In Progress",
    priority: "High",
    daysRemaining: "2 days",
    items: [
      {
        id: "ITEM-1",
        description: "4 Core LT Power Cable 50 sq.mm Aluminium 1.1kV XLPE",
        quantity: "2000 m",
        tests: ["High Voltage", "Insulation Resistance", "Voltage Drop"],
      },
      {
        id: "ITEM-2",
        description: "3.5 Core LT Power Cable 120 sq.mm Aluminium 1.1kV XLPE",
        quantity: "1200 m",
        tests: ["High Voltage", "Insulation Resistance"],
      },
      {
        id: "ITEM-3",
        description: "12 Core Control Cable 2.5 sq.mm Copper 1.1kV PVC",
        quantity: "1000 m",
        tests: ["Conductor Resistance"],
      },
    ],
  },
  {
    id: "RFP-2025-002",
    client: "Metro Rail Corporation",
    source: "Website",
    dueDate: "Jan 25, 2025",
    status: "Not Actioned",
    priority: "Medium",
    daysRemaining: "7 days",
    items: [],
  },
  {
    id: "RFP-2025-003",
    client: "State Transmission",
    source: "Portal",
    dueDate: "Jan 19, 2025",
    status: "In Progress",
    priority: "High",
    daysRemaining: "1 day",
    items: [],
  },
  {
    id: "RFP-2025-004",
    client: "Industrial Park Authority",
    source: "Email",
    dueDate: "Feb 05, 2025",
    status: "Not Actioned",
    priority: "Low",
    daysRemaining: "18 days",
    items: [],
  },
  {
    id: "RFP-2025-005",
    client: "Smart City Project",
    source: "Website",
    dueDate: "Jan 15, 2025",
    status: "Submitted",
    priority: "Medium",
    daysRemaining: "Overdue",
    items: [],
  },
]

export const skuRecommendations: SkuMatch[] = [
  {
    rfpItem: "ITEM-1",
    sku: "AP-CAB-4C-50XLPE",
    specMatch: 96,
    keyDifferences: "Perfect match – voltage grade and insulation type aligned",
  },
  {
    rfpItem: "ITEM-1",
    sku: "AP-CAB-4C-50PVC",
    specMatch: 82,
    keyDifferences: "Different insulation: PVC instead of XLPE",
  },
  {
    rfpItem: "ITEM-1",
    sku: "GEN-CAB-4C-35XLPE",
    specMatch: 70,
    keyDifferences: "Lower cross-sectional area: 35 sq.mm vs 50 sq.mm",
  },
  {
    rfpItem: "ITEM-2",
    sku: "AP-CAB-3.5C-120XLPE",
    specMatch: 98,
    keyDifferences: "Exact match on all specifications",
  },
  {
    rfpItem: "ITEM-2",
    sku: "AP-CAB-4C-120XLPE",
    specMatch: 90,
    keyDifferences: "4 core instead of 3.5 core",
  },
  {
    rfpItem: "ITEM-3",
    sku: "AP-CTRL-12C-2.5PVC",
    specMatch: 94,
    keyDifferences: "Matches all key specs including copper conductor",
  },
]

export const pricingData: PricingRow[] = [
  {
    sku: "AP-CAB-4C-50XLPE",
    description: "4C 50mm² Al 1.1kV XLPE",
    quantity: 2000,
    unitPrice: 185,
    testCost: 15000,
    lineTotal: 385000,
  },
  {
    sku: "AP-CAB-3.5C-120XLPE",
    description: "3.5C 120mm² Al 1.1kV XLPE",
    quantity: 1200,
    unitPrice: 320,
    testCost: 12000,
    lineTotal: 396000,
  },
  {
    sku: "AP-CTRL-12C-2.5PVC",
    description: "12C 2.5mm² Cu 1.1kV PVC",
    quantity: 1000,
    unitPrice: 95,
    testCost: 8000,
    lineTotal: 103000,
  },
]

export const atRiskRfps: AtRiskRfp[] = [
  {
    id: "RFP-2025-003",
    client: "State Transmission",
    dueDate: "Jan 19, 2025",
    stage: "Pricing",
    riskReason: "Pricing pending, 1 day remaining",
    priority: "High",
  },
  {
    id: "RFP-2025-001",
    client: "NTPC Power",
    dueDate: "Jan 20, 2025",
    stage: "Technical Review",
    riskReason: "Spec match low for 1 item",
    priority: "High",
  },
  {
    id: "RFP-2025-006",
    client: "Railway Electrification",
    dueDate: "Jan 22, 2025",
    stage: "Qualified",
    riskReason: "Not yet in technical review",
    priority: "Medium",
  },
  {
    id: "RFP-2025-007",
    client: "Port Authority",
    dueDate: "Jan 24, 2025",
    stage: "Identified",
    riskReason: "Not yet qualified by sales team",
    priority: "Medium",
  },
  {
    id: "RFP-2025-008",
    client: "Mumbai Metro Corporation",
    dueDate: "Jan 30, 2025",
    stage: "Not Actioned",
    riskReason: "Received 2 hours ago",
    priority: "High",
  },
  {
    id: "RFP-2025-007",
    client: "Delhi Power Grid",
    dueDate: "Jan 28, 2025",
    stage: "In Progress",
    riskReason: "Received 5 hours ago",
    priority: "High",
  },
  {
    id: "RFP-2025-006",
    client: "Railway Electrification",
    dueDate: "Feb 15, 2025",
    stage: "Qualified",
    riskReason: "Received 1 day ago",
    priority: "Medium",
  },
  {
    id: "RFP-2025-005",
    client: "Smart City Project",
    dueDate: "Feb 10, 2025",
    stage: "Technical Review",
    riskReason: "Received 2 days ago",
    priority: "Medium",
  },
  {
    id: "RFP-2025-004",
    client: "Industrial Park Authority",
    dueDate: "Feb 20, 2025",
    stage: "Pricing",
    riskReason: "Received 3 days ago",
    priority: "Low",
  },
  {
    id: "RFP-2025-003",
    client: "State Transmission",
    dueDate: "Jan 25, 2025",
    stage: "Priced",
    riskReason: "Received 4 days ago",
    priority: "High",
  },
]

export const activityFeed: ActivityItem[] = [
  { id: "act-1", message: "Master Agent prioritized RFP-2025-001 (High priority)", time: "10 minutes ago" },
  { id: "act-2", message: "Technical Agent regenerated SKU matches for RFP-2025-003", time: "1 hour ago" },
  { id: "act-3", message: "Pricing Agent updated test costs for NTPC tender", time: "2 hours ago" },
  { id: "act-4", message: "Sales Agent identified new RFP from Metro Rail Corporation", time: "3 hours ago" },
  { id: "act-5", message: "Master Agent assigned RFP-2025-005 to Technical Agent", time: "5 hours ago" },
  { id: "act-6", message: "Pricing Agent generated proposal for RFP-2025-004", time: "Yesterday" },
  { id: "act-7", message: "Technical Agent matched 5 SKUs for Industrial Park RFP", time: "Yesterday" },
  { id: "act-8", message: "Sales Agent qualified RFP-2025-008 from Smart City Project", time: "2 days ago" },
]

export const productCatalog: Product[] = [
  {
    sku: "AP-CAB-4C-50XLPE",
    name: "4 Core LT Power Cable 50 sq.mm Al XLPE",
    voltage: "1.1kV",
    conductor: "Aluminium",
    area: "50 sq.mm",
    insulation: "XLPE",
    armouring: false,
    basePrice: 185,
  },
  {
    sku: "AP-CAB-4C-50PVC",
    name: "4 Core LT Power Cable 50 sq.mm Al PVC",
    voltage: "1.1kV",
    conductor: "Aluminium",
    area: "50 sq.mm",
    insulation: "PVC",
    armouring: false,
    basePrice: 165,
  },
  {
    sku: "AP-CAB-3.5C-120XLPE",
    name: "3.5 Core LT Power Cable 120 sq.mm Al XLPE",
    voltage: "1.1kV",
    conductor: "Aluminium",
    area: "120 sq.mm",
    insulation: "XLPE",
    armouring: false,
    basePrice: 320,
  },
  {
    sku: "AP-CAB-4C-120XLPE",
    name: "4 Core LT Power Cable 120 sq.mm Al XLPE",
    voltage: "1.1kV",
    conductor: "Aluminium",
    area: "120 sq.mm",
    insulation: "XLPE",
    armouring: false,
    basePrice: 340,
  },
  {
    sku: "AP-CTRL-12C-2.5PVC",
    name: "12 Core Control Cable 2.5 sq.mm Cu PVC",
    voltage: "1.1kV",
    conductor: "Copper",
    area: "2.5 sq.mm",
    insulation: "PVC",
    armouring: false,
    basePrice: 95,
  },
  {
    sku: "AP-CAB-3C-95XLPE",
    name: "3 Core LT Power Cable 95 sq.mm Al XLPE",
    voltage: "1.1kV",
    conductor: "Aluminium",
    area: "95 sq.mm",
    insulation: "XLPE",
    armouring: false,
    basePrice: 280,
  },
  {
    sku: "AP-CAB-2C-70XLPE",
    name: "2 Core LT Power Cable 70 sq.mm Al XLPE",
    voltage: "1.1kV",
    conductor: "Aluminium",
    area: "70 sq.mm",
    insulation: "XLPE",
    armouring: true,
    basePrice: 215,
  },
  {
    sku: "AP-HT-3C-150XLPE",
    name: "3 Core HT Power Cable 150 sq.mm Al XLPE",
    voltage: "11kV",
    conductor: "Aluminium",
    area: "150 sq.mm",
    insulation: "XLPE",
    armouring: true,
    basePrice: 485,
  },
  {
    sku: "AP-HT-3C-185XLPE",
    name: "3 Core HT Power Cable 185 sq.mm Al XLPE",
    voltage: "11kV",
    conductor: "Aluminium",
    area: "185 sq.mm",
    insulation: "XLPE",
    armouring: true,
    basePrice: 565,
  },
  {
    sku: "GEN-CAB-4C-35XLPE",
    name: "4 Core LT Power Cable 35 sq.mm Al XLPE",
    voltage: "1.1kV",
    conductor: "Aluminium",
    area: "35 sq.mm",
    insulation: "XLPE",
    armouring: false,
    basePrice: 145,
  },
]

export const recentRfps: RecentRfp[] = [
  {
    id: "RFP-2025-008",
    client: "Mumbai Metro Corporation",
    receivedDate: "2 hours ago",
    source: "Email",
    status: "Not Actioned",
    priority: "High",
    estimatedValue: "$450,000",
    dueDate: "Jan 30, 2025",
  },
  {
    id: "RFP-2025-007",
    client: "Delhi Power Grid",
    receivedDate: "5 hours ago",
    source: "Portal",
    status: "In Progress",
    priority: "High",
    estimatedValue: "$720,000",
    dueDate: "Jan 28, 2025",
  },
  {
    id: "RFP-2025-006",
    client: "Railway Electrification",
    receivedDate: "1 day ago",
    source: "Website",
    status: "Qualified",
    priority: "Medium",
    estimatedValue: "$380,000",
    dueDate: "Feb 15, 2025",
  },
  {
    id: "RFP-2025-005",
    client: "Smart City Project",
    receivedDate: "2 days ago",
    source: "Email",
    status: "Technical Review",
    priority: "Medium",
    estimatedValue: "$290,000",
    dueDate: "Feb 10, 2025",
  },
  {
    id: "RFP-2025-004",
    client: "Industrial Park Authority",
    receivedDate: "3 days ago",
    source: "Portal",
    status: "Pricing",
    priority: "Low",
    estimatedValue: "$180,000",
    dueDate: "Feb 20, 2025",
  },
  {
    id: "RFP-2025-003",
    client: "State Transmission",
    receivedDate: "4 days ago",
    source: "Email",
    status: "Priced",
    priority: "High",
    estimatedValue: "$850,000",
    dueDate: "Jan 25, 2025",
  },
]
