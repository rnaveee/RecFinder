package com.recfinder.recfinder.security;

import com.recfinder.recfinder.entity.User;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;

public class AppUserDetails implements UserDetails {
    private final User user;

    public AppUserDetails(User user){
        this.user = user;
    }

    @Override
    public String getUsername(){
        return user.getEmail();
    }

    public Long getUserId(){
        return user.getId();
    }

    @Override
    public String getPassword(){
        return user.getPasswordHash();
    }

    @Override
    public Collection<SimpleGrantedAuthority> getAuthorities(){
        return List.of(new SimpleGrantedAuthority("ROLE_USER"));
    }
}
