package com.govstart.dto;

import com.govstart.entity.Application;
import com.govstart.entity.ApplicationStatus;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class ApplicationResponseDto {
    private Long id;
    private String applicationNumber;
    private Long tenderId;
    private String tenderTitle;
    private String tenderReferenceNumber;
    private Long startupId;
    private String startupCompanyName;
    private ApplicationStatus status;
    private String proposalSummary;
    private BigDecimal proposedCostInr;
    private BigDecimal technicalScore;
    private BigDecimal financialScore;
    private String officerNotes;
    private String clarificationNote;
    private LocalDateTime submittedAt;
    private LocalDateTime updatedAt;
    private Boolean isDemo;

    public ApplicationResponseDto() {}

    public static ApplicationResponseDto fromEntity(Application app) {
        ApplicationResponseDto dto = new ApplicationResponseDto();
        dto.setId(app.getId());
        dto.setApplicationNumber(app.getApplicationNumber());
        if (app.getTender() != null) {
            dto.setTenderId(app.getTender().getId());
            dto.setTenderTitle(app.getTender().getTitle());
            dto.setTenderReferenceNumber(app.getTender().getReferenceNumber());
        }
        if (app.getStartup() != null) {
            dto.setStartupId(app.getStartup().getId());
            dto.setStartupCompanyName(app.getStartup().getCompanyName());
        }
        dto.setStatus(app.getStatus());
        dto.setProposalSummary(app.getProposalSummary());
        dto.setProposedCostInr(app.getProposedCostInr());
        dto.setTechnicalScore(app.getTechnicalScore());
        dto.setFinancialScore(app.getFinancialScore());
        dto.setOfficerNotes(app.getOfficerNotes());
        dto.setClarificationNote(app.getClarificationNote());
        dto.setSubmittedAt(app.getSubmittedAt());
        dto.setUpdatedAt(app.getUpdatedAt());
        dto.setIsDemo(app.getIsDemo());
        return dto;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getApplicationNumber() { return applicationNumber; }
    public void setApplicationNumber(String applicationNumber) { this.applicationNumber = applicationNumber; }

    public Long getTenderId() { return tenderId; }
    public void setTenderId(Long tenderId) { this.tenderId = tenderId; }

    public String getTenderTitle() { return tenderTitle; }
    public void setTenderTitle(String tenderTitle) { this.tenderTitle = tenderTitle; }

    public String getTenderReferenceNumber() { return tenderReferenceNumber; }
    public void setTenderReferenceNumber(String tenderReferenceNumber) { this.tenderReferenceNumber = tenderReferenceNumber; }

    public Long getStartupId() { return startupId; }
    public void setStartupId(Long startupId) { this.startupId = startupId; }

    public String getStartupCompanyName() { return startupCompanyName; }
    public void setStartupCompanyName(String startupCompanyName) { this.startupCompanyName = startupCompanyName; }

    public ApplicationStatus getStatus() { return status; }
    public void setStatus(ApplicationStatus status) { this.status = status; }

    public String getProposalSummary() { return proposalSummary; }
    public void setProposalSummary(String proposalSummary) { this.proposalSummary = proposalSummary; }

    public BigDecimal getProposedCostInr() { return proposedCostInr; }
    public void setProposedCostInr(BigDecimal proposedCostInr) { this.proposedCostInr = proposedCostInr; }

    public BigDecimal getTechnicalScore() { return technicalScore; }
    public void setTechnicalScore(BigDecimal technicalScore) { this.technicalScore = technicalScore; }

    public BigDecimal getFinancialScore() { return financialScore; }
    public void setFinancialScore(BigDecimal financialScore) { this.financialScore = financialScore; }

    public String getOfficerNotes() { return officerNotes; }
    public void setOfficerNotes(String officerNotes) { this.officerNotes = officerNotes; }

    public String getClarificationNote() { return clarificationNote; }
    public void setClarificationNote(String clarificationNote) { this.clarificationNote = clarificationNote; }

    public LocalDateTime getSubmittedAt() { return submittedAt; }
    public void setSubmittedAt(LocalDateTime submittedAt) { this.submittedAt = submittedAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public Boolean getIsDemo() { return isDemo; }
    public void setIsDemo(Boolean demo) { isDemo = demo; }
}
