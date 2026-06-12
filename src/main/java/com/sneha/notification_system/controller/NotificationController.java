package com.sneha.notification_system.controller;

import com.sneha.notification_system.dto.NotificationRequest;
import com.sneha.notification_system.entity.Notification;
import com.sneha.notification_system.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService service;

    @PostMapping
    public ResponseEntity<Notification> send(@RequestBody NotificationRequest req) {
        return ResponseEntity.ok(service.create(req));
    }

    @GetMapping("/{userId}")
    public ResponseEntity<List<Notification>> getAll(@PathVariable Long userId) {
        return ResponseEntity.ok(service.getByUser(userId));
    }
}