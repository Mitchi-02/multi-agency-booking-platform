#!/bin/sh
cd /opt/hike-agent
# echo "Changing api calls url from local to prod/dev domain"
# find ./src -type f -exec sed -i 's/0.0.0.0/<domain-name>/g' {} +
echo "Running hike-agent npm start on 3002"
npm run start -- -p 3002