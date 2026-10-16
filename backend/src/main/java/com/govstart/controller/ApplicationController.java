package com.govstart.controller;

import com.govstart.dto.ApiResponse;
import com.govstart.dto.ApplicationResponseDto;
import com.govstart.dto.ApplicationSubmitDto;
import com.govstart.dto.ClarificationRequestDto;
import com.govstart.dto.StatusUpdateDto;
import com.govstart.security.CustomUserDetails;
import com.govstart.service.ApplicationService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/applications")
public class ApplicationController {

    private final ApplicationService applicationService;

    public ApplicationController(ApplicationService applicationService) {
        this.applicationService = applicationService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<ApplicationResponseDto>> submitApplication(
            @Valid @RequestBody ApplicationSubmitDto dto,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        Long userId = (userDetails != null) ? userDetails.getId() : 4L;
        ApplicationResponseDto response = applicationService.submitApplication(userId, dto);
        return ResponseEntity.ok(ApiResponse.ok("Application submitted successfully", response));
    }

    @GetMapping("/my")
    public ResponseEntity<ApiResponse<List<ApplicationResponseDto>>> getMyApplications(
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        Long userId = (userDetails != null) ? userDetails.getId() : 4L;
        List<ApplicationResponseDto> apps = applicationService.getApplicationsForStartup(userId);
        return ResponseEntity.ok(ApiResponse.ok(apps));
    }

    @GetMapping("/tender/{tenderId}")
    public ResponseEntity<ApiResponse<List<ApplicationResponseDto>>> getApplicationsByTender(
            @PathVariable Long tenderId) {
        List<ApplicationResponseDto> apps = applicationService.getApplicationsForTender(tenderId);
        return ResponseEntity.ok(ApiResponse.ok(apps));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ApplicationResponseDto>> getApplicationById(
            @PathVariable Long id) {
        ApplicationResponseDto app = applicationService.getApplicationById(id);
        return ResponseEntity.ok(ApiResponse.ok(app));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<ApiResponse<ApplicationResponseDto>> updateStatus(
            @PathVariable Long id,
            @Valid @RequestBody StatusUpdateDto dto,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        Long officerId = (userDetails != null) ? userDetails.getId() : 2L;
        ApplicationResponseDto updated = applicationService.updateApplicationStatusByOfficer(officerId, id, dto);
        return ResponseEntity.ok(ApiResponse.ok("Application status updated", updated));
    }

    @PostMapping("/{id}/clarification")
    public ResponseEntity<ApiResponse<ApplicationResponseDto>> requestClarification(
            @PathVariable Long id,
            @Valid @RequestBody ClarificationRequestDto dto,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        dto.setApplicationId(id);
        Long officerId = (userDetails != null) ? userDetails.getId() : 2L;
        ApplicationResponseDto res = applicationService.requestClarification(officerId, dto);
        return ResponseEntity.ok(ApiResponse.ok("Clarification requested", res));
    }
}
