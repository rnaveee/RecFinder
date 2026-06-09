package com.recfinder.recfinder.mapper;

import com.recfinder.recfinder.dto.AttendanceResponse;
import com.recfinder.recfinder.entity.Attendance;
import com.recfinder.recfinder.entity.User;
import org.springframework.stereotype.Component;

@Component
public class AttendanceMapper {

    /** Flatten the join entity (user + scrimmage) into the response. */
    public AttendanceResponse toResponse(Attendance attendance) {
        User user = attendance.getUser();   // lazy, but read inside the service tx → loads fine
        return new AttendanceResponse(
                attendance.getId(),
                attendance.getScrimmage().getId(),
                user.getId(),
                user.getName(),
                attendance.getJoinedAt()
        );
    }
}