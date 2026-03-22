package com.coffeeshop.management.config;

import com.coffeeshop.management.entity.Category;
import com.coffeeshop.management.entity.Product;
import com.coffeeshop.management.entity.Topping;
import com.coffeeshop.management.entity.User;
import com.coffeeshop.management.enums.Role;
import com.coffeeshop.management.repository.CategoryRepository;
import com.coffeeshop.management.repository.ProductRepository;
import com.coffeeshop.management.repository.ToppingRepository;
import com.coffeeshop.management.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.stream.IntStream;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;
    private final ProductRepository productRepository;
    private final ToppingRepository toppingRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        // Init Users
        if (userRepository.count() == 0) {
            String encodedPassword = passwordEncoder.encode("123456");
            userRepository.save(new User("admin", encodedPassword, "Quản trị viên", Role.ADMIN));
            userRepository.save(new User("manager", encodedPassword, "Quản lý", Role.MANAGER));
            
            IntStream.range(1, 15).forEach(i -> {
                userRepository.save(new User("staff" + i, encodedPassword, "Nhân viên " + i, Role.STAFF));
            });
            System.out.println("Initialized sample users.");
        }

        // Init Categories
        if (categoryRepository.count() == 0) {
            Category c1 = Category.builder().name("Cà phê").code("CFE").description("Các loại cà phê truyền thống").displayOrder(1).isActive(true).build();
            Category c2 = Category.builder().name("Trà sữa").code("TST").description("Trà sữa trân châu và kem cheese").displayOrder(2).isActive(true).build();
            Category c3 = Category.builder().name("Nước ép").code("FRS").description("Trái cây tươi ép nguyên chất").displayOrder(3).isActive(true).build();
            
            categoryRepository.save(c1);
            categoryRepository.save(c2);
            categoryRepository.save(c3);
            System.out.println("Initialized sample categories.");

            // Init Products
            if (productRepository.count() == 0) {
                IntStream.range(1, 20).forEach(i -> {
                    Product p = new Product();
                    p.setName("Sản phẩm mẫu " + i);
                    p.setDescription("Mô tả chi tiết cho sản phẩm " + i);
                    p.setCategory(i % 2 == 0 ? c1 : c2);
                    p.setImageUrl("https://placehold.co/600x400/fffbeb/b45309?text=Product+" + i);
                    p.setIsActive(true);
                    p.setHasMultipleSizes(false);
                    productRepository.save(p);
                });
                System.out.println("Initialized sample products.");
            }
        }

        // Init Toppings
        if (toppingRepository.count() == 0) {
            IntStream.range(1, 12).forEach(i -> {
                Topping t = new Topping();
                t.setName("Topping " + i);
                t.setPrice(new BigDecimal(5000 + (i * 1000)));
                t.setIsActive(true);
                toppingRepository.save(t);
            });
            System.out.println("Initialized sample toppings.");
        }
    }
}
