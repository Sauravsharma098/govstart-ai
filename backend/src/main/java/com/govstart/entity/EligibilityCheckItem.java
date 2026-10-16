package com.govstart.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

@Entity
@Table(name = "eligibility_check_items")
public class EligibilityCheckItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "eligibility_check_id", nullable = false)
    @JsonIgnore
    private EligibilityCheck eligibilityCheck;

    @Column(name = "criterion_name", nullable = false, length = 255)
    private String criterionName;

    @Column(nullable = false, length = 20)
    private String status; // MET, NOT_MET, UNKNOWN

    @Column(columnDefinition = "TEXT")
    private String explanation;

    @Column(name = "required_evidence", columnDefinition = "TEXT")
    private String requiredEvidence;

    @Column(name = "is_verified")
    private Boolean isVerified = false;

    public EligibilityCheckItem() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public EligibilityCheck getEligibilityCheck() { return eligibilityCheck; }
    public void setEligibilityCheck(EligibilityCheck eligibilityCheck) { this.eligibilityCheck = eligibilityCheck; }

    public String getCriterionName() { return criterionName; }
    public void setCriterionName(String criterionName) { this.criterionName = criterionName; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getExplanation() { return explanation; }
    public void setExplanation(String explanation) { this.explanation = explanation; }

    public String getRequiredEvidence() { return requiredEvidence; }
    public void setRequiredEvidence(String requiredEvidence) { this.requiredEvidence = requiredEvidence; }

    public Boolean getIsVerified() { return isVerified; }
    public void setIsVerified(Boolean isVerified) { this.isVerified = isVerified; }
}
