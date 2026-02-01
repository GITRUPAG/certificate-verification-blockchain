package com.verification.certificateVerification.service;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;

    /**
     * Send certificate verification result to student email
     *
     * @param toEmail        Student email
     * @param studentName   Student name
     * @param certificateKey Unique certificate key (STU101-4)
     * @param verified      Verification result
     */
    public void sendVerificationResult(
            String toEmail,
            String studentName,
            String certificateKey,
            boolean verified
    ) {

        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);

        if (verified) {
            message.setSubject("✅ Certificate Verified Successfully");
            message.setText(
                    "Hello " + studentName + ",\n\n" +
                    "Your certificate with key (" + certificateKey + ") has been " +
                    "SUCCESSFULLY VERIFIED.\n\n" +
                    "This confirms that the certificate is authentic and recorded on the blockchain.\n\n" +
                    "Regards,\n" +
                    "Certificate Verification System"
            );
        } else {
            message.setSubject("❌ Certificate Verification Failed");
            message.setText(
                    "Hello " + studentName + ",\n\n" +
                    "Your certificate with key (" + certificateKey + ") could NOT be verified.\n\n" +
                    "Possible reasons:\n" +
                    "- Certificate data mismatch\n" +
                    "- Certificate not found on blockchain\n\n" +
                    "Please contact your institution for clarification.\n\n" +
                    "Regards,\n" +
                    "Certificate Verification System"
            );
        }

        mailSender.send(message);
    }
}
