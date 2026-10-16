package com.govstart.repository;

import com.govstart.entity.TenderMatch;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TenderMatchRepository extends JpaRepository<TenderMatch, Long> {
    List<TenderMatch> findByStartupIdOrderByRelevanceScoreDesc(Long startupId);
    Optional<TenderMatch> findByStartupIdAndTenderId(Long startupId, Long tenderId);
}
