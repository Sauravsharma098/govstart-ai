package com.govstart.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "startup_profiles")
public class StartupProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Column(name = "company_name", nullable = false, length = 150)
    private String companyName;

    @Column(name = "registration_number", nullable = false, length = 50)
    private String registrationNumber;

    @Column(name = "dpiit_recognized")
    private Boolean dpiitRecognized = false;

    @Column(name = "dpiit_number", length = 50)
    private String dpiitNumber;

    @Column(nullable = false, length = 100)
    private String sector;

    @Column(length = 50)
    private String stage = "EARLY";

    @Column(name = "founded_year")
    private Integer foundedYear;

    @Column(name = "team_size")
    private Integer teamSize = 1;

    @Column(name = "annual_turnover", precision = 15, scale = 2)
    private BigDecimal annualTurnover = BigDecimal.ZERO;

    @Column(name = "location_state", nullable = false, length = 100)
    private String locationState;

    @Column(name = "location_city", nullable = false, length = 100)
    private String locationCity;

    @Column(length = 255)
    private String website;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "primary_skills", columnDefinition = "TEXT")
    private String primarySkills; // Stored as JSON or comma-separated string

    @Column(columnDefinition = "TEXT")
    private String certifications;

    @Column(name = "past_experience", columnDefinition = "TEXT")
    private String pastExperience;

    @Column(name = "verified_status", length = 20)
    private String verifiedStatus = "PENDING"; // PENDING, VERIFIED, REJECTED

    @Column(name = "profile_completeness_pct")
    private Integer profileCompletenessPct = 30;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at")
    private LocalDateTime updatedAt = LocalDateTime.now();

    public StartupProfile() {}

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        calculateCompleteness();
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
        calculateCompleteness();
    }

    public void calculateCompleteness() {
        int score = 20; // Base score for registration
        if (companyName != null && !companyName.isBlank()) score += 10;
        if (registrationNumber != null && !registrationNumber.isBlank()) score += 10;
        if (Boolean.TRUE.equals(dpiitRecognized) && dpiitNumber != null && !dpiitNumber.isBlank()) score += 20;
        if (sector != null && !sector.isBlank()) score += 10;
        if (primarySkills != null && !primarySkills.isBlank()) score += 10;
        if (pastExperience != null && !pastExperience.isBlank()) score += 10;
        if (certifications != null && !certifications.isBlank()) score += 10;
        this.profileCompletenessPct = Math.min(100, score);
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public String getCompanyName() { return companyName; }
    public void setCompanyName(String companyName) { this.companyName = companyName; }

    public String getRegistrationNumber() { return registrationNumber; }
    public void setRegistrationNumber(String registrationNumber) { this.registrationNumber = registrationNumber; }

    public Boolean getDpiitRecognized() { return dpiitRecognized; }
    public void setDpiitRecognized(Boolean dpiitRecognized) { this.dpiitRecognized = dpiitRecognized; }

    public String getDpiitNumber() { return dpiitNumber; }
    public void setDpiitNumber(String dpiitNumber) { this.dpiitNumber = dpiitNumber; }

    public String getSector() { return sector; }
    public void setSector(String sector) { this.sector = sector; }

    public String getStage() { return stage; }
    public void setStage(String stage) { this.stage = stage; }

    public Integer getFoundedYear() { return foundedYear; }
    public void setFoundedYear(Integer foundedYear) { this.foundedYear = foundedYear; }

    public Integer getTeamSize() { return teamSize; }
    public void setTeamSize(Integer teamSize) { this.teamSize = teamSize; }

    public BigDecimal getAnnualTurnover() { return annualTurnover; }
    public void setAnnualTurnover(BigDecimal annualTurnover) { this.annualTurnover = annualTurnover; }

    public String getLocationState() { return locationState; }
    public void setLocationState(String locationState) { this.locationState = locationState; }

    public String getLocationCity() { return locationCity; }
    public void setLocationCity(String locationCity) { this.locationCity = locationCity; }

    public String getWebsite() { return website; }
    public void setWebsite(String website) { this.website = website; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getPrimarySkills() { return primarySkills; }
    public void setPrimarySkills(String primarySkills) { this.primarySkills = primarySkills; }

    public String getCertifications() { return certifications; }
    public void setCertifications(String certifications) { this.certifications = certifications; }

    public String getPastExperience() { return pastExperience; }
    public void setPastExperience(String pastExperience) { this.pastExperience = pastExperience; }

    public String getVerifiedStatus() { return verifiedStatus; }
    public void setVerifiedStatus(String verifiedStatus) { this.verifiedStatus = verifiedStatus; }

    public Integer getProfileCompletenessPct() { return profileCompletenessPct; }
    public void setProfileCompletenessPct(Integer profileCompletenessPct) { this.profileCompletenessPct = profileCompletenessPct; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
