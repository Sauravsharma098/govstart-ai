package com.govstart.controller;

import com.govstart.dto.*;
import com.govstart.entity.AiAnalysisHistory;
import com.govstart.entity.StartupProfile;
import com.govstart.repository.AiAnalysisHistoryRepository;
import com.govstart.repository.StartupProfileRepository;
import com.govstart.security.CustomUserDetails;
import com.govstart.service.AiService;
import com.govstart.service.BidService;
import com.govstart.service.EligibilityService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/ai")
public class AiController {

    private final AiService aiService;
    private final EligibilityService eligibilityService;
    private final BidService bidService;
    private final StartupProfileRepository startupProfileRepository;
    private final AiAnalysisHistoryRepository analysisHistoryRepository;

    public AiController(AiService aiService,
                        EligibilityService eligibilityService,
                        BidService bidService,
                        StartupProfileRepository startupProfileRepository,
                        AiAnalysisHistoryRepository analysisHistoryRepository) {
        this.aiService = aiService;
        this.eligibilityService = eligibilityService;
        this.bidService = bidService;
        this.startupProfileRepository = startupProfileRepository;
        this.analysisHistoryRepository = analysisHistoryRepository;
    }

    @PostMapping("/match")
    public ResponseEntity<ApiResponse<MatchResponseDto>> matchTender(
            @Valid @RequestBody MatchRequestDto request,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        Long startupId = request.getStartupId();
        if (startupId == null && userDetails != null) {
            startupId = startupProfileRepository.findByUserId(userDetails.getId())
                    .map(StartupProfile::getId).orElse(null);
        }
        if (startupId == null) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Startup profile not found for current user"));
        }

        MatchResponseDto result = aiService.matchStartupWithTender(startupId, request.getTenderId(), request.getWeights());
        return ResponseEntity.ok(ApiResponse.ok("AI Tender Matching completed", result));
    }

    @PostMapping("/eligibility")
    public ResponseEntity<ApiResponse<EligibilityResponseDto>> checkEligibility(
            @RequestBody Map<String, Long> payload,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        Long tenderId = payload.get("tenderId");
        if (tenderId == null) {
            return ResponseEntity.badRequest().body(ApiResponse.error("tenderId is required"));
        }
        Long startupId = payload.get("startupId");
        if (startupId == null && userDetails != null) {
            startupId = startupProfileRepository.findByUserId(userDetails.getId())
                    .map(StartupProfile::getId).orElse(null);
        }
        if (startupId == null) {
            startupId = 1L; // default to first demo startup if not authenticated
        }

        EligibilityResponseDto result = eligibilityService.checkEligibility(startupId, tenderId);
        return ResponseEntity.ok(ApiResponse.ok("Eligibility evaluation completed", result));
    }

    @PostMapping("/proposal-draft")
    public ResponseEntity<ApiResponse<ProposalDraftDto>> generateProposalDraft(
            @RequestBody Map<String, Long> payload,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        Long tenderId = payload.get("tenderId");
        if (tenderId == null) {
            return ResponseEntity.badRequest().body(ApiResponse.error("tenderId is required"));
        }
        Long startupId = payload.get("startupId");
        if (startupId == null && userDetails != null) {
            startupId = startupProfileRepository.findByUserId(userDetails.getId())
                    .map(StartupProfile::getId).orElse(null);
        }
        if (startupId == null) {
            startupId = 1L;
        }

        ProposalDraftDto draft = bidService.generateInitialDraft(startupId, tenderId);
        return ResponseEntity.ok(ApiResponse.ok("Proposal draft generated successfully", draft));
    }

    @GetMapping("/proposal-draft/{tenderId}")
    public ResponseEntity<ApiResponse<ProposalDraftDto>> getProposalDraft(
            @PathVariable Long tenderId,
            @RequestParam(required = false) Long startupId,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        if (startupId == null && userDetails != null) {
            startupId = startupProfileRepository.findByUserId(userDetails.getId())
                    .map(StartupProfile::getId).orElse(null);
        }
        if (startupId == null) {
            startupId = 1L;
        }

        ProposalDraftDto draft = bidService.getDraft(startupId, tenderId);
        return ResponseEntity.ok(ApiResponse.ok(draft));
    }

    @PutMapping("/proposal-draft")
    public ResponseEntity<ApiResponse<ProposalDraftDto>> saveProposalDraft(
            @RequestBody ProposalDraftDto dto,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        if (dto.getStartupId() == null && userDetails != null) {
            startupProfileRepository.findByUserId(userDetails.getId())
                    .ifPresent(p -> dto.setStartupId(p.getId()));
        }
        if (dto.getStartupId() == null) {
            dto.setStartupId(1L);
        }

        ProposalDraftDto saved = bidService.saveDraft(dto);
        return ResponseEntity.ok(ApiResponse.ok("Proposal draft updated successfully", saved));
    }

    @GetMapping("/proposal-draft/{tenderId}/export")
    public ResponseEntity<ApiResponse<String>> exportProposalMarkdown(
            @PathVariable Long tenderId,
            @RequestParam(required = false) Long startupId,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        if (startupId == null && userDetails != null) {
            startupId = startupProfileRepository.findByUserId(userDetails.getId())
                    .map(StartupProfile::getId).orElse(null);
        }
        if (startupId == null) {
            startupId = 1L;
        }

        String markdown = bidService.exportDraftAsMarkdown(startupId, tenderId);
        return ResponseEntity.ok(ApiResponse.ok("Draft exported", markdown));
    }

    @PostMapping("/analyze-document")
    public ResponseEntity<ApiResponse<Map<String, Object>>> analyzeDocument(
            @RequestBody Map<String, String> payload,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        String text = payload.get("text");
        if (text == null || text.isBlank()) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Document text is required for analysis."));
        }
        Long userId = (userDetails != null) ? userDetails.getId() : null;
        Map<String, Object> summary = aiService.summarizeTenderText(text, userId);
        return ResponseEntity.ok(ApiResponse.ok("Document summarization completed", summary));
    }

    @PostMapping("/chat")
    public ResponseEntity<ApiResponse<ChatResponseDto>> chat(
            @Valid @RequestBody ChatRequestDto request,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        ChatResponseDto response = aiService.chatAboutTender(request, userDetails != null ? userDetails.getUser() : null);
        return ResponseEntity.ok(ApiResponse.ok(response));
    }

    @GetMapping("/analysis/history")
    public ResponseEntity<ApiResponse<List<AiAnalysisHistory>>> getHistory(
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        Long userId = (userDetails != null) ? userDetails.getId() : 1L;
        List<AiAnalysisHistory> history = analysisHistoryRepository.findByUserIdOrderByCreatedAtDesc(userId);
        return ResponseEntity.ok(ApiResponse.ok(history));
    }
}
