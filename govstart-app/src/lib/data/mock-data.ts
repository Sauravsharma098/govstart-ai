import { 
  Tender, 
  StartupProfile, 
  User, 
  Application, 
  NotificationItem, 
  PreparationWorkspace, 
  MissingDocAlert, 
  RecentlyViewedTender, 
  RecommendedAction, 
  ShortlistRecord,
  SavedSearch,
  LearningResource,
  PricingPlan,
  DataTrustLevel
} from '../types';

export const MOCK_STARTUPS: StartupProfile[] = [
  {
    id: 'startup-1',
    name: 'AeroTech Defence Labs',
    dpiitNumber: 'DIPP89234',
    incorporationDate: '2021-04-15',
    sector: 'Defence & Aerospace',
    categories: ['Defence Electronics', 'Unmanned Systems', 'Edge AI'],
    description: 'Pioneering edge-AI tactical micro-UAVs and autonomous swarm systems for border surveillance.',
    website: 'https://aerotechdefence.example.in',
    city: 'Pune',
    state: 'Maharashtra',
    annualTurnoverLakhs: 420,
    preferredContractMinLakhs: 100,
    preferredContractMaxLakhs: 2500,
    dpiitRecognized: true,
    msmeRegistered: true,
    priorGovExperienceYears: 3,
    completedGovProjects: 4,
    certifications: ['ISO 9001:2015', 'AS9100D Aerospace', 'CEMILAC Flight Qualified'],
    techStack: ['Edge AI', 'Computer Vision', 'ROS2', 'Thermal Imaging', 'FPGA', 'Encrypted C2 Link'],
    patentsCount: 5,
    readinessScore: 94,
    availableDocuments: [
      'DPIIT Startup India Certificate',
      'Make-in-India Self-Declaration (>= 50%)',
      'MSME Udyam Certificate',
      'ISO 9001:2015 Certificate',
      'Audited Financial Statements (FY 23-25)'
    ]
  },
  {
    id: 'startup-2',
    name: 'MedPulse HealthTech Solutions',
    dpiitNumber: 'DIPP94112',
    incorporationDate: '2022-01-10',
    sector: 'Healthcare & Life Sciences',
    categories: ['Medical IoT', 'Telemedicine', 'AI Diagnostics'],
    description: 'Cloud-enabled portable diagnostic ICU kiosks and telemetry monitoring for tier-3 district hospitals.',
    website: 'https://medpulsehealth.example.in',
    city: 'Bengaluru',
    state: 'Karnataka',
    annualTurnoverLakhs: 280,
    preferredContractMinLakhs: 50,
    preferredContractMaxLakhs: 1500,
    dpiitRecognized: true,
    msmeRegistered: true,
    priorGovExperienceYears: 2,
    completedGovProjects: 2,
    certifications: ['ISO 13485 Medical Devices', 'CDSCO Class B Approved', 'HIPAA Compliant'],
    techStack: ['Medical IoT', 'DICOM Processing', 'Flutter', 'FHIR Protocol', 'TensorFlow Lite'],
    patentsCount: 3,
    readinessScore: 91,
    availableDocuments: [
      'DPIIT Startup India Certificate',
      'Make-in-India Self-Declaration (>= 50%)',
      'MSME Udyam Certificate',
      'ISO 13485 Certificate',
      'CDSCO Class B Registration'
    ]
  },
  {
    id: 'startup-3',
    name: 'GreenGrid Microgrids',
    dpiitNumber: 'DIPP76420',
    incorporationDate: '2020-08-20',
    sector: 'CleanTech & Renewable Energy',
    categories: ['Smart Grids', 'Energy Storage', 'IoT SCADA'],
    description: 'Modular solar-hybrid microgrids with predictive load balancing for remote military and rural outposts.',
    website: 'https://greengridmicro.example.in',
    city: 'Ahmedabad',
    state: 'Gujarat',
    annualTurnoverLakhs: 650,
    preferredContractMinLakhs: 200,
    preferredContractMaxLakhs: 3000,
    dpiitRecognized: true,
    msmeRegistered: true,
    priorGovExperienceYears: 4,
    completedGovProjects: 5,
    certifications: ['ISO 14001 Environmental', 'MNRE Tier-1 Vendor', 'IEC 61850'],
    techStack: ['Power Electronics', 'SCADA', 'LoRaWAN', 'Battery Management System', 'MQTT'],
    patentsCount: 4,
    readinessScore: 88,
    availableDocuments: [
      'DPIIT Startup India Certificate',
      'MSME Udyam Certificate',
      'MNRE Vendor Approval',
      'Audited Financial Statements (FY 23-25)'
    ]
  },
  {
    id: 'startup-4',
    name: 'KisanAgri Robotics',
    dpiitNumber: 'DIPP62981',
    incorporationDate: '2022-07-01',
    sector: 'AgriTech & Remote Sensing',
    categories: ['Precision Agriculture', 'Drone Sensing', 'Soil Analytics'],
    description: 'Multispectral drone crop-yield prediction and pest damage assessment platform integrated with PMFBY.',
    website: 'https://kisanagri.example.in',
    city: 'Hyderabad',
    state: 'Telangana',
    annualTurnoverLakhs: 190,
    preferredContractMinLakhs: 30,
    preferredContractMaxLakhs: 800,
    dpiitRecognized: true,
    msmeRegistered: true,
    priorGovExperienceYears: 1,
    completedGovProjects: 1,
    certifications: ['DGCA Drone Type Certified', 'ISO 27001'],
    techStack: ['Multispectral Imaging', 'GIS / QGIS', 'Python GeoSpatial', 'Satellite Synthetic Aperture Radar'],
    patentsCount: 2,
    readinessScore: 82
  },
  {
    id: 'startup-5',
    name: 'CyberShield DefTech Systems',
    dpiitNumber: 'DIPP51092',
    incorporationDate: '2021-11-14',
    sector: 'Cybersecurity & Quantum Tech',
    categories: ['Zero Trust', 'Kernel Security', 'Post-Quantum Crypto'],
    description: 'Hardware-anchored zero-trust endpoint protection and quantum-resistant secure channels for defense intranets.',
    website: 'https://cybershielddef.example.in',
    city: 'New Delhi',
    state: 'Delhi',
    annualTurnoverLakhs: 510,
    preferredContractMinLakhs: 150,
    preferredContractMaxLakhs: 2500,
    dpiitRecognized: true,
    msmeRegistered: true,
    priorGovExperienceYears: 3,
    completedGovProjects: 6,
    certifications: ['CERT-In Empanelled', 'STQC Common Criteria EAL4+', 'ISO 27001'],
    techStack: ['eBPF Linux Kernel', 'Rust', 'Post-Quantum Crypto (Kyber/Dilithium)', 'WireGuard', 'SIEM / SOAR'],
    patentsCount: 6,
    readinessScore: 97
  },
  {
    id: 'startup-incomplete',
    name: 'QuantumNew Labs (Incomplete Profile)',
    dpiitNumber: 'DIPP-PENDING',
    incorporationDate: '2024-04-10',
    sector: 'DeepTech Robotics',
    categories: ['Robotics'],
    description: 'Stealth drone hardware prototype builder.',
    website: 'https://quantumnew.example.in',
    annualTurnoverLakhs: 0,
    dpiitRecognized: false,
    msmeRegistered: false,
    priorGovExperienceYears: 0,
    completedGovProjects: 0,
    certifications: [],
    techStack: ['Python', 'Robotics'],
    patentsCount: 0,
    readinessScore: 32,
    availableDocuments: [],
    incompleteProfile: true
  }
];

