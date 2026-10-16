package com.govstart.controller;

import com.govstart.dto.AnalyticsDto;
import com.govstart.dto.ApiResponse;
import com.govstart.service.AnalyticsService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/analytics")
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    public AnalyticsController(AnalyticsService analyticsService) {
        this.analyticsService = analyticsService;
    }

    @GetMapping("/public")
    public ResponseEntity<ApiResponse<AnalyticsDto>> getPublicAnalytics() {
        AnalyticsDto analytics = analyticsService.getPlatformAnalytics();
        return ResponseEntity.ok(ApiResponse.ok(analytics));
    }
}
