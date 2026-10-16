package com.govstart.dto;

import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;

public class ApplicationSubmitDto {
    @NotNull(message = "Tender ID is required")
    private Long tenderId;

    private String proposalSummary;
    private BigDecimal proposedCostInr;

    public ApplicationSubmitDto() {}

    public Long getTenderId() { return tenderId; }
    public void setTenderId(Long tenderId) { this.tenderId = tenderId; }

    public String getProposalSummary() { return proposalSummary; }
    public void setProposalSummary(String proposalSummary) { this.proposalSummary = proposalSummary; }

    public BigDecimal getProposedCostInr() { return proposedCostInr; }
    public void setProposedCostInr(BigDecimal proposedCostInr) { this.proposedCostInr = proposedCostInr; }
}
