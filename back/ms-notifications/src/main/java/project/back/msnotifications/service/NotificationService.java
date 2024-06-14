package project.back.msnotifications.service;

import jakarta.annotation.Resource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import project.back.msnotifications.entities.Notification;
import project.back.msnotifications.entities.UserType;
import project.back.msnotifications.repositories.NotificationRepository;


@Service
public class NotificationService {

  @Resource
  private NotificationRepository notificationRepository;

  public Page<Notification> getNotifications(int page, int page_size, Long user_id, UserType type){
    return notificationRepository.findByUserIdAndAndUserType(user_id, type, PageRequest.of(page-1, page_size));
  }
}
