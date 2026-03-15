package com.coffeeshop.management.service;

import com.coffeeshop.management.dto.request.OrderItemRequest;
import com.coffeeshop.management.dto.request.OrderRequest;
import com.coffeeshop.management.dto.request.ToppingRequest;
import com.coffeeshop.management.dto.response.OrderItemResponse;
import com.coffeeshop.management.dto.response.OrderResponse;
import com.coffeeshop.management.dto.response.ToppingResponse;
import com.coffeeshop.management.entity.*;
import com.coffeeshop.management.enums.OrderStatus;
import com.coffeeshop.management.mapper.OrderItemMapper;
import com.coffeeshop.management.mapper.OrderMapper;
import com.coffeeshop.management.mapper.ToppingMapper;
import com.coffeeshop.management.repository.*;
import com.coffeeshop.management.utils.SecurityUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class OrderService {
    private final UserRepository userRepository;
    private final SecurityUtils securityUtils;
    private final VoucherRepository voucherRepository;
    private final ProductVariantRepository productVariantRepository;
    private final OrderRepository orderRepository;
    private final ToppingRepository toppingRepository;
    private final OrderItemService orderItemService;
    private final OrderItemToppingService orderItemToppingService;
    private final OrderItemMapper orderItemMapper;
    private final ToppingMapper toppingMapper;
    private final OrderMapper orderMapper;

    public List<Order> findAll() {
        return orderRepository.findAll();
    }

    public List<Order> findByStaffId(Long staffId) {
        return orderRepository.findByStaffId(staffId);
    }

    public List<Order> findByStatus(OrderStatus status) {
        return orderRepository.findByStatus(status);
    }

    public List<Order> findByCreatedAtBetween(LocalDateTime start, LocalDateTime end) {
        return orderRepository.findByCreatedAtBetween(start, end);
    }

    public Optional<Order> findById(Long id) {
        return orderRepository.findById(id);
    }


    public Order save(OrderRequest orderRequest) {
        User staff = getCurrentStaff();
        Voucher voucher = getVoucherIfExists(orderRequest.getVoucherId());

        BigDecimal totalAmount = calculateTotalAmount(orderRequest);
        BigDecimal discountAmount = calculateDiscountIfApplicable(voucher, totalAmount);
        BigDecimal finalAmount = totalAmount.subtract(discountAmount);
        Order order = buildOrder(orderRequest, staff, voucher, totalAmount, discountAmount, finalAmount);
         return  orderRepository.save(order);

    }

    @Transactional
    public OrderResponse createOrder(OrderRequest orderRequest) {
        List<OrderItemResponse> orderItemResponseList = new ArrayList<>();
        Order order = save(orderRequest);
        OrderResponse orderResponse = orderMapper.toOrderResponse(order);
        for(OrderItemRequest orderItemRequest : orderRequest.getOrderItems()) {
            OrderItem orderItem = orderItemService.save(orderItemRequest, order);
            OrderItemResponse orderItemResponse = orderItemMapper.toOrderItemResponse(orderItem);
            List<ToppingResponse> toppingResponses = new ArrayList<>();
            if(orderItemRequest.getToppings() != null) {
                for (Long toppingId : orderItemRequest.getToppings()) {
                    OrderItemTopping orderItemTopping = orderItemToppingService.save(toppingId, orderItem);
                    toppingResponses.add(toppingMapper.toToppingResponse(orderItemTopping));
                }
                orderItemResponse.setToppings(toppingResponses);
            }

           orderItemResponseList.add(orderItemResponse);
        }
        orderResponse.setOrderItems(orderItemResponseList);
        return orderResponse;
    }

    private User getCurrentStaff() {
        return userRepository.findById(securityUtils.getCurrentUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    private Voucher getVoucherIfExists(Long voucherId) {
        if (voucherId == null) {
            return null;
        }

        return voucherRepository.findById(voucherId)
                .orElseThrow(() -> new RuntimeException("Voucher not found"));
    }

    private BigDecimal calculateTotalAmount(OrderRequest orderRequest) {
        BigDecimal totalAmount = BigDecimal.ZERO;

        for (OrderItemRequest orderItemRequest : orderRequest.getOrderItems()) {
            BigDecimal orderItemAmount = calculateOrderItemAmount(orderItemRequest);
            totalAmount = totalAmount.add(orderItemAmount);
        }

        return totalAmount;
    }

    private BigDecimal calculateOrderItemAmount(OrderItemRequest orderItemRequest) {
        ProductVariant variant = getProductVariant(orderItemRequest.getProductVariantId());

        BigDecimal unitAmount = variant.getPrice();
        unitAmount = unitAmount.add(calculateToppingsAmount(orderItemRequest.getToppings()));

        return unitAmount.multiply(BigDecimal.valueOf(orderItemRequest.getQuantity()));
    }

    private BigDecimal calculateToppingsAmount(List<Long> toppingIds) {
        if (toppingIds == null || toppingIds.isEmpty()) {
            return BigDecimal.ZERO;
        }

        BigDecimal toppingsAmount = BigDecimal.ZERO;

        for (Long toppingId : toppingIds) {
            Topping topping = getTopping(toppingId);
            toppingsAmount = toppingsAmount.add(topping.getPrice());
        }

        return toppingsAmount;
    }

    private ProductVariant getProductVariant(Long productVariantId) {
        return productVariantRepository.findById(productVariantId)
                .orElseThrow(() -> new RuntimeException("Product variant not found"));
    }

    private Topping getTopping(Long toppingId) {
        return toppingRepository.findById(toppingId)
                .orElseThrow(() -> new RuntimeException("Topping not found"));
    }

    private BigDecimal calculateDiscountIfApplicable(Voucher voucher, BigDecimal totalAmount) {
        if (voucher == null) {
            return BigDecimal.ZERO;
        }

        return calculateDiscountAmount(voucher, totalAmount);
    }

    private Order buildOrder(
            OrderRequest orderRequest,
            User staff,
            Voucher voucher,
            BigDecimal totalAmount,
            BigDecimal discountAmount,
            BigDecimal finalAmount
    ) {
        Order order = new Order();
        order.setStaff(staff);
        order.setPaymentMethod(orderRequest.getPaymentMethod());
        order.setStatus(OrderStatus.PENDING);
        order.setVoucher(voucher);
        order.setTotalAmount(totalAmount);
        order.setDiscountAmount(discountAmount);
        order.setFinalAmount(finalAmount);
        return order;
    }


    private BigDecimal calculateDiscountAmount(Voucher voucher, BigDecimal totalAmount) {
        LocalDateTime now = LocalDateTime.now();

        if (voucher == null) {
            return BigDecimal.ZERO;
        }

        if (!Boolean.TRUE.equals(voucher.getIsActive())) {
            throw new RuntimeException("Voucher is not active");
        }

        if (now.isBefore(voucher.getStartDate()) || now.isAfter(voucher.getEndDate())) {
            throw new RuntimeException("Voucher is expired or not started yet");
        }

        if (voucher.getUsageCount() >= voucher.getUsageLimit()) {
            throw new RuntimeException("Voucher usage limit exceeded");
        }

        if (totalAmount.compareTo(voucher.getMinOrderValue()) < 0) {
            throw new RuntimeException("Order does not meet minimum value for voucher");
        }

        BigDecimal  discountAmount = voucher.getDiscountValue();

        if (discountAmount.compareTo(totalAmount) > 0) {
            discountAmount = totalAmount;
        }
        return discountAmount;
    }

    @Transactional
    public void deleteById(Long id) {
        orderRepository.deleteById(id);
    }

    public boolean existsById(Long id) {
        return orderRepository.existsById(id);
    }
}
