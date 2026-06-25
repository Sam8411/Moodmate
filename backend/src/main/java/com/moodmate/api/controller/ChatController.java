package com.moodmate.api.controller;

import com.moodmate.api.dto.ChatRequest;
import com.moodmate.api.dto.ChatResponse;
import com.moodmate.api.model.ChatHistory;
import com.moodmate.api.model.User;
import com.moodmate.api.repository.ChatHistoryRepository;
import com.moodmate.api.repository.UserRepository;
import com.moodmate.api.service.AiService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;

@RestController
@RequestMapping("/api/chat")
@RequiredArgsConstructor
public class ChatController {

    private final ChatHistoryRepository chatHistoryRepository;
    private final UserRepository userRepository;
    private final AiService aiService;

    @PostMapping
    public ResponseEntity<ChatResponse> chat(
            @AuthenticationPrincipal User user,
            @Valid @RequestBody ChatRequest request
    ) {
        // Fetch recent context window (last 5 messages) for conversation flow
        List<ChatHistory> recentChats = chatHistoryRepository.findRecentChats(user, PageRequest.of(0, 5));
        Collections.reverse(recentChats);

        // Generate response using AiService (falls back gracefully if API keys are not supplied)
        String aiResponse = aiService.generateChatResponse(recentChats, request.getMessage());

        // Save conversation log
        ChatHistory chatLog = ChatHistory.builder()
                .user(user)
                .message(request.getMessage())
                .response(aiResponse)
                .timestamp(LocalDateTime.now())
                .build();
        chatHistoryRepository.save(chatLog);

        // Award wellness points
        user.setPoints(user.getPoints() + 2);
        userRepository.save(user);

        return ResponseEntity.ok(ChatResponse.builder().response(aiResponse).build());
    }

    @GetMapping("/history")
    public ResponseEntity<List<ChatHistory>> getChatHistory(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(chatHistoryRepository.findByUserOrderByTimestampAsc(user));
    }
}
