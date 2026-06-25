package com.moodmate.api.repository;

import com.moodmate.api.model.MusicRecommendation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MusicRecommendationRepository extends JpaRepository<MusicRecommendation, Long> {
    List<MusicRecommendation> findByMoodType(String moodType);
    List<MusicRecommendation> findByCategory(String category);
}
