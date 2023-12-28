package ru.configs;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig {

    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**") // Применяется ко всем URL
                        .allowedOriginPatterns("*") // Разрешает запросы со всех доменов
                        .allowedMethods("*") // Разрешает все HTTP методы
                        .allowedHeaders("*") // Разрешает все заголовки
                        .allowCredentials(false); // Разрешает отправку учетных данных (куки, HTTP аутентификация и т.д.)
            }
        };
    }
}
