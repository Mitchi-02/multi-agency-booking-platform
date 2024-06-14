FROM node:20-alpine

RUN apk --no-cache add curl

ARG build_type="production"
    
RUN mkdir -p /opt/api/ms-requests
WORKDIR /opt/api/ms-requests

# Install dependencies
COPY ./package.json /opt/api/ms-requests

RUN npm install

# Add rest of the client code
COPY . /opt/api/ms-requests

RUN echo "Build Type $build_type"
ENV NODE_ENV=$build_type

# build
RUN npm run build

RUN chmod u+x entrypoint.sh

RUN export NODE_OPTIONS="--max-old-space-size=8192"

# CMD start
CMD ["./entrypoint.sh"]