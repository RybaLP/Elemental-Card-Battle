package com.elemental_card_battle.elemental_card_battle.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "round_icons")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RoundIcon {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String color;
    private String elementalType;
    private String imageUrl;
}