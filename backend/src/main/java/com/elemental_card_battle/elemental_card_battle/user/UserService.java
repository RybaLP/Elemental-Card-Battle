package com.elemental_card_battle.elemental_card_battle.user;

import com.elemental_card_battle.elemental_card_battle.card.dto.OwnedCardDto;
import com.elemental_card_battle.elemental_card_battle.exception.user.UserHasNotEnoughBalance;
import com.elemental_card_battle.elemental_card_battle.exception.user.UserNotFoundException;
import com.elemental_card_battle.elemental_card_battle.mapper.UserMapper;
import com.elemental_card_battle.elemental_card_battle.user.dto.LeaderBoardEntryDto;
import com.elemental_card_battle.elemental_card_battle.user.dto.ProfileDto;
import com.elemental_card_battle.elemental_card_battle.user.dto.UserProfileDto;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class UserService {
    private final UserRepository userRepository;
    private final UserMapper userMapper;

    public User findUserById (Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("User with provided id" + userId + "could not be found"));
    }

    public UserProfileDto getUserProfile (String email) {
        User user = findUserByEmail(email);
        return userMapper.userToUserProfileDto(user);
    }

    public UserProfileDto getUserProfileByUsername(String username) {
        User user = findUserByUsername(username);
        return userMapper.userToUserProfileDto(user);
    }

    @Transactional(readOnly = true)
    public User findUserByEmail (String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new UserNotFoundException(email));
    }

    public User findUserByUsername (String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UserNotFoundException(username));
        return user;
    }

    public void validateFunds(User user, int cost) {
        if (user.getCurrency() < cost) {
            log.warn("User {} has insufficient funds. Needed: {}, Has: {}",
                    user.getEmail(), cost, user.getCurrency());
            throw new UserHasNotEnoughBalance();
        }
    }

    public void deductBalance (User user ,  int price) {
        user.setCurrency(user.getCurrency() - price);
    }

    public ProfileDto getProfileByEmail(String email) {
        User user = findUserByEmail(email);

        List<OwnedCardDto> cards = user.getOwnedCards().stream()
                .map(uc -> new OwnedCardDto(
                        uc.getCard().getId(),
                        uc.getCard().getName(),
                        uc.getCard().getImageUrl(),
                        uc.getAcquiredAt()
                ))
                .collect(Collectors.toList());

        return new ProfileDto(
                user.getUsername(),
                user.getGamesWon(),
                user.getGamesLost(),
                user.getCurrency(),
                cards
        );
    }

    public void updateStats(Long userId, boolean hasWon) {
        if (userId < 0) {
            return;
        }

        User user = findUserById(userId);

        if (hasWon) {
            user.setGamesWon(user.getGamesWon() + 1);
            user.setCurrency(user.getCurrency() + 100);
        } else {
            user.setGamesLost(user.getGamesLost() + 1);
        }

        userRepository.save(user);
    }

    public List<LeaderBoardEntryDto> getTopPlayers(int limit) {
        Pageable pageable = PageRequest.of(0, limit);
        List<Object[]> rows = userRepository.findTopPlayers(pageable);
        return rows.stream()
                .map(row -> new LeaderBoardEntryDto(
                        (String) row[0],
                        ((Number) row[1]).intValue(),
                        ((Number) row[2]).intValue(),
                        ((Number) row[3]).doubleValue()
                ))
                .collect(Collectors.toList());
    }

}
