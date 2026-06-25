package com.moodmate.api.service;

import com.moodmate.api.model.ChatHistory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Locale;

@Service
public class AiService {

    @Value("${openai.api.key:}")
    private String openAiKey;

    @Value("${gemini.api.key:}")
    private String geminiApiKey;

    public static class SentimentResult {
        public String mood;
        public double score;

        public SentimentResult(String mood, double score) {
            this.mood = mood;
            this.score = score;
        }
    }

    /**
     * Analyzes input text and outputs mood classification and confidence score
     */
    public SentimentResult analyzeSentiment(String text) {
        if (text == null || text.trim().isEmpty()) {
            return new SentimentResult("Calm", 50.0);
        }

        String lowerText = text.toLowerCase(Locale.ROOT);

        int happyScore = countOccurrences(lowerText, "happy", "joy", "glad", "great", "awesome", "good", "wonderful", "amazing", "excited", "love", "thrilled");
        int sadScore = countOccurrences(lowerText, "sad", "unhappy", "depressed", "lonely", "cry", "crying", "hurt", "grief", "gloomy", "heavy", "tears", "down", "empty");
        int stressedScore = countOccurrences(lowerText, "stress", "stressed", "anxious", "anxiety", "panic", "worry", "worried", "pressure", "overwhelmed", "deadline", "scared", "fear");
        int angryScore = countOccurrences(lowerText, "angry", "mad", "furious", "hate", "irritated", "annoyed", "pissed", "rage", "frustrated");
        int calmScore = countOccurrences(lowerText, "calm", "relax", "relaxed", "peace", "peaceful", "quiet", "serene", "chill", "content");
        int excitedScore = countOccurrences(lowerText, "excited", "energetic", "hyped", "pumped", "cant wait", "thrilled", "hooray");

        // Determine dominant mood
        String mood = "Calm"; // Default
        int maxScore = 0;

        if (happyScore > maxScore) { mood = "Happy"; maxScore = happyScore; }
        if (excitedScore > maxScore) { mood = "Excited"; maxScore = excitedScore; }
        if (sadScore > maxScore) { mood = "Sad"; maxScore = sadScore; }
        if (stressedScore > maxScore) { mood = "Stressed"; maxScore = stressedScore; }
        if (angryScore > maxScore) { mood = "Angry"; maxScore = angryScore; }
        if (calmScore > maxScore) { mood = "Calm"; maxScore = calmScore; }

        // If no keywords matched, default to neutral classification based on general sentiment
        if (maxScore == 0) {
            if (lowerText.contains("not") || lowerText.contains("bad") || lowerText.contains("no")) {
                mood = "Sad";
                maxScore = 1;
            } else {
                mood = "Calm";
                maxScore = 1;
            }
        }

        // Calculate confidence percentage
        double score = 50.0 + (maxScore * 10.0);
        if (score > 100.0) score = 98.5;

        return new SentimentResult(mood, score);
    }

    /**
     * Generates an empathetic therapeutic response for the mental wellness chatbot
     */
    public String generateChatResponse(List<ChatHistory> history, String userMessage) {
        SentimentResult sentiment = analyzeSentiment(userMessage);
        String lowerMessage = userMessage.toLowerCase(Locale.ROOT);

        // General greeting check
        if (lowerMessage.contains("hello") || lowerMessage.contains("hi ") || lowerMessage.contains("hey")) {
            return "Hello there! I'm MoodMate, your digital mental wellness companion. How are you feeling today? I'm here to listen, support, and help guide you to a calmer state of mind.";
        }

        // Check for crisis terms and trigger emergency fallback
        if (lowerMessage.contains("suicide") || lowerMessage.contains("kill myself") || lowerMessage.contains("end my life") || lowerMessage.contains("die")) {
            return "I hear how much pain you're in right now, but please know that you are not alone. I am an AI, and I want to support you, but you need human assistance right now. Please reach out to local emergency services or contact a helpline immediately (e.g., in the US, dial 988 for suicide and crisis lifelines). Your life is incredibly valuable.";
        }

        // Generate response based on sentiment class
        switch (sentiment.mood) {
            case "Happy":
                return "It fills me with joy to hear that you're feeling happy! Embracing positive emotions is wonderful. What has made your day so bright? You might want to jot this down in your Digital Journal so you can look back on this beautiful memory later!";
            case "Excited":
                return "Wow, I can feel your positive energy! It is amazing to feel excited. What's the exciting news or event you are looking forward to? Keep riding this wave! If you want to channel this energy, try our Focus Challenge game under the games tab!";
            case "Sad":
                return "I'm so sorry that you're feeling down today. It's completely okay to not be okay, and crying or feeling heavy is a natural response. Remember, feelings are like clouds—they pass over time. Would you like to write about what's bothering you in your Gratitude or Daily Journal? I can also play some relaxing healing melodies or recommend a depression recovery story for you.";
            case "Stressed":
                return "It sounds like you're carrying a lot of pressure right now and feeling overwhelmed. Take a deep breath. Let's try to slow down. Would you like to do a quick 4-7-8 Box Breathing exercise with me? I have an interactive breathing bubble under the Exercises tab that can help you slow your heart rate down.";
            case "Angry":
                return "I hear your frustration, and it is completely valid to feel angry or irritated. Anger is a message that needs space. Let's take a deep breath before reacting. If you need a healthy distraction to let off steam, try popping some interactive bubbles in our Relaxation Clicker game!";
            case "Calm":
            default:
                if (lowerMessage.contains("thank") || lowerMessage.contains("help")) {
                    return "You're very welcome! I'm here for you 24/7. Remember to take time for yourself, practice mindfulness, and track your mood regularly. Is there anything else you'd like to explore today, like music or yoga?";
                }
                return "Thank you for sharing that with me. It sounds like you're in a stable, calm state of mind. Maintaining peace is a beautiful practice. Would you like to do some gentle Child Pose yoga or read an inspirational story to maintain this positive mood?";
        }
    }

    private int countOccurrences(String text, String... keywords) {
        int count = 0;
        for (String keyword : keywords) {
            int index = 0;
            while ((index = text.indexOf(keyword, index)) != -1) {
                count++;
                index += keyword.length();
            }
        }
        return count;
    }
}
