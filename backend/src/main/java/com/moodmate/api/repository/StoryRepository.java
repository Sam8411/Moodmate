package com.moodmate.api.repository;

import com.moodmate.api.model.Story;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StoryRepository extends JpaRepository<Story, Long> {
    List<Story> findByMoodType(String moodType);
    List<Story> findByCategory(String category);
}
