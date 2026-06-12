package com.sneha.notification_system.dto;

import com.sneha.notification_system.entity.Notification.NotificationType;
import lombok.Data;

@Data
public class NotificationRequest {
    private Long userId;
    private NotificationType type;
    private String subject;
    private String message;
}