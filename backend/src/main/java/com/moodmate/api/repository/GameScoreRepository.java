package com.moodmate.api.repository;

import com.moodmate.api.model.GameScore;
import com.moodmate.api.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GameScoreRepository extends JpaRepository<GameScore, Long> {
    List<GameScore> findByUserOrderByTimestampDesc(User user);
    
    @Query("SELECT gs FROM GameScore gs WHERE gs.gameName = :gameName ORDER BY gs.score DESC")
    List<GameScore> findLeaderboard(@Param("gameName") String gameName);
}
