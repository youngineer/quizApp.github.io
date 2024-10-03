# Importing JDK and copying required files
FROM openjdk:21-jdk AS build
WORKDIR /app
COPY pom.xml .
COPY src src

# Copy Maven wrapper
COPY mvnw .
COPY .mvn .mvn

# Set execution permission for the Maven wrapper
RUN chmod +x ./mvnw
RUN ./mvnw clean package -DskipTests

# Stage 2: Create the final Docker image using OpenJDK 19
FROM openjdk:21-jdk
VOLUME /tmp

# Copy the JAR from the build stage
COPY --from=build /app/target/*.jar app.jar
ENTRYPOINT ["java","-jar","/app.jar"]
EXPOSE 8080

# Use a suitable base image that supports JDK 21
#FROM openjdk:21-slim
#
## Set a volume pointing to /tmp
#VOLUME /tmp
#
## Make sure the JAR file name matches the one generated by your Maven project
#COPY target/quiz-0.0.1-SNAPSHOT.jar quiz-app.jar
#
## Specify the entrypoint to run your application
#ENTRYPOINT ["java", "-jar", "/quiz-app.jar"]
