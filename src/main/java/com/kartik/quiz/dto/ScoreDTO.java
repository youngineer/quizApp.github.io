package com.kartik.quiz.dto;

public class ScoreDTO {
    private String username;
    private Long quizId;
    private Integer score;

    public ScoreDTO(String username, Long quizId, Integer score) {
        this.username = username;
        this.quizId = quizId;
        this.score = score;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public Long getQuizId() {
        return quizId;
    }

    public void setQuizId(Long quizId) {
        this.quizId = quizId;
    }

    public Integer getScore() {
        return score;
    }

    public void setScore(Integer score) {
        this.score = score;
    }
}
