package com.moodmate.api.repository;

import com.moodmate.api.model.JournalEntry;
import com.moodmate.api.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface JournalEntryRepository extends JpaRepository<JournalEntry, Long> {
    List<JournalEntry> findByUserOrderByCreatedAtDesc(User user);
    List<JournalEntry> findByUserAndIsDraftOrderByCreatedAtDesc(User user, boolean isDraft);
}
