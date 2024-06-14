#!/bin/sh
cd /opt/admin
# echo "Changing api calls url from local to prod/dev domain"
# find ./src -type f -exec sed -i 's/0.0.0.0/<domain-name>/g' {} +
echo "Running admin npm start on 3001"
npm run start -- -p 3001