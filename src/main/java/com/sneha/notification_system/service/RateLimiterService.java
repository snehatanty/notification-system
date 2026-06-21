package com.sneha.notification_system.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.time.Duration;

@Service
@RequiredArgsConstructor
@Slf4j
public class RateLimiterService {

    private final RedisTemplate<String, String> redisTemplate;

    private static final int MAX_NOTIFICATIONS_PER_HOUR = 10;

    public boolean isAllowed(Long userId, String channel) {
        String key = "ratelimit:" + userId + ":" + channel;

        Long count = redisTemplate.opsForValue().increment(key);

        if (count == 1) {
            redisTemplate.expire(key, Duration.ofHours(1));
        }

        if (count > MAX_NOTIFICATIONS_PER_HOUR) {
            log.warn("Rate limit exceeded for userId={} channel={} count={}",
                    userId, channel, count);
            return false;
        }

        log.info("Rate limit check passed for userId={} channel={} count={}/{}",
                userId, channel, count, MAX_NOTIFICATIONS_PER_HOUR);
        return true;
    }

    public long getRemainingQuota(Long userId, String channel) {
        String key = "ratelimit:" + userId + ":" + channel;
        String count = redisTemplate.opsForValue().get(key);
        if (count == null) return MAX_NOTIFICATIONS_PER_HOUR;
        return Math.max(0, MAX_NOTIFICATIONS_PER_HOUR - Long.parseLong(count));
    }
}