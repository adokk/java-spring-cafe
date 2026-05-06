package com.example.cafe.dto;

import com.example.cafe.dto.CommonDto.CustomerSummary;
import com.example.cafe.dto.CommonDto.TableSummary;
import com.example.cafe.model.ReservationStatus;
import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.time.LocalDateTime;

public final class ReservationDto {
    private ReservationDto() {
    }

    public record ReservationRequest(
            @NotNull
            Long customerId,

            @NotNull
            Long tableId,

            @NotNull
            @FutureOrPresent
            LocalDateTime reservationTime,

            @NotNull
            @Min(1)
            Integer guestCount,

            ReservationStatus status,

            @Size(max = 500)
            String comment
    ) {
    }

    public record ReservationResponse(
            Long id,
            CustomerSummary customer,
            TableSummary table,
            LocalDateTime reservationTime,
            Integer guestCount,
            ReservationStatus status,
            String comment
    ) {
    }
}
