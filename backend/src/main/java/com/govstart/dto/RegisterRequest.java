package com.govstart.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class RegisterRequest {
    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email address")
    private String email;

    @NotBlank(message = "Password is required")
    @Size(min = 6, message = "Password must be at least 6 characters")
    private String password;

    @NotBlank(message = "Full name is required")
    private String fullName;

    private String phone;

    // Startup Company Fields
    @NotBlank(message = "Company name is required")
    private String companyName;

    @NotBlank(message = "Registration / CIN number is required")
    private String registrationNumber;

    @NotBlank(message = "Sector is required")
    private String sector;

    @NotBlank(message = "State is required")
    private String locationState;

    @NotBlank(message = "City is required")
    private String locationCity;

    private Boolean dpiitRecognized = false;
    private String dpiitNumber;

    public RegisterRequest() {}

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getCompanyName() { return companyName; }
    public void setCompanyName(String companyName) { this.companyName = companyName; }

    public String getRegistrationNumber() { return registrationNumber; }
    public void setRegistrationNumber(String registrationNumber) { this.registrationNumber = registrationNumber; }

    public String getSector() { return sector; }
    public void setSector(String sector) { this.sector = sector; }

    public String getLocationState() { return locationState; }
    public void setLocationState(String locationState) { this.locationState = locationState; }

    public String getLocationCity() { return locationCity; }
    public void setLocationCity(String locationCity) { this.locationCity = locationCity; }

    public Boolean getDpiitRecognized() { return dpiitRecognized; }
    public void setDpiitRecognized(Boolean dpiitRecognized) { this.dpiitRecognized = dpiitRecognized; }

    public String getDpiitNumber() { return dpiitNumber; }
    public void setDpiitNumber(String dpiitNumber) { this.dpiitNumber = dpiitNumber; }
}
