package com.verification.certificateVerification.controller;

import java.util.Map;
import java.util.List;

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

        return ResponseEntity.ok(Map.of(
                "certificateId", cert.getId(),
                "certificateKey", cert.getCertificateKey(),
                "pdfUrl", cert.getPdfUrl(),
                "blockchainHash", cert.getHash(),
                "transactionHash", cert.getBlockchainTx(),
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
    @PostMapping("/verify")
    public ResponseEntity<?> verifyCertificate(@RequestBody Map<String, Object> request) throws Exception {

        String studentId = (String) request.get("studentId");
        Long certificateId = Long.valueOf(request.get("certificateId").toString());

        boolean isValid = certificateService.verifyCertificate(studentId, certificateId);

        return ResponseEntity.ok(Map.of(
                "verified", isValid,
                "certificateId", certificateId,
                "studentId", studentId
        ));
    }

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

    return ResponseEntity.ok(certificates.stream().map(cert -> Map.of(
            "certificateId", cert.getId(),
            "certificateKey", cert.getCertificateKey(),
            "pdfUrl", cert.getPdfUrl(),
            "blockchainHash", cert.getHash(),
            "transactionHash", cert.getBlockchainTx(),
            "issuedAt", cert.getIssuedAt(),
            "studentId", cert.getStudent().getStudentId(),
            "studentName", cert.getStudent().getName()
    )));
}


}
