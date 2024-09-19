package com.kartik.quiz.controller;

import com.kartik.quiz.dao.Quiz;
import com.kartik.quiz.dto.QuizDTO;
import com.kartik.quiz.service.QuizService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/quiz")
@ResponseBody
@CrossOrigin(origins = "http://127.0.0.1:5500")
public class QuizController {

    @Autowired
    private QuizService quizService;

    @PostMapping("/postQuiz")
    public Long postQuiz(@RequestBody QuizDTO quiz){
        System.out.println(quiz);
        return quizService.postQuiz(quiz);
    }

    @GetMapping("/getAll")
    public Map<String, Object> getAllQuiz(@RequestParam String username, @RequestParam int page, @RequestParam int size) {
        System.out.println("Entered the controller");
        return quizService.getAllQuiz(username, page, size);
    }


    @GetMapping("/getAdminQuizzes")
    public ResponseEntity<Map<String, Object>> getAdminQuiz(@RequestParam String username, @RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "3") int size) {
        return ResponseEntity.ok(quizService.getAllQuizByUsername(username, page, size));
    }


    @GetMapping("/get")
    public Quiz getQuiz(@RequestBody Quiz quiz){
        Long id = quiz.getId();
        return quizService.getQuiz(id);
    }


    @PostMapping("/submit")
    public Integer getScore(@RequestParam Long id, @RequestParam String username, @RequestBody List<String> ansList) {
        System.out.println("Quiz ID: " + id);
        System.out.println("Answer List: " + ansList);
        return quizService.getScore(id, ansList, username);
    }

}
