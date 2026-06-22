package com.elemental_card_battle.elemental_card_battle.auth;

import com.elemental_card_battle.elemental_card_battle.auth.dto.LoginRequest;
import com.elemental_card_battle.elemental_card_battle.auth.dto.RegisterRequest;
import com.elemental_card_battle.elemental_card_battle.exception.auth.DifferentPasswordsException;
import com.elemental_card_battle.elemental_card_battle.exception.user.UserNotFoundException;
import com.elemental_card_battle.elemental_card_battle.security.JwtService;
import com.elemental_card_battle.elemental_card_battle.user.User;
import com.elemental_card_battle.elemental_card_battle.user.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final JwtService jwtService;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;

    @Transactional
    public String handleRegister(RegisterRequest registerRequest) {
        if (!registerRequest.password().equals(registerRequest.confirmPassword())) {
            throw new DifferentPasswordsException();
        }

        User user = User.builder()
                .username(registerRequest.username())
                .email(registerRequest.email())
                .password(passwordEncoder.encode(registerRequest.password())) // Haszujemy hasło!
                .build();

        userRepository.save(user);

        return jwtService.generateToken(user);
    }

    public String handleLogin(LoginRequest loginRequest) {

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.email(),
                        loginRequest.password()
                )
        );

        User user = userRepository.findByEmail(loginRequest.email())
                .orElseThrow(() -> new UserNotFoundException(loginRequest.email()));

        return jwtService.generateToken(user);
    }
}
