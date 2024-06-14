package project.back.msusers.proxy;

import org.springframework.cloud.loadbalancer.annotation.LoadBalancerClient;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;


@FeignClient(name="ms-travels")
@LoadBalancerClient(name="ms-travels")
public interface MsTravelsProxy {
  
  @GetMapping("/agency/internal/{id}")
  Object checkTravelAgency(@PathVariable String id);
}
