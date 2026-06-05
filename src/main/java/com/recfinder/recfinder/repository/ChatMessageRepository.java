package com.recfinder.recfinder.repository;

import com.recfinder.recfinder.entity.ChatMessage;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * CRUD for ChatMessage. The Messaging track will add the history query, e.g.
 * List<ChatMessage> findByScrimmageIdOrderBySentAtAsc(Long scrimmageId)
 * (backs GET /api/scrimmages/{id}/messages — uses the idx_chat_messages index).
 */
public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {
}