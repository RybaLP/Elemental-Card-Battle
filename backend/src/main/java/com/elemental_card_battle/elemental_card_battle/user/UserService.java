package com.elemental_card_battle.elemental_card_battle.user;

import com.elemental_card_battle.elemental_card_battle.exception.user.UserHasNotEnoughBalance;
import com.elemental_card_battle.elemental_card_battle.exception.user.UserNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserService {
    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public User findUserByEmail (String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new UserNotFoundException(email));
    }

    @Transactional
    public void validateFunds(User user, int cost) {
        if (user.getCurrency() < cost) {
            log.warn("User {} has insufficient funds. Needed: {}, Has: {}",
                    user.getEmail(), cost, user.getCurrency());
            throw new UserHasNotEnoughBalance();
        }
    }

    @Transactional
    public void deductBalance (User user ,  int price) {
        user.setCurrency(user.getCurrency() - price);
    }

}
