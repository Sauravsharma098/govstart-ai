package com.govstart.service;

import com.govstart.dto.ProposalDraftDto;
import com.govstart.entity.ProposalDraft;
import com.govstart.entity.StartupProfile;
import com.govstart.entity.Tender;
import com.govstart.exception.ResourceNotFoundException;
import com.govstart.repository.ProposalDraftRepository;
import com.govstart.repository.StartupProfileRepository;
import com.govstart.repository.TenderRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
public class BidService {

    private final ProposalDraftRepository proposalDraftRepository;
    private final StartupProfileRepository startupProfileRepository;
    private final TenderRepository tenderRepository;

    public BidService(ProposalDraftRepository proposalDraftRepository,
                      StartupProfileRepository startupProfileRepository,
                      TenderRepository tenderRepository) {
        this.proposalDraftRepository = proposalDraftRepository;
        this.startupProfileRepository = startupProfileRepository;
        this.tenderRepository = tenderRepository;
    }

    public ProposalDraftDto getDraft(Long startupId, Long tenderId) {
        return proposalDraftRepository.findByStartupIdAndTenderId(startupId, tenderId)
                .map(this::toDto)
                .orElseGet(() -> generateInitialDraft(startupId, tenderId));
    }

    @Transactional
    public ProposalDraftDto generateInitialDraft(Long startupId, Long tenderId) {
        StartupProfile startup = startupProfileRepository.findById(startupId)
                .orElseThrow(() -> new ResourceNotFoundException("Startup profile not found with id: " + startupId));
        Tender tender = tenderRepository.findById(tenderId)
                .orElseThrow(() -> new ResourceNotFoundException("Tender not found with id: " + tenderId));

        ProposalDraft draft = proposalDraftRepository.findByStartupIdAndTenderId(startupId, tenderId)
                .orElseGet(() -> {
                    ProposalDraft d = new ProposalDraft();
                    d.setStartup(startup);
                    d.setTender(tender);
                    return d;
                });

        draft.setTitle("Bid Response - " + startup.getCompanyName() + " for " + tender.getReferenceNumber());
        
        String dpiitInfo = Boolean.TRUE.equals(startup.getDpiitRecognized()) ? 
                "recognized under DPIIT (" + startup.getDpiitNumber() + ")" : "registered deep-technology enterprise";
        draft.setCompanyIntroduction(
                "1. BIDDER PROFILE & EXECUTIVE SUMMARY\n\n" +
                startup.getCompanyName() + " is an indigenous technology organization based in " +
                startup.getLocationCity() + ", " + startup.getLocationState() + ", " + dpiitInfo + ".\n\n" +
                "Operating across the " + startup.getSector() + " domain, our engineering team provides demonstrated expertise in: " +
                (startup.getPrimarySkills() != null ? startup.getPrimarySkills() : "applied systems engineering") + ".\n" +
                "Past Deliveries: " + (startup.getPastExperience() != null ? startup.getPastExperience() : "Documented field prototypes.")
        );

        draft.setTechnicalOutline(
                "2. PROPOSED TECHNICAL METHODOLOGY & IMPLEMENTATION\n\n" +
                "2.1 System Architecture:\n" +
                "- Modular architecture addressing all requirements for " + tender.getTitle() + ".\n" +
                "- Native adherence to cybersecurity baselines and open API specifications.\n\n" +
                "2.2 Work Plan & Milestone Deliverables:\n" +
                "- Milestone 1 (Month 1): Preliminary Design Review (PDR) and requirements finalization.\n" +
                "- Milestone 2 (Month 2-3): Prototype assembly, lab benchmarking, and environmental chamber testing.\n" +
                "- Milestone 3 (Month 4): Field Demonstration Trial and User Acceptance Testing (UAT).\n" +
                "- Milestone 4 (Month 5+): Operational handover, user training, and SLA support."
        );

        draft.setComplianceMatrix(
                "Tender Clause | Bidder Specification | Status | Evidence Document\n" +
                "-------------|----------------------|--------|------------------\n" +
                "DPIIT Recognition | " + (Boolean.TRUE.equals(startup.getDpiitRecognized()) ? startup.getDpiitNumber() : "General SME") + " | COMPLIANT | DPIIT Certificate\n" +
                "Technical Scope | Aligned with specifications | COMPLIANT | Architecture Document\n" +
                "Delivery Timelines | Complete execution within deadline | COMPLIANT | Detailed Gantt Chart"
        );

        draft.setChecklistItems("[\"Signed Tender Form\", \"DPIIT Certificate\", \"Technical Architecture Proposal\", \"Quality Certificates\", \"Commercial Bid\"]");
        draft.setVersionNumber(1);
        draft.setLastSavedAt(LocalDateTime.now());

        draft = proposalDraftRepository.save(draft);
        return toDto(draft);
    }

