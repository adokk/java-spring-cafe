package com.example.cafe.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

import java.util.LinkedHashSet;
import java.util.Set;

@Entity
@Table(name = "cafe_tables")
public class CafeTable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "table_number", nullable = false, unique = true)
    private Integer tableNumber;

    @Column(nullable = false)
    private Integer seats;

    @Column(length = 120)
    private String location;

    @Column(nullable = false)
    private boolean available = true;

    @OneToMany(mappedBy = "table")
    private Set<CafeOrder> orders = new LinkedHashSet<>();

    @OneToMany(mappedBy = "table")
    private Set<Reservation> reservations = new LinkedHashSet<>();

    protected CafeTable() {
    }

    public CafeTable(Integer tableNumber, Integer seats, String location, boolean available) {
        this.tableNumber = tableNumber;
        this.seats = seats;
        this.location = location;
        this.available = available;
    }

    public Long getId() {
        return id;
    }

    public Integer getTableNumber() {
        return tableNumber;
    }

    public void setTableNumber(Integer tableNumber) {
        this.tableNumber = tableNumber;
    }

    public Integer getSeats() {
        return seats;
    }

    public void setSeats(Integer seats) {
        this.seats = seats;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public boolean isAvailable() {
        return available;
    }

    public void setAvailable(boolean available) {
        this.available = available;
    }

    public Set<CafeOrder> getOrders() {
        return orders;
    }

    public Set<Reservation> getReservations() {
        return reservations;
    }
}