export const MOCK_USERS: User[] = [
  {
    id: 'user-startup-1',
    name: 'Dr. Vikram Malhotra',
    email: 'vikram@aerotechdefence.in',
    role: 'STARTUP',
    organization: 'AeroTech Defence Labs',
    startupProfileId: 'startup-1',
    avatar: 'VM',
    phone: '+91 98230 44102'
  },
  {
    id: 'user-msme-1',
    name: 'Rajesh Gupta',
    email: 'rajesh@solargrid.in',
    role: 'MSME',
    organization: 'SolarGrid Dynamics Pvt Ltd (MSME Udyam)',
    startupProfileId: 'startup-3',
    avatar: 'RG',
    phone: '+91 94140 18239'
  },
  {
    id: 'user-supplier-1',
    name: 'Amitava Sengupta',
    email: 'amitava@cybershielddef.in',
    role: 'SUPPLIER',
    organization: 'CyberShield DefTech Systems (Established Supplier)',
    startupProfileId: 'startup-5',
    avatar: 'AS',
    phone: '+91 98110 59201'
  },
  {
    id: 'user-consultant-1',
    name: 'Sunita Deshmukh',
    email: 'sunita@apexgovtech.in',
    role: 'CONSULTANT',
    organization: 'Apex GovTech Advisory Services',
    consultancyFirm: 'Apex GovTech Advisors LLP',
    assignedClientIds: ['startup-1', 'startup-2', 'startup-3'],
    avatar: 'SD',
    phone: '+91 98200 81230'
  },
  {
    id: 'user-officer-1',
    name: 'Col. Rajesh Sharma (Retd.)',
    email: 'rajesh.sharma@drdo.gov.in',
    role: 'OFFICER',
    organization: 'DRDO Directorate of Electronics & Radar',
    officerDepartmentId: 'dept-drdo',
    avatar: 'RS',
    phone: '+91 11 2301 4452'
  },
  {
    id: 'user-admin-1',
    name: 'Pooja Verma, IAS',
    email: 'pooja.verma@meity.gov.in',
    role: 'ADMIN',
    organization: 'Ministry of Electronics & IT - Startup Procurement Mission',
    avatar: 'PV',
    phone: '+91 11 2436 0192'
  }
];

