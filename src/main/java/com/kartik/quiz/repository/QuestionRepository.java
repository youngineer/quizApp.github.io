package com.kartik.quiz.repository;

import com.kartik.quiz.dao.Question;
import com.kartik.quiz.dao.Quiz;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface QuestionRepository extends JpaRepository<Question, Long> {

    List<Question> findAllByQuizId(Long reqQuizId);

}
