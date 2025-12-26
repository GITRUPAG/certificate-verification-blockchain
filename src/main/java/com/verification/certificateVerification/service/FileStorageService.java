package com.verification.certificateVerification.service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class FileStorageService {

    private static final String UPLOAD_DIR = "uploads";

    public String saveFile(MultipartFile file, String studentId) throws IOException {

        Files.createDirectories(Paths.get(UPLOAD_DIR));

        String fileName =
                studentId + "_" + System.currentTimeMillis() + ".pdf";

        Path filePath = Paths.get(UPLOAD_DIR).resolve(fileName);

        Files.write(filePath, file.getBytes());

        return fileName; 
    }
}