export const MOCK_TENDERS: Tender[] = [
  {
    id: 'tender-1',
    referenceNumber: 'DRDO/ER/2026/UAV-048',
    title: 'Autonomous Perimeter Edge-AI Surveillance UAV Swarm System',
    department: 'Defence Research and Development Organisation (DRDO)',
    ministry: 'Ministry of Defence',
    category: 'Defence Electronics',
    sector: 'Defence & Aerospace',
    description: 'Procurement of ruggedized autonomous micro-UAV swarms equipped with on-device computer vision for high-altitude night perimeter reconnaissance with encrypted command-and-control links.',
    estimatedBudgetInr: 125000000,
    budgetString: '₹12.50 Cr',
    emdAmountInr: 2500000,
    emdExemptForStartups: true,
    priorTurnoverExempt: true,
    priorExperienceExempt: true,
    publishDate: '2026-09-15',
    submissionDeadline: '2026-11-20',
    status: 'ACTIVE',
    location: 'Leh & Ladakh Sector / Chandigarh Proof Center',
    geographicalRestrictions: ['All India (Make in India Class-I)'],
    preparationTimeDays: 14,
    tags: ['Edge AI', 'Computer Vision', 'UAV Swarm', 'Thermal Imaging', 'ROS2', 'DPIIT Exempt'],
    eligibilityCriteria: [
      'DPIIT recognized startup with proven hardware capability in micro-UAVs or autonomous robotics.',
      'Demonstrated on-device edge computing latency < 45ms for object detection.',
      'CEMILAC flight test qualification or willingness to undergo trial at TBRL Chandigarh.',
      'Exemption granted for Prior Turnover and Prior Experience as per Order F.20/2/2014-PPD.'
    ],
    clauses: [
      {
        clauseNumber: 'Cl 3.1',
        title: 'Earnest Money Deposit (EMD) Waiver',
        description: 'DPIIT recognized Startups and registered Micro & Small Enterprises are 100% exempt from submission of EMD upon uploading valid DPIIT Certificate.',
        mandatory: true,
        exemptionApplicable: true
      },
      {
        clauseNumber: 'Cl 4.2',
        title: 'Thermal Core Resolution Requirement',
        description: 'Payload must feature radiometric uncooled microbolometer sensor >= 640x512 with 30fps refresh rate.',
        mandatory: true,
        exemptionApplicable: false
      },
      {
        clauseNumber: 'Cl 7.8',
        title: 'Delivery Schedule & High-Altitude Trials',
        description: 'First batch of 4 prototypes must be delivered within 90 days from contract award for Leh sector trials at 14,000 ft altitude.',
        mandatory: true,
        exemptionApplicable: false
      }
    ],
    officialSourceUrl: 'https://eprocure.gov.in/eprocure/app?ref=DRDO/ER/2026/UAV-048',
    lastVerifiedAt: '2026-10-15T12:00:00Z',
    dataConfidence: 'HIGH'
  },
  {
    id: 'tender-2',
    referenceNumber: 'NHM/MED/2026/ICU-102',
    title: 'Deployable Remote Tele-ICU Kiosks for Primary Healthcare Centers',
    department: 'National Health Mission (NHM)',
    ministry: 'Ministry of Health and Family Welfare',
    category: 'Medical IoT',
    sector: 'Healthcare & Life Sciences',
    description: 'Turnkey rollout of 200 portable remote-monitored tele-ICU diagnostic stations in rural aspirational districts with automated ECG, SpO2, and AI triage alerts.',
    estimatedBudgetInr: 88000000,
    budgetString: '₹8.80 Cr',
    emdAmountInr: 1760000,
    emdExemptForStartups: true,
    priorTurnoverExempt: true,
    priorExperienceExempt: true,
    publishDate: '2026-09-20',
    submissionDeadline: '2026-11-10',
    status: 'CLOSING_SOON',
    location: 'Assam, Bihar, and Odisha Primary Health Centers',
    geographicalRestrictions: ['All India (Make in India Class-I)'],
    preparationTimeDays: 10,
    tags: ['Medical IoT', 'Telemedicine', 'CDSCO Approved', 'FHIR Protocol', 'DPIIT Exempt'],
    eligibilityCriteria: [
      'CDSCO Class B medical device approval or ISO 13485 certification.',
      'FHIR and ABHA compliant cloud telemetry backend.',
      'DPIIT recognized startups exempted from past turnover condition.'
    ],
    clauses: [
      {
        clauseNumber: 'Cl 2.4',
        title: 'DPIIT Exemption for Medical Startups',
        description: 'Startup entities with valid recognition qualify for relaxation in prior operational years criteria.',
        mandatory: true,
        exemptionApplicable: true
      },
      {
        clauseNumber: 'Cl 5.1',
        title: 'ABHA / ABDM Integration',
        description: 'All patient records generated must securely bind with Ayushman Bharat Health Account tokens.',
        mandatory: true,
        exemptionApplicable: false
      }
    ],
    officialSourceUrl: 'https://nhm.gov.in/tenders/tele-icu-102',
    lastVerifiedAt: '2026-10-15T14:30:00Z',
    dataConfidence: 'HIGH'
  },
  {
    id: 'tender-3',
    referenceNumber: 'MEITY/SEC/2026/ZT-77',
    title: 'Zero-Trust Secure Access & Kernel Endpoint Telemetry System',
    department: 'National Informatics Centre (NIC) & MeitY',
    ministry: 'Ministry of Electronics and Information Technology',
    category: 'Cybersecurity',
    sector: 'Cybersecurity & Quantum Tech',
    description: 'Enterprise deployment of an eBPF-based host inspection agent and zero-trust network access broker for 50,000 government workstations and datacenter hosts.',
    estimatedBudgetInr: 145000000,
    budgetString: '₹14.50 Cr',
    emdAmountInr: 2900000,
    emdExemptForStartups: true,
    priorTurnoverExempt: true,
    priorExperienceExempt: false,
    publishDate: '2026-09-28',
    submissionDeadline: '2026-12-05',
    status: 'ACTIVE',
    location: 'National Data Centers (Delhi, Pune, Hyderabad, Bhubaneswar)',
    tags: ['Zero Trust', 'eBPF', 'Linux Kernel', 'CERT-In', 'Post-Quantum Crypto'],
    eligibilityCriteria: [
      'Empanelled or certified under STQC Common Criteria EAL4+ or CERT-In audited product.',
      'Indigenous IPR held in India (Make in India Class-1 local supplier).',
      'Exemption for EMD provided to DPIIT recognized entities.'
    ],
    clauses: [
      {
        clauseNumber: 'Cl 1.7',
        title: 'Sovereign Source Code Escrow',
        description: 'The selected contractor must deposit verified source code and compilation blueprints into MeitY national software vault.',
        mandatory: true,
        exemptionApplicable: false
      }
    ],
    officialSourceUrl: 'https://meity.gov.in/tenders/zt-77',
    lastVerifiedAt: '2026-10-14T16:00:00Z',
    dataConfidence: 'HIGH'
  },
  {
    id: 'tender-4',
    referenceNumber: 'SECI/MICROGRID/2026/09',
    title: 'High-Altitude Solar-Hybrid Microgrid with Smart Battery Management',
    department: 'Solar Energy Corporation of India (SECI)',
    ministry: 'Ministry of New and Renewable Energy',
    category: 'Smart Grids',
    sector: 'CleanTech & Renewable Energy',
    description: 'Design, supply, and commissioning of 15 microgrid clusters utilizing LFP/Sodium-ion battery energy storage and intelligent SCADA telemetry in remote cold desert outposts.',
    estimatedBudgetInr: 110000000,
    budgetString: '₹11.00 Cr',
    emdAmountInr: 2200000,
    emdExemptForStartups: true,
    priorTurnoverExempt: true,
    priorExperienceExempt: true,
    publishDate: '2026-10-01',
    submissionDeadline: '2026-12-15',
    status: 'ACTIVE',
    location: 'Spiti Valley & Siachen Base Area',
    tags: ['Smart Grids', 'Energy Storage', 'SCADA', 'Microgrid', 'Power Electronics'],
    eligibilityCriteria: [
      'DPIIT recognized clean-tech startup with sub-zero battery operational validation.',
      'SCADA compliant with IEC 61850 protocol standards.',
      'EMD and turnover exemption available under Public Procurement Policy.'
    ],
    clauses: [
      {
        clauseNumber: 'Cl 4.1',
        title: 'Operating Temperature Thresholds',
        description: 'All inverters and cell management units must function without thermal runaway from -35°C to +45°C.',
        mandatory: true,
        exemptionApplicable: false
      }
    ],
    officialSourceUrl: 'https://seci.co.in/tenders/microgrid-09',
    lastVerifiedAt: '2026-10-15T09:00:00Z',
    dataConfidence: 'HIGH'
  },
  {
    id: 'tender-5',
    referenceNumber: 'ICAR/AGRI/2026/DRN-33',
    title: 'AI Multispectral Drone Imaging for Crop Stress & Yield Forewarning',
    department: 'Indian Council of Agricultural Research (ICAR)',
    ministry: 'Ministry of Agriculture and Farmers Welfare',
    category: 'Precision Agriculture',
    sector: 'AgriTech & Remote Sensing',
    description: 'Autonomous drone fleet survey across 50,000 hectares for early fungal disease detection, soil moisture index mapping, and automated insurance loss assessment.',
    estimatedBudgetInr: 52000000,
    budgetString: '₹5.20 Cr',
    emdAmountInr: 1040000,
    emdExemptForStartups: true,
    priorTurnoverExempt: true,
    priorExperienceExempt: true,
    publishDate: '2026-09-10',
    submissionDeadline: '2026-10-31',
    status: 'CLOSING_SOON',
    location: 'Punjab, Haryana, and Madhya Pradesh Wheat/Paddy Belts',
    tags: ['Multispectral Imaging', 'GIS', 'Drone Sensing', 'Soil Analytics', 'AI Diagnostics'],
    eligibilityCriteria: [
      'DGCA Type-Certified drones with multispectral sensors.',
      'DPIIT recognized startup receives 100% waiver of past turnover requirement.',
      'Automated pipeline with NDVI / NDRE resolution <= 5cm per pixel.'
    ],
    clauses: [
      {
        clauseNumber: 'Cl 3.3',
        title: 'Fast Turnaround Processing',
        description: 'Orthomosaic processing and stress anomaly maps must be pushed to state agri portal within 24 hours of flight.',
        mandatory: true,
        exemptionApplicable: false
      }
    ],
    officialSourceUrl: 'https://icar.gov.in/tenders/drn-33',
    lastVerifiedAt: '2026-10-12T11:00:00Z',
    dataConfidence: 'HIGH'
  },
  {
    id: 'tender-6',
    referenceNumber: 'ISRO/VSSC/2026/AV-18',
    title: 'Radiation-Tolerant FPGA Embedded Edge Computing Units',
    department: 'Vikram Sarabhai Space Centre (ISRO)',
    ministry: 'Department of Space',
    category: 'Space Electronics',
    sector: 'Defence & Aerospace',
    description: 'Development of space-grade modular system-on-chip avionics computers with hardware fault-tolerance and secure boot mechanisms.',
    estimatedBudgetInr: 95000000,
    budgetString: '₹9.50 Cr',
    emdAmountInr: 1900000,
    emdExemptForStartups: true,
    priorTurnoverExempt: true,
    priorExperienceExempt: false,
    publishDate: '2026-10-05',
    submissionDeadline: '2026-12-28',
    status: 'ACTIVE',
    location: 'Thiruvananthapuram, Kerala',
    tags: ['FPGA', 'Avionics', 'Edge AI', 'Space Tech', 'Hardware Security'],
    eligibilityCriteria: [
      'Proven expertise in FPGA RTL development, Vivado/Quartus toolchains.',
      'Startup DPIIT certification grants EMD waiver.'
    ],
    clauses: [
      {
        clauseNumber: 'Cl 6.2',
        title: 'Thermal Vacuum and Radiation Screening',
        description: 'Prototypes must pass thermal vacuum tests at VSSC facility prior to final signoff.',
        mandatory: true,
        exemptionApplicable: false
      }
    ],
    officialSourceUrl: 'https://isro.gov.in/tenders/av-18',
    lastVerifiedAt: '2026-10-15T15:00:00Z',
    dataConfidence: 'HIGH'
  },
  // Specific Scenario 3: Tender with missing eligibility information
  {
    id: 'tender-missing-info',
    referenceNumber: 'STATE/SMART/2026/IOT-01',
    title: 'Smart City Edge Sensor Pilot (Missing Eligibility RFP)',
    department: 'Smart City Mission Directorate',
    ministry: 'Ministry of Housing and Urban Affairs',
    category: 'Smart Cities',
    sector: 'CleanTech & Renewable Energy',
    description: 'Deployment of ambient air quality, noise, and vibration IoT sensor poles across municipal corporation intersections.',
    estimatedBudgetInr: 32000000,
    budgetString: '₹3.20 Cr',
    emdAmountInr: 640000,
    emdExemptForStartups: true,
    priorTurnoverExempt: true,
    priorExperienceExempt: true,
    publishDate: '2026-10-10',
    submissionDeadline: '2026-11-25',
    status: 'ACTIVE',
    location: 'Bhopal Smart City',
    tags: ['IoT', 'Air Quality', 'LoRaWAN'],
    eligibilityCriteria: ['Vendor must be registered in India. Detailed technical RFP corrigendum awaited.'],
    missingEligibilityInfo: true,
    clauses: [],
    officialSourceUrl: 'https://smartcities.gov.in/tender/iot-01',
    lastVerifiedAt: '2026-10-12T10:00:00Z',
    dataConfidence: 'LOW'
  },
  // Specific Scenario 4: Expired tender (excluded from active recommendations)
  {
    id: 'tender-expired',
    referenceNumber: 'MOD/ORD/2025/EX-99',
    title: 'Tactical Bulletproof Vests & Ballistic Helmets (Expired)',
    department: 'Ministry of Defence',
    ministry: 'Ministry of Defence',
    category: 'Ballistics',
    sector: 'Defence & Aerospace',
    description: 'Procurement of 10,000 NIJ Level IV ballistic ceramic plates. Bidding concluded in May 2025.',
    estimatedBudgetInr: 45000000,
    budgetString: '₹4.50 Cr',
    emdAmountInr: 900000,
    emdExemptForStartups: true,
    priorTurnoverExempt: true,
    priorExperienceExempt: false,
    publishDate: '2025-03-01',
    submissionDeadline: '2025-05-15',
    status: 'EXPIRED',
    location: 'Kanpur, UP',
    tags: ['Ballistics', 'Body Armor'],
    eligibilityCriteria: ['DGQA approved ballistic laboratory test certificates.'],
    clauses: [],
    officialSourceUrl: 'https://eprocure.gov.in/eprocure/app?ref=MOD/ORD/2025/EX-99',
    lastVerifiedAt: '2025-05-16T00:00:00Z',
    dataConfidence: 'LOW'
  },
  // Specific Scenario 5: Tender with low relevance but very high contract value
  {
    id: 'tender-high-val-low-rel',
    referenceNumber: 'NHAI/CIVIL/2026/TUN-800',
    title: 'Construction of 4-Lane Himalayan Highway Tunnel & Viaduct',
    department: 'National Highways Authority of India (NHAI)',
    ministry: 'Ministry of Road Transport and Highways',
    category: 'Heavy Civil Infrastructure',
    sector: 'Infrastructure & Construction',
    description: 'EPC contract for drill-and-blast excavation of 6.8km dual-tube rock tunnel with concrete lining and drainage galleries in Jammu & Kashmir.',
    estimatedBudgetInr: 2500000000,
    budgetString: '₹250.00 Cr',
    emdAmountInr: 50000000,
    emdExemptForStartups: false,
    priorTurnoverExempt: false,
    priorExperienceExempt: false,
    publishDate: '2026-10-02',
    submissionDeadline: '2026-12-30',
    status: 'ACTIVE',
    location: 'Zojila Pass / Sonamarg Sector',
    tags: ['Civil Works', 'Tunnels', 'Concrete', 'Heavy Machinery'],
    eligibilityCriteria: [
      'Bidder must have completed at least one single road tunnel project of value >= ₹1000 Cr in the past 5 years.',
      'Minimum average annual construction turnover of ₹500 Cr over the last 3 financial years.',
      'No startup exemptions applicable for heavy structural civil works.'
    ],
    clauses: [],
    officialSourceUrl: 'https://nhai.gov.in/eprocure/tunnel-800',
    lastVerifiedAt: '2026-10-14T09:00:00Z',
    dataConfidence: 'HIGH'
  }
];

