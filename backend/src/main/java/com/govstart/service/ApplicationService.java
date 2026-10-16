package com.govstart.service;

import com.govstart.dto.ApplicationResponseDto;
import com.govstart.dto.ApplicationSubmitDto;
import com.govstart.dto.ClarificationRequestDto;
import com.govstart.dto.StatusUpdateDto;
import com.govstart.entity.*;
import com.govstart.exception.BadRequestException;
import com.govstart.exception.ResourceNotFoundException;
import com.govstart.repository.ApplicationRepository;
import com.govstart.repository.StartupProfileRepository;
import com.govstart.repository.TenderRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class ApplicationService {

    private final ApplicationRepository applicationRepository;
    private final TenderRepository tenderRepository;
    private final StartupProfileRepository startupProfileRepository;
    private final NotificationService notificationService;
    private final AuditService auditService;

    public ApplicationService(ApplicationRepository applicationRepository,
                              TenderRepository tenderRepository,
                              StartupProfileRepository startupProfileRepository,
                              NotificationService notificationService,
                              AuditService auditService) {
        this.applicationRepository = applicationRepository;
        this.tenderRepository = tenderRepository;
        this.startupProfileRepository = startupProfileRepository;
        this.notificationService = notificationService;
        this.auditService = auditService;
    }

    @Transactional
    public ApplicationResponseDto submitApplication(Long userId, ApplicationSubmitDto dto) {
        StartupProfile startup = startupProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Startup profile not found for user: " + userId));
        Tender tender = tenderRepository.findById(dto.getTenderId())
                .orElseThrow(() -> new ResourceNotFoundException("Tender not found with id: " + dto.getTenderId()));

        if (tender.getStatus() != TenderStatus.PUBLISHED) {
            throw new BadRequestException("Applications are closed for this tender (Status: " + tender.getStatus() + ").");
        }

        if (tender.getDeadline().isBefore(LocalDateTime.now())) {
            throw new BadRequestException("The bid submission deadline has elapsed.");
        }

        Application application = applicationRepository.findByStartupIdAndTenderId(startup.getId(), tender.getId())
                .orElseGet(() -> {
                    Application a = new Application();
                    a.setStartup(startup);
                    a.setTender(tender);
                    a.setApplicationNumber("APP-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
                    return a;
                });

        if (application.getStatus() == ApplicationStatus.SUBMITTED ||
            application.getStatus() == ApplicationStatus.UNDER_REVIEW ||
            application.getStatus() == ApplicationStatus.AWARDED) {
            throw new BadRequestException("An active application (" + application.getStatus() + ") is already on file for this tender.");
        }

        application.setStatus(ApplicationStatus.SUBMITTED);
        application.setProposalSummary(dto.getProposalSummary());
        application.setProposedCostInr(dto.getProposedCostInr());
        application.setSubmittedAt(LocalDateTime.now());
        application.setIsDemo(true);

        application = applicationRepository.save(application);

        // Notify startup
        notificationService.sendNotification(
                startup.getUser(),
                "Bid Application Submitted",
                "Your application " + application.getApplicationNumber() + " for " + tender.getTitle() + " has been submitted successfully.",
                NotificationType.APPLICATION_STATUS,
                "/startup-dashboard.html#applications"
        );

        auditService.logAction(userId, "APPLICATION_SUBMIT", "Applications", application.getId(), "0.0.0.0", "Submitted bid: " + application.getApplicationNumber());

        return ApplicationResponseDto.fromEntity(application);
    }

    public List<ApplicationResponseDto> getApplicationsForStartup(Long userId) {
        StartupProfile startup = startupProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Startup profile not found for user: " + userId));

        return applicationRepository.findByStartupIdOrderByUpdatedAtDesc(startup.getId()).stream()
                .map(ApplicationResponseDto::fromEntity)
                .collect(Collectors.toList());
    }

    public List<ApplicationResponseDto> getApplicationsForTender(Long tenderId) {
        return applicationRepository.findByTenderIdOrderByUpdatedAtDesc(tenderId).stream()
                .map(ApplicationResponseDto::fromEntity)
                .collect(Collectors.toList());
    }

    public ApplicationResponseDto getApplicationById(Long id) {
        Application app = applicationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Application not found with id: " + id));
        return ApplicationResponseDto.fromEntity(app);
    }

    @Transactional
    public ApplicationResponseDto withdrawApplication(Long userId, Long applicationId) {
        Application app = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new ResourceNotFoundException("Application not found with id: " + applicationId));

        if (!app.getStartup().getUser().getId().equals(userId)) {
            throw new BadRequestException("You can only withdraw your own applications.");
        }

        if (app.getStatus() == ApplicationStatus.AWARDED) {
            throw new BadRequestException("Awarded contracts cannot be withdrawn through this interface.");
        }

        app.setStatus(ApplicationStatus.WITHDRAWN);
        app = applicationRepository.save(app);

        auditService.logAction(userId, "APPLICATION_WITHDRAW", "Applications", app.getId(), "0.0.0.0", "Application withdrawn: " + app.getApplicationNumber());
        return ApplicationResponseDto.fromEntity(app);
    }

    @Transactional
    public ApplicationResponseDto updateApplicationStatusByOfficer(Long officerUserId, Long applicationId, StatusUpdateDto dto) {
        Application app = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new ResourceNotFoundException("Application not found with id: " + applicationId));

        ApplicationStatus current = app.getStatus();
        ApplicationStatus next = dto.getStatus();

        // Enforce valid state machine transitions
        validateTransition(current, next);

        app.setStatus(next);
        if (dto.getOfficerNotes() != null) app.setOfficerNotes(dto.getOfficerNotes());
        if (dto.getTechnicalScore() != null) app.setTechnicalScore(dto.getTechnicalScore());
        if (dto.getFinancialScore() != null) app.setFinancialScore(dto.getFinancialScore());

        app = applicationRepository.save(app);

        // Notify startup of status transition
        notificationService.sendNotification(
                app.getStartup().getUser(),
                "Application Status Update: " + next,
                "Your application " + app.getApplicationNumber() + " is now " + next + ". Officer remarks: " + (dto.getOfficerNotes() != null ? dto.getOfficerNotes() : "Under evaluation."),
                NotificationType.APPLICATION_STATUS,
                "/startup-dashboard.html#applications"
        );

        auditService.logAction(officerUserId, "APPLICATION_STATUS_UPDATE", "Applications", app.getId(), "0.0.0.0", "Officer updated status from " + current + " to " + next);

        return ApplicationResponseDto.fromEntity(app);
    }

    @Transactional
    public ApplicationResponseDto requestClarification(Long officerUserId, ClarificationRequestDto dto) {
        Application app = applicationRepository.findById(dto.getApplicationId())
                .orElseThrow(() -> new ResourceNotFoundException("Application not found with id: " + dto.getApplicationId()));

        app.setStatus(ApplicationStatus.CLARIFICATION_REQUESTED);
        app.setClarificationNote(dto.getClarificationNote());
        app = applicationRepository.save(app);

        // Notify startup
        notificationService.sendNotification(
                app.getStartup().getUser(),
                "Clarification Requested on Bid",
                "The evaluating officer has requested clarification: " + dto.getClarificationNote(),
                NotificationType.CLARIFICATION,
                "/startup-dashboard.html#applications"
        );

        auditService.logAction(officerUserId, "CLARIFICATION_REQUESTED", "Applications", app.getId(), "0.0.0.0", "Requested clarification for: " + app.getApplicationNumber());
        return ApplicationResponseDto.fromEntity(app);
    }

    private void validateTransition(ApplicationStatus from, ApplicationStatus to) {
        if (from == to) return;

        boolean valid = switch (from) {
            case DRAFT -> to == ApplicationStatus.SUBMITTED || to == ApplicationStatus.WITHDRAWN;
            case SUBMITTED -> to == ApplicationStatus.UNDER_REVIEW || to == ApplicationStatus.WITHDRAWN;
            case UNDER_REVIEW -> to == ApplicationStatus.CLARIFICATION_REQUESTED || to == ApplicationStatus.EVALUATED || to == ApplicationStatus.NOT_SELECTED || to == ApplicationStatus.WITHDRAWN;
            case CLARIFICATION_REQUESTED -> to == ApplicationStatus.UNDER_REVIEW || to == ApplicationStatus.EVALUATED || to == ApplicationStatus.NOT_SELECTED || to == ApplicationStatus.WITHDRAWN;
            case EVALUATED -> to == ApplicationStatus.AWARDED || to == ApplicationStatus.NOT_SELECTED || to == ApplicationStatus.WITHDRAWN;
            case AWARDED, NOT_SELECTED, WITHDRAWN -> false; // Terminal states
        };

        if (!valid) {
            throw new BadRequestException("Illegal state transition from " + from + " to " + to + ".");
        }
    }
}
