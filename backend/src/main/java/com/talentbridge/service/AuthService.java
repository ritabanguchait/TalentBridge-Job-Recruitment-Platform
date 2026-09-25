package com.talentbridge.service;

import com.talentbridge.dto.AuthResponse;
import com.talentbridge.dto.LoginRequest;
import com.talentbridge.dto.RegisterRequest;
import com.talentbridge.security.UserPrincipal;

public interface AuthService {

    AuthResponse register(RegisterRequest request);

    AuthResponse login(LoginRequest request);

    UserPrincipal getCurrentUser();
}
