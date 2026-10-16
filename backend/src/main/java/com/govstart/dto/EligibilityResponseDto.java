package com.govstart.dto;

import java.util.List;
import java.util.Map;

public class EligibilityResponseDto {
    private Long tenderId;
    private Long startupId;
    private String overallStatus; // MET, NOT_MET, UNKNOWN
    private Integer metCriteriaCount;
    private Integer totalCriteriaCount;
    private String summary;
    private List<Map<String, Object>> items;
    private String disclaimer;

    public EligibilityResponseDto() {}

    public Long getTenderId() { return tenderId; }
    public void setTenderId(Long tenderId) { this.tenderId = tenderId; }

    public Long getStartupId() { return startupId; }
    public void setStartupId(Long startupId) { this.startupId = startupId; }

    public String getOverallStatus() { return overallStatus; }
    public void setOverallStatus(String overallStatus) { this.overallStatus = overallStatus; }

    public Integer getMetCriteriaCount() { return metCriteriaCount; }
    public void setMetCriteriaCount(Integer metCriteriaCount) { this.metCriteriaCount = metCriteriaCount; }

    public Integer getTotalCriteriaCount() { return totalCriteriaCount; }
    public void setTotalCriteriaCount(Integer totalCriteriaCount) { this.totalCriteriaCount = totalCriteriaCount; }

    public String getSummary() { return summary; }
    public void setSummary(String summary) { this.summary = summary; }

    public List<Map<String, Object>> getItems() { return items; }
    public void setItems(List<Map<String, Object>> items) { this.items = items; }

    public String getDisclaimer() { return disclaimer; }
    public void setDisclaimer(String disclaimer) { this.disclaimer = disclaimer; }
}
