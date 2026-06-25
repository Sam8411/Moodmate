package com.moodmate.api.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class MoodAnalysisRequest {
    @NotBlank(message = "Text input is required")
    private String text;
}
