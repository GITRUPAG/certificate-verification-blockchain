package com.verification.certificateVerification.service;

import java.util.Optional;
import java.util.List;

import com.verification.certificateVerification.model.Certificate;
import com.verification.certificateVerification.model.Student;
import com.verification.certificateVerification.repository.CertificateRepository;
import com.verification.certificateVerification.repository.StudentRepository;
import com.verification.certificateVerification.util.HashUtil;

import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.time.Instant;

@Service
@RequiredArgsConstructor
public class CertificateService {

    private final StudentRepository studentRepo;
    private final CertificateRepository certRepo;
    private final BlockchainService blockchain;
    private final FileStorageService fileStorageService;

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

        // Step 3: Create unique certificateKey
        // EXAMPLE: STU101-5
        String certificateKey = studentId + "-" + certificateId;

        // Step 4: Generate hash
        String hash = HashUtil.sha256(certificateKey);

        // Step 5: Store hash on blockchain
        String txHash = blockchain.storeHash(certificateKey, hash);

        // Step 6: Save PDF locally
        String pdfUrl = fileStorageService.saveFile(file, studentId);

        // Step 7: Update certificate with all details
        temp.setCertificateKey(certificateKey);
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


}
