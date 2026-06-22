package com.elemental_card_battle.elemental_card_battle.auth.dto;

public record LoginRequest(
        String email,
        String password
) {}