package com.moodmate.api.controller;

import com.moodmate.api.dto.MoodAnalysisRequest;
import com.moodmate.api.dto.MoodResponse;
import com.moodmate.api.model.MoodRecord;
import com.moodmate.api.model.User;
import com.moodmate.api.service.MoodService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/mood")
@RequiredArgsConstructor
public class MoodController {

    private final MoodService moodService;

    @PostMapping("/analyze")
    public ResponseEntity<MoodResponse> analyzeAndRecordMood(
            @AuthenticationPrincipal User user,
            @Valid @RequestBody MoodAnalysisRequest request
    ) {
        return ResponseEntity.ok(moodService.analyzeAndRecordMood(user, request.getText()));
    }

    @GetMapping("/history")
    public ResponseEntity<List<MoodRecord>> getMoodHistory(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(moodService.getUserMoodHistory(user));
    }

    @GetMapping("/analytics/weekly")
    public ResponseEntity<List<MoodRecord>> getWeeklyAnalytics(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(moodService.getWeeklyMoodAnalytics(user));
    }
}
