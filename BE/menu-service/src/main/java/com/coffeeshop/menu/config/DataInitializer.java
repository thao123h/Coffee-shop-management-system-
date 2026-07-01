package com.coffeeshop.menu.config;

import com.coffeeshop.menu.entity.Category;
import com.coffeeshop.menu.entity.Product;
import com.coffeeshop.menu.entity.ProductVariant;
import com.coffeeshop.menu.entity.Topping;
import com.coffeeshop.menu.repository.CategoryRepository;
import com.coffeeshop.menu.repository.ProductRepository;
import com.coffeeshop.menu.repository.ProductVariantRepository;
import com.coffeeshop.menu.repository.ToppingRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.List;

@Slf4j
@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final CategoryRepository categoryRepository;
    private final ProductRepository productRepository;
    private final ProductVariantRepository variantRepository;
    private final ToppingRepository toppingRepository;

    @Override
    public void run(String... args) {
        if (categoryRepository.count() > 0) {
            log.info("Menu data already exists, skipping initialization.");
            return;
        }
        log.info("Initializing menu data...");
        initToppings();
        initCaPhe();
        initTraSua();
        initTraTraiCay();
        initSinhTo();
        initDaXay();
        log.info("Menu data initialized successfully.");
    }

    // ── Toppings ────────────────────────────────────────────────────────────
    private void initToppings() {
        List<Topping> toppings = List.of(
            topping("Trân Châu Đen",    10000),
            topping("Trân Châu Trắng",  10000),
            topping("Thạch Flan",       10000),
            topping("Thạch Cà Phê",     10000),
            topping("Kem Phô Mai",      15000),
            topping("Pudding Trứng",    10000),
            topping("Whipping Cream",   10000),
            topping("Nata De Coco",     10000),
            topping("Thạch Matcha",     10000),
            topping("Dừa Nạo",         10000)
        );
        toppingRepository.saveAll(toppings);
        log.info("Saved {} toppings", toppings.size());
    }

    // ── Cà Phê ───────────────────────────────────────────────────────────────
    private void initCaPhe() {
        Category cat = saveCategory("Cà Phê", "Các loại cà phê truyền thống và hiện đại");
        saveProductWithSML(cat, "Cà Phê Đen",    "Cà phê đen nguyên chất, đậm vị",      25000, 30000, 35000);
        saveProductWithSML(cat, "Cà Phê Sữa",    "Cà phê hòa quyện cùng sữa đặc thơm ngon",  29000, 35000, 39000);
        saveProductWithSML(cat, "Bạc Xỉu",       "Cà phê sữa ít cà phê, nhiều sữa",     29000, 35000, 39000);
        saveProductWithSML(cat, "Cà Phê Trứng",  "Cà phê trứng đặc trưng Hà Nội",       35000, 40000, 45000);
        saveProductWithSML(cat, "Cappuccino",     "Espresso với sữa bọt mịn",             45000, 50000, 55000);
        saveProductWithSML(cat, "Latte",          "Espresso với sữa nóng và bọt sữa",    45000, 50000, 55000);
        saveProductWithSML(cat, "Americano",      "Espresso pha loãng với nước nóng",     39000, 44000, 49000);
        saveProductWithSML(cat, "Cold Brew",      "Cà phê ngâm lạnh 24 giờ",             45000, 49000, 55000);
    }

    // ── Trà Sữa ──────────────────────────────────────────────────────────────
    private void initTraSua() {
        Category cat = saveCategory("Trà Sữa", "Trà sữa Đài Loan và các biến tấu");
        saveProductWithSML(cat, "Trà Sữa Truyền Thống", "Trà sữa kinh điển, thơm ngon",      35000, 40000, 45000);
        saveProductWithSML(cat, "Trà Sữa Matcha",        "Matcha Nhật Bản hòa quyện với sữa", 40000, 45000, 50000);
        saveProductWithSML(cat, "Trà Sữa Taro",          "Khoai môn tím ngọt ngào",           40000, 45000, 50000);
        saveProductWithSML(cat, "Trà Sữa Oolong",        "Trà Oolong hương núi cao",           35000, 40000, 45000);
        saveProductWithSML(cat, "Trà Sữa Hồng Trà",     "Hồng trà Assam thơm đậm",           35000, 40000, 45000);
        saveProductWithSML(cat, "Trà Sữa Chocolate",    "Chocolate đen đậm vị",               40000, 45000, 50000);
    }

    // ── Trà Trái Cây ─────────────────────────────────────────────────────────
    private void initTraTraiCay() {
        Category cat = saveCategory("Trà Trái Cây", "Trà tươi mát kết hợp trái cây");
        saveProductWithSML(cat, "Trà Đào",    "Trà xanh kết hợp đào tươi",   35000, 40000, 45000);
        saveProductWithSML(cat, "Trà Vải",    "Trà xanh kết hợp vải thiều",  35000, 40000, 45000);
        saveProductWithSML(cat, "Trà Chanh",  "Trà chanh leo tươi mát",      30000, 35000, 40000);
        saveProductWithSML(cat, "Trà Dâu",    "Trà xanh kết hợp dâu tươi",  35000, 40000, 45000);
        saveProductWithSML(cat, "Trà Xoài",   "Trà xoài nhiệt đới thơm mát", 35000, 40000, 45000);
        saveProductWithSML(cat, "Trà Cam",    "Trà cam tươi giải nhiệt",     30000, 35000, 40000);
    }

    // ── Sinh Tố ──────────────────────────────────────────────────────────────
    private void initSinhTo() {
        Category cat = saveCategory("Sinh Tố", "Sinh tố trái cây tươi nguyên chất");
        saveProductWithSML(cat, "Sinh Tố Bơ",         "Bơ tươi béo ngậy",               45000, 50000, 55000);
        saveProductWithSML(cat, "Sinh Tố Xoài",       "Xoài chín ngọt tự nhiên",        40000, 45000, 50000);
        saveProductWithSML(cat, "Sinh Tố Dâu",        "Dâu tây tươi mọng nước",         40000, 45000, 50000);
        saveProductWithSML(cat, "Sinh Tố Việt Quất",  "Việt quất giàu dinh dưỡng",      45000, 50000, 55000);
        saveProductWithSML(cat, "Sinh Tố Ổi",         "Ổi xanh thanh mát",               35000, 40000, 45000);
        saveProductWithSML(cat, "Sinh Tố Dưa Hấu",   "Dưa hấu mát lạnh mùa hè",       35000, 40000, 45000);
    }

    // ── Đá Xay ───────────────────────────────────────────────────────────────
    private void initDaXay() {
        Category cat = saveCategory("Đá Xay", "Đồ uống xay đá lạnh thơm ngon");
        saveProductWithSML(cat, "Đá Xay Cà Phê",   "Cà phê xay đá mát lạnh",        45000, 50000, 55000);
        saveProductWithSML(cat, "Đá Xay Matcha",    "Matcha xay đá thanh đắng",      49000, 55000, 59000);
        saveProductWithSML(cat, "Đá Xay Chocolate", "Chocolate xay đá béo ngậy",     49000, 55000, 59000);
        saveProductWithSML(cat, "Đá Xay Dâu",       "Dâu xay đá màu đỏ hấp dẫn",    45000, 50000, 55000);
        saveProductWithSML(cat, "Đá Xay Caramel",   "Caramel xay đá ngọt thơm",     49000, 55000, 59000);
        saveProductWithSML(cat, "Đá Xay Taro",      "Khoai môn xay đá tím đẹp mắt", 49000, 55000, 59000);
    }

    // ── Helper methods ────────────────────────────────────────────────────────

    private Category saveCategory(String name, String description) {
        Category cat = Category.builder()
                .name(name)
                .description(description)
                .isActive(true)
                .build();
        return categoryRepository.save(cat);
    }

    private void saveProductWithSML(Category category, String name, String description,
                                     int priceS, int priceM, int priceL) {
        Product product = Product.builder()
                .category(category)
                .name(name)
                .description(description)
                .isActive(true)
                .build();
        product = productRepository.save(product);

        variantRepository.saveAll(List.of(
            variant(product, "Size S", priceS),
            variant(product, "Size M", priceM),
            variant(product, "Size L", priceL)
        ));
    }

    private ProductVariant variant(Product product, String name, int price) {
        return ProductVariant.builder()
                .product(product)
                .name(name)
                .price(BigDecimal.valueOf(price))
                .isActive(true)
                .build();
    }

    private Topping topping(String name, int price) {
        return Topping.builder()
                .name(name)
                .price(BigDecimal.valueOf(price))
                .isActive(true)
                .build();
    }
}
