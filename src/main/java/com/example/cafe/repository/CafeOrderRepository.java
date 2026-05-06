package com.example.cafe.repository;

import com.example.cafe.model.CafeOrder;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CafeOrderRepository extends JpaRepository<CafeOrder, Long> {
    List<CafeOrder> findByCustomerId(Long customerId);
}
