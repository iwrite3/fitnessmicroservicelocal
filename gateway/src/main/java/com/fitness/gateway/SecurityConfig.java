package com.fitness.gateway;

import org.springframework.http.HttpMethod;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.reactive.EnableWebFluxSecurity;
import org.springframework.security.config.web.server.ServerHttpSecurity;
import org.springframework.security.web.server.SecurityWebFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.reactive.CorsConfigurationSource;
import org.springframework.web.cors.reactive.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;

@Configuration
@EnableWebFluxSecurity
public class SecurityConfig {
    //filter chain to define security routes
    @Bean
    public SecurityWebFilterChain springSecurityFilterChain(ServerHttpSecurity http){
        http
                .cors(cors -> cors.disable()) // Let Spring Cloud Gateway handle CORS via YAML
                .csrf(csrf -> csrf.disable())
                .authorizeExchange(exchanges -> exchanges
                        .pathMatchers(HttpMethod.OPTIONS, "/**").permitAll() // Allow preflight requests
                        .anyExchange().authenticated() // (Or whatever your existing rules are)
                );
        return http.build();
    }
    @Bean
public CorsConfigurationSource corsConfigurationSource(){
    CorsConfiguration  config = new CorsConfiguration();
config.setAllowedOrigins(List.of("http://localhost:5173"));
config.setAllowedMethods(Arrays.asList("GET" , "POST" , "PUT" , "DELETE" , "OPTIONS"));
config.setAllowedHeaders(Arrays.asList("Authorization", "X-User-ID", "Content-Type"));
config.setAllowCredentials(true);
UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
source.registerCorsConfiguration("/api/**", config);
return source;
}
}
