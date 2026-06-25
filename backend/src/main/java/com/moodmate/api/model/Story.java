package com.moodmate.api.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "stories")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Story {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String content;

    @Column(nullable = false)
    private String category; // e.g., Motivation, Success, Self Confidence, Depression Recovery, Positive Thinking, Inspiration

    @Column(name = "mood_type", nullable = false)
    private String moodType; // e.g., Happy, Sad, Stressed, Angry, Calm, Excited
}
