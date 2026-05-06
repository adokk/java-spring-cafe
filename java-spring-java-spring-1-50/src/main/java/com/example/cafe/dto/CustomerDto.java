package com.example.cafe.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public final class CustomerDto {
    private CustomerDto() {
    }

    public record CustomerRequest(
            @NotBlank
            @Size(max = 160)
            String fullName,

            @NotBlank
            @Size(max = 40)
            String phone,

            @Email
            @Size(max = 160)
            String email
    ) {
    }

    public record CustomerResponse(Long id, String fullName, String phone, String email) {
    }
}
