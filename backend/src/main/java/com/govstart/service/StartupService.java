package com.govstart.service;

import com.govstart.dto.StartupProfileDto;
import com.govstart.entity.StartupProfile;
import com.govstart.entity.User;
import com.govstart.exception.ResourceNotFoundException;
import com.govstart.repository.StartupProfileRepository;
import com.govstart.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class StartupService {

    private final StartupProfileRepository startupProfileRepository;
    private final UserRepository userRepository;

    public StartupService(StartupProfileRepository startupProfileRepository, UserRepository userRepository) {
        this.startupProfileRepository = startupProfileRepository;
        this.userRepository = userRepository;
    }

    public List<StartupProfileDto> getAllProfiles() {
        return startupProfileRepository.findAll().stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public StartupProfileDto getProfileByUserId(Long userId) {
        StartupProfile profile = startupProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Startup profile not found for user id: " + userId));
        return toDto(profile);
    }

    public StartupProfileDto getProfileById(Long startupId) {
        StartupProfile profile = startupProfileRepository.findById(startupId)
                .orElseThrow(() -> new ResourceNotFoundException("Startup profile not found with id: " + startupId));
        return toDto(profile);
    }

    public StartupProfile getEntityById(Long startupId) {
        return startupProfileRepository.findById(startupId)
                .orElseThrow(() -> new ResourceNotFoundException("Startup profile not found with id: " + startupId));
    }

    public StartupProfile getEntityByUserId(Long userId) {
        return startupProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Startup profile not found for user id: " + userId));
    }

    @Transactional
    public StartupProfileDto updateProfile(Long userId, StartupProfileDto dto) {
        StartupProfile profile = startupProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Startup profile not found for user id: " + userId));

        if (dto.getCompanyName() != null) profile.setCompanyName(dto.getCompanyName().trim());
        if (dto.getSector() != null) profile.setSector(dto.getSector().trim());
        if (dto.getStage() != null) profile.setStage(dto.getStage().trim());
        if (dto.getFoundedYear() != null) profile.setFoundedYear(dto.getFoundedYear());
        if (dto.getTeamSize() != null) profile.setTeamSize(dto.getTeamSize());
        if (dto.getAnnualTurnover() != null) profile.setAnnualTurnover(dto.getAnnualTurnover());
        if (dto.getLocationState() != null) profile.setLocationState(dto.getLocationState().trim());
        if (dto.getLocationCity() != null) profile.setLocationCity(dto.getLocationCity().trim());
        if (dto.getWebsite() != null) profile.setWebsite(dto.getWebsite().trim());
        if (dto.getDescription() != null) profile.setDescription(dto.getDescription().trim());
        if (dto.getPrimarySkills() != null) profile.setPrimarySkills(dto.getPrimarySkills());
        if (dto.getCertifications() != null) profile.setCertifications(dto.getCertifications());
        if (dto.getPastExperience() != null) profile.setPastExperience(dto.getPastExperience().trim());
        if (dto.getDpiitRecognized() != null) profile.setDpiitRecognized(dto.getDpiitRecognized());
        if (dto.getDpiitNumber() != null) profile.setDpiitNumber(dto.getDpiitNumber().trim());

        profile.calculateCompleteness();
        profile = startupProfileRepository.save(profile);
        return toDto(profile);
    }

    public StartupProfileDto toDto(StartupProfile p) {
        StartupProfileDto dto = new StartupProfileDto();
        dto.setId(p.getId());
        dto.setUserId(p.getUser().getId());
        dto.setCompanyName(p.getCompanyName());
        dto.setRegistrationNumber(p.getRegistrationNumber());
        dto.setDpiitRecognized(p.getDpiitRecognized());
        dto.setDpiitNumber(p.getDpiitNumber());
        dto.setSector(p.getSector());
        dto.setStage(p.getStage());
        dto.setFoundedYear(p.getFoundedYear());
        dto.setTeamSize(p.getTeamSize());
        dto.setAnnualTurnover(p.getAnnualTurnover());
        dto.setLocationState(p.getLocationState());
        dto.setLocationCity(p.getLocationCity());
        dto.setWebsite(p.getWebsite());
        dto.setDescription(p.getDescription());
        dto.setPrimarySkills(p.getPrimarySkills());
        dto.setCertifications(p.getCertifications());
        dto.setPastExperience(p.getPastExperience());
        dto.setVerifiedStatus(p.getVerifiedStatus());
        dto.setProfileCompletenessPct(p.getProfileCompletenessPct());
        return dto;
    }
}
