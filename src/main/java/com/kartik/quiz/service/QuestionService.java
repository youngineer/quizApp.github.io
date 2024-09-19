package com.kartik.quiz.service;

import com.kartik.quiz.dao.Question;
import com.kartik.quiz.dao.Quiz;
import com.kartik.quiz.dto.QuizSession;
import com.kartik.quiz.repository.QuestionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class QuestionService {

    @Autowired
    private QuestionRepository questionRepository;

    public Boolean addQuestions(List<Question> questionList) {
        if (questionList == null || questionList.isEmpty()) {
            return false;
        }
        for (Question question : questionList) {
            if (question.getQuestionText() == null ||
                    question.getOption1() == null ||
                    question.getOption2() == null ||
//                    question.getOption3() == null ||
//                    question.getOption4() == null ||
                    question.getCorrectOption() == null) {
                return false;
            }
            questionRepository.save(question);
        }
        return true;
    }


    public Map<String, Object> getQuizDetails(Long quizId) {

        List<Question> questions = questionRepository.findAllByQuizId(quizId);
        List<QuizSession> quizSessions = new ArrayList<>();

        for (Question question : questions) {
            QuizSession session = new QuizSession();
            session.setQuestion(question.getQuestionText());
            session.setOption1(question.getOption1());
            session.setOption2(question.getOption2());

            if (question.getOption3() != null) {
                session.setOption3(question.getOption3());
            }
            if (question.getOption4() != null) {
                session.setOption4(question.getOption4());
            }

            session.setCorrectOption(question.getCorrectOption());

            quizSessions.add(session);
        }

        Integer timeLimit = questions.getFirst().getQuiz().getTimeLimit();

        Map<String, Object> quizDetailsMap = new HashMap<>();
        quizDetailsMap.put("questions", quizSessions);
        quizDetailsMap.put("timeLimit", timeLimit);

        return quizDetailsMap;
    }



}
