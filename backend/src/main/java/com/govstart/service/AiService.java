package com.govstart.service;

import com.govstart.dto.ChatRequestDto;
import com.govstart.dto.ChatResponseDto;
import com.govstart.dto.MatchRequestDto;
import com.govstart.dto.MatchResponseDto;
import com.govstart.entity.*;
import com.govstart.exception.ResourceNotFoundException;
import com.govstart.repository.AiAnalysisHistoryRepository;
import com.govstart.repository.StartupProfileRepository;
import com.govstart.repository.TenderMatchRepository;
import com.govstart.repository.TenderRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.Duration;
import java.time.LocalDateTime;
import java.util.*;

@Service
public class AiService {

    private static final Logger log = LoggerFactory.getLogger(AiService.class);

    private final TenderRepository tenderRepository;
    private final StartupProfileRepository startupProfileRepository;
    private final TenderMatchRepository tenderMatchRepository;
    private final AiAnalysisHistoryRepository analysisHistoryRepository;
    private final RestTemplate restTemplate;

    @Value("${govstart.ai-service.url:http://localhost:8000}")
    private String aiServiceBaseUrl;

    @Value("${govstart.ai-service.internal-key:govstart-internal-ai-secret-2026}")
    private String internalApiKey;

    public AiService(TenderRepository tenderRepository,
                     StartupProfileRepository startupProfileRepository,
                     TenderMatchRepository tenderMatchRepository,
                     AiAnalysisHistoryRepository analysisHistoryRepository,
                     RestTemplateBuilder restTemplateBuilder) {
        this.tenderRepository = tenderRepository;
        this.startupProfileRepository = startupProfileRepository;
        this.tenderMatchRepository = tenderMatchRepository;
        this.analysisHistoryRepository = analysisHistoryRepository;
        this.restTemplate = restTemplateBuilder
                .setConnectTimeout(Duration.ofMillis(3000))
                .setReadTimeout(Duration.ofMillis(6000))
                .build();
    }

