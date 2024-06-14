package project.back.msgateway.filter;

import java.net.URI;
import java.util.Arrays;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cloud.client.loadbalancer.reactive.ReactorLoadBalancerExchangeFilterFunction;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.core.Ordered;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.resource.NoResourceFoundException;
import org.springframework.web.server.ServerWebExchange;
import org.springframework.web.util.UriComponentsBuilder;

import jakarta.annotation.Resource;
import project.back.msgateway.dto.ErrorDTO;
import project.back.msgateway.dto.TokenDTO;
import project.back.msgateway.exception.ResponseException;
import reactor.core.publisher.Mono;

@Component
public class AuthFilter implements GlobalFilter, Ordered {

    @Resource
    private RouteValidator routeValidator;

    @Autowired
    private ReactorLoadBalancerExchangeFilterFunction lbFunction;

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        if (routeValidator.isForbidden.test(exchange.getRequest())) {
            throw new NoResourceFoundException("Resource not found");
        }

        if (routeValidator.isGuest.test(exchange.getRequest())) {
            return chain.filter(exchange);
        }

        if (!exchange.getRequest().getHeaders().containsKey(HttpHeaders.AUTHORIZATION)
                || exchange.getRequest().getHeaders().get(HttpHeaders.AUTHORIZATION).get(0) == null
                || !exchange.getRequest().getHeaders().get(HttpHeaders.AUTHORIZATION).get(0).startsWith("Bearer ")) {
            return handleError(exchange, "Missing bearer token in header", HttpStatus.UNAUTHORIZED).then(Mono.empty());
        }

        String token = exchange.getRequest().getHeaders().get(HttpHeaders.AUTHORIZATION).get(0).substring(7);

        String url = routeValidator.isAdmin.test(exchange.getRequest()) ? "http://ms-users/auth/token/admin"
                : routeValidator.isHike.test(exchange.getRequest()) ? "http://ms-users/auth/token/hike"
                        : routeValidator.isTravel.test(exchange.getRequest()) ? "http://ms-users/auth/token/travel"
                                : "http://ms-users/auth/token";
                                
        return WebClient.builder().filter(lbFunction).build().get().uri(url + "?token=" + token).retrieve()
                .onStatus(s -> s.is4xxClientError() || s.is5xxServerError(), clientResponse -> {
                    return clientResponse.bodyToMono(ErrorDTO.class).flatMap(errorBody -> {
                        return handleError(exchange, errorBody.getMessage(), HttpStatus.UNAUTHORIZED);
                    });
                }).bodyToMono(TokenDTO.class).flatMap(tokenDto -> handleRequest(exchange, chain, tokenDto));
    }

    private Mono<? extends Throwable> handleError(ServerWebExchange exchange, String errorMessage, HttpStatusCode status) {
        exchange.getResponse().setStatusCode(status);
        exchange.getResponse().getHeaders().setContentType(MediaType.APPLICATION_JSON);
        return Mono.error(new ResponseException(errorMessage, status));
    }


    private Mono<Void> handleRequest(ServerWebExchange exchange, GatewayFilterChain chain, TokenDTO tokenDto) {
        if (routeValidator.requireNotVerified.test(exchange.getRequest()) && tokenDto.getData().isVerified()) {
            return handleError(exchange, "Email already verified", HttpStatus.FORBIDDEN).then(Mono.empty());
        }
        if (!routeValidator.requireNotVerified.test(exchange.getRequest()) && 
                routeValidator.requireVerified.test(exchange.getRequest()) && !tokenDto.getData().isVerified()) {
            return handleError(exchange, "Email not verified", HttpStatus.FORBIDDEN).then(Mono.empty());
        }

        Long userId = tokenDto.getData().getId();
        String orgId = tokenDto.getData().getOrganization_id();
        String email = tokenDto.getData().getEmail();
        MultiValueMap<String, String> queryParams = new LinkedMultiValueMap<>(exchange.getRequest().getQueryParams());
        Arrays.asList("auth_id", "auth_org", "auth_email").forEach(queryParams::remove);

        // Add the token information to the query parameters
        queryParams.add("auth_id", String.valueOf(userId));
        queryParams.add("auth_email", email);
        if (orgId != null) {
            queryParams.add("auth_org", orgId);
        }

        URI newUri = UriComponentsBuilder.fromUri(exchange.getRequest().getURI())
            .replaceQueryParams(queryParams)
            .build(true)
            .toUri();
        System.out.println(newUri.toString());
        ServerWebExchange modifiedExchange = exchange.mutate().request(exchange.getRequest().mutate().uri(newUri).build()).build();

        return chain.filter(modifiedExchange);
    }

    @Override
    public int getOrder() {
        return -1;
    }
}
