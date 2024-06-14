FROM node:20-alpine

RUN apk --no-cache add curl

ARG build_type="development"
    
RUN mkdir -p /opt/api/ms-hikes
WORKDIR /opt/api/ms-hikes

# Install dependencies
COPY ./package.json /opt/api/ms-hikes

RUN npm install

# Add rest of the client code
COPY . /opt/api/ms-hikes

RUN echo "Build Type $build_type"
ENV NODE_ENV=$build_type

RUN chmod u+x entrypoint.sh

RUN export NODE_OPTIONS="--max-old-space-size=8192"

# CMD start
CMD ["./entrypoint.sh"]