package com.example.cafe.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public final class CategoryDto {
    private CategoryDto() {
    }

    public record CategoryRequest(
            @NotBlank
            @Size(max = 120)
            String name,

            @Size(max = 500)
            String description
    ) {
    }

    public record CategoryResponse(Long id, String name, String description) {
    }
}
