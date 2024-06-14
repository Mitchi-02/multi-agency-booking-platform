FROM node:20-alpine

ARG build_type="production"
    
RUN mkdir -p /opt/admin
WORKDIR /opt/admin

# Install dependencies
COPY ./package.json /opt/admin

RUN npm install

# Add rest of the client code
COPY . /opt/admin

RUN echo "Build Type $build_type"
ENV NEXT_PUBLIC_NODE_ENV=$build_type
ENV NEXT_TELEMETRY_DISABLED 1

# build
RUN npm run build

RUN chmod u+x entrypoint.sh

RUN export NODE_OPTIONS="--max-old-space-size=8192"

# CMD start
CMD ["./entrypoint.sh"]