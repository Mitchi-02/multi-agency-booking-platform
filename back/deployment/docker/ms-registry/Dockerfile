FROM maven:3.9.6-amazoncorretto-17-al2023
RUN dnf install -y inotify-tools

WORKDIR /app
 
COPY .mvn/ .mvn
COPY mvnw pom.xml ./

COPY src ./src
RUN mvn dependency:go-offline

COPY entrypoint.sh .
RUN chmod +x entrypoint.sh
 
CMD ["./entrypoint.sh"]