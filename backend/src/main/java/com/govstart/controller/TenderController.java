package com.govstart.controller;

import com.govstart.dto.ApiResponse;
import com.govstart.dto.TenderDto;
import com.govstart.entity.Department;
import com.govstart.entity.TenderCategory;
import com.govstart.entity.TenderStatus;
import com.govstart.entity.User;
import com.govstart.repository.UserRepository;
import com.govstart.security.CustomUserDetails;
import com.govstart.service.TenderService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/tenders")
public class TenderController {

    private final TenderService tenderService;
    private final UserRepository userRepository;

    public TenderController(TenderService tenderService, UserRepository userRepository) {
        this.tenderService = tenderService;
        this.userRepository = userRepository;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<Page<TenderDto>>> getTenders(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) Long departmentId,
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) BigDecimal maxBudget,
            @RequestParam(required = false) TenderStatus status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "deadline") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir,
            @AuthenticationPrincipal CustomUserDetails userDetails) {

        Long currentUserId = (userDetails != null) ? userDetails.getId() : null;
        Page<TenderDto> results = tenderService.searchTenders(
                keyword, departmentId, categoryId, maxBudget, status, page, size, sortBy, sortDir, currentUserId
        );
        return ResponseEntity.ok(ApiResponse.ok(results));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<TenderDto>> getTenderById(
            @PathVariable Long id,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        Long currentUserId = (userDetails != null) ? userDetails.getId() : null;
        TenderDto dto = tenderService.getTenderById(id, currentUserId);
        return ResponseEntity.ok(ApiResponse.ok(dto));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<TenderDto>> createTender(
            @Valid @RequestBody TenderDto dto,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        User officer = (userDetails != null) ? userDetails.getUser() : null;
        if (officer == null) {
            officer = userRepository.findByEmail("officer.defence@govstart.demo")
                    .orElseGet(() -> userRepository.findAll().stream().findFirst().orElse(null));
        }
        TenderDto created = tenderService.createTender(dto, officer);
        return ResponseEntity.ok(ApiResponse.ok("Tender published successfully", created));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<ApiResponse<TenderDto>> updateStatus(
            @PathVariable Long id,
            @RequestParam TenderStatus status,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        User officer = (userDetails != null) ? userDetails.getUser() : null;
        if (officer == null) {
            officer = userRepository.findByEmail("officer.defence@govstart.demo").orElse(null);
        }
        TenderDto updated = tenderService.updateTenderStatus(id, status, officer);
        return ResponseEntity.ok(ApiResponse.ok("Tender status updated to " + status, updated));
    }

    @PostMapping("/{id}/save")
    public ResponseEntity<ApiResponse<Void>> saveTender(
            @PathVariable Long id,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        Long userId = (userDetails != null) ? userDetails.getId() : 4L; // default to first demo startup
        tenderService.saveTenderForUser(userId, id);
        return ResponseEntity.ok(ApiResponse.ok("Tender saved to bookmarks", null));
    }

    @DeleteMapping("/{id}/save")
    public ResponseEntity<ApiResponse<Void>> unsaveTender(
            @PathVariable Long id,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        Long userId = (userDetails != null) ? userDetails.getId() : 4L;
        tenderService.unsaveTenderForUser(userId, id);
        return ResponseEntity.ok(ApiResponse.ok("Tender removed from bookmarks", null));
    }

    @GetMapping("/saved")
    public ResponseEntity<ApiResponse<List<TenderDto>>> getSavedTenders(
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        Long userId = (userDetails != null) ? userDetails.getId() : 4L;
        List<TenderDto> saved = tenderService.getSavedTendersForUser(userId);
        return ResponseEntity.ok(ApiResponse.ok(saved));
    }

    @GetMapping("/departments")
    public ResponseEntity<ApiResponse<List<Department>>> getDepartments() {
        return ResponseEntity.ok(ApiResponse.ok(tenderService.getAllDepartments()));
    }

    @GetMapping("/categories")
    public ResponseEntity<ApiResponse<List<TenderCategory>>> getCategories() {
        return ResponseEntity.ok(ApiResponse.ok(tenderService.getAllCategories()));
    }
}
