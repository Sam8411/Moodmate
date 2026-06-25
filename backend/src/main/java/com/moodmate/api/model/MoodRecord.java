package com.moodmate.api.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "mood_records")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MoodRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private String mood; // e.g., Happy, Sad, Stressed, Angry, Calm, Excited

    @Column(nullable = false)
    private Double score; // numeric sentiment confidence or severity score

    @Builder.Default
    private LocalDateTime date = LocalDateTime.now();
}
