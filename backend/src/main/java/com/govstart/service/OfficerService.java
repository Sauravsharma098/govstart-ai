package com.govstart.service;

import com.govstart.dto.ApplicationResponseDto;
import com.govstart.dto.TenderDto;
import com.govstart.entity.Application;
import com.govstart.entity.ApplicationStatus;
import com.govstart.entity.Tender;
import com.govstart.entity.User;
import com.govstart.repository.ApplicationRepository;
import com.govstart.repository.TenderRepository;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class OfficerService {

    private final TenderRepository tenderRepository;
    private final ApplicationRepository applicationRepository;

    public OfficerService(TenderRepository tenderRepository,
                          ApplicationRepository applicationRepository) {
        this.tenderRepository = tenderRepository;
        this.applicationRepository = applicationRepository;
    }

    public Map<String, Object> getOfficerOverview() {
        Map<String, Object> map = new HashMap<>();
        map.put("totalTenders", tenderRepository.count());
        map.put("pendingApplications", applicationRepository.countByStatus(ApplicationStatus.UNDER_REVIEW) + applicationRepository.countByStatus(ApplicationStatus.SUBMITTED));
        map.put("clarificationRequested", applicationRepository.countByStatus(ApplicationStatus.CLARIFICATION_REQUESTED));
        map.put("evaluatedApplications", applicationRepository.countByStatus(ApplicationStatus.EVALUATED));
        map.put("awardedContracts", applicationRepository.countByStatus(ApplicationStatus.AWARDED));
        return map;
    }

    public List<ApplicationResponseDto> getPendingReviews() {
        return applicationRepository.findAll().stream()
                .filter(a -> a.getStatus() == ApplicationStatus.SUBMITTED || a.getStatus() == ApplicationStatus.UNDER_REVIEW || a.getStatus() == ApplicationStatus.CLARIFICATION_REQUESTED)
                .map(ApplicationResponseDto::fromEntity)
                .collect(Collectors.toList());
    }
}
