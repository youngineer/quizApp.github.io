package com.kartik.quiz.dto;

import com.kartik.quiz.dao.Question;

import java.util.List;

public class QuizDTO {
    private Long quizId;
    private String username;
    private Integer timeLimit;
    private List<Question> questionList;

    public QuizDTO(Long quizId, String username, Integer timeLimit, List<Question> questionList) {
        this.quizId = quizId;
        this.username = username;
        this.timeLimit = timeLimit;
        this.questionList = questionList;
    }

    public Long getQuizId() {
        return quizId;
    }

    public void setQuizId(Long quizId) {
        this.quizId = quizId;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public Integer getTimeLimit() {
        return timeLimit;
    }

    public void setTimeLimit(Integer timeLimit) {
        this.timeLimit = timeLimit;
    }

    public List<Question> getQuestionList() {
        return questionList;
    }

    public void setQuestionList(List<Question> questionList) {
        this.questionList = questionList;
    }
}