export const MOCK_APPLICATIONS: Application[] = [
  {
    id: 'app-001',
    tenderId: 'tender-1',
    tenderTitle: 'Autonomous Perimeter Edge-AI Surveillance UAV Swarm System',
    department: 'DRDO',
    startupId: 'startup-1',
    startupName: 'AeroTech Defence Labs',
    bidAmountInr: 118000000,
    submittedAt: '2026-10-04T11:20:00Z',
    status: 'TECHNICAL_EVALUATION',
    matchScore: 97,
    clarifications: [
      {
        id: 'clar-1',
        askedBy: 'Col. Rajesh Sharma (DRDO Evaluation Board)',
        askedAt: '2026-10-12T09:15:00Z',
        question: 'Please confirm whether the thermal payload microbolometer is indigenously packaged or procured from an authorized allied partner.',
        response: 'The thermal sensor core is integrated using authorized DRS cores with indigenous proprietary optical housing and video processing boards manufactured in our Pune lab.',
        respondedAt: '2026-10-12T14:40:00Z'
      }
    ]
  },
  {
    id: 'app-002',
    tenderId: 'tender-2',
    tenderTitle: 'Deployable Remote Tele-ICU Kiosks for Primary Healthcare Centers',
    department: 'NHM',
    startupId: 'startup-2',
    startupName: 'MedPulse HealthTech Solutions',
    bidAmountInr: 82000000,
    submittedAt: '2026-09-30T16:00:00Z',
    status: 'SHORTLISTED',
    matchScore: 94,
    clarifications: []
  }
];

