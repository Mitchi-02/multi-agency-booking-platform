package project.back.msusers.events;


import lombok.RequiredArgsConstructor;
import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class EventListener {
    private final Mapper eventMapper;


    @KafkaListener(topics = "${spring.kafka.users-topic}", groupId = "${spring.kafka.consumer.group-id}")
    public void listen(ConsumerRecord<String, String> message) {

    }
}