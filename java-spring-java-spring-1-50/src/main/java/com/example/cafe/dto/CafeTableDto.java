package com.example.cafe.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public final class CafeTableDto {
    private CafeTableDto() {
    }

    public record CafeTableRequest(
            @NotNull
            @Min(1)
            Integer tableNumber,

            @NotNull
            @Min(1)
            Integer seats,

            @Size(max = 120)
            String location,

            Boolean available
    ) {
    }

    public record CafeTableResponse(Long id, Integer tableNumber, Integer seats, String location, boolean available) {
    }
}
