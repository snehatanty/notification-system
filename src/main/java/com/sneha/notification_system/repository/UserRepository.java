package com.sneha.notification_system.repository;

import com.sneha.notification_system.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {
}