package com.moodmate.api.controller;

import com.moodmate.api.model.MusicRecommendation;
import com.moodmate.api.repository.MusicRecommendationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.List;

@RestController
@RequestMapping("/api/music")
@RequiredArgsConstructor
public class MusicController {

    private final MusicRecommendationRepository musicRepository;

    @GetMapping("/mood/{mood}")
    public ResponseEntity<List<MusicRecommendation>> getMusicByMood(@PathVariable String mood) {
        List<MusicRecommendation> list = musicRepository.findByMoodType(mood);
        Collections.shuffle(list);
        return ResponseEntity.ok(list.subList(0, Math.min(list.size(), 12)));
    }

    @GetMapping("/category/{category}")
    public ResponseEntity<List<MusicRecommendation>> getMusicByCategory(@PathVariable String category) {
        List<MusicRecommendation> list = musicRepository.findByCategory(category);
        Collections.shuffle(list);
        return ResponseEntity.ok(list.subList(0, Math.min(list.size(), 12)));
    }

    @GetMapping("/all")
    public ResponseEntity<List<MusicRecommendation>> getAllMusic() {
        return ResponseEntity.ok(musicRepository.findAll());
    }
}
