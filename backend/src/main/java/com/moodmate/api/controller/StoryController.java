package com.moodmate.api.controller;

import com.moodmate.api.model.Story;
import com.moodmate.api.repository.StoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.List;

@RestController
@RequestMapping("/api/stories")
@RequiredArgsConstructor
public class StoryController {

    private final StoryRepository storyRepository;

    @GetMapping("/mood/{mood}")
    public ResponseEntity<List<Story>> getStoriesByMood(@PathVariable String mood) {
        List<Story> list = storyRepository.findByMoodType(mood);
        Collections.shuffle(list);
        return ResponseEntity.ok(list.subList(0, Math.min(list.size(), 8)));
    }

    @GetMapping("/category/{category}")
    public ResponseEntity<List<Story>> getStoriesByCategory(@PathVariable String category) {
        List<Story> list = storyRepository.findByCategory(category);
        Collections.shuffle(list);
        return ResponseEntity.ok(list.subList(0, Math.min(list.size(), 8)));
    }

    @GetMapping("/all")
    public ResponseEntity<List<Story>> getAllStories() {
        return ResponseEntity.ok(storyRepository.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Story> getStoryById(@PathVariable Long id) {
        return storyRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
