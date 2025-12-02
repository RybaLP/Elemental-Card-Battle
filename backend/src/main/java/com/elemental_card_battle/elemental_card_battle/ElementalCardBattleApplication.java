package com.elemental_card_battle.elemental_card_battle;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class ElementalCardBattleApplication {

	public static void main(String[] args) {
		SpringApplication.run(ElementalCardBattleApplication.class, args);
	}

}
