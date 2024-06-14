FROM node:20-alpine

RUN apk --no-cache add curl

ARG build_type="production"
    
RUN mkdir -p /opt/api/ms-travels
WORKDIR /opt/api/ms-travels

# Install dependencies
COPY ./package.json /opt/api/ms-travels

RUN npm install

# Add rest of the client code
COPY . /opt/api/ms-travels

RUN echo "Build Type $build_type"
ENV NODE_ENV=$build_type

# build
RUN npm run build

RUN chmod u+x entrypoint.sh

RUN export NODE_OPTIONS="--max-old-space-size=8192"

# CMD start
CMD ["./entrypoint.sh"]