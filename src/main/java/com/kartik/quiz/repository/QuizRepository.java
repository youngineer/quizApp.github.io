package com.kartik.quiz.repository;

import com.kartik.quiz.dao.Quiz;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface QuizRepository extends JpaRepository<Quiz, Long> {
    Page<Quiz> findAll(Pageable pageable);
    Optional<Quiz> findByIdAndUsername(Long id, String username);

//    @Query("SELECT (q.id, q.username, q.timeLimit) FROM Quiz q ORDER BY q.username ASC")
//    Optional<List<Quiz>> findAllQuizDetails();

    Page<Quiz> findAllByUsername(String username, Pageable pageable);

}

