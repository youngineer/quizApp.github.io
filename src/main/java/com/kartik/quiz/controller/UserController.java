package com.kartik.quiz.controller;

import com.kartik.quiz.dao.User;
import com.kartik.quiz.dto.UserDTO;
import com.kartik.quiz.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Locale;

@CrossOrigin(origins = "http://127.0.0.1:5500")
@RestController
@RequestMapping("/user")
@ResponseBody
public class UserController {

    @Autowired
    private UserService userSevice;

    @PostMapping("/signup")
    public Boolean signUp(@RequestBody User user){
        return userSevice.signUp(user);
    }

    @PostMapping("/signin")
    public String signIn(@RequestBody User user){
        return userSevice.signIn(user);
    }
}
