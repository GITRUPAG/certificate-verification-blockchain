package com.verification.certificateVerification.service;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class FileStorageService {

    private final String uploadDir = "uploads/";

    public FileStorageService() {
        File folder = new File(uploadDir);
        if (!folder.exists()) {
            folder.mkdirs();
        }
    }

    public String saveFile(MultipartFile file, String studentId) throws IOException {
        String fileName = studentId + "_" + file.getOriginalFilename();
        Path filePath = Paths.get(uploadDir + fileName);

        Files.write(filePath, file.getBytes());

        // Return URL (local server URL for download)
        return "/uploads/" + fileName;
    }
}
