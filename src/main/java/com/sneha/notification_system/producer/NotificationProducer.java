package com.sneha.notification_system.producer;

import com.sneha.notification_system.config.RabbitMQConfig;
import com.sneha.notification_system.entity.Notification;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class NotificationProducer {

    private final RabbitTemplate rabbitTemplate;

    public void sendNotification(Notification notification) {
        String routingKey = notification.getType() == Notification.NotificationType.EMAIL
                ? RabbitMQConfig.ROUTING_KEY_EMAIL
                : RabbitMQConfig.ROUTING_KEY_INAPP;

        rabbitTemplate.convertAndSend(
                RabbitMQConfig.NOTIFICATION_EXCHANGE,
                routingKey,
                notification
        );

        log.info("Published notification id={} type={} to RabbitMQ",
                notification.getId(), notification.getType());
    }
}