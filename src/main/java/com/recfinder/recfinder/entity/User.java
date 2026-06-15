package com.recfinder.recfinder.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.HashSet;
import java.util.Set;


@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private Integer age;
    private String bio;
    private String socials;
    private String location;

    @ElementCollection
    @CollectionTable(
            name = "user_sports",
            joinColumns = @JoinColumn(name = "user_id")
    )
    @Column(name = "sport")
    private Set<String> sports = new HashSet<>();

    @Column(
            name = "email",
            unique = true,
            nullable = false
    )
    private String email;

    @Column(
            name = "password_hash",
            nullable = false
    )
    private String passwordHash;
}
