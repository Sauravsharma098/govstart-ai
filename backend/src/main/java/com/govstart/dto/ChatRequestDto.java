package com.govstart.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.util.List;
import java.util.Map;

public class ChatRequestDto {
    @NotNull(message = "Tender ID is required")
    private Long tenderId;

    @NotBlank(message = "Query cannot be blank")
    private String query;

    public ChatRequestDto() {}

    public Long getTenderId() { return tenderId; }
    public void setTenderId(Long tenderId) { this.tenderId = tenderId; }

    public String getQuery() { return query; }
    public void setQuery(String query) { this.query = query; }
}