export const MOCK_SHORTLISTS: ShortlistRecord[] = [
  {
    id: 'sl-1',
    userId: 'user-startup-1',
    startupId: 'startup-1',
    tenderId: 'tender-1',
    tender: MOCK_TENDERS[0],
    addedAt: '2026-10-14T10:30:00Z',
    matchScore: 97,
    eligibilityStatus: 'ELIGIBLE_PROVISIONAL',
    dataConfidence: 'HIGH',
    notes: 'Primary DRDO target. 100% EMD waiver confirmed. Signed NDA pending.'
  },
  {
    id: 'sl-2',
    userId: 'user-startup-1',
    startupId: 'startup-1',
    tenderId: 'tender-6',
    tender: MOCK_TENDERS[5],
    addedAt: '2026-10-15T14:15:00Z',
    matchScore: 89,
    eligibilityStatus: 'POTENTIALLY_ELIGIBLE',
    dataConfidence: 'HIGH',
    notes: 'ISRO FPGA edge units. Sub-zero flight test report required.'
  }
];

export const MOCK_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    title: 'High AI Match Alert (97%)',
    message: 'New tender DRDO/ER/2026/UAV-048 matches AeroTech Defence Labs capabilities.',
    timestamp: '2 hours ago',
    read: false,
    type: 'MATCH',
    link: 'tender-1'
  },
  {
    id: 'notif-2',
    title: 'Clarification Requested by DRDO',
    message: 'Col. Rajesh Sharma posted a technical clarification on bid #app-001.',
    timestamp: '1 day ago',
    read: false,
    type: 'CLARIFICATION',
    link: 'app-001'
  },
  {
    id: 'notif-3',
    title: 'Upcoming Deadline in 14 Days',
    message: 'Submission deadline for NHM Remote Tele-ICU Kiosks is approaching on Nov 10, 2026.',
    timestamp: '2 days ago',
    read: true,
    type: 'DEADLINE',
    link: 'tender-2'
  }
];

