package com.recfinder.recfinder.controller;

import com.recfinder.recfinder.dto.ChatMessageResponse;
import com.recfinder.recfinder.entity.ChatMessage;
import com.recfinder.recfinder.entity.User;
import com.recfinder.recfinder.exception.NotFoundException;
import com.recfinder.recfinder.repository.UserRepository;
import com.recfinder.recfinder.service.ChatMessageService;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.ResponseBody;

import java.security.Principal;
import java.util.List;

@Controller
@ResponseBody
public class ChatController {

    private final ChatMessageService chatMessageService;
    private final UserRepository userRepository;

    public ChatController(ChatMessageService chatMessageService, UserRepository userRepository){
        this.chatMessageService = chatMessageService;
        this.userRepository = userRepository;
    }

    @MessageMapping("/chat/{scrimmageId}")
    @SendTo("/topic/scrimmages/{scrimmageId}")
    public ChatMessageResponse sendMessage(
            @DestinationVariable Long scrimmageId,
            @Payload String content,
            Principal principal
    ) {

        User user = userRepository.findByEmail(principal.getName())
                .orElseThrow(() -> new NotFoundException("User " + principal.getName() + " not found."));
        return chatMessageService.save(scrimmageId, user.getId(), content);
    }

    @GetMapping("/api/scrimmages/{id}/messages")
    public List<ChatMessageResponse> getMessages(@PathVariable Long id){
        return chatMessageService.getMessages(id);
    }

}
