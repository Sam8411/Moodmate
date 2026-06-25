package com.moodmate.api.dto;

import com.moodmate.api.model.Exercise;
import com.moodmate.api.model.MusicRecommendation;
import com.moodmate.api.model.Story;
import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class MoodResponse {
    private String mood;
    private Double score;
    private List<MusicRecommendation> musicRecommendations;
    private List<Story> storyRecommendations;
    private List<Exercise> exerciseRecommendations;
}