export const MOCK_WORKSPACES: PreparationWorkspace[] = [
  {
    id: 'ws-101',
    startupId: 'startup-1',
    tenderId: 'tender-1',
    tenderTitle: 'Autonomous Perimeter Edge-AI Surveillance UAV Swarm System',
    tenderRef: 'DRDO/ER/2026/UAV-048',
    department: 'DRDO Directorate of Electronics',
    progressPercentage: 65,
    lastEdited: '18 minutes ago',
    completedChecklistCount: 4,
    totalChecklistCount: 6,
    targetDeadline: '2026-11-20',
    bidAmountLakhs: 1180
  },
  {
    id: 'ws-102',
    startupId: 'startup-1',
    tenderId: 'tender-6',
    tenderTitle: 'Radiation-Tolerant FPGA Embedded Edge Computing Units',
    tenderRef: 'ISRO/VSSC/2026/AV-18',
    department: 'Vikram Sarabhai Space Centre (ISRO)',
    progressPercentage: 30,
    lastEdited: 'Yesterday',
    completedChecklistCount: 2,
    totalChecklistCount: 5,
    targetDeadline: '2026-12-28',
    bidAmountLakhs: 920
  },
  {
    id: 'ws-103',
    startupId: 'startup-2',
    tenderId: 'tender-2',
    tenderTitle: 'Deployable Remote Tele-ICU Kiosks for Primary Healthcare Centers',
    tenderRef: 'NHM/MED/2026/ICU-102',
    department: 'National Health Mission',
    progressPercentage: 85,
    lastEdited: '2 hours ago',
    completedChecklistCount: 5,
    totalChecklistCount: 6,
    targetDeadline: '2026-11-10',
    bidAmountLakhs: 820
  }
];

export const MOCK_MISSING_DOCS: MissingDocAlert[] = [
  {
    id: 'mda-1',
    startupId: 'startup-1',
    severity: 'URGENT',
    title: 'Non-Disclosure Agreement (NDA) on Stamp Paper Missing',
    description: 'Mandatory signed NDA on ₹500 Non-Judicial Stamp Paper is not attached in Cover-1. Failure to submit leads to immediate disqualification.',
    tenderId: 'tender-1',
    tenderTitle: 'DRDO Autonomous UAV Swarm',
    deadline: '2026-11-20',
    actionLabel: 'Attach in Bid Studio',
    actionView: 'ai-studio'
  },
  {
    id: 'mda-2',
    startupId: 'startup-1',
    severity: 'WARNING',
    title: 'Airworthiness / CEMILAC Trial Undertaking Required',
    description: 'Submit technical willingness certificate for TBRL Chandigarh high-altitude field validation.',
    tenderId: 'tender-1',
    tenderTitle: 'DRDO Autonomous UAV Swarm',
    deadline: '2026-11-20',
    actionLabel: 'Generate Undertaking',
    actionView: 'ai-studio'
  },
  {
    id: 'mda-3',
    startupId: 'startup-2',
    severity: 'URGENT',
    title: 'CDSCO Class-B Device Audit Certificate Update',
    description: 'State Health Mission demands NABL calibration test report for portable telemetry kiosks.',
    tenderId: 'tender-2',
    tenderTitle: 'NHM Tele-ICU Kiosks',
    deadline: '2026-11-10',
    actionLabel: 'Upload Certificate',
    actionView: 'ai-studio'
  }
];

export const MOCK_RECENTLY_VIEWED: RecentlyViewedTender[] = [
  {
    startupId: 'startup-1',
    tenderId: 'tender-1',
    viewedAt: '12 minutes ago'
  },
  {
    startupId: 'startup-1',
    tenderId: 'tender-6',
    viewedAt: '2 hours ago'
  },
  {
    startupId: 'startup-1',
    tenderId: 'tender-3',
    viewedAt: 'Yesterday'
  },
  {
    startupId: 'startup-2',
    tenderId: 'tender-2',
    viewedAt: '25 minutes ago'
  },
  {
    startupId: 'startup-2',
    tenderId: 'tender-5',
    viewedAt: 'Yesterday'
  }
];

export const MOCK_RECOMMENDED_ACTIONS: RecommendedAction[] = [
  {
    id: 'act-1',
    startupId: 'startup-1',
    priority: 'HIGH',
    actionTitle: 'Submit Pre-Bid Clarification on Cl 3.2 vs Cl 14.1',
    description: 'Pre-bid clarification window for DRDO UAV Swarm closes in 14 days. Request confirmation of DPIIT startup turnover exemption.',
    deadlineNotice: 'Cutoff: 10 Nov 2026',
    tenderId: 'tender-1',
    category: 'CLARIFICATION'
  },
  {
    id: 'act-2',
    startupId: 'startup-1',
    priority: 'HIGH',
    actionTitle: 'Execute NDA on ₹500 State Stamp Paper',
    description: 'Procure state stamp paper and get notary attestation for required Cover-1 legal disclosure.',
    deadlineNotice: 'Due with Cover-1',
    tenderId: 'tender-1',
    category: 'LEGAL_DOC'
  },
  {
    id: 'act-3',
    startupId: 'startup-1',
    priority: 'MEDIUM',
    actionTitle: 'Review Sub-Zero Battery Operating Temperature Benchmark',
    description: 'Ensure hardware spec sheets verify -35°C cell discharge performance in Annexure-A.',
    deadlineNotice: 'Prior to Technical Opening',
    tenderId: 'tender-1',
    category: 'BOQ_QUOTE'
  },
  {
    id: 'act-4',
    startupId: 'startup-2',
    priority: 'HIGH',
    actionTitle: 'Verify FHIR / ABHA Telemetry Gateway Credentials',
    description: 'NHM mandate requires active test token binding with national digital health mission sandbox.',
    deadlineNotice: 'Cutoff: 10 Nov 2026',
    tenderId: 'tender-2',
    category: 'CLARIFICATION'
  }
];

