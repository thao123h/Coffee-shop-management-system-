package com.coffeeshop.order.service;

import com.coffeeshop.order.client.MenuServiceClient;
import com.coffeeshop.order.client.PaymentServiceClient;
import com.coffeeshop.order.client.PromotionServiceClient;
import com.coffeeshop.order.client.dto.*;
import com.coffeeshop.order.dto.OrderItemRequest;
import com.coffeeshop.order.dto.OrderRequest;
import com.coffeeshop.order.dto.OrderResponse;
import com.coffeeshop.order.entity.Order;
import com.coffeeshop.order.entity.OrderItem;
import com.coffeeshop.order.entity.OrderItemTopping;
import com.coffeeshop.order.enums.OrderStatus;
import com.coffeeshop.order.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository        orderRepository;
    private final MenuServiceClient      menuClient;
    private final PromotionServiceClient promotionClient;
    private final PaymentServiceClient   paymentClient;

    @Transactional
    public OrderResponse createOrder(OrderRequest req, Long userId) {

        // ── Step 1: Fetch variant snapshots from Menu Service (Feign) ──────────
        List<Long> variantIds = req.getOrderItems().stream()
                .map(OrderItemRequest::getProductVariantId).toList();
        Map<Long, VariantSnapshotDto> variantMap = menuClient.getBatchVariants(variantIds)
                .stream().collect(Collectors.toMap(VariantSnapshotDto::getVariantId, v -> v));

        // ── Step 2: Fetch topping snapshots from Menu Service (Feign) ──────────
        List<Long> allToppingIds = req.getOrderItems().stream()
                .filter(i -> i.getToppingIds() != null)
                .flatMap(i -> i.getToppingIds().stream())
                .distinct().toList();
        Map<Long, ToppingSnapshotDto> toppingMap = allToppingIds.isEmpty()
                ? Map.of()
                : menuClient.getBatchToppings(allToppingIds)
                    .stream().collect(Collectors.toMap(ToppingSnapshotDto::getToppingId, t -> t));

        // ── Step 3: Build order items + calculate total ────────────────────────
        List<OrderItem> orderItems = new ArrayList<>();
        BigDecimal totalAmount = BigDecimal.ZERO;

        for (OrderItemRequest itemReq : req.getOrderItems()) {
            VariantSnapshotDto variant = variantMap.get(itemReq.getProductVariantId());
            if (variant == null) throw new RuntimeException("Variant not found: " + itemReq.getProductVariantId());

            BigDecimal itemTotal = variant.getPrice().multiply(BigDecimal.valueOf(itemReq.getQuantity()));

            List<OrderItemTopping> toppings = new ArrayList<>();
            if (itemReq.getToppingIds() != null) {
                for (Long tid : itemReq.getToppingIds()) {
                    ToppingSnapshotDto t = toppingMap.get(tid);
                    if (t == null) throw new RuntimeException("Topping not found: " + tid);
                    itemTotal = itemTotal.add(t.getPrice().multiply(BigDecimal.valueOf(itemReq.getQuantity())));
                    toppings.add(OrderItemTopping.builder()
                            .toppingId(t.getToppingId())
                            .toppingName(t.getToppingName())
                            .price(t.getPrice())
                            .build());
                }
            }

            OrderItem item = OrderItem.builder()
                    .productVariantId(variant.getVariantId())
                    .productName(variant.getProductName())
                    .variantName(variant.getVariantName())
                    .unitPrice(variant.getPrice())
                    .quantity(itemReq.getQuantity())
                    .note(itemReq.getNote())
                    .toppings(toppings)
                    .build();

            orderItems.add(item);
            totalAmount = totalAmount.add(itemTotal);
        }

        // ── Step 4: Validate voucher (Feign, read-only) ────────────────────────
        BigDecimal discountAmount = BigDecimal.ZERO;
        VoucherValidateResponse voucherResult = null;

        if (req.getVoucherCode() != null && !req.getVoucherCode().isBlank()) {
            voucherResult = promotionClient.validateVoucher(
                    req.getVoucherCode(),
                    new VoucherValidateRequest(totalAmount, userId)
            );
            if (!voucherResult.isValid()) {
                throw new RuntimeException("Voucher invalid: " + voucherResult.getMessage());
            }
            discountAmount = voucherResult.getCalculatedDiscount();
        }

        BigDecimal finalAmount = totalAmount.subtract(discountAmount);

        // ── Step 5: Persist order ──────────────────────────────────────────────
        Order order = Order.builder()
                .userId(userId)
                .customerName(req.getCustomerName())
                .paymentMethod(req.getPaymentMethod())
                .status(OrderStatus.PENDING)
                .totalAmount(totalAmount)
                .discountAmount(discountAmount)
                .finalAmount(finalAmount)
                .voucherCode(req.getVoucherCode())
                .build();

        Order savedOrder = orderRepository.save(order);

        for (OrderItem item : orderItems) {
            item.setOrder(savedOrder);
            if (item.getToppings() != null) {
                item.getToppings().forEach(t -> t.setOrderItem(item));
            }
        }
        savedOrder.setOrderItems(orderItems);
        orderRepository.save(savedOrder);

        // ── Step 6: Commit voucher usage (Feign, after order persisted) ────────
        if (voucherResult != null && req.getVoucherCode() != null) {
            promotionClient.applyVoucher(
                    req.getVoucherCode(),
                    new VoucherApplyRequest(savedOrder.getId(), userId, discountAmount)
            );
        }

        // ── Step 7: Create payment via Feign (instead of Kafka) ────────────────
        String payUrl = null;
        try {
            CreatePaymentRequest payReq = new CreatePaymentRequest(
                    savedOrder.getId(),
                    finalAmount,
                    req.getPaymentMethod().name(),
                    "Thanh toan don hang #" + savedOrder.getId()
            );
            PaymentResponse paymentResponse = paymentClient.createPayment(payReq);

            if ("SUCCESS".equals(paymentResponse.getStatus())) {
                // CASH payment confirmed immediately
                savedOrder.setStatus(OrderStatus.CONFIRMED);
                orderRepository.save(savedOrder);
            } else {
                // BANK: return payUrl to FE for redirect
                payUrl = paymentResponse.getPayUrl();
            }
        } catch (Exception e) {
            log.error("Payment service call failed for orderId={}: {}", savedOrder.getId(), e.getMessage());
            // Order remains PENDING; FE can retry or user can pay later
        }

        log.info("Order {} created with status={}", savedOrder.getId(), savedOrder.getStatus());
        return OrderResponse.of(savedOrder, payUrl);
    }

    public Order getById(Long id) {
        return orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found: " + id));
    }

    public Page<Order> getAll(int page, int size, Long orderId,
                              OrderStatus status,
                              com.coffeeshop.order.enums.PaymentMethod method,
                              LocalDateTime from, LocalDateTime to) {
        return orderRepository.filterOrders(orderId, status, method, from, to, PageRequest.of(page, size));
    }

    @Transactional
    public Order updateStatus(Long id, OrderStatus newStatus) {
        Order order = getById(id);
        order.setStatus(newStatus);
        return orderRepository.save(order);
    }
}
