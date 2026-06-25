package com.moodmate.api.service;

import com.moodmate.api.config.JwtService;
import com.moodmate.api.dto.*;
import com.moodmate.api.model.User;
import com.moodmate.api.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.Random;
import java.util.concurrent.ConcurrentHashMap;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    // Local in-memory store for OTPs: Email -> OTP Code
    private final Map<String, String> otpStore = new ConcurrentHashMap<>();

    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email is already registered");
        }

        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role("USER")
                .points(10) // Welcome points
                .badges("Welcome Badge")
                .build();

        userRepository.save(user);
        String token = jwtService.generateToken(user);

        return mapToAuthResponse(user, token);
    }

    public AuthResponse login(AuthRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()));

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("Invalid email or password"));

        String token = jwtService.generateToken(user);
        return mapToAuthResponse(user, token);
    }

    public AuthResponse googleLogin(GoogleLoginRequest request) {
        // In a real enterprise setup, verify the token using GoogleIdTokenVerifier.
        // For development, we extract info from the payload or mock verify it.
        String email = "google_user_" + request.getToken().substring(0, Math.min(8, request.getToken().length()))
                + "@moodmate.com";
        String name = "Google Friend";

        // Check if user already exists
        User user = userRepository.findByEmail(email).orElse(null);
        if (user == null) {
            user = User.builder()
                    .name(name)
                    .email(email)
                    .password(
                            passwordEncoder.encode("google_oauth_placeholder_password_" + new Random().nextInt(100000)))
                    .role("USER")
                    .points(20)
                    .badges("Google Connected")
                    .build();
            userRepository.save(user);
        }

        String token = jwtService.generateToken(user);
        return mapToAuthResponse(user, token);
    }

    public void generateOtp(OtpRequest request) {
        if (!userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email not found");
        }

        // Generate a 6-digit OTP code
        String otp = String.format("%06d", new Random().nextInt(999999));
        otpStore.put(request.getEmail(), otp);

        // Console printing to simulate sending emails
        System.out.println("----------------------------------------------");
        System.out.println("MOODMATE AI OTP RESET FOR: " + request.getEmail());
        System.out.println("OTP CODE IS: " + otp);
        System.out.println("----------------------------------------------");
    }

    public void resetPassword(ResetPasswordRequest request) {
        String savedOtp = otpStore.get(request.getEmail());
        if (savedOtp == null || !savedOtp.equals(request.getOtp())) {
            throw new IllegalArgumentException("Invalid OTP or email address");
        }

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
        otpStore.remove(request.getEmail()); // Clear OTP after success
    }

    private AuthResponse mapToAuthResponse(User user, String token) {
        return AuthResponse.builder()
                .token(token)
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole())
                .profileImage(user.getProfileImage())
                .badges(user.getBadges())
                .points(user.getPoints())
                .build();
    }
}
