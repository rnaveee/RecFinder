package com.recfinder.recfinder.entity;


import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.Instant;

@Entity
@Table(name = "scrimmages")
@Getter
@Setter
@NoArgsConstructor
public class Scrimmage {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String sport;
    private String city;
    private String location;
    private Instant startTime;
    private BigDecimal attendanceCost;
    private Integer maxPlayers;

    private boolean isPrivate;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "created_by")
    private User createdBy;

}
