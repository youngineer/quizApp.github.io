package com.kartik.quiz.service;

import com.kartik.quiz.dao.Question;
import com.kartik.quiz.dao.Quiz;
import com.kartik.quiz.dao.Score;
import com.kartik.quiz.dao.User;
import com.kartik.quiz.dto.QuizDTO;
import com.kartik.quiz.dto.ScoreDTO;
import com.kartik.quiz.repository.QuestionRepository;
import com.kartik.quiz.repository.QuizRepository;
import com.kartik.quiz.repository.ScoreRepository;
import com.kartik.quiz.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class QuizService {

    @Autowired
    private QuizRepository quizRepository;

    @Autowired
    private QuestionService questionService;

    @Autowired
    private QuestionRepository questionRepository;

    @Autowired
    private ScoreRepository scoreRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ScoreService scoreService;


    private Map<String, Map<String, List<String>>> getQuizEntities(Long quizId) {
        List<Question> fetchedQuestions = questionRepository.findAllById(Collections.singleton(quizId));
        Map<String, Map<String, List<String>>> quizMap = new HashMap<>();

        if (fetchedQuestions.isEmpty()) {
            return Collections.emptyMap();

        } else {
            List<String> allQuestions = new ArrayList<>();
            List<String> allOptions = new ArrayList<>();
            List<String> allAnswers = new ArrayList<>();

            for (Question question : fetchedQuestions) {
                allQuestions.add(question.getQuestionText());
                allOptions.addAll(question.getOptions());
                allAnswers.add(String.valueOf(question.getCorrectOption()));
            }

            quizMap.put("questions", Collections.singletonMap("data", allQuestions));
            quizMap.put("options", Collections.singletonMap("data", allOptions));
            quizMap.put("answers", Collections.singletonMap("data", allAnswers));

            return quizMap;
        }
    }


    // For the user to upload quiz in db
    public Long postQuiz(QuizDTO quiz) {
        Quiz quizObj = new Quiz();
        quizObj.setTimeLimit(quiz.getTimeLimit());
        quizObj.setUsername(quiz.getUsername());

        Quiz savedQuiz = quizRepository.save(quizObj); // Save the new quiz

        for(Question question: quiz.getQuestionList()){
            question.setQuiz(savedQuiz);
        }

        questionService.addQuestions(quiz.getQuestionList());


//        System.out.println(savedQuiz.getId());
        Long quizID = savedQuiz.getId();
//        System.out.println(quizID);// Return the generated ID

        Question question = new Question();
        questionService.addQuestions(quiz.getQuestionList());
        return savedQuiz.getId();
    }

    //To display all the available quizzes
//    public List<List<String>> getAllQuiz() {
//        List<Quiz> quizDbItems = quizRepository.findAll();
//        if (quizDbItems.isEmpty())
//            return Collections.emptyList();
//
//        else {
//            List<List<String>> quizList = new ArrayList<>();
//            for (Quiz quizRow : quizDbItems) {
//                List<String> quizEntity = new ArrayList<>();
//
//                String quizId = String.valueOf(quizRow.getId());
//                String creator = String.valueOf(quizRow.getUsername());
//                String time = String.valueOf(quizRow.getTimeLimit());
//
//                quizEntity.add(quizId);
//                quizEntity.add(creator);
//                quizEntity.add(time);
//
//                System.out.println(quizId + creator + time);
//
//                quizList.add(quizEntity);
//            }
//            return quizList;
//        }
//    }

    public Map<String, Object> getAllQuiz(String username, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Quiz> quizPage = quizRepository.findAll(pageable);
        System.out.println("GetAllQuizzes Entered");

        if (quizPage.isEmpty()) {
            System.out.println("It is empty");
            return Collections.emptyMap();
        }

        List<Map<String, Object>> quizList = new ArrayList<>();
        List<Score> userScores = scoreRepository.findAllByUser_Username(username);
        Map<Long, Integer> quizScores = new HashMap<>();

        for (Score score : userScores) {
            quizScores.put(score.getQuiz().getId(), score.getScore());
        }

        for (Quiz quizRow : quizPage.getContent()) {
            Map<String, Object> quizEntity = new HashMap<>();

            Long quizId = quizRow.getId();
            String creator = quizRow.getUsername();
            Integer timeLimit = quizRow.getTimeLimit();
            Integer userScore = quizScores.getOrDefault(quizId, -1);

            quizEntity.put("quizId", quizId);
            quizEntity.put("creator", creator);
            quizEntity.put("timeLimit", timeLimit);
            quizEntity.put("userScore", userScore);

            quizList.add(quizEntity);
            System.out.println(quizEntity);
        }

        Map<String, Object> response = new HashMap<>();

        response.put("quizzes", quizList);
        response.put("currentPage", quizPage.getNumber());
        response.put("totalItems", quizPage.getTotalElements());
        response.put("totalPages", quizPage.getTotalPages());

        System.out.println("Total quizzes: " + quizPage.getTotalElements());

        return response;
    }


    public Map<String, Object> getAllQuizByUsername(String username, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Quiz> quizPage = quizRepository.findAllByUsername(username, pageable);

        List<List<String>> adminQuizList = new ArrayList<>();
        for (Quiz quiz : quizPage.getContent()) {
            List<String> curQuiz = new ArrayList<>();

            curQuiz.add(String.valueOf(quiz.getId()));
            curQuiz.add(quiz.getUsername());
            curQuiz.add(String.valueOf(quiz.getTimeLimit()));

            adminQuizList.add(curQuiz);
            System.out.println(curQuiz);
        }

        Map<String, Object> response = new HashMap<>();

        response.put("quizzes", adminQuizList);
        response.put("currentPage", quizPage.getNumber());
        response.put("totalItems", quizPage.getTotalElements());
        response.put("totalPages", quizPage.getTotalPages());

        return response;
    }

    //Returns the quiz
    public Quiz getQuiz(Long reqQuizId) {
        Optional<Quiz> quizOptional = quizRepository.findById(reqQuizId);

        if (quizOptional.isPresent()) {
            return quizOptional.get();
        }

        else {
            return null;
        }
    }


    public Integer getScore(Long quizId, List<String> userAnswers, String username) {
        Quiz quiz = quizRepository.findById(quizId)
                .orElseThrow(() -> new RuntimeException("Quiz not found with id: " + quizId));

        List<Question> questions = questionRepository.findAllByQuizId(quizId);

        if (questions.isEmpty()) {
            throw new RuntimeException("No questions found for quiz with id: " + quizId);
        }

        int score = 0;
        for (int i = 0; i < Math.min(userAnswers.size(), questions.size()); i++) {
            if (userAnswers.get(i) != null &&
                    userAnswers.get(i).equals(questions.get(i).getCorrectOption().toString())) {
                score++;
            }
        }

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found with username: " + username));

        Score result = new Score(user, quiz, score);
        scoreRepository.save(result);

        return score;
    }

}
