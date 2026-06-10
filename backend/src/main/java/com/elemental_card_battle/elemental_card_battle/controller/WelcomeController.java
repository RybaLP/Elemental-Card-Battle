package com.elemental_card_battle.elemental_card_battle.controller;

import io.swagger.v3.oas.annotations.Operation;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class WelcomeController {

    @Operation(summary = "Health check", description = "Returns API status and link to documentation")
    @GetMapping("/")
    public ResponseEntity<String> welcome () {
        return ResponseEntity.ok("Elemental Card Battle API is running! Docs: /swagger-ui/index.html");
    }
}
