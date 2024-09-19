package com.kartik.quiz.service;

import com.kartik.quiz.dao.Score;
import com.kartik.quiz.repository.ScoreRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class ScoreService {

    @Autowired
    private ScoreRepository scoreRepository;

    public Boolean postScore(Score score){
        if (score == null)
            return false;

        if(score.getQuiz() == null ||
        score.getScore() == null ||
        score.getScoreId() == null ||
        score.getUser() == null){
            return false;
        }

        scoreRepository.save(score);
        return true;
    }


    public List<Integer> getUserAllScores(String username){
        List<Score> getScoreDetails = scoreRepository.findAllByUser_Username(username);
        List<Integer> scoreList = new ArrayList<>();
        Integer i = 0;

        for(Score score: getScoreDetails){
            scoreList.add(score.getScore());
            System.out.println(i + ": "+score.getScore());
            i ++;
        }


        return scoreList;
    }
}
