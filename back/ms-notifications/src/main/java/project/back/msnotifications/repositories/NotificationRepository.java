package project.back.msnotifications.repositories;

import org.bson.types.ObjectId;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import project.back.msnotifications.entities.Notification;
import project.back.msnotifications.entities.UserType;

@Repository
public interface NotificationRepository extends MongoRepository<Notification, ObjectId> {

    @Cacheable(value = "NOTIFICATIONS", key = "#userId + '_' + #userType")
    Page<Notification> findByUserIdAndAndUserType(Long userId, UserType userType, Pageable pageable);

    @CacheEvict(value = "NOTIFICATIONS", key = "#notification.userId + '_' + #notification.userType")
    Notification save(Notification notification);
}
