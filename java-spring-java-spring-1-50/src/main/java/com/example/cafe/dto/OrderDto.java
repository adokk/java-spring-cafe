package com.example.cafe.dto;

import com.example.cafe.dto.CommonDto.CustomerSummary;
import com.example.cafe.dto.CommonDto.MenuItemSummary;
import com.example.cafe.dto.CommonDto.TableSummary;
import com.example.cafe.model.OrderStatus;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public final class OrderDto {
    private OrderDto() {
    }

    public record OrderItemRequest(
            @NotNull
            Long menuItemId,

            @NotNull
            @Min(1)
            Integer quantity
    ) {
    }

    public record OrderCreateRequest(
            @NotNull
            Long customerId,

            Long tableId,

            @NotEmpty
            List<@Valid OrderItemRequest> items
    ) {
    }

    public record OrderStatusUpdateRequest(
            @NotNull
            OrderStatus status
    ) {
    }

    public record OrderLineResponse(
            Long id,
            MenuItemSummary menuItem,
            Integer quantity,
            BigDecimal unitPrice,
            BigDecimal lineTotal
    ) {
    }

    public record OrderResponse(
            Long id,
            OrderStatus status,
            LocalDateTime createdAt,
            BigDecimal totalAmount,
            CustomerSummary customer,
            TableSummary table,
            List<OrderLineResponse> items
    ) {
    }
}
