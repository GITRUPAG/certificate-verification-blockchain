package com.verification.certificateVerification.model;

import java.time.Instant;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

@Entity
public class Certificate {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String certificateName;

    private String hash;            // SHA-256 hash
    private String blockchainTx;    // TX Hash stored on blockchain

    private Instant issuedAt;

    private String pdfUrl;  
    
    private String certificateKey;   // UNIQUE

    @ManyToOne
    @JoinColumn(name = "student_id")
    private Student student;

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getCertificateName() { return certificateName; }
    public void setCertificateName(String certificateName) { this.certificateName = certificateName; }

    public String getHash() { return hash; }
    public void setHash(String hash) { this.hash = hash; }

    public String getBlockchainTx() { return blockchainTx; }
    public void setBlockchainTx(String blockchainTx) { this.blockchainTx = blockchainTx; }

    public Instant getIssuedAt() { return issuedAt; }
    public void setIssuedAt(Instant issuedAt) { this.issuedAt = issuedAt; }

    public Student getStudent() { return student; }
    public void setStudent(Student student) { this.student = student; }

    // ✅ Getter & Setter for pdfUrl
    public String getPdfUrl() { return pdfUrl; }
    public void setPdfUrl(String pdfUrl) { this.pdfUrl = pdfUrl; }

    public String getCertificateKey() { return certificateKey; }
    public void setCertificateKey(String certificateKey) { this.certificateKey = certificateKey;}
}
