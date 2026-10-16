package com.govstart.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public class BootstrapAdminRequest {
    @NotBlank(message = "Bootstrap secret key is required")
    private String bootstrapSecret;

    @NotBlank(message = "Email is required")
    @Email(message = "Valid email is required")
    private String email;

    @NotBlank(message = "Password is required")
    private String password;

    @NotBlank(message = "Full name is required")
    private String fullName;

    public BootstrapAdminRequest() {}

    public String getBootstrapSecret() { return bootstrapSecret; }
    public void setBootstrapSecret(String bootstrapSecret) { this.bootstrapSecret = bootstrapSecret; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }
}
