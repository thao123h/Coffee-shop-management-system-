package com.coffeeshop.promotion.config;

import com.coffeeshop.promotion.entity.Voucher;
import com.coffeeshop.promotion.repository.VoucherRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Slf4j
@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final VoucherRepository voucherRepository;

    @Override
    public void run(String... args) {
        if (voucherRepository.count() > 0) {
            log.info("Voucher data already exists, skipping initialization.");
            return;
        }
        log.info("Initializing voucher data...");

        LocalDateTime now   = LocalDateTime.now();
        LocalDateTime start = now.minusDays(1);
        LocalDateTime end   = now.plusDays(365);

        List<Voucher> vouchers = List.of(
            voucher("WELCOME10", "Giảm 10.000đ cho khách hàng mới",
                    10000, 50000, 100, start, end),
            voucher("SUMMER20", "Giảm 20.000đ mùa hè",
                    20000, 100000, 50, start, end),
            voucher("COFFEE15", "Giảm 15.000đ cho đơn cà phê",
                    15000, 80000, 30, start, end),
            voucher("HAPPY30", "Giảm 30.000đ cuối tuần",
                    30000, 150000, 20, start, end.minusDays(300)),
            voucher("STUDENT25", "Giảm 25.000đ cho sinh viên",
                    25000, 120000, 200, start, end),
            voucher("VIP50", "Giảm 50.000đ dành cho khách VIP",
                    50000, 300000, 10, start, end)
        );

        voucherRepository.saveAll(vouchers);
        log.info("Saved {} vouchers", vouchers.size());
    }

    private Voucher voucher(String code, String description,
                            int discountValue, int minOrderValue,
                            int usageLimit,
                            LocalDateTime start, LocalDateTime end) {
        return Voucher.builder()
                .code(code)
                .discountValue(BigDecimal.valueOf(discountValue))
                .minOrderValue(BigDecimal.valueOf(minOrderValue))
                .usageLimit(usageLimit)
                .usageCount(0)
                .startDate(start)
                .endDate(end)
                .isActive(true)
                .build();
    }
}
