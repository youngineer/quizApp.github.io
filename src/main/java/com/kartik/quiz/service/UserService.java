package com.kartik.quiz.service;

import com.kartik.quiz.dao.User;
import com.kartik.quiz.dto.UserDTO;
import com.kartik.quiz.repository.UserRepository;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jdk.jshell.spi.ExecutionControl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public Boolean signUp(User user) {
        String username = user.getUsername();
        String password = user.getPassword();
        String role = user.getRole();

        // Check if user with given username already exists
        Optional<User> userMatch = userRepository.findByUsername(username);

        if (userMatch.isPresent()) {
            System.out.println("User already exists");
            return false;
        } else {
            // Save the new user
            userRepository.save(user);
            return true;
        }
    }


    public String signIn(User user) {
        String username = user.getUsername();
        String password = user.getPassword();
        String role = user.getRole().toLowerCase();

        // Find user by username
//        Optional<User> userMatch = userRepository.findByUsernameAndPasswordAndRole(username, password, role);
        Optional<User> userMatch = userRepository.findAllByUsername(username);
//        User testUser = testCase.get();
//        System.out.println(testUser.getPassword() + testUser.getUsername() + testUser.getRole());
        // Check if user exists

        if (userMatch.isEmpty()) {
            return "Username doesn't exist";
        }

        // Get the User object from the Optional
        User dbUser = userMatch.get();
        String dbRole = dbUser.getRole();
        String dbPassword = dbUser.getPassword();

        // Validate credentials
        if (role.equals(dbRole) && password.equals(dbPassword)) {
            return "Credentials verified!";
        } else if (!role.equals(dbRole)) {
            return "Incorrect login-role";
        } else {
            return "Incorrect password";
        }
    }
}

