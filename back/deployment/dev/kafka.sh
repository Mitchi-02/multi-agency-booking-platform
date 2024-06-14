#!/bin/bash

# Array of topic names from environment variables
topics=(
  "$USERS_TOPIC"
  "$TRAVELS_TOPIC"
  "$TRAVEL_AGENCIES_TOPIC"
  "$TRAVEL_BOOKINGS_TOPIC"
  "$TRAVEL_PAYMENTS_TOPIC"
  "$TRAVEL_REVIEWS_TOPIC"
  "$HIKES_TOPIC"
  "$HIKE_AGENCIES_TOPIC"
  "$HIKE_BOOKINGS_TOPIC"
  "$HIKE_PAYMENTS_TOPIC"
  "$HIKE_REVIEWS_TOPIC"
)

echo "Creating topics"

# Loop through the array and create each topic
for topic in "${topics[@]}"; do
  echo "Creating topic $topic"
  /opt/bitnami/kafka/bin/kafka-topics.sh --create --if-not-exists --topic "$topic" --bootstrap-server kafka:9092 --replication-factor 1 --partitions 1
done