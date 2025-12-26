package com.verification.certificateVerification.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.verification.certificateVerification.model.Certificate;
import com.verification.certificateVerification.service.CertificateService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/certificates")
@RequiredArgsConstructor
public class CertificateController {

    private final CertificateService certificateService;

    /**
     * ISSUE CERTIFICATE (UPLOAD PDF)
     * ----------------------------------------------------
     * Endpoint: POST /api/certificates/issue
     * Params:
     *    studentId (String)
     *    file (MultipartFile - PDF)
     */
    @PostMapping(value = "/issue", consumes = "multipart/form-data")
public ResponseEntity<?> issueCertificate(
        @RequestParam String studentId,
        @RequestParam("file") MultipartFile file
) throws Exception {

    Certificate cert = certificateService.issueCertificate(studentId, file);

    // FRONTEND BASE URL (can be moved to properties)
    String verifyUrl = "http://localhost:3000/verify/"
            + cert.getStudent().getStudentId() + "/"
            + cert.getId();

    return ResponseEntity.ok(Map.of(
            "certificateId", cert.getId(),
            "certificateKey", cert.getCertificateKey(),
            "pdfUrl", cert.getPdfUrl(),
            "verifyUrl", verifyUrl,   // ⭐ IMPORTANT
            "issuedAt", cert.getIssuedAt(),
            "studentId", cert.getStudent().getStudentId(),
            "studentName", cert.getStudent().getName()
    ));
}

    /**
     * VERIFY CERTIFICATE
     * ----------------------------------------------------
     * Endpoint: POST /api/certificates/verify
     * Body:
     * {
     *    "studentId": "STU101",
     *    "certificateId": 5
     * }
     */
//     @PostMapping("/verify")
//     public ResponseEntity<?> verifyCertificate(@RequestBody Map<String, Object> request) throws Exception {

//         String studentId = (String) request.get("studentId");
//         Long certificateId = Long.valueOf(request.get("certificateId").toString());

//         boolean isValid = certificateService.verifyCertificate(studentId, certificateId);

//         return ResponseEntity.ok(Map.of(
//                 "verified", isValid,
//                 "certificateId", certificateId,
//                 "studentId", studentId
//         ));
//     }

    /**
     * OPTIONAL:
     * FETCH CERTIFICATE DETAILS BY ID
     */
    @GetMapping("/{id}")
public ResponseEntity<?> getCertificateById(@PathVariable Long id) {

    return certificateService.getCertificateById(id)
            .map(cert -> ResponseEntity.ok(Map.of(
                    "certificateId", cert.getId(),
                    "certificateKey", cert.getCertificateKey(),
                    "pdfUrl", cert.getPdfUrl(),
                    "blockchainHash", cert.getHash(),
                    "transactionHash", cert.getBlockchainTx(),
                    "issuedAt", cert.getIssuedAt(),
                    "studentId", cert.getStudent().getStudentId(),
                    "studentName", cert.getStudent().getName()
            )))
            .orElse(ResponseEntity.status(404).body(Map.of("error", "Certificate not found")));
}

@GetMapping("/student/{studentId}")
public ResponseEntity<?> getCertificatesByStudent(@PathVariable String studentId) {

    var certificates = certificateService.getCertificatesByStudentId(studentId);

    if (certificates.isEmpty()) {
        return ResponseEntity.ok(Map.of(
                "studentId", studentId,
                "certificates", List.of(),
                "message", "No certificates found for this student."
        ));
    }

    return ResponseEntity.ok(
        certificates.stream().map(cert -> {
            Map<String, Object> map = new HashMap<>();

            map.put("certificateId", cert.getId());
            map.put("certificateName", cert.getCertificateName()); // may be null ✅
            map.put("certificateKey", cert.getCertificateKey());
            map.put("pdfUrl", cert.getPdfUrl());
            map.put("blockchainHash", cert.getHash());
            map.put("transactionHash", cert.getBlockchainTx());
            map.put("issuedAt", cert.getIssuedAt());
            map.put("studentId", cert.getStudent().getStudentId());
            map.put("studentName", cert.getStudent().getName());

            return map;
        }).toList()
    );
}

@PostMapping("/verify")
public ResponseEntity<?> verifyCertificate(@RequestBody Map<String, Object> request) throws Exception {

    String studentId = (String) request.get("studentId");
    Long certificateId = Long.valueOf(request.get("certificateId").toString());

    Certificate cert =
            certificateService.verifyAndGetCertificate(studentId, certificateId);

    if (cert == null) {
        return ResponseEntity.ok(Map.of("verified", false));
    }

   
    Map<String, Object> response = new HashMap<>();

    response.put("verified", true);

    response.put("studentName", cert.getStudent().getName());
    response.put("studentId", cert.getStudent().getStudentId());
    response.put("courseName", cert.getStudent().getCourseName());
    response.put("degreeType", cert.getStudent().getDegreeType());
    response.put("academicYear", cert.getStudent().getAcademicYear());

    
    response.put("certificateId", cert.getId());
    response.put("certificateKey", cert.getCertificateKey());
    response.put("issuedAt", cert.getIssuedAt());
    response.put("certificateHash", cert.getHash());
    response.put("transactionHash", cert.getBlockchainTx());
    response.put("pdfUrl", cert.getPdfUrl());

    return ResponseEntity.ok(response);
}



}
