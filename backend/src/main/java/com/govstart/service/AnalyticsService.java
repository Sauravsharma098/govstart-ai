package com.govstart.service;

import com.govstart.dto.AnalyticsDto;
import com.govstart.entity.Role;
import com.govstart.repository.ApplicationRepository;
import com.govstart.repository.TenderRepository;
import com.govstart.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class AnalyticsService {

    private final TenderRepository tenderRepository;
    private final ApplicationRepository applicationRepository;
    private final UserRepository userRepository;

    public AnalyticsService(TenderRepository tenderRepository,
                            ApplicationRepository applicationRepository,
                            UserRepository userRepository) {
        this.tenderRepository = tenderRepository;
        this.applicationRepository = applicationRepository;
        this.userRepository = userRepository;
    }

    public AnalyticsDto getPlatformAnalytics() {
        AnalyticsDto dto = new AnalyticsDto();
        dto.setTotalTenders(tenderRepository.count());
        dto.setTotalStartups(userRepository.countByRole(Role.STARTUP));
        dto.setTotalApplications(applicationRepository.count());

        // Calculate sum of budgets
        BigDecimal totalBudget = tenderRepository.findAll().stream()
                .map(t -> t.getBudgetInr() != null ? t.getBudgetInr() : BigDecimal.ZERO)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        dto.setTotalTrackedBudgetInr(totalBudget);

        // Tenders by Category
        Map<String, Long> catMap = new HashMap<>();
        List<Object[]> catCounts = tenderRepository.countTendersByCategory();
        for (Object[] row : catCounts) {
            catMap.put((String) row[0], (Long) row[1]);
        }
        dto.setTendersByCategory(catMap);

        // Tenders by Department
        Map<String, Long> deptMap = new HashMap<>();
        List<Object[]> deptCounts = tenderRepository.countTendersByDepartment();
        for (Object[] row : deptCounts) {
            deptMap.put((String) row[0], (Long) row[1]);
        }
        dto.setTendersByDepartment(deptMap);

        // Applications by Status
        Map<String, Long> statusMap = new HashMap<>();
        List<Object[]> appCounts = applicationRepository.countApplicationsByStatus();
        for (Object[] row : appCounts) {
            statusMap.put(row[0].toString(), (Long) row[1]);
        }
        dto.setApplicationsByStatus(statusMap);

        return dto;
    }
}
