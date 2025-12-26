package com.verification.certificateVerification.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.verification.certificateVerification.model.Student;
import com.verification.certificateVerification.model.User;
import com.verification.certificateVerification.repository.StudentRepository;
import com.verification.certificateVerification.repository.UserRepository;
import com.verification.certificateVerification.security.JwtUtil;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private StudentRepository studentRepository;

    // Signup API
    @PostMapping("/signup")
public ResponseEntity<Map<String, Object>> registerUser(@RequestBody Map<String, String> userMap) {

    String email = userMap.get("email");
    String username = userMap.get("username");
    String password = userMap.get("password");

    // Check in STUDENT table (not students)
    Student student = studentRepository.findByEmail(email).orElse(null);

    if (student == null) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(Map.of("error", "Email not found in student records. Contact admin."));
    }

    if (userRepository.existsByEmail(email)) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(Map.of("error", "Account already exists for this email"));
    }

    User user = new User(username, email, passwordEncoder.encode(password));
    user.getRoles().add("ROLE_USER");

    // LINK user → student
    user.setStudent(student);

    userRepository.save(user);

    String token = jwtUtil.generateToken(username);

    return ResponseEntity.ok(
            Map.of(
                    "token", token,
                    "username", username,
                    "email", email,
                    "studentId", student.getStudentId(),
                    "studentName", student.getName()
            )
    );
}

    // Login API
    @PostMapping("/login")
public ResponseEntity<Map<String, Object>> login(@RequestBody Map<String, String> loginData) {

    String input = loginData.get("input"); // email OR username
    String password = loginData.get("password");

    User user = userRepository.findByUsername(input)
            .orElseGet(() -> userRepository.findByEmail(input).orElse(null));

    if (user == null || !passwordEncoder.matches(password, user.getPassword())) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(Map.of("error", "Invalid username/email or password"));
    }

    String token = jwtUtil.generateToken(user.getUsername());

    Map<String, Object> response = new HashMap<>();
    response.put("token", token);
    response.put("username", user.getUsername());
    response.put("email", user.getEmail());
    response.put("roles", user.getRoles());

    // Return student details from `student` table
    if (user.getStudent() != null) {
        response.put("studentId", user.getStudent().getStudentId());
        response.put("studentName", user.getStudent().getName());
    }

    return ResponseEntity.ok(response);
}

@PostMapping("/admin/signup")
public ResponseEntity<Map<String, Object>> registerAdmin(
        @RequestBody Map<String, String> adminMap) {

    String username = adminMap.get("username");
    String email = adminMap.get("email");
    String password = adminMap.get("password");

    if (userRepository.existsByEmail(email)) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(Map.of("error", "Admin already exists"));
    }

    User admin = new User(
            username,
            email,
            passwordEncoder.encode(password)
    );

    admin.getRoles().add("ROLE_ADMIN");

    userRepository.save(admin);

    String token = jwtUtil.generateToken(username);

    return ResponseEntity.ok(Map.of(
            "token", token,
            "username", username,
            "email", email,
            "roles", admin.getRoles()
    ));
}



}