export const MOCK_SAVED_SEARCHES: SavedSearch[] = [
  {
    id: 'ss-1',
    userId: 'user-startup-1',
    name: 'Defence Micro-UAV & Edge AI',
    query: 'UAV Swarm Edge AI',
    sector: 'Defence & Aerospace',
    emdExemptOnly: true,
    alertFrequency: 'DAILY',
    createdAt: '2026-10-01T08:00:00Z'
  },
  {
    id: 'ss-2',
    userId: 'user-startup-1',
    name: 'ISRO / Space Radiation-Hardened',
    query: 'FPGA Avionics Satellite',
    sector: 'SpaceTech & Satellite',
    emdExemptOnly: true,
    alertFrequency: 'WEEKLY',
    createdAt: '2026-10-05T11:30:00Z'
  },
  {
    id: 'ss-3',
    userId: 'user-msme-1',
    name: 'Solar Inverter SCADA Tenders',
    query: 'Microgrid Battery Management',
    sector: 'Renewable Energy & CleanTech',
    emdExemptOnly: false,
    alertFrequency: 'DAILY',
    createdAt: '2026-10-10T14:15:00Z'
  }
];

export const MOCK_LEARNING_RESOURCES: LearningResource[] = [
  {
    id: 'lr-1',
    title: 'Startup India Procurement Playbook: Winning GeM Bids Without Prior Turnover',
    titleHindi: 'स्टार्टअप इंडिया प्रोक्योरमेंट गाइड: बिना पिछले टर्नओवर के GeM बिड जीतें',
    category: 'GUIDE',
    readingTimeMin: 6,
    level: 'BEGINNER',
    summary: 'A definitive walkthrough on GFR 2017 Rule 170(i), obtaining 100% EMD exemptions, and invoking DPIIT circular F.20/2/2014-PPD against restrictive turnover clauses.',
    contentMarkdown: `### 1. General Financial Rules (GFR) 2017 - Rule 170(i)
Under Rule 170(i) of GFR 2017, all Micro and Small Enterprises (MSEs) registered with Udyam Registration, and all DPIIT-recognized Startups are **100% exempt from paying Earnest Money Deposit (EMD)**.

### 2. Ministry of Finance Order F.20/2/2014-PPD
Government procurers often include traditional tender conditions requiring "3 years operational experience" and "Annual turnover of at least 30% of tender value". 
* **The Legal Protection**: DoE Order No. F.20/2/2014-PPD explicitly mandates that Central Ministries, Departments, and CPSUs must relax conditions of prior turnover and prior experience for DPIIT-recognized Startups, subject to meeting technical specifications.

### 3. Step-by-Step Bidding Checklist
1. **Download DPIIT Certificate**: Ensure QR code is verifiable.
2. **Draft Bid-Security Declaration**: Replace EMD bank guarantee with the statutory Annexure declaration.
3. **Attach Technical Capability Proof**: Emphasize prototype test certifications (e.g. BIS, CEMILAC, ISO) to satisfy technical evaluation.`,
    officialUrl: 'https://www.startupindia.gov.in/content/sih/en/government-procurement.html',
    tags: ['GFR 2017', 'EMD Exemption', 'DPIIT Startup India', 'GeM Portal']
  },
  {
    id: 'lr-2',
    title: 'Essential Bilingual Tender Glossary: Decoding Government RFP Jargon',
    titleHindi: 'महत्वपूर्ण सरकारी निविदा शब्दावली: जटिल नियमों का सरल अर्थ',
    category: 'GLOSSARY',
    readingTimeMin: 4,
    level: 'BEGINNER',
    summary: 'Key procurement terms in English and Hindi including EMD (बयाना राशि), PBG (प्रदर्शन बैंक गारंटी), LD (परिनिर्धारित नुकसान), and Reverse Auction (उल्टी नीलामी).',
    contentMarkdown: `### Key Procurement Terms

* **EMD (Earnest Money Deposit / बयाना राशि)**: Bid security deposited with the tender to ensure serious bids. Exempt for DPIIT startups and MSEs.
* **PBG (Performance Bank Guarantee / निष्पादन सुरक्षा)**: Security deposit (usually 3-5% of contract value) furnished by the winning bidder to guarantee contract execution.
* **GFR (General Financial Rules / सामान्य वित्तीय नियम)**: The operational code governing all central government expenditure and procurement in India.
* **L1 (Lowest Commercial Bidder / न्यूनतम बोलीदाता)**: The qualified bidder quoting the lowest price. In QCBS bids, quality marks are combined with L1 price.
* **QCBS (Quality and Cost Based Selection)**: Evaluation method weighing technical expertise (e.g., 70%) alongside commercial bid (30%).
* **Corrigendum (शुद्धिपत्र)**: An official amendment issued by the procurement authority to clarify or modify tender terms.`,
    officialUrl: 'https://gem.gov.in/training',
    tags: ['Glossary', 'Hindi', 'Procurement Basics', 'GFR']
  },
  {
    id: 'lr-3',
    title: 'Startup Tender Readiness Audit: 10 Prerequisites Before Your First Bid',
    titleHindi: 'स्टार्टअप टेंडर रेडीनेस ऑडिट: पहली बोली लगाने से पहले 10 जरूरी कदम',
    category: 'CHECKLIST',
    readingTimeMin: 5,
    level: 'INTERMEDIATE',
    summary: 'Essential administrative, digital token, and statutory requirements needed before bidding on GeM, CPPP, or Defence iDEX tenders.',
    contentMarkdown: `### 10-Point Readiness Checklist
1. **Class 3 DSC (Digital Signature Certificate)**: Required for signing proposals on e-procurement portals.
2. **DPIIT Recognition**: Valid certificate from Startup India portal.
3. **Udyam Registration**: Free online registration confirming MSME classification.
4. **GSTIN & Active GST Filings**: Up-to-date GSTR-3B filings for the past 6 months.
5. **Pan-India GeM Primary Seller Account**: Verified bank account linked with GeM.
6. **Audited Financial Statements / CA Provisional Net Worth**: Balance sheets certified by ICAI UDIN.
7. **OEM Authorization Form (MAF)**: In case of equipment reselling or integration.
8. **ISO / Industry Standard Certifications**: (e.g. ISO 9001, ISO 27001, STQC).
9. **Undertaking on Debarment / Non-Blacklisting**: Self-declaration on non-judicial stamp paper.
10. **Make in India (MII) Local Content Certificate**: Declaration specifying percentage of domestic value addition.`,
    officialUrl: 'https://udyamregistration.gov.in',
    tags: ['Readiness', 'Checklist', 'DSC Token', 'Udyam']
  },
  {
    id: 'lr-4',
    title: 'Mastering GeM L1 Bids & Reverse Auctions: Tactical Bidding Strategies',
    titleHindi: 'GeM L1 बिडिंग और रिवर्स ऑक्शन की रणनीति',
    category: 'TUTORIAL',
    readingTimeMin: 7,
    level: 'ADVANCED',
    summary: 'How to structure multi-cover proposals, optimize BOQ pricing, and handle auto-extension windows during high-stakes government reverse auctions.',
    contentMarkdown: `### Reverse Auction (RA) Rules on GeM
* **Auto-Extension**: In the last 15 minutes of an auction, each lower bid submitted extends the timer by another 15 minutes.
* **Minimum Decrement**: Ensure your pricing system accounts for minimum decrement steps (typically 0.5% to 1%).
* **Break-Even Threshold**: Establish a firm floor price before entering the live auction room to prevent winning loss-making contracts.
* **Make in India Preference (Clause 1.1)**: Class-I local suppliers with >= 50% local content get right of first refusal to match L1 if within the 20% margin of purchase preference.`,
    officialUrl: 'https://gem.gov.in/user_manuals',
    tags: ['Reverse Auction', 'Pricing', 'BOQ', 'GeM']
  }
];

