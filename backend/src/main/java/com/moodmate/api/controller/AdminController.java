package com.moodmate.api.controller;

import com.moodmate.api.model.*;
import com.moodmate.api.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final UserRepository userRepository;
    private final JournalEntryRepository journalEntryRepository;
    private final MoodRecordRepository moodRecordRepository;
    private final GameScoreRepository gameScoreRepository;
    private final MusicRecommendationRepository musicRepository;
    private final StoryRepository storyRepository;
    private final ExerciseRepository exerciseRepository;

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getPlatformStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalUsers", userRepository.count());
        stats.put("totalJournals", journalEntryRepository.count());
        stats.put("totalMoodRecords", moodRecordRepository.count());
        stats.put("totalGamesPlayed", gameScoreRepository.count());
        stats.put("totalMusicTracks", musicRepository.count());
        stats.put("totalStories", storyRepository.count());
        stats.put("totalExercises", exerciseRepository.count());
        return ResponseEntity.ok(stats);
    }

    // User Management
    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userRepository.findAll());
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<String> deleteUser(@PathVariable Long id) {
        userRepository.deleteById(id);
        return ResponseEntity.ok("User deleted successfully");
    }

    // Music CRUD
    @PostMapping("/music")
    public ResponseEntity<MusicRecommendation> addMusic(@RequestBody MusicRecommendation music) {
        return ResponseEntity.ok(musicRepository.save(music));
    }

    @PutMapping("/music/{id}")
    public ResponseEntity<MusicRecommendation> updateMusic(@PathVariable Long id, @RequestBody MusicRecommendation music) {
        MusicRecommendation record = musicRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Music track not found"));
        record.setTitle(music.getTitle());
        record.setArtist(music.getArtist());
        record.setCategory(music.getCategory());
        record.setMoodType(music.getMoodType());
        record.setAudioUrl(music.getAudioUrl());
        return ResponseEntity.ok(musicRepository.save(record));
    }

    @DeleteMapping("/music/{id}")
    public ResponseEntity<String> deleteMusic(@PathVariable Long id) {
        musicRepository.deleteById(id);
        return ResponseEntity.ok("Music track deleted successfully");
    }

    // Stories CRUD
    @PostMapping("/stories")
    public ResponseEntity<Story> addStory(@RequestBody Story story) {
        return ResponseEntity.ok(storyRepository.save(story));
    }

    @PutMapping("/stories/{id}")
    public ResponseEntity<Story> updateStory(@PathVariable Long id, @RequestBody Story story) {
        Story record = storyRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Story not found"));
        record.setTitle(story.getTitle());
        record.setContent(story.getContent());
        record.setCategory(story.getCategory());
        record.setMoodType(story.getMoodType());
        return ResponseEntity.ok(storyRepository.save(record));
    }

    @DeleteMapping("/stories/{id}")
    public ResponseEntity<String> deleteStory(@PathVariable Long id) {
        storyRepository.deleteById(id);
        return ResponseEntity.ok("Story deleted successfully");
    }

    // Exercises CRUD
    @PostMapping("/exercises")
    public ResponseEntity<Exercise> addExercise(@RequestBody Exercise exercise) {
        return ResponseEntity.ok(exerciseRepository.save(exercise));
    }

    @PutMapping("/exercises/{id}")
    public ResponseEntity<Exercise> updateExercise(@PathVariable Long id, @RequestBody Exercise exercise) {
        Exercise record = exerciseRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Exercise not found"));
        record.setTitle(exercise.getTitle());
        record.setDescription(exercise.getDescription());
        record.setDuration(exercise.getDuration());
        record.setCategory(exercise.getCategory());
        return ResponseEntity.ok(exerciseRepository.save(record));
    }

    @DeleteMapping("/exercises/{id}")
    public ResponseEntity<String> deleteExercise(@PathVariable Long id) {
        exerciseRepository.deleteById(id);
        return ResponseEntity.ok("Exercise deleted successfully");
    }
}
