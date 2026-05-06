package com.example.cafe.dto;

public final class CommonDto {
    private CommonDto() {
    }

    public record CategorySummary(Long id, String name) {
    }

    public record CustomerSummary(Long id, String fullName, String phone) {
    }

    public record TableSummary(Long id, Integer tableNumber, Integer seats, String location) {
    }

    public record MenuItemSummary(Long id, String name) {
    }
}
