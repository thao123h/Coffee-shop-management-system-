package com.coffeeshop.management.security;



import com.coffeeshop.management.security.jwt.AuthEntryPointJwt;
import com.coffeeshop.management.security.jwt.AuthTokenFilter;
import com.coffeeshop.management.security.services.UserDetailsServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableMethodSecurity
public class WebSecurityConfig { // extends WebSecurityConfigurerAdapter {
  @Autowired
  UserDetailsServiceImpl userDetailsService;

  @Autowired
  private AuthEntryPointJwt unauthorizedHandler;

  @Bean
  public AuthTokenFilter authenticationJwtTokenFilter() {
    return new AuthTokenFilter();
  }

  
  @Bean
  public DaoAuthenticationProvider authenticationProvider() {
      DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
       
      authProvider.setUserDetailsService(userDetailsService);
      authProvider.setPasswordEncoder(passwordEncoder());
   
      return authProvider;
  }


  @Bean
  public AuthenticationManager authenticationManager(AuthenticationConfiguration authConfig) throws Exception {
    return authConfig.getAuthenticationManager();
  }

  @Bean
  public PasswordEncoder passwordEncoder() {
    return new BCryptPasswordEncoder();
  }



    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .cors(cors -> {})
                .csrf(csrf -> csrf.disable())
                .exceptionHandling(exception -> exception.authenticationEntryPoint(unauthorizedHandler))
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth ->
                        auth
                                // Public endpoints
                                .requestMatchers("/auth/**").permitAll()
                                .requestMatchers("/test/**").permitAll()
                                .requestMatchers("/error").permitAll()
                                .requestMatchers("/categories").hasAnyAuthority("MANAGER", "STAFF")
                                .requestMatchers("/products").hasAnyAuthority("MANAGER", "STAFF")
                                .requestMatchers("/products/**").hasAnyAuthority("MANAGER", "STAFF")
                                .requestMatchers("/orders").hasAnyAuthority("MANAGER", "STAFF")
                                .requestMatchers("/orders/**").hasAnyAuthority("MANAGER", "STAFF")
                                .requestMatchers("/swagger-ui/**").permitAll()
                                .requestMatchers("/v3/api-docs/**").permitAll()

                                // ADMIN-only endpoints
                                .requestMatchers("/admin/**").hasAuthority("ADMIN")

                                // MANAGER + ADMIN: manage user accounts
                                .requestMatchers("/users/**").hasAnyAuthority("MANAGER", "ADMIN")

                                // MANAGER + ADMIN: full CRUD on business resources
                                .requestMatchers(
                                        "/categories/**",
                                        "/toppings/**",
                                        "/vouchers/**",
                                        "/payments/**"
                                ).hasAnyAuthority("MANAGER", "ADMIN")

                                // MANAGER + ADMIN: full product CRUD; STAFF: read-only
                                .requestMatchers(org.springframework.http.HttpMethod.GET,
                                        "/products", "/products/**"
                                ).hasAnyAuthority("STAFF", "MANAGER", "ADMIN")
                                .requestMatchers(
                                        "/products/**"
                                ).hasAnyAuthority("MANAGER", "ADMIN")
                                .anyRequest().authenticated()
                );

        http.authenticationProvider(authenticationProvider());
        http.addFilterBefore(authenticationJwtTokenFilter(), UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(List.of("http://localhost:3000"));;

        config.setAllowedMethods(List.of("GET", "POST", "PUT","PATCH", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("*"));
        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }
}
