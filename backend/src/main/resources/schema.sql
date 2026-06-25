-- MoodMate AI MySQL Schema Definitions

CREATE DATABASE IF NOT EXISTS moodmate;
USE moodmate;

-- 1. Users Table
CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'USER',
    profile_image VARCHAR(1024),
    badges VARCHAR(1024) DEFAULT '',
    points INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Mood Records Table
CREATE TABLE IF NOT EXISTS mood_records (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    mood VARCHAR(50) NOT NULL,
    score DOUBLE NOT NULL,
    date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 3. Journal Entries Table
CREATE TABLE IF NOT EXISTS journal_entries (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    mood_tag VARCHAR(50),
    is_draft BOOLEAN DEFAULT FALSE,
    image_url VARCHAR(1024),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 4. Music Recommendations Table
CREATE TABLE IF NOT EXISTS music_recommendations (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    artist VARCHAR(255) NOT NULL,
    category VARCHAR(255) NOT NULL,
    mood_type VARCHAR(50) NOT NULL,
    audio_url VARCHAR(1024)
);

-- 5. Stories Table
CREATE TABLE IF NOT EXISTS stories (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    category VARCHAR(255) NOT NULL,
    mood_type VARCHAR(50) NOT NULL
);

-- 6. Exercises Table
CREATE TABLE IF NOT EXISTS exercises (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    duration INT NOT NULL, -- duration in seconds
    category VARCHAR(100) NOT NULL -- e.g., Breathing, Yoga, Meditation
);

-- 7. Chat History Table
CREATE TABLE IF NOT EXISTS chat_history (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    message TEXT NOT NULL,
    response TEXT NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 8. Game Scores Table
CREATE TABLE IF NOT EXISTS game_scores (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    game_name VARCHAR(100) NOT NULL,
    score INT NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Indexes for optimize query execution speed
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_mood_user_date ON mood_records(user_id, date);
CREATE INDEX idx_journal_user ON journal_entries(user_id);
CREATE INDEX idx_music_mood ON music_recommendations(mood_type);
CREATE INDEX idx_stories_mood ON stories(mood_type);
CREATE INDEX idx_chat_user ON chat_history(user_id);
CREATE INDEX idx_game_user ON game_scores(user_id);
