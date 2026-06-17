package com.recfinder.recfinder.service;

import com.recfinder.recfinder.dto.CreateUserRequest;
import com.recfinder.recfinder.dto.UserResponse;
import com.recfinder.recfinder.entity.User;
import com.recfinder.recfinder.exception.NotFoundException;
import com.recfinder.recfinder.mapper.UserMapper;
import com.recfinder.recfinder.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
@Service
public class UserService {

    private final UserRepository userRepository;
    private final UserMapper userMapper;

    // Constructor injection (our convention — no @Autowired on fields).
    // Spring sees one constructor and wires these beans in automatically.
    public UserService(UserRepository userRepository, UserMapper userMapper) {
        this.userRepository = userRepository;
        this.userMapper = userMapper;
    }

    @Transactional
    public UserResponse create(CreateUserRequest request) {
        User user = userMapper.toEntity(request);
        User saved = userRepository.save(user);   // INSERT; saved now has the generated id
        return userMapper.toResponse(saved);
    }

    @Transactional(readOnly = true)
    public List<UserResponse> findAll() {
        return userRepository.findAll().stream()
                .map(userMapper::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public UserResponse findById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("User " + id + " not found"));
        return userMapper.toResponse(user);
    }
}