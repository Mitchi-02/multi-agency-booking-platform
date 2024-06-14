package project.back.msnotifications.events;


import jakarta.annotation.Resource;
import lombok.RequiredArgsConstructor;
import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;
import project.back.msnotifications.events.core.hike_bookings.BaseHikeBookingEvent;
import project.back.msnotifications.events.core.hike_bookings.HikeBookingTopicPayload;
import project.back.msnotifications.events.core.hike_payments.BaseHikePaymentEvent;
import project.back.msnotifications.events.core.hike_payments.HikePaymentTopicPayload;
import project.back.msnotifications.events.core.hike_reviews.BaseHikeReviewEvent;
import project.back.msnotifications.events.core.hike_reviews.HikeReviewTopicPayload;
import project.back.msnotifications.events.core.travel_bookings.BaseTravelBookingEvent;
import project.back.msnotifications.events.core.travel_bookings.TravelBookingTopicPayload;
import project.back.msnotifications.events.core.travel_payments.BaseTravelPaymentEvent;
import project.back.msnotifications.events.core.travel_payments.TravelPaymentTopicPayload;
import project.back.msnotifications.events.core.travel_reviews.BaseTravelReviewEvent;
import project.back.msnotifications.events.core.travel_reviews.TravelReviewTopicPayload;
import project.back.msnotifications.events.core.users.BaseUserEvent;
import project.back.msnotifications.events.core.users.UserTopicPayload;
import project.back.msnotifications.service.EmailService;

@Component
@RequiredArgsConstructor
public class EventListener {
    private final Mapper eventMapper;

    @Resource
    private final EmailService emailService;

    @KafkaListener(topics = "${spring.kafka.users-topic}", groupId = "${spring.kafka.consumer.group-id}")
    public void listenUsers(ConsumerRecord<String, String> message) {
        BaseUserEvent ev = this.eventMapper.convertToObject(message.value(), BaseUserEvent.class);
        System.out.println("Received event in users topic: " + message.value());
        if(ev == null) return;
        switch (ev.getType()) {
            case EMAIL_VERIFICATION:
                this.handleEmailVerification(ev.getData());
                break;
            case RESET_PASSWORD:
                this.handlePasswordReset(ev.getData());
                break;
        }
    }

    @KafkaListener(topics = "${spring.kafka.travel-bookings-topic}", groupId = "${spring.kafka.consumer.group-id}")
    public void listenTravelBookings(ConsumerRecord<String, String> message) {
        BaseTravelBookingEvent ev = this.eventMapper.convertToObject(message.value(), BaseTravelBookingEvent.class);
        System.out.println("Received event in travel bookings topic: " + message.value());
        if(ev == null) return;
        switch (ev.getType()) {
            case CREATE:
                this.handleTravelBookingCreated(ev.getData());
                break;
            case UPDATE:
                this.handleTravelBookingUpdated(ev.getData());
                break;
        }
    }

    @KafkaListener(topics = "${spring.kafka.travel-reviews-topic-topic}", groupId = "${spring.kafka.consumer.group-id}")
    public void listenTravelReviews(ConsumerRecord<String, String> message) {
        BaseTravelReviewEvent ev = this.eventMapper.convertToObject(message.value(), BaseTravelReviewEvent.class);
        System.out.println("Received event in travel reviews topic: " + message.value());
        if(ev == null) return;
        switch (ev.getType()) {
            case CREATE:
                this.handleTravelReviewCreated(ev.getData());
                break;
        }
    }


    @KafkaListener(topics = "${spring.kafka.travel-payments-topic-topic-topic}", groupId = "${spring.kafka.consumer.group-id}")
    public void listenTravelPayments(ConsumerRecord<String, String> message) {
        BaseTravelPaymentEvent ev = this.eventMapper.convertToObject(message.value(), BaseTravelPaymentEvent.class);
        System.out.println("Received event in travel payments topic: " + message.value());
        if(ev == null) return;
        switch (ev.getType()) {
            case UPDATE:
                this.handleTravelPaymentUpdated(ev.getData());
                break;
        }
    }

    @KafkaListener(topics = "${spring.kafka.hike-bookings-topic}", groupId = "${spring.kafka.consumer.group-id}")
    public void listenHikeBookings(ConsumerRecord<String, String> message) {
        BaseHikeBookingEvent ev = this.eventMapper.convertToObject(message.value(), BaseHikeBookingEvent.class);
        System.out.println("Received event in hike bookings topic: " + message.value());
        if(ev == null) return;
        switch (ev.getType()) {
            case CREATE:
                this.handleHikeBookingCreated(ev.getData());
                break;
            case UPDATE:
                this.handleHikeBookingUpdated(ev.getData());
                break;
        }
    }

    @KafkaListener(topics = "${spring.kafka.hike-reviews-topic-topic}", groupId = "${spring.kafka.consumer.group-id}")
    public void listenHikeReviews(ConsumerRecord<String, String> message) {
        BaseHikeReviewEvent ev = this.eventMapper.convertToObject(message.value(), BaseHikeReviewEvent.class);
        System.out.println("Received event in hike reviews topic: " + message.value());
        if(ev == null) return;
        switch (ev.getType()) {
            case CREATE:
                this.handleHikeReviewCreated(ev.getData());
                break;
        }
    }


    @KafkaListener(topics = "${spring.kafka.hike-payments-topic-topic-topic}", groupId = "${spring.kafka.consumer.group-id}")
    public void listenHikePayments(ConsumerRecord<String, String> message) {
        BaseHikePaymentEvent ev = this.eventMapper.convertToObject(message.value(), BaseHikePaymentEvent.class);
        System.out.println("Received event in hike payments topic: " + message.value());
        if(ev == null) return;
        switch (ev.getType()) {
            case UPDATE:
                this.handleHikePaymentUpdated(ev.getData());
                break;
        }
    }


    protected void handleEmailVerification(UserTopicPayload data) {
        try {
            this.emailService.sendEmail(data.getEmail(), "Email Verification", data.getCode());
        } catch (Exception e) {
            System.out.println("Error sending email verification " + e);
        }
    }

    protected void handlePasswordReset(UserTopicPayload data) {
        try {
            this.emailService.sendEmail(data.getEmail(), "Password Reset", data.getCode());
        } catch (Exception e) {
            System.out.println("Error sending password reset " + e);
        }
    }


    protected void handleTravelBookingCreated(TravelBookingTopicPayload data) {

    }

    protected void handleTravelBookingUpdated(TravelBookingTopicPayload data) {

    }

    protected void handleTravelReviewCreated(TravelReviewTopicPayload data) {

    }

    protected void handleTravelPaymentUpdated(TravelPaymentTopicPayload data) {

    }


    protected void handleHikeBookingCreated(HikeBookingTopicPayload data) {

    }

    protected void handleHikeBookingUpdated(HikeBookingTopicPayload data) {

    }

    protected void handleHikeReviewCreated(HikeReviewTopicPayload data) {

    }

    protected void handleHikePaymentUpdated(HikePaymentTopicPayload data) {

    }
}