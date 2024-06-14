#!/bin/bash

# Array of folder names and micro services
folder_names=("client" "admin" "hike-agent" "travel-agent")

# Loop through each folder name
for folder in "${folder_names[@]}"
do
    # Copy entrypoint.sh to the destination folder
    cp "docker/$folder/entrypoint.sh" "../$folder"

    # Build Docker image
    docker build --pull -t "xmitchix/2cs-front-$folder:1.0" -f "./docker/$folder/Dockerfile" "../$folder"

    # Remove entrypoint.sh after building
    rm "../$folder/entrypoint.sh"

    # Push Docker imagee
    docker push "xmitchix/2cs-front-$folder:1.0"
done
