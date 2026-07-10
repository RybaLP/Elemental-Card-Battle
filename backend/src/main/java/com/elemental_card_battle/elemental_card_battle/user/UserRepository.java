package com.elemental_card_battle.elemental_card_battle.user;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User,Long>{
    Optional<User> findByUsername(String username);
    Optional<User> findByEmail (String email);

    @Query("""
    SELECT u.username, u.gamesWon, u.gamesLost,
           CASE WHEN (u.gamesWon + u.gamesLost) > 0
                THEN (u.gamesWon * 1.0 / (u.gamesWon + u.gamesLost))
                ELSE 0.0 END AS winRate
    FROM User u
    ORDER BY winRate DESC, u.gamesWon DESC, u.username ASC
    """)
    List<Object[]> findTopPlayers(Pageable pageable);
}
