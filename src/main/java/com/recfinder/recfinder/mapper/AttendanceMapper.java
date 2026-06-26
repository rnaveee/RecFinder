package com.recfinder.recfinder.mapper;

import com.recfinder.recfinder.dto.AttendanceResponse;
import com.recfinder.recfinder.entity.Attendance;
import com.recfinder.recfinder.entity.User;
import org.springframework.stereotype.Component;

@Component
public class AttendanceMapper {

    public AttendanceResponse toResponse(Attendance attendance) {
        User user = attendance.getUser();
        return new AttendanceResponse(
                attendance.getId(),
                attendance.getScrimmage().getId(),
                user.getId(),
                user.getName(),
                attendance.getJoinedAt()
        );
    }
}
