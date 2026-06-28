package com.recfinder.recfinder.mapper;

import com.recfinder.recfinder.dto.CreateScrimmageRequest;
import com.recfinder.recfinder.dto.ScrimmageResponse;
import com.recfinder.recfinder.entity.Scrimmage;
import com.recfinder.recfinder.entity.User;
import org.springframework.stereotype.Component;

@Component
public class ScrimmageMapper {

    public Scrimmage toEntity(CreateScrimmageRequest request, User creator) {
        Scrimmage scrimmage = new Scrimmage();
        scrimmage.setSport(request.sport());
        scrimmage.setCity(request.city());
        scrimmage.setLocation(request.location());
        scrimmage.setStartTime(request.startTime());
        scrimmage.setAttendanceCost(request.attendanceCost());
        scrimmage.setMaxPlayers(request.maxPlayers());
        scrimmage.setPrivate(request.isPrivate());
        scrimmage.setCreatedBy(creator);
        return scrimmage;
    }

    public ScrimmageResponse toResponse(Scrimmage scrimmage, int attendeeCount) {
        User creator = scrimmage.getCreatedBy();
        return new ScrimmageResponse(
                scrimmage.getId(),
                scrimmage.getSport(),
                scrimmage.getCity(),
                scrimmage.getLocation(),
                scrimmage.getStartTime(),
                scrimmage.getAttendanceCost(),
                scrimmage.getMaxPlayers(),
                creator.getId(),
                creator.getName(),
                attendeeCount,
                scrimmage.isPrivate()
        );
    }
}
