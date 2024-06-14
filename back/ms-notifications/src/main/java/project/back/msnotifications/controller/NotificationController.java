package project.back.msnotifications.controller;

import jakarta.annotation.Resource;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.NonNull;
import org.springframework.web.bind.annotation.*;
import project.back.msnotifications.entities.Notification;
import project.back.msnotifications.entities.UserType;
import project.back.msnotifications.response.generic.ErrorPayload;
import project.back.msnotifications.response.generic.SuccessPayload;
import project.back.msnotifications.service.NotificationService;

@RestController("/notifications")
public class NotificationController extends BaseController {

  private static final String DEFAULT_PAGE_SIZE = "10";
  private static final String DEFAULT_PAGE = "1";

  @Resource
  private NotificationService notificationService;


//  @GetMapping()
//  private ResponseEntity<?> clientNotification(
//          @RequestParam Long auth_id,
//          @RequestParam(defaultValue = NotificationController.DEFAULT_PAGE) String page,
//          @RequestParam(defaultValue = NotificationController.DEFAULT_PAGE_SIZE) String page_size) {
//    int pageInt = Integer.parseInt(page);
//    int pageSizeInt = Integer.parseInt(page_size);
//    if(pageInt < 1 || pageSizeInt < 1) {
//      return super.sendErrorResponse("Bad request params given", HttpStatus.UNPROCESSABLE_ENTITY);
//    }
//    try {
//      Page<Notification> notifications = notificationService.getNotifications(pageInt, pageSizeInt, auth_id, UserType.CLIENT);
//      return super.sendSuccessResponse("Notification retrieved successfully",
//              new FindUsersResponseDTO(pageInt, pageSizeInt, notifications.getTotalElements(), notifications.getContent()));
//    } catch (IllegalArgumentException | NullPointerException e) {
//      return super.sendErrorResponse("Bad request params given", HttpStatus.UNPROCESSABLE_ENTITY);
//    }
//  }
}
