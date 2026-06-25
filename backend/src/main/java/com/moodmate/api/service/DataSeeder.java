package com.moodmate.api.service;

import com.moodmate.api.model.Exercise;
import com.moodmate.api.model.MusicRecommendation;
import com.moodmate.api.model.Story;
import com.moodmate.api.repository.ExerciseRepository;
import com.moodmate.api.repository.MusicRecommendationRepository;
import com.moodmate.api.repository.StoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final MusicRecommendationRepository musicRepository;
    private final StoryRepository storyRepository;
    private final ExerciseRepository exerciseRepository;

    @Override
    public void run(String... args) throws Exception {
        exerciseRepository.deleteAll();
        musicRepository.deleteAll();
        storyRepository.deleteAll();

        seedExercises();
        seedMusic();
        seedStories();
    }

    private void seedExercises() {
        List<Exercise> exercises = new ArrayList<>();

        // 5 Breathing exercises
        exercises.add(Exercise.builder()
                .title("Box Breathing (4-4-4-4)")
                .description("Inhale for 4 seconds, hold for 4 seconds, exhale for 4 seconds, hold empty for 4 seconds. Repeat for 4 cycles to stabilize your nervous system.")
                .duration(240)
                .category("Breathing")
                .build());

        exercises.add(Exercise.builder()
                .title("Deep Belly Breathing")
                .description("Inhale deeply through your nose, expanding your stomach. Exhale slowly through your mouth. Helps immediately lower heart rate and reduce stress.")
                .duration(180)
                .category("Breathing")
                .build());

        exercises.add(Exercise.builder()
                .title("Alternate Nostril Breathing (Nadi Shodhana)")
                .description("Close right nostril, inhale left. Close left, exhale right. Inhale right, close right, exhale left. Balances left and right brain hemispheres.")
                .duration(300)
                .category("Breathing")
                .build());

        exercises.add(Exercise.builder()
                .title("4-7-8 Relaxing Breath")
                .description("Inhale for 4 seconds, hold for 7 seconds, exhale audibly for 8 seconds. This acts as a natural tranquilizer for the nervous system.")
                .duration(300)
                .category("Breathing")
                .build());

        exercises.add(Exercise.builder()
                .title("Equal Breathing (Sama Vritti)")
                .description("Inhale for 4 seconds, then exhale for 4 seconds. Focuses the mind and increases lung capacity while establishing a calm rhythm.")
                .duration(240)
                .category("Breathing")
                .build());

        // 5 Yoga exercises
        exercises.add(Exercise.builder()
                .title("Child Pose (Balasana)")
                .description("Kneel on the floor, sit back on your heels, fold forward, and stretch your arms out in front. Rest your forehead on the ground. A resting pose that calms the mind.")
                .duration(120)
                .category("Yoga")
                .build());

        exercises.add(Exercise.builder()
                .title("Cobra Pose (Bhujangasana)")
                .description("Lie face down, place hands under shoulders, and gently lift your chest while keeping hips on the floor. Stretches the chest, opens lungs, and releases back tension.")
                .duration(60)
                .category("Yoga")
                .build());

        exercises.add(Exercise.builder()
                .title("Tree Pose (Vrikshasana)")
                .description("Stand tall, shift weight to one leg, and place the other foot on your inner thigh or calf. Bring hands together in front of your chest. Enhances focus and stability.")
                .duration(90)
                .category("Yoga")
                .build());

        exercises.add(Exercise.builder()
                .title("Cat-Cow Stretch (Marjaryasana)")
                .description("On all fours, alternate between arching your back upward (cat) and dipping it down (cow). Excellent for spinal flexibility and relieving physical tension.")
                .duration(180)
                .category("Yoga")
                .build());

        exercises.add(Exercise.builder()
                .title("Warrior II Pose (Virabhadrasana II)")
                .description("Step legs wide apart, bend front knee, and extend arms parallel to the floor. Promotes full-body strength, stamina, and inner power.")
                .duration(120)
                .category("Yoga")
                .build());

        // 5 Meditation exercises
        exercises.add(Exercise.builder()
                .title("Guided Mindful Breathing")
                .description("Focus your awareness entirely on the physical sensation of breath entering and leaving your nostrils. Redirect stray thoughts gently back to the breath.")
                .duration(600)
                .category("Meditation")
                .build());

        exercises.add(Exercise.builder()
                .title("Loving-Kindness Meditation (Metta)")
                .description("Silently repeat phrases of wellness and peace for yourself: 'May I be happy, may I be healthy, may I live with ease.' Expand this to friends and family.")
                .duration(480)
                .category("Meditation")
                .build());

        exercises.add(Exercise.builder()
                .title("Body Scan Relaxation")
                .description("Focus awareness on each part of the body sequentially, from toes to head, releasing tension as you notice it. Promotes deep physical relaxation.")
                .duration(900)
                .category("Meditation")
                .build());

        exercises.add(Exercise.builder()
                .title("Zen Walking Meditation")
                .description("Walk slowly in a quiet environment, synchronizing your steps with your breathing. Heightens physical awareness and links body and mind.")
                .duration(600)
                .category("Meditation")
                .build());

        exercises.add(Exercise.builder()
                .title("5-4-3-2-1 Grounding Technique")
                .description("A sensory awareness meditation. Identify 5 things you see, 4 you feel, 3 you hear, 2 you smell, and 1 you taste to immediately quiet anxiety.")
                .duration(300)
                .category("Meditation")
                .build());

        exerciseRepository.saveAll(exercises);
        System.out.println("Seeded " + exercises.size() + " wellness exercises.");
    }

    private void seedMusic() {
        List<MusicRecommendation> list = new ArrayList<>();
        
        // SoundHelix audio player URLs
        String url1 = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3";
        String url2 = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3";
        String url3 = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3";
        String url4 = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3";
        String url5 = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3";
        String url6 = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3";
        String url7 = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3";
        String url8 = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3";

        list.add(MusicRecommendation.builder().title("Sunny Sunshine Walk").artist("Aura Resonance").category("Uplifting Synth").moodType("Happy").audioUrl(url1).build());
        list.add(MusicRecommendation.builder().title("Healing Melancholy Melodies").artist("Luna Whispers").category("Classical Solace").moodType("Sad").audioUrl(url2).build());
        list.add(MusicRecommendation.builder().title("Gentle Rainfall & Meditation").artist("Echoes of Calm").category("Nature Sounds").moodType("Stressed").audioUrl(url3).build());
        list.add(MusicRecommendation.builder().title("Storm Catharsis Drums").artist("Solar Flare").category("Lo-Fi Beats").moodType("Angry").audioUrl(url4).build());
        list.add(MusicRecommendation.builder().title("Floating Zen Chimes").artist("Mindfulness Tribe").category("Ambient Pad").moodType("Calm").audioUrl(url5).build());
        list.add(MusicRecommendation.builder().title("High Energy Morning Boost").artist("Zen Garden").category("Acoustic").moodType("Excited").audioUrl(url6).build());
        list.add(MusicRecommendation.builder().title("Ocean Waves Deep Sleep").artist("Acoustic Horizon").category("Nature Sounds").moodType("Calm").audioUrl(url7).build());
        list.add(MusicRecommendation.builder().title("Cosmic Synthesizer Dreams").artist("Solar Flare").category("Uplifting Synth").moodType("Excited").audioUrl(url8).build());
        list.add(MusicRecommendation.builder().title("Acoustic Sunset Serenade").artist("Pianist of Peace").category("Acoustic").moodType("Happy").audioUrl(url1).build());
        list.add(MusicRecommendation.builder().title("Moonlight Sonata Refracted").artist("Zen Garden").category("Classical Solace").moodType("Sad").audioUrl(url2).build());
        list.add(MusicRecommendation.builder().title("Whispering Winds").artist("Luna Whispers").category("Ambient Pad").moodType("Calm").audioUrl(url3).build());
        list.add(MusicRecommendation.builder().title("Forest Stream Therapy").artist("Echoes of Calm").category("Nature Sounds").moodType("Stressed").audioUrl(url4).build());
        list.add(MusicRecommendation.builder().title("Focus Coffee Beats").artist("Mindfulness Tribe").category("Lo-Fi Beats").moodType("Calm").audioUrl(url5).build());
        list.add(MusicRecommendation.builder().title("Radiant Dawn").artist("Aura Resonance").category("Uplifting Synth").moodType("Happy").audioUrl(url6).build());
        list.add(MusicRecommendation.builder().title("Golden Hour Acoustic").artist("Acoustic Horizon").category("Acoustic").moodType("Excited").audioUrl(url7).build());

        musicRepository.saveAll(list);
        System.out.println("Seeded " + musicRepository.count() + " music recommendations.");
    }

    private void seedStories() {
        List<Story> list = new ArrayList<>();

        list.add(Story.builder()
                .title("The Persistent Seed")
                .category("Motivation")
                .moodType("Happy")
                .content("A tiny seed lay deep in the soil, hidden from daylight. It faced cold rains and heavy stones. Yet, instead of giving up, it pushed upwards daily, millimeter by millimeter. Eventually, it broke through the hard clay and bloomed into a radiant flower. Remember, the pressure you feel is preparing you to bloom.")
                .build());

        list.add(Story.builder()
                .title("Steps in the Dust")
                .category("Success")
                .moodType("Excited")
                .content("The mountain path was steep and slippery. The traveler fell twice and wanted to turn back. An old guide said, 'Success is not about walking without falling; it is about standing up one more time than you fell.' Step by step, the traveler reached the summit and watched the sunrise. Keep climbing, you are closer than you think.")
                .build());

        list.add(Story.builder()
                .title("The Mirror's Secret")
                .category("Self Confidence")
                .moodType("Calm")
                .content("A young painter doubted her art, fearing judgment. She painted a portrait of courage and kept it hidden. One day, a visitor saw it and cried, saying it represented the truest form of inner strength. The painter realized that her own vision was her power. Trust your creative voice and walk with pride.")
                .build());

        list.add(Story.builder()
                .title("Light After the Gray")
                .category("Depression Recovery")
                .moodType("Sad")
                .content("For months, the valley was locked in thick gray fog. The villagers forgot what blue sky looked like. But on the high hills, the sun was still shining. Slowly, a warm wind cleared the valley. Just like the weather, emotional seasons change. The sun has not vanished; it is just waiting behind the mist.")
                .build());

        list.add(Story.builder()
                .title("The Lesson of the Cup")
                .category("Positive Thinking")
                .moodType("Stressed")
                .content("A teacher held a glass of water. 'How heavy is this?' she asked. 'It depends on how long I hold it. A minute is easy. A whole day makes my arm numb.' Stress and worry are the same. Put down the glass. Rest your mind, take a breath, and focus on the beautiful small moments of the present.")
                .build());

        list.add(Story.builder()
                .title("Whispers of the Wind")
                .category("Inspiration")
                .moodType("Calm")
                .content("The bamboo forest bends in the fiercest storms but never breaks. It yields to the wind and stands tall again when the sky clears. True strength is flexibility and grace. Be gentle with yourself in difficult times, bend but do not break. You possess the resilience of the bamboo.")
                .build());

        list.add(Story.builder()
                .title("The Oak and the Willow")
                .category("Motivation")
                .moodType("Angry")
                .content("A giant oak stood next to a slender willow. The oak mocked the willow's soft leaves. But when the great tempest arrived, the oak resisted and was uprooted. The willow bent with the gale, sliding its leaves along the winds. When morning came, the willow rose tall and unharmed. Flexibility overcomes raw anger.")
                .build());

        list.add(Story.builder()
                .title("Valley of the Blue Lilies")
                .category("Depression Recovery")
                .moodType("Sad")
                .content("Deep within the shadows of a sunless canyon grew the fabled blue lilies. They did not open for the day, but rather sparkled under the cold moonlight. A wandering heart learned that one does not need the brightest sun to radiate beauty; even in your darkest season, there is a soft light within you that can glow.")
                .build());

        list.add(Story.builder()
                .title("Sunrise Over the Peak")
                .category("Success")
                .moodType("Excited")
                .content("Determined to see the zenith, the child climbed through the freezing night. The fingers grew numb and doubts whispered to stop. But as the dark sky faded to violet, the first beam of gold touched the snow-capped mountain. The struggle of the night was forgotten in the warmth of the dawn. Keep moving forward.")
                .build());

        list.add(Story.builder()
                .title("The Golden Touch of Mindfulness")
                .category("Positive Thinking")
                .moodType("Calm")
                .content("A master showed the student a regular tea cup. 'Treat this cup as if it were the last cup in the world,' he said. The student held it with total attention and drank in silent peace. The master smiled: 'Mindfulness turns the ordinary into gold. When you are fully present, even simple water tastes like pure joy.'")
                .build());

        list.add(Story.builder()
                .title("The Potter's Hands")
                .category("Self Confidence")
                .moodType("Sad")
                .content("A clay jar cracked on the wheel. Disappointed, the apprentice wanted to throw it away. The master potter took the cracked clay, kneaded it with fresh water, and reshaped it into a magnificent vase. 'A crack is not the end,' the master said. 'It is just a chance to be formed anew into something even greater.'")
                .build());

        list.add(Story.builder()
                .title("The Ocean's Rhythm")
                .category("Inspiration")
                .moodType("Stressed")
                .content("A sailor watched the waves crash violently against the cliffs. He tried to steer against them and grew exhausted. The captain remarked: 'You cannot fight the ocean. You must learn to flow with its rhythm, trim your sails, and glide with the waves.' The storm did not stop, but the sailor found ease in the movement.")
                .build());

        list.add(Story.builder()
                .title("The Weaver's Gift")
                .category("Success")
                .moodType("Happy")
                .content("An elder weaver was given broken, knotted threads of various colors. Instead of discarding them, she began weaving them into a grand tapestry. The knots formed unique textures and the broken threads created unexpected, gorgeous highlights. Out of your life's broken threads, you can weave a masterpiece.")
                .build());

        list.add(Story.builder()
                .title("The Lantern's Light")
                .category("Inspiration")
                .moodType("Calm")
                .content("A traveler walked in pitch darkness with a single small lantern. The lantern only lit the next single step. The traveler complained that he couldn't see the destination. An voice whispered: 'You do not need to see the whole path. Just take the step that is lit. Step by step, the light will guide you home.'")
                .build());

        list.add(Story.builder()
                .title("Overcoming the Storm")
                .category("Motivation")
                .moodType("Angry")
                .content("The young eagle sat terrified as black storm clouds gathered. While other birds hid in the trees, the mother eagle pushed the young one into the gale. Spreading its wings, the young eagle caught the strong updraft and rose high above the storm, soaring in the sun. Use the wind of conflict to lift yourself higher.")
                .build());

        storyRepository.saveAll(list);
        System.out.println("Seeded " + storyRepository.count() + " therapeutic stories.");
    }
}
