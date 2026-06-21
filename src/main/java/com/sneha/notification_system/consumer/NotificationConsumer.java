package com.sneha.notification_system.consumer;

import com.sneha.notification_system.config.RabbitMQConfig;
import com.sneha.notification_system.entity.Notification;
import com.sneha.notification_system.entity.User;
import com.sneha.notification_system.repository.NotificationRepository;
import com.sneha.notification_system.repository.UserRepository;
import com.sneha.notification_system.service.EmailService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class NotificationConsumer {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;
    private final EmailService emailService;

    @RabbitListener(queues = RabbitMQConfig.NOTIFICATION_QUEUE)
    public void consume(Notification notification) {
        log.info("Received notification id={} type={}",
                notification.getId(), notification.getType());

        try {
            processNotification(notification);
            notification.setStatus(Notification.NotificationStatus.SENT);
            notificationRepository.save(notification);
            log.info("Successfully processed notification id={}", notification.getId());

        } catch (Exception e) {
            log.error("Failed to process notification id={} error={}",
                    notification.getId(), e.getMessage());
            notification.setStatus(Notification.NotificationStatus.FAILED);
            notificationRepository.save(notification);
            throw e;
        }
    }

    @RabbitListener(queues = RabbitMQConfig.NOTIFICATION_DLQ)
    public void consumeFromDlq(Notification notification) {
        log.error("Notification id={} landed in DLQ — marking as FAILED",
                notification.getId());
        notification.setStatus(Notification.NotificationStatus.FAILED);
        notificationRepository.save(notification);
    }

    private void processNotification(Notification notification) {
        switch (notification.getType()) {
            case EMAIL -> {
                User user = userRepository.findById(notification.getUserId())
                        .orElseThrow(() -> new RuntimeException(
                                "User not found id=" + notification.getUserId()));

                boolean sent = emailService.sendEmail(
                        user.getEmail(),
                        notification.getSubject(),
                        notification.getMessage()
                );

                if (!sent) {
                    throw new RuntimeException("SendGrid delivery failed");
                }

                log.info("Real email sent to={}", user.getEmail());
            }
            case IN_APP -> {
                log.info("IN_APP notification delivered to userId={}",
                        notification.getUserId());
            }
        }
    }
}