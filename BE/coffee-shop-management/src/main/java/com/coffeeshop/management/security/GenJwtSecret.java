package com.coffeeshop.management.security;

import io.jsonwebtoken.security.Keys;
import io.jsonwebtoken.SignatureAlgorithm;
import java.util.Base64;

public class GenJwtSecret {
    public static void main(String[] args) {
        String secret = Base64.getEncoder()
                .encodeToString(
                        Keys.secretKeyFor(SignatureAlgorithm.HS256)
                                .getEncoded()
                );
        System.out.println(secret);
    }
}