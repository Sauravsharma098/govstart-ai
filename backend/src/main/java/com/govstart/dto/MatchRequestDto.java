package com.govstart.dto;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

public class MatchRequestDto {
    private Long startupId;
    private Long tenderId;
    private Map<String, Double> weights;

    public MatchRequestDto() {}

    public Long getStartupId() { return startupId; }
    public void setStartupId(Long startupId) { this.startupId = startupId; }

    public Long getTenderId() { return tenderId; }
    public void setTenderId(Long tenderId) { this.tenderId = tenderId; }

    public Map<String, Double> getWeights() { return weights; }
    public void setWeights(Map<String, Double> weights) { this.weights = weights; }
}
