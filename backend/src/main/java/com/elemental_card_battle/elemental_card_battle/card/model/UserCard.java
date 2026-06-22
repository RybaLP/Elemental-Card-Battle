package com.elemental_card_battle.elemental_card_battle.card.model;

import com.elemental_card_battle.elemental_card_battle.user.User;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "user_card", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"user_id", "card_id"})
})
public class UserCard {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "card_id", nullable = false)
    private Card card;

    @Column(name = "acquired_at", nullable = false)
    private LocalDateTime acquiredAt;
}