package com.govstart.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "eligibility_checks")
public class EligibilityCheck {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "startup_id", nullable = false)
    private StartupProfile startup;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "tender_id", nullable = false)
    private Tender tender;

    @Column(name = "overall_status", nullable = false, length = 20)
    private String overallStatus; // MET, NOT_MET, UNKNOWN

    @Column(columnDefinition = "TEXT")
    private String summary;

    @Column(name = "checked_at")
    private LocalDateTime checkedAt = LocalDateTime.now();

    @OneToMany(mappedBy = "eligibilityCheck", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<EligibilityCheckItem> items = new ArrayList<>();

    public EligibilityCheck() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public StartupProfile getStartup() { return startup; }
    public void setStartup(StartupProfile startup) { this.startup = startup; }

    public Tender getTender() { return tender; }
    public void setTender(Tender tender) { this.tender = tender; }

    public String getOverallStatus() { return overallStatus; }
    public void setOverallStatus(String overallStatus) { this.overallStatus = overallStatus; }

    public String getSummary() { return summary; }
    public void setSummary(String summary) { this.summary = summary; }

    public LocalDateTime getCheckedAt() { return checkedAt; }
    public void setCheckedAt(LocalDateTime checkedAt) { this.checkedAt = checkedAt; }

    public List<EligibilityCheckItem> getItems() { return items; }
    public void setItems(List<EligibilityCheckItem> items) { this.items = items; }
}
