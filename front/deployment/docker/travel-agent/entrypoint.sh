#!/bin/sh
cd /opt/travel-agent
# echo "Changing api calls url from local to prod/dev domain"
# find ./src -type f -exec sed -i 's/0.0.0.0/<domain-name>/g' {} +
echo "Running travel-agent npm start on 3003"
npm run start -- -p 3003