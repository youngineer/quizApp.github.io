package com.kartik.quiz.controller;

import com.kartik.quiz.dao.Score;
import com.kartik.quiz.service.ScoreService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RequestMapping("scores")
@RestController
public class ScoreController {

    @Autowired
    private ScoreService scoreService;

    @PostMapping("/postScore")
    public Boolean postScore(Score score){
        return scoreService.postScore(score);
    }

    @GetMapping("/getUserScore")
    public List<Integer> getUserScore(String username){
        return scoreService.getUserAllScores(username);
    }
}
