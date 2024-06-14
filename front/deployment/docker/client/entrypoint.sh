#!/bin/sh
cd /opt/client
# echo "Changing api calls url from local to prod/dev domain"
# find ./src -type f -exec sed -i 's/0.0.0.0/<domain-name>/g' {} +
echo "Running client npm start on 3000"
npm run start -- -p 3000