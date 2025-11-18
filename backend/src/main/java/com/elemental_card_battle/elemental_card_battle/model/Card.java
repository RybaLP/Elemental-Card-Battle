package com.elemental_card_battle.elemental_card_battle.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class Card {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private int power;

    private String name;

    private String color;

    private String elementalType;

    private String imageUrl;
}

