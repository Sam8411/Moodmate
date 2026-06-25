package com.moodmate.api.controller;

import com.moodmate.api.dto.GameScoreRequest;
import com.moodmate.api.model.GameScore;
import com.moodmate.api.model.User;
import com.moodmate.api.repository.GameScoreRepository;
import com.moodmate.api.repository.UserRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/games")
@RequiredArgsConstructor
public class GameController {

    private final GameScoreRepository gameScoreRepository;
    private final UserRepository userRepository;

    @PostMapping("/score")
    public ResponseEntity<GameScore> saveScore(
            @AuthenticationPrincipal User user,
            @Valid @RequestBody GameScoreRequest request
    ) {
        GameScore gameScore = GameScore.builder()
                .user(user)
                .gameName(request.getGameName())
                .score(request.getScore())
                .timestamp(LocalDateTime.now())
                .build();
        
        GameScore saved = gameScoreRepository.save(gameScore);

        // Award points for playing stress-relief games (10% of score, min 5 points)
        int pointsEarned = Math.max(5, request.getScore() / 10);
        user.setPoints(user.getPoints() + pointsEarned);

        // Badge checks
        if (request.getScore() >= 100 && !user.getBadges().contains("Gamer Champion")) {
            user.setBadges(user.getBadges() + ", Gamer Champion");
        }
        userRepository.save(user);

        return ResponseEntity.ok(saved);
    }

    @GetMapping("/leaderboard/{gameName}")
    public ResponseEntity<List<GameScore>> getLeaderboard(@PathVariable String gameName) {
        List<GameScore> leaderboard = gameScoreRepository.findLeaderboard(gameName);
        return ResponseEntity.ok(leaderboard.subList(0, Math.min(leaderboard.size(), 10)));
    }

    @GetMapping("/my-scores")
    public ResponseEntity<List<GameScore>> getMyScores(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(gameScoreRepository.findByUserOrderByTimestampDesc(user));
    }
}
