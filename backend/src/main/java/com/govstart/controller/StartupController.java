package com.govstart.controller;

import com.govstart.dto.ApiResponse;
import com.govstart.dto.StartupProfileDto;
import com.govstart.security.CustomUserDetails;
import com.govstart.service.StartupService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/startups")
public class StartupController {

    private final StartupService startupService;

    public StartupController(StartupService startupService) {
        this.startupService = startupService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<StartupProfileDto>>> getAllStartups() {
        return ResponseEntity.ok(ApiResponse.ok(startupService.getAllProfiles()));
    }

    @GetMapping("/profile")
    public ResponseEntity<ApiResponse<StartupProfileDto>> getMyProfile(@AuthenticationPrincipal CustomUserDetails userDetails) {
        Long userId = (userDetails != null) ? userDetails.getId() : 4L;
        StartupProfileDto profile = startupService.getProfileByUserId(userId);
        return ResponseEntity.ok(ApiResponse.ok(profile));
    }

    @PutMapping("/profile")
    public ResponseEntity<ApiResponse<StartupProfileDto>> updateMyProfile(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @RequestBody StartupProfileDto dto) {
        Long userId = (userDetails != null) ? userDetails.getId() : 4L;
        StartupProfileDto updated = startupService.updateProfile(userId, dto);
        return ResponseEntity.ok(ApiResponse.ok("Profile updated successfully", updated));
    }

    @GetMapping("/completeness")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getCompleteness(@AuthenticationPrincipal CustomUserDetails userDetails) {
        Long userId = (userDetails != null) ? userDetails.getId() : 4L;
        StartupProfileDto profile = startupService.getProfileByUserId(userId);
        Map<String, Object> data = Map.of(
                "completenessPercentage", profile.getProfileCompletenessPct(),
                "dpiitRecognized", Boolean.TRUE.equals(profile.getDpiitRecognized()),
                "verifiedStatus", profile.getVerifiedStatus()
        );
        return ResponseEntity.ok(ApiResponse.ok(data));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<StartupProfileDto>> getProfileById(@PathVariable Long id) {
        StartupProfileDto profile = startupService.getProfileById(id);
        return ResponseEntity.ok(ApiResponse.ok(profile));
    }
}
