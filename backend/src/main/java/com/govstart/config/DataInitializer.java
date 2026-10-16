package com.govstart.config;

import com.govstart.entity.*;
import com.govstart.repository.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataInitializer.class);

    private final DepartmentRepository departmentRepository;
    private final TenderCategoryRepository categoryRepository;
    private final UserRepository userRepository;
    private final StartupProfileRepository startupProfileRepository;
    private final TenderRepository tenderRepository;
    private final TenderMatchRepository tenderMatchRepository;
    private final ApplicationRepository applicationRepository;
    private final SavedTenderRepository savedTenderRepository;
    private final NotificationRepository notificationRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(DepartmentRepository departmentRepository,
                           TenderCategoryRepository categoryRepository,
                           UserRepository userRepository,
                           StartupProfileRepository startupProfileRepository,
                           TenderRepository tenderRepository,
                           TenderMatchRepository tenderMatchRepository,
                           ApplicationRepository applicationRepository,
                           SavedTenderRepository savedTenderRepository,
                           NotificationRepository notificationRepository,
                           PasswordEncoder passwordEncoder) {
        this.departmentRepository = departmentRepository;
        this.categoryRepository = categoryRepository;
        this.userRepository = userRepository;
        this.startupProfileRepository = startupProfileRepository;
        this.tenderRepository = tenderRepository;
        this.tenderMatchRepository = tenderMatchRepository;
        this.applicationRepository = applicationRepository;
        this.savedTenderRepository = savedTenderRepository;
        this.notificationRepository = notificationRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    @Transactional
    public void run(String... args) {
        if (departmentRepository.count() > 0 && tenderRepository.count() > 0) {
            log.info("Database already contains data ({} tenders found). Skipping initialization.", tenderRepository.count());
            return;
        }

        log.info("Starting GovStart AI Database Initialization...");

        // 1. Departments
        Department drdo = saveDept("Defence Research and Development Organisation (DRDO)", "DRDO-DEF", "Ministry of Defence", "tenders@drdo.gov.in");
        Department nhm = saveDept("National Health Mission (NHM)", "NHM-HLTH", "Ministry of Health & Family Welfare", "nhm-procure@nic.in");
        Department nic = saveDept("National Informatics Centre (NIC)", "NIC-MEITY", "Ministry of Electronics and Information Technology", "tenders@nic.in");
        Department seci = saveDept("Solar Energy Corporation of India (SECI)", "SECI-MNRE", "Ministry of New and Renewable Energy", "procurement@seci.co.in");
        Department icar = saveDept("Indian Council of Agricultural Research (ICAR)", "ICAR-AGRI", "Ministry of Agriculture and Farmers Welfare", "tenders@icar.org.in");
        Department scm = saveDept("Smart Cities Mission India", "SCM-MOHUA", "Ministry of Housing and Urban Affairs", "smartcities@gov.in");
        Department cris = saveDept("Centre for Railway Information Systems (CRIS)", "CRIS-RLY", "Ministry of Railways", "procure@cris.org.in");
        Department neat = saveDept("National Educational Alliance for Technology (NEAT)", "NEAT-EDU", "Ministry of Education", "neat@aicte-india.org");

        // 2. Categories
        TenderCategory catAi = saveCat("Software & Artificial Intelligence", "software-ai", "Machine learning, computer vision, natural language processing, cloud automation");
        TenderCategory catHealth = saveCat("Medical Devices & HealthTech", "healthtech", "Diagnostic equipment, tele-health, medical sensors, IoT hospital devices");
        TenderCategory catEnergy = saveCat("Renewable Energy & Cleantech", "cleantech", "Solar, wind, battery energy storage, microgrid control, decarbonization");
        TenderCategory catCyber = saveCat("Cyber Defense & Security", "cyber-security", "Zero trust architecture, endpoint detection, threat intelligence, encryption");
        TenderCategory catIot = saveCat("Smart City & IoT", "smart-city-iot", "Traffic management, environmental sensing, smart utility grids, urban analytics");
        TenderCategory catDrones = saveCat("AgriTech & Drone Robotics", "agritech-drones", "Precision agriculture, multispectral drone mapping, crop analytics, IoT irrigation");
        TenderCategory catRobotics = saveCat("Robotics & Automation", "robotics-automation", "Autonomous rovers, industrial sorting robotics, hazardous inspection drones");
        TenderCategory catEdtech = saveCat("EdTech & Digital Learning", "edtech", "Adaptive learning systems, vernacular e-learning platforms, assessment analytics");

        // 3. Users
        String encPass = passwordEncoder.encode("Password@123");

        User admin = saveUser("admin@govstart.demo", encPass, "Platform Administrator", Role.ADMIN, "+91 98100 11001");
        User officer1 = saveUser("officer.defence@govstart.demo", encPass, "Col. Rajesh Sharma", Role.OFFICER, "+91 98100 22002");
        User officer2 = saveUser("officer.tech@govstart.demo", encPass, "Dr. Priya Varma", Role.OFFICER, "+91 98100 33003");

        User uAerotech = saveUser("startup.aerotech@govstart.demo", encPass, "Vikram Malhotra", Role.STARTUP, "+91 98100 44004");
        User uMedpulse = saveUser("startup.medpulse@govstart.demo", encPass, "Dr. Anita Desai", Role.STARTUP, "+91 98100 55005");
        User uGreengrid = saveUser("startup.greengrid@govstart.demo", encPass, "Karthik Raman", Role.STARTUP, "+91 98100 66006");
        User uKisanagri = saveUser("startup.kisanagri@govstart.demo", encPass, "Sunita Patil", Role.STARTUP, "+91 98100 77007");
        User uCybershield = saveUser("startup.cybershield@govstart.demo", encPass, "Arun Singhania", Role.STARTUP, "+91 98100 88008");

        // 4. Startup Profiles
        StartupProfile pAerotech = saveProfile(uAerotech, "AeroTech Defence Labs Pvt Ltd", "U72900KA2021PTC145001", true, "DIPP98214",
                "Defence & Aerospace", "GROWTH", 2021, 24, new BigDecimal("45000000.00"), "Karnataka", "Bengaluru",
                "https://aerotechdefence.demo", "Specializing in autonomous high-altitude UAV systems, edge AI computer vision, and rugged tactical drone hardware.",
                "[\"Edge AI\", \"Computer Vision\", \"UAV Hardware\", \"Tactical Robotics\", \"Embedded Linux\", \"C++\", \"ROS2\"]",
                "[\"ISO 9001:2015\", \"AS9100D Aerospace\", \"CEMILAC Approved Design\"]",
                "Delivered 12 tactical perimeter surveillance units to Border Security forces in 2023 under pilot evaluation.", "VERIFIED", 95);

        StartupProfile pMedpulse = saveProfile(uMedpulse, "MedPulse HealthTech Solutions", "U85100MH2020PTC334102", true, "DIPP87231",
                "Healthcare & Life Sciences", "GROWTH", 2020, 18, new BigDecimal("28000000.00"), "Maharashtra", "Pune",
                "https://medpulse.demo", "Pioneering portable point-of-care vital diagnostic kiosks and cloud-connected remote health monitoring kits for rural PHCs.",
                "[\"Medical Device Hardware\", \"IoT Telemetry\", \"HIPAA/EHR Integration\", \"Embedded C\", \"Python\", \"React Native\"]",
                "[\"CDSCO Class B Approved\", \"ISO 13485:2016\", \"CE Mark\"]",
                "Deployed 85 telemedicine booths across 3 district hospitals in Maharashtra under CSR initiatives.", "VERIFIED", 90);

        StartupProfile pGreengrid = saveProfile(uGreengrid, "GreenGrid Energy Systems", "U40100DL2022PTC412003", true, "DIPP11452",
                "Renewable Energy & Cleantech", "EARLY", 2022, 12, new BigDecimal("15000000.00"), "Delhi", "New Delhi",
                "https://greengrid.demo", "AI-driven microgrid orchestration, distributed energy storage systems, and solar power predictive dispatch controllers.",
                "[\"Power Electronics\", \"Microgrid Optimization\", \"Time Series Forecasting\", \"Python\", \"MQTT\", \"SCADA Integration\"]",
                "[\"ISO 14001:2015\", \"BIS Certified Inverter Controller\"]",
                "Piloted 4 community solar microgrid controllers in Ladakh and Himachal Pradesh.", "VERIFIED", 85);

        StartupProfile pKisanagri = saveProfile(uKisanagri, "KisanAgri AI & Drone Robotics", "U01100GJ2021PTC215004", true, "DIPP93450",
                "AgriTech & Rural Tech", "GROWTH", 2021, 15, new BigDecimal("22000000.00"), "Gujarat", "Ahmedabad",
                "https://kisanagri.demo", "Autonomous multispectral drone imagery for early crop disease detection, soil moisture mapping, and variable rate spray guidance.",
                "[\"Multispectral Imaging\", \"GIS & Remote Sensing\", \"Autonomous Flight Control\", \"Deep Learning\", \"TensorFlow\"]",
                "[\"DGCA Type Certified Drone\", \"ISO 9001:2015\"]",
                "Mapped over 50,000 hectares for State Seed Corporation crop insurance yield estimation.", "VERIFIED", 88);

        StartupProfile pCybershield = saveProfile(uCybershield, "CyberShield DefTech Innovations", "U72200HR2022PTC518005", true, "DIPP10842",
                "Cyber Security & Defence", "EARLY", 2022, 14, new BigDecimal("18500000.00"), "Haryana", "Gurugram",
                "https://cybershield.demo", "Next-generation zero-trust network access, AI automated threat hunting, and sovereign Linux kernel security hardening.",
                "[\"Zero Trust Network Access\", \"Kernel eBPF\", \"Network Intrusion Detection\", \"Rust\", \"Go\", \"Kubernetes Security\"]",
                "[\"CERT-In Empanelled Partner Ready\", \"ISO 27001:2022\"]",
                "Completed red team vulnerability assessments for 2 municipal smart city command centres.", "VERIFIED", 82);

        // 5. Tenders
        Tender t1 = saveTender("DRDO/2026/AI-SURV-001", "AI-Powered Threat Detection & Edge Surveillance System",
                "Procurement of ruggedized edge computing devices running deep learning neural networks for perimeter threat detection, vehicle license plate recognition, and intruder tracking in harsh environmental conditions (-20°C to +55°C).",
                drdo, catAi, new BigDecimal("45000000.00"), LocalDate.of(2026, 9, 1), LocalDateTime.of(2026, 11, 30, 17, 0),
                "Startups registered with DPIIT. Minimum 1 year operational experience in edge AI / computer vision. Team must have demonstrated prior defense or security prototype testing. Turn-over exemption granted for recognized startups.",
                "Edge AI, Computer Vision, ROS2, Embedded Linux, Tactical Robotics, C++",
                "DPIIT Recognition Certificate, Incorporation Certificate, Technical Architecture Proposal, CEMILAC/MIL-STD test certificates, Past Performance Testimonials",
                "Technical Feasibility (40%), Rugged Hardware Readiness (25%), Security Compliance (20%), Commercial Pricing (15%)",
                TenderStatus.PUBLISHED, "https://drdo.gov.in/tenders/2026/ai-surv", officer1);

        Tender t2 = saveTender("NHM/2026/TELE-MED-042", "Telemedicine Diagnostic Kiosks & Rural Health Telemetry",
                "Establishment of 150 solar-assisted rural health kiosks equipped with rapid diagnostic sensors (ECG, SpO2, NIBP, Blood Glucose, Hemoglobin) and automated video consultation uplink with district specialists.",
                nhm, catHealth, new BigDecimal("82000000.00"), LocalDate.of(2026, 9, 10), LocalDateTime.of(2026, 11, 20, 18, 0),
                "Medical device manufacturer or integrated healthtech startup with CDSCO Class B certification or equivalent. DPIIT registered startups eligible. Proven EHR/FHIR standard compliance mandatory.",
                "Medical Device Hardware, IoT Telemetry, HIPAA/EHR Integration, Embedded C, Cloud Backend, React Native",
                "CDSCO License, ISO 13485 Certificate, Product Datasheet, 3-year Comprehensive Maintenance Plan, Startup Registration Proof",
                "Clinical Accuracy & Sensor Integration (35%), Ease of Field Maintenance (25%), Rural Offline Capability (20%), Total Project Cost (20%)",
                TenderStatus.PUBLISHED, "https://nhm.gov.in/tenders/tele-med-kiosks", officer2);

        Tender t3 = saveTender("SECI/2026/MICROGRID-088", "Smart Solar Microgrid Energy Management & Storage Controller",
                "Supply, deployment and 5-year cloud management of intelligent energy dispatch controllers for 40 islanded solar-battery microgrids located in remote off-grid Himalayan regions.",
                seci, catEnergy, new BigDecimal("120000000.00"), LocalDate.of(2026, 8, 15), LocalDateTime.of(2026, 12, 15, 15, 0),
                "DPIIT recognized cleantech / energy startup. Minimum past prototype testing with battery storage over 100 kWh. BIS/IEC standard conformity for power electronic interfaces required.",
                "Power Electronics, Microgrid Optimization, Time Series Forecasting, SCADA Integration, MQTT, Python",
                "BIS/IEC Test Reports, Detailed Mathematical Optimization Model, Safety Dossier, Financial Solvency Certificate",
                "Algorithm Efficiency & Peak Shaving (35%), Hardware Ruggedness (25%), Past Microgrid Deployments (20%), Financial Proposal (20%)",
                TenderStatus.PUBLISHED, "https://seci.co.in/tenders/microgrid-control", officer2);

        Tender t4 = saveTender("ICAR/2026/DRONE-AGRI-103", "Autonomous Drone-Based Crop Health & Soil Moisture Mapping",
                "Comprehensive aerial remote sensing services covering 100,000 hectares of kharif crops across 4 agro-climatic zones using multispectral payloads to assess NDVI, NDRE, and surface moisture levels.",
                icar, catDrones, new BigDecimal("38000000.00"), LocalDate.of(2026, 9, 5), LocalDateTime.of(2026, 11, 15, 16, 30),
                "DGCA Type Certified Drone models only. Remote Pilot Training Organization (RPTO) certified pilots. Startup must possess automated cloud data processing pipeline for GIS ortomosaic delivery within 48 hours.",
                "Multispectral Imaging, GIS & Remote Sensing, Autonomous Flight Control, Deep Learning, Drone Hardware",
                "DGCA Type Certification, Pilot Licenses, Data Security & Sovereignty Compliance Declaration, Sample Orthomosaic Dataset",
                "Spatial Resolution & Spectral Accuracy (40%), Turnaround Processing Time (25%), Fleet Scale & Readiness (20%), Commercial Rate per Hectare (15%)",
                TenderStatus.PUBLISHED, "https://icar.org.in/tenders/crop-health-drone", officer2);

        Tender t5 = saveTender("SCM/2026/TRAFFIC-AI-019", "Urban Traffic Flow Optimization via Real-time Computer Vision",
                "Implementation of an edge-camera AI video analytics system across 120 major traffic intersections to automatically calibrate green signal durations and detect emergency vehicle corridors.",
                scm, catIot, new BigDecimal("65000000.00"), LocalDate.of(2026, 9, 15), LocalDateTime.of(2026, 12, 5, 17, 0),
                "Startups or SMEs with production-grade vehicle detection models achieving >95% accuracy in rainy and night-time lighting conditions. ONVIF video stream compatibility required.",
                "Computer Vision, Edge AI, Urban Traffic Modeling, Deep Learning, RTSP/ONVIF Streaming, Python, C++",
                "Live Video Benchmarking Report, System Architecture Document, Server Scalability Blueprint, Audited Balance Sheets or DPIIT Certificate",
                "Detection Precision Under Adverse Conditions (40%), Low Latency Signal Adaptation (30%), Central Command Integration (15%), Financial Quote (15%)",
                TenderStatus.PUBLISHED, "https://smartcities.gov.in/tenders/ai-traffic", officer2);

        Tender t6 = saveTender("CRIS/2026/RAIL-IOT-055", "Railway Track Fault Detection & Predictive Maintenance IoT",
                "Development of locomotive-mounted optical and accelerometer sensor pods for real-time detection of rail hairline cracks, ballast degradation, and joint misalignment at speeds up to 130 km/h.",
                cris, catAi, new BigDecimal("145000000.00"), LocalDate.of(2026, 8, 20), LocalDateTime.of(2026, 12, 10, 14, 0),
                "Indian deep-tech hardware startups or R&D firms. Must have completed bench-scale vibration or optical anomaly detection. IP must be resident in India.",
                "IoT Telemetry, Vibration Analysis, Edge AI, High-Speed Optical Inspection, Embedded C++, Cloud Telemetry",
                "Patent/IP Filing Proof, RDSO Test Protocol Compliance Plan, Manufacturing Capacity Audit, Technical Methodology Paper",
                "Measurement Accuracy at High Speed (40%), RDSO Compliance Feasibility (25%), Rugged Enclosure IP67 Rating (20%), Overall Cost (15%)",
                TenderStatus.PUBLISHED, "https://cris.org.in/tenders/track-fault-iot", officer1);

        Tender t7 = saveTender("MEITY/2026/CYBER-ZTNA-012", "Next-Gen Zero-Trust Endpoint Protection for Government Cloud",
                "Deployment of kernel-level telemetry agents and identity-aware micro-segmentation for 25,000 government employee workstations accessing confidential e-governance applications.",
                nic, catCyber, new BigDecimal("50000000.00"), LocalDate.of(2026, 9, 12), LocalDateTime.of(2026, 11, 25, 17, 0),
                "Indian cybersecurity companies with 100% indigenous source code (no foreign white-labeling). Startup exemption applies for prior turnover. Must satisfy CERT-In security baseline.",
                "Zero Trust Network Access, Kernel eBPF, Network Intrusion Detection, Rust, Go, Kubernetes Security",
                "Source Code Sovereignty Affidavit, CERT-In Audit Report, Threat Emulation Test Results, Support SLA Matrix",
                "Detection Efficacy & MITRE ATT&CK Coverage (40%), Low Endpoint Resource Footprint (25%), Architecture Simplicity (20%), Price per Seat (15%)",
                TenderStatus.PUBLISHED, "https://meity.gov.in/tenders/ztna-cloud", officer2);

        Tender t8 = saveTender("NEAT/2026/EDTECH-VERN-077", "Adaptive Multilingual Learning Platform for Rural Schools",
                "Cloud-hosted AI adaptive learning and automated voice assessment engine in 10 regional Indian languages for foundational literacy and numeracy across 5,000 rural government schools.",
                neat, catEdtech, new BigDecimal("27500000.00"), LocalDate.of(2026, 9, 18), LocalDateTime.of(2026, 11, 28, 17, 0),
                "EdTech startups with working speech-to-text and automatic reading evaluation models in at least 5 Indian vernacular languages. DPIIT recognized startups preferred.",
                "Natural Language Processing, Speech-to-Text, Indic LLMs, Adaptive Assessment, Web & Mobile Development",
                "Content Pedagogy Alignment Report, Vernacular ASR Accuracy Benchmark, Data Privacy & Child Safety Policy, DPIIT Proof",
                "ASR Acoustic Accuracy in Regional Dialects (40%), Gamified Student Engagement (25%), Offline Caching Resilience (20%), Cost per Student (15%)",
                TenderStatus.PUBLISHED, "https://neat.aicte-india.org/tenders/vernacular-edtech", officer2);

        Tender t9 = saveTender("MOHUA/2026/ROBOT-WASTE-031", "Robotic Waste Segregation & Processing for Municipalities",
                "Automated robotic picking cells with hyperspectral imaging and pneumatic actuators capable of sorting 10 tons of mixed municipal solid waste per day into recyclable fractions.",
                scm, catRobotics, new BigDecimal("42000000.00"), LocalDate.of(2026, 8, 1), LocalDateTime.of(2026, 11, 18, 15, 0),
                "Robotics hardware startups with demonstrated robotic sorting arms. Must guarantee >90% purity of separated PET, HDPE, and cardboard.",
                "Robotics & Automation, Hyperspectral Imaging, Computer Vision, PLC Control, Mechanical Design, Python",
                "Factory Acceptance Test Records, Throughput Validation Video Evidence, Safety Interlock Certifications, Warranty Terms",
                "Sorting Accuracy & Throughput Rate (45%), System Uptime Guarantee (25%), Maintenance Cost (15%), Capital Outlay (15%)",
                TenderStatus.PUBLISHED, "https://mohua.gov.in/tenders/robotic-waste", officer2);

        Tender t10 = saveTender("ICAR/2026/BLOCK-AGRI-064", "Blockchain-Based Agri-Supply Chain & Minimum Support Verification",
                "Development and rollout of an immutable distributed ledger for direct-to-farmer procurement tracking, grain quality grading certificates, and smart contract escrow payments.",
                icar, catAi, new BigDecimal("31000000.00"), LocalDate.of(2026, 9, 22), LocalDateTime.of(2026, 12, 20, 18, 0),
                "Blockchain startups with experience building permissioned Hyperledger or EVM architectures with high transaction throughput and low latency mobile verification.",
                "Blockchain & Distributed Ledger, Smart Contracts, Cryptography, REST APIs, Mobile App, Java / Solidity",
                "Smart Contract Formal Verification Audit, Architecture Design Doc, Cloud Scalability Simulation, DPIIT Certificate",
                "Security & Cryptographic Audit Rating (40%), Ease of Use for Mandi Operators (25%), Latency & Transaction Scalability (20%), Total Project Fee (15%)",
                TenderStatus.PUBLISHED, "https://icar.org.in/tenders/agri-blockchain", officer2);

        Tender t11 = saveTender("NHM/2026/DIALYSIS-PORT-099", "Portable Dialysis Unit for Tier-3 Community Health Centers",
                "Design, clinical validation, and supply of 80 ultra-compact, low water consumption peritoneal and hemodialysis machines suited for rural clinics with intermittent power.",
                nhm, catHealth, new BigDecimal("98000000.00"), LocalDate.of(2026, 7, 10), LocalDateTime.of(2026, 11, 22, 17, 0),
                "Medical device OEM or registered startup with ISO 13485 certification and CDSCO manufacturing license. Must include in-built battery backup for 4 hours.",
                "Medical Device Hardware, Fluid Dynamics, Embedded Electronics, Clinical Safety, Battery Management System",
                "CDSCO License, ISO 13485 Audit Report, Clinical Trial Data, Battery Testing Laboratory Certificate",
                "Clinical Efficacy & Water Recovery Rate (40%), Battery Backup & Ruggedness (25%), Consumables Cost (20%), Unit Capital Cost (15%)",
                TenderStatus.PUBLISHED, "https://nhm.gov.in/tenders/portable-dialysis", officer2);

        Tender t12 = saveTender("DRDO/2026/HIGH-DRONE-015", "High-Altitude Autonomous Drone Payload Delivery System",
                "Procurement of 10 autonomous logistics UAV systems capable of lifting 30 kg payloads at operating altitudes above 16,000 feet in extreme sub-zero weather conditions.",
                drdo, catRobotics, new BigDecimal("160000000.00"), LocalDate.of(2026, 9, 2), LocalDateTime.of(2026, 12, 28, 17, 0),
                "Indigenous aerospace startups with high-altitude flight telemetry logs above 14,000 feet. Foreign equity must not exceed 49%. Full IP rights must reside in India.",
                "UAV Hardware, High-Altitude Aerodynamics, Autonomous Flight Control, Battery Heating Systems, Embedded Linux",
                "Flight Telemetry Log Records, DGCA Flight Clearance, Indigenous Content Certificate, Balance Sheet & Turnover Statement",
                "Service Ceiling & Payload Capability (45%), Autonomous Failsafe Systems (25%), Maintenance Simplicity in High Altitude (15%), Total Tender Cost (15%)",
                TenderStatus.PUBLISHED, "https://drdo.gov.in/tenders/high-altitude-uav", officer1);

        // 6. Pre-calculated Matches
        saveMatch(pAerotech, t1, new BigDecimal("94.5"), "[\"Edge AI\", \"Computer Vision\", \"ROS2\", \"Embedded Linux\", \"Tactical Robotics\"]",
                "[\"MIL-STD-810H Chamber Third-Party Lab Certificate\"]",
                "AeroTech demonstrates an exceptional 94.5% match with DRDO AI Edge Surveillance tender. Sector alignment is 100%, and 5 out of 6 required technical competencies are fully documented in verified company profile.", "HIGHLY_RELEVANT");

        saveMatch(pAerotech, t12, new BigDecimal("91.0"), "[\"UAV Hardware\", \"Embedded Linux\", \"Autonomous Flight Control\"]",
                "[\"High-Altitude Test Chamber Telemetry Above 16,000 ft\"]",
                "Strong alignment in autonomous UAV platforms. Startup has delivered low-altitude surveillance pods; needs altitude chamber telemetry validation.", "HIGHLY_RELEVANT");

        saveMatch(pMedpulse, t2, new BigDecimal("96.0"), "[\"Medical Device Hardware\", \"IoT Telemetry\", \"HIPAA/EHR Integration\", \"Embedded C\"]",
                "[\"Cold-Chain Reagent Logistics Partner SLA\"]",
                "Outstanding match for Rural Health Kiosk. Startup possesses verified CDSCO Class B certification, ISO 13485 quality systems, and prior deployment of 85 units.", "HIGHLY_RELEVANT");

        saveMatch(pGreengrid, t3, new BigDecimal("89.0"), "[\"Power Electronics\", \"Microgrid Optimization\", \"Time Series Forecasting\", \"SCADA Integration\"]",
                "[\"100 kWh Field Battery Warranty Certificate\"]",
                "High technical match for Himalayan microgrid management. Past deployments in Ladakh give strong geographical domain evidence.", "HIGHLY_RELEVANT");

        saveMatch(pKisanagri, t4, new BigDecimal("95.0"), "[\"Multispectral Imaging\", \"GIS & Remote Sensing\", \"Autonomous Flight Control\", \"Deep Learning\"]",
                "[\"Additional 5 Drone Pilot RPTO License Copies\"]",
                "Near-perfect match for ICAR agricultural drone mapping tender. Verified DGCA Type Certificate and extensive 50k hectare past experience.", "HIGHLY_RELEVANT");

        // 7. Saved Tenders
        savedTenderRepository.save(new SavedTender(uAerotech, t1));
        savedTenderRepository.save(new SavedTender(uAerotech, t12));
        savedTenderRepository.save(new SavedTender(uMedpulse, t2));
        savedTenderRepository.save(new SavedTender(uGreengrid, t3));

        // 8. Notifications
        notificationRepository.save(new Notification(uAerotech, "New Matching Tender Alert", "DRDO has released a high-match tender (94.5%): AI-Powered Threat Detection & Edge Surveillance System.", NotificationType.TENDER_UPDATE, "/#matrix"));
        notificationRepository.save(new Notification(uAerotech, "Application Under Review", "Your application APP-2026-001-AER is now under technical evaluation by Col. Rajesh Sharma.", NotificationType.APPLICATION_STATUS, "/#applications"));
        notificationRepository.save(new Notification(uMedpulse, "Clarification Requested by Officer", "Dr. Priya Varma has requested clarification on battery cycle life for tender NHM/2026/TELE-MED-042.", NotificationType.CLARIFICATION, "/#applications"));

        log.info("GovStart AI Database Initialization Completed Successfully! 12 Tenders, 8 Departments, 5 Startups seeded.");
    }

    private Department saveDept(String name, String code, String ministry, String email) {
        Department d = new Department();
        d.setName(name);
        d.setCode(code);
        d.setMinistry(ministry);
        d.setContactEmail(email);
        d.setIsActive(true);
        return departmentRepository.save(d);
    }

    private TenderCategory saveCat(String name, String slug, String desc) {
        TenderCategory c = new TenderCategory();
        c.setName(name);
        c.setSlug(slug);
        c.setDescription(desc);
        return categoryRepository.save(c);
    }

    private User saveUser(String email, String pass, String name, Role role, String phone) {
        User u = new User();
        u.setEmail(email);
        u.setPasswordHash(pass);
        u.setFullName(name);
        u.setRole(role);
        u.setPhone(phone);
        u.setStatus(UserStatus.ACTIVE);
        return userRepository.save(u);
    }

    private StartupProfile saveProfile(User user, String companyName, String regNo, boolean dpiit, String dpiitNo,
                                       String sector, String stage, int founded, int team, BigDecimal turnover,
                                       String state, String city, String web, String desc, String skills,
                                       String certs, String exp, String status, int completeness) {
        StartupProfile p = new StartupProfile();
        p.setUser(user);
        p.setCompanyName(companyName);
        p.setRegistrationNumber(regNo);
        p.setDpiitRecognized(dpiit);
        p.setDpiitNumber(dpiitNo);
        p.setSector(sector);
        p.setStage(stage);
        p.setFoundedYear(founded);
        p.setTeamSize(team);
        p.setAnnualTurnover(turnover);
        p.setLocationState(state);
        p.setLocationCity(city);
        p.setWebsite(web);
        p.setDescription(desc);
        p.setPrimarySkills(skills);
        p.setCertifications(certs);
        p.setPastExperience(exp);
        p.setVerifiedStatus(status);
        p.setProfileCompletenessPct(completeness);
        return startupProfileRepository.save(p);
    }

    private Tender saveTender(String ref, String title, String desc, Department dept, TenderCategory cat,
                              BigDecimal budget, LocalDate pubDate, LocalDateTime deadline, String elig,
                              String skills, String docs, String eval, TenderStatus status, String url, User officer) {
        Tender t = new Tender();
        t.setReferenceNumber(ref);
        t.setTitle(title);
        t.setDescription(desc);
        t.setDepartment(dept);
        t.setCategory(cat);
        t.setBudgetInr(budget);
        t.setPublicationDate(pubDate);
        t.setDeadline(deadline);
        t.setEligibilityCriteria(elig);
        t.setRequiredSkills(skills);
        t.setRequiredDocuments(docs);
        t.setEvaluationCriteria(eval);
        t.setStatus(status);
        t.setSourceUrl(url);
        t.setCreatedByOfficer(officer);
        t.setIsDemo(true);
        return tenderRepository.save(t);
    }

    private void saveMatch(StartupProfile s, Tender t, BigDecimal score, String matched, String missing, String explanation, String status) {
        TenderMatch m = new TenderMatch();
        m.setStartup(s);
        m.setTender(t);
        m.setRelevanceScore(score);
        m.setMatchedSkills(matched);
        m.setMissingRequirements(missing);
        m.setExplanation(explanation);
        m.setPreliminaryStatus(status);
        m.setCalculatedAt(LocalDateTime.now());
        tenderMatchRepository.save(m);
    }
}
