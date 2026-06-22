package com.elemental_card_battle.elemental_card_battle.card.model;

import com.elemental_card_battle.elemental_card_battle.card.ElementalType;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "card")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Card {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private int power;

    private String name;

    private String color;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ElementalType elementalType;

    private String imageUrl;

    private int price;
}

