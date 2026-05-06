package com.example.cafe.repository;

import com.example.cafe.model.CafeTable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CafeTableRepository extends JpaRepository<CafeTable, Long> {
    boolean existsByTableNumber(Integer tableNumber);

    Optional<CafeTable> findByTableNumber(Integer tableNumber);
}
