package com.moodmate.api.dto;

import lombok.Data;

@Data
public class ProfileUpdateRequest {
    private String name;
    private String profileImage;
}
