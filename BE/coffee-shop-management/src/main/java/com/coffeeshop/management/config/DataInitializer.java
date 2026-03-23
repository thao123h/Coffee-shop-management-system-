package com.coffeeshop.management.config;

import com.coffeeshop.management.entity.*;
import com.coffeeshop.management.enums.OrderStatus;
import com.coffeeshop.management.enums.PaymentMethod;
import com.coffeeshop.management.enums.Role;
import com.coffeeshop.management.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Random;
import java.util.Optional;
import java.util.stream.IntStream;
import java.util.stream.Collectors;

import org.springframework.transaction.annotation.Transactional;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;
    private final ProductRepository productRepository;
    private final ProductVariantRepository productVariantRepository;
    private final ToppingRepository toppingRepository;
    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
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
//
//        // Init Product Variants if missing
//        seedProductVariants();
//
//        // Init Orders for Revenue Testing
//        if (orderRepository.count() == 0) {
//            seedOrders();
//        }
//    }
//
//    @Transactional
//    public void seedProductVariants() {
//        productRepository.findAll().forEach(product -> {
//            if (productVariantRepository.findByProductId(product.getId()).isEmpty()) {
//                ProductVariant variant = ProductVariant.builder()
//                        .product(product)
//                        .name("Mặc định")
//                        .price(new BigDecimal(25000 + (Math.random() * 20000)))
//                        .skuCode("SKU-" + product.getId())
//                        .isActive(true)
//                        .build();
//                productVariantRepository.save(variant);
//            }
//        });
//        System.out.println("Initialized missing product variants.");
//    }
//
//    @Transactional
//    public void seedOrders() {
//        User staff = userRepository.findByUsername("admin").orElse(null);
//        if (staff == null) {
//            staff = userRepository.findAll().stream().findFirst().orElse(null);
//        }
//        if (staff == null) return;
//
//        List<ProductVariant> variants = productVariantRepository.findAll();
//        if (variants.isEmpty()) return;
//
//        Random random = new Random();
//        for (int i = 0; i < 10; i++) {
//            // Random date in last 7 days
//            LocalDateTime createdAt = LocalDateTime.now()
//                    .minusDays(random.nextInt(7))
//                    .minusHours(random.nextInt(23))
//                    .minusMinutes(random.nextInt(59));
//
//            Order order = Order.builder()
//                    .staff(staff)
//                    .customerName("Khách hàng " + (i + 1))
//                    .totalAmount(BigDecimal.ZERO)
//                    .discountAmount(BigDecimal.ZERO)
//                    .finalAmount(BigDecimal.ZERO)
//                    .paymentMethod(PaymentMethod.CASH)
//                    .status(OrderStatus.COMPLETED)
//                    .createdAt(createdAt)
//                    .build();
//
//            // Save order first to get ID
//            order = orderRepository.save(order);
//
//            BigDecimal total = BigDecimal.ZERO;
//            int numItems = random.nextInt(3) + 1;
//            for (int j = 0; j < numItems; j++) {
//                ProductVariant pv = variants.get(random.nextInt(variants.size()));
//                int qty = random.nextInt(3) + 1;
//                BigDecimal itemPrice = pv.getPrice() != null ? pv.getPrice() : new BigDecimal(30000);
//                BigDecimal itemTotal = itemPrice.multiply(new BigDecimal(qty));
//
//                OrderItem item = OrderItem.builder()
//                        .order(order)
//                        .productVariant(pv)
//                        .productName(pv.getProduct().getName())
//                        .variantName(pv.getName())
//                        .unitPrice(itemPrice)
//                        .quantity(qty)
//                        .build();
//
//                orderItemRepository.save(item);
//                total = total.add(itemTotal);
//            }
//
//            order.setTotalAmount(total);
//            order.setFinalAmount(total);
//            orderRepository.save(order);
//        }
//        System.out.println("Initialized 10 sample orders for revenue testing.");
    }
}
