package com.sneha.notification_system.service;

import com.sneha.notification_system.dto.NotificationRequest;
import com.sneha.notification_system.entity.Notification;
import com.sneha.notification_system.producer.NotificationProducer;
import com.sneha.notification_system.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class NotificationService {

    private final NotificationRepository repository;
    private final NotificationProducer producer;

    public Notification create(NotificationRequest req) {
        Notification n = new Notification();
        n.setUserId(req.getUserId());
        n.setType(req.getType());
        n.setSubject(req.getSubject());
        n.setMessage(req.getMessage());
        n.setStatus(Notification.NotificationStatus.QUEUED);

        Notification saved = repository.save(n);

        producer.sendNotification(saved);

        log.info("Notification id={} created and queued", saved.getId());
        return saved;
    }

    public List<Notification> getByUser(Long userId) {
        return repository.findByUserId(userId);
    }
}