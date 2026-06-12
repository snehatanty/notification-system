package com.sneha.notification_system.consumer;

import com.sneha.notification_system.config.RabbitMQConfig;
import com.sneha.notification_system.entity.Notification;
import com.sneha.notification_system.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class NotificationConsumer {

    private final NotificationRepository repository;

    @RabbitListener(queues = RabbitMQConfig.NOTIFICATION_QUEUE)
    public void consume(Notification notification) {
        log.info("Received notification id={} type={}",
                notification.getId(), notification.getType());

        processNotification(notification);

        notification.setStatus(Notification.NotificationStatus.SENT);
        repository.save(notification);

        log.info("Successfully processed notification id={}", notification.getId());
    }

    @RabbitListener(queues = RabbitMQConfig.NOTIFICATION_DLQ)
    public void consumeFromDlq(Notification notification) {
        log.error("Notification id={} landed in DLQ — marking as FAILED",
                notification.getId());
        notification.setStatus(Notification.NotificationStatus.FAILED);
        repository.save(notification);
    }

    private void processNotification(Notification notification) {
        switch (notification.getType()) {
            case EMAIL -> log.info("Delivering EMAIL to userId={} subject={}",
                    notification.getUserId(), notification.getSubject());
            case IN_APP -> log.info("Delivering IN_APP to userId={}",
                    notification.getUserId());
        }
    }
}