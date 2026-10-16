package com.govstart.dto;

import com.govstart.entity.ApplicationStatus;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;

public class StatusUpdateDto {
    @NotNull(message = "New status is required")
    private ApplicationStatus status;

    private String officerNotes;
    private BigDecimal technicalScore;
    private BigDecimal financialScore;

    public StatusUpdateDto() {}

    public ApplicationStatus getStatus() { return status; }
    public void setStatus(ApplicationStatus status) { this.status = status; }

    public String getOfficerNotes() { return officerNotes; }
    public void setOfficerNotes(String officerNotes) { this.officerNotes = officerNotes; }

    public BigDecimal getTechnicalScore() { return technicalScore; }
    public void setTechnicalScore(BigDecimal technicalScore) { this.technicalScore = technicalScore; }

    public BigDecimal getFinancialScore() { return financialScore; }
    public void setFinancialScore(BigDecimal financialScore) { this.financialScore = financialScore; }
}
