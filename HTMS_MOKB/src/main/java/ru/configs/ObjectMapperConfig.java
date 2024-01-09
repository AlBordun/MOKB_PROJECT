package ru.configs;

import com.fasterxml.jackson.databind.cfg.CoercionAction;
import com.fasterxml.jackson.databind.cfg.CoercionConfig;
import com.fasterxml.jackson.databind.cfg.CoercionInputShape;
import com.fasterxml.jackson.databind.type.LogicalType;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.autoconfigure.jackson.Jackson2ObjectMapperBuilderCustomizer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class ObjectMapperConfig {

    private static final Logger logger = LoggerFactory.getLogger(ObjectMapperConfig.class);

    @Bean
    public Jackson2ObjectMapperBuilderCustomizer jsonCustomizer() {
        return builder -> builder.postConfigurer(objectMapper -> {
            logger.info("Configuring ObjectMapper for empty strings coercion to null");
            objectMapper.coercionConfigFor(LogicalType.Textual)
                    .setCoercion(CoercionInputShape.EmptyString, CoercionAction.AsNull);
            objectMapper.coercionConfigFor(LogicalType.OtherScalar)
                    .setCoercion(CoercionInputShape.EmptyString, CoercionAction.AsNull);
            // Дополнительные настройки по необходимости
            logger.info("ObjectMapper configured: " + objectMapper);
        });
    }
}
