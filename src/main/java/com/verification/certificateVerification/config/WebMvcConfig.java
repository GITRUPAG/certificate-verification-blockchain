package com.verification.certificateVerification.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebMvcConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {

        // Expose local "uploads" folder to browser
        registry.addResourceHandler("/uploads/**")
                .addResourceLocations("file:uploads/");

    }
}
