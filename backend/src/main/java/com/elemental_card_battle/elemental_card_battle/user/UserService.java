package com.elemental_card_battle.elemental_card_battle.user;

import com.elemental_card_battle.elemental_card_battle.exception.user.UserHasNotEnoughBalance;
import com.elemental_card_battle.elemental_card_battle.exception.user.UserNotFoundException;
import com.elemental_card_battle.elemental_card_battle.mapper.UserMapper;
import com.elemental_card_battle.elemental_card_battle.user.dto.UserProfileDto;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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

}
