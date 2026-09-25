package com.talentbridge.repository;

import com.talentbridge.entity.Role;
import com.talentbridge.entity.User;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;
import org.springframework.test.context.ActiveProfiles;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
@ActiveProfiles("test")
class UserRepositoryTest {

    @Autowired
    private TestEntityManager entityManager;

    @Autowired
    private UserRepository userRepository;

    @Test
    @DisplayName("Should save user and find by email successfully")
    void shouldSaveAndFindByEmail() {
        User user = User.builder()
                .email("john.doe@example.com")
                .password("$2a$10$encryptedPasswordExample")
                .firstName("John")
                .lastName("Doe")
                .role(Role.ROLE_CANDIDATE)
                .isActive(true)
                .build();

        User savedUser = entityManager.persistAndFlush(user);

        assertThat(savedUser.getId()).isNotNull();
        assertThat(savedUser.getCreatedAt()).isNotNull();

        Optional<User> found = userRepository.findByEmail("john.doe@example.com");
        assertThat(found).isPresent();
        assertThat(found.get().getFirstName()).isEqualTo("John");
        assertThat(found.get().getRole()).isEqualTo(Role.ROLE_CANDIDATE);
    }

    @Test
    @DisplayName("existsByEmail returns true for existing email and false for new email")
    void shouldCheckEmailExistence() {
        User user = User.builder()
                .email("jane.recruiter@example.com")
                .password("$2a$10$encryptedPasswordExample")
                .firstName("Jane")
                .lastName("Smith")
                .role(Role.ROLE_RECRUITER)
                .isActive(true)
                .build();

        entityManager.persistAndFlush(user);

        assertThat(userRepository.existsByEmail("jane.recruiter@example.com")).isTrue();
        assertThat(userRepository.existsByEmail("nonexistent@example.com")).isFalse();
    }
}
