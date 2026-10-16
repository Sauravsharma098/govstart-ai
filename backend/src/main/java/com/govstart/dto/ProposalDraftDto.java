package com.govstart.dto;

import java.time.LocalDateTime;

public class ProposalDraftDto {
    private Long id;
    private Long startupId;
    private Long tenderId;
    private String title;
    private String companyIntroduction;
    private String technicalOutline;
    private String complianceMatrix;
    private String checklistItems;
    private Integer versionNumber;
    private LocalDateTime lastSavedAt;

    public ProposalDraftDto() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getStartupId() { return startupId; }
    public void setStartupId(Long startupId) { this.startupId = startupId; }

    public Long getTenderId() { return tenderId; }
    public void setTenderId(Long tenderId) { this.tenderId = tenderId; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getCompanyIntroduction() { return companyIntroduction; }
    public void setCompanyIntroduction(String companyIntroduction) { this.companyIntroduction = companyIntroduction; }

    public String getTechnicalOutline() { return technicalOutline; }
    public void setTechnicalOutline(String technicalOutline) { this.technicalOutline = technicalOutline; }

    public String getComplianceMatrix() { return complianceMatrix; }
    public void setComplianceMatrix(String complianceMatrix) { this.complianceMatrix = complianceMatrix; }

    public String getChecklistItems() { return checklistItems; }
    public void setChecklistItems(String checklistItems) { this.checklistItems = checklistItems; }

    public Integer getVersionNumber() { return versionNumber; }
    public void setVersionNumber(Integer versionNumber) { this.versionNumber = versionNumber; }

    public LocalDateTime getLastSavedAt() { return lastSavedAt; }
    public void setLastSavedAt(LocalDateTime lastSavedAt) { this.lastSavedAt = lastSavedAt; }
}
