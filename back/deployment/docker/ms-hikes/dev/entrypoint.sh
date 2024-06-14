#!/bin/sh
cd /opt/api/ms-hikes
# echo "Changing api calls url from local to prod/dev domain"
# find ./src -type f -exec sed -i 's/0.0.0.0/<domain-name>/g' {} +
echo "Running ms-hikes npm dev on port ${PORT}..."
npm run dev