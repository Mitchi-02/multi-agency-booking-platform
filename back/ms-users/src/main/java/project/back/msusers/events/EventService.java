package project.back.msusers.events;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import project.back.msusers.events.core.base.BaseEvent;


@Service
@RequiredArgsConstructor
public class EventService {

    private final KafkaTemplate<String, String> kafkaTemplate;
    private final Mapper eventMapper;

    @Value("${spring.kafka.users-topic}")
    private String usersTopic;

    public void sendEvent(BaseEvent ev) {
        System.out.println("Sending event: " + ev);
        String json = eventMapper.convertToJson(ev);
        if(json == null) throw new RuntimeException("Error converting object to json");
        this.kafkaTemplate.send(this.usersTopic, json);
    }
}
