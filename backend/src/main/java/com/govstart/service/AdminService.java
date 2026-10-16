package com.govstart.service;

import com.govstart.entity.*;
import com.govstart.exception.ResourceNotFoundException;
import com.govstart.repository.AuditLogRepository;
import com.govstart.repository.UserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class AdminService {

    private final UserRepository userRepository;
    private final AuditLogRepository auditLogRepository;
    private final AuditService auditService;
    private final RestTemplate restTemplate = new RestTemplate();

    @Value("${govstart.ai-service.url:http://localhost:8000}")
    private String aiServiceBaseUrl;

    // In-memory configurable AI weights with thread-safe map
    private final Map<String, Double> dynamicAiWeights = new ConcurrentHashMap<>(Map.of(
            "sector", 25.0,
            "skills", 35.0,
            "experience", 20.0,
            "eligibility", 20.0
    ));

    public AdminService(UserRepository userRepository,
                        AuditLogRepository auditLogRepository,
                        AuditService auditService) {
        this.userRepository = userRepository;
        this.auditLogRepository = auditLogRepository;
        this.auditService = auditService;
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @Transactional
    public User approveOfficer(Long userId, Long adminUserId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));
        user.setRole(Role.OFFICER);
        user.setStatus(UserStatus.ACTIVE);
        user = userRepository.save(user);

        auditService.logAction(adminUserId, "APPROVE_OFFICER", "Users", user.getId(), "0.0.0.0", "Officer status approved for: " + user.getEmail());
        return user;
    }

    @Transactional
    public User toggleUserStatus(Long userId, UserStatus status, Long adminUserId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));
        user.setStatus(status);
        user = userRepository.save(user);

        auditService.logAction(adminUserId, "USER_STATUS_CHANGE", "Users", user.getId(), "0.0.0.0", "User status changed to " + status + " for " + user.getEmail());
        return user;
    }

    public Map<String, Double> getAiWeights() {
        return new HashMap<>(dynamicAiWeights);
    }

    public Map<String, Double> updateAiWeights(Map<String, Double> weights, Long adminUserId) {
        dynamicAiWeights.putAll(weights);
        auditService.logAction(adminUserId, "UPDATE_AI_WEIGHTS", "SystemConfig", 0L, "0.0.0.0", "Updated matching weights: " + weights);
        return getAiWeights();
    }

    public Page<AuditLog> getAuditLogs(int page, int size) {
        return auditLogRepository.findAllByOrderByTimestampDesc(PageRequest.of(page, size));
    }

    public Map<String, Object> getSystemHealth() {
        Map<String, Object> health = new HashMap<>();
        health.put("backendStatus", "UP");
        health.put("databaseType", "MySQL 8.x / Flyway");
        health.put("databaseStatus", "CONNECTED");

        // Ping Python AI Microservice
        try {
            Map aiResponse = restTemplate.getForObject(aiServiceBaseUrl + "/health", Map.class);
            health.put("aiServiceStatus", "UP");
            health.put("aiServiceDetails", aiResponse);
        } catch (Exception e) {
            health.put("aiServiceStatus", "STANDALONE_FALLBACK_ACTIVE");
            health.put("aiServiceDetails", "Microservice offline: Deterministic local Java AI fallback in operation.");
        }

        health.put("jvmFreeMemoryMB", Runtime.getRuntime().freeMemory() / (1024 * 1024));
        health.put("jvmTotalMemoryMB", Runtime.getRuntime().totalMemory() / (1024 * 1024));
        return health;
    }
}
