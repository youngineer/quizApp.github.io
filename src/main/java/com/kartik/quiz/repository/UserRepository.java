package com.kartik.quiz.repository;

import com.kartik.quiz.dao.Score;
import com.kartik.quiz.dao.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, String> {
//    @Query("select u from User u where u.username = ?1")
    Optional<User> findByUsername(String username);

//    @Query("SELECT COUNT(1) FROM User u WHERE u.username = ?1") //Returns 0 or 1
    Optional<User> findByUsernameAndPasswordAndRole(String username, String password, String role);

    Optional<User> findAllByUsername(String username);
}
