package com.elemental_card_battle.elemental_card_battle.controller;

import com.elemental_card_battle.elemental_card_battle.dto.player.PlayerNicknameDto;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.transaction.Transactional;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.junit.jupiter.api.Nested;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@Transactional
@ActiveProfiles("test")
@DisplayName("Player Controller Integration Tests")
class PlayerControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Nested
    @DisplayName("POST /players - Creating Player")
    class CreatePlayer {

        @Test
        @DisplayName("Should return 200 OK ")
        void shouldCreatePlayerSuccessfully() throws Exception {
            // given
            String nickname = "TestowyGracz";
            PlayerNicknameDto requestDto = new PlayerNicknameDto(nickname);

            // when & then
            mockMvc.perform(post("/players")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(requestDto)))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.nickname").value(nickname))
                    .andExpect(jsonPath("$.id").exists());
        }
    }


    @Test
    @DisplayName("Should return 400 Bad Request when nickname is empty")
    void shouldReturnBadRequestWhenNicknameIsEmpty () throws Exception {
        PlayerNicknameDto requestDto = new PlayerNicknameDto("");

        mockMvc.perform(post("/players")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(requestDto)))
                .andExpect(status().isBadRequest());
    }
}