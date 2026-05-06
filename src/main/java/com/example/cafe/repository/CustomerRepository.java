package com.example.cafe.repository;

import com.example.cafe.model.Customer;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CustomerRepository extends JpaRepository<Customer, Long> {
    boolean existsByPhone(String phone);

    Optional<Customer> findByPhone(String phone);
}
