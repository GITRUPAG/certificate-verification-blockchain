package com.verification.certificateVerification.service;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.verification.certificateVerification.model.Certificate;
import com.verification.certificateVerification.model.Student;
import com.verification.certificateVerification.repository.CertificateRepository;
import com.verification.certificateVerification.repository.StudentRepository;
import com.verification.certificateVerification.util.HashUtil;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CertificateService {

    private final StudentRepository studentRepo;
    private final CertificateRepository certRepo;
    private final BlockchainService blockchain;
    private final FileStorageService fileStorageService;
    private final EmailService emailService;

    /**
     * ISSUE CERTIFICATE (UPLOAD PDF)
     * ----------------------------------------------------
     * Steps:
     *  1. Validate student
     *  2. Create empty certificate to generate ID
     *  3. Generate certificateKey = studentId + "-" + certificateId
     *  4. Create hash = sha256(certificateKey)
     *  5. Store hash on blockchain
     *  6. Save uploaded PDF
     *  7. Save all details in database
     */
    public Certificate issueCertificate(String studentId, MultipartFile file) throws Exception {

        // Step 1: Validate student
        Student student = studentRepo.findByStudentId(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found"));

        // Step 2: Create empty certificate (ID auto-generated)
        Certificate temp = new Certificate();
        temp.setStudent(student);
        certRepo.save(temp); // after this, temp.getId() is available

        Long certificateId = temp.getId();

        String certificateName = file.getOriginalFilename();

        // Step 3: Create unique certificateKey
        // EXAMPLE: STU101-5
        String certificateKey = studentId + "-" + certificateId;

        // Step 4: Generate hash
        String hash = HashUtil.sha256(certificateKey);

        // Step 5: Store hash on blockchain
        String txHash = blockchain.storeHash(certificateKey, hash);

        // Step 6: Save PDF locally
        String savedFileName = fileStorageService.saveFile(file, studentId);

        // Create public URL for viewing PDF in browser
        String pdfUrl = "http://localhost:8080/api/files/" + savedFileName;

        // Step 7: Update certificate with all details
        temp.setCertificateKey(certificateKey);
        temp.setCertificateName(certificateName);
        temp.setHash(hash);
        temp.setBlockchainTx(txHash);
        temp.setIssuedAt(Instant.now());
        temp.setPdfUrl(pdfUrl);

        return certRepo.save(temp);
    }

    /**
     * VERIFY CERTIFICATE
     * ----------------------------------------------------
     * Frontend sends:
     * {
     *    "studentId": "STU101",
     *    "certificateId": 5
     * }
     *
     * Verification Steps:
     *  1. Fetch certificate by ID
     *  2. Confirm certificate belongs to studentId
     *  3. Recalculate hash using stored certificateKey
     *  4. Get stored hash from blockchain
     *  5. Compare both hashes
     */
    public boolean verifyCertificate(String studentId, Long certificateId) throws Exception {

        // Step 1: Load certificate
        Certificate cert = certRepo.findById(certificateId)
                .orElseThrow(() -> new RuntimeException("Certificate not found"));

        // Step 2: Validate studentId match
        if (!cert.getStudent().getStudentId().equals(studentId)) {
            return false; // fake certificate attempt
        }

        // Step 3: Recreate hash
        String recalculatedHash = HashUtil.sha256(cert.getCertificateKey());

        // Step 4: Fetch hash from blockchain
        String storedHash = blockchain.getHash(cert.getCertificateKey());

        if (storedHash == null) return false; // not found on blockchain = fake

        // Step 5: Compare
        return recalculatedHash.equalsIgnoreCase(storedHash);
    }

    public Optional<Certificate> getCertificateById(Long id) {
    return certRepo.findById(id);
}

public List<Certificate> getCertificatesByStudentId(String studentId) {
    return certRepo.findByStudent_StudentId(studentId);
}

// public Certificate verifyAndGetCertificate(String studentId, Long certificateId) throws Exception {

//     // Step 1: Load certificate
//     Certificate cert = certRepo.findById(certificateId)
//             .orElse(null);

//     if (cert == null) return null;

//     // Step 2: Validate student
//     if (!cert.getStudent().getStudentId().equals(studentId)) {
//         return null;
//     }

//     // Step 3: Recalculate hash
//     String recalculatedHash = HashUtil.sha256(cert.getCertificateKey());

//     // Step 4: Fetch blockchain hash
//     String storedHash = blockchain.getHash(cert.getCertificateKey());

//     if (storedHash == null) return null;

//     // Step 5: Compare
//     if (!recalculatedHash.equalsIgnoreCase(storedHash)) {
//         return null;
//     }

//     // VERIFIED — return full certificate as proof
//     return cert;
// }
public Certificate verifyAndGetCertificate(String studentId, Long certificateId) throws Exception {

    // Step 1: Load certificate
    Certificate cert = certRepo.findById(certificateId).orElse(null);

    if (cert == null) {
        return null;
    }

    // Step 2: Validate student
    if (!cert.getStudent().getStudentId().equals(studentId)) {
        // ❌ Email: invalid student
        emailService.sendVerificationResult(
                cert.getStudent().getEmail(),
                cert.getStudent().getName(),
                cert.getCertificateKey(),
                false
        );
        return null;
    }

    // Step 3: Recalculate hash
    String recalculatedHash = HashUtil.sha256(cert.getCertificateKey());

    // Step 4: Fetch blockchain hash
    String storedHash = blockchain.getHash(cert.getCertificateKey());

    boolean verified =
            storedHash != null &&
            recalculatedHash.equalsIgnoreCase(storedHash);

    // 📧 Step 5: Send Email (SUCCESS or FAILURE)
    emailService.sendVerificationResult(
            cert.getStudent().getEmail(),
            cert.getStudent().getName(),
            cert.getCertificateKey(),
            verified
    );

    // Step 6: Return certificate only if verified
    return verified ? cert : null;
}


}
