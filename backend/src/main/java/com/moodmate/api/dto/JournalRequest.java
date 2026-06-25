package com.moodmate.api.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class JournalRequest {
    @NotBlank(message = "Title is required")
    private String title;

    @NotBlank(message = "Content is required")
    private String content;

    private String moodTag;
    
    private Boolean isDraft;
    
    private String imageUrl;
}
