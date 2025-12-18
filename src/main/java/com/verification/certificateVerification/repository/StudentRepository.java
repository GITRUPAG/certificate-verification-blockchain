package com.verification.certificateVerification.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.verification.certificateVerification.model.Student;

@Repository
public interface StudentRepository extends JpaRepository<Student, Long> {

    boolean existsByEmail(String email);
    boolean existsByStudentId(String studentId);

    Optional<Student> findByStudentId(String studentId);

    Optional<Student> findByEmail(String email);
}
