package com.recfinder.recfinder.repository;

import com.recfinder.recfinder.entity.Attendance;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AttendanceRepository extends JpaRepository<Attendance, Long> {
}
