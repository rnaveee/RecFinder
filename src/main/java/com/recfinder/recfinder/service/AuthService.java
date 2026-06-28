package com.recfinder.recfinder.service;

import com.recfinder.recfinder.dto.AuthResponse;
import com.recfinder.recfinder.dto.LoginRequest;
import com.recfinder.recfinder.dto.RegisterRequest;
import com.recfinder.recfinder.entity.User;
import com.recfinder.recfinder.exception.ConflictException;
import com.recfinder.recfinder.repository.UserRepository;
import com.recfinder.recfinder.security.JwtUtil;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;

    public AuthService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder,
                       AuthenticationManager authenticationManager,
                       JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.jwtUtil = jwtUtil;
    }

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        String email = request.email().toLowerCase();
        if (userRepository.findByEmail(email).isPresent()) {
            throw new ConflictException("Email already in use: " + email);
        }

        User user = new User();
        user.setName(request.name());
        user.setEmail(email);
        user.setPasswordHash(passwordEncoder.encode(request.password()));
        userRepository.save(user);

        return new AuthResponse(jwtUtil.generateToken(email));
    }

    public AuthResponse login(LoginRequest request) {
        String email = request.email().toLowerCase();
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(email, request.password())
        );
        return new AuthResponse(jwtUtil.generateToken(email));
    }
}
