package com.recfinder.recfinder.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class SpaController {

    @RequestMapping(value = {
        "/",
        "/login",
        "/register",
        "/scrimmages",
        "/scrimmages/new",
        "/scrimmages/{id:[0-9]+}",
        "/scrimmages/{id:[0-9]+}/edit",
        "/profile",
        "/friends",
        "/about",
        "/support",
        "/terms",
        "/privacy",
    })
    public String forward() {
        return "forward:/index.html";
    }
}
