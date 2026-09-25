# Stage 1: Build the application using Maven
FROM maven:3.9-eclipse-temurin-17 AS builder
WORKDIR /app

# Copy pom.xml and download dependencies for layer caching
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copy source code and package executable jar
COPY src ./src
RUN mvn clean package -DskipTests

# Stage 2: Lightweight runtime image
FROM eclipse-temurin:17-jre-jammy
WORKDIR /app

# Add non-root application user for container security
RUN groupadd -r spring && useradd -r -g spring spring
USER spring:spring

COPY --from=builder /app/target/talentbridge-backend-1.0.0.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-Djava.security.egd=file:/dev/./urandom", "-jar", "app.jar"]
