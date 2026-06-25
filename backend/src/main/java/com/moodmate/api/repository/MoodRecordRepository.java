package com.moodmate.api.repository;

import com.moodmate.api.model.MoodRecord;
import com.moodmate.api.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface MoodRecordRepository extends JpaRepository<MoodRecord, Long> {
    List<MoodRecord> findByUserOrderByDateDesc(User user);
    
    @Query("SELECT m FROM MoodRecord m WHERE m.user = :user AND m.date >= :startDate ORDER BY m.date ASC")
    List<MoodRecord> findByUserAndDateAfter(@Param("user") User user, @Param("startDate") LocalDateTime startDate);
}
