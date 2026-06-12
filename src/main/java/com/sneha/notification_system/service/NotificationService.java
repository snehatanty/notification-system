package com.sneha.notification_system.service;

import com.sneha.notification_system.dto.NotificationRequest;
import com.sneha.notification_system.entity.Notification;
import com.sneha.notification_system.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository repository;

    public Notification create(NotificationRequest req) {
        Notification n = new Notification();
        n.setUserId(req.getUserId());
        n.setType(req.getType());
        n.setSubject(req.getSubject());
        n.setMessage(req.getMessage());
        n.setStatus(Notification.NotificationStatus.QUEUED);
        return repository.save(n);
    }

    public List<Notification> getByUser(Long userId) {
        return repository.findByUserId(userId);
    }
}