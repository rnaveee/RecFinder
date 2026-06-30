package com.recfinder.recfinder.service;

import com.recfinder.recfinder.dto.AttendanceResponse;
import com.recfinder.recfinder.entity.Attendance;
import com.recfinder.recfinder.entity.Scrimmage;
import com.recfinder.recfinder.entity.User;
import com.recfinder.recfinder.exception.ConflictException;
import com.recfinder.recfinder.mapper.AttendanceMapper;
import com.recfinder.recfinder.repository.AttendanceRepository;
import com.recfinder.recfinder.repository.ScrimmageRepository;
import com.recfinder.recfinder.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import java.time.Instant;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AttendanceServiceTest {

    @Mock AttendanceRepository attendanceRepository;
    @Mock ScrimmageRepository scrimmageRepository;
    @Mock UserRepository userRepository;
    @Mock AttendanceMapper attendanceMapper;

    AttendanceService service;

    @BeforeEach
    void setUp() {
        service = new AttendanceService(attendanceRepository, scrimmageRepository, userRepository, attendanceMapper);
    }

    @Test
    void join_throwsConflict_whenUserAlreadyJoined() {
        Scrimmage scrimmage = new Scrimmage();

        scrimmage.setId(1L);
        scrimmage.setMaxPlayers(10);

        User user = new User();
        user.setId(50L);

        when(scrimmageRepository.findById(1L)).thenReturn(Optional.of(scrimmage));
        when(userRepository.findById(50L)).thenReturn(Optional.of(user));
        when(attendanceRepository.existsByScrimmageIdAndUserId(1L, 50L)).thenReturn(true);

        assertThrows(ConflictException.class, () -> service.join(1L, 50L));
    }

    @Test
    void join_throwsConflict_whenScrimmageIsFull() {
        Scrimmage scrimmage = new Scrimmage();

        scrimmage.setId(2L);
        scrimmage.setMaxPlayers(10);
        User user = new User();
        user.setId(51L);

        when(scrimmageRepository.findById(2L)).thenReturn(Optional.of(scrimmage));
        when(userRepository.findById(51L)).thenReturn(Optional.of(user));
        when(attendanceRepository.existsByScrimmageIdAndUserId(2L, 51L)).thenReturn(false);
        when(attendanceRepository.countByScrimmageId(2L)).thenReturn(10);
        assertThrows(ConflictException.class, () -> service.join(2L, 51L));

    }

    @Test
    void join_savesAttendance_whenValid(){
        Scrimmage scrimmage = new Scrimmage();

        scrimmage.setId(2L);
        scrimmage.setMaxPlayers(10);
        User user = new User();
        user.setId(51L);

        when(scrimmageRepository.findById(2L)).thenReturn(Optional.of(scrimmage));
        when(userRepository.findById(51L)).thenReturn(Optional.of(user));
        when(attendanceRepository.existsByScrimmageIdAndUserId(2L, 51L)).thenReturn(false);
        when(attendanceRepository.countByScrimmageId(2L)).thenReturn(5);
        when(attendanceRepository.save(any(Attendance.class))).thenReturn(new Attendance());
        when(attendanceMapper.toResponse(any(Attendance.class))).thenReturn(new AttendanceResponse(1L, 1L, 1L, "user", Instant.now()));

        service.join(2L, 51L);
        verify(attendanceRepository).save(any(Attendance.class));


    }
}