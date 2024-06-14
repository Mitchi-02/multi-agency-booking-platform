folder_names_nest=("ms-hikes" "ms-hikes-query" "ms-travels" "ms-travels-query" "ms-payment" "ms-requests")

# Loop through each folder name
for folder in "${folder_names_nest[@]}"
do
    # Copy entrypoint.sh to the destination folder
    cp "docker/$folder/dev/entrypoint.sh" "../$folder"

    # Build Docker image
    docker build --pull -t "xmitchix/2cs-back-$folder-dev:1.0" -f "./docker/$folder/dev/Dockerfile" "../$folder"

    # Remove entrypoint.sh after building
    rm "../$folder/entrypoint.sh"

    # Push Docker image to Docker Hub
    docker push "xmitchix/2cs-back-$folder-dev:1.0"

    # Remove Docker image from local
    docker rmi "xmitchix/2cs-back-$folder-dev:1.0"
done