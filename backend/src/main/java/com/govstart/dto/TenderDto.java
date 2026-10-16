package com.govstart.dto;

import com.govstart.entity.Tender;
import com.govstart.entity.TenderStatus;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

public class TenderDto {
    private Long id;
    private String referenceNumber;
    private String title;
    private String description;
    private Long departmentId;
    private String departmentName;
    private Long categoryId;
    private String categoryName;
    private BigDecimal budgetInr;
    private LocalDate publicationDate;
    private LocalDateTime deadline;
    private String eligibilityCriteria;
    private String requiredSkills;
    private String requiredDocuments;
    private String evaluationCriteria;
    private TenderStatus status;
    private String sourceUrl;
    private Boolean isDemo;
    private Boolean isSaved = false;
    private Double matchScore;

    public TenderDto() {}

    public static TenderDto fromEntity(Tender tender) {
        TenderDto dto = new TenderDto();
        dto.setId(tender.getId());
        dto.setReferenceNumber(tender.getReferenceNumber());
        dto.setTitle(tender.getTitle());
        dto.setDescription(tender.getDescription());
        if (tender.getDepartment() != null) {
            dto.setDepartmentId(tender.getDepartment().getId());
            dto.setDepartmentName(tender.getDepartment().getName());
        }
        if (tender.getCategory() != null) {
            dto.setCategoryId(tender.getCategory().getId());
            dto.setCategoryName(tender.getCategory().getName());
        }
        dto.setBudgetInr(tender.getBudgetInr());
        dto.setPublicationDate(tender.getPublicationDate());
        dto.setDeadline(tender.getDeadline());
        dto.setEligibilityCriteria(tender.getEligibilityCriteria());
        dto.setRequiredSkills(tender.getRequiredSkills());
        dto.setRequiredDocuments(tender.getRequiredDocuments());
        dto.setEvaluationCriteria(tender.getEvaluationCriteria());
        dto.setStatus(tender.getStatus());
        dto.setSourceUrl(tender.getSourceUrl());
        dto.setIsDemo(tender.getIsDemo());
        return dto;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getReferenceNumber() { return referenceNumber; }
    public void setReferenceNumber(String referenceNumber) { this.referenceNumber = referenceNumber; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public Long getDepartmentId() { return departmentId; }
    public void setDepartmentId(Long departmentId) { this.departmentId = departmentId; }

    public String getDepartmentName() { return departmentName; }
    public void setDepartmentName(String departmentName) { this.departmentName = departmentName; }

    public Long getCategoryId() { return categoryId; }
    public void setCategoryId(Long categoryId) { this.categoryId = categoryId; }

    public String getCategoryName() { return categoryName; }
    public void setCategoryName(String categoryName) { this.categoryName = categoryName; }

    public BigDecimal getBudgetInr() { return budgetInr; }
    public void setBudgetInr(BigDecimal budgetInr) { this.budgetInr = budgetInr; }

    public LocalDate getPublicationDate() { return publicationDate; }
    public void setPublicationDate(LocalDate publicationDate) { this.publicationDate = publicationDate; }

    public LocalDateTime getDeadline() { return deadline; }
    public void setDeadline(LocalDateTime deadline) { this.deadline = deadline; }

    public String getEligibilityCriteria() { return eligibilityCriteria; }
    public void setEligibilityCriteria(String eligibilityCriteria) { this.eligibilityCriteria = eligibilityCriteria; }

    public String getRequiredSkills() { return requiredSkills; }
    public void setRequiredSkills(String requiredSkills) { this.requiredSkills = requiredSkills; }

    public String getRequiredDocuments() { return requiredDocuments; }
    public void setRequiredDocuments(String requiredDocuments) { this.requiredDocuments = requiredDocuments; }

    public String getEvaluationCriteria() { return evaluationCriteria; }
    public void setEvaluationCriteria(String evaluationCriteria) { this.evaluationCriteria = evaluationCriteria; }

    public TenderStatus getStatus() { return status; }
    public void setStatus(TenderStatus status) { this.status = status; }

    public String getSourceUrl() { return sourceUrl; }
    public void setSourceUrl(String sourceUrl) { this.sourceUrl = sourceUrl; }

    public Boolean getIsDemo() { return isDemo; }
    public void setIsDemo(Boolean demo) { isDemo = demo; }

    public Boolean getIsSaved() { return isSaved; }
    public void setIsSaved(Boolean saved) { isSaved = saved; }

    public Double getMatchScore() { return matchScore; }
    public void setMatchScore(Double matchScore) { this.matchScore = matchScore; }
}
