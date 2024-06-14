package project.back.msgateway.filter;

import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.stereotype.Component;

import java.util.*;
import java.util.function.Predicate;

@Component
public class RouteValidator {

  private static final List<String> forbiddenApiEndpoints = List.of(
    "internal"
  );

  public Predicate<ServerHttpRequest> isForbidden =
    request -> forbiddenApiEndpoints
      .stream()
      .anyMatch(uri -> request.getURI().getPath().contains(uri));

    private static final List<String> openApiEndpoints = List.of(
      "/eureka",
      "/ms-users/auth/register",
      "/ms-users/auth/login",
      "/ms-users/auth/login/admin",
      "/ms-users/auth/login/hike",
      "/ms-users/auth/login/travel",
      "/ms-users/auth/token",
      "/ms-users/auth/token/admin",
      "/ms-users/auth/token/hike",
      "/ms-users/auth/token/travel",
      "/ms-users/password/reset",
      "/ms-users/password/send",

      "/ms-requests/request/public",
      "/ms-hikes/agency/public",
      "/ms-hikes/hike/public",

      "/ms-travels/agency/public",
      "/ms-travels/travel/public",
      "/ms-payment/webhook",
      "/ms-hikes/reviews/public",

      "/ms-travels/agency/public",
      "/ms-travels/travel/public",
      "/ms-travels/reviews/public",

      "/ms-travels-query/reviews/public",
      "/ms-hikes-query/reviews/public"
    );

    public Predicate<ServerHttpRequest> isGuest =
      request -> openApiEndpoints
        .stream()
        .anyMatch(uri -> request.getURI().getPath().contains(uri));

    private static final List<String> notVerifiedApiEndPoints = List.of(
      "/ms-users/email/verify",
      "/ms-users/email/resend"
    );

    public Predicate<ServerHttpRequest> requireNotVerified =
      request -> notVerifiedApiEndPoints
        .stream()
        .anyMatch(uri -> request.getURI().getPath().contains(uri));

    private static final List<String> notNecessarlyVerifiedApiEndPoints = List.of(
      "/ms-users/user/infos"
  
    );

    public Predicate<ServerHttpRequest> requireVerified =
      request -> notNecessarlyVerifiedApiEndPoints
        .stream()
        .noneMatch(uri -> request.getURI().getPath().contains(uri));

    private static final List<String> adminApiEndpoints = List.of(
      "/ms-users/user/admin",
      "/ms-requests/request",
      "/ms-hikes/agency/admin",
      "/ms-travels/agency/admin"
    );

    public Predicate<ServerHttpRequest> isAdmin =
      request -> adminApiEndpoints
        .stream()
        .anyMatch(uri -> request.getURI().getPath().contains(uri));
    
    private static final List<String> hikeApiEndpoints = List.of(
      "/ms-hikes/agency/hike_agent",
      "/ms-hikes/hike/hike_agent",
      "/ms-hikes/booking/agent",
      "/ms-hikes/reviews/agent",
      "/ms-hikes-query/reviews/agent",
      "/ms-hikes-query/booking/agent"
    );

    public Predicate<ServerHttpRequest> isHike =
      request -> hikeApiEndpoints
        .stream()
        .anyMatch(uri -> request.getURI().getPath().contains(uri));

    private static final List<String> travelApiEndpoints = List.of(
      "/ms-travels/agency/travel_agent",
      "/ms-travels/travel/travel_agent",
      "/ms-travels/booking/agent",
      "/ms-travels/reviews/agent",
      "/ms-travels-query/reviews/agent",
      "/ms-travels-query/booking/agent"
    );

    public Predicate<ServerHttpRequest> isTravel =
      request -> travelApiEndpoints
        .stream()
        .anyMatch(uri -> request.getURI().getPath().contains(uri));
}
