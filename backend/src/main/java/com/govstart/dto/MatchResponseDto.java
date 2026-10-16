package com.govstart.dto;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

public class MatchResponseDto {
    private Long tenderId;
    private Long startupId;
    private BigDecimal relevanceScore;
    private String preliminaryStatus;
    private List<String> matchedSkills;
    private List<String> missingRequirements;
    private Map<String, Object> componentScores;
    private String explanation;

    public MatchResponseDto() {}

    public Long getTenderId() { return tenderId; }
    public void setTenderId(Long tenderId) { this.tenderId = tenderId; }

    public Long getStartupId() { return startupId; }
    public void setStartupId(Long startupId) { this.startupId = startupId; }

    public BigDecimal getRelevanceScore() { return relevanceScore; }
    public void setRelevanceScore(BigDecimal relevanceScore) { this.relevanceScore = relevanceScore; }

    public String getPreliminaryStatus() { return preliminaryStatus; }
    public void setPreliminaryStatus(String preliminaryStatus) { this.preliminaryStatus = preliminaryStatus; }

    public List<String> getMatchedSkills() { return matchedSkills; }
    public void setMatchedSkills(List<String> matchedSkills) { this.matchedSkills = matchedSkills; }

    public List<String> getMissingRequirements() { return missingRequirements; }
    public void setMissingRequirements(List<String> missingRequirements) { this.missingRequirements = missingRequirements; }

    public Map<String, Object> getComponentScores() { return componentScores; }
    public void setComponentScores(Map<String, Object> componentScores) { this.componentScores = componentScores; }

    public String getExplanation() { return explanation; }
    public void setExplanation(String explanation) { this.explanation = explanation; }
}
