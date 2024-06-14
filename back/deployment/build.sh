#!/bin/bash

# Array of folder names and micro services
folder_names_java=("ms-gateway" "ms-registry" "ms-users" "ms-notifications")

# Loop through each folder name
for folder in "${folder_names_java[@]}"
do
    # Copy entrypoint.sh to the destination folder
    cp "docker/$folder/entrypoint.sh" "../$folder"

    # Build Docker image
    docker build --pull -t "xmitchix/2cs-back-$folder:1.0" -f "./docker/$folder/Dockerfile" "../$folder"

    # Remove entrypoint.sh after building
    rm "../$folder/entrypoint.sh"

    # Push Docker image
    docker push "xmitchix/2cs-back-$folder:1.0"
done


folder_names_nest=("ms-hikes" "ms-hikes-query" "ms-travels" "ms-travels-query" "ms-payment" "ms-requests")

# Loop through each folder name
for folder in "${folder_names_nest[@]}"
do
    # Copy entrypoint.sh to the destination folder
    cp "docker/$folder/prod/entrypoint.sh" "../$folder"

    # Build Docker image
    docker build --pull -t "xmitchix/2cs-back-$folder:1.0" -f "./docker/$folder/prod/Dockerfile" "../$folder"

    # Remove entrypoint.sh after building
    rm "../$folder/entrypoint.sh"

    # Push Docker image
    docker push "xmitchix/2cs-back-$folder:1.0"
done