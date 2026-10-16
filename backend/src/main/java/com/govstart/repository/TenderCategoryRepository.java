package com.govstart.repository;

import com.govstart.entity.TenderCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface TenderCategoryRepository extends JpaRepository<TenderCategory, Long> {
    Optional<TenderCategory> findBySlug(String slug);
}
