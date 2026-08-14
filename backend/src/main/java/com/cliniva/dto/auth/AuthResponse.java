package com.cliniva.dto.auth;

public class AuthResponse {
    private String token;
    private final String type = "Bearer";
    private Long userId;
    private String email;
    private String name;
    private String role;   // "admin", "doctor", "nurse", "patient"
    private String avatar; // 2-letter initials

    public AuthResponse() {}

    public AuthResponse(String token, Long userId, String email,
                        String name, String role, String avatar) {
        this.token = token;
        this.userId = userId;
        this.email = email;
        this.name = name;
        this.role = role;
        this.avatar = avatar;
    }

    public String getToken()  { return token; }
    public String getType()   { return type; }
    public Long getUserId()   { return userId; }
    public String getEmail()  { return email; }
    public String getName()   { return name; }
    public String getRole()   { return role; }
    public String getAvatar() { return avatar; }
}
