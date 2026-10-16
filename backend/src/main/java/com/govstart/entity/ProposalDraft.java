package com.govstart.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "proposal_drafts")
public class ProposalDraft {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "startup_id", nullable = false)
    private StartupProfile startup;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "tender_id", nullable = false)
    private Tender tender;

    @Column(nullable = false, length = 255)
    private String title;

    @Column(name = "company_introduction", columnDefinition = "LONGTEXT")
    private String companyIntroduction;

    @Column(name = "technical_outline", columnDefinition = "LONGTEXT")
    private String technicalOutline;

    @Column(name = "compliance_matrix", columnDefinition = "LONGTEXT")
    private String complianceMatrix;

    @Column(name = "checklist_items", columnDefinition = "LONGTEXT")
    private String checklistItems;

    @Column(name = "version_number")
    private Integer versionNumber = 1;

    @Column(name = "last_saved_at")
    private LocalDateTime lastSavedAt = LocalDateTime.now();

    public ProposalDraft() {}

    @PrePersist
    @PreUpdate
    protected void onSave() {
        this.lastSavedAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public StartupProfile getStartup() { return startup; }
    public void setStartup(StartupProfile startup) { this.startup = startup; }

    public Tender getTender() { return tender; }
    public void setTender(Tender tender) { this.tender = tender; }

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
