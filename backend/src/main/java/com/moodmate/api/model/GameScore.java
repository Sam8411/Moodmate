package com.moodmate.api.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "game_scores")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GameScore {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "game_name", nullable = false)
    private String gameName; // e.g., Memory Match, Color Matching, Breathing Bubble, Relaxation Clicker

    @Column(nullable = false)
    private Integer score;

    @Builder.Default
    private LocalDateTime timestamp = LocalDateTime.now();
}
