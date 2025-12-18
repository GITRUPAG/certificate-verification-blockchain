package com.verification.certificateVerification.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.verification.certificateVerification.model.Student;
import com.verification.certificateVerification.repository.StudentRepository;

@Service
public class StudentService {

    @Autowired
    private StudentRepository studentRepository;

    public Student addStudent(Student student) {

        if (studentRepository.existsByEmail(student.getEmail())) {
            throw new RuntimeException("Email already exists");
        }
        if (studentRepository.existsByStudentId(student.getStudentId())) {
            throw new RuntimeException("Student ID already exists");
        }

        return studentRepository.save(student);
    }

    public List<Student> getAllStudents() {
        return studentRepository.findAll();
    }

    public Optional<Student> getStudentById(Long id) {
        return studentRepository.findById(id);
    }

    public void deleteStudent(Long id) {
        studentRepository.deleteById(id);
    }

    public Student updateStudent(Long id, Student updatedStudent) {

        Student existing = studentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Student not found with ID: " + id));

        if (!existing.getEmail().equals(updatedStudent.getEmail()) &&
            studentRepository.existsByEmail(updatedStudent.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        if (!existing.getStudentId().equals(updatedStudent.getStudentId()) &&
            studentRepository.existsByStudentId(updatedStudent.getStudentId())) {
            throw new RuntimeException("Student ID already exists");
        }

        existing.setName(updatedStudent.getName());
        existing.setEmail(updatedStudent.getEmail());
        existing.setStudentId(updatedStudent.getStudentId());
        existing.setCourseName(updatedStudent.getCourseName());
        existing.setDegreeType(updatedStudent.getDegreeType());
        existing.setAcademicYear(updatedStudent.getAcademicYear());
        existing.setDateOfBirth(updatedStudent.getDateOfBirth());

        return studentRepository.save(existing);
    }
}
