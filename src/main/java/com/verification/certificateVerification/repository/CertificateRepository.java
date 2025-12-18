package com.verification.certificateVerification.repository;


import org.springframework.data.jpa.repository.JpaRepository;

import com.verification.certificateVerification.model.Certificate;
import java.util.List;

public interface CertificateRepository extends JpaRepository<Certificate, Long> {

    List<Certificate> findByStudent_StudentId(String studentId);
}
