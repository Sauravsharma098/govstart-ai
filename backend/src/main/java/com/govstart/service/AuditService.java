package com.govstart.service;

import com.govstart.entity.AuditLog;
import com.govstart.repository.AuditLogRepository;
import org.springframework.stereotype.Service;

@Service
public class AuditService {

    private final AuditLogRepository auditLogRepository;

    public AuditService(AuditLogRepository auditLogRepository) {
        this.auditLogRepository = auditLogRepository;
    }

    public void logAction(Long userId, String action, String entityName, Long entityId, String ipAddress, String details) {
        try {
            AuditLog log = new AuditLog(userId, action, entityName, entityId, ipAddress, details);
            auditLogRepository.save(log);
        } catch (Exception e) {
            // Audit logging should never crash the main transaction
        }
    }
}
