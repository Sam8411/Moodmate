package com.moodmate.api.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class GameScoreRequest {
    @NotBlank(message = "Game name is required")
    private String gameName;

    @Min(value = 0, message = "Score must be non-negative")
    private Integer score;
}
