package com.recfinder.recfinder.repository;

import com.recfinder.recfinder.entity.Attendance;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface AttendanceRepository extends JpaRepository<Attendance, Long> {
    boolean existsByScrimmageIdAndUserId(Long scrimmageId, Long userId);

    int countByScrimmageId(Long scrimmageId);

    List<Attendance> findByScrimmageId(Long scrimmageId);

    Optional<Attendance> findByScrimmageIdAndUserId(Long scrimmageId, Long userId);

    List<Attendance> findByUserIdOrderByScrimmageStartTimeDesc(Long userId);
}
