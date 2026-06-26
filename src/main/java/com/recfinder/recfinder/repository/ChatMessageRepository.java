package com.recfinder.recfinder.repository;

import com.recfinder.recfinder.entity.ChatMessage;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {
    List<ChatMessage> findByScrimmageIdOrderBySentAtAsc(Long scrimmageId);
}
