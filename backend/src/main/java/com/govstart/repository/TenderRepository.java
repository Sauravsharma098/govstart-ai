package com.govstart.repository;

import com.govstart.entity.Tender;
import com.govstart.entity.TenderStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Repository
public interface TenderRepository extends JpaRepository<Tender, Long> {

    Optional<Tender> findByReferenceNumber(String referenceNumber);

    List<Tender> findByStatus(TenderStatus status);

    long countByStatus(TenderStatus status);

    @Query("SELECT t FROM Tender t WHERE " +
           "(:status IS NULL OR t.status = :status) AND " +
           "(:departmentId IS NULL OR t.department.id = :departmentId) AND " +
           "(:categoryId IS NULL OR t.category.id = :categoryId) AND " +
           "(:maxBudget IS NULL OR t.budgetInr <= :maxBudget) AND " +
           "(:keyword IS NULL OR LOWER(t.title) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
           "   OR LOWER(t.description) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
           "   OR LOWER(t.requiredSkills) LIKE LOWER(CONCAT('%', :keyword, '%')))")
    Page<Tender> searchTenders(
        @Param("keyword") String keyword,
        @Param("departmentId") Long departmentId,
        @Param("categoryId") Long categoryId,
        @Param("maxBudget") BigDecimal maxBudget,
        @Param("status") TenderStatus status,
        Pageable pageable
    );

    @Query("SELECT t.category.name, COUNT(t) FROM Tender t GROUP BY t.category.name")
    List<Object[]> countTendersByCategory();

    @Query("SELECT t.department.name, COUNT(t) FROM Tender t GROUP BY t.department.name")
    List<Object[]> countTendersByDepartment();
}
