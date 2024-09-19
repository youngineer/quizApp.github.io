package com.kartik.quiz.repository;

import com.kartik.quiz.dao.Score;
import com.kartik.quiz.dao.User;
import com.kartik.quiz.dto.ScoreDTO;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;


@Repository
public interface ScoreRepository extends JpaRepository<Score, Long> {
    List<Score> findAllByUser_Username(String username);

    Optional<Score> findByQuiz_IdAndUser_Username(Long quizId, String username);

}