export const MOCK_PRICING_PLANS: PricingPlan[] = [
  {
    id: 'free',
    name: 'Starter Discovery',
    priceInrPerMonth: 0,
    billingCycle: 'MONTHLY',
    targetAudience: 'Early-stage founders exploring government tenders for the first time.',
    features: [
      'Unlimited Public Tender Browsing',
      'Basic AI Sector & Keyword Matching',
      'DPIIT & MSME Statutory Exemption Checker',
      'Tender Search & Filtering',
      'Access to GovStart Learning Academy'
    ],
    limitations: [
      'Max 3 AI Document PDF Deep-Scans / mo',
      'No Real-time WhatsApp/SMS Deadlines',
      'Single User Seat'
    ],
    ctaText: 'Get Started Free'
  },
  {
    id: 'pro',
    name: 'Growth Pro',
    badge: 'MOST POPULAR',
    priceInrPerMonth: 2999,
    billingCycle: 'MONTHLY',
    targetAudience: 'Active startups and MSMEs bidding on 2-5 tenders every quarter.',
    features: [
      'Everything in Starter Discovery',
      'Unlimited AI PDF Requirement Extraction',
      'Explainable Deterministic Match Matrix',
      'Clause Contradiction & Risk Detection',
      'AI Proposal Drafting & Clause Matrix Studio',
      'Multi-Tender Side-by-Side Comparison',
      'Daily Email & Alert Digest'
    ],
    limitations: [
      'Limited to 2 Team Members',
      'Single Organization Profile'
    ],
    ctaText: 'Upgrade to Pro'
  },
  {
    id: 'team',
    name: 'Consultant & Team',
    badge: 'FOR ADVISORS',
    priceInrPerMonth: 7999,
    billingCycle: 'MONTHLY',
    targetAudience: 'Procurement consultants, consortium leaders, and established suppliers.',
    features: [
      'Everything in Growth Pro',
      'Multi-Client Profile Switcher (up to 10 clients)',
      'Shared Workspace & Team Task Assignments',
      'Exportable Executive Preparation Reports',
      'Priority Procurement Clarification Assistant',
      '5 Active Team Seats Included',
      'Dedicated Onboarding Consultation'
    ],
    limitations: [
      'Standard Portal Rate Limits Apply'
    ],
    ctaText: 'Start Consultant Trial'
  },
  {
    id: 'enterprise',
    name: 'Enterprise & PSU Mission',
    priceInrPerMonth: 24999,
    billingCycle: 'ANNUAL',
    targetAudience: 'Corporations, state startup missions, incubators, and procurement cells.',
    features: [
      'Unlimited Organization & Client Profiles',
      'Direct GeM & eProc API Webhooks',
      'Custom LLM Fine-Tuning on Historical Bids',
      'Strict On-Premise / Private VPC Deployments',
      'Dedicated Procurement Legal & Compliance Advisor',
      'SLA Guaranteed Response Times',
      'Full Audit Logging & RBAC Security'
    ],
    limitations: [],
    ctaText: 'Contact Enterprise Team'
  }
];