    public MatchResponseDto matchStartupWithTender(Long startupId, Long tenderId, Map<String, Double> weights) {
        StartupProfile startup = startupProfileRepository.findById(startupId)
                .orElseThrow(() -> new ResourceNotFoundException("Startup profile not found with id: " + startupId));
        Tender tender = tenderRepository.findById(tenderId)
                .orElseThrow(() -> new ResourceNotFoundException("Tender not found with id: " + tenderId));

        long startTime = System.currentTimeMillis();

        // 1. Try calling the Python FastAPI Microservice
        try {
            String url = aiServiceBaseUrl + "/api/match";
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("X-Internal-Token", internalApiKey);

            Map<String, Object> body = new HashMap<>();
            body.put("startup", buildStartupPayload(startup));
            body.put("tender", buildTenderPayload(tender));
            if (weights != null) body.put("weights", weights);

            HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);
            ResponseEntity<Map> response = restTemplate.postForEntity(url, request, Map.class);

            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                Map<String, Object> resBody = response.getBody();
                if (Boolean.TRUE.equals(resBody.get("success"))) {
                    Map<String, Object> data = (Map<String, Object>) resBody.get("data");
                    MatchResponseDto result = parseFastApiMatchResponse(data, startup, tender);
                    saveMatchRecord(startup, tender, result);
                    saveAnalysisHistory(startup.getUser(), tender.getId(), "MATCHING", "Match calculation", result.getExplanation(), System.currentTimeMillis() - startTime);
                    return result;
                }
            }
        } catch (Exception e) {
            log.warn("FastAPI microservice unreachable or returned error ({}), falling back to deterministic local rule engine.", e.getMessage());
        }

        // 2. Deterministic Local Rule-based Fallback
        MatchResponseDto fallback = calculateLocalMatch(startup, tender, weights);
        saveMatchRecord(startup, tender, fallback);
        saveAnalysisHistory(startup.getUser(), tender.getId(), "MATCHING", "Deterministic local match", fallback.getExplanation(), System.currentTimeMillis() - startTime);
        return fallback;
    }

    public ChatResponseDto chatAboutTender(ChatRequestDto requestDto, User user) {
        Tender tender = tenderRepository.findById(requestDto.getTenderId())
                .orElseThrow(() -> new ResourceNotFoundException("Tender not found with id: " + requestDto.getTenderId()));

        StartupProfile startup = (user != null) ? startupProfileRepository.findByUserId(user.getId()).orElse(null) : null;
        long startTime = System.currentTimeMillis();

        // Try Python AI microservice first
        try {
            String url = aiServiceBaseUrl + "/api/chat";
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("X-Internal-Token", internalApiKey);

            Map<String, Object> body = new HashMap<>();
            body.put("query", requestDto.getQuery());
            body.put("tender", buildTenderPayload(tender));
            if (startup != null) body.put("startup", buildStartupPayload(startup));

            HttpEntity<Map<String, Object>> req = new HttpEntity<>(body, headers);
            ResponseEntity<Map> res = restTemplate.postForEntity(url, req, Map.class);

            if (res.getStatusCode().is2xxSuccessful() && res.getBody() != null) {
                Map<String, Object> resBody = res.getBody();
                Map<String, Object> data = (Map<String, Object>) resBody.get("data");
                ChatResponseDto dto = new ChatResponseDto();
                dto.setQuery(requestDto.getQuery());
                dto.setAnswer((String) data.get("answer"));
                dto.setFlagged(Boolean.TRUE.equals(data.get("flagged")));
                dto.setReason((String) data.get("reason"));
                dto.setCitations((List<Map<String, String>>) data.get("citations"));
                dto.setTenderReference(tender.getReferenceNumber());
                dto.setDisclaimer((String) data.get("disclaimer"));

                if (user != null) {
                    saveAnalysisHistory(user, tender.getId(), "CHAT", requestDto.getQuery(), dto.getAnswer(), System.currentTimeMillis() - startTime);
                }
                return dto;
            }
        } catch (Exception e) {
            log.warn("FastAPI chat unavailable ({}), falling back to local grounded Q&A.", e.getMessage());
        }

        // Local grounded Q&A fallback
        ChatResponseDto fallback = localChatGrounded(requestDto.getQuery(), tender, startup);
        if (user != null) {
            saveAnalysisHistory(user, tender.getId(), "CHAT", requestDto.getQuery(), fallback.getAnswer(), System.currentTimeMillis() - startTime);
        }
        return fallback;
    }

    public Map<String, Object> summarizeTenderText(String tenderText, Long userId) {
        try {
            String url = aiServiceBaseUrl + "/api/summarize-text";
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("X-Internal-Token", internalApiKey);

            Map<String, String> body = Map.of("tender_text", tenderText);
            HttpEntity<Map<String, String>> req = new HttpEntity<>(body, headers);
            ResponseEntity<Map> res = restTemplate.postForEntity(url, req, Map.class);
            if (res.getStatusCode().is2xxSuccessful() && res.getBody() != null) {
                return (Map<String, Object>) res.getBody().get("data");
            }
        } catch (Exception e) {
            log.warn("FastAPI summarize unavailable ({}), providing local fallback summary.", e.getMessage());
        }

        // Local summary fallback
        Map<String, Object> fallback = new HashMap<>();
        fallback.put("summary", "Document processed locally. Length: " + tenderText.length() + " chars.");
        fallback.put("reference_number", Map.of("value", "N/A (Local parse)", "page", 1));
        fallback.put("budget", Map.of("value", "Not found", "page", 1));
        fallback.put("deadline", Map.of("value", "Not found", "page", 1));
        return fallback;
    }

    private MatchResponseDto calculateLocalMatch(StartupProfile startup, Tender tender, Map<String, Double> weights) {
        double sectorScore = 30.0;
        String sSector = (startup.getSector() != null) ? startup.getSector().toLowerCase() : "";
        String tDesc = (tender.getDescription() != null) ? tender.getDescription().toLowerCase() : "";
        String tTitle = (tender.getTitle() != null) ? tender.getTitle().toLowerCase() : "";

        if (!sSector.isEmpty() && (tDesc.contains(sSector) || tTitle.contains(sSector))) {
            sectorScore = 100.0;
        } else if (sSector.contains("defence") && (tDesc.contains("drdo") || tTitle.contains("threat") || tDesc.contains("uav"))) {
            sectorScore = 95.0;
        } else if (sSector.contains("health") && (tDesc.contains("health") || tDesc.contains("nhm") || tTitle.contains("medical"))) {
            sectorScore = 95.0;
        } else if (sSector.contains("energy") && (tDesc.contains("solar") || tDesc.contains("grid") || tDesc.contains("seci"))) {
            sectorScore = 90.0;
        } else if (sSector.contains("agri") && (tDesc.contains("crop") || tDesc.contains("icar") || tDesc.contains("soil"))) {
            sectorScore = 95.0;
        } else if (sSector.contains("cyber") && (tDesc.contains("zero-trust") || tDesc.contains("security") || tDesc.contains("cloud"))) {
            sectorScore = 95.0;
        }

        List<String> matchedSkills = new ArrayList<>();
        List<String> missingRequirements = new ArrayList<>();
        String rawSkills = startup.getPrimarySkills() != null ? startup.getPrimarySkills().toLowerCase() : "";
        String[] tSkills = tender.getRequiredSkills() != null ? tender.getRequiredSkills().split(",") : new String[0];

        for (String req : tSkills) {
            String trimmed = req.trim();
            if (!trimmed.isEmpty() && rawSkills.contains(trimmed.toLowerCase())) {
                matchedSkills.add(trimmed);
            } else if (!trimmed.isEmpty()) {
                missingRequirements.add(trimmed);
            }
        }

        double skillsScore = tSkills.length > 0 ? ((double) matchedSkills.size() / tSkills.length) * 100.0 : 70.0;
        skillsScore = Math.min(100.0, skillsScore);

        double expScore = 60.0;
        if (startup.getFoundedYear() != null && (2026 - startup.getFoundedYear()) >= 3) expScore += 20.0;
        if (startup.getPastExperience() != null && startup.getPastExperience().length() > 30) expScore += 20.0;
        expScore = Math.min(100.0, expScore);

        double eligScore = Boolean.TRUE.equals(startup.getDpiitRecognized()) ? 95.0 : 65.0;

        double wSector = (weights != null && weights.containsKey("sector")) ? weights.get("sector") : 25.0;
        double wSkills = (weights != null && weights.containsKey("skills")) ? weights.get("skills") : 35.0;
        double wExp = (weights != null && weights.containsKey("experience")) ? weights.get("experience") : 20.0;
        double wElig = (weights != null && weights.containsKey("eligibility")) ? weights.get("eligibility") : 20.0;
        double totalW = wSector + wSkills + wExp + wElig;

        double finalScore = ((sectorScore * wSector) + (skillsScore * wSkills) + (expScore * wExp) + (eligScore * wElig)) / totalW;
        BigDecimal scoreBd = BigDecimal.valueOf(finalScore).setScale(1, RoundingMode.HALF_UP);

        String status = finalScore >= 80.0 ? "HIGHLY_RELEVANT" : (finalScore >= 55.0 ? "MODERATE" : "LOW_MATCH");

        MatchResponseDto dto = new MatchResponseDto();
        dto.setTenderId(tender.getId());
        dto.setStartupId(startup.getId());
        dto.setRelevanceScore(scoreBd);
        dto.setPreliminaryStatus(status);
        dto.setMatchedSkills(matchedSkills);
        dto.setMissingRequirements(missingRequirements);
        dto.setComponentScores(Map.of("sector", sectorScore, "skills", skillsScore, "experience", expScore, "eligibility", eligScore));
        dto.setExplanation("Deterministic Rule Match: " + scoreBd + "% relevance. Sector: " + Math.round(sectorScore) + "%. Matched " + matchedSkills.size() + " of " + tSkills.length + " required competencies.");
        return dto;
    }

    private ChatResponseDto localChatGrounded(String query, Tender tender, StartupProfile startup) {
        String q = query.toLowerCase();
        String answer;
        List<Map<String, String>> citations = new ArrayList<>();

        if (q.contains("deadline") || q.contains("date") || q.contains("due") || q.contains("when")) {
            answer = "The submission deadline for " + tender.getReferenceNumber() + " is " + tender.getDeadline() + ". Ensure all digital bid documents are submitted prior to this date.";
            citations.add(Map.of("field", "Deadline", "source", "Tender Key Dates"));
        } else if (q.contains("budget") || q.contains("cost") || q.contains("price") || q.contains("inr")) {
            answer = "The estimated procurement budget is INR " + tender.getBudgetInr().toPlainString() + ". Pricing should be strictly compliant with the commercial schedule.";
            citations.add(Map.of("field", "Budget", "source", "Commercial Schedule"));
        } else if (q.contains("eligibility") || q.contains("turnover") || q.contains("dpiit")) {
            answer = "Tender eligibility requirements: " + tender.getEligibilityCriteria() + ". DPIIT recognized startups receive turnover & EMD exemptions under the Government Startup Policy.";
            citations.add(Map.of("field", "Eligibility Criteria", "source", "Section 2.1"));
        } else {
            answer = "Tender '" + tender.getTitle() + "' (" + tender.getReferenceNumber() + ") by " + tender.getDepartment().getName() + ". Budget: INR " + tender.getBudgetInr().toPlainString() + ". Required competencies: " + tender.getRequiredSkills() + ".";
            citations.add(Map.of("field", "Tender Overview", "source", "Summary Sheet"));
        }

        ChatResponseDto dto = new ChatResponseDto();
        dto.setQuery(query);
        dto.setAnswer(answer);
        dto.setFlagged(false);
        dto.setCitations(citations);
        dto.setTenderReference(tender.getReferenceNumber());
        dto.setDisclaimer("Grounded in official tender clauses. Subject to competent authority terms.");
        return dto;
    }

    private void saveMatchRecord(StartupProfile startup, Tender tender, MatchResponseDto res) {
        try {
            TenderMatch match = tenderMatchRepository.findByStartupIdAndTenderId(startup.getId(), tender.getId())
                    .orElseGet(TenderMatch::new);
            match.setStartup(startup);
            match.setTender(tender);
            match.setRelevanceScore(res.getRelevanceScore());
            match.setMatchedSkills(res.getMatchedSkills() != null ? res.getMatchedSkills().toString() : "[]");
            match.setMissingRequirements(res.getMissingRequirements() != null ? res.getMissingRequirements().toString() : "[]");
            match.setExplanation(res.getExplanation());
            match.setPreliminaryStatus(res.getPreliminaryStatus());
            match.setCalculatedAt(LocalDateTime.now());
            tenderMatchRepository.save(match);
        } catch (Exception e) {
            log.error("Failed to cache tender match in database", e);
        }
    }

    private void saveAnalysisHistory(User user, Long tenderId, String type, String query, String result, long execTime) {
        try {
            AiAnalysisHistory history = new AiAnalysisHistory();
            history.setUser(user);
            history.setTenderId(tenderId);
            history.setAnalysisType(type);
            history.setQueryOrInput(query);
            history.setResultSummary(result);
            history.setExecutionTimeMs(execTime);
            history.setCreatedAt(LocalDateTime.now());
            analysisHistoryRepository.save(history);
        } catch (Exception e) {
            // Non-critical
        }
    }

    private Map<String, Object> buildStartupPayload(StartupProfile s) {
        Map<String, Object> map = new HashMap<>();
        map.put("company_name", s.getCompanyName());
        map.put("sector", s.getSector());
        map.put("dpiit_recognized", s.getDpiitRecognized());
        map.put("dpiit_number", s.getDpiitNumber());
        map.put("annual_turnover", s.getAnnualTurnover());
        map.put("founded_year", s.getFoundedYear());
        map.put("location_city", s.getLocationCity());
        map.put("location_state", s.getLocationState());
        map.put("primary_skills", s.getPrimarySkills());
        map.put("certifications", s.getCertifications());
        map.put("past_experience", s.getPastExperience());
        map.put("verified_status", s.getVerifiedStatus());
        return map;
    }

    private Map<String, Object> buildTenderPayload(Tender t) {
        Map<String, Object> map = new HashMap<>();
        map.put("reference_number", t.getReferenceNumber());
        map.put("title", t.getTitle());
        map.put("department", t.getDepartment() != null ? t.getDepartment().getName() : "");
        map.put("category", t.getCategory() != null ? t.getCategory().getName() : "");
        map.put("budget_inr", t.getBudgetInr());
        map.put("deadline", t.getDeadline().toString());
        map.put("description", t.getDescription());
        map.put("required_skills", t.getRequiredSkills());
        map.put("eligibility_criteria", t.getEligibilityCriteria());
        map.put("required_documents", t.getRequiredDocuments());
        map.put("evaluation_criteria", t.getEvaluationCriteria());
        return map;
    }

    private MatchResponseDto parseFastApiMatchResponse(Map<String, Object> data, StartupProfile startup, Tender tender) {
        MatchResponseDto dto = new MatchResponseDto();
        dto.setStartupId(startup.getId());
        dto.setTenderId(tender.getId());
        Number score = (Number) data.get("relevance_score");
        dto.setRelevanceScore(BigDecimal.valueOf(score.doubleValue()).setScale(1, RoundingMode.HALF_UP));
        dto.setPreliminaryStatus((String) data.get("preliminary_status"));
        dto.setMatchedSkills((List<String>) data.get("matched_skills"));
        dto.setMissingRequirements((List<String>) data.get("missing_requirements"));
        dto.setComponentScores((Map<String, Object>) data.get("component_scores"));
        dto.setExplanation((String) data.get("explanation"));
        return dto;
    }
}
