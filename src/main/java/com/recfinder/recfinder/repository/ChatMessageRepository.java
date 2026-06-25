package com.recfinder.recfinder.repository;

import com.recfinder.recfinder.entity.ChatMessage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

/**
 * CRUD for ChatMessage. The Messaging track will add the history query, e.g.
 * List<ChatMessage> findByScrimmageIdOrderBySentAtAsc(Long scrimmageId)
 * (backs GET /api/scrimmages/{id}/messages — uses the idx_chat_messages index).
 */
public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {

    List<ChatMessage> findByScrimmageIdOrderBySentAtAsc(@Param("scrimmageId") Long scrimmageId);

}