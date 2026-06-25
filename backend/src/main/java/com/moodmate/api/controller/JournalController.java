package com.moodmate.api.controller;

import com.moodmate.api.dto.JournalRequest;
import com.moodmate.api.model.JournalEntry;
import com.moodmate.api.model.User;
import com.moodmate.api.repository.JournalEntryRepository;
import com.moodmate.api.repository.UserRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/journal")
@RequiredArgsConstructor
public class JournalController {

    private final JournalEntryRepository journalEntryRepository;
    private final UserRepository userRepository;

    @PostMapping
    public ResponseEntity<JournalEntry> createEntry(
            @AuthenticationPrincipal User user,
            @Valid @RequestBody JournalRequest request
    ) {
        JournalEntry entry = JournalEntry.builder()
                .user(user)
                .title(request.getTitle())
                .content(request.getContent())
                .moodTag(request.getMoodTag() != null ? request.getMoodTag() : "Neutral")
                .isDraft(request.getIsDraft() != null ? request.getIsDraft() : false)
                .imageUrl(request.getImageUrl())
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();
        
        JournalEntry saved = journalEntryRepository.save(entry);
        
        // Award points for journaling
        if (!Boolean.TRUE.equals(saved.getIsDraft())) {
            user.setPoints(user.getPoints() + 10);
            if (user.getPoints() >= 150 && !user.getBadges().contains("Journalist")) {
                user.setBadges(user.getBadges() + ", Dedicated Journalist");
            }
            userRepository.save(user);
        }
        
        return ResponseEntity.ok(saved);
    }

    @PutMapping("/{id}")
    public ResponseEntity<JournalEntry> updateEntry(
            @AuthenticationPrincipal User user,
            @PathVariable Long id,
            @Valid @RequestBody JournalRequest request
    ) {
        JournalEntry entry = journalEntryRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Journal entry not found"));
        
        if (!entry.getUser().getId().equals(user.getId())) {
            return ResponseEntity.status(403).build();
        }

        entry.setTitle(request.getTitle());
        entry.setContent(request.getContent());
        entry.setMoodTag(request.getMoodTag() != null ? request.getMoodTag() : entry.getMoodTag());
        
        // If it was a draft and is now published, award points
        if (Boolean.TRUE.equals(entry.getIsDraft()) && !Boolean.TRUE.equals(request.getIsDraft())) {
            user.setPoints(user.getPoints() + 10);
            userRepository.save(user);
        }

        entry.setIsDraft(request.getIsDraft() != null ? request.getIsDraft() : entry.getIsDraft());
        entry.setImageUrl(request.getImageUrl() != null ? request.getImageUrl() : entry.getImageUrl());
        entry.setUpdatedAt(LocalDateTime.now());

        return ResponseEntity.ok(journalEntryRepository.save(entry));
    }

    @GetMapping
    public ResponseEntity<List<JournalEntry>> getEntries(
            @AuthenticationPrincipal User user,
            @RequestParam(required = false) Boolean drafts
    ) {
        if (drafts != null) {
            return ResponseEntity.ok(journalEntryRepository.findByUserAndIsDraftOrderByCreatedAtDesc(user, drafts));
        }
        return ResponseEntity.ok(journalEntryRepository.findByUserOrderByCreatedAtDesc(user));
    }

    @GetMapping("/{id}")
    public ResponseEntity<JournalEntry> getEntryById(@AuthenticationPrincipal User user, @PathVariable Long id) {
        JournalEntry entry = journalEntryRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Journal entry not found"));
        
        if (!entry.getUser().getId().equals(user.getId())) {
            return ResponseEntity.status(403).build();
        }
        return ResponseEntity.ok(entry);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteEntry(@AuthenticationPrincipal User user, @PathVariable Long id) {
        JournalEntry entry = journalEntryRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Journal entry not found"));
        
        if (!entry.getUser().getId().equals(user.getId())) {
            return ResponseEntity.status(403).build();
        }

        journalEntryRepository.delete(entry);
        return ResponseEntity.ok("Journal entry deleted successfully");
    }
}
