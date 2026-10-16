package com.govstart.repository;

import com.govstart.entity.ProposalDraft;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProposalDraftRepository extends JpaRepository<ProposalDraft, Long> {
    List<ProposalDraft> findByStartupIdOrderByLastSavedAtDesc(Long startupId);
    Optional<ProposalDraft> findByStartupIdAndTenderId(Long startupId, Long tenderId);
}
