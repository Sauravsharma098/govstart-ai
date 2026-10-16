package com.govstart.controller;

import com.govstart.dto.*;
import com.govstart.entity.User;
import com.govstart.repository.UserRepository;
import com.govstart.security.CustomUserDetails;
import com.govstart.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;
    private final UserRepository userRepository;

    public AuthController(AuthService authService, UserRepository userRepository) {
        this.authService = authService;
        this.userRepository = userRepository;
    }

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<AuthResponse>> register(@Valid @RequestBody RegisterRequest request) {
        AuthResponse response = authService.registerStartup(request);
        return ResponseEntity.ok(ApiResponse.ok("Startup account registered successfully", response));
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>> login(@Valid @RequestBody AuthRequest request) {
        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(ApiResponse.ok("Login successful", response));
    }

    @PostMapping("/bootstrap-admin")
    public ResponseEntity<ApiResponse<AuthResponse>> bootstrapAdmin(@Valid @RequestBody BootstrapAdminRequest request) {
        AuthResponse response = authService.bootstrapAdmin(request);
        return ResponseEntity.ok(ApiResponse.ok("Administrator account initialized successfully", response));
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getCurrentUser(@AuthenticationPrincipal CustomUserDetails userDetails) {
        if (userDetails == null) {
            return ResponseEntity.status(401).body(ApiResponse.error("Not authenticated"));
        }
        User user = userDetails.getUser();
        Map<String, Object> data = Map.of(
                "id", user.getId(),
                "email", user.getEmail(),
                "fullName", user.getFullName(),
                "role", user.getRole().name(),
                "status", user.getStatus().name()
        );
        return ResponseEntity.ok(ApiResponse.ok(data));
    }
}
