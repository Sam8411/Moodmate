package com.moodmate.api.service;

import com.moodmate.api.dto.MoodResponse;
import com.moodmate.api.model.*;
import com.moodmate.api.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;

@Service
@RequiredArgsConstructor
public class MoodService {

    private final MoodRecordRepository moodRecordRepository;
    private final MusicRecommendationRepository musicRepository;
    private final StoryRepository storyRepository;
    private final ExerciseRepository exerciseRepository;
    private final UserRepository userRepository;
    private final AiService aiService;

    public MoodResponse analyzeAndRecordMood(User user, String text) {
        // Run sentiment analysis
        AiService.SentimentResult analysisResult = aiService.analyzeSentiment(text);

        // Save mood log to DB
        MoodRecord record = MoodRecord.builder()
                .user(user)
                .mood(analysisResult.mood)
                .score(analysisResult.score)
                .date(LocalDateTime.now())
                .build();
        moodRecordRepository.save(record);

        // Award points for tracking mood
        user.setPoints(user.getPoints() + 5);
        if (user.getPoints() >= 100 && !user.getBadges().contains("Mindfulness Master")) {
            user.setBadges(user.getBadges() + ", Mindfulness Master");
        } else if (user.getPoints() >= 50 && !user.getBadges().contains("Emotion Explorer")) {
            user.setBadges(user.getBadges() + ", Emotion Explorer");
        }
        userRepository.save(user);

        // Retrieve recommendations based on mood
        List<MusicRecommendation> music = musicRepository.findByMoodType(analysisResult.mood);
        List<Story> stories = storyRepository.findByMoodType(analysisResult.mood);
        List<Exercise> exercises = exerciseRepository.findAll(); // Recommend matching exercises

        // Shuffle and limit to 4 items max for UI clean presentation
        Collections.shuffle(music);
        Collections.shuffle(stories);
        Collections.shuffle(exercises);

        return MoodResponse.builder()
                .mood(analysisResult.mood)
                .score(analysisResult.score)
                .musicRecommendations(music.subList(0, Math.min(music.size(), 4)))
                .storyRecommendations(stories.subList(0, Math.min(stories.size(), 4)))
                .exerciseRecommendations(exercises.subList(0, Math.min(exercises.size(), 3)))
                .build();
    }

    public List<MoodRecord> getUserMoodHistory(User user) {
        return moodRecordRepository.findByUserOrderByDateDesc(user);
    }

    public List<MoodRecord> getWeeklyMoodAnalytics(User user) {
        LocalDateTime oneWeekAgo = LocalDateTime.now().minusDays(7);
        return moodRecordRepository.findByUserAndDateAfter(user, oneWeekAgo);
    }
}
