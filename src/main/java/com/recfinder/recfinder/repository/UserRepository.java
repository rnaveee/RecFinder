package com.recfinder.recfinder.repository;

import com.recfinder.recfinder.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {
}