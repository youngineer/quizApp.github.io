package com.kartik.quiz.controller;

import com.kartik.quiz.dao.Question;
import com.kartik.quiz.service.QuestionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;


@CrossOrigin(origins = "http://127.0.0.1:5500")
@RequestMapping("/questions")
@RestController
public class QuestionController {

    @Autowired
    private QuestionService questionService;

    @PostMapping("/post")
    public ResponseEntity<?> addQuestion(@RequestBody List<Question> questionList) {
        System.out.println("Received request to add questions: {}" + questionList);

        if (questionList == null || questionList.isEmpty()) {
            return ResponseEntity.badRequest().body("Question list is null or empty");
        }

        boolean result = questionService.addQuestions(questionList);

        if (result) {
            return ResponseEntity.ok("Questions added successfully");
        } else {
            return ResponseEntity.badRequest().body("Failed to add questions");
        }
    }

    @GetMapping("/getQuestions")
    public Map<String, Object> getQuestions(@RequestParam Long quizId){
        return questionService.getQuizDetails(quizId);
    }
}
