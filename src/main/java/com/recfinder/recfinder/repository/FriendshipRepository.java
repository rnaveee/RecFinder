package com.recfinder.recfinder.repository;

import com.recfinder.recfinder.entity.Friendship;
import com.recfinder.recfinder.entity.FriendshipStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface FriendshipRepository extends JpaRepository<Friendship, Long> {

    @Query("SELECT f FROM Friendship f WHERE (:requesterId = f.requester.id AND :addresseeId = f.addressee.id) OR (:requesterId = f.addressee.id AND :addresseeId = f.requester.id)")
    Optional<Friendship> findByRequesterIdAndAddresseeId(@Param("requesterId") Long requesterId, @Param("addresseeId") Long addresseeId);

    @Query("SELECT f FROM Friendship f WHERE :status = f.status AND :addresseeId = f.addressee.id")
    List<Friendship> findByAddresseeIdAndStatus(@Param("addresseeId") Long addresseeId, @Param("status") FriendshipStatus status);

    @Query("SELECT f FROM Friendship f WHERE (:id = f.requester.id OR :id = f.addressee.id) AND :status = f.status")
    List<Friendship> findAcceptedRequests(@Param("id") Long id, @Param("status") FriendshipStatus status);

}