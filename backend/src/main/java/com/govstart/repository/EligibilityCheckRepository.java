package com.govstart.repository;

import com.govstart.entity.EligibilityCheck;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface EligibilityCheckRepository extends JpaRepository<EligibilityCheck, Long> {
    Optional<EligibilityCheck> findTopByStartupIdAndTenderIdOrderByCheckedAtDesc(Long startupId, Long tenderId);
}
