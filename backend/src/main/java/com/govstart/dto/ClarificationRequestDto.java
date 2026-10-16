package com.govstart.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class ClarificationRequestDto {
    @NotNull(message = "Application ID is required")
    private Long applicationId;

    @NotBlank(message = "Clarification note is required")
    private String clarificationNote;

    public ClarificationRequestDto() {}

    public Long getApplicationId() { return applicationId; }
    public void setApplicationId(Long applicationId) { this.applicationId = applicationId; }

    public String getClarificationNote() { return clarificationNote; }
    public void setClarificationNote(String clarificationNote) { this.clarificationNote = clarificationNote; }
}
