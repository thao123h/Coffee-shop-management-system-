package com.coffeeshop.management.controller;

import com.coffeeshop.management.dto.response.ApiResponse;
import com.coffeeshop.management.entity.ProductVariant;
import com.coffeeshop.management.enums.ErrorCode;
import com.coffeeshop.management.service.ProductService;
import com.coffeeshop.management.service.ProductVariantService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/product-variants")
@RequiredArgsConstructor
public class ProductVariantController {

}
