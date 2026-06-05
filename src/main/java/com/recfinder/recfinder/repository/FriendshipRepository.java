package com.recfinder.recfinder.repository;

import com.recfinder.recfinder.entity.Friendship;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * CRUD for Friendship. Future derived finders for the Social track, e.g.
 * Optional<Friendship> findByRequesterIdAndAddresseeId(Long requesterId, Long addresseeId)
 * List<Friendship> findByAddresseeIdAndStatus(Long addresseeId, FriendshipStatus status)  // incoming requests
 */
public interface FriendshipRepository extends JpaRepository<Friendship, Long> {
}