package com.govstart.repository;

import com.govstart.entity.Application;
import com.govstart.entity.ApplicationStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ApplicationRepository extends JpaRepository<Application, Long> {
    List<Application> findByStartupIdOrderByUpdatedAtDesc(Long startupId);
    List<Application> findByTenderIdOrderByUpdatedAtDesc(Long tenderId);
    Optional<Application> findByStartupIdAndTenderId(Long startupId, Long tenderId);
    Optional<Application> findByApplicationNumber(String applicationNumber);
    long countByStatus(ApplicationStatus status);

    @Query("SELECT a.status, COUNT(a) FROM Application a GROUP BY a.status")
    List<Object[]> countApplicationsByStatus();
}
