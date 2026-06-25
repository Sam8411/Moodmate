package com.moodmate.api.repository;

import com.moodmate.api.model.ChatHistory;
import com.moodmate.api.model.User;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ChatHistoryRepository extends JpaRepository<ChatHistory, Long> {
    List<ChatHistory> findByUserOrderByTimestampAsc(User user);

    @Query("SELECT c FROM ChatHistory c WHERE c.user = :user ORDER BY c.timestamp DESC")
    List<ChatHistory> findRecentChats(@Param("user") User user, Pageable pageable);
}
