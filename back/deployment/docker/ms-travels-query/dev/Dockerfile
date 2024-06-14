FROM node:20-alpine

RUN apk --no-cache add curl

ARG build_type="development"
    
RUN mkdir -p /opt/api/ms-travels-query
WORKDIR /opt/api/ms-travels-query

# Install dependencies
COPY ./package.json /opt/api/ms-travels-query

RUN npm install

# Add rest of the client code
COPY . /opt/api/ms-travels-query

RUN echo "Build Type $build_type"
ENV NODE_ENV=$build_type

RUN chmod u+x entrypoint.sh

RUN export NODE_OPTIONS="--max-old-space-size=8192"

# CMD start
CMD ["./entrypoint.sh"]