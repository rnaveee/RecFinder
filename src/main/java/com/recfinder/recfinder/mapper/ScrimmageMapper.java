package com.recfinder.recfinder.mapper;

import com.recfinder.recfinder.dto.CreateScrimmageRequest;
import com.recfinder.recfinder.dto.ScrimmageResponse;
import com.recfinder.recfinder.entity.Scrimmage;
import com.recfinder.recfinder.entity.User;
import org.springframework.stereotype.Component;

/**
 * Converts between the Scrimmage entity and its DTOs. Manual mapping, same as UserMapper.
 */
@Component
public class ScrimmageMapper {

    /**
     * Build a new entity from the create request plus the already-looked-up creator.
     * The mapper does NOT do the lookup itself (that needs a repository) — the service
     * resolves the User by id and passes it in, keeping this class pure and stateless.
     */
    public Scrimmage toEntity(CreateScrimmageRequest request, User creator) {
        Scrimmage scrimmage = new Scrimmage();
        scrimmage.setSport(request.sport());
        scrimmage.setCity(request.city());
        scrimmage.setLocation(request.location());
        scrimmage.setStartTime(request.startTime());
        scrimmage.setAttendanceCost(request.attendanceCost());
        scrimmage.setMaxPlayers(request.maxPlayers());
        scrimmage.setCreatedBy(creator);
        return scrimmage;
    }

    /** Flatten the entity (incl. its creator) into the outbound response. */
    public ScrimmageResponse toResponse(Scrimmage scrimmage) {
        User creator = scrimmage.getCreatedBy();   // accessed inside the service's tx, so the
                                                   // lazy @ManyToOne loads here while the session is open
        return new ScrimmageResponse(
                scrimmage.getId(),
                scrimmage.getSport(),
                scrimmage.getCity(),
                scrimmage.getLocation(),
                scrimmage.getStartTime(),
                scrimmage.getAttendanceCost(),
                scrimmage.getMaxPlayers(),
                creator.getId(),
                creator.getName()
        );
    }
}