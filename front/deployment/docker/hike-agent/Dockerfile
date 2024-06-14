FROM node:20-alpine

ARG build_type="production"
    
RUN mkdir -p /opt/hike-agent
WORKDIR /opt/hike-agent

# Install dependencies
COPY ./package.json /opt/hike-agent

RUN npm install

# Add rest of the client code
COPY . /opt/hike-agent

ENV NEXT_PUBLIC_NODE_ENV=$build_type
ENV NEXT_TELEMETRY_DISABLED 1

# build
RUN npm run build

RUN chmod u+x entrypoint.sh

RUN export NODE_OPTIONS="--max-old-space-size=8192"

# CMD start
CMD ["./entrypoint.sh"]