package com.example.cafe.dto;

import com.example.cafe.dto.CommonDto.CategorySummary;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;

public final class MenuItemDto {
    private MenuItemDto() {
    }

    public record MenuItemRequest(
            @NotBlank
            @Size(max = 160)
            String name,

            @Size(max = 800)
            String description,

            @NotNull
            @DecimalMin(value = "0.00")
            BigDecimal price,

            Boolean available,

            @NotNull
            Long categoryId
    ) {
    }

    public record MenuItemResponse(
            Long id,
            String name,
            String description,
            BigDecimal price,
            boolean available,
            CategorySummary category
    ) {
    }
}