    @Transactional
    public ProposalDraftDto saveDraft(ProposalDraftDto dto) {
        StartupProfile startup = startupProfileRepository.findById(dto.getStartupId())
                .orElseThrow(() -> new ResourceNotFoundException("Startup not found with id: " + dto.getStartupId()));
        Tender tender = tenderRepository.findById(dto.getTenderId())
                .orElseThrow(() -> new ResourceNotFoundException("Tender not found with id: " + dto.getTenderId()));

        ProposalDraft draft = proposalDraftRepository.findByStartupIdAndTenderId(dto.getStartupId(), dto.getTenderId())
                .orElseGet(() -> {
                    ProposalDraft d = new ProposalDraft();
                    d.setStartup(startup);
                    d.setTender(tender);
                    return d;
                });

        if (dto.getTitle() != null) draft.setTitle(dto.getTitle());
        if (dto.getCompanyIntroduction() != null) draft.setCompanyIntroduction(dto.getCompanyIntroduction());
        if (dto.getTechnicalOutline() != null) draft.setTechnicalOutline(dto.getTechnicalOutline());
        if (dto.getComplianceMatrix() != null) draft.setComplianceMatrix(dto.getComplianceMatrix());
        if (dto.getChecklistItems() != null) draft.setChecklistItems(dto.getChecklistItems());
        draft.setVersionNumber(draft.getVersionNumber() != null ? draft.getVersionNumber() + 1 : 1);
        draft.setLastSavedAt(LocalDateTime.now());

        draft = proposalDraftRepository.save(draft);
        return toDto(draft);
    }

    public String exportDraftAsMarkdown(Long startupId, Long tenderId) {
        ProposalDraftDto d = getDraft(startupId, tenderId);
        return "# " + d.getTitle() + "\n\n" +
               "**Last Saved:** " + d.getLastSavedAt() + " | **Version:** " + d.getVersionNumber() + "\n\n" +
               "---\n\n" +
               d.getCompanyIntroduction() + "\n\n" +
               "---\n\n" +
               d.getTechnicalOutline() + "\n\n" +
               "---\n\n" +
               "### 3. COMPLIANCE MATRIX\n\n" +
               d.getComplianceMatrix() + "\n\n" +
               "---\n\n" +
               "### 4. SUBMISSION CHECKLIST\n\n" +
               d.getChecklistItems();
    }

    private ProposalDraftDto toDto(ProposalDraft d) {
        ProposalDraftDto dto = new ProposalDraftDto();
        dto.setId(d.getId());
        dto.setStartupId(d.getStartup().getId());
        dto.setTenderId(d.getTender().getId());
        dto.setTitle(d.getTitle());
        dto.setCompanyIntroduction(d.getCompanyIntroduction());
        dto.setTechnicalOutline(d.getTechnicalOutline());
        dto.setComplianceMatrix(d.getComplianceMatrix());
        dto.setChecklistItems(d.getChecklistItems());
        dto.setVersionNumber(d.getVersionNumber());
        dto.setLastSavedAt(d.getLastSavedAt());
        return dto;
    }
}
