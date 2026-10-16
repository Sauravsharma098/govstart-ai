package com.govstart.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "tender_matches", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"startup_id", "tender_id"})
})
public class TenderMatch {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "startup_id", nullable = false)
    private StartupProfile startup;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "tender_id", nullable = false)
    private Tender tender;

    @Column(name = "relevance_score", nullable = false, precision = 5, scale = 2)
    private BigDecimal relevanceScore;

    @Column(name = "matched_skills", columnDefinition = "TEXT")
    private String matchedSkills;

    @Column(name = "missing_requirements", columnDefinition = "TEXT")
    private String missingRequirements;

    @Column(columnDefinition = "LONGTEXT")
    private String explanation;

    @Column(name = "preliminary_status", nullable = false, length = 50)
    private String preliminaryStatus; // HIGHLY_RELEVANT, MODERATE, LOW_MATCH

    @Column(name = "calculated_at")
    private LocalDateTime calculatedAt = LocalDateTime.now();

    public TenderMatch() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public StartupProfile getStartup() { return startup; }
    public void setStartup(StartupProfile startup) { this.startup = startup; }

    public Tender getTender() { return tender; }
    public void setTender(Tender tender) { this.tender = tender; }

    public BigDecimal getRelevanceScore() { return relevanceScore; }
    public void setRelevanceScore(BigDecimal relevanceScore) { this.relevanceScore = relevanceScore; }

    public String getMatchedSkills() { return matchedSkills; }
    public void setMatchedSkills(String matchedSkills) { this.matchedSkills = matchedSkills; }

    public String getMissingRequirements() { return missingRequirements; }
    public void setMissingRequirements(String missingRequirements) { this.missingRequirements = missingRequirements; }

    public String getExplanation() { return explanation; }
    public void setExplanation(String explanation) { this.explanation = explanation; }

    public String getPreliminaryStatus() { return preliminaryStatus; }
    public void setPreliminaryStatus(String preliminaryStatus) { this.preliminaryStatus = preliminaryStatus; }

    public LocalDateTime getCalculatedAt() { return calculatedAt; }
    public void setCalculatedAt(LocalDateTime calculatedAt) { this.calculatedAt = calculatedAt; }
}
