package com.recfinder.recfinder.service;

import com.recfinder.recfinder.dto.ChatMessageResponse;
import com.recfinder.recfinder.entity.ChatMessage;
import com.recfinder.recfinder.entity.Scrimmage;
import com.recfinder.recfinder.entity.User;
import com.recfinder.recfinder.exception.NotFoundException;
import com.recfinder.recfinder.repository.ChatMessageRepository;
import com.recfinder.recfinder.repository.ScrimmageRepository;
import com.recfinder.recfinder.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;

@Service
public class ChatMessageService {
    private final ChatMessageRepository chatMessageRepository;
    private final ScrimmageRepository scrimmageRepository;
    private final UserRepository userRepository;

    public ChatMessageService(
            ChatMessageRepository chatMessageRepository,
            ScrimmageRepository scrimmageRepository,
            UserRepository userRepository
    ) {
        this.chatMessageRepository = chatMessageRepository;
        this.scrimmageRepository = scrimmageRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public ChatMessageResponse save(Long scrimmageId, Long userId, String content){
        Scrimmage scrimmage = scrimmageRepository.findById(scrimmageId)
                .orElseThrow(() -> new NotFoundException("Scrimmage " + scrimmageId + " not found."));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new NotFoundException("User " + userId + " not found."));

        ChatMessage message = new ChatMessage();
        message.setScrimmage(scrimmage);
        message.setSender(user);
        message.setSentAt(Instant.now());
        message.setContent(content);

        ChatMessage saved = chatMessageRepository.save(message);
        return new ChatMessageResponse(
                saved.getId(),
                saved.getScrimmage().getId(),
                saved.getSender().getId(),
                saved.getSender().getName(),
                saved.getContent(),
                saved.getSentAt().toString()
        );
    }

    @Transactional(readOnly = true)
    public List<ChatMessageResponse> getMessages(Long scrimmageId) {
        return chatMessageRepository.findByScrimmageIdOrderBySentAtAsc(scrimmageId).stream()
            .map(m -> new ChatMessageResponse(
                    m.getId(),
                    m.getScrimmage().getId(),
                    m.getSender().getId(),
                    m.getSender().getName(),
                    m.getContent(),
                    m.getSentAt().toString()
            ))
            .toList();
    }
}
