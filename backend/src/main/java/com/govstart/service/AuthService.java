package com.govstart.service;

import com.govstart.dto.AuthRequest;
import com.govstart.dto.AuthResponse;
import com.govstart.dto.BootstrapAdminRequest;
import com.govstart.dto.RegisterRequest;
import com.govstart.entity.Role;
import com.govstart.entity.StartupProfile;
import com.govstart.entity.User;
import com.govstart.entity.UserStatus;
import com.govstart.exception.BadRequestException;
import com.govstart.exception.UnauthorizedException;
import com.govstart.repository.StartupProfileRepository;
import com.govstart.repository.UserRepository;
import com.govstart.security.JwtTokenProvider;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final StartupProfileRepository startupProfileRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;
    private final AuditService auditService;

    @Value("${govstart.admin-bootstrap.secret:GovStartBootstrapKey2026Secure}")
    private String adminBootstrapSecret;

    public AuthService(UserRepository userRepository,
                       StartupProfileRepository startupProfileRepository,
                       PasswordEncoder passwordEncoder,
                       JwtTokenProvider jwtTokenProvider,
                       AuditService auditService) {
        this.userRepository = userRepository;
        this.startupProfileRepository = startupProfileRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtTokenProvider = jwtTokenProvider;
        this.auditService = auditService;
    }

    @Transactional
    public AuthResponse registerStartup(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail().toLowerCase())) {
            throw new BadRequestException("An account with this email address already exists.");
        }

        // 1. Create User (Strictly enforce STARTUP role to prevent privilege escalation)
        User user = new User();
        user.setEmail(request.getEmail().toLowerCase().trim());
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        user.setFullName(request.getFullName().trim());
        user.setRole(Role.STARTUP);
        user.setPhone(request.getPhone());
        user.setStatus(UserStatus.ACTIVE);
        user = userRepository.save(user);

        // 2. Create Initial Startup Profile
        StartupProfile profile = new StartupProfile();
        profile.setUser(user);
        profile.setCompanyName(request.getCompanyName().trim());
        profile.setRegistrationNumber(request.getRegistrationNumber().trim());
        profile.setSector(request.getSector().trim());
        profile.setLocationState(request.getLocationState().trim());
        profile.setLocationCity(request.getLocationCity().trim());
        profile.setDpiitRecognized(Boolean.TRUE.equals(request.getDpiitRecognized()));
        profile.setDpiitNumber(request.getDpiitNumber());
        profile.setStage("EARLY");
        profile.setProfileCompletenessPct(40);
        profile = startupProfileRepository.save(profile);

        auditService.logAction(user.getId(), "STARTUP_REGISTER", "Users", user.getId(), "0.0.0.0", "New startup registered: " + profile.getCompanyName());

        // 3. Issue JWT Token
        String token = jwtTokenProvider.generateTokenFromUsername(user.getEmail(), user.getRole().name());
        return new AuthResponse(token, user.getId(), user.getEmail(), user.getFullName(), user.getRole().name(), profile.getId());
    }

    public AuthResponse login(AuthRequest request) {
        User user = userRepository.findByEmail(request.getEmail().toLowerCase().trim())
                .orElseThrow(() -> new UnauthorizedException("Invalid email or password."));

        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new UnauthorizedException("Invalid email or password.");
        }

        if (user.getStatus() == UserStatus.SUSPENDED) {
            throw new UnauthorizedException("Your account has been suspended. Please contact platform administration.");
        }

        Long startupId = null;
        if (user.getRole() == Role.STARTUP) {
            startupId = startupProfileRepository.findByUserId(user.getId())
                    .map(StartupProfile::getId).orElse(null);
        }

        auditService.logAction(user.getId(), "USER_LOGIN", "Users", user.getId(), "0.0.0.0", "Successful login by " + user.getEmail());

        String token = jwtTokenProvider.generateTokenFromUsername(user.getEmail(), user.getRole().name());
        return new AuthResponse(token, user.getId(), user.getEmail(), user.getFullName(), user.getRole().name(), startupId);
    }

    @Transactional
    public AuthResponse bootstrapAdmin(BootstrapAdminRequest request) {
        if (!adminBootstrapSecret.equals(request.getBootstrapSecret())) {
            throw new UnauthorizedException("Invalid admin bootstrap secret key.");
        }

        User user = userRepository.findByEmail(request.getEmail().toLowerCase().trim())
                .orElseGet(() -> {
                    User u = new User();
                    u.setEmail(request.getEmail().toLowerCase().trim());
                    return u;
                });

        user.setFullName(request.getFullName().trim());
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        user.setRole(Role.ADMIN);
        user.setStatus(UserStatus.ACTIVE);
        user = userRepository.save(user);

        auditService.logAction(user.getId(), "ADMIN_BOOTSTRAP", "Users", user.getId(), "127.0.0.1", "Admin account bootstrapped successfully.");

        String token = jwtTokenProvider.generateTokenFromUsername(user.getEmail(), user.getRole().name());
        return new AuthResponse(token, user.getId(), user.getEmail(), user.getFullName(), user.getRole().name(), null);
    }
}
