package project.back.msusers.proxy;

import org.springframework.cloud.loadbalancer.annotation.LoadBalancerClient;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;


@FeignClient(name="ms-hikes")
@LoadBalancerClient(name="ms-hikes")
public interface MsHikesProxy {
  
  @GetMapping("/agency/internal/{id}")
  Object checkHikeAgency(@PathVariable() String id);
}
