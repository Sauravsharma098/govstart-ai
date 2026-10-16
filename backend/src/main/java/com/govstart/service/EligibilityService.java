package com.govstart.service;

import com.govstart.dto.EligibilityResponseDto;
import com.govstart.entity.*;
import com.govstart.exception.ResourceNotFoundException;
import com.govstart.repository.EligibilityCheckRepository;
import com.govstart.repository.StartupProfileRepository;
import com.govstart.repository.TenderRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.*;

@Service
public class EligibilityService {

    private final StartupProfileRepository startupProfileRepository;
    private final TenderRepository tenderRepository;
    private final EligibilityCheckRepository eligibilityCheckRepository;

    public EligibilityService(StartupProfileRepository startupProfileRepository,
                              TenderRepository tenderRepository,
                              EligibilityCheckRepository eligibilityCheckRepository) {
        this.startupProfileRepository = startupProfileRepository;
        this.tenderRepository = tenderRepository;
        this.eligibilityCheckRepository = eligibilityCheckRepository;
    }

    @Transactional
    public EligibilityResponseDto checkEligibility(Long startupId, Long tenderId) {
        StartupProfile startup = startupProfileRepository.findById(startupId)
                .orElseThrow(() -> new ResourceNotFoundException("Startup profile not found with id: " + startupId));
        Tender tender = tenderRepository.findById(tenderId)
                .orElseThrow(() -> new ResourceNotFoundException("Tender not found with id: " + tenderId));

        boolean isDpiit = Boolean.TRUE.equals(startup.getDpiitRecognized());
        BigDecimal turnover = startup.getAnnualTurnover() != null ? startup.getAnnualTurnover() : BigDecimal.ZERO;
        BigDecimal budget = tender.getBudgetInr() != null ? tender.getBudgetInr() : BigDecimal.ZERO;
        BigDecimal minTurnoverReq = budget.multiply(BigDecimal.valueOf(0.20));

        List<Map<String, Object>> items = new ArrayList<>();

        // 1. DPIIT Startup Recognition & Prior Turnover Exemption
        Map<String, Object> c1 = new HashMap<>();
        c1.put("criterion", "DPIIT Startup Recognition");
        c1.put("status", isDpiit ? "MET" : "NOT_MET");
        c1.put("reason", isDpiit ? "Verified DPIIT registration (" + startup.getDpiitNumber() + "). Entitled to exemption on prior experience & turnover." : "No DPIIT number on file. Standard commercial thresholds apply.");
        c1.put("required_evidence", "DPIIT Certificate of Recognition issued by DPIIT, Ministry of Commerce & Industry");
        c1.put("is_verified", isDpiit);
        items.add(c1);

        // 2. Financial Capacity / Turnover Requirement
        Map<String, Object> c2 = new HashMap<>();
        c2.put("criterion", "Annual Turnover / Financial Solvency");
        if (isDpiit) {
            c2.put("status", "MET");
            c2.put("reason", "Relaxation applied pursuant to Public Procurement Policy for Startups (Order No. F.20/2/2014-PPD).");
            c2.put("required_evidence", "DPIIT Certificate and Startup Exemption Affidavit");
            c2.put("is_verified", true);
        } else if (turnover.compareTo(minTurnoverReq) >= 0) {
            c2.put("status", "MET");
            c2.put("reason", "Reported annual turnover (INR " + turnover.toPlainString() + ") satisfies minimum 20% tender threshold (INR " + minTurnoverReq.toPlainString() + ").");
            c2.put("required_evidence", "CA Audited Financial Statements for last 3 financial years");
            c2.put("is_verified", "VERIFIED".equalsIgnoreCase(startup.getVerifiedStatus()));
        } else {
            c2.put("status", "NOT_MET");
            c2.put("reason", "Reported turnover is lower than the mandatory 20% threshold.");
            c2.put("required_evidence", "Audited Balance Sheets or Joint Venture Consortium Agreement");
            c2.put("is_verified", false);
        }
        items.add(c2);

        // 3. Entity Incorporation & Standing
        Map<String, Object> c3 = new HashMap<>();
        c3.put("criterion", "Entity Incorporation & Domestic Origin");
        int founded = startup.getFoundedYear() != null ? startup.getFoundedYear() : 2024;
        c3.put("status", (2026 - founded >= 1) ? "MET" : "UNKNOWN");
        c3.put("reason", "Entity registered in " + startup.getLocationState() + " with active CIN/Registration Number: " + startup.getRegistrationNumber());
        c3.put("required_evidence", "MCA Certificate of Incorporation & PAN/GST Registration");
        c3.put("is_verified", true);
        items.add(c3);

        // 4. Past Performance & Domain Experience
        Map<String, Object> c4 = new HashMap<>();
        c4.put("criterion", "Relevant Domain Prototype & Technical Evidence");
        boolean hasPast = startup.getPastExperience() != null && startup.getPastExperience().length() > 20;
        c4.put("status", hasPast ? "MET" : "UNKNOWN");
        c4.put("reason", hasPast ? "Documented past deliveries: " + startup.getPastExperience() : "Profile does not specify past project experience.");
        c4.put("required_evidence", "Client Completion Certificate / Work Orders / Technical Prototype Report");
        c4.put("is_verified", "VERIFIED".equalsIgnoreCase(startup.getVerifiedStatus()));
        items.add(c4);

        // Overall status calculation
        String overall = "MET";
        int metCount = 0;
        for (Map<String, Object> item : items) {
            String s = (String) item.get("status");
            if ("MET".equals(s)) metCount++;
            if ("NOT_MET".equals(s)) overall = "NOT_MET";
        }
        if (!"NOT_MET".equals(overall) && metCount < items.size()) {
            overall = "UNKNOWN";
        }

        String summary = "Preliminary assessment: " + metCount + " of " + items.size() + " criteria satisfied. Status: " + overall + ".";

        // Persist check record
        EligibilityCheck check = new EligibilityCheck();
        check.setStartup(startup);
        check.setTender(tender);
        check.setOverallStatus(overall);
        check.setSummary(summary);
        check.setCheckedAt(LocalDateTime.now());

        for (Map<String, Object> it : items) {
            EligibilityCheckItem checkItem = new EligibilityCheckItem();
            checkItem.setEligibilityCheck(check);
            checkItem.setCriterionName((String) it.get("criterion"));
            checkItem.setStatus((String) it.get("status"));
            checkItem.setExplanation((String) it.get("reason"));
            checkItem.setRequiredEvidence((String) it.get("required_evidence"));
            checkItem.setIsVerified((Boolean) it.get("is_verified"));
            check.getItems().add(checkItem);
        }
        eligibilityCheckRepository.save(check);

        EligibilityResponseDto dto = new EligibilityResponseDto();
        dto.setTenderId(tenderId);
        dto.setStartupId(startupId);
        dto.setOverallStatus(overall);
        dto.setMetCriteriaCount(metCount);
        dto.setTotalCriteriaCount(items.size());
        dto.setSummary(summary);
        dto.setItems(items);
        dto.setDisclaimer("Automated preliminary evaluation only. Does not constitute a final legal qualification decision by the procuring authority.");
        return dto;
    }
}
