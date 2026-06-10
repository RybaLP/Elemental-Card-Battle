package com.elemental_card_battle.elemental_card_battle.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SwaggerConfig {

    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("Elemental Card Battle API")
                        .version("1.0")
                        .description("REST API for the Elemental Card Battle card game. " +
                                "Provides support for game rooms, chat messaging, and multiplayer gameplay.")
                        .contact(new Contact()
                                .name("RybaLP")
                                .url("https://github.com/RybaLP/Elemental-Card-Battle")));
    }
}