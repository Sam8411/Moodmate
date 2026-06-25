package com.moodmate.api.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "music_recommendations")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MusicRecommendation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private String artist;

    @Column(nullable = false)
    private String category; // e.g., Energetic, Ambient, Lo-fi, Classical, Nature

    @Column(name = "mood_type", nullable = false)
    private String moodType; // e.g., Happy, Sad, Stressed, Angry, Calm, Excited

    @Column(name = "audio_url", length = 1024)
    private String audioUrl;
}
