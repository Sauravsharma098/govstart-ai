package com.govstart.dto;

import java.math.BigDecimal;
import java.util.Map;

public class AnalyticsDto {
    private long totalTenders;
    private long totalStartups;
    private long totalApplications;
    private BigDecimal totalTrackedBudgetInr;
    private Map<String, Long> tendersByCategory;
    private Map<String, Long> tendersByDepartment;
    private Map<String, Long> applicationsByStatus;

    public AnalyticsDto() {}

    public long getTotalTenders() { return totalTenders; }
    public void setTotalTenders(long totalTenders) { this.totalTenders = totalTenders; }

    public long getTotalStartups() { return totalStartups; }
    public void setTotalStartups(long totalStartups) { this.totalStartups = totalStartups; }

    public long getTotalApplications() { return totalApplications; }
    public void setTotalApplications(long totalApplications) { this.totalApplications = totalApplications; }

    public BigDecimal getTotalTrackedBudgetInr() { return totalTrackedBudgetInr; }
    public void setTotalTrackedBudgetInr(BigDecimal totalTrackedBudgetInr) { this.totalTrackedBudgetInr = totalTrackedBudgetInr; }

    public Map<String, Long> getTendersByCategory() { return tendersByCategory; }
    public void setTendersByCategory(Map<String, Long> tendersByCategory) { this.tendersByCategory = tendersByCategory; }

    public Map<String, Long> getTendersByDepartment() { return tendersByDepartment; }
    public void setTendersByDepartment(Map<String, Long> tendersByDepartment) { this.tendersByDepartment = tendersByDepartment; }

    public Map<String, Long> getApplicationsByStatus() { return applicationsByStatus; }
    public void setApplicationsByStatus(Map<String, Long> applicationsByStatus) { this.applicationsByStatus = applicationsByStatus; }
}
