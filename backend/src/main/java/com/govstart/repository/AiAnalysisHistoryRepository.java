package com.govstart.repository;

import com.govstart.entity.AiAnalysisHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AiAnalysisHistoryRepository extends JpaRepository<AiAnalysisHistory, Long> {
    List<AiAnalysisHistory> findByUserIdOrderByCreatedAtDesc(Long userId);
}
