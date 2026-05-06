package com.example.cafe.mapper;

import com.example.cafe.dto.CafeTableDto.CafeTableResponse;
import com.example.cafe.dto.CategoryDto.CategoryResponse;
import com.example.cafe.dto.CommonDto.CategorySummary;
import com.example.cafe.dto.CommonDto.CustomerSummary;
import com.example.cafe.dto.CommonDto.MenuItemSummary;
import com.example.cafe.dto.CommonDto.TableSummary;
import com.example.cafe.dto.CustomerDto.CustomerResponse;
import com.example.cafe.dto.MenuItemDto.MenuItemResponse;
import com.example.cafe.dto.OrderDto.OrderLineResponse;
import com.example.cafe.dto.OrderDto.OrderResponse;
import com.example.cafe.dto.ReservationDto.ReservationResponse;
import com.example.cafe.model.CafeOrder;
import com.example.cafe.model.CafeTable;
import com.example.cafe.model.Category;
import com.example.cafe.model.Customer;
import com.example.cafe.model.MenuItem;
import com.example.cafe.model.OrderItem;
import com.example.cafe.model.Reservation;

public final class CafeMapper {
    private CafeMapper() {
    }

    public static CategoryResponse toCategoryResponse(Category category) {
        return new CategoryResponse(category.getId(), category.getName(), category.getDescription());
    }

    public static CategorySummary toCategorySummary(Category category) {
        return new CategorySummary(category.getId(), category.getName());
    }

    public static MenuItemResponse toMenuItemResponse(MenuItem menuItem) {
        return new MenuItemResponse(
                menuItem.getId(),
                menuItem.getName(),
                menuItem.getDescription(),
                menuItem.getPrice(),
                menuItem.isAvailable(),
                toCategorySummary(menuItem.getCategory())
        );
    }

    public static MenuItemSummary toMenuItemSummary(MenuItem menuItem) {
        return new MenuItemSummary(menuItem.getId(), menuItem.getName());
    }

    public static CustomerResponse toCustomerResponse(Customer customer) {
        return new CustomerResponse(
                customer.getId(),
                customer.getFullName(),
                customer.getPhone(),
                customer.getEmail()
        );
    }

    public static CustomerSummary toCustomerSummary(Customer customer) {
        return new CustomerSummary(customer.getId(), customer.getFullName(), customer.getPhone());
    }

    public static CafeTableResponse toTableResponse(CafeTable table) {
        return new CafeTableResponse(
                table.getId(),
                table.getTableNumber(),
                table.getSeats(),
                table.getLocation(),
                table.isAvailable()
        );
    }

    public static TableSummary toTableSummary(CafeTable table) {
        if (table == null) {
            return null;
        }
        return new TableSummary(table.getId(), table.getTableNumber(), table.getSeats(), table.getLocation());
    }

    public static OrderResponse toOrderResponse(CafeOrder order) {
        return new OrderResponse(
                order.getId(),
                order.getStatus(),
                order.getCreatedAt(),
                order.getTotalAmount(),
                toCustomerSummary(order.getCustomer()),
                toTableSummary(order.getTable()),
                order.getItems().stream().map(CafeMapper::toOrderLineResponse).toList()
        );
    }

    public static OrderLineResponse toOrderLineResponse(OrderItem item) {
        return new OrderLineResponse(
                item.getId(),
                toMenuItemSummary(item.getMenuItem()),
                item.getQuantity(),
                item.getUnitPrice(),
                item.getLineTotal()
        );
    }

    public static ReservationResponse toReservationResponse(Reservation reservation) {
        return new ReservationResponse(
                reservation.getId(),
                toCustomerSummary(reservation.getCustomer()),
                toTableSummary(reservation.getTable()),
                reservation.getReservationTime(),
                reservation.getGuestCount(),
                reservation.getStatus(),
                reservation.getComment()
        );
    }
}
