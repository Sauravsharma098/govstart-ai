package com.govstart.service;

import com.govstart.dto.TenderDto;
import com.govstart.entity.*;
import com.govstart.exception.BadRequestException;
import com.govstart.exception.ResourceNotFoundException;
import com.govstart.repository.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class TenderService {

    private final TenderRepository tenderRepository;
    private final DepartmentRepository departmentRepository;
    private final TenderCategoryRepository categoryRepository;
    private final SavedTenderRepository savedTenderRepository;
    private final UserRepository userRepository;
    private final AuditService auditService;

    public TenderService(TenderRepository tenderRepository,
                         DepartmentRepository departmentRepository,
                         TenderCategoryRepository categoryRepository,
                         SavedTenderRepository savedTenderRepository,
                         UserRepository userRepository,
                         AuditService auditService) {
        this.tenderRepository = tenderRepository;
        this.departmentRepository = departmentRepository;
        this.categoryRepository = categoryRepository;
        this.savedTenderRepository = savedTenderRepository;
        this.userRepository = userRepository;
        this.auditService = auditService;
    }

    public Page<TenderDto> searchTenders(String keyword, Long departmentId, Long categoryId,
                                         BigDecimal maxBudget, TenderStatus status,
                                         int page, int size, String sortBy, String sortDir,
                                         Long currentUserId) {
        Sort sort = sortDir.equalsIgnoreCase("desc") ?
                Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);

        TenderStatus queryStatus = (status != null) ? status : TenderStatus.PUBLISHED;
        Page<Tender> tenders = tenderRepository.searchTenders(keyword, departmentId, categoryId, maxBudget, queryStatus, pageable);

        return tenders.map(t -> {
            TenderDto dto = TenderDto.fromEntity(t);
            if (currentUserId != null) {
                dto.setIsSaved(savedTenderRepository.existsByUserIdAndTenderId(currentUserId, t.getId()));
            }
            return dto;
        });
    }

    public TenderDto getTenderById(Long id, Long currentUserId) {
        Tender tender = tenderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Tender not found with id: " + id));
        TenderDto dto = TenderDto.fromEntity(tender);
        if (currentUserId != null) {
            dto.setIsSaved(savedTenderRepository.existsByUserIdAndTenderId(currentUserId, tender.getId()));
        }
        return dto;
    }

    public Tender getEntityById(Long id) {
        return tenderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Tender not found with id: " + id));
    }

    @Transactional
    public void saveTenderForUser(Long userId, Long tenderId) {
        if (savedTenderRepository.existsByUserIdAndTenderId(userId, tenderId)) {
            return; // Already saved
        }
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));
        Tender tender = tenderRepository.findById(tenderId)
                .orElseThrow(() -> new ResourceNotFoundException("Tender not found with id: " + tenderId));

        savedTenderRepository.save(new SavedTender(user, tender));
        auditService.logAction(userId, "TENDER_SAVED", "Tenders", tenderId, "0.0.0.0", "Saved tender: " + tender.getReferenceNumber());
    }

    @Transactional
    public void unsaveTenderForUser(Long userId, Long tenderId) {
        savedTenderRepository.deleteByUserIdAndTenderId(userId, tenderId);
        auditService.logAction(userId, "TENDER_UNSAVED", "Tenders", tenderId, "0.0.0.0", "Removed tender from saved list: " + tenderId);
    }

    public List<TenderDto> getSavedTendersForUser(Long userId) {
        return savedTenderRepository.findByUserId(userId).stream()
                .map(st -> {
                    TenderDto dto = TenderDto.fromEntity(st.getTender());
                    dto.setIsSaved(true);
                    return dto;
                })
                .collect(Collectors.toList());
    }

    public List<Department> getAllDepartments() {
        return departmentRepository.findAllByIsActiveTrue();
    }

    public List<TenderCategory> getAllCategories() {
        return categoryRepository.findAll();
    }

    @Transactional
    public TenderDto createTender(TenderDto dto, User officer) {
        Department dept = departmentRepository.findById(dto.getDepartmentId())
                .orElseThrow(() -> new ResourceNotFoundException("Department not found with id: " + dto.getDepartmentId()));
        TenderCategory cat = categoryRepository.findById(dto.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + dto.getCategoryId()));

        Tender tender = new Tender();
        tender.setReferenceNumber(dto.getReferenceNumber().trim());
        tender.setTitle(dto.getTitle().trim());
        tender.setDescription(dto.getDescription().trim());
        tender.setDepartment(dept);
        tender.setCategory(cat);
        tender.setBudgetInr(dto.getBudgetInr());
        tender.setPublicationDate(dto.getPublicationDate() != null ? dto.getPublicationDate() : java.time.LocalDate.now());
        tender.setDeadline(dto.getDeadline());
        tender.setEligibilityCriteria(dto.getEligibilityCriteria().trim());
        tender.setRequiredSkills(dto.getRequiredSkills().trim());
        tender.setRequiredDocuments(dto.getRequiredDocuments().trim());
        tender.setEvaluationCriteria(dto.getEvaluationCriteria().trim());
        tender.setStatus(dto.getStatus() != null ? dto.getStatus() : TenderStatus.PUBLISHED);
        tender.setSourceUrl(dto.getSourceUrl());
        tender.setCreatedByOfficer(officer);
        tender.setIsDemo(dto.getIsDemo() != null ? dto.getIsDemo() : true);

        tender = tenderRepository.save(tender);
        auditService.logAction(officer.getId(), "TENDER_CREATE", "Tenders", tender.getId(), "0.0.0.0", "Officer created tender: " + tender.getReferenceNumber());
        return TenderDto.fromEntity(tender);
    }

    @Transactional
    public TenderDto updateTenderStatus(Long tenderId, TenderStatus newStatus, User officer) {
        Tender tender = tenderRepository.findById(tenderId)
                .orElseThrow(() -> new ResourceNotFoundException("Tender not found with id: " + tenderId));
        tender.setStatus(newStatus);
        tender = tenderRepository.save(tender);
        auditService.logAction(officer.getId(), "TENDER_STATUS_CHANGE", "Tenders", tender.getId(), "0.0.0.0", "Updated status to " + newStatus);
        return TenderDto.fromEntity(tender);
    }
}
