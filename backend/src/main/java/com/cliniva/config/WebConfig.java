package com.cliniva.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // Link the /hms/assets path to the external frontend assets directory
        registry.addResourceHandler("/hms/assets/**")
                .addResourceLocations("file:d:/HMS/frontend/public/hms/assets/")
                .setCachePeriod(0);
        
        // Root assets
        registry.addResourceHandler("/assets/**")
                .addResourceLocations("file:d:/HMS/frontend/public/hms/assets/")
                .setCachePeriod(0);
    }
}

